/* ==========================================================
   script/realtimeInfo.js — 실시간 날씨 화면 표시 담당 모듈
   ========================================================== */

import { fetchWeather, parseCoords } from "./weatherAPI.js";

const citySelect = document.getElementById("citySelect");
const weatherCity = document.getElementById("weatherCity");
const weatherLocalTime = document.getElementById("weatherLocalTime");
const weatherDetail = document.getElementById("weatherDetail");
const cityToggle = document.getElementById("cityToggle");
const cityMenu = document.getElementById("cityMenu");

/* ---------- 현지 시계 ---------- */

let currentTimezone = null;   // 예: "Asia/Seoul" — 날씨 응답에서 받는다

/** 선택한 도시의 현지 날짜·시간을 지역명 아래에 보여준다 */
function renderLocalTime() {
  if (!weatherLocalTime) { return; }

  if (!currentTimezone) {
    weatherLocalTime.textContent = "";
    return;
  }

  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: currentTimezone,
    year: "numeric", month: "2-digit", day: "2-digit",
    weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
  }).formatToParts(new Date());

  const get = (type) => {
    const found = parts.find((p) => p.type === type);
    return found ? found.value : "";
  };

  weatherLocalTime.textContent =
    get("year") + "." + get("month") + "." + get("day") +
    " (" + get("weekday") + ") " + get("hour") + ":" + get("minute");
}

// 화면에 떠 있는 동안 시계가 멈춰 보이지 않게 30초마다 갱신한다
setInterval(renderLocalTime, 30000);

/* ---------- 날씨 화면 ---------- */

/** 로딩 중 화면 */
function renderLoading(cityName) {
  weatherCity.textContent = cityName;
  weatherDetail.innerHTML = "<p class='weather-loading'>로딩 중… ⏳</p>";
}

/** 조회 성공 화면 — 위도/경도 좌표도 함께 보여준다 */
function renderWeather(cityName, weather, lat, lon) {
  weatherCity.textContent = cityName;
  weatherDetail.innerHTML =
    "<dl class='weather-data'>" +
      "<dt>기온</dt><dd>" + weather.temperature + weather.tempUnit + "</dd>" +
      "<dt>습도</dt><dd>" + weather.humidity + "%</dd>" +
      "<dt>좌표</dt><dd>" + lat + ", " + lon + "</dd>" +
      "<dt>기준</dt><dd>" + weather.time.replace("T", " ") + "</dd>" +
    "</dl>";
}

/** 조회 실패 화면 */
function renderError(cityName) {
  weatherCity.textContent = cityName;
  weatherDetail.innerHTML =
    "<p class='weather-error'>날씨 정보를 불러오지 못했습니다.<br>" +
    "잠시 후 다시 시도해 주세요.</p>";
}

/** 도시 변경 처리 */
async function handleCityChange() {
  const value = citySelect.value;
  const cityName = citySelect.options[citySelect.selectedIndex].text;
  const { lat, lon } = parseCoords(value);

  renderLoading(cityName);

  try {
    const weather = await fetchWeather(lat, lon);
    renderWeather(cityName, weather, lat, lon);

    // 도시의 시간대로 현지 시계를 맞춘다
    currentTimezone = weather.timezone;
    renderLocalTime();
  } catch (error) {
    console.error("날씨 조회 실패", error);
    currentTimezone = null;
    renderLocalTime();
    renderError(cityName);
  }
}

/* ---------- 지역 선택 메뉴 ----------
   도시 목록의 원본은 숨겨진 select 하나이고,
   화면에 보이는 메뉴는 그 option들로 만들어진다. */

/** select의 option을 그대로 옮겨 담아 메뉴를 만든다 */
function buildCityMenu() {
  for (const option of citySelect.options) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "city-menu__item";
    btn.textContent = option.text;
    btn.dataset.value = option.value;
    li.appendChild(btn);
    cityMenu.appendChild(li);
  }
}

/** 현재 선택된 도시에 표시를 남긴다 */
function markSelectedCity() {
  const items = cityMenu.querySelectorAll(".city-menu__item");
  for (const item of items) {
    item.classList.toggle("is-selected", item.dataset.value === citySelect.value);
  }
}

function openCityMenu() {
  markSelectedCity();
  cityMenu.hidden = false;
  cityToggle.setAttribute("aria-expanded", "true");
}

function closeCityMenu() {
  cityMenu.hidden = true;
  cityToggle.setAttribute("aria-expanded", "false");
}

function toggleCityMenu() {
  if (cityMenu.hidden) {
    openCityMenu();
  } else {
    closeCityMenu();
  }
}

/* ---------- 초기화 ---------- */

if (citySelect && cityMenu) {
  buildCityMenu();

  citySelect.addEventListener("change", handleCityChange);
  cityToggle.addEventListener("click", toggleCityMenu);

  // 메뉴에서 도시를 고르면 select 값에 반영하고 change로 이어준다
  // (같은 도시를 다시 골라도 메뉴는 항상 닫힌다)
  cityMenu.addEventListener("click", (event) => {
    const item = event.target.closest(".city-menu__item");
    if (!item) return;

    closeCityMenu();

    if (item.dataset.value !== citySelect.value) {
      citySelect.value = item.dataset.value;
      citySelect.dispatchEvent(new Event("change"));
    }
  });

  // 메뉴 바깥을 클릭하거나 Esc를 누르면 닫는다
  document.addEventListener("click", (event) => {
    if (!cityMenu.hidden && !event.target.closest(".city-picker")) {
      closeCityMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCityMenu();
    }
  });

  // 기본 선택 도시(서울)의 날씨를 처음부터 보여준다
  handleCityChange();
}
