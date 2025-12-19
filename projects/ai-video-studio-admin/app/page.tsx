import Link from "next/link";
import { Play, Plus, Download, Clock } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";

// Mock 데이터
const mockVideos = [
  {
    id: "1",
    title: "제주도 패키지 프로모션",
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    createdAt: "2024-12-16",
    duration: "8초",
    status: "완료"
  },
  {
    id: "2",
    title: "유럽 여행 상품 소개",
    thumbnail: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop",
    createdAt: "2024-12-15",
    duration: "8초",
    status: "완료"
  },
  {
    id: "3",
    title: "동남아 휴양지 패키지",
    thumbnail: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop",
    createdAt: "2024-12-14",
    duration: "8초",
    status: "완료"
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">AI 영상 제작 도구</h1>
              <p className="text-base lg:text-lg text-slate-600 mt-2">여행 상품 영업팀을 위한 8초 썸네일 영상 자동 제작</p>
            </div>
            <Link href="/create">
              <Button size="lg" className="gap-2 px-6 py-6 text-base">
                <Plus className="w-6 h-6" />
                새 영상 만들기
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-slate-600">총 제작 영상</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">3개</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-slate-600">이번 주 제작</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">2개</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-slate-600">비용 절감</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">₩1,200,000</div>
            </CardContent>
          </Card>
        </div>

        {/* Video List */}
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8">최근 작업물</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {mockVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="relative aspect-video bg-slate-200">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="w-20 h-20 rounded-full">
                      <Play className="w-10 h-10" />
                    </Button>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {video.duration}
                  </div>
                </div>
                <CardHeader className="p-6">
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                  <CardDescription className="text-base">{video.createdAt}</CardDescription>
                </CardHeader>
                <CardFooter className="flex gap-3 p-6 pt-0">
                  <Button variant="outline" size="default" className="flex-1 gap-2">
                    <Play className="w-5 h-5" />
                    재생
                  </Button>
                  <Button variant="outline" size="default" className="flex-1 gap-2">
                    <Download className="w-5 h-5" />
                    다운로드
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {mockVideos.length === 0 && (
          <div className="text-center py-24">
            <div className="text-xl text-slate-400 mb-6">아직 제작된 영상이 없습니다</div>
            <Link href="/create">
              <Button size="lg" className="gap-3 px-8 py-6 text-lg">
                <Plus className="w-6 h-6" />
                첫 영상 만들기
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
