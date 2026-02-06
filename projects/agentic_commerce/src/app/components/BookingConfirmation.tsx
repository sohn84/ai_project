import { motion } from "motion/react";
import { Check } from "lucide-react";

interface BookingConfirmationProps {
  bookingNumber: string;
  packageTitle: string;
  travelers: number;
  amount: number;
  onClose: () => void;
}

export function BookingConfirmation({ 
  bookingNumber, 
  packageTitle, 
  travelers, 
  amount,
  onClose 
}: BookingConfirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-[24px]"
      >
        <div className="p-5">
          <div className="flex flex-col items-center text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="size-20 rounded-full bg-[#3780ff] flex items-center justify-center mb-4"
            >
              <Check className="size-10 text-white" strokeWidth={3} />
            </motion.div>
            
            <h2 className="font-['Pretendard:Bold',sans-serif] text-[24px] text-[#111] mb-2">
              ìì½ì´ ìë£ëììµëë¤!
            </h2>
            <p className="text-[14px] text-[#666] mb-8">
              ìì½ íì¸ ë©ì¼ì ë°ì¡í´ ëë ¸ìµëë¤
            </p>

            <div className="w-full bg-gradient-to-br from-[#3780ff] to-[#1e52ff] rounded-[20px] p-6 mb-6">
              <p className="text-white/80 text-[13px] mb-2">ìì½ë²í¸</p>
              <p className="font-['Pretendard:Bold',sans-serif] text-white text-[28px] tracking-wider mb-4">
                {bookingNumber}
              </p>
              <div className="h-px bg-white/20 my-4" />
              <div className="space-y-2">
                <div className="flex justify-between text-white/90 text-[14px]">
                  <span>ìíëª</span>
                  <span className="font-['Pretendard:SemiBold',sans-serif] text-right max-w-[180px] line-clamp-1">
                    {packageTitle}
                  </span>
                </div>
                <div className="flex justify-between text-white/90 text-[14px]">
                  <span>ì¸ì</span>
                  <span className="font-['Pretendard:SemiBold',sans-serif]">{travelers}ëª</span>
                </div>
                <div className="flex justify-between text-white text-[16px] font-['Pretendard:Bold',sans-serif]">
                  <span>ê²°ì ê¸ì¡</span>
                  <span>{(amount / 10000).toFixed(0)}ë§ì</span>
                </div>
              </div>
            </div>

            <div className="w-full bg-[#f5f5f5] rounded-[16px] p-5 mb-6">
              <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] mb-3 text-left">
                ð ì¶ë° ì  ì¤ë¹ì¬í­
              </h3>
              <div className="space-y-2 text-left text-[14px] text-[#666]">
                <p>â¢ ì¬ê¶ ì í¨ê¸°ê°ì íì¸í´ì£¼ì¸ì (6ê°ì ì´ì ë¨ììì´ì¼ í©ëë¤)</p>
                <p>â¢ ì¶ë° 3ì¼ ì  ìµì¢ ì¼ì íë¥¼ ë°ì¡í´ ëë¦½ëë¤</p>
                <p>â¢ íì§ ê°ì´ë ì°ë½ì²ë ë¬¸ìë¡ ìë´ë©ëë¤</p>
                <p>â¢ ì¬íì ë³´íì ìë ê°ìë©ëë¤</p>
              </div>
            </div>

            <div className="w-full bg-[#fff9f5] border border-[#ffe5cc] rounded-[16px] p-5 mb-6">
              <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] mb-3 text-left">
                âï¸ ê°ì´ë ì ë³´
              </h3>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-[#3780ff] flex items-center justify-center text-white font-['Pretendard:Bold',sans-serif]">
                    ê¹
                  </div>
                  <div>
                    <p className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">ê¹íì§ ê°ì´ë</p>
                    <p className="text-[13px] text-[#666]">ê²½ë ¥ 8ë Â· ë§ì¡±ë 4.9/5.0</p>
                  </div>
                </div>
                <p className="text-[13px] text-[#666] pt-2">
                  ì¶ë° íë£¨ ì  ì°ë½ì²ë¥¼ ë¬¸ìë¡ ìë´í´ ëë¦½ëë¤
                </p>
              </div>
            </div>

            <div className="w-full space-y-3">
              <button
                onClick={onClose}
                className="w-full py-4 bg-[#3780ff] text-white rounded-[12px] text-[16px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#2d6fdf] transition-colors"
              >
                íì¸
              </button>
              <button
                onClick={onClose}
                className="w-full py-4 bg-white border-2 border-[#e5e5e5] text-[#666] rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f5f5f5] transition-colors"
              >
                ìì½ ë´ì­ ë³´ê¸°
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
