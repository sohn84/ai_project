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
          summary: '아이와 함께라면 이동 부담이 적고 숙소 내 부대시설 활용도가 높은 상품이 적합합니다.',
          insights: [
            { product: 'A', reason: '키즈 풀과 워터파크가 있는 리조트형 숙소로 아이들이 즐길 거리가 풍부합니다' },
            { product: 'B', reason: '이동 시간이 가장 짧고 자유시간이 많아 아이들 체력 관리에 유리합니다' },
            { product: 'C', reason: '가족 단위 여행객을 위한 패밀리룸 구성으로 편안한 휴식이 가능합니다' },
          ]
        };
      } else if (selectedValue === 'parents') {
        return {
          summary: '부모님과 함께라면 편안한 이동 일정과 건강식 제공, 휴식 시간 확보가 중요합니다.',
          insights: [
            { product: 'A', reason: '온천 시설이 포함되어 있어 부모님 건강에 도움이 됩니다' },
            { product: 'B', reason: '일정이 여유로우며 한식 제공 비율이 높아 부모님 입맛에 적합합니다' },
            { product: 'C', reason: '엘리베이터가 있는 저층 호텔로 이동 편의성이 뛰어납니다' },
          ]
        };
      } else if (selectedValue === 'couple') {
        return {
          summary: '커플·친구와 함께라면 자유시간과 특별한 경험, 감성적인 공간이 중요합니다.',
          insights: [
            { product: 'A', reason: '오션뷰 객실과 루프탑 바에서 로맨틱한 시간을 보낼 수 있습니다' },
            { product: 'B', reason: '인스타그램 감성 카페와 포토 스팟이 많아 추억 만들기에 좋습니다' },
            { product: 'C', reason: '나이트 투어와 라이브 공연이 포함되어 특별한 경험이 가능합니다' },
          ]
        };
      } else if (selectedValue === 'budget') {
        return {
          summary: '가성비를 중시한다면 가격 대비 포함 사항과 숙소 등급, 식사 횟수를 중점적으로 확인하세요.',
          insights: [
            { product: 'A', reason: '가장 저렴한 가격으로 필수 일정을 모두 포함하고 있습니다' },
            { product: 'B', reason: '중간 가격대이지만 5성급 호텔과 전 일정 식사가 포함되어 알찹니다' },
            { product: 'C', reason: '프리미엄 옵션이 많아 추가 비용 없이 다양한 액티비티를 즐길 수 있습니다' },
          ]
        };
      }
    } else if (tabType === 'theme') {
      // 여행 테마 기준 브리핑
      if (selectedValue === 'relaxation') {
        return {
          summary: '휴양·힐링 여행이라면 여유로운 일정과 스파 시설, 조용한 환경이 중요합니다.',
          insights: [
            { product: 'A', reason: '프라이빗 비치와 스파 패키지가 포함되어 완벽한 힐링이 가능합니다' },
            { product: 'B', reason: '온천 리조트에서 자연 속 휴식을 즐길 수 있습니다' },
            { product: 'C', reason: '요가 클래스와 명상 프로그램이 있어 심신 안정에 좋습니다' },
          ]
        };
      } else if (selectedValue === 'activity') {
        return {
          summary: '액티비티 중심 여행이라면 다양한 체험 프로그램과 모험적인 일정이 필요합니다.',
          insights: [
            { product: 'A', reason: '스쿠버다이빙과 제트스키 등 해양 스포츠를 무제한 즐길 수 있습니다' },
            { product: 'B', reason: '패러글라이딩과 번지점프 등 익스트림 액티비티가 포함되어 있습니다' },
            { product: 'C', reason: '트레킹 코스와 ATV 체험 등 육상 활동이 다양합니다' },
          ]
        };
      } else if (selectedValue === 'culture') {
        return {
          summary: '문화·관광 여행이라면 주요 명소 방문과 가이드 투어, 역사 체험이 중요합니다.',
          insights: [
            { product: 'A', reason: '유네스코 세계문화유산 3곳을 모두 방문하는 일정입니다' },
            { product: 'B', reason: '현지 전문 가이드와 함께하는 심화 문화 투어가 포함됩니다' },
            { product: 'C', reason: '박물관 입장권과 전통 공연 관람이 모두 포함되어 있습니다' },
          ]
        };
      } else if (selectedValue === 'food') {
        return {
          summary: '맛집 투어라면 현지 미식 경험과 다양한 식당 방문, 요리 체험이 핵심입니다.',
          insights: [
            { product: 'A', reason: '미슐랭 가이드 추천 레스토랑 3곳에서 식사가 포함됩니다' },
            { product: 'B', reason: '현지 시장 투어와 쿠킹 클래스로 직접 요리를 배울 수 있습니다' },
            { product: 'C', reason: '와이너리 투어와 와인 페어링 디너가 포함된 미식 일정입니다' },
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
