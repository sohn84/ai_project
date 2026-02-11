import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export interface RoomType {
  id: string;
  name: string;
  bedType: string;
  capacity: string;
  size: string;
  price: number;
  amenities: string[];
}

interface RoomTypeSelectorProps {
  hotelName: string;
  roomTypes: RoomType[];
  onSelect: (roomType: RoomType) => void;
  onClose: () => void;
}

export function RoomTypeSelector({ hotelName, roomTypes, onSelect, onClose }: RoomTypeSelectorProps) {
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);

  const handleConfirm = () => {
    if (selectedRoomType) {
      onSelect(selectedRoomType);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end">
        {/* 배경 오버레이 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* 바텀시트 */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full max-w-[390px] mx-auto bg-white rounded-t-[24px] max-h-[85vh] overflow-hidden flex flex-col"
        >
          {/* 헤더 */}
          <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-5 py-4 flex items-center justify-between">
            <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">
              호텔 룸타입 선택
            </h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 hover:bg-[#f5f5f5] rounded-full transition-colors"
            >
              <X className="size-6 text-[#666]" />
            </button>
          </div>

          {/* 호텔명 */}
          <div className="px-5 pt-4 pb-3 bg-[#f9f9f9]">
            <p className="text-[14px] text-[#666] mb-1">숙소</p>
            <p className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111]">
              {hotelName}
            </p>
          </div>

          {/* 룸타입 목록 */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {roomTypes.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoomType(room)}
                className={`w-full text-left p-4 rounded-[16px] border-2 transition-all ${
                  selectedRoomType?.id === room.id
                    ? "border-[#7b3ff2] bg-[#f5f0ff]"
                    : "border-[#e5e5e5] bg-white hover:border-[#d0d0d0]"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] mb-1">
                      {room.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-[13px] text-[#666]">
                      <span>{room.bedType}</span>
                      <span>·</span>
                      <span>{room.capacity}</span>
                      <span>·</span>
                      <span>{room.size}</span>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#7b3ff2]">
                      +{room.price.toLocaleString()}원
                    </p>
                    <p className="text-[12px] text-[#999]">추가 요금</p>
                  </div>
                </div>

                {/* 편의시설 */}
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white rounded-[6px] text-[12px] text-[#666] border border-[#e5e5e5]"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* 선택 체크 표시 */}
                {selectedRoomType?.id === room.id && (
                  <div className="mt-3 flex items-center text-[#7b3ff2]">
                    <svg className="size-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[13px] font-['Pretendard:SemiBold',sans-serif]">선택됨</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* 하단 버튼 */}
          <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-4">
            <button
              onClick={handleConfirm}
              disabled={!selectedRoomType}
              className="w-full py-4 bg-[#7b3ff2] text-white rounded-[12px] font-['Pretendard:SemiBold',sans-serif] text-[16px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
            >
              {selectedRoomType ? `${selectedRoomType.name} 선택 완료` : "룸타입을 선택해주세요"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
