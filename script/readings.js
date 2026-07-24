/* ==========================================================
   script/readings.js — 추가 실습
   책장에서 책등을 누르면 그 책의 기록이 펼쳐진다.
   내용은 HTML에 모두 적혀 있고 여기서는 표시만 제어한다.
   ========================================================== */

var shelf = document.querySelector(".shelf");
var spines = document.querySelectorAll(".book__spine");
var openBooks = document.querySelectorAll(".book-open");
var bookEmpty = document.getElementById("bookEmpty");

/**
 * 지정한 책을 펼치고 나머지는 닫는다.
 * @param {string} id 펼칠 기록의 id
 */
function openBook(id) {
  for (var i = 0; i < openBooks.length; i++) {
    openBooks[i].hidden = (openBooks[i].id !== id);
  }

  for (var j = 0; j < spines.length; j++) {
    var on = (spines[j].dataset.book === id);
    spines[j].closest(".book").classList.toggle("is-pulled", on);
    spines[j].setAttribute("aria-expanded", on ? "true" : "false");
  }

  bookEmpty.hidden = true;
}

if (shelf) {
  shelf.addEventListener("click", function (event) {
    // 드래그로 넘긴 직후의 클릭은 책을 펼치지 않는다
    if (shelfDragMoved) { return; }

    var spine = event.target.closest(".book__spine");
    if (spine) {
      openBook(spine.dataset.book);
    }
  });
}

/* ----------------------------------------------------------
   책이 많아 넘칠 때 — 좌우 가장자리에 마우스를 올리면
   스크롤바 없이 스르륵 자동으로 넘어간다.
   ---------------------------------------------------------- */
var shelfRow = document.querySelector(".shelf__row");

if (shelfRow) {
  var EDGE_ZONE = 90;   // 가장자리 감지 폭(px)
  var MAX_SPEED = 9;    // 프레임당 최대 이동량(px)
  var shelfSpeed = 0;
  var shelfRafId = null;

  function shelfScrollStep() {
    if (shelfSpeed !== 0) {
      // 흐르듯 움직이도록 자동 스크롤 중에는 스냅을 잠시 끈다
      shelfRow.style.scrollSnapType = "none";
      shelfRow.scrollLeft += shelfSpeed;
      shelfRafId = requestAnimationFrame(shelfScrollStep);
    } else {
      shelfRow.style.scrollSnapType = "";
      shelfRafId = null;
    }
  }

  shelfRow.addEventListener("mousemove", function (event) {
    // 넘칠 게 없거나 드래그 중이면 아무것도 하지 않는다
    if (shelfRow.scrollWidth <= shelfRow.clientWidth || shelfDragging) { return; }

    var rect = shelfRow.getBoundingClientRect();
    var x = event.clientX - rect.left;

    if (x < EDGE_ZONE) {
      // 가장자리에 가까울수록 빨라진다
      shelfSpeed = -((EDGE_ZONE - x) / EDGE_ZONE) * MAX_SPEED;
    } else if (x > rect.width - EDGE_ZONE) {
      shelfSpeed = ((x - (rect.width - EDGE_ZONE)) / EDGE_ZONE) * MAX_SPEED;
    } else {
      shelfSpeed = 0;
    }

    if (shelfSpeed !== 0 && shelfRafId === null) {
      shelfRafId = requestAnimationFrame(shelfScrollStep);
    }
  });

  shelfRow.addEventListener("mouseleave", function () {
    shelfSpeed = 0;
  });
}

/* ----------------------------------------------------------
   마우스 드래그로도 책장을 넘긴다.
   (터치 드래그는 브라우저 기본 가로 스크롤로 이미 동작한다)
   ---------------------------------------------------------- */
var shelfDragging = false;
var shelfDragMoved = false;
var shelfDragStartX = 0;
var shelfDragStartScroll = 0;

if (shelfRow) {
  shelfRow.addEventListener("mousedown", function (event) {
    shelfDragging = true;
    shelfDragMoved = false;
    shelfDragStartX = event.clientX;
    shelfDragStartScroll = shelfRow.scrollLeft;
    shelfSpeed = 0; // 드래그 중엔 가장자리 자동 스크롤을 멈춘다
  });

  document.addEventListener("mousemove", function (event) {
    if (!shelfDragging) { return; }

    var delta = event.clientX - shelfDragStartX;

    // 몇 px 이상 움직였을 때만 드래그로 판정한다 (클릭과 구분)
    if (Math.abs(delta) > 5) {
      shelfDragMoved = true;
      shelfRow.classList.add("is-dragging");
    }

    shelfRow.scrollLeft = shelfDragStartScroll - delta;
  });

  document.addEventListener("mouseup", function () {
    if (!shelfDragging) { return; }

    shelfDragging = false;
    shelfRow.classList.remove("is-dragging");

    // click 이벤트가 처리된 다음에 드래그 판정을 푼다
    setTimeout(function () { shelfDragMoved = false; }, 0);
  });
}
