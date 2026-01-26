import { Star } from 'lucide-react';
import { useState, useRef } from 'react';

const products = [
  {
    id: 'A',
    name: '발리 패밀리 리조트',
    fullName: '[출발확정] ★무조건출발★[특가] 규슈/사가/우레시노 3일 #소도시감성 #우레시노미인온천♨ #유후인&벳부&다자이후 #라라포트쇼핑몰 #호텔뷔페식&대게무제한특전♥',
    price: '1,290,000',
    brand: '프리미엄',
    duration: '4박5일',
    rating: '4.8',
    hotel: '5성급',
    meals: '조식 4회',
    freeTime: '40%',
    shopping: '1회',
    highlight: '키즈클럽 무료'
  },
  {
    id: 'B',
    name: '푸켓 럭셔리 투어',
    fullName: '다낭 5일 #시내 4성호텔 #바나힐 테마파크 #호이안 #전신마사지 #캔들라이트 디너',
    price: '1,890,000',
    brand: '프리미엄',
    duration: '4박5일',
    rating: '4.9',
    hotel: '5성급',
    meals: '전일정',
    freeTime: '25%',
    shopping: '2회',
    highlight: '스파 무료'
  },
  {
    id: 'C',
    name: '방콕 자유 여행',
    fullName: '[출발확정] 오키나와 3일 #아동동반추천 #ANA만자비치 #나하시내숙박 #츄라우미수족관 #인기간식제공',
    price: '890,000',
    brand: '세이브',
    duration: '2박3일',
    rating: '4.5',
    hotel: '4성급',
    meals: '조식 3회',
    freeTime: '60%',
    shopping: '선택',
    highlight: '픽업 포함'
  },
];

export function ProductComparison() {
  const [tooltip, setTooltip] = useState<{ id: string; x: number; y: number; alignRight: boolean } | null>(null);
  const badgeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleMouseEnter = (productId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const tooltipWidth = 384;
    const windowWidth = window.innerWidth;

    const wouldOverflowRight = rect.left + rect.width / 2 + tooltipWidth / 2 > windowWidth - 16;

    setTooltip({
      id: productId,
      x: rect.left + rect.width / 2,
      y: rect.top,
      alignRight: wouldOverflowRight
    });
  };

  const handlePriceClick = (productId: string) => {
    const badgeEl = badgeRefs.current[productId];
    if (badgeEl) {
      const rect = badgeEl.getBoundingClientRect();
      const tooltipWidth = 384;
      const windowWidth = window.innerWidth;

      const wouldOverflowRight = rect.left + rect.width / 2 + tooltipWidth / 2 > windowWidth - 16;

      setTooltip({
        id: productId,
        x: rect.left + rect.width / 2,
        y: rect.top,
        alignRight: wouldOverflowRight
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <section className="relative">
      <div className="overflow-x-auto mt-[-50px] pb-[2px]">
        <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-zinc-100">
              <th className="px-3 py-3 text-left text-xs text-gray-600 font-medium border-b border-gray-200 w-24">
                상품명
              </th>
              {products.map((product) => (
                <th key={product.id} className="px-2 py-2 text-center border-b border-gray-200">
                  <div
                    ref={(el) => (badgeRefs.current[product.id] = el)}
                    className="inline-block px-2 py-1 bg-[#7B3FF2]/10 text-[#7B3FF2] rounded-full text-xs mb-1 cursor-pointer hover:bg-[#7B3FF2]/20 transition-colors"
                    onMouseEnter={(e) => handleMouseEnter(product.id, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => handleMouseEnter(product.id, e)}
                  >
                    {product.id}
                  </div>
                  <div
                    className="text-sm text-[#7B3FF2] font-bold text-[13px] whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity"
                    onMouseEnter={() => handlePriceClick(product.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handlePriceClick(product.id)}
                  >
                    {product.price}
                    <span className="text-xs text-gray-500 font-medium text-[11px] pl-[2px]">원</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Brand Row */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600 font-medium">브랜드</span>
                </div>
              </td>
              {products.map((product) => (
                <td key={product.id} className="px-3 py-3 text-center text-xs text-gray-900 border-b border-gray-200">
                  {product.brand}
                </td>
              ))}
            </tr>

            {/* Duration Row */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600 font-medium">일정</span>
                </div>
              </td>
              {products.map((product) => (
                <td key={product.id} className="px-3 py-3 text-center text-xs text-gray-900 border-b border-gray-200">
                  {product.duration}
                </td>
              ))}
            </tr>

            {/* Hotel Row */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600 font-medium text-[12px] whitespace-nowrap">호텔 등급</span>
                </div>
              </td>
              {products.map((product) => (
                <td key={product.id} className="px-3 py-3 text-center text-xs text-gray-900 border-b border-gray-200">
                  {product.hotel}
                </td>
              ))}
            </tr>

            {/* Shopping Row */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600 font-medium">쇼핑 횟수</span>
                </div>
              </td>
              {products.map((product) => (
                <td key={product.id} className="px-3 py-3 text-center text-xs text-gray-900 border-b border-gray-200">
                  {product.shopping}
                </td>
              ))}
            </tr>

            {/* Rating Row */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600 font-medium">평점</span>
                </div>
              </td>
              {products.map((product) => (
                <td key={product.id} className="px-3 py-3 text-center text-xs text-gray-900 border-b border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-[#7B3FF2] text-[#7B3FF2]" />
                    <span>{product.rating}</span>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {tooltip && (
        <div
          className="fixed bg-gray-100 text-gray-800 text-xs px-3 py-2 rounded shadow-lg pointer-events-none z-50 max-w-md"
          style={{
            left: tooltip.alignRight ? 'auto' : `${tooltip.x}px`,
            right: tooltip.alignRight ? '16px' : 'auto',
            top: `${tooltip.y}px`,
            transform: tooltip.alignRight ? 'translateY(calc(-100% - 8px))' : 'translate(-50%, calc(-100% - 8px))'
          }}
        >
          {products.find((product) => product.id === tooltip.id)?.fullName}
        </div>
      )}
    </section>
  );
}
