import { motion } from "motion/react";
import { FITPackageData } from "./FITPackageCard";
import { X, Plane, Building2, Clock, Users } from "lucide-react";

interface FITPackageDetailProps {
  package: FITPackageData;
  onClose: () => void;
  onBooking: () => void;
}

export function FITPackageDetail({ package: pkg, onClose, onBooking }: FITPackageDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-[24px]"
      >
        <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-5 py-4 flex items-center justify-between">
          <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">항공+숙소 조합 상세</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5">
          {/* 목적지 헤더 */}
          <div className="mb-4">
            <h3 className="font-['Pretendard:Bold',sans-serif] text-[20px] text-[#111]">
              {pkg.destination} 자유여행
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5">
                <Clock className="size-4 text-[#666]" />
                <span className="text-[14px] text-[#666]">{pkg.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="size-4 text-[#666]" />
                <span className="text-[14px] text-[#666]">성인 {pkg.passengerCount}인</span>
              </div>
            </div>
          </div>

          {/* AI 추천 이유 */}
          <div className="flex gap-2 bg-[#f5f0ff] rounded-[8px] px-3 py-2.5 mb-4">
            <span className="shrink-0 w-[3px] self-stretch rounded-full bg-[#7b3ff2]" />
            <p className="text-[13px] leading-[1.5] text-[#555] line-clamp-2">
              {pkg.recommendReason}
            </p>
          </div>

          {/* 항공 정보 */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Plane className="size-4 text-[#7b3ff2]" />
              <h4 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111]">항공 정보</h4>
            </div>
            <div className="bg-[#f8f9fa] rounded-[12px] p-4 space-y-2">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#666]">구간</span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">
                  {pkg.flightInfo.departure} → {pkg.flightInfo.arrival}
                </span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#666]">항공사</span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">{pkg.flightInfo.airline}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#666]">좌석등급</span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">{pkg.flightInfo.seatClass}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#666]">출발/도착</span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">
                  {pkg.flightInfo.departureTime} → {pkg.flightInfo.arrivalTime}
                </span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#666]">소요시간</span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">{pkg.flightInfo.flightDuration}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#666]">항공 요금</span>
                <span className="font-['Pretendard:Bold',sans-serif] text-[#7b3ff2]">
                  {pkg.flightInfo.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* 숙소 정보 */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="size-4 text-[#7b3ff2]" />
              <h4 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111]">숙소 정보</h4>
            </div>
            <div className="bg-[#f8f9fa] rounded-[12px] p-4 space-y-2">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#666]">호텔명</span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">{pkg.hotelInfo.name}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#666]">등급</span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[#7b3ff2]">{pkg.hotelInfo.grade}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#666]">위치</span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">{pkg.hotelInfo.location}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#666]">객실타입</span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">{pkg.hotelInfo.roomType}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#666]">숙박 요금</span>
                <span className="font-['Pretendard:Bold',sans-serif] text-[#7b3ff2]">
                  {pkg.hotelInfo.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* 포함 사항 */}
          <div className="mb-6">
            <h4 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] mb-3">
              포함 사항
            </h4>
            <div className="space-y-2">
              <div className="flex gap-2 text-[14px]">
                <span className="text-[#7b3ff2]">✓</span>
                <span className="text-[#666]">왕복 항공권 ({pkg.flightInfo.seatClass})</span>
              </div>
              <div className="flex gap-2 text-[14px]">
                <span className="text-[#7b3ff2]">✓</span>
                <span className="text-[#666]">숙박 ({pkg.hotelInfo.name})</span>
              </div>
              <div className="flex gap-2 text-[14px]">
                <span className="text-[#7b3ff2]">✓</span>
                <span className="text-[#666]">여행자 보험</span>
              </div>
            </div>
          </div>

          {/* 하단: 총 금액 + 예약 */}
          <div className="flex items-end justify-between py-4 border-t border-[#f0f0f0]">
            <div>
              <span className="text-[14px] text-[#999] block mb-1">총 예상 금액</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[24px] text-[#7b3ff2]">
                {pkg.totalPrice.toLocaleString()}원
              </span>
            </div>
            <button
              onClick={onBooking}
              className="px-6 py-3 bg-[#7b3ff2] text-white rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
            >
              예약하기
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
