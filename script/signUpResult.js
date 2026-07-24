/* ==========================================================
   script/signUpResult.js — 회원가입 결과 표시
   GET으로 넘어온 주소창의 값을 읽어 가입 내용을 표시한다.
   ========================================================== */

var resultBox = document.getElementById("resultBox");

/** value 코드값을 사람이 읽을 수 있는 말로 바꾼다. */
var genderNames = {
  male: "남성",
  female: "여성",
  none: "선택 안 함"
};

var interestNames = {
  frontend: "웹 프론트엔드 (Vue.js/HTML)",
  "ui-ux": "UI/UX 디자인 표준",
  "backend-database": "백엔드/데이터베이스",
  "cloud-infrastructure": "클라우드/인프라",
  ai: "AI/머신러닝",
  "data-analysis": "데이터 분석",
  "service-planning": "서비스 기획/PM"
};

function showSignUpResult() {
  var params = new URLSearchParams(location.search);

  if (params.toString() === "") {
    resultBox.innerHTML =
      "<p>전달된 가입 정보가 없습니다. " +
      '<a href="signUp.html">회원가입 페이지</a>에서 다시 진행해 주세요.</p>';
    return;
  }

  /* 주소창의 값은 사용자가 마음대로 바꿀 수 있으므로
     화면에 넣기 전에 반드시 escapeHtml(auth.js)을 거친다. */
  var userId = escapeHtml(params.get("userId") || "(없음)");
  var userName = escapeHtml(params.get("userName") || "(없음)");
  var userBirth = escapeHtml(params.get("userBirth") || "(입력하지 않음)");
  var gender = genderNames[params.get("gender")] || "(선택하지 않음)";
  var intro = params.get("introduction");

  /* 이메일 — 아이디@도메인, "직접입력"이면 입력한 도메인을 쓴다 */
  var emailId = params.get("userEmail") || "";
  var domain = params.get("emailDomain") || "";
  if (domain === "direct") {
    domain = params.get("emailDomainDirect") || "";
  }
  var email = emailId && domain
    ? escapeHtml(emailId + "@" + domain)
    : "(없음)";

  /* 관심 분야 — "직접 입력" 항목은 입력한 내용으로 바꾼다 */
  var interests = params.getAll("interest");
  var interestText = "(선택하지 않음)";

  if (interests.length > 0) {
    var names = [];
    for (var i = 0; i < interests.length; i++) {
      if (interests[i] === "other") {
        names.push(escapeHtml(params.get("interestOther") || "기타"));
      } else {
        names.push(interestNames[interests[i]] || escapeHtml(interests[i]));
      }
    }
    interestText = names.join(", ");
  }

  resultBox.innerHTML =
    "<dl>" +
      "<dt>아이디</dt><dd>" + userId + "</dd>" +
      "<dt>이름</dt><dd>" + userName + "</dd>" +
      "<dt>이메일</dt><dd>" + email + "</dd>" +
      "<dt>생년월일</dt><dd>" + userBirth + "</dd>" +
      "<dt>성별</dt><dd>" + gender + "</dd>" +
      "<dt>관심 분야</dt><dd>" + interestText + "</dd>" +
      "<dt>가입 인사</dt><dd>" +
        (intro ? escapeHtml(intro) : "(입력하지 않음)") + "</dd>" +
    "</dl>";
}

if (resultBox) {
  showSignUpResult();
}
