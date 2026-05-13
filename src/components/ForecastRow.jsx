// ============================================================
//  ForecastRow.jsx  — 5-Day Forecast Strip
// ============================================================
//
//  CONCEPTS DEMONSTRATED:
//  • Array.map() to render a list of components
//  • key prop — required when rendering lists (helps React's
//    reconciliation algorithm track which item is which)
//  • Staggered CSS animations via inline style animation-delay
// ============================================================

import { getWeatherIconUrl } from "../utils/weatherApi";
import "./ForecastRow.css";

// Props:
//   forecast — array of 5 day objects from useWeather hook
//   unit     — "C" or "F"
export function ForecastRow({ forecast, unit }) {
  if (!forecast.length) return null;

  return (
    <div className="forecast-section">
      <p className="forecast-title">5-Day Forecast</p>
      <div className="forecast-row">
        {/* .map() turns the data array into a JSX element array */}
        {forecast.map((day, index) => (
          <ForecastDay
            key={day.day}   // key must be unique — helps React diff the list
            day={day}
            unit={unit}
            delay={index}  // stagger the entrance animation
          />
        ))}
      </div>
    </div>
  );
}

// ── ForecastDay ───────────────────────────────────────────────
//  Each card in the row. Receives its own slice of data via props.

function ForecastDay({ day, unit, delay }) {
  const temp = unit === "F"
    ? Math.round(day.temp * 9 / 5 + 32)
    : day.temp;

  return (
    <div
      className="forecast-day"
      style={{ animationDelay: `${delay * 80}ms` }} // stagger each card
    >
      <p className="fday-name">{day.day}</p>
      <img
        className="fday-icon"
        src={getWeatherIconUrl(day.iconCode)}
        alt={day.condition}
      />
      <p className="fday-temp">{temp}°{unit}</p>
      <p className="fday-condition">{day.condition}</p>
    </div>
  );
}
