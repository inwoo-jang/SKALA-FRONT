/* ==========================================================
   script/weather.js — 실시간 날씨 (모듈 분리 전 초기 버전)
   ※ 이후 weatherAPI.js + realtimeInfo.js로 분리했으므로
     index.html은 모듈 버전을 읽어들인다. 이 파일은 분리 전
     버전을 참고용으로 남겨둔 것이다.
   ========================================================== */

var citySelect = document.getElementById("citySelect");
var weatherBox = document.getElementById("weather-box");

/* ---------- 좌표만 표시 ---------- */
function showCityInfo() {
  var value = citySelect.value;

  if (value === "") {
    weatherBox.innerHTML = "<p>도시를 선택하면 위치 정보가 표시됩니다.</p>";
    return;
  }

  var coords = value.split(",");
  var lat = coords[0];
  var lon = coords[1];
  var cityName = citySelect.options[citySelect.selectedIndex].text;

  weatherBox.innerHTML =
    "<h4>" + cityName + "</h4>" +
    "<p>위도: " + lat + "</p>" +
    "<p>경도: " + lon + "</p>";
}

/* ---------- 비동기 호출 ---------- */
async function loadWeather() {
  var value = citySelect.value;

  if (value === "") {
    weatherBox.innerHTML = "<p>도시를 선택하면 현재 날씨를 보여드립니다.</p>";
    return;
  }

  var coords = value.split(",");
  var lat = coords[0];
  var lon = coords[1];
  var cityName = citySelect.options[citySelect.selectedIndex].text;

  weatherBox.innerHTML =
    "<h4>" + cityName + "</h4>" +
    "<p class='weather-loading'>로딩 중… ⏳</p>";

  try {
    var url = "https://api.open-meteo.com/v1/forecast" +
              "?latitude=" + lat +
              "&longitude=" + lon +
              "&current=temperature_2m,relative_humidity_2m";

    var response = await fetch(url);

    if (!response.ok) {
      throw new Error("서버 응답 오류: " + response.status);
    }

    var data = await response.json();

    var temp = data.current.temperature_2m;
    var humidity = data.current.relative_humidity_2m;
    var unit = data.current_units.temperature_2m;

    weatherBox.innerHTML =
      "<h4>" + cityName + "</h4>" +
      "<dl class='weather-data'>" +
        "<dt>기온</dt><dd>" + temp + unit + "</dd>" +
        "<dt>습도</dt><dd>" + humidity + "%</dd>" +
        "<dt>위치</dt><dd>" + lat + ", " + lon + "</dd>" +
      "</dl>";

  } catch (error) {
    console.error("날씨 정보를 가져오지 못했습니다.", error);
    weatherBox.innerHTML =
      "<h4>" + cityName + "</h4>" +
      "<p class='weather-error'>날씨 정보를 불러오지 못했습니다.<br>" +
      "잠시 후 다시 시도해 주세요.</p>";
  }
}

if (citySelect) {
  citySelect.addEventListener("change", loadWeather);
}
