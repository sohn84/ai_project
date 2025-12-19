import { Link } from "react-router";
import { Play, Plus, Download, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-slate-900">AI 영상 제작 도구</h1>
              <p className="text-slate-600 mt-1">여행 상품 영업팀을 위한 8초 썸네일 영상 자동 제작</p>
            </div>
            <Link to="/create">
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                새 영상 만들기
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-600">총 제작 영상</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-900">3개</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-600">이번 주 제작</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-900">2개</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-600">비용 절감</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-900">₩1,200,000</div>
            </CardContent>
          </Card>
        </div>

        {/* Video List */}
        <div>
          <h2 className="text-slate-900 mb-6">최근 작업물</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-video bg-slate-200">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="w-16 h-16 rounded-full">
                      <Play className="w-8 h-8" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{video.title}</CardTitle>
                  <CardDescription>{video.createdAt}</CardDescription>
                </CardHeader>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Play className="w-4 h-4" />
                    재생
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="w-4 h-4" />
                    다운로드
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {mockVideos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-slate-400 mb-4">아직 제작된 영상이 없습니다</div>
            <Link to="/create">
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                첫 영상 만들기
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
