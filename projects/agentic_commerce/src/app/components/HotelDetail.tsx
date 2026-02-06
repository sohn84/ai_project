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
        {/* í¤ë */}
        <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">
            ìì ìì¸ ì ë³´
          </h2>
          <button onClick={onClose} className="p-2 -mr-2">
            <X className="size-6 text-[#666]" />
          </button>
        </div>

        {/* ì»¨íì¸  */}
        <div className="px-5 py-6">
          {/* ìì ì´ë¯¸ì§ */}
          {hotel.image && (
            <div className="w-full h-[200px] bg-gray-200 rounded-[16px] mb-4 overflow-hidden">
              <img 
                src={hotel.image} 
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* í¸íëª & ë±ê¸ */}
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
              <span className="text-[13px] text-[#999]">(ë¦¬ë·° 152ê°)</span>
            </div>
          </div>

          {/* ê°ì¤ ì ë³´ */}
          <div className="bg-[#f8f9fa] rounded-[16px] p-4 mb-4">
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3">
              ê°ì¤ ì ë³´
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#666]">ê°ì¤ íì</span>
                <span className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">
                  {hotel.roomType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#666]">ê¸°ì¤ ì¸ì</span>
                <div className="flex items-center gap-1">
                  <Users className="size-4 text-[#7b3ff2]" />
                  <span className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">
                    {hotel.passengerCount}ëª
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* í¸ììì¤ */}
          <div className="mb-4">
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3">
              í¸ììì¤
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-[12px] p-3">
                <Wifi className="size-5 text-[#7b3ff2]" />
                <span className="text-[13px] text-[#111]">ë¬´ë£ Wi-Fi</span>
              </div>
              <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-[12px] p-3">
                <Coffee className="size-5 text-[#7b3ff2]" />
                <span className="text-[13px] text-[#111]">ì¡°ì í¬í¨</span>
              </div>
              <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-[12px] p-3">
                <Utensils className="size-5 text-[#7b3ff2]" />
                <span className="text-[13px] text-[#111]">ë ì¤í ë</span>
              </div>
              <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-[12px] p-3">
                <Dumbbell className="size-5 text-[#7b3ff2]" />
                <span className="text-[13px] text-[#111]">í¼í¸ëì¤</span>
              </div>
            </div>
          </div>

          {/* ìì í¹ì§ */}
          <div className="mb-4">
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3">
              ìì í¹ì§
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1">â¢</span>
                <span className="text-[14px] text-[#666] leading-[1.6]">
                  ì£¼ì ê´ê´ì§ì ê°ê¹ì´ ìµì ì ìì¹
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1">â¢</span>
                <span className="text-[14px] text-[#666] leading-[1.6]">
                  ëª¨ëíê³  ê¹¨ëí ê°ì¤ íê²½
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1">â¢</span>
                <span className="text-[14px] text-[#666] leading-[1.6]">
                  ì¹ì í ë¤êµ­ì´ ìë¹ì¤ ì ê³µ
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1">â¢</span>
                <span className="text-[14px] text-[#666] leading-[1.6]">
                  24ìê° íë¡ í¸ ë°ì¤í¬ ì´ì
                </span>
              </li>
            </ul>
          </div>

          {/* ê°ê²© ì ë³´ */}
          <div className="bg-[#f8f4ff] rounded-[16px] p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-[#666] mb-1">
                  {hotel.passengerCount}ì¸ ê¸°ì¤
                </p>
                <p className="font-['Pretendard:Bold',sans-serif] text-[24px] text-[#7b3ff2]">
                  {hotel.price.toLocaleString()}ì
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* íë¨ ìì½ ë²í¼ */}
        <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-4">
          <button
            onClick={onBooking}
            className="w-full py-4 bg-[#7b3ff2] text-white rounded-[12px] text-[16px] font-['Pretendard:Bold',sans-serif] hover:bg-[#6930d9] transition-colors"
          >
            ì´ ììë¡ ìì½íê¸°
          </button>
        </div>
      </motion.div>
    </div>
  );
}
