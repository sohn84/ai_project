import os
import asyncio
from playwright.async_api import async_playwright

questions = [
    "하와이에서 와이키키 해변 근처 호텔 상품 추천해줘",
    "발리 주요 관광지를 둘러보는 패키지 상품 알려줘",
    "싱가포르 대표 관광지가 포함된 여행 패키지 추천해줘",
    "아이랑 가기 좋은 일정으로 구성된 해외 패키지 상품 있어?",
    "부모님 모시고 가기 좋은 관광 위주 패키지 상품 추천해줘",
    "자유시간이 있으면서 관광지도 포함된 여행 상품 알려줘",
    "유명 관광지 중심으로 구성된 유럽 패키지 상품 추천해줘",
    "뉴욕 핵심 관광지가 포함된 여행 패키지 있어?",
    "방콕 사원 투어가 포함된 패키지 상품 추천해줘"
]

async def run():
    os.environ['HOME'] = 'C:\\Users\\HANA'
    results = []
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
            viewport={'width': 400, 'height': 800}
        )
        page = await context.new_page()
        
        print("하나투어 AI 챗봇 접속 중...")
        await page.goto('https://m.hanatour.com/dcr/chatai')
        await page.wait_for_timeout(5000)
        
        for i, q in enumerate(questions):
            print(f"[{i+1}/9] 질문: {q}")
            
            # 입력
            input_selector = "textarea, input[placeholder*='궁금하신']"
            chat_input = page.locator(input_selector).first
            await chat_input.fill(q)
            await page.keyboard.press("Enter")
            
            # 충분한 답변 생성 대기 (카드가 로딩되는 시간 포함)
            await page.wait_for_timeout(30000)
            
            # 상세 텍스트 추출
            # 1. 봇의 텍스트 메시지
            # 2. 카드 내의 상품명 및 가격
            extracted_data = await page.evaluate('''() => {
                const data = [];
                
                // 1. 일반 텍스트 메시지 버블 (주로 상단에 위치)
                const bubbles = Array.from(document.querySelectorAll('div')).filter(el => {
                    return el.innerText.length > 20 && el.innerText.length < 500 && 
                           window.getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)';
                });
                
                // 2. 카드 상품 정보 (상품명, 가격 등)
                // 보통 카드 내에 제목과 가격이 포함됨. 
                // 스크린샷 기준으로 이미지 아래의 텍스트 영역을 찾음.
                const products = [];
                const cards = Array.from(document.querySelectorAll('div')).filter(el => el.innerText.includes('원~'));
                
                cards.forEach(card => {
                    const text = card.innerText.trim();
                    if (text.length > 5 && text.length < 200) {
                        products.append(text.replace(/\\n/g, ' '));
                    }
                });

                // 간단하게 현재 화면에 보이는 유의미한 텍스트들을 모음
                // 봇의 마지막 응답 섹션을 찾아서 그 안의 텍스트를 구성
                return document.body.innerText;
            }''')
            
            # 수동 파싱 대신, 좀 더 정교한 셀렉터 사용 시도
            # 상품 제목들은 보통 특정 태그나 클래스 아래에 있음.
            # 스크린샷 1에서 '르네상스 호놀룰루 호텔 & 스파' 같은 텍스트 추출
            
            # page.evaluate를 사용하여 좀 더 깔끔하게 데이터 수집
            clean_res = await page.evaluate('''(question) => {
                let result = "";
                
                // 마지막 발화 뭉치를 찾으려고 함.
                // 보통 챗봇은 새로운 질문마다 컨테이너를 추가하거나 리스트 끝에 추가함.
                // 모든 텍스트를 가져오기보다, 마지막 질문 이후의 텍스트만 가져오기 위해 
                // 질문을 앵커로 사용.
                const allBodyText = document.body.innerText;
                const parts = allBodyText.split(question);
                const lastPart = parts[parts.length - 1];
                
                // 추천 질문 버튼들 제거 (스크린샷 하단의 동그란 버튼 가이드 텍스트들)
                // "자세히 알려줘", "정보 알려줘" 등의 문구가 포함된 라인들 제거
                const lines = lastPart.split('\\n').map(l => l.trim()).filter(l => l.length > 0);
                const filteredLines = lines.filter(l => 
                    !l.includes("자세히 알려줘") && 
                    !l.includes("정보 알려줘") && 
                    !l.includes("추천해줘") &&
                    !l.includes("어떤 거야?") &&
                    !l.includes("궁금하신 내용을 물어보세요") &&
                    !l.includes("AI 핵심요약")
                );
                
                return filteredLines.join('\\n');
            }''', q)
            
            results.append({"q": q, "a": clean_res})
            print(f"[{i+1}/9] 완료")

        await browser.close()
        
        md_content = "# 하나투어 AI 챗봇 상세 답변 정리\n\n"
        for res in results:
            md_content += f"### 질문: {res['q']}\n"
            md_content += f"**답변 요약**:\n{res['a']}\n\n---\n\n"
            
        with open('chatbot_answers_detailed.md', 'w', encoding='utf-8') as f:
            f.write(md_content)

if __name__ == "__main__":
    asyncio.run(run())
