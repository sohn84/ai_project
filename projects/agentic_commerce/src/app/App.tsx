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

// í¤ë ì»´í¬ëí¸
function Header() {
  return (
    <div className="bg-white border-b border-[#f0f0f0] px-5 py-4 flex items-center">
      <button className="p-2 -ml-2">
        <svg className="size-6" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <h1 className="font-['Pretendard:Bold',sans-serif] text-[20px] text-[#111] ml-2">
        H-AI íì´
      </h1>
    </div>
  );
}

// ìë ¥ì°½ ì»´í¬ëí¸
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
            placeholder="ê¶ê¸íì  ë´ì©ì ë¬¼ì´ë³´ì¸ì!"
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

// ëª©ì í¨í¤ì§ ë°ì´í°
const mockPackages: PackageData[] = [
  {
    id: "1",
    title: "ë°ë¦¬ 5ì¼ ë­ìë¦¬ í´ì í¨í¤ì§ - ì¸ë¯¸ëí¬ íë¼ì´ë¹ íë¹ë¼",
    destination: "ë°ë¦¬, ì¸ëë¤ìì",
    duration: "4ë° 5ì¼",
    price: 1890000,
    image: "https://images.unsplash.com/photo-1589632732202-bd154e6e116d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwYmVhY2glMjByZXNvcnQlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzAyNzU4MTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviewCount: 342,
    airline: "ëíí­ê³µ",
    hotel: "ë ë ê¸°ì ë°ë¦¬",
    hotelGrade: "5ì±ê¸ ë¦¬ì¡°í¸",
    departure: "2026.03.15 (í )",
    availableSeats: 8,
    highlights: [
      "íë¼ì´ë¹ íë¹ë¼ ìë°",
      "ì¤í & ë§ì¬ì§ 1í í¬í¨",
      "ì°ë¶ ì íµìì¥ í¬ì´",
      "íì¤ ë² ë¸ì ìì ì¤í¬ì¸ ",
      "ë°ë¦¬ ì íµ ë¬´ì© ê´ë"
    ]
  },
  {
    id: "2",
    title: "ì°í ë¦¬ë 7ì¼ ë­ë§ ì¬í - ë¸ë£¨ë ë·° í¸í & ìì´ëë¦¬ í¬ì´",
    destination: "ì°í ë¦¬ë, ê·¸ë¦¬ì¤",
    duration: "5ë° 7ì¼",
    price: 2650000,
    image: "https://images.unsplash.com/photo-1672622851784-0dbd3df4c088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b3JpbmklMjBncmVlY2UlMjB3aGl0ZSUyMGJ1aWxkaW5nc3xlbnwxfHx8fDE3NzAyNTU3MzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviewCount: 278,
    airline: "ìë¯¸ë ì´í¸ í­ê³µ",
    hotel: "ìíëí°ì¤ í¸í",
    hotelGrade: "5ì±ê¸ ë¶í°í¬",
    departure: "2026.03.20 (ëª©)",
    availableSeats: 5,
    highlights: [
      "ë¸ë£¨ë ì ë§ ê°ì¤",
      "ìê²í´ ì ì í¬ë£¨ì¦",
      "ìì´ëë¦¬ í¬ì´ & ìì",
      "ì´ì ë§ì ìì ìê°",
      "ì íµ ê·¸ë¦¬ì¤ ëëì¼"
    ]
  },
  {
    id: "3",
    title: "íë¦¬ 6ì¼ ë¬¸ííë°© - ë£¨ë¸ë¥´ & ë² ë¥´ì¬ì  ê¶ì  í¬í¨",
    destination: "íë¦¬, íëì¤",
    duration: "4ë° 6ì¼",
    price: 2390000,
    image: "https://images.unsplash.com/photo-1710195778783-a441adf75fda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyJTIwY2l0eXxlbnwxfHx8fDE3NzAyNzU4MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviewCount: 412,
    airline: "ìì´íëì¤",
    hotel: "ë©ë¥´íì´ íë¦¬ ì¼í°",
    hotelGrade: "4ì±ê¸",
    departure: "2026.03.18 (ì)",
    availableSeats: 12,
    highlights: [
      "ë£¨ë¸ë¥´ ë°ë¬¼ê´ íêµ­ì´ ê°ì´ë",
      "ë² ë¥´ì¬ì  ê¶ì  ê´ë",
      "ìí í ì ë§ë ìì¥",
      "ì¼ê° ì ëì  íì¹",
      "ëª½ë§ë¥´í¸ ì¸ë ìì ìê°"
    ]
  },
  {
    id: "4",
    title: "ëì¿ 5ì¼ ìì ì¬í - ë²ê½ ìì¦ ì¤íì",
    destination: "ëì¿, ì¼ë³¸",
    duration: "3ë° 5ì¼",
    price: 1450000,
    image: "https://images.unsplash.com/photo-1620451978644-841acb416d6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGphcGFuJTIwY2hlcnJ5JTIwYmxvc3NvbXxlbnwxfHx8fDE3NzAyNzU4MTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviewCount: 523,
    airline: "ìììë",
    hotel: "ì ì£¼ì¿  íë¦°ì¤ í¸í",
    hotelGrade: "4ì±ê¸",
    departure: "2026.03.25 (ì)",
    availableSeats: 15,
    highlights: [
      "ì°ìë¸ ê³µì ë²ê½ ëªì",
      "ëì¦ëëë 1ì¼ê¶ ìµì",
      "íë¼ì£¼ì¿ /ìë¶ì¼ ì¼í",
      "ì¤ì ì¤ë§ì¹´ì¸ ëë",
      "ì¨ì² ë£ì¹¸ ì²´í"
    ]
  },
  {
    id: "5",
    title: "ëª°ëë¸ 6ì¼ ì¬ì¸í´ë£¨ìë¸ - ììë°© íëë¬¸ í¨í¤ì§",
    destination: "ëª°ëë¸",
    duration: "4ë° 6ì¼",
    price: 3850000,
    image: "https://images.unsplash.com/photo-1706753459618-31e52d7ca22d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMG9jZWFuJTIwcmVzb3J0fGVufDF8fHx8MTc3MDE5MTA0NXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5.0,
    reviewCount: 156,
    airline: "ì±ê°í¬ë¥´ í­ê³µ",
    hotel: "ì½ëë ëª°ëë¸ ëê°ë¦¬",
    hotelGrade: "5ì±ê¸ ë¦¬ì¡°í¸",
    departure: "2026.03.22 (ì¼)",
    availableSeats: 4,
    highlights: [
      "ì¤ë²ìí° ììë°©",
      "ì¬ì¸í´ë£¨ìë¸ (ìì¬/ìë£)",
      "ì¤ë¸í´ë§ & ë¤ì´ë¹",
      "ì»¤í ì¤í & ë§ì¬ì§",
      "íë¼ì´ë¹ ëë ì¸í"
    ]
  }
];

// ëª©ì ìì ì¬í(FIT) í¨í¤ì§ ë°ì´í°
const mockFITPackages: FITPackageData[] = [
  {
    id: "fit1",
    flightInfo: {
      airline: "ëíí­ê³µ",
      departure: "ì¸ì²",
      arrival: "íë¦¬",
      departureTime: "13:30",
      arrivalTime: "18:20",
      price: 1200000,
      seatClass: "ì´ì½ë¸ë¯¸",
      flightDuration: "ì½ 12ìê° 50ë¶",
    },
    hotelInfo: {
      name: "ë¸ë³´í íë¦¬ ì¼í°",
      grade: "4ì±ê¸",
      location: "ì¹ì ¤ë¦¬ì  ê±°ë¦¬ ëë³´ 5ë¶",
      roomType: "ìíë¦¬ì´ ëë¸ë£¸",
      price: 680000,
    },
    totalPrice: 1880000,
    duration: "4ë° 6ì¼",
    destination: "íë¦¬, íëì¤",
    passengerCount: 2,
  },
  {
    id: "fit2",
    flightInfo: {
      airline: "ìììë",
      departure: "ì¸ì²",
      arrival: "ëì¿",
      departureTime: "09:00",
      arrivalTime: "11:30",
      price: 450000,
      seatClass: "ì´ì½ë¸ë¯¸",
      flightDuration: "ì½ 2ìê° 30ë¶",
    },
    hotelInfo: {
      name: "ì ì£¼ì¿  ê·¸ëë¹ì í¸í",
      grade: "4ì±ê¸",
      location: "ì ì£¼ì¿ ì­ ì§ê²°",
      roomType: "ì¤í ë¤ë í¸ìë£¸",
      price: 520000,
    },
    totalPrice: 970000,
    duration: "3ë° 5ì¼",
    destination: "ëì¿, ì¼ë³¸",
    passengerCount: 2,
  },
  {
    id: "fit3",
    flightInfo: {
      airline: "ìë¯¸ë ì´í¸ í­ê³µ",
      departure: "ì¸ì²",
      arrival: "ë°ë¦¬",
      departureTime: "22:45",
      arrivalTime: "06:30+1",
      price: 850000,
      seatClass: "ë¹ì¦ëì¤",
      flightDuration: "ì½ 7ìê° 45ë¶",
    },
    hotelInfo: {
      name: "ì¸ë¯¸ëí¬ ë¹ì¹ ë¦¬ì¡°í¸",
      grade: "5ì±ê¸",
      location: "ì¸ë¯¸ëí¬ í´ë³ê°",
      roomType: "íë¼ì´ë¹ íë¹ë¼",
      price: 1100000,
    },
    totalPrice: 1950000,
    duration: "4ë° 5ì¼",
    destination: "ë°ë¦¬, ì¸ëë¤ìì",
    passengerCount: 2,
  },
];

// ëª©ì ì¡í°ë¹í° í°ì¼ ë°ì´í°
const mockActivityTickets: ActivityTicket[] = [
  {
    id: "act1",
    title: "ìí í ì°ì  ìì¥ê¶ + ì¼ê° ì ëì ",
    location: "íë¦¬ 7êµ¬, ì¹ëë§ë¥´ì¤",
    duration: "ì½ 3ìê°",
    price: 85000,
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400",
    category: "ëªì ìì¥ê¶",
  },
  {
    id: "act2",
    title: "ë² ë¥´ì¬ì  ê¶ì  ê°ì´ë í¬ì´",
    location: "ë² ë¥´ì¬ì ",
    duration: "ì½ 4ìê°",
    price: 95000,
    image: "https://images.unsplash.com/photo-1609949279531-cf48d64bedce?w=400",
    category: "ê°ì´ë í¬ì´",
  },
  {
    id: "act3",
    title: "ë£¨ë¸ë¥´ ë°ë¬¼ê´ íêµ­ì´ ì¤ëì¤ ê°ì´ë",
    location: "íë¦¬ 1êµ¬, ë£¨ë¸ë¥´",
    duration: "ì½ 2.5ìê°",
    price: 45000,
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400",
    category: "ëªì ìì¥ê¶",
  },
];

// ëª©ì í­ê³µí¸ ë°ì´í°
const mockFlights: FlightData[] = [
  {
    id: "flight1",
    airline: "ëíí­ê³µ",
    departure: "ì¸ì²",
    arrival: "íë¦¬",
    departureTime: "13:30",
    arrivalTime: "18:20",
    price: 1200000,
    seatClass: "ì´ì½ë¸ë¯¸",
    flightDuration: "ì½ 12ìê° 50ë¶",
    destination: "íë¦¬, íëì¤",
    passengerCount: 2,
    isDirect: true,
    departureAirport: "ì¸ì²êµ­ì ê³µí­ (ICN)",
    arrivalAirport: "ì¤ë¥¼ ë ê³¨ êµ­ì ê³µí­ (CDG)",
    baggage: "23kg 2ê°",
    flightNumber: "KE901",
  },
  {
    id: "flight2",
    airline: "ìì´íëì¤",
    departure: "ì¸ì²",
    arrival: "íë¦¬",
    departureTime: "19:00",
    arrivalTime: "23:45",
    price: 1350000,
    seatClass: "ì´ì½ë¸ë¯¸",
    flightDuration: "ì½ 13ìê° 45ë¶",
    destination: "íë¦¬, íëì¤",
    passengerCount: 2,
    isDirect: true,
    departureAirport: "ì¸ì²êµ­ì ê³µí­ (ICN)",
    arrivalAirport: "ì¤ë¥¼ ë ê³¨ êµ­ì ê³µí­ (CDG)",
    baggage: "23kg 1ê°",
    flightNumber: "AF266",
  },
  {
    id: "flight3",
    airline: "ìë¯¸ë ì´í¸ í­ê³µ",
    departure: "ì¸ì²",
    arrival: "íë¦¬",
    departureTime: "10:00",
    arrivalTime: "19:30",
    price: 1800000,
    seatClass: "ë¹ì¦ëì¤",
    flightDuration: "ì½ 14ìê° 30ë¶ (1í ê²½ì )",
    destination: "íë¦¬, íëì¤",
    passengerCount: 2,
    isDirect: false,
    departureAirport: "ì¸ì²êµ­ì ê³µí­ (ICN)",
    arrivalAirport: "ì¤ë¥¼ ë ê³¨ êµ­ì ê³µí­ (CDG)",
    baggage: "30kg 2ê°",
    flightNumber: "EK322",
  },
];

// ëª©ì í¸í ë°ì´í°
const mockHotels: HotelData[] = [
  {
    id: "hotel1",
    name: "ë¸ë³´í íë¦¬ ì¼í°",
    grade: "4ì±ê¸",
    location: "ì¹ì ¤ë¦¬ì  ê±°ë¦¬ ëë³´ 5ë¶",
    roomType: "ìíë¦¬ì´ ëë¸ë£¸",
    price: 680000,
    destination: "íë¦¬, íëì¤",
    passengerCount: 2,
  },
  {
    id: "hotel2",
    name: "í¸í ë£¨ë¸ë¥´ ë§ë¥´ì",
    grade: "3ì±ê¸",
    location: "ë£¨ë¸ë¥´ ë°ë¬¼ê´ ì¸ê·¼",
    roomType: "ì¤í ë¤ë í¸ìë£¸",
    price: 520000,
    destination: "íë¦¬, íëì¤",
    passengerCount: 2,
  },
  {
    id: "hotel3",
    name: "ì¼ëª½ ìë¦¬ì ",
    grade: "5ì±ê¸",
    location: "ìí í ì ë§ í¹ê¸",
    roomType: "ëë­ì¤ ì¤ìí¸",
    price: 1200000,
    destination: "íë¦¬, íëì¤",
    passengerCount: 2,
  },
];

// ëª©ì ë£¸íì ë°ì´í°
const mockRoomTypes: { [hotelId: string]: RoomType[] } = {
  "hotel1": [
    {
      id: "room1-1",
      name: "ìíë¦¬ì´ ëë¸ë£¸",
      bedType: "ëë¸ ë² ë 1ê°",
      capacity: "ì±ì¸ 2ëª",
      size: "25ã¡",
      price: 0,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ë¯¸ëë°", "ê¸ì°"]
    },
    {
      id: "room1-2",
      name: "ëë­ì¤ í¸ìë£¸",
      bedType: "ì±ê¸ ë² ë 2ê°",
      capacity: "ì±ì¸ 2ëª",
      size: "28ã¡",
      price: 50000,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ë¯¸ëë°", "ê¸ì°", "ìí°ë·°"]
    },
    {
      id: "room1-3",
      name: "ì´ê·¸ì íí°ë¸ ì¤ìí¸",
      bedType: "í¹ ë² ë 1ê°",
      capacity: "ì±ì¸ 2ëª + ì´ë¦°ì´ 1ëª",
      size: "45ã¡",
      price: 150000,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ë¯¸ëë°", "ê¸ì°", "ìí°ë·°", "ìì¡°", "ë¤ì¤íë ì"]
    }
  ],
  "hotel2": [
    {
      id: "room2-1",
      name: "ì¤í ë¤ë í¸ìë£¸",
      bedType: "ì±ê¸ ë² ë 2ê°",
      capacity: "ì±ì¸ 2ëª",
      size: "22ã¡",
      price: 0,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ê¸ì°"]
    },
    {
      id: "room2-2",
      name: "ì¤í ë¤ë ëë¸ë£¸",
      bedType: "ëë¸ ë² ë 1ê°",
      capacity: "ì±ì¸ 2ëª",
      size: "22ã¡",
      price: 0,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ê¸ì°"]
    },
    {
      id: "room2-3",
      name: "ìíë¦¬ì´ ëë¸ë£¸",
      bedType: "í¸ ë² ë 1ê°",
      capacity: "ì±ì¸ 2ëª",
      size: "26ã¡",
      price: 35000,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ë¯¸ëë°", "ê¸ì°", "ê±°ë¦¬ë·°"]
    }
  ],
  "hotel3": [
    {
      id: "room3-1",
      name: "ëë­ì¤ ì¤ìí¸",
      bedType: "í¹ ë² ë 1ê°",
      capacity: "ì±ì¸ 2ëª",
      size: "55ã¡",
      price: 0,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ë¯¸ëë°", "ê¸ì°", "ìí íë·°", "ìì¡°", "ë¤ì¤íë ì"]
    },
    {
      id: "room3-2",
      name: "íë ì¤í°ì§ ì¤ìí¸",
      bedType: "í¹ ë² ë 1ê° + ìíë² ë",
      capacity: "ì±ì¸ 2ëª + ì´ë¦°ì´ 2ëª",
      size: "75ã¡",
      price: 200000,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ë¯¸ëë°", "ê¸ì°", "ìí íë·°", "ìì¡°", "ë¤ì¤íë ì", "ê±°ì¤", "ë°ì½ë"]
    },
    {
      id: "room3-3",
      name: "ë¡ì íí¸íì°ì¤",
      bedType: "í¹ ë² ë 2ê°",
      capacity: "ì±ì¸ 4ëª",
      size: "120ã¡",
      price: 500000,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ë¯¸ëë°", "ê¸ì°", "ìí íë·°", "ìì¡°", "ë¤ì¤íë ì", "ê±°ì¤", "ë°ì½ë", "ì£¼ë°©", "ë¤ì´ëë£¸"]
    }
  ],
  // FIT í¨í¤ì§ì© ë£¸íì
  "fit1": [
    {
      id: "room1-1",
      name: "ìíë¦¬ì´ ëë¸ë£¸",
      bedType: "ëë¸ ë² ë 1ê°",
      capacity: "ì±ì¸ 2ëª",
      size: "25ã¡",
      price: 0,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ë¯¸ëë°", "ê¸ì°"]
    },
    {
      id: "room1-2",
      name: "ëë­ì¤ í¸ìë£¸",
      bedType: "ì±ê¸ ë² ë 2ê°",
      capacity: "ì±ì¸ 2ëª",
      size: "28ã¡",
      price: 50000,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ë¯¸ëë°", "ê¸ì°", "ìí°ë·°"]
    },
    {
      id: "room1-3",
      name: "ì´ê·¸ì íí°ë¸ ì¤ìí¸",
      bedType: "í¹ ë² ë 1ê°",
      capacity: "ì±ì¸ 2ëª + ì´ë¦°ì´ 1ëª",
      size: "45ã¡",
      price: 150000,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ë¯¸ëë°", "ê¸ì°", "ìí°ë·°", "ìì¡°", "ë¤ì¤íë ì"]
    }
  ],
  "fit2": [
    {
      id: "room2-1",
      name: "ì¤í ë¤ë í¸ìë£¸",
      bedType: "ì±ê¸ ë² ë 2ê°",
      capacity: "ì±ì¸ 2ëª",
      size: "20ã¡",
      price: 0,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ê¸ì°"]
    },
    {
      id: "room2-2",
      name: "ëª¨ëë ì´í¸ í¸ìë£¸",
      bedType: "ì±ê¸ ë² ë 2ê°",
      capacity: "ì±ì¸ 2ëª",
      size: "24ã¡",
      price: 30000,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ë¯¸ëë°", "ê¸ì°", "ìí°ë·°"]
    }
  ],
  "fit3": [
    {
      id: "room3-1",
      name: "íë¼ì´ë¹ íë¹ë¼",
      bedType: "í¹ ë² ë 1ê°",
      capacity: "ì±ì¸ 2ëª",
      size: "80ã¡",
      price: 0,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ë¯¸ëë°", "ê¸ì°", "íë¼ì´ë¹ í", "ê°ë ë·°", "ì¼ì¸ ì¤ì", "ìì¡°"]
    },
    {
      id: "room3-2",
      name: "ëë­ì¤ íë¹ë¼",
      bedType: "í¹ ë² ë 1ê° + ìíë² ë",
      capacity: "ì±ì¸ 2ëª + ì´ë¦°ì´ 2ëª",
      size: "120ã¡",
      price: 200000,
      amenities: ["ë¬´ë£ Wi-Fi", "ìì´ì»¨", "ë¯¸ëë°", "ê¸ì°", "íë¼ì´ë¹ í", "ì¤ìë·°", "ì¼ì¸ ì¤ì", "ìì¡°", "ê±°ì¤", "ì£¼ë°©"]
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
  
  // ìì ì¬í(FIT) ê´ë ¨ ìí
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

  // ë£¸íì ì í ê´ë ¨ ìí
  const [showRoomTypeSelector, setShowRoomTypeSelector] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [currentHotelForRoomSelection, setCurrentHotelForRoomSelection] = useState<string>("");

  // ì´ê¸° ë©ìì§ íì
  const showInitialMessage = () => {
    setMessages([
      {
        type: "bot",
        content: (
          <div>
            <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
              ìëíì¸ì. <span className="font-['Pretendard:Bold',sans-serif]">H-AI (íì´)</span> ìëë¤.
            </p>
            <p className="text-[14px] text-[#111] leading-[1.5]">
              ì¬í ì¼ì ê³¼ ì ë³´ë¥¼ ë¬¼ì´ë³´ìê±°ë,<br/>
              ê¶ê¸íì  ì ì ìë ¥ì°½ì ìë ¥í´ ì£¼ì¸ì.
            </p>
          </div>
        )
      }
    ]);
  };

  // ì±í ë©ìì§ ì ì¡
  const handleSendMessage = (message: string) => {
    const userMessage = { type: "user" as const, content: message };
    setMessages(prev => [...prev, userMessage]);

    // ë©ìì§ ë¶ì ë° ìëµ
    setTimeout(() => {
      if (message.includes("ì¬í") || message.includes("í¨í¤ì§") || message.includes("ì¶ì²")) {
        // ì¬í íì ì í ë©ìì§
        setMessages(prev => [...prev, {
          type: "bot",
          content: (
            <div>
              <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
                ìì ì¬íì ì í¸íì¸ì? ìëë©´ í¸í í¨í¤ì§ ìíì ì¶ì²í´ëë¦´ê¹ì?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTravelTypeSelect("fit")}
                  className="flex-1 py-3 bg-[#7b3ff2] text-white rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
                >
                  ìì ì¬í
                </button>
                <button
                  onClick={() => handleTravelTypeSelect("package")}
                  className="flex-1 py-3 bg-[#3780ff] text-white rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#2563eb] transition-colors"
                >
                  í¨í¤ì§ ìí
                </button>
              </div>
            </div>
          )
        }]);
      } else if (message.includes("ë¹êµ")) {
        handleComparePackages();
      } else if (message.includes("ìì ì¬í")) {
        handleTravelTypeSelect("fit");
      } else {
        setMessages(prev => [...prev, {
          type: "bot",
          content: "ë ìì¸í ì ë³´ê° íìíìë©´ êµ¬ì²´ì ì¼ë¡ ì§ë¬¸í´ ì£¼ì¸ì!"
        }]);
      }
    }, 500);
  };

  // ì¬í íì ì í í¸ë¤ë¬
  const handleTravelTypeSelect = (type: "package" | "fit") => {
    setTravelType(type);
    setMessages(prev => [...prev, {
      type: "user",
      content: type === "fit" ? "ìì ì¬í" : "í¨í¤ì§ ìí"
    }]);
    
    if (type === "package") {
      // í¨í¤ì§ íë¡ì°
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: "bot",
          content: "ìíìë ì¬í ì ë³´ë¥¼ ìë ¥í´ ì£¼ìë©´ ë§ì¶¤ í¨í¤ì§ë¥¼ ì¶ì²í´ ëë¦´ê²ì! ð"
        }]);
        setShowPreferenceInput(true);
        setStep("preference");
      }, 500);
    } else {
      // ìì ì¬í íë¡ì° - ì¬í ì ë³´ ìë ¥
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: "bot",
          content: "ì¬íì§ì ìì°ì ìë ¤ì£¼ìë©´ ìµì ì í­ê³µ+ìì ì¡°í©ì ì°¾ìëë¦´ê²ì! âï¸"
        }]);
        setShowPreferenceInput(true);
        setStep("preference");
      }, 500);
    }
  };

  // ì í¸ë ì ì¶
  const handlePreferenceSubmit = (data: { theme: string; budget: string; destination: string; searchMode?: 'combo' | 'flight' | 'hotel' }) => {
    setShowPreferenceInput(false);
    
    if (travelType === "fit") {
      // ìì ì¬í íë¡ì°
      const mode = data.searchMode || 'combo';
      setFitSearchMode(mode);
      
      let searchTypeText = "í­ê³µí¸ê³¼ ììë¥¼";
      if (mode === 'flight') searchTypeText = "í­ê³µí¸ì";
      if (mode === 'hotel') searchTypeText = "ììë¥¼";
      
      setMessages(prev => [...prev, 
        { 
          type: "user", 
          content: mode === 'combo' ? 'í­ê³µ+ìì ì¡°í© ê²ìíê¸°' : mode === 'flight' ? 'í­ê³µë§ ê²ìíê¸°' : 'í¸íë§ ê²ìíê¸°'
        }
      ]);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: "bot",
          content: `${searchTypeText} ì¤ìê°ì¼ë¡ ê²ìíê³  ììµëë¤...`
        }]);
        setStep("fit-search");
      }, 500);

      // ê²ì ëª¨ëì ë°ë¼ ë¤ë¥¸ ê²°ê³¼ íì
      setTimeout(() => {
        if (mode === 'combo') {
          // í­ê³µ+ìì ì¡°í©
          setFitPackages(mockFITPackages);
          setMessages(prev => [...prev, {
            type: "bot",
            content: `${data.destination}ë¡ ${data.budget} ìì°ì ë§ë ìµì ì í­ê³µ+ìì ì¡°í©ì ì°¾ììµëë¤! ì´ ${mockFITPackages.length}ê°ì ì¶ì² ì¡°í©ì íì¸í´ë³´ì¸ì. ð`
          }]);
        } else if (mode === 'flight') {
          // í­ê³µë§
          setFlights(mockFlights);
          setMessages(prev => [...prev, {
            type: "bot",
            content: `${data.destination}í í­ê³µí¸ì ì°¾ììµëë¤! ì´ ${mockFlights.length}ê°ì ì¶ì² í­ê³µí¸ì íì¸í´ë³´ì¸ì. âï¸`
          }]);
        } else {
          // í¸íë§
          setHotels(mockHotels);
          setMessages(prev => [...prev, {
            type: "bot",
            content: `${data.destination}ì ììë¥¼ ì°¾ììµëë¤! ì´ ${mockHotels.length}ê°ì ì¶ì² ììë¥¼ íì¸í´ë³´ì¸ì. ð¨`
          }]);
        }
        setStep("fit-packages");
      }, 2000);
    } else {
      // í¨í¤ì§ íë¡ì°
      setMessages(prev => [...prev, 
        { 
          type: "user", 
          content: `${data.destination} / ${data.theme} / ${data.budget}` 
        }
      ]);

      setTimeout(() => {
        // ìì°ì ë°ë¥¸ í¨í¤ì§ íí°ë§
        const budgetRange = data.budget;
        let filtered = mockPackages;
        
        if (budgetRange === "100ë§ì ì´í") {
          filtered = mockPackages.filter(p => p.price < 1500000);
        } else if (budgetRange === "100-200ë§ì") {
          filtered = mockPackages.filter(p => p.price >= 1000000 && p.price <= 2000000);
        } else if (budgetRange === "200-300ë§ì") {
          filtered = mockPackages.filter(p => p.price >= 2000000 && p.price <= 3000000);
        }

        setRecommendedPackages(filtered.slice(0, 5));
        setMessages(prev => [...prev, {
          type: "bot",
          content: `${data.destination}ì ${data.theme} íë§ë¡ ${data.budget} ìì°ì ë§ë ìíì ì°¾ììµëë¤! ì´ ${filtered.slice(0, 5).length}ê°ì ì¶ì² ìíì íì¸í´ë³´ì¸ì. ð`
        }]);
        setStep("packages");
      }, 1000);
    }
  };

  // í¨í¤ì§ ìì¸ë³´ê¸°
  const handlePackageClick = (pkg: PackageData) => {
    setSelectedPackage(pkg);
    setShowDetail(true);
    setMessages(prev => [...prev, 
      { type: "user", content: `${pkg.title} ìì¸ ì ë³´ ë³´ê¸°` },
      { 
        type: "bot", 
        content: "ìíì ìì¸ ì ë³´ë¥¼ íì¸íì¤ ì ììµëë¤. ì¼ì , í¬í¨/ë¶í¬í¨ ì¬í­ì ìì¸í ìë´í´ ëë ¸ìµëë¤!" 
      }
    ]);
  };

  // í¨í¤ì§ ë¹êµ
  const handleComparePackages = () => {
    if (recommendedPackages.length >= 2) {
      setComparisonPackages(recommendedPackages.slice(0, 3));
      setShowComparison(true);
      setMessages(prev => [...prev, 
        { type: "user", content: "ìí ë¹êµí´ì£¼ì¸ì" },
        { 
          type: "bot", 
          content: "ì ííì  ìíë¤ì ê°ê²©, ììë±ê¸, í­ê³µì¬ ë±ì ë¹êµí´ ëë¦½ëë¤!" 
        }
      ]);
    }
  };

  // ìì½íê¸°
  const handleBooking = (pkg: PackageData) => {
    setSelectedPackage(pkg);
    setShowDetail(false);
    setShowComparison(false);
    
    // bookingMessages ì´ê¸°í ë° 1. [ìì½íê¸°] í´ë¦­ ì ì¬ì©ì ë©ìì§ ì¶ê°
    setBookingMessages([
      { type: "user", content: "ìì½íê¸°" }
    ]);

    // 2. ëíì°½ìì ì¤ìê°ì¼ë¡ ì¶ë° ê°ë¥ ì¬ë¶ì ìì¬ì íì¸ ì¤ ë©ìì§ íì
    setTimeout(() => {
      setBookingMessages(prev => [...prev, { 
        type: "bot", 
        content: "ì¤ìê°ì¼ë¡ ì¶ë° ê°ë¥ ì¬ë¶ì ìì¬ìì íì¸íê³  ììµëë¤..." 
      }]);
    }, 500);

    // 3. ì¤ìê° ì¢ì ì ë³´ íë² ë ì²´í¬, ìì½ ê°ë¥ ì [ìì½ì ì ë³´ ìë ¥ ë²í¼] íì
    setTimeout(() => {
      if (pkg.availableSeats > 0) {
        setBookingMessages(prev => [...prev, {
          type: "bot",
          content: (
            <div>
              <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
                â ìì½ ê°ë¥í©ëë¤! íì¬ <span className="font-['Pretendard:Bold',sans-serif] text-[#3780ff]">{pkg.availableSeats}ì</span>ì´ ë¨ìììµë.
              </p>
              <button
                onClick={() => {
                  setShowBookingForm(true);
                  setStep("booking");
                }}
                className="w-full py-3 bg-[#3780ff] text-white rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#2563eb] transition-colors"
              >
                ìì½ì ì ë³´ ìë ¥
              </button>
            </div>
          )
        }]);
      } else {
        setBookingMessages(prev => [...prev, {
          type: "bot",
          content: "ð ì£ì¡í©ëë¤. í´ë¹ ìíì íì¬ ë§¤ì§ëììµëë¤. ì ì¬í ëì ìíì ì¶ì²í´ ëë¦´ê¹ì?"
        }]);
      }
    }, 2000);
  };

  // ìì ì¬í ìì½íê¸°
  const handleFITBooking = () => {
    if (!selectedFitPackage) return;

    setMessages(prev => [...prev, { type: "user", content: "ìì½íê¸°" }]);

    // ì¤ìê° í­ê³µí¸ê³¼ ìì ê°ë¥ ì¬ë¶ íì¸
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: "bot",
        content: "ì¤ìê°ì¼ë¡ í­ê³µí¸ê³¼ ìì ìì½ ê°ë¥ ì¬ë¶ë¥¼ íì¸íê³  ììµëë¤..."
      }]);
    }, 500);

    // ìì½ ê°ë¥ ì ë£¸íì ì í ë²í¼ íì
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: "bot",
        content: (
          <div>
            <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
              â ìì½ ê°ë¥í©ëë¤! ì ííì  í­ê³µí¸ê³¼ ìì ëª¨ë ìì½ ê°ë¥í©ëë¤.
            </p>
            <button
              onClick={() => {
                setCurrentHotelForRoomSelection(selectedFitPackage.id);
                setShowRoomTypeSelector(true);
              }}
              className="w-full py-3 bg-[#7b3ff2] text-white rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
            >
              í¸í ë£¸íì ì í
            </button>
          </div>
        )
      }]);
    }, 2000);
  };

  // ìì½ ì ë³´ ì ì¶
  const handleBookingSubmit = (data: BookingFormData) => {
    setBookingData(data);
    setShowBookingForm(false);
    setMessages(prev => [...prev, 
      { type: "user", content: "ìì½ ì ë³´ ì ì¶ ìë£" },
      { 
        type: "bot", 
        content: "ìì½ ì ë³´ë¥¼ íì¸íìµëë¤. ê²°ì ë¥¼ ì§íí´ ì£¼ì¸ì." 
      }
    ]);
    setShowPayment(true);
    setStep("payment");
  };

  // ê²°ì  ìë£
  const handlePaymentSuccess = () => {
    setShowPayment(false);
    const confirmationNumber = `HAI${Date.now().toString().slice(-8)}`;
    setBookingNumber(confirmationNumber);
    
    setMessages(prev => [...prev, {
      type: "bot",
      content: "ð ê²°ì ê° ìë£ëììµëë¤! ìì½ì´ íì ëììµëë¤."
    }]);
    
    setShowConfirmation(true);
    setStep("confirmed");
  };

  // ì´ê¸° ë¡ë
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
                ìí ë¹êµíê¸°
              </button>
            )}

            {/* ìì½íê¸° ê´ë ¨ ë©ìì§ë¤ - ì¶ì² ìí ì¹´ë ìëì íì */}
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

        {/* ìì ì¬í FIT í¨í¤ì§ íì (í­ê³µ+ìì ì¡°í©) */}
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
                    content: `${pkg.destination} ì¡°í© ìì¸ ë³´ê¸°`
                  }]);
                }}
                onBooking={() => {
                  setSelectedFitPackage(pkg);
                  setMessages(prev => [...prev, 
                    { type: "user", content: "ì´ ì¡°í©ì¼ë¡ ìì½" },
                    { type: "bot", content: "ìì ì£¼ë³ì ì¸ê¸° ì¡í°ë¹í°ë¥¼ ì¶ì²í´ëë¦´ê²ì! ìíìë ìíì ì íí´ì£¼ì¸ì." }
                  ]);
                  setStep("fit-activities");
                  setShowActivitySelector(true);
                }}
              />
            ))}
          </div>
        )}

        {/* í­ê³µí¸ë§ íì */}
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
                  
                  // ì¤ìê° ì¬ê³  ì²´í¬ ìë®¬ë ì´ì
                  setTimeout(() => {
                    setCheckingAvailability(false);
                  }, 2000);
                }}
              />
            ))}
            
            {/* í­ê³µí¸ ìì½ íì¸ ìì­ - ë¦¬ì¤í¸ íì */}
            {showFlightBooking && selectedFlight && (
              <div className="bg-white rounded-[16px] p-4 shadow-sm border border-[#e5e5e5]">
                {checkingAvailability ? (
                  <div className="text-center py-4">
                    <div className="inline-block size-8 border-4 border-[#7b3ff2] border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-[14px] text-[#666]">ì¤ìê°ì¼ë¡ í­ê³µí¸ ìì½ ê°ë¥ ì¬ë¶ë¥¼ íì¸íê³  ììµëë¤...</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
                      â ìì½ ê°ë¥í©ëë¤! <span className="font-['Pretendard:Bold',sans-serif] text-[#7b3ff2]">{selectedFlight.airline} {selectedFlight.departure}â{selectedFlight.arrival}</span> í­ê³µí¸ì ìì½í  ì ììµëë¤.
                    </p>
                    <button
                      onClick={() => {
                        setShowFlightBooking(false);
                        setShowBookingForm(true);
                        setStep("booking");
                      }}
                      className="w-full py-3 bg-[#7b3ff2] text-white rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
                    >
                      ìì½ì ì ë³´ ìë ¥
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* í¸íë§ íì */}
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
                  
                  // ì¤ìê° ì¬ê³  ì²´í¬ ìë®¬ë ì´ì
                  setTimeout(() => {
                    setCheckingAvailability(false);
                  }, 2000);
                }}
              />
            ))}
            
            {/* í¸í ìì½ íì¸ ìì­ - ë¦¬ì¤í¸ íì */}
            {showHotelBooking && selectedHotel && (
              <div className="bg-white rounded-[16px] p-4 shadow-sm border border-[#e5e5e5]">
                {checkingAvailability ? (
                  <div className="text-center py-4">
                    <div className="inline-block size-8 border-4 border-[#7b3ff2] border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-[14px] text-[#666]">ì¤ìê°ì¼ë¡ ìì ìì½ ê°ë¥ ì¬ë¶ë¥¼ íì¸íê³  ììµëë¤...</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
                      â ìì½ ê°ë¥í©ëë¤! <span className="font-['Pretendard:Bold',sans-serif] text-[#7b3ff2]">{selectedHotel.name}</span> ììë¥¼ ìì½í  ì ììµëë¤.
                    </p>
                    <button
                      onClick={() => {
                        setShowHotelBooking(false);
                        setCurrentHotelForRoomSelection(selectedHotel.id);
                        setShowRoomTypeSelector(true);
                      }}
                      className="w-full py-3 bg-[#7b3ff2] text-white rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
                    >
                      í¸í ë£¸íì ì í
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ì¡í°ë¹í° ì í íë©´ */}
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
                      ì´ {selectedIds.length}ê°ì ì¡í°ë¹í°ë¥¼ ì ííì¨ìµëë¤. ì ì²´ ì¬í ë¹ì©ì {totalPrice.toLocaleString()}ììëë¤. ìì½ì ì§ííìê² ì´ì?
                    </p>
                    <button
                      onClick={() => handleFITBooking()}
                      className="w-full py-3 bg-[#7b3ff2] text-white rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
                    >
                      ìì½íê¸°
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
          packageTitle={`${selectedFitPackage.destination} ìì ì¬í í¨í¤ì§`}
          onSubmit={handleBookingSubmit}
          onCancel={() => setShowBookingForm(false)}
        />
      )}

      {showBookingForm && !selectedPackage && !selectedFitPackage && selectedFlight && (
        <BookingForm
          packageTitle={`${selectedFlight.airline} ${selectedFlight.departure}â${selectedFlight.arrival} í­ê³µí¸`}
          onSubmit={handleBookingSubmit}
          onCancel={() => setShowBookingForm(false)}
        />
      )}

      {showBookingForm && !selectedPackage && !selectedFitPackage && !selectedFlight && selectedHotel && (
        <BookingForm
          packageTitle={`${selectedHotel.name} ìì`}
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
          packageTitle={`${selectedFitPackage.destination} ìì ì¬í í¨í¤ì§`}
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
            
            // ì¤ìê° ì¬ê³  ì²´í¬ ìë®¬ë ì´ì
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
            
            // ì¤ìê° ì¬ê³  ì²´í¬ ìë®¬ë ì´ì
            setTimeout(() => {
              setCheckingAvailability(false);
            }, 2000);
          }}
        />
      )}

      {/* ë£¸íì ì í ë°íìí¸ */}
      {showRoomTypeSelector && currentHotelForRoomSelection && mockRoomTypes[currentHotelForRoomSelection] && (
        <RoomTypeSelector
          hotelName={
            selectedFitPackage?.hotelInfo.name || 
            selectedHotel?.name || 
            "í¸í"
          }
          roomTypes={mockRoomTypes[currentHotelForRoomSelection]}
          onSelect={(roomType) => {
            setSelectedRoomType(roomType);
            setShowRoomTypeSelector(false);
            
            // ë£¸íì ì í ìë£ í ì´ ê°ê²© ìë°ì´í¸
            if (selectedHotel) {
              setFitTotalPrice(selectedHotel.price + roomType.price);
            } else if (selectedFitPackage) {
              setFitTotalPrice((fitTotalPrice || selectedFitPackage.totalPrice) + roomType.price);
            }
            
            // ìì½ì ì ë³´ ìë ¥ì¼ë¡ ì´ë
            setShowBookingForm(true);
            setStep("booking");
          }}
          onClose={() => setShowRoomTypeSelector(false)}
        />
      )}
    </div>
  );
}