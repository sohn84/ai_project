import { useState } from "react";
import { motion } from "motion/react";

interface PreferenceInputProps {
  onSubmit: (data: { theme: string; budget: string; destination: string; travelers: number; searchMode?: 'combo' | 'flight' | 'hotel' }) => void;
  mode?: "package" | "fit"; // 패키지 또는 자유여행 모드
  initialDestination?: string;
  initialBudget?: string;
  initialTheme?: string;
  initialTravelers?: number;
}

export function PreferenceInput({ onSubmit, mode = "package", initialDestination = "", initialBudget = "", initialTheme = "", initialTravelers = 1 }: PreferenceInputProps) {
  const [theme, setTheme] = useState(initialTheme);
  const [budget, setBudget] = useState(initialBudget);
  const [destination, setDestination] = useState(initialDestination);
  const [travelers, setTravelers] = useState(initialTravelers);

  const [searchMode, setSearchMode] = useState<'combo' | 'flight' | 'hotel'>('combo');

  const themes = ["휴양", "문화탐방", "자연경관", "레저/액티비티", "쇼핑"];
  const budgets = ["100만원 이하", "100-200만원", "200-300만원", "300만원 이상"];

  const handleSubmit = (mode: 'combo' | 'flight' | 'hotel') => {
    if (budget && destination) {
      onSubmit({ theme: "", budget, destination, travelers, searchMode: mode });
    }
  };

  const handlePackageSubmit = () => {
    if (isValid) {
      onSubmit({ theme, budget, destination, travelers, searchMode: 'combo' });
    }
  };

  const isValid = mode === "fit" ? (budget && destination) : (theme && budget && destination);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[16px] p-5 shadow-sm border border-[#e5e5e5] mx-5 mb-4"
    >
      <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] mb-4">
        {mode === "fit" ? "자유여행 정보를 알려주세요" : "선호하시는 여행 정보를 알려주세요"}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-[14px] text-[#666] mb-2">여행지</label>
          <input
            type="text"
            placeholder="예: 발리, 파리, 도쿄"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-3 rounded-[12px] bg-[#f5f5f5] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#7b3ff2]"
            style={{
              outlineColor: mode === "fit" ? "#7b3ff2" : "#3780ff"
            }}
          />
        </div>

        {/* 패키지 모드일 때만 테마 선택 표시 */}
        {mode === "package" && (
          <div>
            <label className="block text-[14px] text-[#666] mb-2">여행 테마</label>
            <div className="flex flex-wrap gap-2">
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-full text-[14px] transition-colors ${theme === t
                      ? "bg-[#3780ff] text-white"
                      : "bg-[#f5f5f5] text-[#666] hover:bg-[#e5e5e5]"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-[14px] text-[#666] mb-2">예산 (1인 기준)</label>
          <div className="grid grid-cols-2 gap-2">
            {budgets.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`px-4 py-3 rounded-[12px] text-[14px] transition-colors ${budget === b
                    ? mode === "fit"
                      ? "bg-[#7b3ff2] text-white"
                      : "bg-[#3780ff] text-white"
                    : "bg-[#f5f5f5] text-[#666] hover:bg-[#e5e5e5]"
                  }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[14px] text-[#666] mb-2">몇명이 떠나시나요?</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTravelers(Math.max(1, travelers - 1))}
              className="size-10 rounded-full bg-[#f5f5f5] text-[#111] font-['Pretendard:SemiBold',sans-serif] text-[18px] hover:bg-[#e5e5e5] transition-colors flex items-center justify-center"
            >
              −
            </button>
            <div className="flex-1 text-center">
              <span className="text-[24px] font-['Pretendard:Bold',sans-serif] text-[#111]">
                {travelers}
              </span>
              <span className="text-[16px] text-[#666] ml-1">명</span>
            </div>
            <button
              onClick={() => setTravelers(Math.min(10, travelers + 1))}
              className="size-10 rounded-full bg-[#f5f5f5] text-[#111] font-['Pretendard:SemiBold',sans-serif] text-[18px] hover:bg-[#e5e5e5] transition-colors flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* 패키지 모드: 단일 버튼 */}
        {mode === "package" && (
          <button
            onClick={handlePackageSubmit}
            disabled={!isValid}
            className="w-full py-3 rounded-[12px] bg-[#3780ff] text-white font-['Pretendard:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2d6fdf] transition-colors"
          >
            여행 상품 추천받기
          </button>
        )}

        {/* 자유여행 모드: 3개 버튼 */}
        {mode === "fit" && (
          <div className="space-y-2">
            <button
              onClick={() => handleSubmit('combo')}
              disabled={!isValid}
              className="w-full py-3 rounded-[12px] bg-[#7b3ff2] text-white font-['Pretendard:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
            >
              항공+숙소 조합 검색하기
            </button>
            <button
              onClick={() => handleSubmit('flight')}
              disabled={!isValid}
              className="w-full py-3 rounded-[12px] bg-[#7b3ff2] text-white font-['Pretendard:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
            >
              항공만 검색하기
            </button>
            <button
              onClick={() => handleSubmit('hotel')}
              disabled={!isValid}
              className="w-full py-3 rounded-[12px] bg-[#7b3ff2] text-white font-['Pretendard:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
            >
              호텔만 검색하기
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}