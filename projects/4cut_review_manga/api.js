// Gemini API 헬퍼 함수

/**
 * Gemini 2.0 Flash로 콘티 생성
 * @param {string} systemPrompt - 시스템 프롬프트
 * @param {string} reviewText - 리뷰 텍스트
 * @returns {Promise<Object>} 콘티 JSON
 */
async function generateContiWithGemini(systemPrompt, reviewText) {
  const config = window.APP_CONFIG;
  const apiKey = config.GOOGLE_AI_API_KEY;
  const model = config.GEMINI_TEXT_MODEL;

  const url = `${config.GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `${systemPrompt}\n\n사용자 리뷰:\n${reviewText}`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
      responseMimeType: "application/json"
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Gemini 응답에서 텍스트 추출
    const textContent = data.candidates[0]?.content?.parts[0]?.text;

    if (!textContent) {
      throw new Error('Gemini API returned empty response');
    }

    // JSON 파싱
    const conti = JSON.parse(textContent);
    return conti;

  } catch (error) {
    console.error('콘티 생성 실패:', error);
    throw error;
  }
}

/**
 * 시스템 프롬프트에서 스타일 가이드 추출
 * @param {string} systemPrompt - 시스템 프롬프트 텍스트
 * @returns {string} 영문으로 변환된 스타일 가이드
 */
function extractStyleGuide(systemPrompt) {
  // [스타일 가이드] 섹션 추출
  const styleGuideMatch = systemPrompt.match(/\[스타일 가이드\]([\s\S]*?)(?=\n\[|$)/);

  if (!styleGuideMatch) {
    console.warn('스타일 가이드를 찾을 수 없습니다. 기본 스타일 사용');
    return `
- Simple pen-drawn linework with clean, minimalist composition
- Black and white base with pastel colors (yellow, pink) as accent points for emphasis
- Healing, cozy, gentle smile atmosphere
    `.trim();
  }

  const styleGuideText = styleGuideMatch[1].trim();
  console.log('추출된 스타일 가이드:', styleGuideText);

  // 한국어 스타일 가이드를 영문으로 변환
  let englishStyle = '';

  // 그림체 추출
  if (styleGuideText.includes('그림체:')) {
    const artStyleMatch = styleGuideText.match(/그림체:\s*([^\n]+)/);
    if (artStyleMatch) {
      englishStyle += `- Art Style: Simple pen-drawn linework, minimalist composition with clean lines\n`;
    }
  }

  // 색상 추출
  if (styleGuideText.includes('색상:')) {
    const colorMatch = styleGuideText.match(/색상:\s*([^\n]+)/);
    if (colorMatch) {
      const colorText = colorMatch[1];
      if (colorText.includes('흑백') || colorText.includes('파스텔')) {
        englishStyle += `- Color: Black and white base drawing with pastel tone (yellow, pink) as accent colors for emphasis\n`;
      }
    }
  }

  // 분위기 추출
  if (styleGuideText.includes('분위기:')) {
    const moodMatch = styleGuideText.match(/분위기:\s*([^\n]+)/);
    if (moodMatch) {
      englishStyle += `- Mood: Healing, cozy happiness, gentle smile, warm atmosphere\n`;
    }
  }

  return englishStyle.trim();
}

/**
 * 콘티 데이터를 표준 형식으로 정규화
 * @param {Object|Array} data - 파싱된 JSON 데이터
 * @returns {Object} 정규화된 콘티 객체
 */
function normalizeConti(data) {
  console.log('normalizeConti 입력 데이터:', data);

  const result = {
    cut1: { location: '', scene: '', dialogue: '' },
    cut2: { location: '', scene: '', dialogue: '' },
    cut3: { location: '', scene: '', dialogue: '' },
    cut4: { location: '', scene: '', dialogue: '' }
  };

  // Case 1: {"컷 구성": [{...}, {...}]} 형태 처리
  let cutArray = data['컷 구성'] || data['컷구성'] || data['cuts'];
  if (cutArray && Array.isArray(cutArray)) {
    cutArray.forEach((item, index) => {
      const cutKey = `cut${index + 1}`;
      // 배열 안의 각 객체: {"1컷": {...}} 형태
      const cutData = item['1컷'] || item['2컷'] || item['3컷'] || item['4컷'] ||
                      item[`${index + 1}컷`] || item[`cut${index + 1}`] || item;

      if (cutData && typeof cutData === 'object') {
        result[cutKey].location = cutData['장소'] || cutData['location'] || '';
        result[cutKey].scene = cutData['그림묘사'] || cutData['그림 묘사'] || cutData['scene'] || cutData['description'] || '';
        result[cutKey].dialogue = cutData['대사/내레이션'] || cutData['대사'] || cutData['dialogue'] || cutData['narration'] || '';
      }
    });
    console.log('컷 구성 배열 파싱 결과:', result);
    return result;
  }

  // Case 2: {cut1: {...}, cut2: {...}} 또는 {"컷 1": {...}} 형태 처리
  const keyMap = {
    '컷 1': 'cut1', '컷 2': 'cut2', '컷 3': 'cut3', '컷 4': 'cut4',
    '1컷': 'cut1', '2컷': 'cut2', '3컷': 'cut3', '4컷': 'cut4',
    'cut1': 'cut1', 'cut2': 'cut2', 'cut3': 'cut3', 'cut4': 'cut4',
    '1': 'cut1', '2': 'cut2', '3': 'cut3', '4': 'cut4'
  };

  const locationKeys = ['장소', 'location', 'place'];
  const sceneKeys = ['그림묘사', '그림 묘사', 'scene', 'description'];
  const dialogueKeys = ['대사/내레이션', '대사', 'dialogue', 'text', 'narration'];

  for (const [key, target] of Object.entries(keyMap)) {
    const source = data[key];
    if (source && typeof source === 'object') {
      // location 찾기
      for (const lKey of locationKeys) {
        if (source[lKey]) {
          result[target].location = source[lKey];
          break;
        }
      }
      // scene 찾기
      for (const sKey of sceneKeys) {
        if (source[sKey]) {
          result[target].scene = source[sKey];
          break;
        }
      }
      // dialogue 찾기
      for (const dKey of dialogueKeys) {
        if (source[dKey]) {
          result[target].dialogue = source[dKey];
          break;
        }
      }
    }
  }

  console.log('키 매핑 파싱 결과:', result);
  return result;
}

async function generateMangaImageWithGemini(contiInput, systemPrompt = '') {
  const config = window.APP_CONFIG;
  const apiKey = config.GOOGLE_AI_API_KEY;

  // 시스템 프롬프트에서 스타일 가이드 추출
  const styleGuide = extractStyleGuide(systemPrompt);
  console.log('적용할 스타일 가이드 (영문):', styleGuide);

  // conti가 문자열인 경우 JSON으로 파싱
  let contiRaw = contiInput;
  if (typeof contiInput === 'string') {
    try {
      contiRaw = JSON.parse(contiInput);
    } catch (e) {
      console.error('콘티 JSON 파싱 실패:', e);
      throw new Error('콘티 데이터 형식이 올바르지 않습니다.');
    }
  }

  // 데이터 정규화 (한국어 키 등 처리)
  const conti = normalizeConti(contiRaw);

  // 디버깅을 위해 콘티 데이터 출력
  console.log('이미지 생성용 콘티 데이터:', conti);

  // 콘티를 이미지 생성 프롬프트로 변환 (장소, 그림묘사, 대사/내레이션 모두 포함)
  const imagePrompt = `
Create a single 4-panel manga (comic strip) in a 2x2 grid layout.

[PANEL 1 - Top Left]
Location: ${conti.cut1?.location || 'Travel destination'}
Visual Description: ${conti.cut1?.scene || 'A happy travel scene'}
Dialogue/Narration: "${conti.cut1?.dialogue || ''}"

[PANEL 2 - Top Right]
Location: ${conti.cut2?.location || 'Travel destination'}
Visual Description: ${conti.cut2?.scene || 'A happy travel scene'}
Dialogue/Narration: "${conti.cut2?.dialogue || ''}"

[PANEL 3 - Bottom Left]
Location: ${conti.cut3?.location || 'Travel destination'}
Visual Description: ${conti.cut3?.scene || 'A happy travel scene'}
Dialogue/Narration: "${conti.cut3?.dialogue || ''}"

[PANEL 4 - Bottom Right]
Location: ${conti.cut4?.location || 'Travel destination'}
Visual Description: ${conti.cut4?.scene || 'A happy travel scene'}
Dialogue/Narration: "${conti.cut4?.dialogue || ''}"

[STYLE REQUIREMENTS]
${styleGuide}
- 2x2 grid layout with clear panel borders
- The same main character appears in all 4 panels
- Korean text in speech bubbles or text boxes for each dialogue/narration
- Travel/vacation theme
`.trim();

  console.log('최종 이미지 생성 프롬프트:', imagePrompt);

  // Nano Banana (Gemini 2.5 Flash Image) API 사용
  const model = config.GEMINI_IMAGE_MODEL;
  const url = `${config.GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: imagePrompt
          }
        ]
      }
    ]
  };

  try {
    console.log(`${model} 호출 중...`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini Image API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Gemini 2.5 Flash Image 응답에서 이미지 추출
    const imagePart = data.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    const imageBytes = imagePart?.inlineData?.data;

    if (!imageBytes) {
      console.warn('응답에 이미지 데이터가 없습니다. 전체 응답:', data);
      throw new Error('Gemini API returned no image data');
    }

    return `data:image/png;base64,${imageBytes}`;

  } catch (error) {
    console.error('이미지 생성 실패:', error);
    return await getPlaceholderImage();
  }
}

/**
 * 폴백: 플레이스홀더 이미지 생성
 */
async function getPlaceholderImage() {
  const placeholderUrl = 'https://via.placeholder.com/1024x1024/4f46e5/ffffff?text=이미지+생성+실패+(폴백)';
  try {
    const response = await fetch(placeholderUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    return '';
  }
}

/**
 * 이미지를 다운로드
 * @param {string} imageDataUrl - Base64 이미지 데이터 URL
 * @param {string} filename - 파일명
 */
function downloadImage(imageDataUrl, filename = '4cut-manga.png') {
  const link = document.createElement('a');
  link.href = imageDataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
