# Hanatour MCP Tools 운영 가이드

## 1. 개요
Hanatour MCP는 AI 에이전트가 하나투어의 여행 상품(항공, 호텔, 패키지) 데이터에 접근할 수 있도록 하는 NestJS 기반 서버입니다.

### 서버 정보
- [cite_start]**프로토콜:** MCP (Model Context Protocol) [cite: 9]
- [cite_start]**Transport:** Streamable HTTP (SSE) [cite: 9]
- [cite_start]**인증:** Via Proxy [cite: 9]
- [cite_start]**검증:** Zod Schema 기반 [cite: 9]
- [cite_start]**서버 URL:** `https://boilingly-nonimpression` (내부망) [cite: 5]

---

## 2. 도구(Tools) 명세 및 스키마

### 2.1 `search_air_products` (항공권 운임 조회)
[cite_start]서울(SEL) 출발 왕복 항공권을 조회하며, 상위 10개 결과를 반환합니다. [cite: 12]

**Input Schema (Required):**
- [cite_start]`country` (string): 국가명 (예: "태국") [cite: 14]
- [cite_start]`city` (string): 도시명 (예: "방콕") [cite: 14]
- [cite_start]`startDate` (string): 가는날 (YYYYMMDD 또는 YYYY-MM-DD, 자동변환 지원) [cite: 14, 256]
- [cite_start]`endDate` (string): 오는날 (YYYYMMDD) [cite: 14]
- [cite_start]`adultPassengerCount` (number): 성인 탑승객 수 [cite: 14]

**Input Schema (Optional):**
- [cite_start]`sort` (string): 정렬 기준 (`RECOMMENDED`, `LOWEST_PRICE`, `DEPARTURE_DATE_ASC`) [cite: 14, 16]
- [cite_start]`airlineName` (string): 항공사 필터 (예: "대한항공") [cite: 15]
- [cite_start]`hasFreeBaggage` (boolean): 무료 수하물 포함 여부 [cite: 15]
- [cite_start]`isDirect` (boolean): 직항 여부 [cite: 15]

---

### 2.2 `search_hotel_products` (호텔 독립 검색)
항공권 없이 호텔만 독립적으로 검색합니다. [cite_start]가격, 등급, 조식 여부 등으로 필터링이 가능합니다. [cite: 64]

**Input Schema (Required):**
- [cite_start]`country` (string): 국가명 (예: "베트남") [cite: 66]
- [cite_start]`city` (string): 도시명 (예: "다낭") [cite: 66]
- [cite_start]`startDate` (string): 체크인 (YYYYMMDD) [cite: 66]
- [cite_start]`endDate` (string): 체크아웃 (YYYYMMDD) [cite: 66]
- [cite_start]`adultCount` (number): 성인 수 [cite: 66]

**Input Schema (Optional):**
- [cite_start]`fareId` (string): 항공권과 연동 시 사용 (`search_air_products` 결과값) [cite: 67]
- [cite_start]`grades` (string): 호텔 등급, 쉼표로 구분 (예: "4,5") [cite: 67]
- [cite_start]`hasBreakfast` (boolean): 조식 포함 여부 [cite: 67]
- [cite_start]`rating` (string): 평점 필터 (예: "8.0") [cite: 67]

---

### 2.3 `search_hotel_rate` (객실 요금 상세 조회)
[cite_start]특정 호텔의 객실 타입별 상세 요금을 조회합니다. [cite: 104]

**Input Schema (Required):**
- [cite_start]`country` (string): 국가명 [cite: 106]
- [cite_start]`city` (string): 도시명 [cite: 106]
- [cite_start]`startDate` (string): 체크인 [cite: 108]
- [cite_start]`endDate` (string): 체크아웃 [cite: 111]
- [cite_start]`adultCount` (number): 성인 수 [cite: 114]
- [cite_start]`hotelCode` (string): 호텔 코드 (`search_hotel_products` 응답의 `hotelCode`) [cite: 117]

---

### 2.4 `search_travel_package_products` (패키지 상품 단건 추천)
[cite_start]조건에 맞는 패키지 상품을 하나 추천합니다. [cite: 152]

**Input Schema (Required):**
- [cite_start]`city` (string): 도시명 (예: "오사카") [cite: 154]
- [cite_start]`startDate` (string): 출발일 [cite: 154]
- [cite_start]`endDate` (string): 귀국일 [cite: 154]

**Input Schema (Optional):**
- [cite_start]`yearMonth` (string): 년월 기준 검색 (예: "202501") [cite: 154]
- [cite_start]`travelDays` (number): 여행 일수 [cite: 154]
- [cite_start]`priceRange` (string): 가격대 (예: "1000000-2000000") [cite: 154]
- [cite_start]`sort` (string): 정렬 (`PRICE_ASC` 등) [cite: 154]

---

### 2.5 `get_package_product_schedule` (패키지 일정 상세)
[cite_start]패키지 상품의 상세 일정을 조회합니다. [cite: 176]

**Input Schema (Required):**
- [cite_start]`productCode` (string): 패키지 상품 코드 [cite: 179]

---

## 3. 실무 활용 시나리오 (Workflow)

AI 에이전트는 사용자의 요청에 따라 다음 순서로 도구를 호출해야 합니다.

[cite_start]**시나리오 1: 항공+호텔 패키지 구성 (Airtel)** [cite: 222]
1. `search_air_products` 호출 → `fareId` 추출
2. `search_hotel_products` 호출 (Input에 `fareId` 포함) → `hotelCode` 추출
3. `search_hotel_rate` 호출 (`hotelCode` 사용) → 최종 예약 진행

[cite_start]**시나리오 2: 패키지 상품 추천** [cite: 239]
1. `search_travel_package_products` 호출 → `productCode` 추출
2. `get_package_product_schedule` 호출 → 상세 일정 안내
3. `productDetailUrl` 제공

---

## 4. 제약사항 및 트러블슈팅

### 제약사항
- [cite_start]**항공권:** 서울(SEL) 출발 왕복만 지원합니다. [cite: 260]
- **한글 파라미터:** `country`, `city` 등은 반드시 **한글**로 입력해야 합니다. (예: "Thailand" (X) [cite_start]-> "태국" (O)) [cite: 276]

### 트러블슈팅 가이드
- [cite_start]**날짜 형식 오류:** "Invalid date format" 발생 시 `YYYYMMDD` 형식을 준수했는지 확인하세요. [cite: 267]
- [cite_start]**검색 결과 없음:** 한글 파라미터가 정확한지 확인하세요. [cite: 275]
- [cite_start]**Timeout:** 30초 이상 무응답 시 검색 조건(필터)을 단순화하여 재시도하세요. [cite: 287]
- [cite_start]**가격 0원:** 호텔 가격이 0으로 나오면 `search_hotel_rate`를 통해 재조회해야 합니다. [cite: 290]