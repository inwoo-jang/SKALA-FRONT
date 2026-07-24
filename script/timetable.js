/* ==========================================================
   script/timetable.js — 추가 실습
   캘린더에서 넘어온 날짜(?date=YYYY-MM-DD)가 속한 주차의
   시간표만 보여준다. 날짜가 없으면 두 주차를 모두 보여준다.
   1주차: 2026.07.13(월) ~ / 2주차: 2026.07.20(월) ~
   ========================================================== */

var weekLabel = document.getElementById("weekLabel");

var weekPanels = [
  { monday: "2026-07-13", name: "1주차", el: document.getElementById("weekPanel1") },
  { monday: "2026-07-20", name: "2주차", el: document.getElementById("weekPanel2") }
];

/**
 * 기준 날짜가 속한 주의 월요일을 구한다.
 * @param {Date} base
 * @returns {Date} 그 주의 월요일
 */
function getMonday(base) {
  var day = base.getDay();                 // 0(일) ~ 6(토)
  var diff = (day === 0) ? -6 : 1 - day;   // 일요일은 지난 주 월요일로
  var monday = new Date(base);
  monday.setDate(base.getDate() + diff);
  return monday;
}

/** "2026-07-13" 형태로 만든다. */
function toIso(date) {
  return date.getFullYear() + "-" +
         String(date.getMonth() + 1).padStart(2, "0") + "-" +
         String(date.getDate()).padStart(2, "0");
}

function showWeek() {
  if (!weekLabel) { return; }

  var params = new URLSearchParams(location.search);
  var raw = params.get("date");

  // 날짜가 없으면 두 주차를 모두 보여준다
  if (!raw) { return; }

  // "T00:00:00"을 붙여 로컬 자정으로 파싱한다 (날짜만 주면 UTC로 해석돼 하루 밀릴 수 있음)
  var base = new Date(raw + "T00:00:00");
  if (isNaN(base.getTime())) { return; }

  var mondayIso = toIso(getMonday(base));
  var matched = null;

  for (var i = 0; i < weekPanels.length; i++) {
    if (weekPanels[i].monday === mondayIso) {
      matched = weekPanels[i];
    }
  }

  // 기록이 없는 주차면 전체를 그대로 보여준다
  if (!matched) {
    weekLabel.textContent = "선택한 주의 시간표는 아직 없어요 — 1·2주차 전체 표시";
    return;
  }

  for (var j = 0; j < weekPanels.length; j++) {
    weekPanels[j].el.hidden = (weekPanels[j] !== matched);
  }

  // 주차 이름은 아래 표 제목에 이미 있으므로 여기서 반복하지 않는다
  weekLabel.textContent = "달력에서 고른 주만 보는 중";
}

showWeek();
