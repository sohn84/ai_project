import { motion } from "motion/react";
import { Building2 } from "lucide-react";

export interface HotelData {
  id: string;
  name: string;
  grade: string;
  location: string;
  roomType: string;
  price: number;
  destination: string;
  passengerCount: number;
  image?: string;
}

interface HotelCardProps {
  hotel: HotelData;
  rank: number;
  onClick: () => void;
  onBooking: () => void;
}

export function HotelCard({ hotel, rank, onClick, onBooking }: HotelCardProps) {
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
          <span className="text-[12px] text-[#7b3ff2] font-['Pretendard:SemiBold',sans-serif]">ì¶ì² ìì</span>
        </div>
      </div>

      {/* ìì ì ë³´ */}
      <div className="bg-[#f8f9fa] rounded-[12px] p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="size-4 text-[#7b3ff2]" />
          <span className="text-[13px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">ìì</span>
        </div>
        <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-1">
          {hotel.name}
        </p>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[12px] text-[#7b3ff2]">{hotel.grade}</span>
          <span className="text-[12px] text-[#666]">|</span>
          <span className="text-[12px] text-[#666]">{hotel.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[#666]">{hotel.roomType}</span>
          <div className="text-right">
            <span className="text-[11px] text-[#999] mr-1">{hotel.passengerCount}ì¸ ê¸°ì¤</span>
            <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#7b3ff2]">
              {hotel.price.toLocaleString()}ì
            </span>
          </div>
        </div>
      </div>

      {/* ìì¸ë³´ê¸° / ìì½íê¸° ë²í¼ */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex-1 py-2.5 bg-white border border-[#7b3ff2] text-[#7b3ff2] rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f8f4ff] transition-colors"
        >
          ìì¸ë³´ê¸°
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBooking();
          }}
          className="flex-1 py-2.5 bg-[#7b3ff2] text-white rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
        >
          ìì½íê¸°
        </button>
      </div>
    </motion.div>
  );
}
