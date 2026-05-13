// ============================================================
//  weatherApi.js  — All API communication lives here
// ============================================================
//
//  We keep API logic SEPARATE from components.
//  Components just call these functions and get back clean data.
//
//  API Used: OpenWeatherMap (free tier)
//  Docs: https://openweathermap.org/api/one-call-3
// ============================================================

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = process.env.REACT_APP_WEATHER_BASE_URL;

// ------------------------------------------------------------
//  Helper: throw a readable error if the response is not OK
// ------------------------------------------------------------
async function handleResponse(response) {
  if (!response.ok) {
    // The API returns a JSON body with a message on errors
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${response.status}`);
  }
  return response.json();
}

// ------------------------------------------------------------
//  getCurrentWeather(city)
//
//  Fetches current conditions for a city name.
//  Returns a normalized object so the UI never touches raw API shape.
// ------------------------------------------------------------
export async function getCurrentWeather(city) {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const raw = await fetch(url).then(handleResponse);

  // Normalize: pick only the fields our UI needs
  return {
    city: raw.name,
    country: raw.sys.country,
    temp: Math.round(raw.main.temp),
    feels: Math.round(raw.main.feels_like),
    humidity: raw.main.humidity,
    wind: Math.round(raw.wind.speed * 3.6), // m/s → km/h
    condition: raw.weather[0].description,
    iconCode: raw.weather[0].icon,
    lat: raw.coord.lat,
    lon: raw.coord.lon,
  };
}

// ------------------------------------------------------------
//  getForecast(lat, lon)
//
//  Fetches 5-day / 3-hour forecast using coordinates.
//  We group by day and take the midday (12:00) reading.
// ------------------------------------------------------------
export async function getForecast(lat, lon) {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const raw = await fetch(url).then(handleResponse);

  // Group the 3-hour slots into days, pick the 12:00 slot per day
  const byDay = {};
  raw.list.forEach((slot) => {
    const date = slot.dt_txt.split(" ")[0]; // "2024-06-10"
    const hour = slot.dt_txt.split(" ")[1]; // "12:00:00"
    if (hour === "12:00:00" || !byDay[date]) {
      byDay[date] = {
        day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        temp: Math.round(slot.main.temp),
        iconCode: slot.weather[0].icon,
        condition: slot.weather[0].main,
      };
    }
  });

  // Return next 5 days (skip today — index 0)
  return Object.values(byDay).slice(1, 6);
}

// ------------------------------------------------------------
//  getWeatherIconUrl(iconCode)
//
//  Builds the OpenWeatherMap icon image URL.
//  Example: "10d" → sunny-rainy day icon
// ------------------------------------------------------------
export function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
