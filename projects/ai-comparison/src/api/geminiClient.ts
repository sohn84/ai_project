/**
 * Gemini API Client with Function Calling (Vertex AI)
 * 여행 상품 검색을 위한 대화형 Slot Filling 지원
 */

const VERTEX_API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
const PROJECT_ID = import.meta.env.VITE_VERTEX_PROJECT_ID || 'your-project-id';
const LOCATION = import.meta.env.VITE_VERTEX_LOCATION || 'us-central1';
const MODEL_ID = 'gemini-2.0-flash';

// Vertex AI REST API endpoint
const VERTEX_API_URL = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:generateContent`;

if (!VERTEX_API_KEY) {
  console.warn('VITE_GOOGLE_AI_API_KEY is not set. Gemini features will be disabled.');
}

// 시스템 프롬프트
const SYSTEM_PROMPT = `당신은 하나투어 AI 여행 컨시어지입니다.
사용자가 여행 상품을 검색하면 상품을 추천합니다.
사용자의 질문에서 필수 정보가 누락되면 친절하게 재질문하세요.
모든 정보가 충족되면 MCP 도구를 호출하여 상품을 검색합니다.

## 검색 유형별 필수 정보:
- 패키지 (search_travel_package_products): 도시, 출발일, 귀국일
- 호텔 (search_hotel_products): 국가, 도시, 체크인, 체크아웃, 성인 수
- 항공 (search_air_products): 국가, 도시, 출발일, 귀국일, 성인 탑승객 수

## 중요 규칙 - 파라미터 형식:
1. **날짜 형식**: 반드시 YYYYMMDD 형식 (예: 20260130)
2. **도시/국가명**: 반드시 한글로 입력 (예: "Japan" (X) → "일본" (O), "Tokyo" (X) → "도쿄" (O))
3. **서울 출발**: 항공권은 서울(SEL) 출발 왕복만 지원

## 도시-국가 매핑 (참고):
- 일본: 도쿄, 오사카, 교토, 후쿠오카
- 태국: 방콕, 푸켓
- 베트남: 다낭, 나트랑
- 인도네시아: 발리
- 싱가포르: 싱가포르
- 필리핀: 세부, 보라카이
- 미국: 하와이(호놀룰루), 괌
- 홍콩: 홍콩
- 대만: 타이베이
- 한국: 제주

## 대화 규칙:
1. 도시가 없으면: "어떤 도시로 여행을 계획하고 계신가요?"
2. 날짜가 없으면: "언제 출발하실 예정인가요? (예: 1월 15일부터 20일까지)"
3. 호텔/항공 검색인데 인원이 없으면: "몇 분이 함께 여행하시나요?"
4. 모든 필수 정보가 채워지면 해당 검색 함수 호출
5. 검색 의도가 불분명하면: "패키지, 호텔, 항공권 중 어떤 상품을 찾고 계신가요?"

## 날짜 파싱:
- "다음주", "이번 주말", "내년 1월" 등 상대적 표현도 이해하세요
- 날짜는 반드시 YYYYMMDD 형식으로 변환하세요 (예: 20260115)
- 오늘 날짜를 기준으로 계산하세요
- "3박4일", "4박5일" 등 여행 기간도 파싱하세요

응답은 반드시 한국어로 하세요. 친절하고 자연스럽게 대화하세요.`;

// MCP 도구 정의 (Vertex AI 형식)
const toolDeclarations = [
  {
    name: 'search_travel_package_products',
    description: '여행 패키지 상품을 검색합니다. 도시, 출발일, 귀국일이 필수입니다.',
    parameters: {
      type: 'OBJECT',
      properties: {
        city: {
          type: 'STRING',
          description: '여행 도시 (한글 필수, 예: 도쿄, 오사카, 방콕, 발리)',
        },
        startDate: {
          type: 'STRING',
          description: '출발일 (YYYYMMDD 형식, 예: 20260115)',
        },
        endDate: {
          type: 'STRING',
          description: '귀국일 (YYYYMMDD 형식, 예: 20260120)',
        },
        yearMonth: {
          type: 'STRING',
          description: '년월 기준 검색 (선택, YYYYMM 형식, 예: 202601)',
        },
        travelDays: {
          type: 'NUMBER',
          description: '여행 일수 (선택, 예: 4)',
        },
        priceRange: {
          type: 'STRING',
          description: '가격대 (선택, 예: 1000000-2000000)',
        },
      },
      required: ['city', 'startDate', 'endDate'],
    },
  },
  {
    name: 'search_hotel_products',
    description: '호텔 상품을 검색합니다. 국가, 도시, 날짜, 인원이 모두 필요합니다.',
    parameters: {
      type: 'OBJECT',
      properties: {
        country: {
          type: 'STRING',
          description: '국가명 (한글 필수, 예: 일본, 태국, 베트남)',
        },
        city: {
          type: 'STRING',
          description: '도시명 (한글 필수, 예: 도쿄, 방콕, 다낭)',
        },
        startDate: {
          type: 'STRING',
          description: '체크인 날짜 (YYYYMMDD 형식, 예: 20260115)',
        },
        endDate: {
          type: 'STRING',
          description: '체크아웃 날짜 (YYYYMMDD 형식, 예: 20260120)',
        },
        adultCount: {
          type: 'NUMBER',
          description: '성인 인원 수 (기본값: 2)',
        },
        fareId: {
          type: 'STRING',
          description: '항공권과 연동 시 사용 (선택, search_air_products 결과의 fareId)',
        },
        grades: {
          type: 'STRING',
          description: '호텔 등급 필터 (선택, 쉼표로 구분, 예: 4,5)',
        },
        hasBreakfast: {
          type: 'BOOLEAN',
          description: '조식 포함 여부 (선택)',
        },
        rating: {
          type: 'STRING',
          description: '평점 필터 (선택, 예: 8.0)',
        },
        sort: {
          type: 'STRING',
          description: '정렬 기준 (선택, RECOMMENDED 또는 LOWEST_PRICE)',
        },
      },
      required: ['country', 'city', 'startDate', 'endDate', 'adultCount'],
    },
  },
  {
    name: 'search_air_products',
    description: '항공권을 검색합니다. 서울(SEL) 출발 왕복만 지원합니다. 국가, 도시, 날짜, 인원이 필요합니다.',
    parameters: {
      type: 'OBJECT',
      properties: {
        country: {
          type: 'STRING',
          description: '도착 국가 (한글 필수, 예: 일본, 태국, 베트남)',
        },
        city: {
          type: 'STRING',
          description: '도착 도시 (한글 필수, 예: 도쿄, 방콕, 다낭)',
        },
        startDate: {
          type: 'STRING',
          description: '출발일 (YYYYMMDD 형식, 예: 20260115)',
        },
        endDate: {
          type: 'STRING',
          description: '귀국일 (YYYYMMDD 형식, 예: 20260120)',
        },
        adultPassengerCount: {
          type: 'NUMBER',
          description: '성인 탑승객 수 (기본값: 2)',
        },
        airlineName: {
          type: 'STRING',
          description: '항공사 필터 (선택, 예: 대한항공)',
        },
        hasFreeBaggage: {
          type: 'BOOLEAN',
          description: '무료 수하물 포함 여부 (선택)',
        },
        isDirect: {
          type: 'BOOLEAN',
          description: '직항 여부 (선택)',
        },
        sort: {
          type: 'STRING',
          description: '정렬 기준 (선택, RECOMMENDED, LOWEST_PRICE, DEPARTURE_DATE_ASC)',
        },
      },
      required: ['country', 'city', 'startDate', 'endDate', 'adultPassengerCount'],
    },
  },
];

// Gemini 응답 타입
export interface GeminiResponse {
  type: 'text' | 'function_call';
  text?: string;
  functionCall?: {
    name: string;
    args: Record<string, unknown>;
  };
}

// 대화 히스토리 타입
export interface ChatMessage {
  role: 'user' | 'model' | 'function';
  parts: Array<{
    text?: string;
    functionCall?: { name: string; args: Record<string, unknown> };
    functionResponse?: { name: string; response: unknown };
  }>;
}

export type ChatHistory = ChatMessage[];

/**
 * Vertex AI REST API 호출
 */
async function callVertexAI(contents: ChatMessage[]): Promise<unknown> {
  const requestBody = {
    contents,
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    tools: [{ functionDeclarations: toolDeclarations }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  };

  const response = await fetch(`${VERTEX_API_URL}?key=${VERTEX_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Vertex AI Error:', errorText);
    throw new Error(`Vertex AI request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Gemini에 메시지 전송 및 응답 받기
 */
export async function sendMessage(
  userMessage: string,
  history: ChatHistory = []
): Promise<{ response: GeminiResponse; updatedHistory: ChatHistory }> {
  // 대화 히스토리에 사용자 메시지 추가
  const userContent: ChatMessage = {
    role: 'user',
    parts: [{ text: userMessage }],
  };

  const contents = [...history, userContent];

  // Vertex AI 호출
  const result = await callVertexAI(contents) as {
    candidates?: Array<{
      content: {
        parts: Array<{
          text?: string;
          functionCall?: { name: string; args: Record<string, unknown> };
        }>;
      };
    }>;
  };

  const candidate = result.candidates?.[0];
  if (!candidate) {
    throw new Error('No response from Vertex AI');
  }

  const parts = candidate.content.parts;
  const updatedHistory: ChatHistory = [...contents];

  // Function Call 확인
  for (const part of parts) {
    if (part.functionCall) {
      const modelContent: ChatMessage = {
        role: 'model',
        parts: [{ functionCall: part.functionCall }],
      };
      updatedHistory.push(modelContent);

      return {
        response: {
          type: 'function_call',
          functionCall: {
            name: part.functionCall.name,
            args: part.functionCall.args,
          },
        },
        updatedHistory,
      };
    }
  }

  // 텍스트 응답
  const textPart = parts.find(p => p.text);
  const text = textPart?.text || '죄송합니다. 응답을 생성하지 못했습니다.';

  const modelContent: ChatMessage = {
    role: 'model',
    parts: [{ text }],
  };
  updatedHistory.push(modelContent);

  return {
    response: {
      type: 'text',
      text,
    },
    updatedHistory,
  };
}

/**
 * Function Call 결과를 Gemini에 전달
 */
export async function sendFunctionResult(
  functionName: string,
  result: unknown,
  history: ChatHistory
): Promise<{ response: string; updatedHistory: ChatHistory }> {
  // Function Response를 히스토리에 추가
  const functionResponse: ChatMessage = {
    role: 'function',
    parts: [{
      functionResponse: {
        name: functionName,
        response: result,
      },
    }],
  };

  const contents = [...history, functionResponse];

  // Vertex AI 호출
  const apiResult = await callVertexAI(contents) as {
    candidates?: Array<{
      content: {
        parts: Array<{ text?: string }>;
      };
    }>;
  };

  const candidate = apiResult.candidates?.[0];
  const text = candidate?.content.parts.find(p => p.text)?.text || '검색 결과를 처리하는 중 오류가 발생했습니다.';

  const modelContent: ChatMessage = {
    role: 'model',
    parts: [{ text }],
  };

  return {
    response: text,
    updatedHistory: [...contents, modelContent],
  };
}

/**
 * Gemini API 사용 가능 여부 확인
 */
export function isGeminiAvailable(): boolean {
  return !!VERTEX_API_KEY;
}
