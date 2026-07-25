/* ==========================================================
   script/filmPlayer.js — 여행일지 배경음악
   재생바 대신 필름이 카메라 쪽으로 감겨 들어가며 진행률을 보여준다.
   media/bgm/ 폴더의 곡들을 순서대로 잇고, 끝나면 처음부터 반복한다.
   한 곡 = 필름 한 롤. 곡이 바뀌면 새 필름이 걸린다.
   ========================================================== */

/* 재생 목록 — mp3를 media/bgm/에 넣고 여기에 경로·제목만 맞춰주면 된다 */
var BGM_TRACKS = [
  { src: "../media/bgm/stunts-cheer.mp3", title: "Stunts Cheer" },
  { src: "../media/bgm/Dono - Life Dancing.mp3", title: "Life Dancing" },
  { src: "../media/bgm/Yarin Primak - Only You.mp3", title: "Only You" }
];

var filmPlayer = document.getElementById("filmPlayer");
var filmTrack = document.getElementById("filmTrack");
var filmToggle = document.getElementById("filmToggle");
var filmLabel = document.getElementById("filmLabel");
var bgmPrev = document.getElementById("bgmPrev");
var bgmNext = document.getElementById("bgmNext");
var tripBgm = document.getElementById("tripBgm");

var currentTrack = 0;
var failedCount = 0;  // 연속으로 못 읽은 곡 수 — 전부 실패하면 멈춘다
var wantPlaying = false;  // 듣던 중이었는지 — 곡 건너뛰기/이어재생 판단용

/** BGM을 틀기 전에 재생 중인 피드 영상을 모두 멈춘다 — 소리가 겹치지 않게.
    (feedVideos는 아래에서 채워지지만, safePlay는 초기 실행이 끝난 뒤
     이벤트에서만 호출되므로 이 시점엔 항상 값이 채워져 있다) */
function pauseFeedVideos() {
  if (!feedVideos) { return; }
  for (var i = 0; i < feedVideos.length; i++) {
    if (!feedVideos[i].paused) { feedVideos[i].pause(); }
  }
}

/** play()는 브라우저 자동재생 정책으로 거부될 수 있어 항상 감싸서 부른다 */
function safePlay() {
  pauseFeedVideos();  // 영상 소리와 BGM이 겹치지 않게, 틀기 직전에 영상을 멈춘다

  var attempt = tripBgm.play();

  if (attempt && attempt.catch) {
    attempt.catch(function () { /* 차단되면 조용히 넘어간다 */ });
  }
}

/* 남은 필름 길이(%) — 곡이 진행될수록 줄어들어 카메라에 가까워진다 */
function updateFilm() {
  if (!tripBgm.duration) { return; }

  var progress = tripBgm.currentTime / tripBgm.duration;
  var remain = Math.max(0, 100 - progress * 100);

  filmTrack.style.setProperty("--remain", remain + "%");
}

function setPlayingState(playing) {
  filmPlayer.classList.toggle("is-playing", playing);
  filmToggle.setAttribute("aria-pressed", String(playing));
  filmToggle.setAttribute("aria-label", playing ? "배경음악 일시정지" : "배경음악 재생");
}

/** index번 곡으로 필름을 갈아 끼운다 */
function loadTrack(index, autoplay) {
  currentTrack = index;
  tripBgm.src = BGM_TRACKS[index].src;
  filmLabel.textContent = "BGM · " + BGM_TRACKS[index].title;
  filmTrack.style.setProperty("--remain", "100%");

  if (autoplay) {
    safePlay();
  }
}

/** 다음 곡 — 마지막 곡이 끝나면 처음으로 돌아가 반복한다 */
function playNext(autoplay) {
  loadTrack((currentTrack + 1) % BGM_TRACKS.length, autoplay);
}

/** 이전 곡 — 첫 곡에서 누르면 마지막 곡으로 */
function playPrev(autoplay) {
  loadTrack((currentTrack - 1 + BGM_TRACKS.length) % BGM_TRACKS.length, autoplay);
}

/* 페이지를 열면 바로 재생을 시도한다.
   브라우저 정책으로 막히면 첫 클릭/키 입력 때 자동으로 시작한다. */
function tryAutoplay() {
  var attempt = tripBgm.play();

  if (attempt && attempt.catch) {
    attempt.catch(function () {
      function startOnce(event) {
        document.removeEventListener("pointerdown", startOnce);
        document.removeEventListener("keydown", startOnce);

        // 카메라 버튼·필름 클릭은 각자 핸들러가 처리하므로 여기선 건드리지 않는다
        if (event.target && event.target.closest &&
            event.target.closest(".film-player")) {
          return;
        }

        safePlay();
      }
      document.addEventListener("pointerdown", startOnce);
      document.addEventListener("keydown", startOnce);
    });
  }
}

var autoplayTried = false;

if (filmPlayer && tripBgm) {
  /* 음악 파일이 준비되면 플레이어를 보여주고 자동 재생을 시도한다 */
  tripBgm.addEventListener("loadedmetadata", function () {
    failedCount = 0;
    filmPlayer.hidden = false;
    updateFilm();

    if (!autoplayTried) {
      autoplayTried = true;
      tryAutoplay();
    }
  });

  /* 파일이 없는 곡은 건너뛴다. 전부 없으면 플레이어를 숨긴다 */
  tripBgm.addEventListener("error", function () {
    failedCount += 1;

    if (failedCount >= BGM_TRACKS.length) {
      filmPlayer.hidden = true;
      return;
    }

    playNext(wantPlaying);
  });

  filmToggle.addEventListener("click", function () {
    if (tripBgm.paused) {
      wantPlaying = true;
      safePlay();
    } else {
      wantPlaying = false;
      tripBgm.pause();
    }
  });

  /* ‹ › — 곡 넘기기. 듣던 중이었으면 다음 곡도 바로 이어 튼다 */
  if (bgmPrev && bgmNext) {
    bgmPrev.addEventListener("click", function () {
      playPrev(!tripBgm.paused || wantPlaying);
    });
    bgmNext.addEventListener("click", function () {
      playNext(!tripBgm.paused || wantPlaying);
    });
  }

  tripBgm.addEventListener("play", function () { wantPlaying = true; setPlayingState(true); });
  tripBgm.addEventListener("pause", function () { setPlayingState(false); });
  tripBgm.addEventListener("timeupdate", updateFilm);

  /* 필름을 누르면 그 지점으로 이동한다 — 감긴 롤 왼쪽을 누르면 뒤로 감기 */
  filmTrack.addEventListener("click", function (event) {
    if (!tripBgm.duration) { return; }

    var rect = filmTrack.getBoundingClientRect();
    var ratio = (event.clientX - rect.left) / rect.width;

    ratio = Math.min(1, Math.max(0, ratio));
    tripBgm.currentTime = tripBgm.duration * ratio;
    updateFilm();

    // 멈춰 있었다면 그 지점부터 바로 재생한다
    if (tripBgm.paused) {
      wantPlaying = true;
      safePlay();
    }
  });

  /* 곡이 끝나면 자연스럽게 다음 곡으로 */
  tripBgm.addEventListener("ended", function () {
    playNext(true);
  });

  loadTrack(0, false);
}

/* ----------------------------------------------------------
   피드 영상과의 조율
   - 영상은 한 번에 하나만 재생한다 (다른 영상은 자동 정지)
   - 영상이 재생되는 동안 BGM은 잠시 멈추고,
     영상을 멈추거나 영상이 끝나면 이어서 다시 재생한다
   ---------------------------------------------------------- */
var feedVideos = document.querySelectorAll(".feed__item video");
var bgmPausedByVideo = false;

/** 재생 중인 영상이 하나도 없으면 BGM을 이어서 튼다 */
function resumeBgmIfQuiet() {
  for (var i = 0; i < feedVideos.length; i++) {
    if (!feedVideos[i].paused && !feedVideos[i].ended) { return; }
  }

  if (bgmPausedByVideo && tripBgm) {
    bgmPausedByVideo = false;
    safePlay();
  }
}

function handleVideoPlay(event) {
  // 다른 영상은 멈춘다 — 소리가 겹치지 않게
  for (var i = 0; i < feedVideos.length; i++) {
    if (feedVideos[i] !== event.target && !feedVideos[i].paused) {
      feedVideos[i].pause();
    }
  }

  // BGM이 나오고 있었다면 기억해 두고 잠시 멈춘다
  if (tripBgm && !tripBgm.paused) {
    bgmPausedByVideo = true;
    tripBgm.pause();
  }
}

for (var v = 0; v < feedVideos.length; v++) {
  feedVideos[v].addEventListener("play", handleVideoPlay);
  feedVideos[v].addEventListener("pause", resumeBgmIfQuiet);
  feedVideos[v].addEventListener("ended", resumeBgmIfQuiet);
}
