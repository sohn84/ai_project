interface AIBriefingProps {
  tabType: 'companion' | 'theme';
  selectedValue: string;
}

export function AIBriefing({ tabType, selectedValue }: AIBriefingProps) {
  // Dynamic briefing based on selections
  const getBriefingContent = () => {
    if (tabType === 'companion') {
      // 여행 동반자 기준 브리핑
      if (selectedValue === 'children') {
        return {
          summary: '"아이와 함께하는 여행은 이동 부담을 최소화하고, 숙소 내 풀장이나 키즈클럽 같은 편의시설이 갖춰져 있어야 합니다. 또한 식사 편의성과 아이 맞춤 액티비티가 있으면 더욱 좋습니다.',
          insights: [
            { product: 'A', reason: '⭐ 디즈니랜드 종일 체험으로 아이에게 최고의 만족도 제공, 노쇼핑+리무진으로 이동 피로 최소화' },
            { product: 'B', reason: '⭐⭐ 샹그릴라 리조트는 키즈풀·키즈클럽 완비된 가족 친화 리조트, 리조트 내 체류 시간 확보로 아이 컨디션 관리 용이' },
            { product: 'C', reason: '🤔하루 5개 이상 관광지 이동으로 아이에게 체력적 부담, 산호섬·농눅빌리지는 매력적이나 일정이 빡빡함' },
          ]
        };
      } else if (selectedValue === 'parents') {
        return {
          summary: '부모님과의 여행은 노쇼핑·노옵션이 기본입니다. 편안한 이동수단(비즈니스석, 리무진)과 한식 포함 여부, 온천이나 마사지 같은 힐링 요소가 중요합니다.',
          insights: [
            { product: 'A', reason: '⭐⭐노쇼핑 확정 + 리무진 이동으로 부모님 피로도 최소화, 콘래드 뷔페식 포함, 준5성 호텔 투숙' },
            { product: 'B', reason: '⭐5성 리조트 숙박으로 편안하나, 아일랜드호핑 시 배 이동이 어르신께 부담, 한식 제공 불확실' },
            { product: 'C', reason: '🤔하루 5개 이상 관광지 이동으로 체력 소모 과다, 쇼핑 압박 가능성, 일정이 빡빡함' },
          ]
        };
      } else if (selectedValue === 'couple') {
        return {
          summary: '커플이나 친구와의 여행은 인스타그래머블한 명소, 충분한 자유 시간, 트렌디한 숙소, 그리고 야간 액티비티가 핵심입니다.',
          insights: [
            { product: 'A', reason: '⭐⭐외탄 야경 + 황포강 유람선으로 로맨틱한 분위기, 신천지·스타벅스 리저브 등 SNS 핫플 다수' },
            { product: 'B', reason: '⭐⭐샹그릴라 프라이빗 비치에서 커플 힐링, 선셋 뷰 최고, 아일랜드호핑으로 인생샷 가능' },
            { product: 'C', reason: '⭐아시아티크 야시장 + 차오프라야강 야경, 티파니쇼 등 야간 액티비티 풍부하나 자유시간 부족' },
          ]
        };
      } else if (selectedValue === 'budget') {
        return {
          summary: '가성비를 중시한다면 가격 대비 포함 사항과 숙소 등급, 식사 횟수를 중점적으로 확인하세요.',
          insights: [
            { product: 'A', reason: '⭐디즈니랜드 입장료 포함 시 가격 상승, 준5성+리무진으로 프리미엄 상품 성격' },
            { product: 'B', reason: '🤔샹그릴라 5성급 리조트로 숙박비 비중 높음, 고급 휴양 목적에 적합' },
            { product: 'C', reason: '⭐⭐5일간 관광지 15곳 이상 방문, 산호섬+농눅빌리지+쇼+야시장 등 포함 내역 풍성, 가격 대비 알참' },
          ]
        };
      }
    } else if (tabType === 'theme') {
      // 여행 테마 기준 브리핑
      if (selectedValue === 'relaxation') {
        return {
          summary: '휴양과 힐링을 원한다면 여유로운 일정이 핵심입니다. 리조트 내에서 충분히 머물며 자연경관을 즐기고, 스파나 마사지 같은 힐링 프로그램이 포함되어 있으면 완벽합니다.',
          insights: [
            { product: 'A', reason: '🤔 디즈니랜드·동방명주·예원 등 관광 중심 일정으로 휴양보다는 액티비티에 가까움' },
            { product: 'B', reason: '⭐⭐ 5성급 샹그릴라 비치 리조트에서 3박 연박, 프라이빗 비치와 스파 시설 완비, 아일랜드호핑 외 리조트 휴식 시간 충분' },
            { product: 'C', reason: '🤔 무앙보란·산호섬·아시아티크 등 관광 일정 과다, 휴양보다는 문화관광 성격이 강함' },
          ]
        };
      } else if (selectedValue === 'activity') {
        return {
          summary: '액티비티 중심 여행은 스노클링, 짚라인 같은 체험형 일정이 핵심입니다. 전문 가이드 동행과 장비 대여 포함 여부도 중요합니다.',
          insights: [
            { product: 'A', reason: '⭐디즈니랜드 어트랙션이 주요 액티비티, 테마파크형 체험에 집중' },
            { product: 'B', reason: '⭐⭐아일랜드호핑 + 스노클링 + 다이빙 등 해양 액티비티 집중, 올랑고섬 탐험 포함' },
            { product: 'C', reason: '⭐⭐산호섬 해양스포츠 + 농눅빌리지 코끼리 체험 등 다양한 액티비티, 쇼 관람까지 풍성' },
          ]
        };
      } else if (selectedValue === 'culture') {
        return {
          summary: '문화·관광 여행이라면 주요 명소 방문과 가이드 투어, 역사 체험이 중요합니다.',
          insights: [
            { product: 'A', reason: '⭐⭐임시정부청사(역사) + 예원(전통정원) + 동방명주(랜드마크) + 외탄(근대건축) 등 문화관광 최적' },
            { product: 'B', reason: '🤔막탄 슈라인·성당 정도로 문화 콘텐츠 제한적, 휴양 중심 상품' },
            { product: 'C', reason: '⭐⭐무앙보란(고대도시) + 황금절벽사원 + 진리의 성전 등 태국 역사·종교 문화 체험 풍부' },
          ]
        };
      } else if (selectedValue === 'food') {
        return {
          summary: '"맛집 투어는 현지 유명 식당, 특식 포함 횟수, 야시장 방문, 미식 체험이 핵심입니다.',
          insights: [
            { product: 'A', reason: '⭐⭐콘래드 뷔페 + 릴리안 타르트 & 밀크티 특식 포함, 상해 옛거리 먹거리 탐방 가능' },
            { product: 'B', reason: '⭐망고 1KG 제공 + 열대과일 시장 방문, 그러나 현지 맛집 투어는 제한적' },
            { product: 'C', reason: '⭐⭐파타야 수상시장 + 아시아티크 야시장 등 태국 길거리 음식 천국, 미식 체험 다양' },
          ]
        };
      }
    }

    return {
      summary: '여행 스타일에 맞는 상품을 선택하기 위해 조건을 선택해주세요. AI 맞춤 분석을 제공합니다.',
      insights: [
        { product: 'A', reason: '가족 단위 여행객에게 적합한 올인클루시브 리조트 상품입니다' },
        { product: 'B', reason: '자유시간이 많아 개인 일정을 즐기고 싶은 분들께 추천합니다' },
        { product: 'C', reason: '럭셔리한 경험을 원하시는 분들을 위한 프리미엄 상품입니다' },
      ]
    };
  };

  const content = getBriefingContent();

  return (
    <section>
      <div className="rounded-[10px] bg-white px-[15px] py-[20px] pt-[15px] pr-[15px] pb-[15px] pl-[17px] mt-[-10px]">
        <div className="text-[#7B3FF2] mb-[15px] leading-relaxed text-[16px] font-semibold flex items-start gap-2">
          <span className="not-italic text-[15px]">"{content.summary}"</span>
        </div>

        <div className="space-y-4">
          {content.insights.map((insight, index) => (
            <div key={index} className="flex gap-3 mb-[5px]">
              <span className="text-[#00D9C0] flex-shrink-0 mr-[-5px]">·</span>
              <div>
                <span className="inline-flex items-center justify-center w-5 h-5 bg-[#7B3FF2]/10 text-[#7B3FF2] rounded-full text-[11px] font-medium mr-[5px]">{insight.product}</span>
                <span className="text-gray-700 text-[14px]">: {insight.reason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
