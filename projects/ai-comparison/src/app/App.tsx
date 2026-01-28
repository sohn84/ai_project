import { useState } from 'react';
import { TravelSelector } from './components/TravelSelector';
import { AIBriefing } from './components/AIBriefing';
import { ProductComparison } from './components/ProductComparison';
import { AIConcierge } from './components/AIConcierge';

// 로고 이미지 (실제 배포 시 교체 필요)
const logoImage = "https://image.hanatour.com/usr/static/img2/mobile/icon/ico_service_chatgpt.png";

export default function App() {
  const [activeTab, setActiveTab] = useState<'companion' | 'theme'>('companion');
  const [selectedCompanion, setSelectedCompanion] = useState<string>('children');
  const [selectedTheme, setSelectedTheme] = useState<string>('relaxation');

  const toggleCompanion = (type: string) => {
    setSelectedCompanion(prev => prev === type ? '' : type);
  };

  const toggleTheme = (type: string) => {
    setSelectedTheme(prev => prev === type ? '' : type);
  };

  const handleTabChange = (tab: 'companion' | 'theme') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#F7F5FE]">
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ background: 'linear-gradient(182deg, #EED6FF -6.04%, #F7F5FE 63.91%)' }}>
        <div className="max-w-5xl mx-auto px-6 py-6 pt-[24px] pr-[24px] pb-[10px] pl-[24px]">
          <div className="flex items-center gap-3 mb-[5px] mt-[40px]">
            <div className="w-6 h-6 overflow-hidden">
              <img src={logoImage} alt="HANA TOUR AI" className="h-6 object-cover object-left" style={{ width: '24px' }} />
            </div>
            <h1 className="text-4xl text-gray-900 text-[24px] font-semibold mx-[-5px] text-left">AI 비교 브리핑</h1>
          </div>
          <p className="text-lg text-[rgb(142,142,147)] text-[14px]">
            AI가 여행 조건에 맞는 상품을 분석 해드려요.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-[24px] py-[20px] space-y-16 border-t-0 pt-[10px] pb-[20px]" style={{ background: '#F7F5FE' }}>
        {/* Section 1: Travel Type Selection with Tabs */}
        <TravelSelector
          activeTab={activeTab}
          onTabChange={handleTabChange}
          selectedCompanion={selectedCompanion}
          selectedTheme={selectedTheme}
          onCompanionToggle={toggleCompanion}
          onThemeToggle={toggleTheme}
        />

        {/* Section 2: AI Briefing */}
        <AIBriefing
          tabType={activeTab}
          selectedValue={activeTab === 'companion' ? selectedCompanion : selectedTheme}
        />

        {/* Section 3: Product Comparison */}
        <ProductComparison />

        {/* Section 4: CTA to Detailed Comparison */}
        <section className="text-center mt-[-35px] mb-[20px]">
          <button className="w-full py-[16px] bg-[#7B3FF2] text-white rounded-[50px] hover:bg-[#6A2FE0] transition-colors">
            상세 비교하기
          </button>
          <p className="text-sm text-[#7B3FF2] text-[13px] inline-block bg-white border border-[#7B3FF2] rounded-[25px] px-[16px] py-[4px] relative mt-[-10px] shadow-sm">
            일정·숙소·포함 사항을 항목별로 비교할 수 있어요
            <span className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-[#7B3FF2] rotate-45 mt-[-3px]"></span>
          </p>
        </section>
      </main>

      {/* Section 5: AI Concierge */}
      <AIConcierge />
    </div>
  );
}
