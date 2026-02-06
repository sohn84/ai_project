# Draw.io 파일 생성 가이드

이 문서는 draw.io 파일을 생성할 때 발생할 수 있는 문제를 예방하기 위한 가이드입니다.

## 🚫 절대 하지 말아야 할 것

### 1. HTML 주석 사용 금지
```xml
<!-- 이렇게 주석을 사용하면 안 됩니다 -->
<mxCell id="start" ...>
```
**문제**: VS Code Draw.io Integration 확장이 HTML 주석을 제대로 파싱하지 못해 "undefined" 또는 "null" 에러 발생

**해결**: 주석을 사용하지 않거나, 필요시 파일 외부에 문서화

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

## 📋 파일 생성 체크리스트

파일을 생성한 후 다음을 확인하세요:

- [ ] HTML 주석(`<!-- -->`)이 없는가?
- [ ] 모든 mxCell에 mxGeometry가 정의되어 있는가?
- [ ] 모든 edge의 source/target이 실제로 존재하는 id인가?
- [ ] mxfile 태그에 필수 속성이 모두 있는가?
- [ ] root에 id="0"과 id="1" 셀이 있는가?
- [ ] 모든 셀이 parent="1"을 가지고 있는가?
- [ ] id가 중복되지 않는가?

## 🔧 문제 발생 시 확인 사항

1. **파일이 열리지 않을 때**
   - HTML 주석 제거
   - 빈 mxGeometry 확인
   - source/target 참조 확인

2. **"undefined" 또는 "null" 에러**
   - HTML 주석이 가장 흔한 원인
   - mxGeometry 누락 확인
   - 존재하지 않는 id 참조 확인

3. **VS Code 확장 문제**
   - 확장 재설치
   - 온라인 draw.io에서 파일 열기 테스트
   - 파일이 온라인에서 열리면 확장 문제

## 💡 권장 사항

1. **온라인 draw.io에서 생성 후 다운로드**
   - 가장 안전한 방법
   - https://app.diagrams.net 사용

2. **Mermaid 형식 병행 사용**
   - `.md` 파일로 Mermaid 다이어그램 생성
   - GitHub, VS Code에서 바로 렌더링
   - 설치 불필요

3. **템플릿 사용**
   - 올바른 형식의 파일을 템플릿으로 보관
   - 새 파일 생성 시 템플릿 복사 후 수정

## 📝 예제: 올바른 draw.io 파일 구조

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

## 🎯 핵심 요약

1. **HTML 주석 절대 사용 금지**
2. **모든 mxGeometry 정의 필수**
3. **source/target 참조 검증 필수**
4. **표준 draw.io 형식 준수**
5. **온라인 draw.io로 검증**

이 가이드를 따르면 draw.io 파일 관련 문제를 대부분 예방할 수 있습니다.
