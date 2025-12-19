"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Sparkles, Cpu, Video, CheckCircle, ArrowLeft, ArrowRight, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const STEPS = [
  { number: 1, title: "이미지 업로드", icon: Upload },
  { number: 2, title: "AI 분석", icon: Sparkles },
  { number: 3, title: "프롬프트 생성", icon: Sparkles },
  { number: 4, title: "모델 선택", icon: Cpu },
  { number: 5, title: "영상 생성", icon: Video },
  { number: 6, title: "완료", icon: CheckCircle },
];

export default function CreateWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [images, setImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("veo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const currentStepData = STEPS[currentStep - 1];
  const StepIcon = currentStepData?.icon;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 4) {
      alert("최대 4장의 이미지만 업로드할 수 있습니다.");
      return;
    }
    setImages([...images, ...files].slice(0, 4));
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (images.length !== 4) {
        alert("정확히 4장의 이미지를 업로드해주세요.");
        return;
      }

      // 실제 AI 분석 시작
      setIsProcessing(true);
      setProcessingProgress(0);
      setCurrentStep(2);

      try {
        // 이미지를 base64로 변환
        const imagePromises = images.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        });

        const base64Images = await Promise.all(imagePromises);

        // 진행률 시뮬레이션 (실제 API 호출 중)
        const progressInterval = setInterval(() => {
          setProcessingProgress((prev) => Math.min(prev + 10, 90));
        }, 300);

        // API 호출
        const response = await fetch("/api/analyze-images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            images: base64Images,
          }),
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          throw new Error("이미지 분석 실패");
        }

        const data = await response.json();

        setProcessingProgress(100);
        setPrompt(data.prompt);

        // 잠시 대기 후 다음 단계로
        setTimeout(() => {
          setIsProcessing(false);
          setCurrentStep(3);
        }, 500);

      } catch (error) {
        console.error("이미지 분석 오류:", error);
        alert("이미지 분석 중 오류가 발생했습니다. 다시 시도해주세요.");
        setIsProcessing(false);
        setCurrentStep(1);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // 영상 생성 (아직 mock)
      setIsProcessing(true);
      setProcessingProgress(0);
      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            setCurrentStep(6);
            return 100;
          }
          return prev + 5;
        });
      }, 300);
      setCurrentStep(5);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep !== 2 && currentStep !== 5) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const progressValue = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="w-12 h-12">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">새 영상 만들기</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center gap-3 ${currentStep >= step.number ? "text-blue-600" : "text-slate-400"}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${currentStep >= step.number ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                    {currentStep > step.number ? <CheckCircle className="w-7 h-7" /> : step.number}
                  </div>
                  <span className="text-sm font-medium hidden lg:inline">{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`h-1 w-12 lg:w-24 mx-3 rounded ${currentStep > step.number ? "bg-blue-600" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progressValue} className="h-3" />
        </div>

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardHeader className="p-8">
            <CardTitle className="flex items-center gap-3 text-2xl">
              {StepIcon && <StepIcon className="w-8 h-8" />}
              {currentStepData?.title}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {currentStep === 1 && "여행 상품 이미지 4장을 업로드하세요"}
              {currentStep === 2 && "AI가 이미지를 분석하고 있습니다..."}
              {currentStep === 3 && "자동 생성된 프롬프트를 확인하고 수정할 수 있습니다"}
              {currentStep === 4 && "영상 생성에 사용할 AI 모델을 선택하세요"}
              {currentStep === 5 && "AI가 영상을 생성하고 있습니다... (2-3분 소요)"}
              {currentStep === 6 && "영상이 성공적으로 생성되었습니다!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            {/* Step 1: Image Upload */}
            {currentStep === 1 && (
              <div>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden shadow-md">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-3 right-3 w-10 h-10"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                  {Array.from({ length: 4 - images.length }).map((_, index) => (
                    <label
                      key={`empty-${index}`}
                      className="aspect-video bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-slate-400 transition-all"
                    >
                      <Upload className="w-12 h-12 text-slate-400 mb-3" />
                      <span className="text-base text-slate-600 font-medium">이미지 선택</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  ))}
                </div>
                <p className="text-base text-slate-500 text-center font-medium">{images.length} / 4 이미지 업로드됨</p>
              </div>
            )}

            {/* Step 2: AI Analysis */}
            {currentStep === 2 && (
              <div className="py-12 text-center">
                <div className="inline-block p-6 bg-blue-50 rounded-full mb-6 animate-pulse">
                  <Sparkles className="w-16 h-16 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">이미지 분석 중...</h3>
                <p className="text-lg text-slate-600 mb-8">AI가 이미지의 내용, 구도, 색상을 분석하고 있습니다</p>
                <Progress value={processingProgress} className="max-w-xl mx-auto h-3" />
                <p className="text-base text-slate-500 mt-3 font-semibold">{processingProgress}%</p>
              </div>
            )}

            {/* Step 3: Prompt Generation */}
            {currentStep === 3 && (
              <div>
                <div className="mb-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-semibold text-blue-900 mb-2">자동 생성된 프롬프트</h4>
                      <p className="text-base text-blue-700">AI가 업로드된 이미지를 분석하여 최적의 프롬프트를 생성했습니다.</p>
                    </div>
                  </div>
                </div>
                <Label htmlFor="prompt" className="text-base font-semibold">영상 생성 프롬프트</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="mt-3 min-h-[250px] text-base"
                  placeholder="프롬프트를 입력하거나 수정하세요..."
                />
                <p className="text-base text-slate-500 mt-3">💡 프롬프트를 수정하여 원하는 영상 스타일을 조정할 수 있습니다</p>
              </div>
            )}

            {/* Step 4: Model Selection */}
            {currentStep === 4 && (
              <div>
                <RadioGroup value={selectedModel} onValueChange={setSelectedModel}>
                  <div className="space-y-6">
                    <label className={`flex items-start gap-6 p-6 border-2 rounded-xl cursor-pointer transition-all ${selectedModel === "veo" ? "border-blue-600 bg-blue-50 shadow-md" : "border-slate-200 hover:border-slate-300 hover:shadow"}`}>
                      <RadioGroupItem value="veo" id="veo" className="mt-1.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-slate-900">Google Veo</h4>
                          <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">추천</span>
                        </div>
                        <p className="text-base text-slate-600 mb-3">고품질 영상 생성에 특화된 최신 AI 모델</p>
                        <ul className="space-y-2 text-base text-slate-500">
                          <li>• 생성 시간: 약 2-3분</li>
                          <li>• 해상도: 1080p</li>
                          <li>• 품질: 매우 높음</li>
                        </ul>
                      </div>
                    </label>
                    <label className={`flex items-start gap-6 p-6 border-2 rounded-xl cursor-pointer transition-all ${selectedModel === "luma" ? "border-blue-600 bg-blue-50 shadow-md" : "border-slate-200 hover:border-slate-300 hover:shadow"}`}>
                      <RadioGroupItem value="luma" id="luma" className="mt-1.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-slate-900">Luma Dream Machine</h4>
                        </div>
                        <p className="text-base text-slate-600 mb-3">빠른 생성 속도와 창의적인 스타일</p>
                        <ul className="space-y-2 text-base text-slate-500">
                          <li>• 생성 시간: 약 1-2분</li>
                          <li>• 해상도: 720p</li>
                          <li>• 품질: 높음</li>
                        </ul>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 5: Video Generation */}
            {currentStep === 5 && (
              <div className="py-12 text-center">
                <div className="inline-block p-6 bg-blue-50 rounded-full mb-6 animate-pulse">
                  <Video className="w-16 h-16 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">영상 생성 중...</h3>
                <p className="text-lg text-slate-600 mb-8">{selectedModel === "veo" ? "Google Veo" : "Luma Dream Machine"}가 8초 영상을 생성하고 있습니다</p>
                <Progress value={processingProgress} className="max-w-xl mx-auto h-3" />
                <p className="text-base text-slate-500 mt-3 font-semibold">{processingProgress}% - 약 {Math.ceil((100 - processingProgress) / 5 * 0.3)}분 남음</p>
              </div>
            )}

            {/* Step 6: Complete */}
            {currentStep === 6 && (
              <div className="py-12 text-center">
                <div className="inline-block p-6 bg-green-50 rounded-full mb-6">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">영상 생성 완료!</h3>
                <p className="text-lg text-slate-600 mb-8">8초 영상이 성공적으로 생성되었습니다</p>

                {/* Video Preview */}
                <div className="max-w-3xl mx-auto mb-8">
                  <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-xl">
                    <video
                      className="w-full h-full"
                      controls
                      poster="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=450&fit=crop"
                    >
                      <source src="#" type="video/mp4" />
                    </video>
                  </div>
                </div>

                <div className="flex gap-6 justify-center">
                  <Button size="lg" variant="outline" onClick={() => router.push("/")} className="px-8 py-6 text-base">
                    홈으로 돌아가기
                  </Button>
                  <Button size="lg" className="px-8 py-6 text-base">
                    영상 다운로드
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {currentStep !== 2 && currentStep !== 5 && currentStep !== 6 && (
          <div className="flex gap-6 mt-8">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1 py-6 text-base">
                <ArrowLeft className="w-5 h-5 mr-2" />
                이전
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1 py-6 text-base" disabled={currentStep === 1 && images.length !== 4}>
              다음
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
