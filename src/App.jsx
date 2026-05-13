// ============================================================
//  App.jsx  — Root Component (The Composer)
// ============================================================
//
//  App.jsx is the top of the component tree.
//  It owns the shared state and passes it down via props.
//
//  COMPONENT TREE:
//
//  App
//  ├── SearchBar    (receives: onSearch, disabled)
//  ├── UnitToggle   (receives: unit, onToggle)
//  ├── [Error msg]  (conditional rendering)
//  ├── [Loading]    (conditional rendering)
//  ├── WeatherCard  (receives: weather, unit)
//  └── ForecastRow  (receives: forecast, unit)
//
//  DATA FLOW:
//  useWeather hook → App state → props → child components
// ============================================================

import { useState } from "react";
import { useWeather } from "./hooks/useWeather";
import { SearchBar }  from "./components/SearchBar";
import { WeatherCard } from "./components/WeatherCard";
import { ForecastRow } from "./components/ForecastRow";
import { UnitToggle }  from "./components/UnitToggle";
import "./App.css";

export default function App() {
  // ── Shared state ─────────────────────────────────────────
  // 'unit' lives here because both WeatherCard AND ForecastRow need it
  // This is called "lifting state up"
  const [unit, setUnit] = useState("C");

  // ── Custom hook ──────────────────────────────────────────
  // Destructure everything the hook returns
  const { weather, forecast, loading, error, fetchWeather } = useWeather("London");

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="app">
      {/* Background animated orbs */}
      <div className="bg-orb orb-1" aria-hidden="true" />
      <div className="bg-orb orb-2" aria-hidden="true" />

      <div className="app-inner">
        {/* Header */}
        <header className="app-header">
          <h1 className="app-title">Weather</h1>
          <p className="app-subtitle">Real-time forecasts worldwide</p>
        </header>

        {/* Search: passes fetchWeather as the onSearch callback */}
        <SearchBar onSearch={fetchWeather} disabled={loading} />

        {/* Unit toggle: unit lives here, toggle updates it */}
        <UnitToggle unit={unit} onToggle={setUnit} />

        {/* Error message — only shown when error is truthy */}
        {error && (
          <div className="error-banner" role="alert">
            ⚠️ {error}
          </div>
        )}

        {/* Loading skeleton — shown while fetching */}
        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Fetching weather…</p>
          </div>
        )}

        {/* Weather data — only rendered when we have it and aren't loading */}
        {weather && !loading && (
          <>
            <WeatherCard weather={weather} unit={unit} />
            <ForecastRow forecast={forecast} unit={unit} />
          </>
        )}

        {/* Footer */}
        <footer className="app-footer">
          Powered by OpenWeatherMap API
        </footer>
      </div>
    </div>
  );
}
