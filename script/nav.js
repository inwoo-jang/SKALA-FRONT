/* ==========================================================
   script/nav.js — 모바일 햄버거 메뉴
   ========================================================== */

var navToggle = document.getElementById("navToggle");
var siteNav = document.getElementById("siteNav");

function closeNav() {
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "메뉴 열기");
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", function () {
    var open = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  });

  // 메뉴에서 링크를 고르면 닫는다
  siteNav.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      closeNav();
    }
  });

  // 화면이 다시 넓어지면 열림 상태를 정리한다
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768) {
      closeNav();
    }
  });
}
