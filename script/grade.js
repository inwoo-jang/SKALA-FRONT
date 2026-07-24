/* ==========================================================
   script/grade.js — 모달형 성적 계산기
   입력 데이터로 총점, 평균, 등급과 합격 여부를 계산한다.
   ========================================================== */

var gradeBtn = document.getElementById("gradeBtn");
var gradeModal = document.getElementById("gradeModal");
var gradeClose = document.getElementById("gradeClose");
var gradeForm = document.getElementById("gradeForm");
var gradeMessage = document.getElementById("gradeMessage");
var gradeResult = document.getElementById("gradeResult");
var gradeAverage = document.getElementById("gradeAverage");
var gradeTotal = document.getElementById("gradeTotal");
var gradeLevel = document.getElementById("gradeLevel");
var gradePass = document.getElementById("gradePass");
var gradeResultTitle = document.getElementById("gradeResultTitle");

var gradeSubjects = [
  { name: "HTML", input: document.getElementById("htmlScore") },
  { name: "CSS", input: document.getElementById("cssScore") },
  { name: "JavaScript", input: document.getElementById("javascriptScore") }
];

function getGradeLevel(average) {
  if (average >= 90) { return "A"; }
  if (average >= 80) { return "B"; }
  if (average >= 70) { return "C"; }
  if (average >= 60) { return "D"; }
  return "F";
}

function getGradeMessage(level) {
  var messages = {
    A: "당신은 GOD 👑",
    B: "이 정도면 훌륭한 편 👍",
    C: "공부하긴 했는데 좀 더 노력하자 📚",
    D: "간신히 통과… 너 운빨이잖아 🍀",
    F: "이건 점수가 아니라 구조 요청 신호야 🚨"
  };

  return messages[level];
}

function clearGradeFeedback() {
  gradeMessage.hidden = true;
  gradeMessage.textContent = "";
  gradeResult.hidden = true;
  gradeResult.removeAttribute("data-result");

  for (var i = 0; i < gradeSubjects.length; i++) {
    gradeSubjects[i].input.removeAttribute("aria-invalid");
  }
}

function resetGradeCalculator() {
  gradeForm.reset();
  clearGradeFeedback();
}

function closeGradeModal() {
  gradeModal.close();
  resetGradeCalculator();
}

function calculateGrade(event) {
  event.preventDefault();

  var scores = [];
  var firstInvalid = null;
  var invalidSubject = "";

  for (var i = 0; i < gradeSubjects.length; i++) {
    var rawValue = gradeSubjects[i].input.value.trim();
    var score = Number(rawValue);
    var isValid = rawValue !== "" &&
      Number.isInteger(score) &&
      score >= 0 &&
      score <= 100;

    gradeSubjects[i].input.setAttribute(
      "aria-invalid",
      isValid ? "false" : "true"
    );

    if (!isValid && !firstInvalid) {
      firstInvalid = gradeSubjects[i].input;
      invalidSubject = gradeSubjects[i].name;
    }

    scores.push(score);
  }

  if (firstInvalid) {
    gradeResult.hidden = true;
    gradeMessage.textContent = invalidSubject +
      " 점수를 0부터 100 사이의 정수로 입력해 주세요.";
    gradeMessage.hidden = false;
    firstInvalid.focus();
    return;
  }

  var total = 0;
  for (var j = 0; j < scores.length; j++) {
    total += scores[j];
  }

  var average = total / scores.length;
  var level = getGradeLevel(average);
  var isPass = average >= 60;

  gradeMessage.hidden = true;
  gradeAverage.textContent = average.toFixed(1);
  gradeTotal.textContent = total;
  gradeLevel.textContent = level;
  gradeLevel.setAttribute("aria-label", level + " 등급");
  gradePass.textContent = isPass ? "합격" : "불합격";
  gradeResultTitle.textContent = getGradeMessage(level);
  gradeResult.dataset.result = isPass ? "pass" : "fail";
  gradeResult.hidden = false;
  gradeResult.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

if (gradeBtn && gradeModal) {
  gradeBtn.addEventListener("click", function () {
    resetGradeCalculator();
    gradeModal.showModal();
    gradeSubjects[0].input.focus();
  });

  gradeClose.addEventListener("click", closeGradeModal);
  gradeForm.addEventListener("submit", calculateGrade);

  gradeForm.addEventListener("reset", function () {
    window.setTimeout(clearGradeFeedback, 0);
  });

  gradeModal.addEventListener("click", function (event) {
    if (event.target === gradeModal) {
      closeGradeModal();
    }
  });

  gradeModal.addEventListener("cancel", function () {
    resetGradeCalculator();
  });

  for (var i = 0; i < gradeSubjects.length; i++) {
    gradeSubjects[i].input.addEventListener("input", function () {
      this.removeAttribute("aria-invalid");
      gradeMessage.hidden = true;
    });
  }
}
