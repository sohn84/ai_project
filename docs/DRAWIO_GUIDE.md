# Draw.io 파일 생성 가이드

이 문서는 draw.io 파일을 생성할 때 발생할 수 있는 문제를 예방하기 위한 가이드입니다.

## 🚫 절대 하지 말아야 할 것

### 1. HTML 주석 사용 주의
```xml
<!-- 이렇게 주석을 사용하면 안 됩니다 -->
<mxCell id="start" ...>
```
**중요**: 
- **온라인 draw.io에서 직접 생성한 파일**: HTML 주석 사용 가능 (표준 형식)
- **AI/수동으로 생성한 파일**: HTML 주석이 파싱 오류를 일으킬 수 있음
- "undefined" 또는 "null" 에러 발생 시 주석부터 제거해보기

**권장**: 
- 온라인 draw.io에서 직접 작업하면 주석 사용 가능
- 코드로 생성 시 주석 사용 자제

### 2. 빈 mxGeometry 사용 금지
```xml
<!-- ❌ 나쁜 예 -->
<mxCell id="cell1" ...>
  <mxGeometry />
</mxCell>

<!-- ✅ 좋은 예 -->
<mxCell id="cell1" ...>
  <mxGeometry x="100" y="100" width="100" height="50" as="geometry"/>
</mxCell>
```

### 3. 존재하지 않는 source/target 참조 금지
```xml
<!-- ❌ 나쁜 예: "nonexistent" id를 참조 -->
<mxCell id="arrow1" source="start" target="nonexistent" ...>

<!-- ✅ 좋은 예: 실제로 존재하는 id만 참조 -->
<mxCell id="arrow1" source="start" target="end" ...>
```

## ✅ 반드시 지켜야 할 규칙

### 1. 필수 mxfile 속성
```xml
<mxfile 
  host="app.diagrams.net" 
  modified="2024-01-01T00:00:00.000Z" 
  agent="5.0" 
  version="21.0.0" 
  etag="unique-id" 
  type="device">
```
- `host`: 반드시 `app.diagrams.net` 사용
- `modified`: ISO 8601 형식의 타임스탬프
- `agent`, `version`, `etag`: 필수 속성
- `type`: `device` 또는 `browser`

### 2. 표준 구조
```xml
<mxfile ...>
  <diagram name="diagram_name" id="diagram_id">
    <mxGraphModel ...>
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <!-- 모든 셀은 parent="1"을 가져야 함 -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### 3. mxCell 기본 구조
```xml
<!-- Vertex (셀) -->
<mxCell 
  id="unique_id" 
  value="텍스트 내용" 
  style="..." 
  vertex="1" 
  parent="1">
  <mxGeometry x="100" y="100" width="100" height="50" as="geometry"/>
</mxCell>

<!-- Edge (화살표) -->
<mxCell 
  id="arrow1" 
  value="" 
  style="..." 
  edge="1" 
  parent="1" 
  source="start" 
  target="end">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

### 4. 줄바꿈 문자
- `&#xa;` 사용 (권장)
- `&#10;` 사용 가능하지만 `&#xa;`가 더 안정적

### 5. Edge의 mxGeometry
```xml
<!-- Edge는 항상 relative="1" 사용 -->
<mxCell id="arrow1" ... edge="1" ...>
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

### 6. diagram id 명명 규칙
- 하이픈이나 특수문자가 많은 복잡한 id보다 간단한 형식 권장
- 예: `id="flow-diagram"`, `id="example"` (하이픈 최소화)
- ❌ 나쁜 예: `id="H-AI-Conversation-Analysis-Flow"`
- ✅ 좋은 예: `id="flow-diagram"` 또는 `id="flow"` (더 간단하게)

### 6-1. mxCell id 명명 규칙 (환경에 따라 다름)
**온라인 draw.io 생성 파일**:
- 하이픈 사용 가능: `id="user-lane"`, `id="arrow1"`, `id="stage1-header"` 
- 특수문자도 대부분 정상 작동

**AI/수동 생성 파일 (파싱 오류 발생 시)**:
- ❌ 나쁜 예: `id="step1-box"`, `id="arrow1-1"`, `id="legend-title"`
- ✅ 좋은 예: `id="step1box"`, `id="arrow1a"`, `id="legendtitle"`

**권장**:
- 가능하면 온라인 draw.io에서 직접 작업
- 코드로 생성 시 "argument is undefined or null" 에러 발생하면 하이픈 제거

### 7. style 속성 형식
- style 속성 끝의 세미콜론(`;`)은 선택사항이지만 일관성을 위해 제거 권장
- ❌ 나쁜 예: `style="fillColor=#d5e8d4;strokeColor=#82b366;"`
- ✅ 좋은 예: `style="fillColor=#d5e8d4;strokeColor=#82b366"`

### 8. Edge 스타일
**온라인 draw.io 생성**:
- 복잡한 스타일 자동 생성되며 정상 작동
- 예: `style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2"`

**수동/AI 생성 시 권장**:
- 단순한 스타일 사용: `style="endArrow=classic;html=1;rounded=0"`
- 필요시 `strokeWidth`, `strokeColor` 추가

**화살표 라벨링 (중요!)**:
- 화살표에 설명 추가로 가독성 향상
- 예: `<mxCell id="arrow4-label" value="JSON 전송" ... connectable="0" parent="arrow4">`

### 9. value 텍스트의 특수문자 처리
- **괄호, 콜론 등 특수문자가 파싱 오류를 일으킬 수 있음**
- 괄호는 공백으로 대체하거나 제거 권장
- ❌ 나쁜 예: `value="에이전트(LLM) 사고"`, `value="데이터(JSON)"`
- ✅ 좋은 예: `value="에이전트 LLM 사고"`, `value="데이터 JSON"`
- JSON 형식 표시 시 중괄호, 따옴표 제거하고 단순 텍스트로 표현
- ❌ 나쁜 예: `value="{&quot;type&quot;: &quot;Package_Card&quot;}"`
- ✅ 좋은 예: `value="type: Package_Card"`

### 10. diagram name 간소화
- 온라인 draw.io: 한글 포함 가능 (예: `name="A2UI 5 Step Flow"`)
- AI/수동 생성: 영문 위주 권장 (예: `name="A2UI Flow"`)

### 11. 고급 도형 활용
다이어그램의 가독성을 높이는 도형들:

**Swimlane (수영 레인)**:
```xml
<mxCell id="user-lane" value="사용자 (User)" 
  style="swimlane;horizontal=0;whiteSpace=wrap;html=1;
         fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=14;fontStyle=1;startSize=30;" 
  vertex="1" parent="1">
  <mxGeometry x="40" y="40" width="1500" height="200" as="geometry"/>
</mxCell>
```
- 역할/단계별 영역 구분에 유용
- `horizontal=0`: 가로 수영 레인, `horizontal=1`: 세로 수영 레인

**Callout (말풍선 - 생각/판단 표시)**:
```xml
<mxCell id="thinking" value="💭 에이전트 생각: ..."
  style="shape=callout;whiteSpace=wrap;html=1;perimeter=calloutPerimeter;
         fillColor=#ffe6cc;strokeColor=#d79b00;base=20;size=20;position=0.5;"
  vertex="1" parent="1">
  <mxGeometry x="50" y="120" width="200" height="80" as="geometry"/>
</mxCell>
```
- 주체의 사고 과정 표현에 효과적
- 이모지 활용으로 시각적 명확성 향상

**Note (노트 - 부가 정보)**:
```xml
<mxCell id="note" value="📌 시각적 스타일 정보는 제외"
  style="shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;
         fillColor=#f5f5f5;strokeColor=#666666;size=15;"
  vertex="1" parent="1">
  <mxGeometry x="610" y="240" width="200" height="30" as="geometry"/>
</mxCell>
```
- 추가 설명이나 주의사항 표시

**Cylinder (데이터베이스)**:
```xml
<mxCell id="db" value="내부 DB 검색"
  style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;
         backgroundOutline=1;size=10;fillColor=#f5f5f5;"
  vertex="1" parent="1">
  <mxGeometry x="330" y="40" width="100" height="60" as="geometry"/>
</mxCell>
```
- 데이터 저장소 표현

## 📋 파일 생성 체크리스트

### 온라인 draw.io 사용 시 (권장)
- [ ] mxfile 태그에 필수 속성이 모두 있는가?
- [ ] root에 id="0"과 id="1" 셀이 있는가?
- [ ] 모든 mxCell에 mxGeometry가 정의되어 있는가?
- [ ] 모든 edge의 source/target이 실제로 존재하는 id인가?
- [ ] id가 중복되지 않는가?
- [ ] 화살표에 설명 라벨이 있는가? (가독성 향상)
- [ ] 범례(Legend)가 있는가?

### AI/수동 코드 생성 시 (파싱 오류 주의)
- [ ] HTML 주석(`<!-- -->`)이 없는가?
- [ ] 모든 mxCell id에 하이픈이 없는가?
- [ ] value 텍스트에 괄호나 복잡한 특수문자가 없는가?
- [ ] style 속성 끝의 세미콜론이 제거되었는가?
- [ ] edge 스타일이 단순화되었는가?

## 🔧 문제 발생 시 확인 사항

1. **파일이 열리지 않을 때**
   - HTML 주석 제거
   - 빈 mxGeometry 확인
   - source/target 참조 확인
   - diagram id 형식 확인 (복잡한 id는 간단하게 변경)
   - **모든 mxCell id에서 하이픈 제거** (step1-box → step1box)
   - value 텍스트의 괄호 제거 (에이전트(LLM) → 에이전트 LLM)
   - style 속성 세미콜론 제거
   - edge 스타일 단순화

2. **"undefined" 또는 "null" 에러**
   - HTML 주석이 가장 흔한 원인
   - mxGeometry 누락 확인
   - 존재하지 않는 id 참조 확인
   - **mxCell id의 하이픈 제거** (가장 흔한 원인 중 하나)
   - value 텍스트의 특수문자 확인

3. **"argument is undefined or null" 에러**
   - **mxCell id에서 하이픈 제거** (가장 흔한 원인)
   - value 텍스트의 괄호, 콜론 등 특수문자 제거
   - JSON 형식 표시 시 중괄호, 따옴표 제거

4. **VS Code 확장 문제**
   - 확장 재설치
   - 온라인 draw.io에서 파일 열기 테스트
   - 파일이 온라인에서 열리면 확장 문제

## 💡 권장 사항

### 1. 온라인 draw.io에서 생성 (강력 권장 ⭐)
- **가장 안전하고 기능이 풍부한 방법**
- https://app.diagrams.net 사용
- HTML 주석, 하이픈 등 자유롭게 사용 가능
- 복잡한 스타일, 고급 도형 자동 생성
- **파싱 오류 걱정 없음**

### 2. 구조적 다이어그램 작성 팁
**좋은 다이어그램의 특징** (a2ui_flow.drawio 참고):
- **Swimlane 활용**: 역할/단계별 영역 구분
- **Callout으로 생각 표현**: 주체의 사고 과정 시각화
- **화살표 라벨링**: 데이터 흐름 명확히 표시
- **범례 추가**: 색상/도형 의미 설명
- **단계별 헤더**: 전체 플로우의 구조 명확화
- **이모지 활용**: 시각적 가독성 향상 (💭, 📱, 📌 등)

### 3. Mermaid 형식 병행 사용
- 간단한 플로우차트는 Mermaid로
- GitHub, VS Code에서 바로 렌더링
- 설치 불필요

### 4. 템플릿 사용
- `A2UI/a2ui_flow.drawio` 같은 잘 만들어진 파일을 템플릿으로 활용
- 새 파일 생성 시 복사 후 수정

## 📝 예제

### 1. 기본 구조 (AI/수동 생성 시)
```xml
<mxfile host="app.diagrams.net" modified="2024-01-01T00:00:00.000Z" agent="5.0" version="21.0.0" etag="example" type="device">
  <diagram name="example" id="example">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="1654" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="start" value="시작" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366" vertex="1" parent="1">
          <mxGeometry x="400" y="40" width="100" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="end" value="종료" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366" vertex="1" parent="1">
          <mxGeometry x="400" y="140" width="100" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="arrow1" value="" style="endArrow=classic;html=1;rounded=0" edge="1" parent="1" source="start" target="end">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### 2. 고급 구조 예제 (온라인 draw.io 생성)
**참고 파일**: `A2UI/a2ui_flow.drawio`

이 파일은 다음을 포함한 잘 구조화된 다이어그램입니다:
- ✅ HTML 주석 사용 (온라인 생성이므로 안전)
- ✅ Swimlane으로 역할 구분
- ✅ Callout으로 사고 과정 표현
- ✅ 화살표 라벨링
- ✅ 범례 포함
- ✅ 단계별 헤더
- ✅ 이모지 활용

**구조적 특징**:
- 사용자, 에이전트, 클라이언트 3개 레인으로 구분
- 5단계 플로우를 명확한 헤더로 표시
- 각 단계마다 주체의 사고 과정을 Callout으로 표현
- 순환 구조를 명확한 화살표로 표시

## 🎯 핵심 요약

### ⭐ 가장 중요한 원칙
**온라인 draw.io 사용이 최선의 방법입니다!** (https://app.diagrams.net)

### 온라인 draw.io 사용 시
1. ✅ HTML 주석 자유롭게 사용 가능
2. ✅ mxCell id에 하이픈 사용 가능
3. ✅ 복잡한 스타일 자동 생성
4. ✅ 고급 도형(Swimlane, Callout 등) 활용
5. ✅ 파싱 오류 걱정 없음

### AI/수동 코드 생성 시 (파싱 오류 발생 시)
1. ❌ HTML 주석 사용 금지
2. ❌ mxCell id 하이픈 제거
3. ❌ value 텍스트 특수문자 최소화
4. ❌ 복잡한 edge 스타일 단순화
5. ✅ 모든 mxGeometry 정의 필수
6. ✅ source/target 참조 검증 필수

### 좋은 다이어그램 작성 팁
1. **Swimlane으로 역할/단계 구분**
2. **Callout으로 사고 과정 표현**
3. **화살표에 라벨 추가** (데이터 흐름 명확화)
4. **범례 포함** (색상/도형 의미 설명)
5. **이모지 활용** (시각적 가독성 향상)

## 🔍 실제 사례

### 사례 1: "argument is undefined or null" 에러 (AI 생성 파일)

**상황**: AI가 복잡한 플로우차트를 생성했는데 VS Code에서 "argument is undefined or null" 에러 발생

**원인**:
1. mxCell id에 하이픈 사용: `id="step1-box"`, `id="arrow1-1"`
2. value 텍스트에 괄호 사용: `value="에이전트(LLM) 사고"`
3. JSON 형식에 중괄호와 따옴표 사용

**해결**:
1. 모든 mxCell id에서 하이픈 제거: `step1-box` → `step1box`
2. 괄호를 공백으로 대체: `에이전트(LLM)` → `에이전트 LLM`
3. JSON을 단순 텍스트로 변경: `{...}` → `type: Package_Card`

**결과**: 정상 작동

---

### 사례 2: 잘 만들어진 다이어그램 (온라인 draw.io 생성)

**파일**: `A2UI/a2ui_flow.drawio`

**특징**:
- ✅ HTML 주석 사용 (정상 작동)
- ✅ mxCell id에 하이픈 사용 (정상 작동)
- ✅ Swimlane으로 3개 레인 구분
- ✅ Callout으로 사고 과정 표현
- ✅ 화살표 라벨링으로 데이터 흐름 명확화
- ✅ 범례 포함
- ✅ 이모지 활용 (💭, 📱, 📌)

**교훈**: 
- **온라인 draw.io에서 직접 작성하면 대부분의 파싱 오류 문제가 없음**
- **구조적이고 가독성 높은 다이어그램 작성 가능**
- **AI/수동 생성 시에만 엄격한 규칙 필요**

---

## 🎓 결론

1. **복잡한 다이어그램은 온라인 draw.io 사용 권장** ⭐
2. **AI/수동 생성은 간단한 다이어그램에만 사용**
3. **파싱 오류 발생 시 온라인 draw.io에서 다시 작성 고려**
4. **`A2UI/a2ui_flow.drawio`를 템플릿으로 활용**

이 가이드를 따르면 draw.io 파일 관련 문제를 대부분 예방하고, 가독성 높은 다이어그램을 작성할 수 있습니다.
