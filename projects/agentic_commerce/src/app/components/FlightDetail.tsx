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
        {/* í¤ë */}
        <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">
            í­ê³µí¸ ìì¸ ì ë³´
          </h2>
          <button onClick={onClose} className="p-2 -mr-2">
            <X className="size-6 text-[#666]" />
          </button>
        </div>

        {/* ì»¨íì¸  */}
        <div className="px-5 py-6">
          {/* í­ê³µì¬ & ì§í­/ê²½ì  */}
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
                {flight.isDirect ? "ì§í­" : "ê²½ì "}
              </span>
            </div>
            {flight.flightNumber && (
              <p className="text-[13px] text-[#666]">í­ê³µí¸ëª: {flight.flightNumber}</p>
            )}
          </div>

          {/* ì¶ë° ëì°© ì ë³´ */}
          <div className="bg-[#f8f9fa] rounded-[16px] p-4 mb-4">
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3">
              ì´í­ ì ë³´
            </h4>
            
            {/* ì¶ë° */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-2 rounded-full bg-[#7b3ff2]"></div>
                <span className="text-[13px] text-[#666]">ì¶ë°</span>
              </div>
              <div className="ml-4">
                <p className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] mb-1">
                  {flight.departure}
                </p>
                <p className="text-[13px] text-[#666] mb-1">
                  {flight.departureAirport || `${flight.departure} êµ­ì ê³µí­`}
                </p>
                <p className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">
                  {flight.departureTime}
                </p>
              </div>
            </div>

            {/* ë¹í ìê° */}
            <div className="flex items-center gap-2 ml-4 mb-4">
              <Clock className="size-4 text-[#999]" />
              <span className="text-[13px] text-[#666]">ë¹íìê°: {flight.flightDuration}</span>
            </div>

            {/* ëì°© */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="size-2 rounded-full bg-[#7b3ff2]"></div>
                <span className="text-[13px] text-[#666]">ëì°©</span>
              </div>
              <div className="ml-4">
                <p className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] mb-1">
                  {flight.arrival}
                </p>
                <p className="text-[13px] text-[#666] mb-1">
                  {flight.arrivalAirport || `${flight.arrival} êµ­ì ê³µí­`}
                </p>
                <p className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">
                  {flight.arrivalTime}
                </p>
              </div>
            </div>
          </div>

          {/* ì¢ì ë±ê¸ */}
          <div className="bg-[#f8f9fa] rounded-[16px] p-4 mb-4">
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3">
              ì¢ì ë±ê¸
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#666]">ì íë ì¢ì</span>
              <span className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">
                {flight.seatClass}
              </span>
            </div>
          </div>

          {/* ìíë¬¼ ê·ì  */}
          <div className="mb-4">
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3 flex items-center gap-2">
              <Luggage className="size-5 text-[#7b3ff2]" />
              ìíë¬¼ ê·ì 
            </h4>
            <div className="bg-[#f8f9fa] rounded-[12px] p-4 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-[#7b3ff2] mt-0.5 flex-shrink-0" />
                <p className="text-[13px] text-[#666] leading-[1.6]">
                  <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">ìí ìíë¬¼:</span> {flight.baggage || "23kg 1ê°"}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-[#7b3ff2] mt-0.5 flex-shrink-0" />
                <p className="text-[13px] text-[#666] leading-[1.6]">
                  <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">ê¸°ë´ ìíë¬¼:</span> 10kg ì´ë´ (55Ã40Ã20cm)
                </p>
              </div>
            </div>
          </div>

          {/* í­ê³µ ìë´ */}
          <div className="mb-4">
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3 flex items-center gap-2">
              <Info className="size-5 text-[#7b3ff2]" />
              í­ê³µ ìë´
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1 flex-shrink-0">â¢</span>
                <p className="text-[13px] text-[#666] leading-[1.6]">
                  ì¶ë° 2ìê° ì ê¹ì§ ê³µí­ ì²´í¬ì¸ì ìë£í´ì£¼ì¸ì
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1 flex-shrink-0">â¢</span>
                <p className="text-[13px] text-[#666] leading-[1.6]">
                  ì í¨í ì¬ê¶ ë° íì ì ë¹ìë¥¼ ìì§íìì¼ í©ëë¤
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1 flex-shrink-0">â¢</span>
                <p className="text-[13px] text-[#666] leading-[1.6]">
                  ê¸°ë´ ë°ì ê¸ì§ ë¬¼íì íì¸í´ì£¼ì¸ì
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#7b3ff2] mt-1 flex-shrink-0">â¢</span>
                <p className="text-[13px] text-[#666] leading-[1.6]">
                  í­ê³µí¸ ìê°ì íì§ ìê° ê¸°ì¤ìëë¤
                </p>
              </div>
            </div>
          </div>

          {/* ê°ê²© ì ë³´ */}
          <div className="bg-[#f8f4ff] rounded-[16px] p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-[#666] mb-1">
                  {flight.passengerCount}ì¸ ê¸°ì¤
                </p>
                <p className="font-['Pretendard:Bold',sans-serif] text-[24px] text-[#7b3ff2]">
                  {flight.price.toLocaleString()}ì
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
            ì´ í­ê³µí¸ì¼ë¡ ìì½íê¸°
          </button>
        </div>
      </motion.div>
    </div>
  );
}
