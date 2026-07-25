/* ==========================================================
   script/timetable.js — 강의 일정 데이터로 주차별 시간표(표)를 그린다.
   원본 주간 시간표 양식(09~12 / 점심 / 13~15 / 15~18 실습)을 그대로 쓰되,
   scheduleData.js 의 데이터로 전 주차를 채운다.
   - ?date 없으면 전체 주차 / ?date 있으면 그 주차만 (주간).
   ========================================================== */

var weekListEl = document.getElementById("weekList");
var weekLabelEl = document.getElementById("weekLabel");

var TT_DOW = ["월", "화", "수", "목", "금"];

/* 카테고리별 앞머리 이모지 — 원본 셀 느낌 */
var TT_EMOJI = {
  setup: "🛠️", ai: "🤖", data: "📊", dev: "⚙️",
  infra: "🐳", project: "👥", etc: "✨"
};

function ttPad(n) { return String(n).padStart(2, "0"); }
function ttIso(d) { return d.getFullYear() + "-" + ttPad(d.getMonth() + 1) + "-" + ttPad(d.getDate()); }
function ttMd(d) { return ttPad(d.getMonth() + 1) + "." + ttPad(d.getDate()); }

/** iso 날짜가 속한 주의 월요일 */
function ttMonday(iso) {
  var d = new Date(iso + "T00:00:00");
  var day = d.getDay();
  var diff = (day === 0) ? -6 : 1 - day;   // 일요일은 지난 주 월요일로
  d.setDate(d.getDate() + diff);
  return d;
}

/** 그 주의 월~금 iso 배열 */
function ttWeekdays(mon) {
  var out = [];
  for (var i = 0; i < 5; i++) {
    var d = new Date(mon);
    d.setDate(mon.getDate() + i);
    out.push(ttIso(d));
  }
  return out;
}

/** 강의 주제 행 (09~12, 13~15) — 강의 없는 날은 빈 칸 */
function ttTopicRow(label, cols) {
  var row = '<tr><th scope="row">' + label + '</th>';
  for (var i = 0; i < cols.length; i++) {
    var e = SKALA_SCHEDULE[cols[i]];
    if (e) {
      var color = SKALA_CAT_COLOR[e.category] || "peach";
      var emoji = TT_EMOJI[e.category] || "✨";
      row += '<td class="cell--' + color + '">' + emoji + ' ' + e.topic + '</td>';
    } else {
      row += '<td></td>';
    }
  }
  return row + '</tr>';
}

/** 오후 실습 행 (15~18) — 강의 있는 날만 */
function ttPracticeRow(cols) {
  var row = '<tr><th scope="row">15:00 ~ 18:00</th>';
  for (var i = 0; i < cols.length; i++) {
    row += SKALA_SCHEDULE[cols[i]] ? '<td>👥 실습 · 팀 과제</td>' : '<td></td>';
  }
  return row + '</tr>';
}

if (weekListEl && typeof SKALA_WEEKS !== "undefined") {
  var html = "";

  for (var w = 0; w < SKALA_WEEKS.length; w++) {
    var wk = SKALA_WEEKS[w];
    var mon = ttMonday(wk.days[0].date);
    var cols = ttWeekdays(mon);

    html += '<section class="panel week-block" id="week-' + wk.week + '">';
    html += '<h2 class="section-title">week' + wk.week + ': <small>' + wk.label + '</small></h2>';
    html += '<div class="table-scroll"><table class="schedule">';
    html += '<caption>' + wk.week + '주차 강의 시간표</caption>';

    /* 머리행 — 시간 + 월~금 날짜 */
    html += '<thead><tr><th scope="col">시간</th>';
    for (var h = 0; h < 5; h++) {
      var hd = new Date(mon);
      hd.setDate(mon.getDate() + h);
      html += '<th scope="col">' + TT_DOW[h] + '<small>' + ttMd(hd) + '</small></th>';
    }
    html += '</tr></thead>';

    /* 본문 — 09~12 / 점심 / 13~15 / 15~18 (원본 양식) */
    html += '<tbody>';
    html += ttTopicRow("09:00 ~ 12:00", cols);
    html += '<tr><th scope="row">12:00 ~ 13:00</th>' +
            '<td colspan="5" class="lunch">점심시간 🍱</td></tr>';
    html += ttTopicRow("13:00 ~ 15:00", cols);
    html += ttPracticeRow(cols);
    html += '</tbody>';

    html += '</table></div></section>';
  }

  weekListEl.innerHTML = html;

  /* ?date 가 있으면 그 주차만 보여준다 (주간 보기) */
  var params = new URLSearchParams(location.search);
  var raw = params.get("date");
  var blocks = weekListEl.querySelectorAll(".week-block");

  if (raw && typeof SKALA_SCHEDULE !== "undefined" && SKALA_SCHEDULE[raw]) {
    var wnum = SKALA_SCHEDULE[raw].week;

    var startIdx = 0;
    for (var s = 0; s < SKALA_WEEKS.length; s++) {
      if (SKALA_WEEKS[s].week === wnum) { startIdx = s; }
    }

    weekListEl.classList.add("week-single");

    var jumpPrev = document.createElement("button");
    jumpPrev.type = "button";
    jumpPrev.className = "week-jump week-jump--prev";
    jumpPrev.setAttribute("aria-label", "이전 주");
    jumpPrev.textContent = "‹";

    var jumpNext = document.createElement("button");
    jumpNext.type = "button";
    jumpNext.className = "week-jump week-jump--next";
    jumpNext.setAttribute("aria-label", "다음 주");
    jumpNext.textContent = "›";

    weekListEl.appendChild(jumpPrev);
    weekListEl.appendChild(jumpNext);

    var idx = startIdx;

    function showWeekAt(i) {
      idx = i;
      var n = SKALA_WEEKS[i].week;
      for (var b = 0; b < blocks.length; b++) {
        blocks[b].hidden = (blocks[b].id !== "week-" + n);
      }
      if (weekLabelEl) { weekLabelEl.textContent = n + "주차"; }
      jumpPrev.disabled = (i === 0);
      jumpNext.disabled = (i === SKALA_WEEKS.length - 1);
    }

    jumpPrev.addEventListener("click", function () { if (idx > 0) { showWeekAt(idx - 1); } });
    jumpNext.addEventListener("click", function () { if (idx < SKALA_WEEKS.length - 1) { showWeekAt(idx + 1); } });

    showWeekAt(startIdx);
  } else if (weekLabelEl) {
    weekLabelEl.textContent = "전체 일정";
  }
}
