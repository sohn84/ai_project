import { useState } from "react";
import { motion } from "motion/react";
import { X, Plus } from "lucide-react";

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  onCancel: () => void;
  packageTitle: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  passportNumber: string;
  travelers: number;
  agreeTerms: boolean;
  agreeCancellation: boolean;
}

interface Traveler {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  hasCompleteInfo: boolean;
}

// 목업 저장된 여행자 목록
const savedTravelers: Traveler[] = [
  {
    id: "1",
    name: "김하나",
    birthDate: "1990.12.25",
    gender: "여",
    hasCompleteInfo: false,
  },
];

export function BookingForm({
  onSubmit,
  onCancel,
  packageTitle,
}: BookingFormProps) {
  const [selectedTravelers, setSelectedTravelers] = useState<
    string[]
  >([]);

  const handleTravelerToggle = (travelerId: string) => {
    setSelectedTravelers((prev) =>
      prev.includes(travelerId)
        ? prev.filter((id) => id !== travelerId)
        : [...prev, travelerId],
    );
  };

  const handleSubmit = () => {
    if (selectedTravelers.length > 0) {
      // 임시로 첫 번째 여행자 정보로 제출
      const firstTraveler = savedTravelers.find(
        (t) => t.id === selectedTravelers[0],
      );
      onSubmit({
        name: firstTraveler?.name || "",
        phone: "010-1234-5678",
        email: "example@email.com",
        birthDate:
          firstTraveler?.birthDate.replace(/\./g, "-") || "",
        passportNumber: "",
        travelers: selectedTravelers.length,
        agreeTerms: true,
        agreeCancellation: true,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300,
        }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-[24px] pb-24"
      >
        <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">
            예약 정보 입력
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="bg-[#f5f5f5] rounded-[12px] p-4 mb-6">
            <p className="text-[13px] text-[#666] mb-1">
              선택 상품
            </p>
            <p className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
              {packageTitle}
            </p>
          </div>

          {/* 여행자 목록 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">
                여행자 목록
              </h3>
              <span className="text-[14px] text-[#7b3ff2]">
                총 {savedTravelers.length}건
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {savedTravelers.map((traveler) => (
                <label
                  key={traveler.id}
                  className="flex items-start gap-3 p-4 bg-white border-2 border-[#e5e7eb] rounded-[12px] cursor-pointer hover:border-[#7b3ff2] transition-colors"
                  style={{
                    borderColor: selectedTravelers.includes(
                      traveler.id,
                    )
                      ? "#7b3ff2"
                      : "#e5e7eb",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedTravelers.includes(
                      traveler.id,
                    )}
                    onChange={() =>
                      handleTravelerToggle(traveler.id)
                    }
                    className="mt-1 size-5 rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
                        {traveler.name}
                      </span>
                      <span className="px-2 py-0.5 bg-[#e9e5fb] text-[#7b3ff2] text-[11px] rounded-[4px]">
                        나이정보
                      </span>
                    </div>
                    <p className="text-[13px] text-[#666] mb-1">
                      등록 정보 없음 | {traveler.birthDate} |{" "}
                      {traveler.gender}
                    </p>
                    {!traveler.hasCompleteInfo && (
                      <p className="text-[13px] text-[#ff6b6b]">
                        여권 정보 등록 필요함
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>

            {/* 새로운 여행자 등록하기 버튼 */}
            <button
              type="button"
              className="w-full py-4 border-2 border-[#e5e7eb] rounded-[12px] flex items-center justify-center gap-2 text-[15px] text-[#111] font-['Pretendard:SemiBold',sans-serif] hover:border-[#7b3ff2] hover:text-[#7b3ff2] transition-colors"
            >
              <Plus className="size-5" />
              새로운 여행자 등록하기
            </button>
          </div>
        </div>

        {/* Fixed 하단 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#f0f0f0] p-5 max-w-[390px] mx-auto">
          <button
            onClick={handleSubmit}
            disabled={selectedTravelers.length === 0}
            className="w-full py-4 bg-[#7b3ff2] text-white rounded-[12px] text-[16px] font-['Pretendard:Bold',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
          >
            {selectedTravelers.length > 0
              ? `${selectedTravelers.length}명 선택 완료 결제 진행하기`
              : "여행자를 선택해주세요"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}