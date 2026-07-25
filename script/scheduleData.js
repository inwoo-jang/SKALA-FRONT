/* ==========================================================
   script/scheduleData.js — SKALA 4기 강의 일정 (2026-07-14 ~ 12-18)
   calendar.js(달력 표시)와 timetable.js(주간 시간표)가 함께 쓴다.
   여기 데이터만 고치면 두 화면에 모두 반영된다.
   ========================================================== */

/* 주제 → 카테고리(색 구분용) */
function skalaCategory(topic) {
  if (/팀프로젝트|mini-Project|Capstone|최종평가|수료|방법론/.test(topic)) { return "project"; }
  if (/Docker|쿠버네티스|DevOps|컨테이너|배포|MSA|Agile/.test(topic)) { return "infra"; }
  if (/HTML|CSS|JavaScript|Vue|Java|SpringBoot|REST/.test(topic)) { return "dev"; }
  if (/데이터 분석|통계|스마트 데이터|Feature|머신러닝|딥러닝|모델|서빙|AIOps|Python/.test(topic)) { return "data"; }
  if (/Prompt|Context|LLM|Transformer|생성형|LangChain|RAG|Agent|sLLM|Fine Tuning|Spring AI|Vector|MCP/.test(topic)) { return "ai"; }
  if (/팀빌딩|Git|특강/.test(topic)) { return "setup"; }
  return "etc";
}

var SKALA_CAT_COLOR = {
  setup: "peach", ai: "sky", data: "lime",
  dev: "lavender", infra: "mint", project: "pink", etc: "peach"
};

var SKALA_WEEK_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

var SKALA_TERM_START = "2026-07-14";
var SKALA_TERM_END = "2026-12-18";

/* 하루 한 주제 (w: 주차, d: 날짜, t: 주제) */
var SKALA_DAYS = [
  { w: 1, d: "2026-07-14", t: "팀빌딩 · Git 설정" },
  { w: 1, d: "2026-07-15", t: "Prompt 설계와 Context" },
  { w: 1, d: "2026-07-16", t: "데이터 분석 개요 / 기초통계" },
  { w: 2, d: "2026-07-20", t: "데이터 분석 개요 / 기초통계" },
  { w: 2, d: "2026-07-21", t: "LLM · Transformer 아키텍처" },
  { w: 2, d: "2026-07-22", t: "LLM · Transformer 아키텍처" },
  { w: 2, d: "2026-07-23", t: "HTML · CSS · JavaScript" },
  { w: 2, d: "2026-07-24", t: "HTML · CSS · JavaScript" },
  { w: 3, d: "2026-07-27", t: "스마트 데이터 이해 / 활용" },
  { w: 3, d: "2026-07-28", t: "스마트 데이터 이해 / 활용" },
  { w: 3, d: "2026-07-29", t: "스마트 데이터 이해 / 활용" },
  { w: 3, d: "2026-07-30", t: "스마트 데이터 이해 / 활용" },
  { w: 3, d: "2026-07-31", t: "Front: Vue.js" },
  { w: 4, d: "2026-08-03", t: "Front: Vue.js" },
  { w: 4, d: "2026-08-04", t: "Front: Vue.js" },
  { w: 4, d: "2026-08-05", t: "Front: Vue.js" },
  { w: 4, d: "2026-08-06", t: "데이터 분석 Python" },
  { w: 4, d: "2026-08-07", t: "데이터 분석 Python" },
  { w: 5, d: "2026-08-10", t: "Java · SpringBoot · REST API" },
  { w: 5, d: "2026-08-11", t: "Java · SpringBoot · REST API" },
  { w: 5, d: "2026-08-12", t: "Java · SpringBoot · REST API" },
  { w: 5, d: "2026-08-13", t: "Java · SpringBoot · REST API" },
  { w: 5, d: "2026-08-14", t: "Java · SpringBoot · REST API" },
  { w: 6, d: "2026-08-18", t: "Spring AI" },
  { w: 6, d: "2026-08-19", t: "Spring AI" },
  { w: 6, d: "2026-08-20", t: "Spring AI" },
  { w: 6, d: "2026-08-21", t: "컨테이너화 (Docker)" },
  { w: 7, d: "2026-08-24", t: "컨테이너화 (Docker)" },
  { w: 7, d: "2026-08-25", t: "특강 (취업)" },
  { w: 7, d: "2026-08-26", t: "Agile · MSA 개발" },
  { w: 7, d: "2026-08-27", t: "Agile · MSA 개발" },
  { w: 7, d: "2026-08-28", t: "sLLM · Fine Tuning" },
  { w: 8, d: "2026-08-31", t: "sLLM · Fine Tuning" },
  { w: 8, d: "2026-09-01", t: "머신러닝 · 딥러닝" },
  { w: 8, d: "2026-09-02", t: "머신러닝 · 딥러닝" },
  { w: 8, d: "2026-09-03", t: "머신러닝 · 딥러닝" },
  { w: 9, d: "2026-09-08", t: "쿠버네티스 배포" },
  { w: 9, d: "2026-09-09", t: "생성형 AI (LangChain)" },
  { w: 9, d: "2026-09-10", t: "생성형 AI (LangChain)" },
  { w: 9, d: "2026-09-11", t: "생성형 AI (LangChain)" },
  { w: 10, d: "2026-09-14", t: "실전 Feature Engineering" },
  { w: 10, d: "2026-09-15", t: "웹 서비스 mini-Project" },
  { w: 10, d: "2026-09-16", t: "웹 서비스 mini-Project" },
  { w: 10, d: "2026-09-17", t: "웹 서비스 mini-Project" },
  { w: 10, d: "2026-09-18", t: "RAG Pipeline" },
  { w: 11, d: "2026-09-21", t: "RAG Pipeline" },
  { w: 11, d: "2026-09-22", t: "RAG Pipeline" },
  { w: 12, d: "2026-09-28", t: "모델 개발 / 최적화" },
  { w: 12, d: "2026-09-29", t: "모델 개발 / 최적화" },
  { w: 12, d: "2026-09-30", t: "모델 서빙 · AIOps" },
  { w: 12, d: "2026-10-01", t: "모델 서빙 · AIOps" },
  { w: 12, d: "2026-10-02", t: "모델 서빙 · AIOps" },
  { w: 13, d: "2026-10-06", t: "AI Agent 설계 / 구축" },
  { w: 13, d: "2026-10-07", t: "AI Agent 설계 / 구축" },
  { w: 13, d: "2026-10-08", t: "Vector DB" },
  { w: 14, d: "2026-10-12", t: "DevOps" },
  { w: 14, d: "2026-10-13", t: "DevOps" },
  { w: 14, d: "2026-10-14", t: "쿠버네티스 실무 심화" },
  { w: 14, d: "2026-10-15", t: "쿠버네티스 실무 심화" },
  { w: 14, d: "2026-10-16", t: "쿠버네티스 실무 심화" },
  { w: 15, d: "2026-10-19", t: "데이터 분석 mini-Project" },
  { w: 15, d: "2026-10-20", t: "데이터 분석 mini-Project" },
  { w: 15, d: "2026-10-21", t: "AI Agent Capstone (MCP)" },
  { w: 15, d: "2026-10-22", t: "AI Agent Capstone (MCP)" },
  { w: 15, d: "2026-10-23", t: "AI Agent Capstone (MCP)" },
  { w: 16, d: "2026-10-26", t: "AI 서비스 mini-Project" },
  { w: 16, d: "2026-10-27", t: "AI 서비스 mini-Project" },
  { w: 16, d: "2026-10-28", t: "AI 서비스 mini-Project" },
  { w: 16, d: "2026-10-29", t: "AI 프로젝트 방법론" },
  { w: 23, d: "2026-12-17", t: "최종평가 (예선)" },
  { w: 23, d: "2026-12-18", t: "최종평가 (본선) · 수료식" }
];

/* 팀프로젝트 주간 — 시작~끝 사이 평일 전체가 팀프로젝트 */
var SKALA_PROJECT_WEEKS = [
  { w: 17, start: "2026-11-02", end: "2026-11-05" },
  { w: 18, start: "2026-11-09", end: "2026-11-13" },
  { w: 19, start: "2026-11-16", end: "2026-11-19" },
  { w: 20, start: "2026-11-23", end: "2026-11-27" },
  { w: 21, start: "2026-11-30", end: "2026-12-04" },
  { w: 22, start: "2026-12-07", end: "2026-12-11" },
  { w: 23, start: "2026-12-14", end: "2026-12-16" }
];

/** Date → "YYYY-MM-DD" */
function skalaIso(date) {
  return date.getFullYear() + "-" +
         String(date.getMonth() + 1).padStart(2, "0") + "-" +
         String(date.getDate()).padStart(2, "0");
}

/* 날짜 → { week, topic, category } 맵 */
var SKALA_SCHEDULE = {};

(function () {
  var i;
  for (i = 0; i < SKALA_DAYS.length; i++) {
    var e = SKALA_DAYS[i];
    SKALA_SCHEDULE[e.d] = { week: e.w, topic: e.t, category: skalaCategory(e.t) };
  }

  for (i = 0; i < SKALA_PROJECT_WEEKS.length; i++) {
    var pw = SKALA_PROJECT_WEEKS[i];
    var cur = new Date(pw.start + "T00:00:00");
    var end = new Date(pw.end + "T00:00:00");
    while (cur <= end) {
      var dow = cur.getDay();
      var iso = skalaIso(cur);
      if (dow !== 0 && dow !== 6 && !SKALA_SCHEDULE[iso]) {
        SKALA_SCHEDULE[iso] = { week: pw.w, topic: "팀프로젝트", category: "project" };
      }
      cur.setDate(cur.getDate() + 1);
    }
  }
})();

/* 주차별 묶음 — [{ week, label, days:[{date, dow, md, topic, color}] }] */
var SKALA_WEEKS = (function () {
  var byWeek = {};
  var dates = Object.keys(SKALA_SCHEDULE).sort();

  for (var i = 0; i < dates.length; i++) {
    var iso = dates[i];
    var info = SKALA_SCHEDULE[iso];
    if (!byWeek[info.week]) { byWeek[info.week] = []; }

    var dt = new Date(iso + "T00:00:00");
    byWeek[info.week].push({
      date: iso,
      dow: SKALA_WEEK_NAMES[dt.getDay()],
      md: String(dt.getMonth() + 1).padStart(2, "0") + "." + String(dt.getDate()).padStart(2, "0"),
      topic: info.topic,
      color: SKALA_CAT_COLOR[info.category] || "peach"
    });
  }

  var weeks = [];
  var nums = Object.keys(byWeek).map(Number).sort(function (a, b) { return a - b; });
  for (var k = 0; k < nums.length; k++) {
    var days = byWeek[nums[k]];
    weeks.push({
      week: nums[k],
      label: days[0].md + " ~ " + days[days.length - 1].md,
      days: days
    });
  }
  return weeks;
})();
