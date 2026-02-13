import { motion } from "motion/react";
import { Plane, Building2, Clock, Users } from "lucide-react";

export interface FITPackageData {
  id: string;
  flightInfo: {
    airline: string;
    departure: string;
    arrival: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    seatClass: string;
    flightDuration: string;
  };
  hotelInfo: {
    name: string;
    grade: string;
    location: string;
    roomType: string;
    price: number;
  };
  totalPrice: number;
  duration: string;
  destination: string;
  passengerCount: number;
  recommendReason: string;
}

interface FITPackageCardProps {
  package: FITPackageData;
  rank: number;
  onClick: () => void;
  onBooking: () => void;
}

export function FITPackageCard({
  package: pkg,
  rank,
  onClick,
  onBooking,
}: FITPackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="bg-white rounded-[16px] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] overflow-hidden"
    >
      <div className="p-4">
        {/* 순위 배지 */}
        <div className="flex items-center gap-2 mb-3">
          <div className="size-6 rounded-full bg-gradient-to-br from-[#7b3ff2] to-[#b794f6] flex items-center justify-center">
            <span className="text-white text-[13px] font-['Pretendard:Bold',sans-serif]">
              {rank}
            </span>
          </div>
          <span className="text-[13px] text-[#7b3ff2] font-['Pretendard:Bold',sans-serif]">
            AI 추천 조합
          </span>
        </div>

        {/* AI 추천 이유 */}
        <div className="flex gap-2 bg-[#f5f0ff] rounded-[8px] px-3 py-2.5 mb-3">
          <span className="shrink-0 w-[3px] self-stretch rounded-full bg-[#7b3ff2]" />
          <p className="text-[13px] leading-[1.5] text-[#555] line-clamp-2">
            {pkg.recommendReason}
          </p>
        </div>

        {/* 항공 정보 */}
        <div className="bg-[#f8f9fa] rounded-[12px] p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Plane className="size-4 text-[#7b3ff2]" />
            <span className="text-[13px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">
              항공
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">
                {pkg.flightInfo.departure}
              </span>
              <svg
                className="size-4 text-[#666]"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">
                {pkg.flightInfo.arrival}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[12px] text-[#666]">
              {pkg.flightInfo.airline}
            </span>
            <span className="text-[12px] text-[#666]">|</span>
            <span className="text-[12px] text-[#666]">
              {pkg.flightInfo.seatClass}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[12px] text-[#666]">
              {pkg.flightInfo.departureTime} →{" "}
              {pkg.flightInfo.arrivalTime}
            </span>
            <span className="text-[12px] text-[#666]">|</span>
            <span className="text-[12px] text-[#666]">
              {pkg.flightInfo.flightDuration}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#999] mr-1">
              {pkg.passengerCount}인 기준
            </span>
            <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#7b3ff2]">
              {pkg.flightInfo.price.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 숙소 정보 */}
        <div className="bg-[#f8f9fa] rounded-[12px] p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="size-4 text-[#7b3ff2]" />
            <span className="text-[13px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">
              숙소
            </span>
          </div>
          <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-1">
            {pkg.hotelInfo.name}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] text-[#7b3ff2]">
              {pkg.hotelInfo.grade}
            </span>
            <span className="text-[12px] text-[#666]">|</span>
            <span className="text-[12px] text-[#666]">
              {pkg.hotelInfo.location}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#666]">
              {pkg.hotelInfo.roomType}
            </span>
            <div className="text-right">
              <span className="text-[11px] text-[#999] mr-1">
                {pkg.passengerCount}인 기준
              </span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#7b3ff2]">
                {pkg.hotelInfo.price.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 여행 기간 */}
        <div className="flex items-center gap-4 mb-3 px-2">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-[#666]" />
            <span className="text-[13px] text-[#666]">
              {pkg.duration}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4 text-[#666]" />
            <span className="text-[13px] text-[#666]">
              성인 {pkg.passengerCount}인 기준
            </span>
          </div>
        </div>

        {/* 총 가격 */}
        <div className="border-t border-[#f0f0f0] pt-3 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#666]">
              총 예상 금액
            </span>
            <div className="text-right">
              <span className="font-['Pretendard:Bold',sans-serif] text-[20px] text-[#111]">
                {pkg.totalPrice.toLocaleString()}
              </span>
              <span className="text-[14px] text-[#666]">
                원
              </span>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="flex-1 py-3 bg-white border border-[#e5e7eb] text-[#111] rounded-[10px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f8f9fa] transition-colors"
          >
            상세보기
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBooking();
            }}
            className="flex-1 py-3 bg-[#7b3ff2] text-white rounded-[10px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
          >
            예약하기
          </button>
        </div>
      </div>
    </motion.div>
  );
}