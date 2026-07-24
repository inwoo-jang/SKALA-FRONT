/* ==========================================================
   script/slider.js — 추가 실습
   메인 히어로의 최근 여행 사진 슬라이더.
   자동 전환 + 수동 버튼, 모션 최소화 설정 시 자동 전환을 끈다.
   ========================================================== */

var sliderTrack = document.getElementById("sliderTrack");

if (sliderTrack) {
  var slides = sliderTrack.querySelectorAll(".slider__item");
  var prevBtn = document.getElementById("slidePrev");
  var nextBtn = document.getElementById("slideNext");
  var countEl = document.getElementById("slideCount");
  var current = 0;
  var timerId = null;

  /**
   * 지정한 순번의 사진을 보여준다.
   * @param {number} index
   */
  function showSlide(index) {
    if (index < 0) { index = slides.length - 1; }
    if (index >= slides.length) { index = 0; }

    for (var i = 0; i < slides.length; i++) {
      slides[i].classList.toggle("is-current", i === index);
    }

    current = index;
    countEl.textContent = (index + 1) + " / " + slides.length;
  }

  /** 자동 전환 시작 */
  function startAuto() {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { return; }

    stopAuto();
    timerId = setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  /** 자동 전환 정지 */
  function stopAuto() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  prevBtn.addEventListener("click", function () {
    showSlide(current - 1);
    startAuto();
  });

  nextBtn.addEventListener("click", function () {
    showSlide(current + 1);
    startAuto();
  });

  // 마우스를 올리거나 키보드 포커스가 들어오면 자동 전환을 멈춘다.
  var slider = document.getElementById("tripSlider");
  slider.addEventListener("mouseenter", stopAuto);
  slider.addEventListener("mouseleave", startAuto);
  slider.addEventListener("focusin", stopAuto);
  slider.addEventListener("focusout", startAuto);

  showSlide(0);
  startAuto();
}
