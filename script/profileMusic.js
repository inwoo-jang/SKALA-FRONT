/* ==========================================================
   script/profileMusic.js — 프로필 좋아하는 음악 앨범 슬라이드
   뒤 카드가 비껴 보이는 스택형. 넘기면 뒤 카드가 앞으로 나온다.
   ========================================================== */

var musicTrack = document.getElementById("musicTrack");

if (musicTrack) {
  var musicItems = musicTrack.querySelectorAll(".music-slider__item");
  var musicPrev = document.getElementById("musicPrev");
  var musicNext = document.getElementById("musicNext");
  var musicCount = document.getElementById("musicCount");
  var musicIndex = 0;

  function showMusic(index) {
    musicIndex = (index + musicItems.length) % musicItems.length;

    for (var i = 0; i < musicItems.length; i++) {
      var offset = (i - musicIndex + musicItems.length) % musicItems.length;

      musicItems[i].classList.toggle("is-current", offset === 0);
      musicItems[i].classList.toggle("is-next", offset === 1);
      musicItems[i].classList.toggle("is-back", offset === 2);
    }

    musicCount.textContent = (musicIndex + 1) + " / " + musicItems.length;
  }

  musicPrev.addEventListener("click", function () { showMusic(musicIndex - 1); });
  musicNext.addEventListener("click", function () { showMusic(musicIndex + 1); });

  /* 뒤에 보이는 카드를 누르면 그 앨범이 앞으로 나온다 */
  for (var i = 0; i < musicItems.length; i++) {
    (function (idx) {
      musicItems[idx].addEventListener("click", function () {
        if (idx !== musicIndex) {
          showMusic(idx);
        }
      });
    })(i);
  }

  showMusic(0);
}
