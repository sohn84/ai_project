/**
 * MCP (Model Context Protocol) 클라이언트
 * Streamable HTTP 형식 지원
 */

// 개발 환경: Vite 프록시 사용 (/mcp → ngrok URL)
// 프로덕션 환경: 직접 URL 사용
const MCP_SERVER_URL = import.meta.env.DEV
  ? '/mcp'
  : 'https://boilingly-nonimpressionable-earnest.ngrok-free.dev/mcp';

interface McpRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?: Record<string, unknown>;
}

interface McpResponse {
  jsonrpc: '2.0';
  id: number;
  result?: unknown;
  error?: {
    code: number;
    message: string;
  };
}

let requestId = 0;

/**
 * SSE 스트림에서 JSON-RPC 응답 파싱
 */
function parseSSEResponse(text: string): McpResponse | null {
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6).trim();
      if (data && data !== '[DONE]') {
        try {
          return JSON.parse(data);
        } catch {
          console.warn('Failed to parse SSE data:', data);
        }
      }
    }
  }
  return null;
}

/**
 * MCP 서버에 요청을 보내는 기본 함수 (Streamable HTTP)
 */
async function mcpRequest(method: string, params?: Record<string, unknown>): Promise<McpResponse> {
  const request: McpRequest = {
    jsonrpc: '2.0',
    id: ++requestId,
    method,
    params,
  };

  const response = await fetch(MCP_SERVER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`MCP request failed: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';

  // SSE 스트림 응답 처리
  if (contentType.includes('text/event-stream')) {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullText = '';
    let result: McpResponse | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      fullText += decoder.decode(value, { stream: true });

      // 각 청크에서 완전한 JSON-RPC 응답 찾기
      const parsed = parseSSEResponse(fullText);
      if (parsed) {
        result = parsed;
      }
    }

    if (result) {
      return result;
    }

    throw new Error('No valid response received from SSE stream');
  }

  // 일반 JSON 응답 처리
  return response.json();
}

/**
 * MCP 도구 호출
 */
export async function callTool(toolName: string, args: Record<string, unknown> = {}) {
  const response = await mcpRequest('tools/call', {
    name: toolName,
    arguments: args,
  });

  if (response.error) {
    throw new Error(`MCP tool error: ${response.error.message}`);
  }

  return response.result;
}

/**
 * 사용 가능한 도구 목록 조회
 */
export async function listTools() {
  const response = await mcpRequest('tools/list');
  return response.result;
}

// ============================================
// 상품검색 API 래퍼 함수들
// ============================================

// 날짜를 YYYYMMDD 형식으로 변환
function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// 기본 날짜 생성 (오늘로부터 7일 후 ~ 14일 후)
function getDefaultDates() {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 7);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 14);

  return {
    startDate: formatDateToYYYYMMDD(startDate),
    endDate: formatDateToYYYYMMDD(endDate),
  };
}

/**
 * 항공 상품 검색
 * SEL↔도시 왕복 여정에서 상위 10개만 반환
 */
export async function searchAirProducts(params: {
  country: string;              // 국가 (필수, 한글)
  city: string;                 // 도착 도시 (필수, 한글)
  startDate?: string;           // 출발일 (YYYYMMDD)
  endDate?: string;             // 귀국일 (YYYYMMDD)
  adultPassengerCount?: number; // 성인 탑승객 수
  airlineName?: string;         // 항공사 필터 (선택)
  hasFreeBaggage?: boolean;     // 무료 수하물 포함 여부 (선택)
  isDirect?: boolean;           // 직항 여부 (선택)
  sort?: 'RECOMMENDED' | 'LOWEST_PRICE' | 'DEPARTURE_DATE_ASC'; // 정렬 기준 (선택)
}) {
  const dates = getDefaultDates();
  return callTool('search_air_products', {
    country: params.country,
    city: params.city,
    startDate: params.startDate || dates.startDate,
    endDate: params.endDate || dates.endDate,
    adultPassengerCount: params.adultPassengerCount || 2,
    ...(params.airlineName && { airlineName: params.airlineName }),
    ...(params.hasFreeBaggage !== undefined && { hasFreeBaggage: params.hasFreeBaggage }),
    ...(params.isDirect !== undefined && { isDirect: params.isDirect }),
    ...(params.sort && { sort: params.sort }),
  });
}

/**
 * 호텔 상품 검색
 * 가격, 등급, 조식, 숙소타입, 평점 필터 지원
 */
export async function searchHotelProducts(params: {
  country: string;        // 국가 (필수, 한글)
  city: string;           // 도시 (필수, 한글)
  startDate?: string;     // 체크인 (YYYYMMDD)
  endDate?: string;       // 체크아웃 (YYYYMMDD)
  adultCount?: number;    // 성인 수
  fareId?: string;        // 항공권과 연동 시 사용 (search_air_products 결과값)
  grades?: string;        // 호텔 등급, 쉼표로 구분 (예: "4,5")
  hasBreakfast?: boolean; // 조식 포함 여부
  rating?: string;        // 평점 필터 (예: "8.0")
  hotelRoomType?: string; // 숙소 타입
  sort?: 'RECOMMENDED' | 'LOWEST_PRICE'; // 정렬 기준
}) {
  const dates = getDefaultDates();
  return callTool('search_hotel_products', {
    country: params.country,
    city: params.city,
    startDate: params.startDate || dates.startDate,
    endDate: params.endDate || dates.endDate,
    adultCount: params.adultCount || 2,
    ...(params.fareId && { fareId: params.fareId }),
    ...(params.grades && { grades: params.grades }),
    ...(params.hasBreakfast !== undefined && { hasBreakfast: params.hasBreakfast }),
    ...(params.rating && { rating: params.rating }),
    ...(params.hotelRoomType && { hotelRoomType: params.hotelRoomType }),
    ...(params.sort && { sort: params.sort }),
  });
}

/**
 * 호텔 요금 상세 조회
 * 특정 호텔의 객실 타입별 상세 요금을 조회
 */
export async function searchHotelRate(params: {
  country: string;    // 국가 (필수, 한글)
  city: string;       // 도시 (필수, 한글)
  startDate: string;  // 체크인 (필수, YYYYMMDD)
  endDate: string;    // 체크아웃 (필수, YYYYMMDD)
  adultCount: number; // 성인 수 (필수)
  hotelCode: string;  // 호텔 코드 (필수, search_hotel_products 응답에서 추출)
  fareId?: string;    // 항공권 연동 시 사용 (선택)
}) {
  return callTool('search_hotel_rate', {
    country: params.country,
    city: params.city,
    startDate: params.startDate,
    endDate: params.endDate,
    adultCount: params.adultCount,
    hotelCode: params.hotelCode,
    ...(params.fareId && { fareId: params.fareId }),
  });
}

/**
 * 여행 패키지 상품 검색
 * 패키지 여행 상품을 단건 추천
 */
export async function searchTravelPackageProducts(params: {
  city: string;           // 여행 도시 (필수, 한글)
  startDate: string;      // 출발일 (필수, YYYYMMDD)
  endDate: string;        // 귀국일 (필수, YYYYMMDD)
  yearMonth?: string;     // 년월 기준 검색 (선택, YYYYMM)
  travelDays?: number;    // 여행 일수 (선택)
  priceRange?: string;    // 가격대 (선택, "1000000-2000000")
  sort?: string;          // 정렬 (선택, "PRICE_ASC" 등)
  productBrandCode?: string; // 브랜드 코드 (선택)
}) {
  const dates = getDefaultDates();
  return callTool('search_travel_package_products', {
    city: params.city,
    startDate: params.startDate || dates.startDate,
    endDate: params.endDate || dates.endDate,
    ...(params.yearMonth && { yearMonth: params.yearMonth }),
    ...(params.travelDays && { travelDays: params.travelDays }),
    ...(params.priceRange && { priceRange: params.priceRange }),
    ...(params.sort && { sort: params.sort }),
    ...(params.productBrandCode && { productBrandCode: params.productBrandCode }),
  });
}

/**
 * 패키지 상품 일정 조회
 * 패키지 상품의 상세 일정을 조회
 */
export async function getPackageProductSchedule(params: {
  productCode: string;  // 패키지 상품 코드 (search_travel_package_products 응답에서 추출)
}) {
  return callTool('get_package_product_schedule', {
    productCode: params.productCode,
  });
}
