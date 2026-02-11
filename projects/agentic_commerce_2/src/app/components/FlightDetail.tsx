import { motion } from "motion/react";
import { X, Plane, MapPin, Clock, Luggage, Info, CheckCircle2 } from "lucide-react";
import { FlightData } from "./FlightCard";

interface FlightDetailProps {
  flight: FlightData;
  onClose: () => void;
  onBooking: () => void;
}

export function FlightDetail({ flight, onClose, onBooking }: FlightDetailProps) {
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
            항공편 상세 정보
          </h2>
          <button onClick={onClose} className="p-2 -mr-2">
            <X className="size-6 text-[#666]" />
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="px-5 py-6">
          {/* 항공사 & 직항/경유 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Plane className="size-5 text-[#7b3ff2]" />
                <span className="text-[13px] text-[#7b3ff2] font-['Pretendard:SemiBold',sans-serif]">
                  {flight.airline}
                </span>
              </div>
              <span className={`text-[12px] px-3 py-1 rounded-full ${
                flight.isDirect 
                  ? "bg-[#e8f5e9] text-[#2e7d32]" 
                  : "bg-[#fff3e0] text-[#e65100]"
              } font-['Pretendard:SemiBold',sans-serif]`}>
                {flight.isDirect ? "직항" : "경유"}
              </span>
            </div>
            {flight.flightNumber && (
              <p className="text-[13px] text-[#666]">항공편명: {flight.flightNumber}</p>
            )}
          </div>

          {/* 출발 도착 정보 */}
          <div className="bg-[#f8f9fa] rounded-[16px] p-4 mb-4">
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3">
              운항 정보
            </h4>
            
            {/* 출발 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-2 rounded-full bg-[#7b3ff2]"></div>
                <span className="text-[13px] text-[#666]">출발</span>
              </div>
              <div className="ml-4">
                <p className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] mb-1">
                  {flight.departure}
                </p>
                <p className="text-[13px] text-[#666] mb-1">
                  {flight.departureAirport || `${flight.departure} 국제공항`}
                </p>
                <p className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">
                  {flight.departureTime}
                </p>
              </div>
            </div>

            {/* 비행 시간 */}
            <div className="flex items-center gap-2 ml-4 mb-4">
              <Clock className="size-4 text-[#999]" />
              <span className="text-[13px] text-[#666]">비행시간: {flight.flightDuration}</span>
            </div>

            {/* 도착 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="size-2 rounded-full bg-[#7b3ff2]"></div>
                <span className="text-[13px] text-[#666]">도착</span>
              </div>
              <div className="ml-4">
                <p className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] mb-1">
                  {flight.arrival}
                </p>
                <p className="text-[13px] text-[#666] mb-1">
                  {flight.arrivalAirport || `${flight.arrival} 국제공항`}
                </p>
                <p className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">
                  {flight.arrivalTime}
                </p>
              </div>
            </div>
          </div>

          {/* 좌석 등급 */}
          <div className="bg-[#f8f9fa] rounded-[16px] p-4 mb-4">
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3">
              좌석 등급
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#666]">선택된 좌석</span>
              <span className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">
                {flight.seatClass}
              </span>
            </div>
          </div>

          {/* 수하물 규정 */}
          <div className="mb-4">
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3 flex items-center gap-2">
              <Luggage className="size-5 text-[#7b3ff2]" />
              수하물 규정
            </h4>
            <div className="bg-[#f8f9fa] rounded-[12px] p-4 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-[#7b3ff2] mt-0.5 flex-shrink-0" />
                <p className="text-[13px] text-[#666] leading-[1.6]">
                  <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">위탁 수하물:</span> {flight.baggage || "23kg 1개"}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-[#7b3ff2] mt-0.5 flex-shrink-0" />
                <p className="text-[13px] text-[#666] leading-[1.6]">
                  <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">기내 수하물:</span> 10kg 이내 (55×40×20cm)
                </p>
              </div>
            </div>
          </div>

          {/* 항공 안내 */}
          <div className="mb-4">
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3 flex items-center gap-2">
              <Info className="size-5 text-[#7b3ff2]" />
              항공 안내
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1 flex-shrink-0">•</span>
                <p className="text-[13px] text-[#666] leading-[1.6]">
                  출발 2시간 전까지 공항 체크인을 완료해주세요
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1 flex-shrink-0">•</span>
                <p className="text-[13px] text-[#666] leading-[1.6]">
                  유효한 여권 및 필요 시 비자를 소지하셔야 합니다
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1 flex-shrink-0">•</span>
                <p className="text-[13px] text-[#666] leading-[1.6]">
                  기내 반입 금지 물품을 확인해주세요
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1 flex-shrink-0">•</span>
                <p className="text-[13px] text-[#666] leading-[1.6]">
                  항공편 시간은 현지 시간 기준입니다
                </p>
              </div>
            </div>
          </div>

          {/* 가격 정보 */}
          <div className="bg-[#f8f4ff] rounded-[16px] p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-[#666] mb-1">
                  {flight.passengerCount}인 기준
                </p>
                <p className="font-['Pretendard:Bold',sans-serif] text-[24px] text-[#7b3ff2]">
                  {flight.price.toLocaleString()}원
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
            이 항공편으로 예약하기
          </button>
        </div>
      </motion.div>
    </div>
  );
}
