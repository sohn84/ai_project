import { motion } from "motion/react";
import { Plane } from "lucide-react";

export interface FlightData {
  id: string;
  airline: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  flightDuration: string;
  seatClass: string;
  price: number;
  destination: string;
  passengerCount: number;
  isDirect: boolean; // 직항 여부
  departureAirport?: string; // 출발 공항 상세
  arrivalAirport?: string; // 도착 공항 상세
  baggage?: string; // 수하물 규정
  flightNumber?: string; // 항공편명
  recommendReason: string;
}

interface FlightCardProps {
  flight: FlightData;
  rank: number;
  onClick: () => void;
  onBooking: () => void;
}

export function FlightCard({ flight, rank, onClick, onBooking }: FlightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="bg-white rounded-[16px] p-4 shadow-sm border border-[#e5e5e5] cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-[#7b3ff2] flex items-center justify-center text-white text-[12px] font-['Pretendard:Bold',sans-serif]">
            {rank}
          </div>
          <span className="text-[12px] text-[#7b3ff2] font-['Pretendard:SemiBold',sans-serif]">추천 항공편</span>
        </div>
        <span className={`text-[11px] px-2 py-1 rounded-full ${
          flight.isDirect 
            ? "bg-[#e8f5e9] text-[#2e7d32]" 
            : "bg-[#fff3e0] text-[#e65100]"
        } font-['Pretendard:SemiBold',sans-serif]`}>
          {flight.isDirect ? "직항" : "경유"}
        </span>
      </div>

      {/* AI 추천 이유 */}
      <div className="flex gap-2 bg-[#f5f0ff] rounded-[8px] px-3 py-2.5 mb-3">
        <span className="shrink-0 w-[3px] self-stretch rounded-full bg-[#7b3ff2]" />
        <p className="text-[13px] leading-[1.5] text-[#555] line-clamp-2">
          {flight.recommendReason}
        </p>
      </div>

      {/* 항공 정보 */}
      <div className="bg-[#f8f9fa] rounded-[12px] p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Plane className="size-4 text-[#7b3ff2]" />
          <span className="text-[13px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">항공</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">
              {flight.departure}
            </span>
            <svg className="size-4 text-[#666]" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">
              {flight.arrival}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[12px] text-[#666]">{flight.airline}</span>
          <span className="text-[12px] text-[#666]">|</span>
          <span className="text-[12px] text-[#666]">{flight.seatClass}</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[12px] text-[#666]">
            {flight.departureTime} → {flight.arrivalTime}
          </span>
          <span className="text-[12px] text-[#666]">|</span>
          <span className="text-[12px] text-[#666]">{flight.flightDuration}</span>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-[#999] mr-1">{flight.passengerCount}인 기준</span>
          <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#7b3ff2]">
            {flight.price.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 상세보기 / 예약하기 버튼 */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex-1 py-2.5 bg-white border border-[#7b3ff2] text-[#7b3ff2] rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f8f4ff] transition-colors"
        >
          상세보기
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBooking();
          }}
          className="flex-1 py-2.5 bg-[#7b3ff2] text-white rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
        >
          예약하기
        </button>
      </div>
    </motion.div>
  );
}
