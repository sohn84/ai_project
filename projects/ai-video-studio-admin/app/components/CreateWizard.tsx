import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, Sparkles, Cpu, Video, CheckCircle, ArrowLeft, ArrowRight, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

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
  const navigate = useNavigate();
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

  const handleNext = () => {
    if (currentStep === 1) {
      if (images.length !== 4) {
        alert("정확히 4장의 이미지를 업로드해주세요.");
        return;
      }
      // Simulate AI analysis
      setIsProcessing(true);
      setProcessingProgress(0);
      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            setCurrentStep(3);
            // Auto-generate prompt
            setPrompt("제주도의 아름다운 해변과 푸른 바다가 펼쳐진 장면에서 시작합니다. 카메라가 천천히 전진하며 해변가의 카페와 야자수를 지나갑니다. 석양이 지는 풍경으로 전환되며, 평화로운 분위기를 담아냅니다. 마지막으로 제주도의 상징적인 돌하르방과 한라산이 보이며 영상이 마무리됩니다.");
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      setCurrentStep(2);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Start video generation
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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-slate-900">새 영상 만들기</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center gap-2 ${currentStep >= step.number ? "text-blue-600" : "text-slate-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step.number ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                    {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
                  </div>
                  <span className="text-xs hidden sm:inline">{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`h-0.5 w-8 sm:w-16 mx-2 ${currentStep > step.number ? "bg-blue-600" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {StepIcon && <StepIcon className="w-6 h-6" />}
              {currentStepData?.title}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "여행 상품 이미지 4장을 업로드하세요"}
              {currentStep === 2 && "AI가 이미지를 분석하고 있습니다..."}
              {currentStep === 3 && "자동 생성된 프롬프트를 확인하고 수정할 수 있습니다"}
              {currentStep === 4 && "영상 생성에 사용할 AI 모델을 선택하세요"}
              {currentStep === 5 && "AI가 영상을 생성하고 있습니다... (2-3분 소요)"}
              {currentStep === 6 && "영상이 성공적으로 생성되었습니다!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Image Upload */}
            {currentStep === 1 && (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 w-8 h-8"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {Array.from({ length: 4 - images.length }).map((_, index) => (
                    <label
                      key={`empty-${index}`}
                      className="aspect-video bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-slate-600">이미지 선택</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  ))}
                </div>
                <p className="text-slate-500 text-center">{images.length} / 4 이미지 업로드됨</p>
              </div>
            )}

            {/* Step 2: AI Analysis */}
            {currentStep === 2 && (
              <div className="py-8 text-center">
                <div className="inline-block p-4 bg-blue-50 rounded-full mb-4 animate-pulse">
                  <Sparkles className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-slate-900 mb-2">이미지 분석 중...</h3>
                <p className="text-slate-600 mb-6">AI가 이미지의 내용, 구도, 색상을 분석하고 있습니다</p>
                <Progress value={processingProgress} className="max-w-md mx-auto" />
                <p className="text-slate-500 mt-2">{processingProgress}%</p>
              </div>
            )}

            {/* Step 3: Prompt Generation */}
            {currentStep === 3 && (
              <div>
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-blue-900 mb-1">자동 생성된 프롬프트</h4>
                      <p className="text-blue-700">AI가 업로드된 이미지를 분석하여 최적의 프롬프트를 생성했습니다.</p>
                    </div>
                  </div>
                </div>
                <Label htmlFor="prompt">영상 생성 프롬프트</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="mt-2 min-h-[200px]"
                  placeholder="프롬프트를 입력하거나 수정하세요..."
                />
                <p className="text-slate-500 mt-2">💡 프롬프트를 수정하여 원하는 영상 스타일을 조정할 수 있습니다</p>
              </div>
            )}

            {/* Step 4: Model Selection */}
            {currentStep === 4 && (
              <div>
                <RadioGroup value={selectedModel} onValueChange={setSelectedModel}>
                  <div className="space-y-4">
                    <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedModel === "veo" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                      <RadioGroupItem value="veo" id="veo" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-slate-900">Google Veo</h4>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">추천</span>
                        </div>
                        <p className="text-slate-600">고품질 영상 생성에 특화된 최신 AI 모델</p>
                        <ul className="mt-2 space-y-1 text-slate-500">
                          <li>• 생성 시간: 약 2-3분</li>
                          <li>• 해상도: 1080p</li>
                          <li>• 품질: 매우 높음</li>
                        </ul>
                      </div>
                    </label>
                    <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedModel === "luma" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                      <RadioGroupItem value="luma" id="luma" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-slate-900">Luma Dream Machine</h4>
                        </div>
                        <p className="text-slate-600">빠른 생성 속도와 창의적인 스타일</p>
                        <ul className="mt-2 space-y-1 text-slate-500">
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
              <div className="py-8 text-center">
                <div className="inline-block p-4 bg-blue-50 rounded-full mb-4 animate-pulse">
                  <Video className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-slate-900 mb-2">영상 생성 중...</h3>
                <p className="text-slate-600 mb-6">{selectedModel === "veo" ? "Google Veo" : "Luma Dream Machine"}가 8초 영상을 생성하고 있습니다</p>
                <Progress value={processingProgress} className="max-w-md mx-auto" />
                <p className="text-slate-500 mt-2">{processingProgress}% - 약 {Math.ceil((100 - processingProgress) / 5 * 0.3)}분 남음</p>
              </div>
            )}

            {/* Step 6: Complete */}
            {currentStep === 6 && (
              <div className="py-8 text-center">
                <div className="inline-block p-4 bg-green-50 rounded-full mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-slate-900 mb-2">영상 생성 완료!</h3>
                <p className="text-slate-600 mb-6">8초 영상이 성공적으로 생성되었습니다</p>
                
                {/* Video Preview */}
                <div className="max-w-2xl mx-auto mb-6">
                  <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
                    <video 
                      className="w-full h-full"
                      controls
                      poster="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=450&fit=crop"
                    >
                      <source src="#" type="video/mp4" />
                    </video>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button size="lg" variant="outline" onClick={() => navigate("/")}>
                    홈으로 돌아가기
                  </Button>
                  <Button size="lg">
                    영상 다운로드
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {currentStep !== 2 && currentStep !== 5 && currentStep !== 6 && (
          <div className="flex gap-4 mt-6">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1" disabled={currentStep === 1 && images.length !== 4}>
              다음
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}