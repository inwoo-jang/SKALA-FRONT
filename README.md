# SKALA-FRONT · Inwoo.log

SKALA 4기 Full-stack Engineering 과제 저장소입니다.
사이트 이름은 **Inwoo.log** — 배움과 일상을 기록하는 개인 아카이브를 컨셉으로 만들었습니다.
순수 **HTML · CSS · Vanilla JavaScript**로만 제작했습니다. (프레임워크·빌드 도구 없음)

## 페이지

| 페이지 | 내용 |
|---|---|
| `index.html` | 홈 — 히어로, Recent trip 슬라이더, 방명록, 미니게임·성적계산기·가방 모달, 실시간 정보 |
| `myProfile.html` | 소개, 경험 타임라인, 성격, 취향(음식·색·운동·음악) |
| `myPortfolio.html` | 팀·개인 프로젝트 (스프링 노트 넘기기) |
| `myCalendar.html` | 달력 — 평일은 강의 시간표, 주말·휴일은 휴일 일과로 이동 |
| `myClass.html` | 주간 강의 시간표 (데이터로 23주 자동 생성) |
| `myHoliday.html` | 수업 없는 날의 하루 일과 |
| `myTrip.html` | 여행 사진·영상 + 배경음악 |
| `myReadings.html` | 읽은 책과 밑줄 그은 문장 |
| `login.html` · `signUp.html` · `signUpResult.html` | 로그인 / 회원가입 흐름 |

## 파일 구조

```
skala-front/
├─ html/                     11개 페이지 (위 표 참고)
├─ css/
│  ├─ style.css              과제 10~15 + 전체 디자인 시스템
│  └─ flags.css              국기 SVG 아이콘
├─ script/
│  │  # 과제 JS
│  ├─ upDown.js              과제 16 (숫자 맞추기 게임)
│  ├─ grade.js               과제 17 (성적 계산기)
│  ├─ bag.js                 과제 18 (여행 가방 꾸리기)
│  ├─ weather.js             과제 19·20 (날씨 · try/catch)
│  ├─ weatherAPI.js          과제 21 (Open-Meteo API)
│  ├─ realtimeInfo.js        과제 21 (ES 모듈)
│  │  # 페이지 동작
│  ├─ nav.js / auth.js       내비게이션 · 로그인 상태
│  ├─ slider.js              홈 Recent trip 슬라이더
│  ├─ guestbook.js / gbModal.js  방명록
│  ├─ calendar.js            달력 렌더링 · 요일 분기 · 오늘 일정
│  ├─ signUp.js / signUpResult.js  가입 검증 · GET 파라미터 표시
│  │  # 신경 쓴 부분
│  ├─ scheduleData.js        강의 일정 데이터 (한 곳에서 관리)
│  ├─ timetable.js           주간 시간표 자동 생성
│  ├─ profileMusic.js        앨범 커버플로우(3D)
│  ├─ portfolio.js           연습장 페이지 넘기기
│  ├─ trip.js / filmPlayer.js  여행 사진 뷰어 · BGM 플레이어
│  ├─ readings.js            책장 스크롤
│  └─ fingerCursor.js        커스텀 손가락 커서 + 글리터
├─ media/
│  ├─ trip/                  여행 사진·영상
│  ├─ albums/                좋아하는 앨범 커버
│  ├─ bgm/                   여행 페이지 배경음악
│  ├─ portfolio/             프로젝트 스크린샷
│  ├─ icon/ · map-*.svg      아이콘 · 지도
└─ README.md
```

## 과제 대응

HTML → CSS → JavaScript 순서로 단계를 나누어 진행했습니다.

| 태그 | 단계 | 내용 |
|---|---|---|
| `step1-html` | 1단계 | HTML 과제 1~9, CSS 미적용 |
| `step2-css` | 2단계 | CSS 과제 10~15 |
| `step3-js` | 3단계 | JavaScript 과제 16~21 |

과제 3(`myProfile.html`)·과제 4(`myClass.html`)는 요구사항에 따라 CSS 없이 HTML만으로 먼저 작성했고, 해당 상태는 `step1-html` 태그에서 확인할 수 있습니다. 과제 10 이후 사이트 전체 톤을 통일하기 위해 `style.css`를 적용했습니다.

### 요구사항 체크

| 영역 | 항목 | 위치 |
|---|---|---|
| HTML | 시맨틱 태그 `<header>` `<footer>` `<section>` `<article>` | 과제 9 |
| HTML | `<table>` — `<caption>`, `scope`, `colspan`/`rowspan` | 과제 4, 시간표 |
| HTML | 폼 — `minlength` `maxlength` `required` `selected` `checked` | 과제 6 |
| HTML | 의미 있는 `alt` 텍스트 | 과제 8 |
| CSS | CSS 변수(`:root`) | 과제 10 |
| CSS | Flexbox · Grid 레이아웃 | 과제 11~12 |
| CSS | `linear-gradient` | 과제 13 |
| CSS | 미디어 쿼리(태블릿·모바일) | 과제 14 |
| CSS | `nth-child` 순차 애니메이션 · `:focus-visible` · `prefers-reduced-motion` | 과제 15 |
| JS | 입력값 유효성 검사 | 과제 16·17 |
| JS | `try...catch` 오류 처리 | 과제 20 |
| JS | 비동기(`fetch`)·ES 모듈 | 과제 21 |
| JS | GET 파라미터 읽어 표시 | signUpResult.js |
| JS | JSDoc 주석 | 전반 |

## 신경 쓴 부분

과제 요건 위에, 실제 서비스처럼 보이도록 디테일을 더했습니다.

- **디자인 시스템 / 무드** — 따뜻한 종이색 배경 + 하늘색 포인트를 CSS 변수로 통일. 색을 하드코딩하지 않아 전 페이지 톤이 일치합니다.
- **커스텀 손가락 커서 + 글리터** — 홈 Recent trip·프로필 앨범·여행 사진 위에서 기본 커서를 숨기고 손가락(👆)이 마우스를 따라다닙니다. 클릭 가능한 대상 위에선 통통 튀고, 움직이면 작은 별이 반짝이며 흩어집니다. (터치 기기·모션 최소화 설정에선 자동 비활성)
- **프로필 앨범 커버플로우** — 좋아하는 앨범을 3D 커버플로우로 넘깁니다(가운데 크게·양옆 비스듬히). 커버를 누르면 해당 곡으로 이동하고, 좌우 끝에 마우스를 두면 자동으로 넘어갑니다.
- **강의 시간표 데이터화** — `scheduleData.js` 한 곳에 학기 일정(7/14~12/18)을 넣으면 **달력(날짜별 강의)**과 **주간 시간표(23주 표)**가 자동으로 만들어집니다.
- **포트폴리오 연습장** — 스프링 노트를 넘기는 3D 페이지 플립. 목차·좌우 절반 클릭·`‹ ›`·방향키로 넘기고, 페이지 높이를 고정해 안에서 스크롤합니다.
- **여행 뷰어 & BGM** — 사진 확대 뷰어(양옆 화살표·좌우 절반 클릭)와 필름이 감기는 배경음악 플레이어. 영상을 재생하면 BGM이 자동으로 멈춥니다.
- **국기 SVG 아이콘**(`flags.css`) — OS마다 다르게(또는 알파벳으로) 보이는 국기 이모지를 자체 SVG로 통일했습니다.
- **접근성** — 시맨틱 마크업, `:focus-visible`, 키보드 조작, `prefers-reduced-motion` 대응.

## 사용 기술

- **HTML5** — 시맨틱 태그, 접근성 속성
- **CSS3** — CSS 변수, Flexbox·Grid, 미디어 쿼리, 3D transform, 애니메이션
- **Vanilla JavaScript** — DOM 조작, 이벤트, 비동기 처리, ES 모듈
- **Open-Meteo API** — 실시간 날씨

## 미디어 출처

- 여행 사진·영상: 직접 촬영
- 앨범 커버: iTunes / 프로젝트 스크린샷: 본인 제작 서비스
- 배경음악(`media/bgm/`): 여행 페이지 데모용 3곡
