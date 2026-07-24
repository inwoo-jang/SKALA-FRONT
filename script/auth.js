/* ==========================================================
   script/auth.js — 추가 실습
   로그인 세션을 localStorage에 저장하고,
   모든 페이지의 헤더 우측 영역을 로그인 상태에 맞게 바꾼다.
   ※ 서버 없이 동작하는 데모 구현이다. 비밀번호는 저장하지 않는다.
   ========================================================== */

var SESSION_KEY = "inwoolog_session";
var ADMIN_ID = "inwoo";

/** HTML 특수문자를 막아 스크립트 삽입(XSS)을 방지한다.
    auth.js는 모든 페이지에서 가장 먼저 로드되므로 공용으로 쓴다. */
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * 현재 로그인한 사용자를 반환한다.
 * @returns {{id: string, name: string}|null}
 */
function getSession() {
  try {
    var raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("세션을 읽지 못했습니다.", error);
    return null;
  }
}

/** 로그인 처리 */
function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

/** 로그아웃 처리 */
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/** 헤더 우측 영역을 로그인 상태에 맞게 그린다. */
function renderAuthArea() {
  var area = document.getElementById("authArea");
  if (!area) { return; }

  var user = getSession();

  if (!user) {
    area.innerHTML =
      '<a href="login.html" class="btn btn--ghost">로그인</a>' +
      '<a href="signUp.html" class="btn btn--primary">회원가입</a>';
    return;
  }

  var initial = user.name ? user.name.charAt(0) : "?";

  area.innerHTML =
    '<span class="topbar__user">' +
      '<span class="topbar__avatar" aria-hidden="true">' + escapeHtml(initial) + '</span>' +
      escapeHtml(user.name) + '님' +
    '</span>' +
    '<button type="button" class="btn btn--mini" id="logoutBtn">로그아웃</button>';

  var logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", function () {
    clearSession();
    location.reload();
  });
}

/** 로그인 폼 처리 (login.html에서만 동작) */
function initLoginForm() {
  var form = document.getElementById("loginForm");
  if (!form) { return; }

  var msg = document.getElementById("loginMsg");
  var idInput = document.getElementById("loginId");
  var rememberId = document.getElementById("rememberId");

  // 저장해 둔 아이디가 있으면 미리 채워 준다
  var savedId = localStorage.getItem("inwoolog_saved_id");
  if (savedId && rememberId) {
    idInput.value = savedId;
    rememberId.checked = true;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var id = idInput.value.trim();
    var pw = document.getElementById("loginPw").value;

    if (rememberId && rememberId.checked) {
      localStorage.setItem("inwoolog_saved_id", id);
    } else {
      localStorage.removeItem("inwoolog_saved_id");
    }

    if (id.length < 3) {
      msg.textContent = "아이디는 3자 이상이어야 합니다.";
      return;
    }

    if (pw.length < 4) {
      msg.textContent = "비밀번호는 4자 이상이어야 합니다.";
      return;
    }

    setSession({ id: id, name: id, isAdmin: id === ADMIN_ID });

    msg.classList.add("field__msg--ok");
    msg.textContent = "로그인되었습니다. 잠시 후 이동합니다.";

    setTimeout(function () {
      location.href = "guestbook.html";
    }, 600);
  });
}

renderAuthArea();
initLoginForm();
