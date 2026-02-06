import { motion } from "motion/react";
import { PackageData } from "./PackageCard";
import { X } from "lucide-react";

interface PackageComparisonProps {
  packages: PackageData[];
  onClose: () => void;
  onSelect: (pkg: PackageData) => void;
}

export function PackageComparison({ packages, onClose, onSelect }: PackageComparisonProps) {
  // ìµë 3ê°ê¹ì§ë§ ë¹êµ
  const displayPackages = packages.slice(0, 3);
  const labels = ["A", "B", "C"];

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
        {/* í¤ë */}
        <div className="sticky top-0 bg-gradient-to-b from-[#eed6ff] to-[#f7f5fe] border-b border-[#f0f0f0] z-10">
          <div className="px-5 pt-4 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6">
                <svg className="size-full" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#7b3ff2"/>
                  <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">AI</text>
                </svg>
              </div>
              <h2 className="font-['Pretendard:Bold',sans-serif] text-[20px] text-[#101828]">AI ë¹êµ ë¸ë¦¬í</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <X className="size-5" />
            </button>
          </div>
          <p className="px-5 pb-4 text-[14px] text-[#8e8e93]">
            AIê° ì¬í ì¡°ê±´ì ë§ë ìíì ë¶ì í´ëë ¤ì.
          </p>
        </div>

        <div className="px-5 pt-4">
          {/* ì¬í ëë°ì / íë§ ì í í­ */}
          <div className="bg-white rounded-[14px] shadow-[0px_4px_7px_0px_rgba(0,0,0,0.1)] border-b border-[#e5e7eb] mb-4">
            <div className="flex h-[65px]">
              <button className="flex-1 flex flex-col items-center justify-center gap-1 border-b-[3px] border-[#7b3ff2]">
                <svg className="size-4" viewBox="0 0 16 16" fill="none">
                  <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" stroke="#7b3ff2" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 16V14C2 12.9391 2.42143 11.9217 3.17157 11.1716C3.92172 10.4214 4.93913 10 6 10H10C11.0609 10 12.0783 10.4214 12.8284 11.1716C13.5786 11.9217 14 12.9391 14 14V16" stroke="#7b3ff2" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[14px] text-[#7b3ff2] font-['Pretendard:Bold',sans-serif]">ì¬í ëë°ì</span>
              </button>
              <button className="flex-1 flex flex-col items-center justify-center gap-1">
                <svg className="size-4" viewBox="0 0 16 16" fill="none">
                  <path d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z" stroke="#4a5565" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.3333 2V4.66667M14.6667 3.33333H12M2.66667 11.3333V12.6667M3.33333 12H2" stroke="#4a5565" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[14px] text-[#4a5565] font-['Pretendard:Regular',sans-serif]">ì¬í íë§</span>
              </button>
            </div>
          </div>

          {/* ëë°ì íê·¸ ì í */}
          <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
            <div className="px-4 py-2 bg-gradient-to-b from-[#6976ff] to-[#7b3ff2] rounded-full">
              <span className="text-[13px] text-white">ìì´ ëë°</span>
            </div>
            <div className="px-4 py-2 bg-[#e9e5fb] rounded-full">
              <span className="text-[13px] text-[#4a5565]">ë¶ëª¨ë í¨ë</span>
            </div>
            <div className="px-4 py-2 bg-[#e9e5fb] rounded-full">
              <span className="text-[13px] text-[#4a5565]">ì»¤íÂ·ì¹êµ¬</span>
            </div>
            <div className="px-4 py-2 bg-[#e9e5fb] rounded-full">
              <span className="text-[13px] text-[#4a5565]">ê°ì±ë¹ ì¤ì</span>
            </div>
          </div>

          {/* AI ë¸ë¦¬í */}
          <div className="bg-white rounded-[10px] p-4 mb-4 border border-[#f0f0f0]">
            <p className="text-[15px] text-[#7b3ff2] font-['Pretendard:Bold',sans-serif] mb-3">
              "ìì´ì í¨ê»ë¼ë©´ ì´ë ë¶ë´ì´ ì ê³  ìì ë´ ë¶ëìì¤ íì©ëê° ëì ìíì´ ì í©í©ëë¤."
            </p>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-[16px] text-[#00d9c0]">â¢</span>
                <div className="flex items-start gap-2">
                  <div className="size-5 bg-[rgba(123,63,242,0.1)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] text-[#7b3ff2]">A</span>
                  </div>
                  <p className="text-[14px] text-[#364153] leading-[1.5]">
                    í¤ì¦ íê³¼ ìí°íí¬ê° ìë ë¦¬ì¡°í¸í ììë¡ ìì´ë¤ì´ ì¦ê¸¸ ê±°ë¦¬ê° íë¶í©ëë¤
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-[16px] text-[#00d9c0]">â¢</span>
                <div className="flex items-start gap-2">
                  <div className="size-5 bg-[rgba(123,63,242,0.1)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] text-[#7b3ff2]">B</span>
                  </div>
                  <p className="text-[14px] text-[#364153] leading-[1.5]">
                    ì´ë ìê°ì´ ê°ì¥ ì§§ê³  ìì ìê°ì´ ë§ì ìì´ë¤ ì²´ë ¥ ê´ë¦¬ì ì ë¦¬í©ëë¤
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-[16px] text-[#00d9c0]">â¢</span>
                <div className="flex items-start gap-2">
                  <div className="size-5 bg-[rgba(123,63,242,0.1)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] text-[#7b3ff2]">C</span>
                  </div>
                  <p className="text-[14px] text-[#364153] leading-[1.5]">
                    ê°ì¡± ë¨ì ì¬íê°ì ìí í¨ë°ë¦¬ë£¸ êµ¬ì±ì¼ë¡ í¸ìí í´ìì´ ê°ë¥í©ëë¤
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ë¹êµ íì´ë¸ */}
          <div className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left p-3 text-[12px] text-[#4a5565] font-['Pretendard:Regular',sans-serif] w-[80px]">
                    ìíëª
                  </th>
                  {displayPackages.map((pkg, index) => (
                    <td key={pkg.id} className="p-3 text-center border-l border-[#e5e7eb]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-6 bg-[rgba(123,63,242,0.1)] rounded-full flex items-center justify-center">
                          <span className="text-[#7b3ff2] text-[12px] font-['Pretendard:Bold',sans-serif]">
                            {labels[index]}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-[13px] font-['Pretendard:Bold',sans-serif] text-[#7b3ff2]">
                            {(pkg.price / 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          </p>
                          <p className="text-[11px] text-[#6a7282]">ë§ì</p>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* ë¸ëë */}
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">ë¸ëë</td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {pkg.destination.split(',')[0]}
                    </td>
                  ))}
                </tr>

                {/* í­ê³µì¬ */}
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">í­ê³µì¬</td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {pkg.airline}
                    </td>
                  ))}
                </tr>

                {/* ì¶ë°ê³µí­ */}
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">ì¶ë°ê³µí­</td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      ì¸ì²ê³µí­
                    </td>
                  ))}
                </tr>

                {/* ì¼ì  */}
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">ì¼ì </td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {pkg.duration}
                    </td>
                  ))}
                </tr>

                {/* í¬í¨ê¸ì¡ */}
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">í¬í¨ê¸ì¡</td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {pkg.highlights.length}í­ëª©
                    </td>
                  ))}
                </tr>

                {/* íì  */}
                <tr>
                  <td className="p-3 text-[12px] text-[#4a5565]">íì </td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center border-l border-[#e5e7eb]">
                      <div className="flex items-center justify-center gap-1">
                        <svg className="size-3.5 fill-[#FFB800]" viewBox="0 0 16 16">
                          <path d="M8 0L10.472 5.008L16 5.856L12 9.712L12.944 15.232L8 12.616L3.056 15.232L4 9.712L0 5.856L5.528 5.008L8 0Z"/>
                        </svg>
                        <span className="text-[12px] text-[#111]">{pkg.rating}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* ìí ì¹´ë */}
          <div className="space-y-3">
            {displayPackages.map((pkg, index) => (
              <div key={pkg.id} className="border border-[#e5e5e5] rounded-[12px] overflow-hidden">
                <div className="p-4">
                  <div className="flex gap-3 mb-3">
                    <div className="relative">
                      <img src={pkg.image} alt={pkg.title} className="w-[80px] h-[80px] object-cover rounded-[8px]" />
                      <div className="absolute -top-2 -left-2 size-6 bg-[#7b3ff2] rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-[12px] font-['Pretendard:Bold',sans-serif]">
                          {labels[index]}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] mb-1 line-clamp-2">
                        {pkg.title}
                      </h4>
                      <p className="text-[12px] text-[#999] mb-2">{pkg.duration}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#3780ff]">
                          {(pkg.price / 10000).toFixed(0)}ë§ì
                        </span>
                        <span className="text-[12px] text-[#999]">~</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelect(pkg)}
                    className="w-full py-2.5 bg-[#3780ff] text-white rounded-[8px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#2d6fdf] transition-colors"
                  >
                    ì´ ìí ì ííê¸°
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}