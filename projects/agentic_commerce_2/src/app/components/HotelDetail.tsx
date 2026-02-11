import { motion } from "motion/react";
import { X, Building2, MapPin, Users, Star, Wifi, Coffee, Utensils, Dumbbell } from "lucide-react";
import { HotelData } from "./HotelCard";

interface HotelDetailProps {
  hotel: HotelData;
  onClose: () => void;
  onBooking: () => void;
}

export function HotelDetail({ hotel, onClose, onBooking }: HotelDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="bg-white w-full max-w-[390px] mx-auto rounded-t-[24px] max-h-[85vh] overflow-y-auto"
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">
            숙소 상세 정보
          </h2>
          <button onClick={onClose} className="p-2 -mr-2">
            <X className="size-6 text-[#666]" />
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="px-5 py-6">
          {/* 숙소 이미지 */}
          {hotel.image && (
            <div className="w-full h-[200px] bg-gray-200 rounded-[16px] mb-4 overflow-hidden">
              <img 
                src={hotel.image} 
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 호텔명 & 등급 */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="size-5 text-[#7b3ff2]" />
              <span className="text-[13px] text-[#7b3ff2] font-['Pretendard:SemiBold',sans-serif]">
                {hotel.grade}
              </span>
            </div>
            <h3 className="font-['Pretendard:Bold',sans-serif] text-[20px] text-[#111] mb-2">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 mb-3">
              <MapPin className="size-4 text-[#666]" />
              <span className="text-[14px] text-[#666]">{hotel.location}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="size-4 text-[#ffa500] fill-[#ffa500]" />
                <span className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">
                  4.8
                </span>
              </div>
              <span className="text-[13px] text-[#999]">(리뷰 152개)</span>
            </div>
          </div>

          {/* 객실 정보 */}
          <div className="bg-[#f8f9fa] rounded-[16px] p-4 mb-4">
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3">
              객실 정보
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#666]">객실 타입</span>
                <span className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">
                  {hotel.roomType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#666]">기준 인원</span>
                <div className="flex items-center gap-1">
                  <Users className="size-4 text-[#7b3ff2]" />
                  <span className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">
                    {hotel.passengerCount}명
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 편의시설 */}
          <div className="mb-4">
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3">
              편의시설
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-[12px] p-3">
                <Wifi className="size-5 text-[#7b3ff2]" />
                <span className="text-[13px] text-[#111]">무료 Wi-Fi</span>
              </div>
              <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-[12px] p-3">
                <Coffee className="size-5 text-[#7b3ff2]" />
                <span className="text-[13px] text-[#111]">조식 포함</span>
              </div>
              <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-[12px] p-3">
                <Utensils className="size-5 text-[#7b3ff2]" />
                <span className="text-[13px] text-[#111]">레스토랑</span>
              </div>
              <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-[12px] p-3">
                <Dumbbell className="size-5 text-[#7b3ff2]" />
                <span className="text-[13px] text-[#111]">피트니스</span>
              </div>
            </div>
          </div>

          {/* 숙소 특징 */}
          <div className="mb-4">
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3">
              숙소 특징
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1">•</span>
                <span className="text-[14px] text-[#666] leading-[1.6]">
                  주요 관광지와 가까운 최적의 위치
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1">•</span>
                <span className="text-[14px] text-[#666] leading-[1.6]">
                  모던하고 깨끗한 객실 환경
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1">•</span>
                <span className="text-[14px] text-[#666] leading-[1.6]">
                  친절한 다국어 서비스 제공
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1">•</span>
                <span className="text-[14px] text-[#666] leading-[1.6]">
                  24시간 프론트 데스크 운영
                </span>
              </li>
            </ul>
          </div>

          {/* 가격 정보 */}
          <div className="bg-[#f8f4ff] rounded-[16px] p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-[#666] mb-1">
                  {hotel.passengerCount}인 기준
                </p>
                <p className="font-['Pretendard:Bold',sans-serif] text-[24px] text-[#7b3ff2]">
                  {hotel.price.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 예약 버튼 */}
        <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-4">
          <button
            onClick={onBooking}
            className="w-full py-4 bg-[#7b3ff2] text-white rounded-[12px] text-[16px] font-['Pretendard:Bold',sans-serif] hover:bg-[#6930d9] transition-colors"
          >
            이 숙소로 예약하기
          </button>
        </div>
      </motion.div>
    </div>
  );
}
