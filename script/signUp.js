/* ==========================================================
   script/signUp.js — 회원가입 폼 동작
   이메일 도메인 직접입력, 관심 분야 직접입력, 비밀번호 확인 검사
   ========================================================== */

var emailDomain = document.querySelector("#emailDomain");
var emailDomainDirect = document.querySelector("#emailDomainDirect");
var otherInterest = document.querySelector("#otherInterest");
var interestOther = document.querySelector("#interestOther");
var userPassword = document.querySelector("#userPassword");
var userPasswordConfirm = document.querySelector("#userPasswordConfirm");

/** 두 비밀번호가 다르면 브라우저 기본 검증 메시지를 띄운다 */
function validatePasswordConfirm() {
  var message = userPassword.value === userPasswordConfirm.value
    ? ""
    : "비밀번호가 일치하지 않습니다.";

  userPasswordConfirm.setCustomValidity(message);
}

if (userPassword && userPasswordConfirm) {
  userPassword.addEventListener("input", validatePasswordConfirm);
  userPasswordConfirm.addEventListener("input", validatePasswordConfirm);
}

/* 도메인에서 "직접입력"을 고르면 입력칸을 연다 */
if (emailDomain && emailDomainDirect) {
  emailDomain.addEventListener("change", function () {
    var isDirect = this.value === "direct";

    emailDomainDirect.hidden = !isDirect;
    emailDomainDirect.disabled = !isDirect;
    emailDomainDirect.required = isDirect;

    if (isDirect) {
      emailDomainDirect.focus();
    } else {
      emailDomainDirect.value = "";
    }
  });
}

/* 관심 분야 "직접 입력" 체크 시 입력칸을 활성화한다 */
if (otherInterest && interestOther) {
  otherInterest.addEventListener("change", function () {
    interestOther.disabled = !this.checked;
    interestOther.required = this.checked;

    if (this.checked) {
      interestOther.focus();
    } else {
      interestOther.value = "";
    }
  });
}

/* 비밀번호는 주소창(GET 쿼리)에 노출되면 안 된다.
   검증이 모두 끝나 실제 제출되는 순간에만 disabled로 바꿔
   브라우저가 전송 목록에서 제외하게 한다.
   (preventDefault로 제출 자체를 막으면 결과 페이지로 넘어가는
    과제 흐름이 끊기므로, 전송 항목만 골라내는 이 방식을 쓴다) */
var signUpForm = document.querySelector(".auth-form");

if (signUpForm && userPassword) {
  signUpForm.addEventListener("submit", function () {
    userPassword.disabled = true;
    userPasswordConfirm.disabled = true;
  });

  // 뒤로 가기로 돌아오면 다시 입력할 수 있게 되돌린다
  window.addEventListener("pageshow", function () {
    userPassword.disabled = false;
    userPasswordConfirm.disabled = false;
  });
}
