// ============================================================
//  WeatherCard.jsx  — Main Weather Display
// ============================================================
//
//  CONCEPTS DEMONSTRATED:
//  • Destructuring props
//  • Conditional rendering with &&
//  • Template literals in JSX
//  • Pure helper functions (convertTemp, formatDate)
//  • Rendering API images with <img> and icon URLs
// ============================================================

import { getWeatherIconUrl } from "../utils/weatherApi";
import "./WeatherCard.css";

// ── Helper Functions ─────────────────────────────────────────
//  Pure functions: same input → always same output, no side effects

function convertTemp(celsius, unit) {
  if (unit === "F") return Math.round(celsius * 9 / 5 + 32);
  return celsius;
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// ── Component ────────────────────────────────────────────────
//
//  Props:
//    weather  — normalized object from useWeather hook
//    unit     — "C" or "F"
//
export function WeatherCard({ weather, unit }) {
  const temp = convertTemp(weather.temp, unit);
  const feels = convertTemp(weather.feels, unit);
  const iconUrl = getWeatherIconUrl(weather.iconCode);

  return (
    <div className="weather-card">
      {/* City & Date */}
      <div className="card-header">
        <div>
          <h2 className="city-name">
            {weather.city}
            <span className="country-badge">{weather.country}</span>
          </h2>
          <p className="date-text">{formatDate()}</p>
        </div>
        {/* Weather icon from OpenWeatherMap CDN */}
        <img
          className="weather-icon-img"
          src={iconUrl}
          alt={weather.condition}
        />
      </div>

      {/* Big Temperature */}
      <div className="temp-display">
        <span className="temp-number">{temp}</span>
        <span className="temp-unit">°{unit}</span>
      </div>

      {/* Condition text — capitalize first letter */}
      <p className="condition-text">
        {weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)}
      </p>

      {/* Detail Grid — 4 stats */}
      <div className="details-grid">
        <DetailItem label="Feels Like" value={`${feels}°${unit}`} icon="🌡️" />
        <DetailItem label="Humidity"   value={`${weather.humidity}%`} icon="💧" />
        <DetailItem label="Wind"       value={`${weather.wind} km/h`} icon="💨" />
        <DetailItem label="Condition"  value={weather.condition.split(" ")[0]} icon="🌤️" />
      </div>
    </div>
  );
}

// ── Sub-component: DetailItem ────────────────────────────────
//  Small reusable piece — proves components can be tiny
function DetailItem({ label, value, icon }) {
  return (
    <div className="detail-item">
      <span className="detail-icon">{icon}</span>
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );
}
