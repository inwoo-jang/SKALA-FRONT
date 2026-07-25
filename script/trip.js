/* ==========================================================
   script/trip.js — 추가 실습
   여행일지의 지역 전환 토글. 해외 / 국내에 따라
   지도와 사진 피드를 바꿔서 보여준다.
   내용은 HTML에 모두 적혀 있고 여기서는 표시만 제어한다.
   ========================================================== */

/** 뷰어 지역 표기는 국기 아이콘(HTML)을 쓰므로 innerHTML로 그린다.
    그룹 제목이 HTML로 새지 않도록 특수문자를 이스케이프한다. */
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

var switchBox = document.querySelector(".switch");
var regionBtns = document.querySelectorAll(".switch__btn");

var mapAbroad = document.getElementById("mapAbroad");
var mapDomestic = document.getElementById("mapDomestic");
var feedAbroad = document.getElementById("feedAbroad");
var feedDomestic = document.getElementById("feedDomestic");
var countAbroad = document.getElementById("countAbroad");
var countDomestic = document.getElementById("countDomestic");

/**
 * 화면에 적힌 날짜를 정렬용 숫자로 바꾼다.
 * "2025.09.27"과 "24.04.01" 표기를 모두 처리한다.
 * @param {string} text
 * @returns {number}
 */
function getDateValue(text) {
  var parts = text.trim().split(".");
  if (parts.length !== 3) { return 0; }

  var year = Number(parts[0]);
  if (year < 100) { year += 2000; }

  return new Date(year, Number(parts[1]) - 1, Number(parts[2])).getTime();
}

/** 각 여행지 안의 게시물을 최신 날짜순으로 정렬한다. */
function sortTripPosts() {
  var feeds = document.querySelectorAll(".feed-group > .feed");

  for (var i = 0; i < feeds.length; i++) {
    var items = Array.prototype.slice.call(feeds[i].children);

    items.sort(function (a, b) {
      var aDate = a.querySelector(".feed__date");
      var bDate = b.querySelector(".feed__date");
      var aValue = aDate ? getDateValue(aDate.textContent) : 0;
      var bValue = bDate ? getDateValue(bDate.textContent) : 0;
      return bValue - aValue;
    });

    for (var j = 0; j < items.length; j++) {
      feeds[i].appendChild(items[j]);
    }
  }
}

sortTripPosts();

/* ----------------------------------------------------------
   사진·영상 개수 자동 집계
   게시물을 추가·삭제해도 사이드 통계와 지도 핀 숫자가
   저절로 맞도록 DOM에서 직접 센다.
   ---------------------------------------------------------- */

/** 주어진 영역 안의 사진·영상 개수를 센다. */
function countMedia(root) {
  return {
    photos: root.querySelectorAll(".feed__open img").length,
    videos: root.querySelectorAll("video").length
  };
}

function renderTripCounts() {
  if (!feedAbroad || !feedDomestic || !countAbroad || !countDomestic) { return; }

  var abroad = countMedia(feedAbroad);
  var domestic = countMedia(feedDomestic);
  var countries = feedAbroad.querySelectorAll(".feed-group").length;
  var cities = feedDomestic.querySelectorAll(".feed-group").length;

  countAbroad.innerHTML =
    "나라 <b>" + countries + "</b> · 사진 <b>" + abroad.photos + "</b> · 영상 <b>" + abroad.videos + "</b>";
  countDomestic.innerHTML =
    "도시 <b>" + cities + "</b> · 사진 <b>" + domestic.photos + "</b> · 영상 <b>" + domestic.videos + "</b>";

  // 지도 핀 카드 숫자도 연결된 게시물에서 직접 센다 (기록 없으면 "준비 중" 유지)
  var pins = document.querySelectorAll(".map__pin");

  for (var i = 0; i < pins.length; i++) {
    var group = document.querySelector(pins[i].getAttribute("href"));
    var countEl = pins[i].querySelector(".map__pin-count");
    if (!group || !countEl) { continue; }

    var media = countMedia(group);
    if (media.photos === 0 && media.videos === 0) { continue; }

    countEl.textContent =
      "📷 " + media.photos + (media.videos ? " · 🎬 " + media.videos : "");
  }
}

/** 애니메이션을 처음부터 다시 재생시킨다. */
function restartAnimation(element) {
  element.classList.remove("is-entering");
  // 리플로우를 일으켜 클래스 재적용이 애니메이션으로 인식되게 한다.
  void element.offsetWidth;
  element.classList.add("is-entering");
}

/**
 * 선택한 지역만 보여준다.
 * @param {string} region "abroad" | "domestic"
 */
function showRegion(region) {
  var isAbroad = (region === "abroad");

  mapAbroad.hidden = !isAbroad;
  feedAbroad.hidden = !isAbroad;
  countAbroad.hidden = !isAbroad;
  mapDomestic.hidden = isAbroad;
  feedDomestic.hidden = isAbroad;
  countDomestic.hidden = isAbroad;

  // 숨겨지는 쪽에서 재생 중이던 영상은 멈춘다 — 안 보이는데 소리만 나거나
  // BGM과 겹치는 걸 막는다 (영상이 멈추면 BGM이 자연스럽게 이어진다)
  var hiddenFeed = isAbroad ? feedDomestic : feedAbroad;
  var hiddenVideos = hiddenFeed.querySelectorAll("video");
  for (var v = 0; v < hiddenVideos.length; v++) {
    if (!hiddenVideos[v].paused) { hiddenVideos[v].pause(); }
  }

  // 토글 버튼 상태와 미끄러지는 배경 위치
  for (var i = 0; i < regionBtns.length; i++) {
    var on = (regionBtns[i].dataset.region === region);
    regionBtns[i].classList.toggle("is-active", on);
    regionBtns[i].setAttribute("aria-selected", on ? "true" : "false");
  }

  switchBox.dataset.region = region;

  restartAnimation(isAbroad ? mapAbroad : mapDomestic);
  restartAnimation(isAbroad ? feedAbroad : feedDomestic);

  // 지역이 바뀌면 크게 보기는 닫는다
  if (typeof closeViewer === "function" && viewer && !viewer.hidden) {
    closeViewer();
  }
}

if (switchBox) {
  switchBox.addEventListener("click", function (event) {
    var btn = event.target.closest(".switch__btn");
    if (btn) {
      showRegion(btn.dataset.region);
    }
  });

  // ← → 방향키로도 전환
  switchBox.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      showRegion("abroad");
      document.getElementById("btnAbroad").focus();
    } else if (event.key === "ArrowRight") {
      showRegion("domestic");
      document.getElementById("btnDomestic").focus();
    }
  });

  renderTripCounts();
  showRegion("abroad");

  /* 홈 슬라이더 등에서 #tripBusan 같은 앵커로 들어오면
     그 게시물이 속한 지역(해외/국내)으로 전환하고 위치로 이동한다 */
  if (location.hash) {
    var anchorTarget = document.getElementById(location.hash.slice(1));

    if (anchorTarget) {
      var inDomestic = !!anchorTarget.closest("#feedDomestic");
      showRegion(inDomestic ? "domestic" : "abroad");
      anchorTarget.scrollIntoView();
    }
  }
}

/* ==========================================================
   사진 크게 보기 — 한 번에 한 장씩
   목록에서 사진을 누르면 뷰어로 바뀌고,
   이전 / 다음 / 목록으로 돌아갈 수 있다.
   ========================================================== */

var viewer = document.getElementById("viewer");
var viewerImg = document.getElementById("viewerImg");
var viewerRegion = document.getElementById("viewerRegion");
var viewerPlace = document.getElementById("viewerPlace");
var viewerSub = document.getElementById("viewerSub");
var viewerDate = document.getElementById("viewerDate");
var viewerCount = document.getElementById("viewerCount");
var viewerPrev = document.getElementById("viewerPrev");
var viewerNext = document.getElementById("viewerNext");
var viewerClose = document.getElementById("viewerClose");

var photos = [];      // 지금 보고 있는 지역의 사진 목록
var current = 0;
var lastOpener = null;

/** 현재 지역에서 확대 가능한 사진을 모은다. */
function collectPhotos() {
  var isAbroad = feedAbroad.hidden === false;
  var section = isAbroad ? feedAbroad : feedDomestic;
  photos = [];

  var items = section.querySelectorAll(".feed__item");

  for (var i = 0; i < items.length; i++) {
    var img = items[i].querySelector(".feed__open img");
    if (!img) { continue; }   // 영상 카드는 건너뛴다

    // 사진이 속한 그룹(나라·도시) 제목 — 예: "태국·방콕", "경남·부산"
    var group = items[i].closest(".feed-group");
    var groupTitle = group
      ? group.querySelector(".feed-group__title").textContent.trim()
      : "";

    photos.push({
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt"),
      region: (isAbroad
                 ? '<span class="flag flag--world" role="img" aria-label="해외"></span> 해외'
                 : '<span class="flag flag--kr" role="img" aria-label="대한민국"></span> 국내')
              + (groupTitle ? " · " + escapeHtml(groupTitle) : ""),
      place: items[i].querySelector(".feed__place").textContent.trim(),
      sub: items[i].querySelector(".feed__sub").textContent.trim(),
      date: items[i].querySelector(".feed__date").textContent.trim(),
      button: items[i].querySelector(".feed__open")
    });
  }
}

/**
 * 지정한 순번의 사진을 뷰어에 그린다.
 * @param {number} index
 */
function showPhoto(index) {
  if (photos.length === 0) { return; }

  if (index < 0) { index = photos.length - 1; }
  if (index >= photos.length) { index = 0; }

  var item = photos[index];
  current = index;

  viewerImg.setAttribute("src", item.src);
  viewerImg.setAttribute("alt", item.alt);
  viewerRegion.innerHTML = item.region;
  viewerPlace.textContent = item.place;
  viewerSub.textContent = item.sub;
  viewerDate.textContent = item.date;
  viewerCount.textContent = (index + 1) + " / " + photos.length;
}

/* 뒤로가기로 뷰어를 닫기 위해 히스토리 항목을 쌓았는지 */
var viewerPushed = false;

/** 뷰어 열기 */
function openViewer(index) {
  collectPhotos();
  showPhoto(index);

  feedAbroad.classList.add("is-hushed");
  feedDomestic.classList.add("is-hushed");
  viewer.hidden = false;
  viewerClose.focus();

  // 브라우저 뒤로가기로 뷰어를 닫을 수 있게 히스토리 항목을 하나 쌓는다
  if (!viewerPushed) {
    viewerPushed = true;
    history.pushState({ tripViewer: true }, "");
  }
}

/** 목록으로 돌아가기. fromPopstate=true면 이미 뒤로가기로 pop된 상태. */
function closeViewer(fromPopstate) {
  if (viewer.hidden) { return; }

  viewer.hidden = true;
  feedAbroad.classList.remove("is-hushed");
  feedDomestic.classList.remove("is-hushed");

  if (lastOpener) { lastOpener.focus(); }

  // 버튼·Esc로 닫으면 쌓아둔 히스토리 항목을 되돌려 URL을 깔끔히 유지한다
  if (viewerPushed && !fromPopstate) {
    viewerPushed = false;
    history.back();
  } else {
    viewerPushed = false;
  }
}

if (viewer) {
  // 사진 클릭
  document.addEventListener("click", function (event) {
    var btn = event.target.closest(".feed__open");
    if (!btn) { return; }

    lastOpener = btn;
    collectPhotos();

    for (var i = 0; i < photos.length; i++) {
      if (photos[i].button === btn) {
        openViewer(i);
        return;
      }
    }
  });

  viewerPrev.addEventListener("click", function () { showPhoto(current - 1); });
  viewerNext.addEventListener("click", function () { showPhoto(current + 1); });
  viewerClose.addEventListener("click", closeViewer);

  // 사진 자체를 눌러도 넘어간다 — 왼쪽 절반은 앞쪽, 오른쪽 절반은 뒤쪽
  viewerImg.addEventListener("click", function (event) {
    var rect = viewerImg.getBoundingClientRect();
    if (event.clientX - rect.left > rect.width / 2) { showPhoto(current + 1); }
    else { showPhoto(current - 1); }
  });

  // 키보드 ← → Esc
  document.addEventListener("keydown", function (event) {
    if (viewer.hidden) { return; }

    if (event.key === "ArrowLeft")  { showPhoto(current - 1); }
    if (event.key === "ArrowRight") { showPhoto(current + 1); }
    if (event.key === "Escape")     { closeViewer(); }
  });

  // 브라우저 뒤로가기 → 뷰어가 열려 있으면 목록으로 닫는다
  window.addEventListener("popstate", function () {
    if (!viewer.hidden) { closeViewer(true); }
  });
}
