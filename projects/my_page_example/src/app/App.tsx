import { Plane, Hotel, Package, Ticket, User, Gift, CreditCard, Zap, Home, Calendar, Settings, Heart } from 'lucide-react';

// 예약 타입
type ReservationType = 'flight' | 'hotel' | 'package' | 'ticket';

// 예약 데이터 인터페이스
interface Reservation {
  id: string;
  type: ReservationType;
  title: string;
  destination: string;
  date: string;
  time: string;
  status: string;
  details: string;
  timestamp: Date;
}

export default function App() {
  // 모의 데이터
  const customerName = "김여행";
  const customerGrade = "VIP";
  const discountCoupons = 3;
  const giftCard = 50000;
  const voucher = 100000;
  const mileage = 15420;

  // 예약 내역 (체크인/출발 시간 기준 내림차순)
  const reservations: Reservation[] = [
    {
      id: '1',
      type: 'flight',
      title: '인천 → 파리',
      destination: '프랑스 파리',
      date: '2026-02-15',
      time: '14:30',
      status: '예약 완료',
      details: '대한항공 KE901',
      timestamp: new Date('2026-02-15T14:30:00')
    },
    {
      id: '2',
      type: 'hotel',
      title: '르 메리디앙 에투알',
      destination: '프랑스 파리',
      date: '2026-02-15',
      time: '15:00',
      status: '예약 확정',
      details: '디럭스 더블룸 · 3박',
      timestamp: new Date('2026-02-15T15:00:00')
    },
    {
      id: '3',
      type: 'ticket',
      title: '에펠탑 전망대',
      destination: '프랑스 파리',
      date: '2026-02-16',
      time: '10:00',
      status: '발권 완료',
      details: '성인 2매',
      timestamp: new Date('2026-02-16T10:00:00')
    },
    {
      id: '4',
      type: 'package',
      title: '제주도 3박 4일',
      destination: '제주도',
      date: '2026-03-10',
      time: '09:00',
      status: '예약 완료',
      details: '항공 + 호텔 + 렌터카',
      timestamp: new Date('2026-03-10T09:00:00')
    },
    {
      id: '5',
      type: 'flight',
      title: '파리 → 인천',
      destination: '대한민국 서울',
      date: '2026-02-18',
      time: '18:45',
      status: '예약 완료',
      details: '대한항공 KE902',
      timestamp: new Date('2026-02-18T18:45:00')
    }
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // 예약 타입별 아이콘
  const getIcon = (type: ReservationType) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-5 h-5" />;
      case 'hotel':
        return <Hotel className="w-5 h-5" />;
      case 'package':
        return <Package className="w-5 h-5" />;
      case 'ticket':
        return <Ticket className="w-5 h-5" />;
    }
  };

  // 예약 타입별 색상
  const getTypeColor = (type: ReservationType) => {
    switch (type) {
      case 'flight':
        return 'bg-blue-50 text-blue-600';
      case 'hotel':
        return 'bg-green-50 text-green-600';
      case 'package':
        return 'bg-purple-50 text-purple-600';
      case 'ticket':
        return 'bg-orange-50 text-orange-600';
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 1행 - 고객 정보 */}
      <div className="bg-[rgb(94,43,184)] text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{customerName}</h1>
              <span className="inline-block mt-1 px-3 py-0.5 bg-yellow-400 text-[rgb(94,43,184)] text-sm font-semibold rounded-full">
                {customerGrade}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2행 - 포인트/쿠폰 정보 */}
      <div className="px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-[rgb(94,43,184)] rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">할인쿠폰</p>
                <p className="text-lg font-bold text-[rgb(94,43,184)]">{discountCoupons}장</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-[rgb(94,43,184)] rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">상품권</p>
                <p className="text-lg font-bold text-[rgb(94,43,184)]">
                  {voucher.toLocaleString()}원
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-[rgb(94,43,184)] rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">기프트카드</p>
                <p className="text-lg font-bold text-[rgb(94,43,184)]">
                  {giftCard.toLocaleString()}원
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-[rgb(94,43,184)] rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">마일리지</p>
                <p className="text-lg font-bold text-[rgb(94,43,184)]">
                  {mileage.toLocaleString()}P
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3행 - 예약 내역 */}
      <div className="px-4 mt-8">
        <h2 className="text-lg font-bold mb-4">예약 내역</h2>

        <div className="relative">
          {/* 타임라인 선 */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-6">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="relative pl-16">
                {/* 타임라인 점 */}
                <div className={`absolute left-3 top-3 w-6 h-6 rounded-full flex items-center justify-center ${getTypeColor(reservation.type)}`}>
                  {getIcon(reservation.type)}
                </div>

                {/* 예약 카드 */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{reservation.title}</h3>
                      <p className="text-sm text-gray-500">{reservation.destination}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-[rgb(94,43,184)]/10 text-[rgb(94,43,184)] rounded-full font-medium">
                      {reservation.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>{reservation.date} {reservation.time}</span>
                  </div>

                  <p className="text-sm text-gray-500">{reservation.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4행 - 마이메뉴 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
          <button className="flex flex-col items-center gap-1 py-2 text-[rgb(94,43,184)]">
            <Home className="w-6 h-6" />
            <span className="text-xs">홈</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 text-gray-400">
            <Calendar className="w-6 h-6" />
            <span className="text-xs">예약</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 text-gray-400">
            <Heart className="w-6 h-6" />
            <span className="text-xs">찜</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 text-gray-400">
            <Settings className="w-6 h-6" />
            <span className="text-xs">설정</span>
          </button>
        </div>
      </div>
    </div>
  );
}
