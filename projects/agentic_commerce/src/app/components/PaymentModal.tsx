import { useState } from "react";
import { motion } from "motion/react";
import { X, CreditCard, Smartphone } from "lucide-react";

interface PaymentModalProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentModal({ amount, onSuccess, onCancel }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile" | "">("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    if (!paymentMethod) return;
    
    setIsProcessing(true);
    // ê²°ì  ì²ë¦¬ ìë®¬ë ì´ì
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onCancel}
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
          <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">ê²°ì íê¸°</h2>
          <button onClick={onCancel} className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="bg-[#f5f5f5] rounded-[16px] p-5 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[14px] text-[#666]">ê²°ì  ê¸ì¡</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[24px] text-[#3780ff]">
                {(amount / 10000).toFixed(0)}ë§ì
              </span>
            </div>
            <p className="text-[12px] text-[#999]">â» ë¶ê°ì¸ í¬í¨ ê¸ì¡ìëë¤</p>
          </div>

          <div className="mb-6">
            <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] mb-3">
              ê²°ì  ìë¨ ì í
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`w-full flex items-center gap-4 p-4 rounded-[12px] border-2 transition-all ${
                  paymentMethod === "card"
                    ? "border-[#3780ff] bg-[#f0f7ff]"
                    : "border-[#e5e5e5] bg-white hover:border-[#ccc]"
                }`}
              >
                <div className={`size-10 rounded-full flex items-center justify-center ${
                  paymentMethod === "card" ? "bg-[#3780ff]" : "bg-[#f5f5f5]"
                }`}>
                  <CreditCard className={`size-5 ${paymentMethod === "card" ? "text-white" : "text-[#666]"}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
                    ì ì©/ì²´í¬ì¹´ë
                  </p>
                  <p className="text-[12px] text-[#999]">êµ­ë´ì¸ ëª¨ë  ì¹´ë ì¬ì© ê°ë¥</p>
                </div>
                {paymentMethod === "card" && (
                  <div className="size-5 rounded-full bg-[#3780ff] flex items-center justify-center">
                    <svg className="size-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>

              <button
                onClick={() => setPaymentMethod("mobile")}
                className={`w-full flex items-center gap-4 p-4 rounded-[12px] border-2 transition-all ${
                  paymentMethod === "mobile"
                    ? "border-[#3780ff] bg-[#f0f7ff]"
                    : "border-[#e5e5e5] bg-white hover:border-[#ccc]"
                }`}
              >
                <div className={`size-10 rounded-full flex items-center justify-center ${
                  paymentMethod === "mobile" ? "bg-[#3780ff]" : "bg-[#f5f5f5]"
                }`}>
                  <Smartphone className={`size-5 ${paymentMethod === "mobile" ? "text-white" : "text-[#666]"}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
                    ê°í¸ê²°ì 
                  </p>
                  <p className="text-[12px] text-[#999]">ì¹´ì¹´ì¤íì´, ë¤ì´ë²íì´ ë±</p>
                </div>
                {paymentMethod === "mobile" && (
                  <div className="size-5 rounded-full bg-[#3780ff] flex items-center justify-center">
                    <svg className="size-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="bg-[#fff5f5] border border-[#ffe0e0] rounded-[12px] p-4 mb-6">
            <p className="text-[13px] text-[#666]">
              â ï¸ ê²°ì  ì§í ì ìì½ì´ íì ëë©°, ì·¨ì ê·ì ì ë°ë¼ íë¶ë©ëë¤.
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={!paymentMethod || isProcessing}
            className="w-full py-4 bg-[#3780ff] text-white rounded-[12px] text-[16px] font-['Pretendard:SemiBold',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2d6fdf] transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin size-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                ê²°ì  ì²ë¦¬ ì¤...
              </>
            ) : (
              `${(amount / 10000).toFixed(0)}ë§ì ê²°ì íê¸°`
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
