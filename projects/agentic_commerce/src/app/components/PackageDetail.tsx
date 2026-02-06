import { motion } from "motion/react";
import { PackageData } from "./PackageCard";
import { X } from "lucide-react";

interface PackageDetailProps {
  package: PackageData;
  onClose: () => void;
  onBooking: () => void;
}

export function PackageDetail({ package: pkg, onClose, onBooking }: PackageDetailProps) {
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
          <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">ìí ìì¸</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5">
          <img src={pkg.image} alt={pkg.title} className="w-full h-[200px] object-cover rounded-[16px] mb-4" />
          
          <h3 className="font-['Pretendard:Bold',sans-serif] text-[20px] text-[#111] mb-2">
            {pkg.title}
          </h3>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <svg className="size-4 fill-[#FFB800]" viewBox="0 0 16 16">
                <path d="M8 0L10.472 5.008L16 5.856L12 9.712L12.944 15.232L8 12.616L3.056 15.232L4 9.712L0 5.856L5.528 5.008L8 0Z"/>
              </svg>
              <span className="text-[15px] font-['Pretendard:SemiBold',sans-serif]">{pkg.rating}</span>
            </div>
            <span className="text-[13px] text-[#999]">íê¸° {pkg.reviewCount}ê°</span>
          </div>

          <div className="bg-[#f5f5f5] rounded-[12px] p-4 mb-4 space-y-2">
            <div className="flex justify-between text-[14px]">
              <span className="text-[#666]">ì¬íê¸°ê°</span>
              <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">{pkg.duration}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-[#666]">ì¶ë°ì¼</span>
              <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">{pkg.departure}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-[#666]">í­ê³µì¬</span>
              <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">{pkg.airline}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-[#666]">ìì</span>
              <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">{pkg.hotel} ({pkg.hotelGrade})</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-[#666]">ìì¬ì</span>
              <span className="font-['Pretendard:SemiBold',sans-serif] text-[#ff6b35]">{pkg.availableSeats}ì</span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] mb-3">
              ì¬í íì´ë¼ì´í¸
            </h4>
            <div className="space-y-2">
              {pkg.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-[#3780ff] text-[14px]">â¢</span>
                  <span className="text-[14px] text-[#666]">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] mb-3">
              í¬í¨ ì¬í­
            </h4>
            <div className="space-y-2">
              <div className="flex gap-2 text-[14px]">
                <span className="text-[#3780ff]">â</span>
                <span className="text-[#666]">ìë³µ í­ê³µê¶ (ì´ì½ë¸ë¯¸ì)</span>
              </div>
              <div className="flex gap-2 text-[14px]">
                <span className="text-[#3780ff]">â</span>
                <span className="text-[#666]">ìë° ({pkg.hotel})</span>
              </div>
              <div className="flex gap-2 text-[14px]">
                <span className="text-[#3780ff]">â</span>
                <span className="text-[#666]">ì¼ì íì ëª¨ë  ìì¬</span>
              </div>
              <div className="flex gap-2 text-[14px]">
                <span className="text-[#3780ff]">â</span>
                <span className="text-[#666]">ì ë¬¸ ê°ì´ë ë° ì°¨ë</span>
              </div>
              <div className="flex gap-2 text-[14px]">
                <span className="text-[#3780ff]">â</span>
                <span className="text-[#666]">ì¬íì ë³´í</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] mb-3">
              ë¶í¬í¨ ì¬í­
            </h4>
            <div className="space-y-2">
              <div className="flex gap-2 text-[14px]">
                <span className="text-[#999]">â</span>
                <span className="text-[#666]">ê°ì¸ ê²½ë¹</span>
              </div>
              <div className="flex gap-2 text-[14px]">
                <span className="text-[#999]">â</span>
                <span className="text-[#666]">ì í ê´ê´ (íì§ ê²°ì )</span>
              </div>
              <div className="flex gap-2 text-[14px]">
                <span className="text-[#999]">â</span>
                <span className="text-[#666]">ê°ì´ë/ê¸°ì¬ í</span>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between py-4 border-t border-[#f0f0f0]">
            <div>
              <span className="text-[14px] text-[#999] block mb-1">1ì¸ ê¸°ì¤ ê°ê²©</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[24px] text-[#3780ff]">
                {(pkg.price / 10000).toFixed(0)}ë§ì
              </span>
            </div>
            <button
              onClick={onBooking}
              className="px-6 py-3 bg-[#3780ff] text-white rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#2d6fdf] transition-colors"
            >
              ìì½íê¸°
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
