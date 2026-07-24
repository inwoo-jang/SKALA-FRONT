/* ==========================================================
   script/calendar.js — 추가 실습
   1) 달력 렌더링 및 분기 이동 (myCalendar.html)
      평일 클릭 → myClass.html / 주말 클릭 → myHoliday.html
   2) 평일 / 휴일 탭 전환
   3) 사이드바 오늘 날짜와 일정 (index.html)
   ========================================================== */

var WEEK_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

/* SKALA 수업 기간 — 이 범위의 평일만 수업일로 칠한다 */
var CLASS_START = "2026-07-14";
var CLASS_END = "2026-12-18";

var calGrid = document.getElementById("calGrid");
var calTitle = document.getElementById("calTitle");
var prevBtn = document.getElementById("prevMonth");
var nextBtn = document.getElementById("nextMonth");

var today = new Date();
var viewYear = today.getFullYear();
var viewMonth = today.getMonth();

/**
 * 지정한 연·월의 달력을 그린다.
 * @param {number} year
 * @param {number} month 0부터 시작
 */
function renderCalendar(year, month) {
  var firstDay = new Date(year, month, 1).getDay();
  var lastDate = new Date(year, month + 1, 0).getDate();
  var html = "";

  calTitle.textContent = year + "년 " + (month + 1) + "월";

  // 앞쪽 빈 칸
  for (var b = 0; b < firstDay; b++) {
    html = html + '<div class="cal-day cal-day--blank"></div>';
  }

  // 날짜 칸
  for (var d = 1; d <= lastDate; d++) {
    var dayOfWeek = new Date(year, month, d).getDay();
    var isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

    var iso = year + "-" +
              String(month + 1).padStart(2, "0") + "-" +
              String(d).padStart(2, "0");

    // 수업 기간 안의 평일만 수업일이다. 기간 밖은 색 없이 둔다.
    var inCourse = (iso >= CLASS_START && iso <= CLASS_END);
    var hasClass = inCourse && !isWeekend;

    var typeClass, tagText, moveTo;
    if (hasClass) {
      typeClass = "cal-day--class";
      tagText = "수업";
      moveTo = "강의 시간표";
    } else if (inCourse && isWeekend) {
      typeClass = "cal-day--holiday";
      tagText = "휴일";
      moveTo = "휴일 기록";
    } else {
      typeClass = "cal-day--plain";
      tagText = "수업 없음";
      moveTo = "휴일 기록";
    }

    var isToday = (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      d === today.getDate()
    );

    if (isToday) {
      typeClass = typeClass + " cal-day--today";
    }

    // 날짜 칸은 배경색으로만 구분하고 글자는 숫자만 남긴다.
    html = html +
      '<button type="button" class="cal-day ' + typeClass + '" ' +
      'data-weekend="' + isWeekend + '" ' +
      'data-class="' + hasClass + '" ' +
      'data-date="' + iso + '" ' +
      'aria-pressed="false" ' +
      'aria-label="' + (month + 1) + '월 ' + d + '일 ' + tagText +
      ' — ' + moveTo + '로 이동">' +
      d +
      '</button>';
  }

  calGrid.innerHTML = html;
}

/** 날짜를 누르면 옆 패널이 그 날짜로 바뀐다 */
function handleDayClick(event) {
  var day = event.target.closest(".cal-day");

  if (!day || day.classList.contains("cal-day--blank")) {
    return;
  }

  var all = calGrid.querySelectorAll(".cal-day");
  for (var i = 0; i < all.length; i++) {
    all[i].classList.remove("cal-day--selected");
    all[i].setAttribute("aria-pressed", "false");
  }

  day.classList.add("cal-day--selected");
  day.setAttribute("aria-pressed", "true");

  selectDate(day.dataset.date, day.dataset.class === "true");
}

/** 월 이동 */
function changeMonth(diff) {
  viewMonth = viewMonth + diff;

  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear = viewYear - 1;
  } else if (viewMonth > 11) {
    viewMonth = 0;
    viewYear = viewYear + 1;
  }

  renderCalendar(viewYear, viewMonth);
  selectDefault();
}

/** 오늘(또는 그 달의 1일)을 기본으로 선택해 둔다 */
function selectDefault() {
  var todayCell = calGrid.querySelector(".cal-day--today");
  var target = todayCell || calGrid.querySelector(".cal-day:not(.cal-day--blank)");
  if (!target) { return; }

  target.classList.add("cal-day--selected");
  target.setAttribute("aria-pressed", "true");
  selectDate(target.dataset.date, target.dataset.class === "true");
}


/* ==========================================================
   선택한 날짜의 일정
   index.html 사이드바(#todayDate)와
   myCalendar.html 사이드(#sideToday) 양쪽에서 쓴다.
   ========================================================== */

/** "2026년 7월 23일 목요일" 형태로 만든다. */
function formatFull(date) {
  return date.getFullYear() + "년 " +
         (date.getMonth() + 1) + "월 " +
         date.getDate() + "일 " +
         WEEK_NAMES[date.getDay()] + "요일";
}

/**
 * 선택한 날짜에 맞춰 옆 패널을 바꾼다.
 * @param {string} iso "2026-07-23"
 * @param {boolean} hasClass 수업 기간 안의 평일인가
 */
function selectDate(iso, hasClass) {
  var dateEl = document.getElementById("sideToday");
  var bodyEl = document.getElementById("sideSchedule");
  var badge = document.getElementById("sideBadge");
  var classLink = document.getElementById("classLink");
  var blockWeekday = document.getElementById("blockWeekday");
  var blockHoliday = document.getElementById("blockHoliday");

  if (!dateEl || !bodyEl) { return; }

  // "T00:00:00"을 붙여 로컬 자정으로 파싱한다 (날짜만 주면 UTC로 해석돼 하루 밀릴 수 있음)
  var picked = new Date(iso + "T00:00:00");
  var isToday = (picked.toDateString() === new Date().toDateString());

  badge.textContent = isToday ? "Today" : "Selected";
  dateEl.textContent = formatFull(picked);

  if (hasClass) {
    bodyEl.innerHTML = "<p><strong>09:00 ~ 18:00</strong> SKALA 정규 수업</p>";
  } else {
    bodyEl.innerHTML = "<p>수업이 없는 날입니다.</p>";
  }

  // 수업일이면 평일 루틴, 아니면 휴일 루틴만 보여준다
  blockWeekday.hidden = !hasClass;
  blockHoliday.hidden = hasClass;

  // 수업이 없는 날에는 시간표 링크를 비활성화한다
  if (hasClass) {
    classLink.href = "myClass.html?date=" + iso;
    classLink.removeAttribute("aria-disabled");
    classLink.textContent = "주간 시간표 보기";
  } else {
    classLink.removeAttribute("href");
    classLink.setAttribute("aria-disabled", "true");
    classLink.textContent = "수업이 없는 날입니다";
  }
}

/* index.html 사이드바 — 오늘 날짜만 표시한다 */
function showTodayOnHome() {
  var dateEl = document.getElementById("todayDate");
  var bodyEl = document.getElementById("todaySchedule");
  if (!dateEl || !bodyEl) { return; }

  var now = new Date();
  var isWeekend = (now.getDay() === 0 || now.getDay() === 6);
  var nowIso = now.getFullYear() + "-" +
               String(now.getMonth() + 1).padStart(2, "0") + "-" +
               String(now.getDate()).padStart(2, "0");
  var hasClass = !isWeekend && nowIso >= CLASS_START && nowIso <= CLASS_END;

  dateEl.textContent = formatFull(now);

  if (hasClass) {
    bodyEl.innerHTML =
      "<p><strong>09:00 ~ 18:00</strong> SKALA 정규 수업 🕘</p>" +
      '<p><a href="myClass.html">주간 시간표 보러가기</a></p>';
  } else {
    bodyEl.innerHTML =
      "<p>오늘은 수업이 없는 날입니다 🛋️</p>" +
      '<p><a href="myHoliday.html">휴일 기록 보러가기</a></p>';
  }
}

showTodayOnHome();

/* ---------- 초기 실행 ---------- */

if (calGrid) {
  renderCalendar(viewYear, viewMonth);
  selectDefault();
  calGrid.addEventListener("click", handleDayClick);
  prevBtn.addEventListener("click", function () { changeMonth(-1); });
  nextBtn.addEventListener("click", function () { changeMonth(1); });
}
