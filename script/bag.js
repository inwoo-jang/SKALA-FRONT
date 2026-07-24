/* ==========================================================
   script/bag.js — 내 가방 모달
   myBag 배열의 소지품 객체를 반복문으로 출력한다.
   메인 페이지 모달에서 물건이 하나씩 튀어나오게 보여준다.
   ========================================================== */

var myBag = [
  { name: "노트북",   count: 1, emoji: "💻", note: "맥북air" },
  { name: "충전기",   count: 2, emoji: "🔌", note: "노트북용과 폰용." },
  { name: "볼펜",     count: 1, emoji: "🖊️", note: "혹시 모르니 비상용 볼펜." },
  { name: "노트",     count: 1, emoji: "📓", note: "회의 메모 전용." },
  { name: "이어폰",   count: 1, emoji: "🎧", note: "집중할 때 필수." },
  { name: "텀블러",   count: 1, emoji: "🥤", note: "아침에 내린 커피." },
  { name: "양우산",     count: 1, emoji: "☂️", note: "접이식. 여름 내내 상비." }
];

var bagBox = document.getElementById("bagBox");
var bagClosed = document.getElementById("bagClosed");
var bagOpen = document.getElementById("bagOpen");
var bagSummary = document.getElementById("bagSummary");
var bagOpenBtn = document.getElementById("bagOpenBtn");
var bagResetBtn = document.getElementById("bagResetBtn");
var bagModal = document.getElementById("bagModal");
var bagModalBtn = document.getElementById("bagModalBtn");
var bagModalClose = document.getElementById("bagModalClose");
var bagModalDone = document.getElementById("bagModalDone");

/**
 * 가방 속 물건을 화면과 콘솔에 출력한다.
 * 반복문으로 소지품 객체를 하나씩 처리한다.
 */
function showMyBag() {
  var totalCount = 0;
  var listHtml = "";
  var textResult = "가방 속 소지품 목록\n\n";

  for (var i = 0; i < myBag.length; i++) {
    var item = myBag[i];

    // 물건이 하나씩 튀어나오도록 순번마다 지연 시간을 준다.
    listHtml = listHtml +
      '<li class="bag-item" style="animation-delay:' + (i * 0.12) + 's">' +
        '<span class="bag-item__emoji" aria-hidden="true">' + item.emoji + '</span>' +
        '<span class="bag-item__name">' + item.name + '</span>' +
        '<span class="bag-item__count">' + item.count + '개</span>' +
        '<span class="bag-item__note">' + item.note + '</span>' +
      '</li>';

    textResult = textResult +
      (i + 1) + ". " + item.name + " (" + item.count + "개) — " + item.note + "\n";

    totalCount = totalCount + item.count;
  }

  textResult = textResult +
    "\n소지품 종류: " + myBag.length + "가지" +
    "\n전체 개수: " + totalCount + "개";

  console.log(textResult);

  if (!bagBox) { return; }

  bagBox.innerHTML = listHtml;

  if (bagSummary) {
    bagSummary.textContent =
      "종류 " + myBag.length + "가지 · 총 " + totalCount + "개";
  }
}

/** 가방을 연다. */
function openBag() {
  bagClosed.hidden = true;
  bagOpen.hidden = false;
  showMyBag();
  bagResetBtn.focus();
}

/** 가방을 다시 닫는다. */
function closeBag() {
  bagOpen.hidden = true;
  bagClosed.hidden = false;
  bagBox.innerHTML = "";
}

function closeBagModal() {
  bagModal.close();
  closeBag();
}

if (bagModal && bagModalBtn) {
  bagModalBtn.addEventListener("click", function () {
    closeBag();
    bagModal.showModal();
    bagOpenBtn.focus();
  });

  bagOpenBtn.addEventListener("click", openBag);
  bagResetBtn.addEventListener("click", function () {
    closeBag();
    bagOpenBtn.focus();
  });
  bagModalClose.addEventListener("click", closeBagModal);
  bagModalDone.addEventListener("click", closeBagModal);

  bagModal.addEventListener("click", function (event) {
    if (event.target === bagModal) {
      closeBagModal();
    }
  });

  bagModal.addEventListener("cancel", closeBag);
}
