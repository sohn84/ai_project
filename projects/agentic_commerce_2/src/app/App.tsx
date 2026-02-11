import { useState, useEffect } from "react";
import { ChatMessage } from "./components/ChatMessage";
import { PreferenceInput } from "./components/PreferenceInput";
import { PackageCard, PackageData } from "./components/PackageCard";
import { PackageDetail } from "./components/PackageDetail";
import { PackageComparison } from "./components/PackageComparison";
import { FITPackageCard, FITPackageData } from "./components/FITPackageCard";
import { FlightCard, FlightData } from "./components/FlightCard";
import { HotelCard, HotelData } from "./components/HotelCard";
import { HotelDetail } from "./components/HotelDetail";
import { FlightDetail } from "./components/FlightDetail";
import { ActivityTicketSelector, ActivityTicket } from "./components/ActivityTicketSelector";
import { RoomTypeSelector, RoomType } from "./components/RoomTypeSelector";
import { BookingForm, BookingFormData } from "./components/BookingForm";
import { PaymentModal } from "./components/PaymentModal";
import { BookingConfirmation } from "./components/BookingConfirmation";

// 헤더 컴포넌트
function Header() {
  return (
    <div className="bg-white border-b border-[#f0f0f0] px-5 py-4 flex items-center">
      <button className="p-2 -ml-2">
        <svg className="size-6" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <h1 className="font-['Pretendard:Bold',sans-serif] text-[20px] text-[#111] ml-2">
        H-AI 하이
      </h1>
    </div>
  );
}

// 입력창 컴포넌트
function ChatInput({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="border-t border-[#f5f5f5] bg-white px-5 py-3">
      <div className="flex gap-2 items-center">
        <button className="p-2">
          <svg className="size-6" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#666" strokeWidth="1.5"/>
            <path d="M12 8V12L14 14" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="궁금하신 내용을 물어보세요!"
            className="w-full px-4 py-3 rounded-[24px] bg-[#f5f5f5] text-[14px] focus:outline-none"
          />
        </div>
        <button onClick={handleSend} className="p-2.5 bg-[#111] rounded-full">
          <svg className="size-5" viewBox="0 0 20 20" fill="none">
            <path d="M2 10L18 2L14 10L18 18L2 10Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// 목업 패키지 데이터
const mockPackages: PackageData[] = [
  {
    id: "1",
    title: "발리 5일 럭셔리 휴양 패키지 - 세미냐크 프라이빗 풀빌라",
    destination: "발리, 인도네시아",
    duration: "4박 5일",
    price: 1890000,
    image: "https://images.unsplash.com/photo-1589632732202-bd154e6e116d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwYmVhY2glMjByZXNvcnQlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzAyNzU4MTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviewCount: 342,
    airline: "대한항공",
    hotel: "더 레기안 발리",
    hotelGrade: "5성급 리조트",
    departure: "2026.03.15 (토)",
    availableSeats: 8,
    highlights: [
      "프라이빗 풀빌라 숙박",
      "스파 & 마사지 1회 포함",
      "우붓 전통시장 투어",
      "탄중 베노아 수상 스포츠",
      "발리 전통 무용 관람"
    ]
  },
  {
    id: "2",
    title: "산토리니 7일 낭만 여행 - 블루돔 뷰 호텔 & 와이너리 투어",
    destination: "산토리니, 그리스",
    duration: "5박 7일",
    price: 2650000,
    image: "https://images.unsplash.com/photo-1672622851784-0dbd3df4c088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b3JpbmklMjBncmVlY2UlMjB3aGl0ZSUyMGJ1aWxkaW5nc3xlbnwxfHx8fDE3NzAyNTU3MzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviewCount: 278,
    airline: "에미레이트 항공",
    hotel: "아틀란티스 호텔",
    hotelGrade: "5성급 부티크",
    departure: "2026.03.20 (목)",
    availableSeats: 5,
    highlights: [
      "블루돔 전망 객실",
      "에게해 선셋 크루즈",
      "와이너리 투어 & 시음",
      "이아 마을 자유시간",
      "전통 그리스 디너쇼"
    ]
  },
  {
    id: "3",
    title: "파리 6일 문화탐방 - 루브르 & 베르사유 궁전 포함",
    destination: "파리, 프랑스",
    duration: "4박 6일",
    price: 2390000,
    image: "https://images.unsplash.com/photo-1710195778783-a441adf75fda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyJTIwY2l0eXxlbnwxfHx8fDE3NzAyNzU4MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviewCount: 412,
    airline: "에어프랑스",
    hotel: "메르큐어 파리 센터",
    hotelGrade: "4성급",
    departure: "2026.03.18 (수)",
    availableSeats: 12,
    highlights: [
      "루브르 박물관 한국어 가이드",
      "베르사유 궁전 관람",
      "에펠탑 전망대 입장",
      "센강 유람선 탑승",
      "몽마르트 언덕 자유시간"
    ]
  },
  {
    id: "4",
    title: "도쿄 5일 자유여행 - 벚꽃 시즌 스페셜",
    destination: "도쿄, 일본",
    duration: "3박 5일",
    price: 1450000,
    image: "https://images.unsplash.com/photo-1620451978644-841acb416d6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGphcGFuJTIwY2hlcnJ5JTIwYmxvc3NvbXxlbnwxfHx8fDE3NzAyNzU4MTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviewCount: 523,
    airline: "아시아나",
    hotel: "신주쿠 프린스 호텔",
    hotelGrade: "4성급",
    departure: "2026.03.25 (수)",
    availableSeats: 15,
    highlights: [
      "우에노 공원 벚꽃 명소",
      "디즈니랜드 1일권 옵션",
      "하라주쿠/시부야 쇼핑",
      "스시 오마카세 디너",
      "온천 료칸 체험"
    ]
  },
  {
    id: "5",
    title: "몰디브 6일 올인클루시브 - 수상방 하니문 패키지",
    destination: "몰디브",
    duration: "4박 6일",
    price: 3850000,
    image: "https://images.unsplash.com/photo-1706753459618-31e52d7ca22d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMG9jZWFuJTIwcmVzb3J0fGVufDF8fHx8MTc3MDE5MTA0NXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5.0,
    reviewCount: 156,
    airline: "싱가포르 항공",
    hotel: "콘래드 몰디브 랑갈리",
    hotelGrade: "5성급 리조트",
    departure: "2026.03.22 (일)",
    availableSeats: 4,
    highlights: [
      "오버워터 수상방",
      "올인클루시브 (식사/음료)",
      "스노클링 & 다이빙",
      "커플 스파 & 마사지",
      "프라이빗 디너 세팅"
    ]
  }
];

// 목업 자유여행(FIT) 패키지 데이터
const mockFITPackages: FITPackageData[] = [
  {
    id: "fit1",
    flightInfo: {
      airline: "대한항공",
      departure: "인천",
      arrival: "파리",
      departureTime: "13:30",
      arrivalTime: "18:20",
      price: 1200000,
      seatClass: "이코노미",
      flightDuration: "약 12시간 50분",
    },
    hotelInfo: {
      name: "노보텔 파리 센터",
      grade: "4성급",
      location: "샹젤리제 거리 도보 5분",
      roomType: "슈페리어 더블룸",
      price: 680000,
    },
    totalPrice: 1880000,
    duration: "4박 6일",
    destination: "파리, 프랑스",
    passengerCount: 2,
  },
  {
    id: "fit2",
    flightInfo: {
      airline: "아시아나",
      departure: "인천",
      arrival: "도쿄",
      departureTime: "09:00",
      arrivalTime: "11:30",
      price: 450000,
      seatClass: "이코노미",
      flightDuration: "약 2시간 30분",
    },
    hotelInfo: {
      name: "신주쿠 그랜비아 호텔",
      grade: "4성급",
      location: "신주쿠역 직결",
      roomType: "스탠다드 트윈룸",
      price: 520000,
    },
    totalPrice: 970000,
    duration: "3박 5일",
    destination: "도쿄, 일본",
    passengerCount: 2,
  },
  {
    id: "fit3",
    flightInfo: {
      airline: "에미레이트 항공",
      departure: "인천",
      arrival: "발리",
      departureTime: "22:45",
      arrivalTime: "06:30+1",
      price: 850000,
      seatClass: "비즈니스",
      flightDuration: "약 7시간 45분",
    },
    hotelInfo: {
      name: "세미냐크 비치 리조트",
      grade: "5성급",
      location: "세미냐크 해변가",
      roomType: "프라이빗 풀빌라",
      price: 1100000,
    },
    totalPrice: 1950000,
    duration: "4박 5일",
    destination: "발리, 인도네시아",
    passengerCount: 2,
  },
];

// 목업 액티비티 티켓 데이터
const mockActivityTickets: ActivityTicket[] = [
  {
    id: "act1",
    title: "에펠탑 우선 입장권 + 센강 유람선",
    location: "파리 7구, 샹드마르스",
    duration: "약 3시간",
    price: 85000,
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400",
    category: "명소 입장권",
  },
  {
    id: "act2",
    title: "베르사유 궁전 가이드 투어",
    location: "베르사유",
    duration: "약 4시간",
    price: 95000,
    image: "https://images.unsplash.com/photo-1609949279531-cf48d64bedce?w=400",
    category: "가이드 투어",
  },
  {
    id: "act3",
    title: "루브르 박물관 한국어 오디오 가이드",
    location: "파리 1구, 루브르",
    duration: "약 2.5시간",
    price: 45000,
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400",
    category: "명소 입장권",
  },
];

// 목업 항공편 데이터
const mockFlights: FlightData[] = [
  {
    id: "flight1",
    airline: "대한항공",
    departure: "인천",
    arrival: "파리",
    departureTime: "13:30",
    arrivalTime: "18:20",
    price: 1200000,
    seatClass: "이코노미",
    flightDuration: "약 12시간 50분",
    destination: "파리, 프랑스",
    passengerCount: 2,
    isDirect: true,
    departureAirport: "인천국제공항 (ICN)",
    arrivalAirport: "샤를 드 골 국제공항 (CDG)",
    baggage: "23kg 2개",
    flightNumber: "KE901",
  },
  {
    id: "flight2",
    airline: "에어프랑스",
    departure: "인천",
    arrival: "파리",
    departureTime: "19:00",
    arrivalTime: "23:45",
    price: 1350000,
    seatClass: "이코노미",
    flightDuration: "약 13시간 45분",
    destination: "파리, 프랑스",
    passengerCount: 2,
    isDirect: true,
    departureAirport: "인천국제공항 (ICN)",
    arrivalAirport: "샤를 드 골 국제공항 (CDG)",
    baggage: "23kg 1개",
    flightNumber: "AF266",
  },
  {
    id: "flight3",
    airline: "에미레이트 항공",
    departure: "인천",
    arrival: "파리",
    departureTime: "10:00",
    arrivalTime: "19:30",
    price: 1800000,
    seatClass: "비즈니스",
    flightDuration: "약 14시간 30분 (1회 경유)",
    destination: "파리, 프랑스",
    passengerCount: 2,
    isDirect: false,
    departureAirport: "인천국제공항 (ICN)",
    arrivalAirport: "샤를 드 골 국제공항 (CDG)",
    baggage: "30kg 2개",
    flightNumber: "EK322",
  },
];

// 목업 호텔 데이터
const mockHotels: HotelData[] = [
  {
    id: "hotel1",
    name: "노보텔 파리 센터",
    grade: "4성급",
    location: "샹젤리제 거리 도보 5분",
    roomType: "슈페리어 더블룸",
    price: 680000,
    destination: "파리, 프랑스",
    passengerCount: 2,
  },
  {
    id: "hotel2",
    name: "호텔 루브르 마르상",
    grade: "3성급",
    location: "루브르 박물관 인근",
    roomType: "스탠다드 트윈룸",
    price: 520000,
    destination: "파리, 프랑스",
    passengerCount: 2,
  },
  {
    id: "hotel3",
    name: "쇼몽 엘리제",
    grade: "5성급",
    location: "에펠탑 전망 특급",
    roomType: "디럭스 스위트",
    price: 1200000,
    destination: "파리, 프랑스",
    passengerCount: 2,
  },
];

// 목업 룸타입 데이터
const mockRoomTypes: { [hotelId: string]: RoomType[] } = {
  "hotel1": [
    {
      id: "room1-1",
      name: "슈페리어 더블룸",
      bedType: "더블 베드 1개",
      capacity: "성인 2명",
      size: "25㎡",
      price: 0,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연"]
    },
    {
      id: "room1-2",
      name: "디럭스 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "28㎡",
      price: 50000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room1-3",
      name: "이그제큐티브 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명 + 어린이 1명",
      size: "45㎡",
      price: 150000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소"]
    }
  ],
  "hotel2": [
    {
      id: "room2-1",
      name: "스탠다드 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "22㎡",
      price: 0,
      amenities: ["무료 Wi-Fi", "에어컨", "금연"]
    },
    {
      id: "room2-2",
      name: "스탠다드 더블룸",
      bedType: "더블 베드 1개",
      capacity: "성인 2명",
      size: "22㎡",
      price: 0,
      amenities: ["무료 Wi-Fi", "에어컨", "금연"]
    },
    {
      id: "room2-3",
      name: "슈페리어 더블룸",
      bedType: "퀸 베드 1개",
      capacity: "성인 2명",
      size: "26㎡",
      price: 35000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "거리뷰"]
    }
  ],
  "hotel3": [
    {
      id: "room3-1",
      name: "디럭스 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "55㎡",
      price: 0,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "에펠탑뷰", "욕조", "네스프레소"]
    },
    {
      id: "room3-2",
      name: "프레스티지 스위트",
      bedType: "킹 베드 1개 + 소파베드",
      capacity: "성인 2명 + 어린이 2명",
      size: "75㎡",
      price: 200000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "에펠탑뷰", "욕조", "네스프레소", "거실", "발코니"]
    },
    {
      id: "room3-3",
      name: "로얄 펜트하우스",
      bedType: "킹 베드 2개",
      capacity: "성인 4명",
      size: "120㎡",
      price: 500000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "에펠탑뷰", "욕조", "네스프레소", "거실", "발코니", "주방", "다이닝룸"]
    }
  ],
  // FIT 패키지용 룸타입
  "fit1": [
    {
      id: "room1-1",
      name: "슈페리어 더블룸",
      bedType: "더블 베드 1개",
      capacity: "성인 2명",
      size: "25㎡",
      price: 0,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연"]
    },
    {
      id: "room1-2",
      name: "디럭스 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "28㎡",
      price: 50000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room1-3",
      name: "이그제큐티브 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명 + 어린이 1명",
      size: "45㎡",
      price: 150000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소"]
    }
  ],
  "fit2": [
    {
      id: "room2-1",
      name: "스탠다드 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "20㎡",
      price: 0,
      amenities: ["무료 Wi-Fi", "에어컨", "금연"]
    },
    {
      id: "room2-2",
      name: "모더레이트 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "24㎡",
      price: 30000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    }
  ],
  "fit3": [
    {
      id: "room3-1",
      name: "프라이빗 풀빌라",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "80㎡",
      price: 0,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "프라이빗 풀", "가든뷰", "야외 샤워", "욕조"]
    },
    {
      id: "room3-2",
      name: "디럭스 풀빌라",
      bedType: "킹 베드 1개 + 소파베드",
      capacity: "성인 2명 + 어린이 2명",
      size: "120㎡",
      price: 200000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "프라이빗 풀", "오션뷰", "야외 샤워", "욕조", "거실", "주방"]
    }
  ]
};

type Step = 
  | "initial"
  | "preference"
  | "packages"
  | "detail"
  | "comparison"
  | "availability"
  | "booking"
  | "payment"
  | "confirmed"
  | "fit-search"
  | "fit-packages"
  | "fit-activities"
  | "fit-summary";

export default function App() {
  const [step, setStep] = useState<Step>("initial");
  const [messages, setMessages] = useState<Array<{ type: "user" | "bot"; content: React.ReactNode }>>([]);
  const [showPreferenceInput, setShowPreferenceInput] = useState(false);
  const [recommendedPackages, setRecommendedPackages] = useState<PackageData[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [comparisonPackages, setComparisonPackages] = useState<PackageData[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);
  const [bookingNumber, setBookingNumber] = useState("");
  const [bookingMessages, setBookingMessages] = useState<Array<{ type: "user" | "bot"; content: React.ReactNode }>>([]);
  
  // 자유여행(FIT) 관련 상태
  const [travelType, setTravelType] = useState<"package" | "fit" | null>(null);
  const [fitPackages, setFitPackages] = useState<FITPackageData[]>([]);
  const [selectedFitPackage, setSelectedFitPackage] = useState<FITPackageData | null>(null);
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [fitTotalPrice, setFitTotalPrice] = useState(0);
  const [fitSearchMode, setFitSearchMode] = useState<'combo' | 'flight' | 'hotel'>('combo');
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<FlightData | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);
  const [showFlightBooking, setShowFlightBooking] = useState(false);
  const [showHotelBooking, setShowHotelBooking] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [showHotelDetail, setShowHotelDetail] = useState(false);
  const [showFlightDetail, setShowFlightDetail] = useState(false);

  // 룸타입 선택 관련 상태
  const [showRoomTypeSelector, setShowRoomTypeSelector] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [currentHotelForRoomSelection, setCurrentHotelForRoomSelection] = useState<string>("");

  // 초기 메시지 표시
  const showInitialMessage = () => {
    setMessages([
      {
        type: "bot",
        content: (
          <div>
            <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
              안녕하세요. <span className="font-['Pretendard:Bold',sans-serif]">H-AI (하이)</span> 입니다.
            </p>
            <p className="text-[14px] text-[#111] leading-[1.5]">
              여행 일정과 정보를 물어보시거나,<br/>
              궁금하신 점을 입력창에 입력해 주세요.
            </p>
          </div>
        )
      }
    ]);
  };

  // 채팅 메시지 전송
  const handleSendMessage = (message: string) => {
    const userMessage = { type: "user" as const, content: message };
    setMessages(prev => [...prev, userMessage]);

    // 메시지 분석 및 응답
    setTimeout(() => {
      if (message.includes("여행") || message.includes("패키지") || message.includes("추천")) {
        // 여행 타입 선택 메시지
        setMessages(prev => [...prev, {
          type: "bot",
          content: (
            <div>
              <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
                자유여행을 선호하세요? 아니면 편한 패키지 상품을 추천해드릴까요?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTravelTypeSelect("fit")}
                  className="flex-1 py-3 bg-[#7b3ff2] text-white rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
                >
                  자유여행
                </button>
                <button
                  onClick={() => handleTravelTypeSelect("package")}
                  className="flex-1 py-3 bg-[#3780ff] text-white rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#2563eb] transition-colors"
                >
                  패키지 상품
                </button>
              </div>
            </div>
          )
        }]);
      } else if (message.includes("비교")) {
        handleComparePackages();
      } else if (message.includes("자유여행")) {
        handleTravelTypeSelect("fit");
      } else {
        setMessages(prev => [...prev, {
          type: "bot",
          content: "더 자세한 정보가 필요하시면 구체적으로 질문해 주세요!"
        }]);
      }
    }, 500);
  };

  // 여행 타입 선택 핸들러
  const handleTravelTypeSelect = (type: "package" | "fit") => {
    setTravelType(type);
    setMessages(prev => [...prev, {
      type: "user",
      content: type === "fit" ? "자유여행" : "패키지 상품"
    }]);
    
    if (type === "package") {
      // 패키지 플로우
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: "bot",
          content: "원하시는 여행 정보를 입력해 주시면 맞춤 패키지를 추천해 드릴게요! 😊"
        }]);
        setShowPreferenceInput(true);
        setStep("preference");
      }, 500);
    } else {
      // 자유여행 플로우 - 여행 정보 입력
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: "bot",
          content: "여행지와 예산을 알려주시면 최적의 항공+숙소 조합을 찾아드릴게요! ✈️"
        }]);
        setShowPreferenceInput(true);
        setStep("preference");
      }, 500);
    }
  };

  // 선호도 제출
  const handlePreferenceSubmit = (data: { theme: string; budget: string; destination: string; searchMode?: 'combo' | 'flight' | 'hotel' }) => {
    setShowPreferenceInput(false);
    
    if (travelType === "fit") {
      // 자유여행 플로우
      const mode = data.searchMode || 'combo';
      setFitSearchMode(mode);
      
      let searchTypeText = "항공편과 숙소를";
      if (mode === 'flight') searchTypeText = "항공편을";
      if (mode === 'hotel') searchTypeText = "숙소를";
      
      setMessages(prev => [...prev, 
        { 
          type: "user", 
          content: mode === 'combo' ? '항공+숙소 조합 검색하기' : mode === 'flight' ? '항공만 검색하기' : '호텔만 검색하기'
        }
      ]);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: "bot",
          content: `${searchTypeText} 실시간으로 검색하고 있습니다...`
        }]);
        setStep("fit-search");
      }, 500);

      // 검색 모드에 따라 다른 결과 표시
      setTimeout(() => {
        if (mode === 'combo') {
          // 항공+숙소 조합
          setFitPackages(mockFITPackages);
          setMessages(prev => [...prev, {
            type: "bot",
            content: `${data.destination}로 ${data.budget} 예산에 맞는 최적의 항공+숙소 조합을 찾았습니다! 총 ${mockFITPackages.length}개의 추천 조합을 확인해보세요. 😊`
          }]);
        } else if (mode === 'flight') {
          // 항공만
          setFlights(mockFlights);
          setMessages(prev => [...prev, {
            type: "bot",
            content: `${data.destination}행 항공편을 찾았습니다! 총 ${mockFlights.length}개의 추천 항공편을 확인해보세요. ✈️`
          }]);
        } else {
          // 호텔만
          setHotels(mockHotels);
          setMessages(prev => [...prev, {
            type: "bot",
            content: `${data.destination}의 숙소를 찾았습니다! 총 ${mockHotels.length}개의 추천 숙소를 확인해보세요. 🏨`
          }]);
        }
        setStep("fit-packages");
      }, 2000);
    } else {
      // 패키지 플로우
      setMessages(prev => [...prev, 
        { 
          type: "user", 
          content: `${data.destination} / ${data.theme} / ${data.budget}` 
        }
      ]);

      setTimeout(() => {
        // 예산에 따른 패키지 필터링
        const budgetRange = data.budget;
        let filtered = mockPackages;
        
        if (budgetRange === "100만원 이하") {
          filtered = mockPackages.filter(p => p.price < 1500000);
        } else if (budgetRange === "100-200만원") {
          filtered = mockPackages.filter(p => p.price >= 1000000 && p.price <= 2000000);
        } else if (budgetRange === "200-300만원") {
          filtered = mockPackages.filter(p => p.price >= 2000000 && p.price <= 3000000);
        }

        setRecommendedPackages(filtered.slice(0, 5));
        setMessages(prev => [...prev, {
          type: "bot",
          content: `${data.destination}의 ${data.theme} 테마로 ${data.budget} 예산에 맞는 상품을 찾았습니다! 총 ${filtered.slice(0, 5).length}개의 추천 상품을 확인해보세요. 😊`
        }]);
        setStep("packages");
      }, 1000);
    }
  };

  // 패키지 상세보기
  const handlePackageClick = (pkg: PackageData) => {
    setSelectedPackage(pkg);
    setShowDetail(true);
    setMessages(prev => [...prev, 
      { type: "user", content: `${pkg.title} 상세 정보 보기` },
      { 
        type: "bot", 
        content: "상품의 상세 정보를 확인하실 수 있습니다. 일정, 포함/불포함 사항을 자세히 안내해 드렸습니다!" 
      }
    ]);
  };

  // 패키지 비교
  const handleComparePackages = () => {
    if (recommendedPackages.length >= 2) {
      setComparisonPackages(recommendedPackages.slice(0, 3));
      setShowComparison(true);
      setMessages(prev => [...prev, 
        { type: "user", content: "상품 비교해주세요" },
        { 
          type: "bot", 
          content: "선택하신 상품들의 가격, 숙소등급, 항공사 등을 비교해 드립니다!" 
        }
      ]);
    }
  };

  // 예약하기
  const handleBooking = (pkg: PackageData) => {
    setSelectedPackage(pkg);
    setShowDetail(false);
    setShowComparison(false);
    
    // bookingMessages 초기화 및 1. [예약하기] 클릭 시 사용자 메시지 추가
    setBookingMessages([
      { type: "user", content: "예약하기" }
    ]);

    // 2. 대화창에서 실시간으로 출발 가능 여부와 잔여석 확인 중 메시지 표시
    setTimeout(() => {
      setBookingMessages(prev => [...prev, { 
        type: "bot", 
        content: "실시간으로 출발 가능 여부와 잔여석을 확인하고 있습니다..." 
      }]);
    }, 500);

    // 3. 실시간 좌석 정보 한번 더 체크, 예약 가능 시 [예약자 정보 입력 버튼] 표시
    setTimeout(() => {
      if (pkg.availableSeats > 0) {
        setBookingMessages(prev => [...prev, {
          type: "bot",
          content: (
            <div>
              <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
                ✅ 예약 가능합니다! 현재 <span className="font-['Pretendard:Bold',sans-serif] text-[#3780ff]">{pkg.availableSeats}석</span>이 남아있습니.
              </p>
              <button
                onClick={() => {
                  setShowBookingForm(true);
                  setStep("booking");
                }}
                className="w-full py-3 bg-[#3780ff] text-white rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#2563eb] transition-colors"
              >
                예약자 정보 입력
              </button>
            </div>
          )
        }]);
      } else {
        setBookingMessages(prev => [...prev, {
          type: "bot",
          content: "😔 죄송합니다. 해당 상품은 현재 매진되었습니다. 유사한 대안 상품을 추천해 드릴까요?"
        }]);
      }
    }, 2000);
  };

  // 자유여행 예약하기
  const handleFITBooking = () => {
    if (!selectedFitPackage) return;

    setMessages(prev => [...prev, { type: "user", content: "예약하기" }]);

    // 실시간 항공편과 숙소 가능 여부 확인
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: "bot",
        content: "실시간으로 항공편과 숙소 예약 가능 여부를 확인하고 있습니다..."
      }]);
    }, 500);

    // 예약 가능 시 룸타입 선택 버튼 표시
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: "bot",
        content: (
          <div>
            <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
              ✅ 예약 가능합니다! 선택하신 항공편과 숙소 모두 예약 가능합니다.
            </p>
            <button
              onClick={() => {
                setCurrentHotelForRoomSelection(selectedFitPackage.id);
                setShowRoomTypeSelector(true);
              }}
              className="w-full py-3 bg-[#7b3ff2] text-white rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
            >
              호텔 룸타입 선택
            </button>
          </div>
        )
      }]);
    }, 2000);
  };

  // 예약 정보 제출
  const handleBookingSubmit = (data: BookingFormData) => {
    setBookingData(data);
    setShowBookingForm(false);
    setMessages(prev => [...prev, 
      { type: "user", content: "예약 정보 제출 완료" },
      { 
        type: "bot", 
        content: "예약 정보를 확인했습니다. 결제를 진행해 주세요." 
      }
    ]);
    setShowPayment(true);
    setStep("payment");
  };

  // 결제 완료
  const handlePaymentSuccess = () => {
    setShowPayment(false);
    const confirmationNumber = `HAI${Date.now().toString().slice(-8)}`;
    setBookingNumber(confirmationNumber);
    
    setMessages(prev => [...prev, {
      type: "bot",
      content: "🎉 결제가 완료되었습니다! 예약이 확정되었습니다."
    }]);
    
    setShowConfirmation(true);
    setStep("confirmed");
  };

  // 초기 로드
  useEffect(() => {
    showInitialMessage();
  }, []);

  return (
    <div className="size-full flex flex-col bg-white max-w-[390px] mx-auto">
      <Header />
      
      <div className="flex-1 overflow-y-auto px-0 py-4">
        {messages.map((msg, index) => (
          <ChatMessage 
            key={index} 
            type={msg.type}
            showActions={msg.type === "bot" && index === messages.length - 1 && step === "packages"}
          >
            {msg.content}
          </ChatMessage>
        ))}

        {showPreferenceInput && (
          <PreferenceInput 
            onSubmit={handlePreferenceSubmit} 
            mode={travelType || "package"}
          />
        )}

        {step === "packages" && recommendedPackages.length > 0 && (
          <div className="px-5 space-y-4 mt-4">
            {recommendedPackages.map((pkg, index) => (
              <PackageCard 
                key={pkg.id} 
                package={pkg} 
                rank={index + 1}
                onClick={() => handlePackageClick(pkg)}
                onBooking={() => handleBooking(pkg)}
              />
            ))}
            {recommendedPackages.length >= 2 && (
              <button
                onClick={handleComparePackages}
                className="w-full py-3 bg-white border-2 border-[#3780ff] text-[#3780ff] rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f0f7ff] transition-colors"
              >
                상품 비교하기
              </button>
            )}

            {/* 예약하기 관련 메시지들 - 추천 상품 카드 아래에 표시 */}
            {bookingMessages.map((msg, index) => (
              <ChatMessage 
                key={`booking-${index}`} 
                type={msg.type}
              >
                {msg.content}
              </ChatMessage>
            ))}
          </div>
        )}

        {/* 자유여행 FIT 패키지 표시 (항공+숙소 조합) */}
        {step === "fit-packages" && fitSearchMode === 'combo' && fitPackages.length > 0 && (
          <div className="px-5 space-y-4 mt-4">
            {fitPackages.map((pkg, index) => (
              <FITPackageCard
                key={pkg.id}
                package={pkg}
                rank={index + 1}
                onClick={() => {
                  setSelectedFitPackage(pkg);
                  setMessages(prev => [...prev, {
                    type: "user",
                    content: `${pkg.destination} 조합 상세 보기`
                  }]);
                }}
                onBooking={() => {
                  setSelectedFitPackage(pkg);
                  setMessages(prev => [...prev, 
                    { type: "user", content: "이 조합으로 예약" },
                    { type: "bot", content: "숙소 주변의 인기 액티비티를 추천해드릴게요! 원하시는 상품을 선택해주세요." }
                  ]);
                  setStep("fit-activities");
                  setShowActivitySelector(true);
                }}
              />
            ))}
          </div>
        )}

        {/* 항공편만 표시 */}
        {step === "fit-packages" && fitSearchMode === 'flight' && flights.length > 0 && (
          <div className="px-5 space-y-4 mt-4">
            {flights.map((flight, index) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                rank={index + 1}
                onClick={() => {
                  setSelectedFlight(flight);
                  setShowFlightDetail(true);
                }}
                onBooking={() => {
                  setSelectedFlight(flight);
                  setFitTotalPrice(flight.price);
                  setShowFlightBooking(true);
                  setCheckingAvailability(true);
                  
                  // 실시간 재고 체크 시뮬레이션
                  setTimeout(() => {
                    setCheckingAvailability(false);
                  }, 2000);
                }}
              />
            ))}
            
            {/* 항공편 예약 확인 영역 - 리스트 하위 */}
            {showFlightBooking && selectedFlight && (
              <div className="bg-white rounded-[16px] p-4 shadow-sm border border-[#e5e5e5]">
                {checkingAvailability ? (
                  <div className="text-center py-4">
                    <div className="inline-block size-8 border-4 border-[#7b3ff2] border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-[14px] text-[#666]">실시간으로 항공편 예약 가능 여부를 확인하고 있습니다...</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
                      ✅ 예약 가능합니다! <span className="font-['Pretendard:Bold',sans-serif] text-[#7b3ff2]">{selectedFlight.airline} {selectedFlight.departure}→{selectedFlight.arrival}</span> 항공편을 예약할 수 있습니다.
                    </p>
                    <button
                      onClick={() => {
                        setShowFlightBooking(false);
                        setShowBookingForm(true);
                        setStep("booking");
                      }}
                      className="w-full py-3 bg-[#7b3ff2] text-white rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
                    >
                      예약자 정보 입력
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 호텔만 표시 */}
        {step === "fit-packages" && fitSearchMode === 'hotel' && hotels.length > 0 && (
          <div className="px-5 space-y-4 mt-4">
            {hotels.map((hotel, index) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                rank={index + 1}
                onClick={() => {
                  setSelectedHotel(hotel);
                  setShowHotelDetail(true);
                }}
                onBooking={() => {
                  setSelectedHotel(hotel);
                  setFitTotalPrice(hotel.price);
                  setShowHotelBooking(true);
                  setCheckingAvailability(true);
                  
                  // 실시간 재고 체크 시뮬레이션
                  setTimeout(() => {
                    setCheckingAvailability(false);
                  }, 2000);
                }}
              />
            ))}
            
            {/* 호텔 예약 확인 영역 - 리스트 하위 */}
            {showHotelBooking && selectedHotel && (
              <div className="bg-white rounded-[16px] p-4 shadow-sm border border-[#e5e5e5]">
                {checkingAvailability ? (
                  <div className="text-center py-4">
                    <div className="inline-block size-8 border-4 border-[#7b3ff2] border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-[14px] text-[#666]">실시간으로 숙소 예약 가능 여부를 확인하고 있습니다...</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
                      ✅ 예약 가능합니다! <span className="font-['Pretendard:Bold',sans-serif] text-[#7b3ff2]">{selectedHotel.name}</span> 숙소를 예약할 수 있습니다.
                    </p>
                    <button
                      onClick={() => {
                        setShowHotelBooking(false);
                        setCurrentHotelForRoomSelection(selectedHotel.id);
                        setShowRoomTypeSelector(true);
                      }}
                      className="w-full py-3 bg-[#7b3ff2] text-white rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
                    >
                      호텔 룸타입 선택
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 액티비티 선택 화면 */}
        {step === "fit-activities" && showActivitySelector && (
          <ActivityTicketSelector
            tickets={mockActivityTickets}
            onComplete={(selectedIds) => {
              setSelectedActivities(selectedIds);
              setShowActivitySelector(false);
              
              const activityPrice = mockActivityTickets
                .filter(t => selectedIds.includes(t.id))
                .reduce((sum, t) => sum + t.price, 0);
              
              const totalPrice = (selectedFitPackage?.totalPrice || 0) + activityPrice;
              setFitTotalPrice(totalPrice);

              setMessages(prev => [...prev, {
                type: "bot",
                content: (
                  <div>
                    <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
                      총 {selectedIds.length}개의 액티비티를 선택하셨습니다. 전체 여행 비용은 {totalPrice.toLocaleString()}원입니다. 예약을 진행하시겠어요?
                    </p>
                    <button
                      onClick={() => handleFITBooking()}
                      className="w-full py-3 bg-[#7b3ff2] text-white rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
                    >
                      예약하기
                    </button>
                  </div>
                )
              }]);
              setStep("fit-summary");
            }}
          />
        )}
      </div>

      <ChatInput onSend={handleSendMessage} />

      {showDetail && selectedPackage && (
        <PackageDetail 
          package={selectedPackage} 
          onClose={() => setShowDetail(false)}
          onBooking={() => handleBooking(selectedPackage)}
        />
      )}

      {showComparison && comparisonPackages.length > 0 && (
        <PackageComparison
          packages={comparisonPackages}
          onClose={() => setShowComparison(false)}
          onSelect={(pkg) => {
            setSelectedPackage(pkg);
            setShowComparison(false);
            setShowDetail(true);
          }}
        />
      )}

      {showBookingForm && selectedPackage && (
        <BookingForm
          packageTitle={selectedPackage.title}
          onSubmit={handleBookingSubmit}
          onCancel={() => setShowBookingForm(false)}
        />
      )}

      {showBookingForm && !selectedPackage && selectedFitPackage && (
        <BookingForm
          packageTitle={`${selectedFitPackage.destination} 자유여행 패키지`}
          onSubmit={handleBookingSubmit}
          onCancel={() => setShowBookingForm(false)}
        />
      )}

      {showBookingForm && !selectedPackage && !selectedFitPackage && selectedFlight && (
        <BookingForm
          packageTitle={`${selectedFlight.airline} ${selectedFlight.departure}→${selectedFlight.arrival} 항공편`}
          onSubmit={handleBookingSubmit}
          onCancel={() => setShowBookingForm(false)}
        />
      )}

      {showBookingForm && !selectedPackage && !selectedFitPackage && !selectedFlight && selectedHotel && (
        <BookingForm
          packageTitle={`${selectedHotel.name} 숙소`}
          onSubmit={handleBookingSubmit}
          onCancel={() => setShowBookingForm(false)}
        />
      )}

      {showPayment && selectedPackage && bookingData && (
        <PaymentModal
          amount={selectedPackage.price * bookingData.travelers}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}

      {showPayment && !selectedPackage && selectedFitPackage && bookingData && (
        <PaymentModal
          amount={fitTotalPrice * bookingData.travelers}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}

      {showConfirmation && selectedPackage && bookingData && (
        <BookingConfirmation
          bookingNumber={bookingNumber}
          packageTitle={selectedPackage.title}
          travelers={bookingData.travelers}
          amount={selectedPackage.price * bookingData.travelers}
          onClose={() => {
            setShowConfirmation(false);
            setStep("initial");
            showInitialMessage();
            setRecommendedPackages([]);
          }}
        />
      )}

      {showConfirmation && !selectedPackage && selectedFitPackage && bookingData && (
        <BookingConfirmation
          bookingNumber={bookingNumber}
          packageTitle={`${selectedFitPackage.destination} 자유여행 패키지`}
          travelers={bookingData.travelers}
          amount={fitTotalPrice * bookingData.travelers}
          onClose={() => {
            setShowConfirmation(false);
            setStep("initial");
            showInitialMessage();
            setFitPackages([]);
            setSelectedFitPackage(null);
          }}
        />
      )}

      {showHotelDetail && selectedHotel && (
        <HotelDetail
          hotel={selectedHotel}
          onClose={() => setShowHotelDetail(false)}
          onBooking={() => {
            setShowHotelDetail(false);
            setFitTotalPrice(selectedHotel.price);
            setShowHotelBooking(true);
            setCheckingAvailability(true);
            
            // 실시간 재고 체크 시뮬레이션
            setTimeout(() => {
              setCheckingAvailability(false);
            }, 2000);
          }}
        />
      )}

      {showFlightDetail && selectedFlight && (
        <FlightDetail
          flight={selectedFlight}
          onClose={() => setShowFlightDetail(false)}
          onBooking={() => {
            setShowFlightDetail(false);
            setFitTotalPrice(selectedFlight.price);
            setShowFlightBooking(true);
            setCheckingAvailability(true);
            
            // 실시간 재고 체크 시뮬레이션
            setTimeout(() => {
              setCheckingAvailability(false);
            }, 2000);
          }}
        />
      )}

      {/* 룸타입 선택 바텀시트 */}
      {showRoomTypeSelector && currentHotelForRoomSelection && mockRoomTypes[currentHotelForRoomSelection] && (
        <RoomTypeSelector
          hotelName={
            selectedFitPackage?.hotelInfo.name || 
            selectedHotel?.name || 
            "호텔"
          }
          roomTypes={mockRoomTypes[currentHotelForRoomSelection]}
          onSelect={(roomType) => {
            setSelectedRoomType(roomType);
            setShowRoomTypeSelector(false);
            
            // 룸타입 선택 완료 후 총 가격 업데이트
            if (selectedHotel) {
              setFitTotalPrice(selectedHotel.price + roomType.price);
            } else if (selectedFitPackage) {
              setFitTotalPrice((fitTotalPrice || selectedFitPackage.totalPrice) + roomType.price);
            }
            
            // 예약자 정보 입력으로 이동
            setShowBookingForm(true);
            setStep("booking");
          }}
          onClose={() => setShowRoomTypeSelector(false)}
        />
      )}
    </div>
  );
}