import { useState } from "react";
import { motion } from "motion/react";
import { Ticket, MapPin, Clock } from "lucide-react";

export interface ActivityTicket {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  image: string;
  category: string;
}

interface ActivityTicketSelectorProps {
  tickets: ActivityTicket[];
  onComplete: (selectedIds: string[]) => void;
}

export function ActivityTicketSelector({ tickets, onComplete }: ActivityTicketSelectorProps) {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);

  const handleToggle = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const totalPrice = tickets
    .filter(t => selectedTickets.includes(t.id))
    .reduce((sum, t) => sum + t.price, 0);

  return (
    <div className="px-5 space-y-4">
      <div className="bg-gradient-to-r from-[#f0ebff] to-[#faf8ff] rounded-[12px] p-4">
        <div className="flex items-center gap-2 mb-2">
          <Ticket className="size-5 text-[#7b3ff2]" />
          <h3 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">
            ì¶ì² ì¡í°ë¹í° & ìì¥ê¶
          </h3>
        </div>
        <p className="text-[13px] text-[#666]">
          ìì ì£¼ë³ì ì¸ê¸° ì¡í°ë¹í°ë¥¼ ì¶ì²í´ëë ¤ì. ìíë ìíì ì íí´ì£¼ì¸ì.
        </p>
      </div>

      <div className="space-y-3">
        {tickets.map((ticket, index) => (
          <motion.label
            key={ticket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-3 p-3 bg-white border-2 rounded-[12px] cursor-pointer hover:border-[#7b3ff2] transition-colors"
            style={{
              borderColor: selectedTickets.includes(ticket.id) ? "#7b3ff2" : "#e5e7eb"
            }}
          >
            <input
              type="checkbox"
              checked={selectedTickets.includes(ticket.id)}
              onChange={() => handleToggle(ticket.id)}
              className="mt-1 size-5 rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]"
            />
            <img 
              src={ticket.image} 
              alt={ticket.title}
              className="size-20 rounded-[8px] object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-[#e9e5fb] text-[#7b3ff2] text-[11px] rounded-[4px] font-['Pretendard:SemiBold',sans-serif]">
                  {ticket.category}
                </span>
              </div>
              <p className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#111] mb-2 line-clamp-2">
                {ticket.title}
              </p>
              <div className="space-y-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3 text-[#666]" />
                  <span className="text-[11px] text-[#666]">{ticket.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3 text-[#666]" />
                  <span className="text-[11px] text-[#666]">{ticket.duration}</span>
                </div>
              </div>
              <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#7b3ff2]">
                {ticket.price.toLocaleString()}ì
              </p>
            </div>
          </motion.label>
        ))}
      </div>

      {/* ì í ìë£ ë²í¼ */}
      <div className="sticky bottom-0 bg-white pt-4 pb-2">
        <div className="bg-[#f8f9fa] rounded-[12px] p-3 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#666]">
              ì íí ì¡í°ë¹í° {selectedTickets.length}ê°
            </span>
            <div>
              <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">
                +{totalPrice.toLocaleString()}
              </span>
              <span className="text-[14px] text-[#666]">ì</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onComplete(selectedTickets)}
          className="w-full py-4 bg-[#7b3ff2] text-white rounded-[12px] text-[16px] font-['Pretendard:Bold',sans-serif] hover:bg-[#6930d9] transition-colors"
        >
          {selectedTickets.length > 0 ? "ì í ìë£" : "ê±´ëë°ê¸°"}
        </button>
      </div>
    </div>
  );
}
