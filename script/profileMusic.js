/* ==========================================================
   script/profileMusic.js — 프로필 좋아하는 음악 커버플로우
   가운데 카드는 크게, 양옆은 비스듬히(3D) 물러난다.
   좌우 화살표·옆 카드 클릭·키보드로 넘기면 부드럽게 슬라이딩된다.
   ========================================================== */

var coverflow = document.getElementById("coverflow");

if (coverflow) {
  var cfItems = coverflow.querySelectorAll(".coverflow__item");
  var cfPrev = document.getElementById("coverflowPrev");
  var cfNext = document.getElementById("coverflowNext");
  var cfCount = document.getElementById("coverflowCount");
  var cfLen = cfItems.length;
  var cfIndex = 0;

  /** 현재 위치를 기준으로 각 카드에 자리(가운데/좌/우/숨김)를 배정한다 */
  function renderCoverflow() {
    for (var i = 0; i < cfLen; i++) {
      var offset = (i - cfIndex + cfLen) % cfLen;   // 0 = 가운데

      var role;
      if (offset === 0) { role = "is-center"; }
      else if (offset === 1) { role = "is-right"; }
      else if (offset === cfLen - 1) { role = "is-left"; }
      else { role = "is-hidden"; }

      cfItems[i].className = "coverflow__item " + role;
      cfItems[i].setAttribute("aria-hidden", offset === 0 ? "false" : "true");
    }

    if (cfCount) {
      cfCount.textContent = (cfIndex + 1) + " / " + cfLen;
    }
  }

  /** dir: -1 이전, +1 다음 — 끝에서 처음으로 순환한다 */
  function moveCoverflow(dir) {
    cfIndex = (cfIndex + dir + cfLen) % cfLen;
    renderCoverflow();
  }

  cfPrev.addEventListener("click", function () { moveCoverflow(-1); });
  cfNext.addEventListener("click", function () { moveCoverflow(1); });

  /* 양옆 카드를 누르면 그쪽으로 넘어간다 (링크 이동은 막는다).
     가운데 카드는 그대로 두어 클릭 시 유튜브로 이동한다. */
  for (var j = 0; j < cfLen; j++) {
    (function (item) {
      item.addEventListener("click", function (event) {
        if (item.classList.contains("is-left")) { event.preventDefault(); moveCoverflow(-1); }
        else if (item.classList.contains("is-right")) { event.preventDefault(); moveCoverflow(1); }
      });
    })(cfItems[j]);
  }

  /* 커버플로우에 포커스가 있을 때 좌우 화살표 키로도 넘긴다 */
  coverflow.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") { event.preventDefault(); moveCoverflow(-1); }
    else if (event.key === "ArrowRight") { event.preventDefault(); moveCoverflow(1); }
  });

  /* 좌우 가장자리에 마우스를 두면 자동으로 슬라이드가 넘어간다 (책꽂이처럼) */
  var edgeTimer = null;
  var edgeDir = 0;

  function stopEdge() {
    if (edgeTimer) { clearInterval(edgeTimer); edgeTimer = null; }
    edgeDir = 0;
  }

  coverflow.addEventListener("mousemove", function (event) {
    var rect = coverflow.getBoundingClientRect();
    var edge = 72;   // 가장자리 감지 폭
    var dir = 0;
    if (event.clientX < rect.left + edge) { dir = -1; }
    else if (event.clientX > rect.right - edge) { dir = 1; }

    if (dir === edgeDir) { return; }   // 같은 방향으로 이미 돌고 있으면 유지
    stopEdge();
    if (dir !== 0) {
      edgeDir = dir;
      moveCoverflow(dir);   // 바로 한 장 넘기고
      edgeTimer = setInterval(function () { moveCoverflow(dir); }, 950);   // 이후 천천히 반복
    }
  });

  coverflow.addEventListener("mouseleave", stopEdge);

  /* 첫 hover 때 한 번만 뜨는 코치마크 — "클릭하면 유튜브로" */
  var cfHint = document.createElement("div");
  cfHint.className = "coverflow__hint";
  cfHint.textContent = "🔗 클릭하면 유튜브로 열려요";
  coverflow.appendChild(cfHint);

  var CF_HINT_KEY = "inwoolog_coverflow_hint";
  var cfHintDone = false;
  try { cfHintDone = localStorage.getItem(CF_HINT_KEY) === "1"; } catch (e) { cfHintDone = false; }

  coverflow.addEventListener("mouseenter", function () {
    if (cfHintDone) { return; }
    cfHintDone = true;
    try { localStorage.setItem(CF_HINT_KEY, "1"); } catch (e) { /* 무시 */ }
    cfHint.classList.add("is-show");
    setTimeout(function () { cfHint.classList.remove("is-show"); }, 1800);
  });

  renderCoverflow();
}
