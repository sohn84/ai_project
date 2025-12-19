import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// OpenAI API 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    // 요청 본문에서 이미지 데이터 추출
    const { images } = await request.json();

    if (!images || images.length !== 4) {
      return NextResponse.json(
        { error: "정확히 4장의 이미지가 필요합니다." },
        { status: 400 }
      );
    }

    // 프롬프트 작성
    const systemPrompt = `당신은 여행 상품 영상 제작 전문가입니다.
아래 4장의 이미지를 분석하여 8초 짜리 여행 영상을 위한 프롬프트를 생성해주세요.

요구사항:
1. 4장의 이미지를 순서대로 연결하는 자연스러운 카메라 워크 제안
2. 각 이미지의 주요 특징과 분위기 파악
3. 여행지의 매력을 극대화하는 영상 전환 효과 제안
4. 한국어로 200-300자 정도의 상세한 영상 프롬프트 작성

형식:
- 첫 장면(이미지 1): [설명]
- 두 번째 장면(이미지 2): [설명]
- 세 번째 장면(이미지 3): [설명]
- 마지막 장면(이미지 4): [설명]
- 전체 흐름: [영상의 전체적인 분위기와 스토리]`;

    // OpenAI Vision API 호출을 위한 메시지 구성
    const content: any[] = [
      {
        type: "text",
        text: systemPrompt,
      },
    ];

    // 이미지들을 메시지에 추가
    images.forEach((imageData: string, index: number) => {
      content.push({
        type: "image_url",
        image_url: {
          url: imageData, // base64 데이터 URL 그대로 사용
        },
      });
    });

    // OpenAI GPT-4 Vision API 호출
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // 또는 "gpt-4-vision-preview"
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
      max_tokens: 1000,
    });

    const generatedPrompt = response.choices[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      prompt: generatedPrompt,
    });
  } catch (error: any) {
    console.error("이미지 분석 오류:", error);
    return NextResponse.json(
      {
        error: "이미지 분석 중 오류가 발생했습니다.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
