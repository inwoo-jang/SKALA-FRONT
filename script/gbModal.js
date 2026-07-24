/* ==========================================================
   script/gbModal.js — 홈 방명록 작성 모달
   ※ auth.js(getSession)와 guestbook.js(loadEntries 등)가
     먼저 로드되어 있어야 한다.
   ========================================================== */

var gbModal = document.getElementById("gbModal");
var gbModalOpen = document.getElementById("gbModalOpen");
var gbModalClose = document.getElementById("gbModalClose");
var gbModalCancel = document.getElementById("gbModalCancel");
var gbModalForm = document.getElementById("gbModalForm");
var gbModalLocked = document.getElementById("gbModalLocked");
var gbModalMsg = document.getElementById("gbModalMsg");
var gbModalCount = document.getElementById("gbModalCount");

if (gbModal && gbModalOpen) {

  /* 열기 — 로그인 상태에 따라 작성 폼/안내를 전환한다 */
  gbModalOpen.addEventListener("click", function () {
    var user = getSession();

    gbModalForm.hidden = !user;
    gbModalLocked.hidden = !!user;

    gbModal.showModal();

    if (user) {
      gbModalMsg.focus();
    }
  });

  function closeModal() {
    gbModal.close();
    gbModalForm.reset();
    gbModalCount.textContent = "0 / 200";
  }

  gbModalClose.addEventListener("click", closeModal);
  gbModalCancel.addEventListener("click", closeModal);

  /* 어두운 배경(백드롭)을 클릭하면 닫는다 */
  gbModal.addEventListener("click", function (event) {
    if (event.target === gbModal) {
      closeModal();
    }
  });

  gbModalMsg.addEventListener("input", function () {
    gbModalCount.textContent = gbModalMsg.value.length + " / 200";
  });

  /* 저장 — guestbook.js와 같은 localStorage를 쓴다 */
  gbModalForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var user = getSession();
    if (!user) { return; }

    var message = gbModalMsg.value.trim();
    if (message === "") { return; }

    var entries = loadEntries();

    entries.unshift({
      id: String(new Date().getTime()),
      userId: user.id,
      name: user.name,
      message: message,
      time: new Date().getTime()
    });

    saveEntries(entries);
    closeModal();

    // 홈 미리보기를 바로 새로 그린다
    renderHomePreview();
  });
}
