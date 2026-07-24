# SKALA-FRONT

SKALA 4기 Full-stack Engineering 과제 저장소입니다.
사이트 이름은 **Inwoo.log**, 배움과 일상을 기록하는 개인 아카이브를 컨셉으로 만들었습니다.

## 실행 방법

1. 저장소를 클론합니다.
2. VS Code에서 폴더를 엽니다.
3. `html/index.html`을 우클릭하고 Open with Live Server를 선택합니다.

과제 20·21의 날씨 API와 ES 모듈은 CORS 정책상 Live Server 환경에서만 동작합니다.
`file://`로 직접 열면 콘솔에 CORS 오류가 납니다.

## 파일 구조

```
skala-front/
├─ html/
│  ├─ index.html          과제 1·5·9 + JS 과제 16~21 무대
│  ├─ myProfile.html      과제 3
│  ├─ myPortfolio.html    추가
│  ├─ myCalendar.html     추가 (과제 4·2를 잇는 허브)
│  ├─ myClass.html        과제 4
│  ├─ myHoliday.html      과제 2
│  ├─ myTrip.html         과제 8
│  ├─ myReadings.html     추가
│  ├─ login.html          추가
│  ├─ signUp.html         과제 6
│  └─ signUpResult.html   과제 7
├─ css/
│  └─ style.css           과제 10~15 (이 파일 하나만)
├─ script/
│  ├─ upDown.js           과제 16
│  ├─ grade.js            과제 17
│  ├─ bag.js              과제 18
│  ├─ weather.js          과제 19·20
│  ├─ weatherAPI.js       과제 21
│  ├─ realtimeInfo.js     과제 21
│  ├─ calendar.js         추가 (달력 렌더링·분기 이동, 사이드바 오늘 날짜)
│  └─ signUpResult.js     추가 (GET 파라미터 표시)
├─ media/                 과제 8
└─ README.md
```

## 사이트 구조

- **My Profile** — 한 줄 소개, 경험 타임라인, 성격, 취향(음식·음악·취미)
- **My Portfolio** — 팀 프로젝트, 개인 프로젝트
- **My Calendar** — 날짜를 누르면 평일은 강의 시간표, 주말은 휴일 기록으로 이동
- **My Trip** — 해외(태국·중국·일본), 국내(부산·속초·전주)
- **My Readings** — 읽은 책과 밑줄 그은 문장

## 진행 방식

HTML → CSS → JavaScript 순서로 단계를 나누어 진행했습니다.

| 태그 | 단계 | 내용 |
|---|---|---|
| `step1-html` | 1단계 | HTML 과제 1~9, CSS 미적용 |
| `step2-css` | 2단계 | CSS 과제 10~15 |
| `step3-js` | 3단계 | JavaScript 과제 16~21 |

## 과제 3·4 CSS 미사용 확인

과제 3(`myProfile.html`)과 과제 4(`myClass.html`)는 요구사항에 따라
CSS 없이 HTML만으로 작성했습니다.
해당 상태는 `step1-html` 태그에서 확인하실 수 있습니다.
과제 10 이후 사이트 전체 톤을 통일하기 위해 `style.css`를 적용했습니다.

## 미디어 파일 안내

`media/` 폴더의 이미지 6장은 레이아웃 확인용 그라디언트 자리표시 파일입니다.
실제 여행 사진으로 교체할 때는 파일명을 그대로 유지하면 HTML 수정이 필요 없습니다.

`bangkok-river.mp4`와 `tokyo-street.mp3`는 아직 넣지 않았습니다.
같은 이름으로 `media/` 폴더에 넣으면 바로 재생됩니다.

## 추가 실습 내용

| 영역 | 추가 실습 | 위치 |
|---|---|---|
| 페이지 | myPortfolio.html 신규 제작 | 추가 |
| 페이지 | myCalendar.html 신규 제작 | 추가 |
| 페이지 | myReadings.html 신규 제작 | 추가 |
| 페이지 | login.html 신규 제작 | 추가 |
| JS | 달력 렌더링 및 요일 분기 이동 | calendar.js |
| JS | 사이드바 오늘 날짜·일정 표시 | calendar.js |
| JS | GET 파라미터를 읽어 가입 결과 표시 | signUpResult.js |
| JS | `try...catch` 오류 처리 | 과제 20 |
| JS | 입력값 유효성 검사 | 과제 16·17 |
| JS | JSDoc 주석 | 과제 21 |
| HTML | `<caption>`, `scope` 속성 | 과제 4 |
| HTML | `<header>` `<footer>` `<section>` `<article>` | 과제 9 |
| HTML | `minlength`, `maxlength`, `selected`, `checked` | 과제 6 |
| HTML | 의미 있는 `alt` 텍스트 | 과제 8 |
| CSS | CSS 변수(`:root`) 활용 | 과제 10 |
| CSS | 태블릿 구간 미디어 쿼리 추가 | 과제 14 |
| CSS | `linear-gradient` 활용 | 과제 13 |
| CSS | `nth-child` 순차 애니메이션 | 과제 15 |
| CSS | `:focus-visible` 스타일 | 과제 10 |
| CSS | `prefers-reduced-motion` 대응 | 과제 15 |

## 사용 기술

- HTML5 시맨틱 태그
- CSS3 — CSS 변수, Flexbox, Grid, 미디어 쿼리, 애니메이션
- Vanilla JavaScript — DOM 조작, 이벤트, 비동기 처리, ES 모듈
- Open-Meteo API
