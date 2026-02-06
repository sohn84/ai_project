import { useState } from "react";
import { motion } from "motion/react";

interface PreferenceInputProps {
  onSubmit: (data: { theme: string; budget: string; destination: string; travelers: number; searchMode?: 'combo' | 'flight' | 'hotel' }) => void;
  mode?: "package" | "fit"; // í¨í¤ì§ ëë ìì ì¬í ëª¨ë
}

export function PreferenceInput({ onSubmit, mode = "package" }: PreferenceInputProps) {
  const [theme, setTheme] = useState("");
  const [budget, setBudget] = useState("");
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [searchMode, setSearchMode] = useState<'combo' | 'flight' | 'hotel'>('combo');

  const themes = ["í´ì", "ë¬¸ííë°©", "ìì°ê²½ê´", "ë ì /ì¡í°ë¹í°", "ì¼í"];
  const budgets = ["100ë§ì ì´í", "100-200ë§ì", "200-300ë§ì", "300ë§ì ì´ì"];

  const handleSubmit = (mode: 'combo' | 'flight' | 'hotel') => {
    if (budget && destination) {
      onSubmit({ theme: "", budget, destination, travelers, searchMode: mode });
    }
  };

  const handlePackageSubmit = () => {
    if (isValid) {
      onSubmit({ theme, budget, destination, travelers, searchMode: 'combo' });
    }
  };

  const isValid = mode === "fit" ? (budget && destination) : (theme && budget && destination);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[16px] p-5 shadow-sm border border-[#e5e5e5] mx-5 mb-4"
    >
      <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] mb-4">
        {mode === "fit" ? "ìì ì¬í ì ë³´ë¥¼ ìë ¤ì£¼ì¸ì" : "ì í¸íìë ì¬í ì ë³´ë¥¼ ìë ¤ì£¼ì¸ì"}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-[14px] text-[#666] mb-2">ì¬íì§</label>
          <input
            type="text"
            placeholder="ì: ë°ë¦¬, íë¦¬, ëì¿"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-3 rounded-[12px] bg-[#f5f5f5] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#7b3ff2]"
            style={{
              outlineColor: mode === "fit" ? "#7b3ff2" : "#3780ff"
            }}
          />
        </div>

        {/* í¨í¤ì§ ëª¨ëì¼ ëë§ íë§ ì í íì */}
        {mode === "package" && (
          <div>
            <label className="block text-[14px] text-[#666] mb-2">ì¬í íë§</label>
            <div className="flex flex-wrap gap-2">
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-full text-[14px] transition-colors ${
                    theme === t
                      ? "bg-[#3780ff] text-white"
                      : "bg-[#f5f5f5] text-[#666] hover:bg-[#e5e5e5]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-[14px] text-[#666] mb-2">ìì° (1ì¸ ê¸°ì¤)</label>
          <div className="grid grid-cols-2 gap-2">
            {budgets.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`px-4 py-3 rounded-[12px] text-[14px] transition-colors ${
                  budget === b
                    ? mode === "fit" 
                      ? "bg-[#7b3ff2] text-white"
                      : "bg-[#3780ff] text-white"
                    : "bg-[#f5f5f5] text-[#666] hover:bg-[#e5e5e5]"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[14px] text-[#666] mb-2">ëªëªì´ ë ëìëì?</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTravelers(Math.max(1, travelers - 1))}
              className="size-10 rounded-full bg-[#f5f5f5] text-[#111] font-['Pretendard:SemiBold',sans-serif] text-[18px] hover:bg-[#e5e5e5] transition-colors flex items-center justify-center"
            >
              â
            </button>
            <div className="flex-1 text-center">
              <span className="text-[24px] font-['Pretendard:Bold',sans-serif] text-[#111]">
                {travelers}
              </span>
              <span className="text-[16px] text-[#666] ml-1">ëª</span>
            </div>
            <button
              onClick={() => setTravelers(Math.min(10, travelers + 1))}
              className="size-10 rounded-full bg-[#f5f5f5] text-[#111] font-['Pretendard:SemiBold',sans-serif] text-[18px] hover:bg-[#e5e5e5] transition-colors flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* í¨í¤ì§ ëª¨ë: ë¨ì¼ ë²í¼ */}
        {mode === "package" && (
          <button
            onClick={handlePackageSubmit}
            disabled={!isValid}
            className="w-full py-3 rounded-[12px] bg-[#3780ff] text-white font-['Pretendard:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2d6fdf] transition-colors"
          >
            ì¬í ìí ì¶ì²ë°ê¸°
          </button>
        )}

        {/* ìì ì¬í ëª¨ë: 3ê° ë²í¼ */}
        {mode === "fit" && (
          <div className="space-y-2">
            <button
              onClick={() => handleSubmit('combo')}
              disabled={!isValid}
              className="w-full py-3 rounded-[12px] bg-[#7b3ff2] text-white font-['Pretendard:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
            >
              í­ê³µ+ìì ì¡°í© ê²ìíê¸°
            </button>
            <button
              onClick={() => handleSubmit('flight')}
              disabled={!isValid}
              className="w-full py-3 rounded-[12px] bg-[#7b3ff2] text-white font-['Pretendard:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
            >
              í­ê³µë§ ê²ìíê¸°
            </button>
            <button
              onClick={() => handleSubmit('hotel')}
              disabled={!isValid}
              className="w-full py-3 rounded-[12px] bg-[#7b3ff2] text-white font-['Pretendard:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
            >
              í¸íë§ ê²ìíê¸°
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}