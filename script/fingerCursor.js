/* ==========================================================
   script/fingerCursor.js — 커스텀 손가락 커서 + 반짝이
   [data-finger-zone] 영역(홈 Recent trip · 프로필 앨범)에서만 동작한다.
   마우스를 따라 손가락이 움직이고, 클릭 대상 위에선 통통 튄다.
   마우스가 움직이면 중심에서 작은 반짝이가 가볍게 흩어진다.
   ========================================================== */

(function () {
  // 마우스가 없는 기기(터치)에서는 건너뛴다
  if (!window.matchMedia || !window.matchMedia("(hover: hover)").matches) { return; }

  // [data-finger-zone] 영역 + 여행 사진 버튼(.feed__open)에 적용 (영상은 제외)
  var zones = document.querySelectorAll("[data-finger-zone], .feed__open");
  if (!zones.length) { return; }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var finger = document.createElement("div");
  finger.className = "finger-cursor";
  finger.innerHTML = '<span class="finger-cursor__emoji" aria-hidden="true">👆</span>';
  document.body.appendChild(finger);

  var lastX = 0;
  var lastY = 0;

  /** 커서 위치에서 작은 반짝이 하나를 만들어 살짝 흩어지게 한다 */
  function spawnSparkle(x, y) {
    if (reduceMotion) { return; }

    var s = document.createElement("span");
    s.className = "sparkle";
    s.style.left = x + "px";
    s.style.top = y + "px";

    // 중심에서 좌우로 조금, 위로 살짝 떠오르며 사라진다
    var dx = (Math.random() * 2 - 1) * 16;
    var dy = -(5 + Math.random() * 13);
    var size = (3 + Math.random() * 5);   // 3~8px — 자잘하게
    s.style.setProperty("--dx", dx.toFixed(1) + "px");
    s.style.setProperty("--dy", dy.toFixed(1) + "px");
    s.style.setProperty("--size", size.toFixed(1) + "px");

    document.body.appendChild(s);
    setTimeout(function () { s.remove(); }, 750);
  }

  function onMove(event) {
    finger.style.left = event.clientX + "px";
    finger.style.top = event.clientY + "px";

    // 클릭 가능한 대상 위에서는 손가락이 튄다
    var clickable = event.target.closest &&
                    event.target.closest("a, button, .coverflow__item.is-center");
    finger.classList.toggle("is-bouncing", !!clickable);

    // 일정 거리 이상 움직였을 때만 반짝이 하나 — 자잘하게, 그러나 산만하지 않게
    var dist = Math.abs(event.clientX - lastX) + Math.abs(event.clientY - lastY);
    if (dist > 15) {
      lastX = event.clientX;
      lastY = event.clientY;
      spawnSparkle(event.clientX, event.clientY);
    }
  }

  function enter() {
    finger.classList.add("is-visible");
    this.classList.add("finger-zone--active");
  }

  function leave() {
    finger.classList.remove("is-visible", "is-bouncing");
    this.classList.remove("finger-zone--active");
  }

  for (var i = 0; i < zones.length; i++) {
    zones[i].addEventListener("mouseenter", enter);
    zones[i].addEventListener("mousemove", onMove);
    zones[i].addEventListener("mouseleave", leave);
  }

  /* 여행 동영상 — 반짝이만 (손가락·커서 숨김 없이, 컨트롤은 그대로 쓰게) */
  function onGlitterOnly(event) {
    var dist = Math.abs(event.clientX - lastX) + Math.abs(event.clientY - lastY);
    if (dist > 15) {
      lastX = event.clientX;
      lastY = event.clientY;
      spawnSparkle(event.clientX, event.clientY);
    }
  }

  var glitterZones = document.querySelectorAll(".feed__item video");
  for (var v = 0; v < glitterZones.length; v++) {
    glitterZones[v].addEventListener("mousemove", onGlitterOnly);
  }
})();
