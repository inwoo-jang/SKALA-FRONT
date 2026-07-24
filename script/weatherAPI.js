/* ==========================================================
   script/weatherAPI.js — 날씨 데이터 담당 모듈
   ========================================================== */

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * 위도·경도를 받아 현재 날씨를 가져온다.
 * @param {string} lat 위도
 * @param {string} lon 경도
 * @returns {Promise<Object>} 온도, 습도, 단위, 기준 시각
 */
export async function fetchWeather(lat, lon) {
  // 템플릿 리터럴로 위도·경도를 끼워 요청 주소를 만든다.
  // timezone=auto — 안 주면 UTC 시각이 와서 "기준" 시간이 실시간과 어긋난다.
  const url = `${BASE_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&timezone=auto&forecast_days=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("서버 응답 오류: " + response.status);
  }

  const data = await response.json();

  return {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    tempUnit: data.current_units.temperature_2m,
    time: data.current.time,
    timezone: data.timezone   // 예: "Asia/Seoul" — 현지 시계 표시용
  };
}

/**
 * "37.5665,126.9780" 형태를 위도·경도로 나눈다.
 * @param {string} value
 * @returns {{lat: string, lon: string}}
 */
export function parseCoords(value) {
  const parts = value.split(",");
  return { lat: parts[0], lon: parts[1] };
}
