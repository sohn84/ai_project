# Figma 디자인 시스템 규칙 (MCP 통합)

이 문서는 Figma MCP를 통해 디자인을 코드로 변환할 때 따라야 할 규칙과 가이드라인입니다.

---

## 1. 디자인 토큰 정의

### 1.1 Travel Expense & Chat App (기본 CSS 변수)

**위치**: `projects/travel-expense/app/globals.css`

```css
:root {
  /* 기본 색상 */
  --primary-color: #1a1a1a;        /* 다크 네이비 */
  --secondary-color: #f5f5f5;      /* 라이트 그레이 */
  --accent-color: #007bff;         /* 블루 */
  --text-color: #333;              /* 텍스트 */
  --border-color: #ddd;            /* 테두리 */

  /* 상태 색상 */
  --danger-color: #ff4444;         /* 위험/삭제 */
  --success-color: #00c851;        /* 성공 */
}
```

**사용 예시**:
```css
.primary-btn {
  background-color: var(--primary-color);
  color: var(--secondary-color);
}
```

---

### 1.2 AI Video Studio Admin (Tailwind + OKLCH)

**위치**: `projects/ai-video-studio-admin/app/globals.css`

**색상 체계 (OKLCH 색상 공간)**:

```css
@layer base {
  :root {
    /* 기본 색상 */
    --background: oklch(1 0 0);              /* 흰색 */
    --foreground: #030213;                   /* 거의 검은색 */

    /* 컴포넌트 색상 */
    --primary: #030213;                      /* 다크 네이비 */
    --primary-foreground: oklch(1 0 0);      /* 흰색 */
    --secondary: oklch(0.95 0.0058 264.53);  /* 매우 라이트 그레이 */
    --secondary-foreground: oklch(0.145 0 0);/* 검은색 */
    --muted: #ececf0;                        /* 뮤트 색상 */
    --muted-foreground: oklch(0.478 0 0);    /* 중간 그레이 */
    --accent: #e9ebef;                       /* 액센트 */
    --accent-foreground: oklch(0.145 0 0);   /* 검은색 */

    /* 상태 색상 */
    --destructive: #d4183d;                  /* 빨간색 */
    --destructive-foreground: oklch(1 0 0);  /* 흰색 */

    /* UI 요소 */
    --border: rgba(0, 0, 0, 0.1);
    --input: rgba(0, 0, 0, 0.1);
    --ring: #030213;
    --radius: 0.625rem;                      /* 10px */

    /* 차트 색상 (5가지) */
    --chart-1: oklch(0.582 0.213 260.09);
    --chart-2: oklch(0.702 0.246 158.87);
    --chart-3: oklch(0.526 0.161 27.95);
    --chart-4: oklch(0.632 0.257 59.63);
    --chart-5: oklch(0.582 0.213 298.43);

    /* Sidebar 색상 */
    --sidebar-background: oklch(1 0 0);
    --sidebar-foreground: oklch(0.557 0 0);
    --sidebar-primary: oklch(0.145 0 0);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.95 0.0058 264.53);
    --sidebar-accent-foreground: oklch(0.145 0 0);
    --sidebar-border: rgba(0, 0, 0, 0.1);
    --sidebar-ring: oklch(0.145 0 0);
  }

  /* 다크 모드 */
  .dark {
    --background: oklch(0.145 0 0);          /* 검은색 */
    --foreground: oklch(0.985 0 0);          /* 흰색 */
    --primary: oklch(0.985 0 0);
    --primary-foreground: oklch(0.195 0 0);
    --secondary: oklch(0.269 0 0);           /* 다크 그레이 */
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.747 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.458 0.211 26.15);
    --destructive-foreground: oklch(0.985 0 0);
    --border: rgba(255, 255, 255, 0.1);
    --input: rgba(255, 255, 255, 0.1);
    --ring: oklch(0.985 0 0);
  }
}
```

**사용 예시 (Tailwind)**:
```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground hover:bg-primary/90">
    클릭
  </button>
</div>
```

---

## 2. 컴포넌트 라이브러리

### 2.1 Travel Expense (CSS 클래스 기반)

**위치**: `projects/travel-expense/app/globals.css`

**레이아웃 컴포넌트**:
```css
.page {
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: white;
}

.header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.content {
  padding: 1rem;
}
```

**버튼 컴포넌트**:
```css
.primary-btn {
  background-color: var(--primary-color);
  color: var(--secondary-color);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.secondary-btn {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border: 1px solid var(--border-color);
}

.large-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.125rem;
}
```

**폼 컴포넌트**:
```css
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
}
```

**고급 컴포넌트**:
```css
/* FAB (Floating Action Button) */
.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: var(--accent-color);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 하단 시트 */
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 1.5rem;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease-out;
}
```

---

### 2.2 AI Video Studio Admin (Radix UI + Tailwind)

**위치**: `projects/ai-video-studio-admin/app/components/ui/`

**아키텍처**:
- **Radix UI**: 접근성 준수 원시 컴포넌트
- **CVA (class-variance-authority)**: 변형 정의
- **Tailwind Merge**: 클래스 충돌 해결

**Button 컴포넌트**:

**파일**: `app/components/ui/button.tsx`

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3 text-xs",
        lg: "h-10 rounded-md px-6",
        icon: "size-9 rounded-md"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

**사용 예시**:
```tsx
import { Button } from "@/app/components/ui/button";

<Button variant="default" size="lg">
  기본 버튼
</Button>

<Button variant="outline" size="sm">
  아웃라인 버튼
</Button>

<Button variant="destructive">
  삭제
</Button>

<Button variant="ghost" size="icon">
  <Plus className="h-4 w-4" />
</Button>
```

---

**Card 컴포넌트**:

**파일**: `app/components/ui/card.tsx`

```tsx
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
      {...props}
    />
  )
);

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  )
);

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
```

**사용 예시**:
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";

<Card>
  <CardHeader className="pb-3">
    <CardTitle className="text-slate-600">총 제작 영상</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-slate-900">3개</div>
  </CardContent>
</Card>
```

---

**50+ UI 컴포넌트 목록**:

| 카테고리 | 컴포넌트 |
|---------|---------|
| **기본** | Button, Input, Label, Textarea, Select |
| **레이아웃** | Card, Separator, ScrollArea, AspectRatio, Resizable |
| **네비게이션** | NavigationMenu, Breadcrumb, MenuBar, Tabs, Sidebar, Sheet |
| **폼** | Form, Checkbox, RadioGroup, Switch, Slider, Toggle |
| **오버레이** | Dialog, AlertDialog, Popover, Tooltip, HoverCard, ContextMenu, DropdownMenu |
| **데이터** | Table, Pagination, Collapsible, Accordion |
| **피드백** | Alert, Toast, Progress, Skeleton, Sonner |
| **시각화** | Chart, Carousel |
| **기타** | Avatar, Badge, Calendar, Command, Drawer, InputOTP |

---

## 3. 프레임워크 & 라이브러리

### 3.1 공통 (Next.js 프로젝트)

**프레임워크**:
- Next.js 15.0.0 ~ 16.0.10
- React 19.0.0 ~ 19.2.3
- App Router 기반

**TypeScript**:
- Travel Expense: TypeScript 5.x
- AI Video Studio Admin: TypeScript 5.9.3
- Chat App: JavaScript

---

### 3.2 AI Video Studio Admin

**UI 라이브러리**:
```json
{
  "@radix-ui/react-*": "^1.1.5",  // 20+ Radix UI 컴포넌트
  "lucide-react": "^0.469.0",     // 아이콘
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0"
}
```

**스타일링**:
```json
{
  "tailwindcss": "^4.1.18",
  "postcss": "^9.0.0"
}
```

**빌드 도구**:
- Turbopack (Next.js 16)
- PostCSS

**파일**: `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... 나머지 색상
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

---

## 4. 에셋 관리

### 4.1 Travel Expense

**위치**: `projects/travel-expense/public/`

- 이미지: 정적 파일 직접 참조
- 최적화: Next.js Image 컴포넌트 미사용 (현재)

---

### 4.2 AI Video Studio Admin

**위치**: `projects/ai-video-studio-admin/public/`

**이미지 컴포넌트**:

**파일**: `app/components/figma/ImageWithFallback.tsx`

```tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/placeholder.png",
  width,
  height,
  className,
  priority = false,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
```

**사용 예시**:
```tsx
<ImageWithFallback
  src="/hero-image.png"
  alt="히어로 이미지"
  width={800}
  height={600}
  fallbackSrc="/default-hero.png"
  priority
/>
```

**최적화**:
- Next.js Image 컴포넌트 활용
- Lazy loading
- 폴백 이미지 지원

---

## 5. 아이콘 시스템

### 5.1 AI Video Studio Admin (Lucide React)

**설치**:
```json
{
  "lucide-react": "^0.469.0"
}
```

**사용 예시**:
```tsx
import {
  Plus,
  Sparkles,
  Video,
  CheckCircle,
  Upload,
  Cpu,
  ArrowLeft,
  ArrowRight,
  X
} from "lucide-react";

// 기본 사용
<Plus className="w-5 h-5" />

// 버튼 내부
<Button size="lg" className="gap-2">
  <Plus className="w-5 h-5" />
  새 영상 만들기
</Button>

// 크기 조절
<Sparkles className="w-6 h-6 text-primary" />

// 애니메이션 (Tailwind)
<Video className="w-4 h-4 animate-pulse" />
```

**아이콘 명명 규칙**:
- PascalCase (예: `CheckCircle`, `ArrowLeft`)
- 시맨틱 네이밍 (기능 기반)

---

### 5.2 Travel Expense

**아이콘 방식**:
- Unicode 이모지 또는 텍스트 기호 사용
- SVG 직접 삽입 (필요 시)

---

## 6. 스타일링 접근법

### 6.1 CSS 방법론 비교

| 프로젝트 | 방법론 | 복잡도 | 확장성 |
|---------|-------|--------|--------|
| Travel Expense | 순수 CSS + BEM 스타일 | 낮음 | 중간 |
| Chat App | 순수 CSS | 낮음 | 낮음 |
| AI Video Studio Admin | Tailwind CSS 4 + OKLCH | 높음 | 높음 |
| BA Requirements | 순수 CSS | 낮음 | 낮음 |

---

### 6.2 Travel Expense (BEM 스타일)

**클래스 명명**:
```css
/* Block */
.user-card { }

/* Element */
.user-card__title { }
.user-card__description { }

/* Modifier */
.user-card--highlighted { }
.user-card__title--large { }
```

**예시**:
```html
<div class="user-card user-card--highlighted">
  <h2 class="user-card__title user-card__title--large">제목</h2>
  <p class="user-card__description">설명</p>
</div>
```

---

### 6.3 AI Video Studio Admin (Tailwind Utility-First)

**Utility 클래스 직접 사용**:
```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
  <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-slate-900">제목</h1>
    </div>
  </header>
</div>
```

**반응형 디자인**:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 모바일: 1열, 태블릿: 2열, 데스크톱: 3열 */}
</div>
```

**다크 모드**:
```tsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
  내용
</div>
```

**클래스 병합 유틸리티**:

**파일**: `lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**사용**:
```tsx
<Button className={cn("w-full", isPrimary && "bg-primary", className)} />
```

---

### 6.4 글로벌 스타일

**Travel Expense**:

**파일**: `app/globals.css`

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--text-color);
  background-color: var(--secondary-color);
}

/* 기본 요소 스타일 */
input, select, textarea {
  font-family: inherit;
  font-size: 1rem;
}
```

---

**AI Video Studio Admin**:

**파일**: `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer utilities {
  .step {
    counter-increment: step;
  }

  .step:before {
    @apply absolute w-8 h-8 bg-muted rounded-full font-medium text-center text-base inline-flex items-center justify-center -indent-px;
    @apply ml-[-50px];
    content: counter(step);
  }
}
```

---

## 7. 프로젝트 구조

### 7.1 Travel Expense

```
travel-expense/
├── app/
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.js              # 홈 페이지 (경비 목록)
│   ├── create/
│   │   └── page.js          # 경비 등록 페이지
│   └── globals.css          # 전역 스타일
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

---

### 7.2 AI Video Studio Admin

```
ai-video-studio-admin/
├── app/
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 홈 페이지
│   ├── globals.css          # 전역 스타일 (Tailwind)
│   ├── components/
│   │   ├── Home.tsx         # 홈 컴포넌트
│   │   ├── CreateWizard.tsx # 6단계 마법사
│   │   ├── ui/              # 50+ UI 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   └── figma/
│   │       └── ImageWithFallback.tsx
│   └── api/
│       └── analyze-images/
│           └── route.ts     # API 엔드포인트
├── lib/
│   └── utils.ts             # cn() 유틸리티
├── styles/
│   ├── globals.css
│   ├── tailwind.css
│   └── theme.css
├── public/
│   └── ...                  # 정적 에셋
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── next.config.js
└── package.json
```

---

## 8. Figma → 코드 변환 규칙

### 8.1 Travel Expense 프로젝트

**Figma 디자인 → CSS 클래스**:

1. **컨테이너 요소**:
   - Figma Frame → `.page` 또는 `.content`
   - 최대 너비: 600px

2. **버튼**:
   - Primary 버튼 → `.primary-btn`
   - Secondary 버튼 → `.secondary-btn`
   - 전체 너비 버튼 → `.large-btn`
   - 아이콘 버튼 → `.fab`

3. **폼**:
   - Form Group → `.form-group`
   - Label → `.form-group label`
   - Input/Select → 기본 HTML 요소

4. **색상 매핑**:
   - Primary Color → `var(--primary-color)` (#1a1a1a)
   - Accent Color → `var(--accent-color)` (#007bff)
   - Danger → `var(--danger-color)` (#ff4444)

---

### 8.2 AI Video Studio Admin 프로젝트

**Figma 디자인 → Tailwind + Radix UI**:

1. **레이아웃**:
   ```tsx
   // Figma: Auto Layout (Vertical, Gap: 24px, Padding: 24px)
   <div className="flex flex-col gap-6 p-6">
     {/* 내용 */}
   </div>
   ```

2. **카드**:
   ```tsx
   // Figma: Card Frame
   <Card>
     <CardHeader className="pb-3">
       <CardTitle>제목</CardTitle>
     </CardHeader>
     <CardContent>
       내용
     </CardContent>
   </Card>
   ```

3. **버튼**:
   ```tsx
   // Figma: Primary Button
   <Button variant="default" size="lg">
     버튼 텍스트
   </Button>

   // Figma: Outline Button
   <Button variant="outline">
     버튼 텍스트
   </Button>

   // Figma: Icon Button
   <Button variant="ghost" size="icon">
     <Plus className="h-4 w-4" />
   </Button>
   ```

4. **색상 매핑**:
   - Primary (#030213) → `bg-primary text-primary-foreground`
   - Secondary (OKLCH) → `bg-secondary text-secondary-foreground`
   - Destructive (#d4183d) → `bg-destructive text-destructive-foreground`
   - Muted (#ececf0) → `bg-muted text-muted-foreground`

5. **간격 (Spacing)**:
   - 4px → `gap-1` or `p-1`
   - 8px → `gap-2` or `p-2`
   - 16px → `gap-4` or `p-4`
   - 24px → `gap-6` or `p-6`
   - 32px → `gap-8` or `p-8`

6. **타이포그래피**:
   ```tsx
   // Figma: Heading 1 (32px, Bold)
   <h1 className="text-3xl font-bold">제목</h1>

   // Figma: Body (16px, Regular)
   <p className="text-base">본문</p>

   // Figma: Caption (14px, Medium)
   <span className="text-sm font-medium">캡션</span>
   ```

7. **그림자 (Shadow)**:
   - Small → `shadow-sm`
   - Medium → `shadow`
   - Large → `shadow-lg`

8. **둥근 모서리 (Border Radius)**:
   - 4px → `rounded`
   - 8px → `rounded-lg`
   - 12px → `rounded-xl`
   - Full → `rounded-full`

---

## 9. 코딩 컨벤션 (Figma 연동 시)

### 9.1 컴포넌트 파일 명명

**React 컴포넌트**:
- PascalCase 사용
- 예: `UserProfile.tsx`, `Button.tsx`, `CreateWizard.tsx`

**UI 컴포넌트**:
- PascalCase + 소문자 디렉토리
- 예: `ui/button.tsx`, `ui/card.tsx`

---

### 9.2 Props 타입 정의

```tsx
interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children: React.ReactNode;
}
```

---

### 9.3 Import 순서

```tsx
// 1. 외부 라이브러리
import React from "react";
import { cva } from "class-variance-authority";

// 2. Radix UI
import * as DialogPrimitive from "@radix-ui/react-dialog";

// 3. 내부 컴포넌트
import { Button } from "@/app/components/ui/button";

// 4. 유틸리티
import { cn } from "@/lib/utils";

// 5. 아이콘
import { X } from "lucide-react";

// 6. 타입
import type { ComponentProps } from "./types";

// 7. 스타일
import styles from "./styles.module.css";
```

---

## 10. 접근성 (Accessibility)

### 10.1 Radix UI (AI Video Studio Admin)

**자동 접근성**:
- ARIA 속성 자동 설정
- 키보드 네비게이션 지원
- 포커스 관리

**예시**:
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>열기</Button>
  </DialogTrigger>
  <DialogContent>
    {/* 자동: role="dialog", aria-modal="true", 포커스 트랩 */}
    <DialogHeader>
      <DialogTitle>제목</DialogTitle>  {/* 자동: id 연결 */}
    </DialogHeader>
  </DialogContent>
</Dialog>
```

---

### 10.2 색상 대비 (WCAG 2.1 AA)

**최소 대비율**:
- 일반 텍스트: 4.5:1
- 큰 텍스트: 3:1

**검증 도구**:
- Chrome DevTools Lighthouse
- WebAIM Contrast Checker

---

## 11. 권장사항

### 11.1 Figma → 코드 변환 시

1. **프로젝트별 스타일링 시스템 확인**
   - Travel Expense: CSS 클래스 기반
   - AI Video Studio Admin: Tailwind + Radix UI

2. **색상 토큰 사용**
   - CSS 변수 또는 Tailwind 토큰 활용
   - 하드코딩된 색상 값 피하기

3. **컴포넌트 재사용**
   - 기존 UI 컴포넌트 활용
   - 새 컴포넌트 생성 전 기존 확인

4. **반응형 디자인**
   - 모바일 우선 (Travel Expense)
   - Tailwind 반응형 유틸리티 (AI Video Studio Admin)

5. **타입 안전성**
   - TypeScript 프로젝트는 Props 타입 정의 필수
   - JavaScript 프로젝트는 JSDoc 고려

6. **접근성 준수**
   - Radix UI 사용 (AI Video Studio Admin)
   - 시맨틱 HTML (Travel Expense)
   - ARIA 속성 추가

---

### 11.2 디자인 시스템 통합

1. **shared 디렉토리 활용**
   - 공통 컴포넌트를 `shared/components/`로 이동
   - 중복 제거 및 재사용성 향상

2. **디자인 토큰 통합**
   - AI Video Studio Admin의 OKLCH 시스템을 표준으로 고려
   - 일관된 색상 체계 적용

3. **Storybook 도입**
   - 컴포넌트 문서화 및 시각화
   - Figma 디자인과 코드 동기화

---

## 12. 참고 자료

**공식 문서**:
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/primitives)
- [Lucide Icons](https://lucide.dev/)
- [CVA (class-variance-authority)](https://cva.style/docs)

**프로젝트 문서**:
- [CLAUDE.md](../CLAUDE.md) - 코딩 규칙
- [docs/TECH_STACK.md](../docs/TECH_STACK.md) - 기술 스택
- [docs/CONVENTIONS.md](../docs/archive/CONVENTIONS.md) - 코딩 컨벤션

---

**이 문서를 참고하여 Figma 디자인을 일관성 있게 코드로 변환하세요! 🎨**
