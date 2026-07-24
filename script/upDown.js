/* ==========================================================
   script/upDown.js — 모달형 업다운 숫자 맞히기
   게임 상태와 TOP 5 기록을 데이터로 관리한다.
   ========================================================== */

var UPDOWN_STORAGE_KEY = "inwoo_updown_rankings";
var UPDOWN_MAX_RANK = 5;

var upDownBtn = document.getElementById("upDownBtn");
var upDownModal = document.getElementById("upDownModal");
var upDownClose = document.getElementById("upDownClose");
var upDownQuit = document.getElementById("upDownQuit");
var upDownRestart = document.getElementById("upDownRestart");
var upDownForm = document.getElementById("upDownForm");
var upDownInput = document.getElementById("upDownInput");
var upDownSubmit = document.getElementById("upDownSubmit");
var upDownGuide = document.getElementById("upDownGuide");
var upDownRange = document.getElementById("upDownRange");
var upDownAttempts = document.getElementById("upDownAttempts");
var upDownMessage = document.getElementById("upDownMessage");
var upDownGuesses = document.getElementById("upDownGuesses");
var upDownWheelStage = document.getElementById("upDownWheelStage");
var upDownWheel = document.getElementById("upDownWheel");
var upDownWheelResult = document.getElementById("upDownWheelResult");
var upDownSpin = document.getElementById("upDownSpin");
var upDownGame = document.getElementById("upDownGame");
var upDownRecords = document.getElementById("upDownRecords");
var upDownEmpty = document.getElementById("upDownEmpty");
var upDownClear = document.getElementById("upDownClear");

var rangeOptions = [30, 40, 50, 60, 70, 80, 90, 100];
var spinRunId = 0;

var gameState = {
  answer: 0,
  attempts: 0,
  min: 1,
  max: 50,
  maxRange: 50,
  guesses: [],
  isPlaying: false
};

var rankings = [];

/** 랭킹 정렬: 적은 시도 횟수 우선, 동률이면 넓은 범위와 달성 시간 순 */
function compareRank(a, b) {
  if (a.attempts !== b.attempts) {
    return a.attempts - b.attempts;
  }
  if (a.maxRange !== b.maxRange) {
    return b.maxRange - a.maxRange;
  }
  return a.playedAt - b.playedAt;
}

/** localStorage에서 유효한 TOP 5 기록만 불러온다. */
function loadRankings() {
  try {
    var saved = JSON.parse(localStorage.getItem(UPDOWN_STORAGE_KEY) || "[]");

    if (!Array.isArray(saved)) {
      return [];
    }

    return saved.map(function (record) {
      if (record && !Number.isInteger(record.maxRange)) {
        record.maxRange = 50;
      }
      return record;
    }).filter(function (record) {
      return record &&
        typeof record.id === "string" &&
        Number.isInteger(record.attempts) &&
        record.attempts > 0 &&
        Number.isInteger(record.maxRange) &&
        record.maxRange >= 30 &&
        record.maxRange <= 100 &&
        typeof record.playedAt === "number";
    }).sort(compareRank).slice(0, UPDOWN_MAX_RANK);
  } catch (error) {
    console.warn("업다운 랭킹을 불러오지 못했습니다.", error);
    return [];
  }
}

function saveRankings() {
  try {
    localStorage.setItem(UPDOWN_STORAGE_KEY, JSON.stringify(rankings));
  } catch (error) {
    console.warn("업다운 랭킹을 저장하지 못했습니다.", error);
  }
}

function formatRankDate(time) {
  return new Date(time).toLocaleDateString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit"
  });
}

/** 현재 TOP 5를 모달 안에 그린다. */
function renderRankings() {
  upDownRecords.replaceChildren();
  upDownEmpty.hidden = rankings.length > 0;
  upDownClear.hidden = rankings.length === 0;

  for (var i = 0; i < rankings.length; i++) {
    var item = document.createElement("li");
    var score = document.createElement("span");
    var date = document.createElement("time");

    item.className = "updown-ranking__item";
    score.className = "updown-ranking__score";
    score.textContent = "1~" + rankings[i].maxRange +
      " · " + rankings[i].attempts + "번 성공";
    date.className = "updown-ranking__date";
    date.dateTime = new Date(rankings[i].playedAt).toISOString();
    date.textContent = formatRankDate(rankings[i].playedAt);

    item.appendChild(score);
    item.appendChild(date);
    upDownRecords.appendChild(item);
  }
}

function setGameMessage(text, state) {
  upDownMessage.textContent = text;
  upDownMessage.dataset.state = state || "";
}

/** 상태 데이터를 모달 화면에 반영한다. */
function renderGameState() {
  upDownRange.textContent = gameState.min + " ~ " + gameState.max;
  upDownAttempts.textContent = gameState.attempts;
  upDownInput.min = gameState.min;
  upDownInput.max = gameState.max;
  upDownGuesses.replaceChildren();

  if (gameState.guesses.length === 0) {
    var empty = document.createElement("li");
    empty.className = "updown-guesses__empty";
    empty.textContent = "아직 입력한 숫자가 없어요.";
    upDownGuesses.appendChild(empty);
    return;
  }

  for (var i = 0; i < gameState.guesses.length; i++) {
    var guess = document.createElement("li");
    var symbol = gameState.guesses[i].result === "up"
      ? " ↑"
      : gameState.guesses[i].result === "down" ? " ↓" : " ✓";

    guess.textContent = gameState.guesses[i].value + symbol;
    upDownGuesses.appendChild(guess);
  }
}

/** 돌림판을 돌리기 전의 대기 화면으로 돌아간다. */
function prepareRangeWheel() {
  spinRunId += 1;
  gameState.isPlaying = false;
  upDownWheelStage.hidden = false;
  upDownGame.hidden = true;
  upDownRestart.hidden = true;
  upDownSpin.disabled = false;
  upDownWheelStage.classList.remove("is-spinning");
  upDownWheelResult.textContent = "?";
  upDownGuide.textContent = "돌림판을 돌려 이번 게임의 숫자 범위를 정해보세요.";

  upDownWheel.style.transition = "none";
  upDownWheel.style.transform = "rotate(0deg)";
  void upDownWheel.offsetWidth;
  upDownWheel.style.transition = "";
  upDownSpin.focus();
}

/** 돌림판이 정한 최대 숫자로 새 게임을 시작한다. */
function startNewGame(selectedMax) {
  gameState.answer = Math.floor(Math.random() * selectedMax) + 1;
  gameState.attempts = 0;
  gameState.min = 1;
  gameState.max = selectedMax;
  gameState.maxRange = selectedMax;
  gameState.guesses = [];
  gameState.isPlaying = true;

  upDownWheelStage.hidden = true;
  upDownGame.hidden = false;
  upDownGuide.textContent = "1부터 " + selectedMax +
    " 사이에 숨은 숫자를 찾아보세요.";
  upDownForm.reset();
  upDownInput.disabled = false;
  upDownSubmit.disabled = false;
  upDownRestart.hidden = true;
  setGameMessage("숫자를 입력하고 확인을 눌러주세요.", "");
  renderGameState();
  upDownInput.focus();
}

/** 30~100 범위 돌림판을 돌리고 멈춘 숫자로 게임을 시작한다. */
function spinRangeWheel() {
  if (upDownSpin.disabled) { return; }

  var runId = ++spinRunId;
  var selectedIndex = Math.floor(Math.random() * rangeOptions.length);
  var selectedMax = rangeOptions[selectedIndex];
  var finalRotation = 1440 - (selectedIndex * 45);
  var spinDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 150
    : 2600;

  upDownSpin.disabled = true;
  upDownWheelStage.classList.add("is-spinning");
  upDownWheelResult.textContent = "…";
  upDownGuide.textContent = "이번 게임의 범위를 정하는 중이에요!";
  upDownWheel.style.transitionDuration = spinDuration + "ms";
  upDownWheel.style.transform = "rotate(" + finalRotation + "deg)";

  window.setTimeout(function () {
    if (runId !== spinRunId || !upDownModal.open) { return; }

    upDownWheelResult.textContent = selectedMax;
    upDownGuide.textContent = "이번 게임은 1부터 " + selectedMax + "까지!";

    window.setTimeout(function () {
      if (runId !== spinRunId || !upDownModal.open) { return; }
      startNewGame(selectedMax);
    }, 700);
  }, spinDuration);
}

/** 성공 기록을 TOP 5와 비교하고 진입한 순위를 반환한다. */
function updateRanking() {
  var previousBest = rankings.length > 0 ? rankings[0] : null;
  var now = new Date().getTime();
  var newRecord = {
    id: String(now) + "-" + String(Math.random()).slice(2),
    attempts: gameState.attempts,
    maxRange: gameState.maxRange,
    playedAt: now,
    guesses: gameState.guesses.map(function (guess) {
      return guess.value;
    })
  };

  rankings.push(newRecord);
  rankings.sort(compareRank);
  rankings = rankings.slice(0, UPDOWN_MAX_RANK);

  var rankIndex = rankings.findIndex(function (record) {
    return record.id === newRecord.id;
  });

  saveRankings();
  renderRankings();

  return {
    rank: rankIndex === -1 ? 0 : rankIndex + 1,
    isNewBest: rankIndex === 0 &&
      (previousBest === null || compareRank(newRecord, previousBest) < 0)
  };
}

function finishGame() {
  gameState.isPlaying = false;
  upDownInput.disabled = true;
  upDownSubmit.disabled = true;
  upDownRestart.hidden = false;

  var rankResult = updateRanking();
  var message = "정답 " + gameState.answer + "! " +
    gameState.attempts + "번 만에 성공했어요.";

  if (rankResult.isNewBest) {
    message += " 🏆 새로운 TOP 1 기록이에요!";
  } else if (rankResult.rank > 0) {
    message += " 🎉 TOP " + rankResult.rank + "에 진입했어요!";
  } else {
    message += " 다음에는 TOP 5에 도전해 보세요!";
  }

  setGameMessage(message, "win");
  upDownRestart.focus();
}

function submitGuess(event) {
  event.preventDefault();
  if (!gameState.isPlaying) { return; }

  var rawValue = upDownInput.value.trim();
  var userNum = Number(rawValue);

  if (rawValue === "" || !Number.isInteger(userNum)) {
    setGameMessage("정수로 입력해 주세요.", "error");
    upDownInput.focus();
    return;
  }

  if (userNum < gameState.min || userNum > gameState.max) {
    setGameMessage(
      gameState.min + "부터 " + gameState.max + " 사이의 숫자를 입력해 주세요.",
      "error"
    );
    upDownInput.select();
    return;
  }

  var alreadyGuessed = gameState.guesses.some(function (guess) {
    return guess.value === userNum;
  });

  if (alreadyGuessed) {
    setGameMessage("이미 입력한 숫자예요. 다른 숫자를 골라주세요.", "error");
    upDownInput.select();
    return;
  }

  gameState.attempts += 1;

  if (userNum < gameState.answer) {
    gameState.guesses.push({ value: userNum, result: "up" });
    gameState.min = userNum + 1;
    setGameMessage("UP! " + userNum + "보다 큰 숫자예요.", "up");
  } else if (userNum > gameState.answer) {
    gameState.guesses.push({ value: userNum, result: "down" });
    gameState.max = userNum - 1;
    setGameMessage("DOWN! " + userNum + "보다 작은 숫자예요.", "down");
  } else {
    gameState.guesses.push({ value: userNum, result: "correct" });
    renderGameState();
    finishGame();
    return;
  }

  renderGameState();
  upDownInput.value = "";
  upDownInput.focus();
}

function closeUpDownModal() {
  spinRunId += 1;
  gameState.isPlaying = false;
  upDownModal.close();
}

if (upDownBtn && upDownModal) {
  rankings = loadRankings();
  renderRankings();

  upDownBtn.addEventListener("click", function () {
    upDownModal.showModal();
    prepareRangeWheel();
  });

  upDownSpin.addEventListener("click", spinRangeWheel);
  upDownForm.addEventListener("submit", submitGuess);
  upDownRestart.addEventListener("click", prepareRangeWheel);
  upDownClose.addEventListener("click", closeUpDownModal);
  upDownQuit.addEventListener("click", closeUpDownModal);

  upDownModal.addEventListener("cancel", function () {
    spinRunId += 1;
    gameState.isPlaying = false;
  });

  upDownModal.addEventListener("click", function (event) {
    if (event.target === upDownModal) {
      closeUpDownModal();
    }
  });

  upDownClear.addEventListener("click", function () {
    if (!window.confirm("TOP 5 랭킹 기록을 모두 삭제할까요?")) {
      return;
    }

    rankings = [];
    localStorage.removeItem(UPDOWN_STORAGE_KEY);
    renderRankings();
    setGameMessage("랭킹 기록을 삭제했습니다.", "");
  });
}
