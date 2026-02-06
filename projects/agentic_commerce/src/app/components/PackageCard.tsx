import { motion } from "motion/react";

export interface PackageData {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  airline: string;
  hotel: string;
  hotelGrade: string;
  departure: string;
  availableSeats: number;
  highlights: string[];
}

interface PackageCardProps {
  package: PackageData;
  onClick: () => void;
  onBooking?: () => void;
  rank?: number;
}

export function PackageCard({ package: pkg, onClick, onBooking, rank }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[16px] overflow-hidden shadow-sm border border-[#e5e5e5] hover:shadow-md transition-shadow relative"
    >
      {/* ìì ë°°ì§ - ì¢ì¸¡ ìë¨ */}
      {rank && (
        <div className="absolute top-2 left-2 z-10 size-6 bg-[#3780ff] rounded-full flex items-center justify-center">
          <span className="text-white text-[12px] font-['Pretendard:Bold',sans-serif]">
            {rank}
          </span>
        </div>
      )}
      
      <div className="flex gap-3 p-3">
        {/* ì¸ë¤ì¼ - ì¢ì¸¡ */}
        <div className="relative w-[100px] h-[100px] flex-shrink-0 rounded-[12px] overflow-hidden">
          <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <span className="text-[#ff6b35] font-['Pretendard:Bold',sans-serif] text-[11px]">
              {pkg.availableSeats}ì
            </span>
          </div>
        </div>

        {/* ì ë³´ - ì°ì¸¡ */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1">
              <svg className="size-3.5 fill-[#FFB800]" viewBox="0 0 16 16">
                <path d="M8 0L10.472 5.008L16 5.856L12 9.712L12.944 15.232L8 12.616L3.056 15.232L4 9.712L0 5.856L5.528 5.008L8 0Z"/>
              </svg>
              <span className="text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">
                {pkg.rating}
              </span>
            </div>
            <span className="text-[11px] text-[#999]">({pkg.reviewCount})</span>
          </div>

          <h3 className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] mb-1.5 line-clamp-2">
            {pkg.title}
          </h3>

          <div className="flex items-center gap-2 text-[11px] text-[#666] mb-2">
            <svg className="size-3" viewBox="0 0 16 16" fill="none">
              <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#666" strokeWidth="1.2"/>
              <path d="M8 5V8L10 10" stroke="#666" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span>{pkg.duration}</span>
          </div>

          {/* ê°ê²© - ìë¨ */}
          <div className="mb-2">
            <span className="text-[11px] text-[#999]">1ì¸</span>
            <div className="flex items-baseline gap-1">
              <span className="font-['Pretendard:Bold',sans-serif] text-[17px] text-[#3780ff]">
                {(pkg.price / 10000).toFixed(0)}ë§ì
              </span>
              <span className="text-[11px] text-[#999]">~</span>
            </div>
          </div>

          {/* ë²í¼ - íë¨ */}
          <div className="flex gap-1.5 mt-auto">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="px-3 py-1.5 bg-white border border-[#3780ff] text-[#3780ff] rounded-[6px] text-[12px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f0f7ff] transition-colors"
            >
              ìì¸ë³´ê¸°
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onBooking?.();
              }}
              className="px-3 py-1.5 bg-[#3780ff] text-white rounded-[6px] text-[12px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#2d6fdf] transition-colors"
            >
              ìì½íê¸°
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}