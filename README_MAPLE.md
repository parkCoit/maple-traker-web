# Maple Tracker - Client (React + TypeScript)

React + TypeScript + Vite 기반의 Maple Tracker 클라이언트입니다.

## 프로젝트 구조

```
client/
├── src/
│   ├── pages/           # 페이지 컴포넌트
│   │   ├── LoginPage.tsx
│   │   └── DashboardPage.tsx
│   ├── components/      # 재사용 가능한 컴포넌트
│   ├── hooks/           # 커스텀 React 훅
│   ├── services/        # API 호출 로직
│   │   └── api.ts
│   ├── types/           # TypeScript 타입 정의
│   │   └── index.ts
│   ├── utils/           # 유틸리티 함수
│   │   └── index.ts
│   ├── styles/          # CSS 파일
│   ├── App.tsx          # 라우팅 설정
│   ├── main.tsx         # 진입점
│   └── App.css
├── .env                 # 환경 변수
├── vite.config.ts       # Vite 설정
├── tsconfig.json        # TypeScript 설정
├── package.json
└── node_modules/
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정 (.env)

```env
VITE_API_URL=http://localhost:8000/api
```

### 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 4. 프로덕션 빌드

```bash
npm run build
```

### 5. 빌드 결과 미리보기

```bash
npm run preview
```

## 주요 기능

### 1. 로그인 (자동 로그인 지원)

- 닉네임 + 암호로 접속
- localStorage를 통한 자동 로그인
- 컴퓨터 껐다켜도 자동 로그인 유지

### 2. 대시보드

- 캐릭터 정보 표시
- 수익 현황 (오늘, 이번 주, 이번 달)
- 월간 출석부 (달력 형태)

### 3. 사냥 기록

- 사냥 기록 입력 (날짜, 소재, 메소, 조각 등)
- 월별 조회 및 통계
- 주간별 분석

### 4. 보스 기록

- 보스 기록 입력
- 주간 정산
- 월간 보스 통계

## API 통신

모든 API 호출은 `src/services/api.ts`에서 관리합니다.

```typescript
// 예: 사냥 기록 생성
const result = await farmingService.createLog({
  nickname: "캐릭터명",
  date: "2026-05-16",
  level: 250,
  // ... 기타 정보
});
```

## 인증 흐름

1. 사용자가 로그인 페이지에서 닉네임 + 암호 입력
2. `authService.verifyAccess()` 호출
3. 서버에서 암호 검증
4. 자동 로그인 체크박스 활성화 시 localStorage에 저장
5. 다시 접속할 때 localStorage에서 닉네임 로드
6. 세션 유지

## 기술 스택

- **React 18+** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **React Router** - 라우팅
- **Axios** (선택) - HTTP 클라이언트
- **ESLint** - 코드 린팅

## 개발 가이드

### 새로운 페이지 추가

1. `src/pages/`에 컴포넌트 작성
2. `src/App.tsx`에 라우트 추가
3. 필요시 `src/services/api.ts`에 API 함수 추가

### 새로운 컴포넌트 추가

1. `src/components/`에 컴포넌트 작성
2. 필요시 `src/styles/`에 CSS 파일 작성
3. 페이지에서 import 후 사용

## 주요 유틸리티 함수

- `formatKoreanCurrency()` - 한국식 통화 포맷팅
- `getWeekOfMonth()` - 주차 계산
- `formatDate()` - 날짜 형식 변환
- `getAutoLoginToken()` - 자동 로그인 토큰 조회
- `setAutoLoginToken()` - 자동 로그인 토큰 저장
- `clearAutoLoginToken()` - 자동 로그인 토큰 삭제
