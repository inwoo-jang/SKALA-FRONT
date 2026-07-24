/* ==========================================================
   script/portfolio.js — 추가 실습
   연습장 넘기기. 내용은 HTML에 모두 적혀 있고,
   이 파일은 어떤 장을 보여줄지와 넘기는 방향만 정한다.

   스프링이 왼쪽에 있으므로 종이는 왼쪽으로 젖혀진다.
   - 다음 장 : 지금 장이 왼쪽으로 넘어가면서 아래 장이 드러남
   - 이전 장 : 넘어갔던 장이 오른쪽으로 되돌아옴
   ========================================================== */

var notebooks = document.querySelectorAll("[data-note]");

/**
 * 연습장 하나를 동작하게 만든다.
 * @param {HTMLElement} note
 */
function initNotebook(note) {
  var pages = note.querySelectorAll(".note__page");
  var countEl = note.querySelector(".note__count");
  var body = note.querySelector(".note__body");
  var backEl = note.querySelector("[data-back]");
  var current = 0;
  var busy = false;

  /** 넘기는 중에 붙은 클래스를 떼고 원래 자리로 돌린다. */
  function cleanUp(page) {
    page.classList.remove("is-flipping-out", "is-flipping-in");
    page.hidden = true;
  }

  /**
   * 지정한 장을 펼친다.
   * @param {number} index
   * @param {string} direction "next" | "prev"
   */
  function openPage(index, direction) {
    if (busy || index < 0 || index >= pages.length || index === current) {
      return;
    }

    var from = pages[current];
    var to = pages[index];

    busy = true;
    current = index;

    to.hidden = false;
    to.classList.remove("is-flipping-out", "is-flipping-in");

    if (direction === "next") {
      // 지금 장이 왼쪽으로 넘어간다. 아래에서 다음 장이 드러난다.
      from.classList.add("is-flipping-out");
    } else {
      // 넘어가 있던 장이 오른쪽으로 되돌아온다.
      from.hidden = true;
      to.classList.add("is-flipping-in");
    }

    var moving = (direction === "next") ? from : to;

    var done = function () {
      moving.removeEventListener("animationend", done);
      if (direction === "next") {
        cleanUp(from);
      } else {
        to.classList.remove("is-flipping-in");
      }
      busy = false;
    };

    moving.addEventListener("animationend", done);

    // 모션 최소화 설정에서는 애니메이션이 사실상 없으므로 바로 정리한다.
    setTimeout(function () {
      if (busy) { done(); }
    }, 700);

    countEl.textContent = (index === 0)
      ? ""
      : index + " / " + (pages.length - 1);

    // 표지에서는 "목록으로"를 감춘다
    backEl.hidden = (index === 0);
  }

  // 목차 클릭 · 목록으로 돌아가기
  note.addEventListener("click", function (event) {
    var tocBtn = event.target.closest(".toc__btn");
    if (tocBtn) {
      openPage(Number(tocBtn.dataset.goto), "next");
      return;
    }

    if (event.target.closest("[data-back]")) {
      openPage(0, "prev");
    }
  });

  /* ----------------------------------------------------------
     종이 자체가 버튼 — 오른쪽 절반을 누르면 다음 장,
     왼쪽 절반을 누르면 이전 장. 커서도 방향 손가락으로 바뀐다.
     ---------------------------------------------------------- */

  /** 마우스 위치가 종이의 오른쪽 절반인가 */
  function isRightHalf(event) {
    var rect = body.getBoundingClientRect();
    return (event.clientX - rect.left) > rect.width / 2;
  }

  body.addEventListener("click", function (event) {
    // 목차 버튼·링크 클릭은 각자 동작에 맡긴다
    if (event.target.closest("button, a")) { return; }

    if (isRightHalf(event)) {
      openPage(current + 1, "next");
    } else {
      openPage(current - 1, "prev");
    }
  });

  // 넘길 수 있는 방향일 때만 손가락 커서를 보여준다
  body.addEventListener("mousemove", function (event) {
    var overControl = !!event.target.closest("button, a");
    var right = isRightHalf(event);

    body.classList.toggle("zone-next",
      !overControl && right && current < pages.length - 1);
    body.classList.toggle("zone-prev",
      !overControl && !right && current > 0);
  });

  body.addEventListener("mouseleave", function () {
    body.classList.remove("zone-next", "zone-prev");
  });

  // 방향키로 넘기기
  note.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
      openPage(current + 1, "next");
    } else if (event.key === "ArrowLeft") {
      openPage(current - 1, "prev");
    }
  });

  // 첫 화면 정리
  for (var i = 1; i < pages.length; i++) {
    pages[i].hidden = true;
  }
  pages[0].hidden = false;
  countEl.textContent = "";
  backEl.hidden = true;

  // 버튼이 없어도 키보드(← →)로 넘길 수 있게 초점을 받을 수 있게 한다
  note.setAttribute("tabindex", "0");
}

for (var n = 0; n < notebooks.length; n++) {
  initNotebook(notebooks[n]);
}
