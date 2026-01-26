import { Users, Baby, Heart, TrendingDown, Sparkles, Camera, Utensils, Mountain } from 'lucide-react';

interface TravelSelectorProps {
  activeTab: 'companion' | 'theme';
  onTabChange: (tab: 'companion' | 'theme') => void;
  selectedCompanion: string;
  selectedTheme: string;
  onCompanionToggle: (type: string) => void;
  onThemeToggle: (type: string) => void;
}

const companionTypes = [
  { id: 'children', label: '아이 동반', icon: Baby },
  { id: 'parents', label: '부모님 효도', icon: Users },
  { id: 'couple', label: '커플·친구', icon: Heart },
  { id: 'budget', label: '가성비 중시', icon: TrendingDown },
];

const themeTypes = [
  { id: 'relaxation', label: '휴양·힐링', icon: Sparkles },
  { id: 'activity', label: '액티비티', icon: Mountain },
  { id: 'culture', label: '문화·관광', icon: Camera },
  { id: 'food', label: '맛집 투어', icon: Utensils },
];

export function TravelSelector({
  activeTab,
  onTabChange,
  selectedCompanion,
  selectedTheme,
  onCompanionToggle,
  onThemeToggle
}: TravelSelectorProps) {
  const currentOptions = activeTab === 'companion' ? companionTypes : themeTypes;
  const currentSelected = activeTab === 'companion' ? selectedCompanion : selectedTheme;
  const currentToggle = activeTab === 'companion' ? onCompanionToggle : onThemeToggle;

  return (
    <section className="mt-[0px] mb-[30px]">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-[20px] px-[10px] border-b border-[#E5E7EB] bg-white rounded-xl" style={{ boxShadow: '0 4px 7px 0 rgba(0, 0, 0, 0.10)' }}>
        <button
          onClick={() => onTabChange('companion')}
          className={`px-4 py-3 transition-all text-[14px] relative flex flex-col items-center gap-1 ${
            activeTab === 'companion'
              ? 'text-[#7B3FF2] font-semibold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          여행 동반자
          {activeTab === 'companion' && (
            <div className="absolute bottom-0 left-0 right-0 mx-auto w-[70px] h-[3px] bg-[#7B3FF2] rounded-t-[2px]"></div>
          )}
        </button>
        <button
          onClick={() => onTabChange('theme')}
          className={`px-4 py-3 transition-all text-[14px] relative flex flex-col items-center gap-1 ${
            activeTab === 'theme'
              ? 'text-[#7B3FF2] font-semibold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          여행 테마
          {activeTab === 'theme' && (
            <div className="absolute bottom-0 left-0 right-0 mx-auto w-[70px] h-[3px] bg-[#7B3FF2] rounded-t-[2px]"></div>
          )}
        </button>
      </div>

      {/* Options */}
      <div className="flex gap-3 my-[-5px]">
        {currentOptions.map(({ id, label }) => {
          const isSelected = currentSelected === id;
          return (
            <button
              key={id}
              onClick={() => currentToggle(id)}
              className={`
                flex items-center justify-center px-2 py-2 rounded-full border-1 transition-all
                ${isSelected
                  ? 'bg-gradient-to-l from-[#6976FF] to-[#7B3FF2] border-transparent text-white'
                  : 'bg-[#E9E5FB] border-[#E9E5FB] text-gray-600 font-normal hover:border-[#7B3FF2]'
                }
              `}
            >
              <span className="text-[13px]">{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
