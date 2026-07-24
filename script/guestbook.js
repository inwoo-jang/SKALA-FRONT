/* ==========================================================
   script/guestbook.js — 추가 실습
   로그인한 방문자만 글을 남길 수 있는 방명록.
   글은 localStorage에 저장하고, 작성자와 관리자만 삭제할 수 있다.
   ※ auth.js가 먼저 로드되어 있어야 한다.
   ========================================================== */

/* 키 끝의 v2 — 예시 글 문구를 바꿔서 저장소를 새로 시작한다 */
var GUESTBOOK_KEY = "inwoolog_guestbook_v2";

/* 정책 — 방명록 페이지는 최근 MAX_VISIBLE개만 보여준다.
   글이 계속 쌓여도 화면이 무한정 길어지지 않게 한다. */
var MAX_VISIBLE = 20;

var gbLocked = document.getElementById("gbLocked");
var gbWrite = document.getElementById("gbWrite");
var gbForm = document.getElementById("gbForm");
var gbList = document.getElementById("gbList");
var gbEmpty = document.getElementById("gbEmpty");
var gbTotal = document.getElementById("gbTotal");
var gbMessage = document.getElementById("gbMessage");
var gbCount = document.getElementById("gbCount");

/* 처음 방문했을 때 한 번 심어 두는 예시 글 4개.
   사용자가 전부 지우면(빈 배열이 되면) 다시 심지 않는다. */
var SEED_ENTRIES = [
  { name: "수현", date: "2026-07-22",
    message: "반가워요~ 다음에 또 들릴게요!" },
  { name: "민준", date: "2026-07-19",
    message: "방콕 사진 대박. 왓아룬 보이는 식당 저도 가고 싶어요" },
  { name: "지우", date: "2026-07-17",
    message: "독서 기록 보다가 넥서스가 인상적이었어요!" },
  { name: "태호", date: "2026-07-15",
    message: "잘 보고 갑니다 👏" }
];

/** localStorage가 비어 있으면(한 번도 저장된 적 없으면) 예시 글을 심는다. */
function seedIfEmpty() {
  if (localStorage.getItem(GUESTBOOK_KEY) !== null) { return; }

  var seeded = [];
  for (var i = 0; i < SEED_ENTRIES.length; i++) {
    var e = SEED_ENTRIES[i];
    var t = new Date(e.date + "T12:00:00").getTime();
    seeded.push({
      id: "seed-" + t,
      userId: "guest-" + i,
      name: e.name,
      message: e.message,
      time: t
    });
  }
  localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(seeded));
}

/**
 * 저장된 방명록을 배열로 읽는다.
 * @returns {Array<Object>}
 */
function loadEntries() {
  try {
    var raw = localStorage.getItem(GUESTBOOK_KEY);
    var parsed = raw ? JSON.parse(raw) : [];

    // 배열이 아닌 값이 저장돼 있어도 화면이 깨지지 않게 방어한다
    if (!Array.isArray(parsed)) { return []; }

    // 항상 최신 글이 앞에 오도록 정렬을 보장한다
    parsed.sort(function (a, b) { return (b.time || 0) - (a.time || 0); });
    return parsed;
  } catch (error) {
    console.error("방명록을 읽지 못했습니다.", error);
    return [];
  }
}

/** 방명록을 저장한다. */
function saveEntries(entries) {
  localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(entries));
}

/* escapeHtml은 auth.js(먼저 로드됨)의 공용 함수를 그대로 쓴다 */

/** 타임스탬프를 보기 좋은 문자열로 바꾼다. */
function formatTime(stamp) {
  var d = new Date(stamp);
  return d.getFullYear() + "." +
         String(d.getMonth() + 1).padStart(2, "0") + "." +
         String(d.getDate()).padStart(2, "0") + " " +
         String(d.getHours()).padStart(2, "0") + ":" +
         String(d.getMinutes()).padStart(2, "0");
}

/** 목록을 다시 그린다. */
function renderEntries() {
  var entries = loadEntries();
  var user = getSession();
  var html = "";

  gbTotal.textContent = entries.length;
  gbEmpty.hidden = entries.length > 0;

  // 최근 글부터, 최대 MAX_VISIBLE개까지만 그린다
  var visible = entries.slice(0, MAX_VISIBLE);

  for (var i = 0; i < visible.length; i++) {
    var item = visible[i];
    var canDelete = user && (user.isAdmin || user.id === item.userId);

    html += '<li class="gb-item">' +
      '<div class="gb-item__head">' +
        '<span class="gb-item__name">' + escapeHtml(item.name) + '</span>' +
        (item.userId === "inwoo"
          ? '<span class="gb-item__badge">주인장</span>' : "") +
        '<span class="gb-item__time">' + formatTime(item.time) + '</span>' +
      '</div>' +
      '<p class="gb-item__msg">' + escapeHtml(item.message) + '</p>' +
      (canDelete
        ? '<button type="button" class="gb-item__del" data-id="' + item.id + '">삭제</button>'
        : "") +
      '</li>';
  }

  gbList.innerHTML = html;

  // 상한을 넘겼을 때 안내
  var more = document.getElementById("gbMore");
  if (more) {
    if (entries.length > MAX_VISIBLE) {
      more.hidden = false;
      more.textContent =
        "최근 " + MAX_VISIBLE + "개를 보여드리고 있어요. (전체 " + entries.length + "개)";
    } else {
      more.hidden = true;
    }
  }
}

/* ==========================================================
   홈 미리보기 — 최근 2개만.
   글 개수와 상관없이 홈 높이는 항상 일정하다.
   실제 글이 없으면 예시 두 개(HTML에 적힌 것)를 그대로 둔다.
   ========================================================== */
function renderHomePreview() {
  var box = document.getElementById("gbPreview");
  if (!box) { return; }

  var entries = loadEntries();
  var limit = Number(box.dataset.preview) || 2;

  // 실제 글이 없으면 HTML의 예시를 유지한다
  if (entries.length === 0) { return; }

  var recent = entries.slice(0, limit);
  var html = "";

  for (var i = 0; i < recent.length; i++) {
    var item = recent[i];
    html +=
      '<li>' +
        '<p class="gb-preview__msg">' + escapeHtml(item.message) + '</p>' +
        '<p class="gb-preview__meta">' +
          '<span class="gb-preview__name">' + escapeHtml(item.name) + '</span>' +
          '<span class="gb-preview__time">' + formatTime(item.time) + '</span>' +
        '</p>' +
      '</li>';
  }

  box.innerHTML = html;

  // 나머지는 더보기로
  var more = document.getElementById("gbPreviewMore");
  if (more) {
    var rest = entries.length - recent.length;
    if (rest > 0) {
      more.hidden = false;
      more.textContent = "그 외 " + rest + "개 더 보기 →";
    } else {
      more.hidden = true;
    }
  }
}

/** 로그인 여부에 따라 작성 영역을 전환한다. */
function renderWriteArea() {
  var user = getSession();

  if (user) {
    gbLocked.hidden = true;
    gbWrite.hidden = false;
    document.getElementById("gbName").value = user.name;
  } else {
    gbLocked.hidden = false;
    gbWrite.hidden = true;
  }
}

/** 글 작성 */
function handleSubmit(event) {
  event.preventDefault();

  var user = getSession();
  if (!user) {
    alert("로그인이 필요합니다.");
    return;
  }

  var message = gbMessage.value.trim();

  if (message === "") {
    alert("메시지를 입력해 주세요.");
    return;
  }

  var entries = loadEntries();

  entries.unshift({
    id: String(new Date().getTime()),
    userId: user.id,
    name: user.name,
    message: message,
    time: new Date().getTime()
  });

  saveEntries(entries);
  gbForm.reset();
  gbCount.textContent = "0 / 200";
  renderEntries();
}

/** 글 삭제 */
function handleDelete(event) {
  var btn = event.target.closest(".gb-item__del");
  if (!btn) { return; }

  if (!confirm("이 글을 삭제할까요?")) { return; }

  var id = btn.dataset.id;
  var entries = loadEntries().filter(function (item) {
    return item.id !== id;
  });

  saveEntries(entries);
  renderEntries();
}

// 렌더링 전에 예시 글을 먼저 심는다 (홈·방명록 페이지 공통)
seedIfEmpty();

if (gbList) {
  renderWriteArea();
  renderEntries();

  gbForm.addEventListener("submit", handleSubmit);
  gbList.addEventListener("click", handleDelete);

  gbMessage.addEventListener("input", function () {
    gbCount.textContent = gbMessage.value.length + " / 200";
  });
}

// 홈에서는 미리보기만 그린다
renderHomePreview();
