import { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Loader2 } from 'lucide-react';
import Reception from '../../imports/Reception';
import { searchTravelPackageProducts, searchHotelProducts, searchAirProducts } from '../../api/mcpClient';
import { sendMessage, sendFunctionResult, isGeminiAvailable, ChatHistory } from '../../api/geminiClient';

// 전체 추천 질문 풀
const allSuggestedQuestions = [
  '발리 패키지 상품 검색해줘',
  '다낭 호텔 추천해줘',
  '도쿄행 항공권 찾아줘',
  '가족여행 패키지 있어?',
  '오사카 3박4일 상품',
  '방콕 자유여행 패키지',
  '제주도 호텔 검색',
  '싱가포르 여행 상품',
];

// 기본 날짜 생성 (YYYYMMDD 형식) - 함수 외부에서 사용
function getDefaultDatesForMcp() {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 7);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 14);

  const format = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  return { startDate: format(startDate), endDate: format(endDate) };
}

// MCP 함수 실행
async function executeMcpFunction(
  functionName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  console.log(`Executing MCP function: ${functionName}`, args);
  const dates = getDefaultDatesForMcp();

  switch (functionName) {
    case 'search_travel_package_products':
      return searchTravelPackageProducts({
        city: (args.city as string) || '도쿄',
        startDate: (args.startDate as string) || dates.startDate,
        endDate: (args.endDate as string) || dates.endDate,
        yearMonth: args.yearMonth as string | undefined,
        travelDays: args.travelDays as number | undefined,
        priceRange: args.priceRange as string | undefined,
      });

    case 'search_hotel_products':
      return searchHotelProducts({
        country: (args.country as string) || '일본',
        city: (args.city as string) || '도쿄',
        startDate: (args.startDate as string) || dates.startDate,
        endDate: (args.endDate as string) || dates.endDate,
        adultCount: args.adultCount as number | undefined,
        fareId: args.fareId as string | undefined,
        grades: args.grades as string | undefined,
        hasBreakfast: args.hasBreakfast as boolean | undefined,
        rating: args.rating as string | undefined,
      });

    case 'search_air_products':
      return searchAirProducts({
        country: (args.country as string) || '일본',
        city: (args.city as string) || '도쿄',
        startDate: (args.startDate as string) || dates.startDate,
        endDate: (args.endDate as string) || dates.endDate,
        adultPassengerCount: args.adultPassengerCount as number | undefined,
        airlineName: args.airlineName as string | undefined,
        isDirect: args.isDirect as boolean | undefined,
      });

    default:
      throw new Error(`Unknown function: ${functionName}`);
  }
}

// MCP 결과를 읽기 좋은 텍스트로 변환 (Gemini 없을 때 폴백용)
function formatMcpResult(result: unknown): string {
  if (!result) {
    return '검색 결과가 없습니다. 다른 조건으로 검색해보세요.';
  }

  if (Array.isArray(result)) {
    if (result.length === 0) {
      return '검색 결과가 없습니다. 다른 조건으로 검색해보세요.';
    }

    const items = result.slice(0, 3);
    let response = `${result.length}개의 상품을 찾았습니다.\n\n`;

    items.forEach((item: Record<string, unknown>, index: number) => {
      response += `📦 **상품 ${index + 1}**\n`;
      if (item.name || item.productName) response += `- 상품명: ${item.name || item.productName}\n`;
      if (item.price) response += `- 가격: ${Number(item.price).toLocaleString()}원\n`;
      if (item.duration) response += `- 일정: ${item.duration}\n`;
      if (item.hotel) response += `- 호텔: ${item.hotel}\n`;
      if (item.airline) response += `- 항공사: ${item.airline}\n`;
      response += '\n';
    });

    return response;
  }

  if (typeof result === 'object') {
    return JSON.stringify(result, null, 2);
  }

  return String(result);
}

export function AIConcierge() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai', text: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [displayedQuestions, setDisplayedQuestions] = useState<string[]>(allSuggestedQuestions.slice(0, 3));
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [chatHistory, setChatHistory] = useState<ChatHistory>([]);
  const [geminiEnabled] = useState(isGeminiAvailable());

  // Gemini를 통해 메시지 처리
  const processWithGemini = async (userInput: string): Promise<string> => {
    try {
      // Gemini에 메시지 전송
      const { response, updatedHistory } = await sendMessage(userInput, chatHistory);
      setChatHistory(updatedHistory);

      // 텍스트 응답인 경우 (재질문)
      if (response.type === 'text') {
        return response.text || '죄송합니다. 응답을 생성하지 못했습니다.';
      }

      // Function Call인 경우 (MCP 도구 실행)
      if (response.type === 'function_call' && response.functionCall) {
        const { name, args } = response.functionCall;

        try {
          // MCP 도구 실행
          const mcpResult = await executeMcpFunction(name, args);

          // 결과를 Gemini에 전달하여 자연스러운 응답 생성
          const { response: finalResponse, updatedHistory: finalHistory } = await sendFunctionResult(
            name,
            mcpResult,
            updatedHistory
          );
          setChatHistory(finalHistory);

          return finalResponse;
        } catch (mcpError) {
          console.error('MCP 실행 오류:', mcpError);
          return `상품 검색 중 오류가 발생했습니다: ${mcpError instanceof Error ? mcpError.message : '알 수 없는 오류'}`;
        }
      }

      return '죄송합니다. 요청을 처리하지 못했습니다.';
    } catch (error) {
      console.error('Gemini 처리 오류:', error);
      throw error;
    }
  };

  // 도시-국가 매핑 (한글 필수)
  const cityCountryMap: Record<string, { city: string; country: string }> = {
    '발리': { city: '발리', country: '인도네시아' },
    '다낭': { city: '다낭', country: '베트남' },
    '도쿄': { city: '도쿄', country: '일본' },
    '오사카': { city: '오사카', country: '일본' },
    '방콕': { city: '방콕', country: '태국' },
    '싱가포르': { city: '싱가포르', country: '싱가포르' },
    '제주': { city: '제주', country: '한국' },
    '파리': { city: '파리', country: '프랑스' },
    '런던': { city: '런던', country: '영국' },
    '하와이': { city: '호놀룰루', country: '미국' },
    '괌': { city: '괌', country: '미국' },
    '세부': { city: '세부', country: '필리핀' },
    '보라카이': { city: '보라카이', country: '필리핀' },
    '푸켓': { city: '푸켓', country: '태국' },
    '나트랑': { city: '나트랑', country: '베트남' },
    '홍콩': { city: '홍콩', country: '홍콩' },
    '타이베이': { city: '타이베이', country: '대만' },
    '교토': { city: '교토', country: '일본' },
    '후쿠오카': { city: '후쿠오카', country: '일본' },
  };

  // 도시 추출 함수
  const extractCityInfo = (input: string): { city: string; country: string } => {
    for (const [keyword, info] of Object.entries(cityCountryMap)) {
      if (input.includes(keyword)) {
        return info;
      }
    }
    // 기본값: 도쿄
    return { city: '도쿄', country: '일본' };
  };

  // 기본 날짜 생성 (YYYYMMDD 형식)
  const getDefaultDatesYYYYMMDD = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 7);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 14);

    const format = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    return { startDate: format(startDate), endDate: format(endDate) };
  };

  // 폴백: Gemini 없이 직접 MCP 호출 (기존 로직)
  const processWithoutGemini = async (userInput: string): Promise<string> => {
    const lowerInput = userInput.toLowerCase();
    const { city, country } = extractCityInfo(userInput);
    const dates = getDefaultDatesYYYYMMDD();

    // 간단한 키워드 기반 분류
    let result: unknown;

    if (lowerInput.includes('호텔') || lowerInput.includes('숙소')) {
      result = await searchHotelProducts({
        country,
        city,
        startDate: dates.startDate,
        endDate: dates.endDate,
      });
    } else if (lowerInput.includes('항공') || lowerInput.includes('비행기') || lowerInput.includes('항공권')) {
      result = await searchAirProducts({
        country,
        city,
        startDate: dates.startDate,
        endDate: dates.endDate,
      });
    } else {
      // 기본: 패키지 검색
      result = await searchTravelPackageProducts({
        city,
        startDate: dates.startDate,
        endDate: dates.endDate,
      });
    }

    return formatMcpResult(result);
  };

  // 메시지 처리 (Gemini 또는 폴백)
  const processUserMessage = async (userInput: string): Promise<string> => {
    if (geminiEnabled) {
      try {
        return await processWithGemini(userInput);
      } catch (error) {
        console.warn('Gemini 실패, 폴백 사용:', error);
        return processWithoutGemini(userInput);
      }
    }
    return processWithoutGemini(userInput);
  };

  const handleQuestionClick = async (question: string) => {
    setMessages(prev => [...prev, { type: 'user', text: question }]);
    setIsGenerating(true);

    // 사용한 질문 추가
    setUsedQuestions(prev => new Set([...prev, question]));

    // 사용하지 않은 질문들 중에서 새로운 질문 선택
    const availableQuestions = allSuggestedQuestions.filter(
      q => !usedQuestions.has(q) && q !== question && !displayedQuestions.includes(q)
    );

    // 표시된 질문 업데이트
    setDisplayedQuestions(prev => {
      const newQuestions = prev.filter(q => q !== question);
      if (availableQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        newQuestions.push(availableQuestions[randomIndex]);
      }
      return newQuestions;
    });

    // 메시지 처리
    const response = await processUserMessage(question);
    setMessages(prev => [...prev, { type: 'ai', text: response }]);
    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userInput = inputValue;
    setMessages(prev => [...prev, { type: 'user', text: userInput }]);
    setInputValue('');
    setIsGenerating(true);

    // 메시지 처리
    const response = await processUserMessage(userInput);
    setMessages(prev => [...prev, { type: 'ai', text: response }]);
    setIsGenerating(false);
  };

  const handleClearChat = () => {
    setMessages([]);
    setInputValue('');
    setChatHistory([]); // 대화 히스토리도 초기화
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section className="relative border-t border-gray-200 pt-[10px] bg-[radial-gradient(ellipse_46.67%_54.33%_at_50.00%_53.33%,_#EED6FF_0%,_#F7F5FE_100%)] flex flex-col min-h-[400px]">
      <div ref={chatContainerRef} className="max-w-5xl mx-auto w-full pb-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center mb-[60px] text-center mt-[48px] mx-[0px] my-[48px]">
            <h2 className="text-2xl text-gray-900 flex flex-col items-center gap-3">
              <span className="w-[30px] h-[30px]">
                <Reception />
              </span>
              <span className="text-[18px]">AI 컨시어지에게<br />무엇이든 물어보세요</span>
            </h2>
          </div>
        )}

        {messages.length === 0 && (
          <p className="text-sm text-gray-500 mb-[8px] mr-[24px] ml-[24px]">
            여행지, 호텔, 항공권 등 원하는 상품을 검색해보세요
            {!geminiEnabled && <span className="text-orange-500 ml-2">(AI 모드 비활성)</span>}
          </p>
        )}

        {/* Messages Display */}
        {messages.length > 0 && (
          <div className="mb-[10px] space-y-4 bg-transparent rounded-xl">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-3 text-sm ml-[24px] whitespace-pre-wrap ${
                    message.type === 'user'
                      ? 'bg-[#7B3FF2] mr-[24px] text-white rounded-[1.5rem_1.5rem_0_1.5rem]'
                      : 'bg-white border border-gray-200 text-gray-900 rounded-[0_1.5rem_1.5rem_1.5rem]'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-3 py-3 text-sm ml-[24px] bg-white border border-gray-200 text-gray-900 rounded-[0_1.5rem_1.5rem_1.5rem]">
                  <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                  {geminiEnabled ? 'AI가 응답을 생성하고 있습니다...' : '상품을 검색하고 있습니다...'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Suggested Questions */}
        {!isGenerating && (
          <div className="flex flex-nowrap gap-3 mb-[60px] overflow-x-auto scrollbar-hide py-[2px] ml-[24px]">
            {displayedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="flex-shrink-0 px-[16px] py-[8px] border-1 border-white shadow-[0px_2px_3px_0px_rgba(0,0,0,0.10)] text-[#7B3FF2] rounded-full bg-white/50 hover:bg-white/80 text-sm"
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input Form - Fixed at bottom */}
      <form onSubmit={handleSubmit} className={`flex-shrink-0 bg-[#F7F5FE] pt-4 pb-4 px-[24px] text-m border-t border-transparent flex items-center gap-3 ${messages.length > 0 ? 'shadow-[0_-2px_6px_rgba(0,0,0,0.06)]' : ''} max-w-5xl mx-auto w-full`}>
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={handleClearChat}
            className="flex-shrink-0 p-2 text-gray-500 border border-gray-300 rounded-full"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <span className="text-xs text-gray-400">채팅삭제</span>
        </div>
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="예: 발리 패키지 상품 검색해줘"
            className="w-full px-4 py-3 pr-14 border bg-gray-200 border-gray-300 rounded-full focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#7B3FF2] focus:border-transparent font-sm"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-[#7B3FF2] rounded-lg disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </section>
  );
}
