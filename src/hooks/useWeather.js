// ============================================================
//  useWeather.js  — Custom React Hook
// ============================================================
//
//  A "custom hook" is just a function that uses built-in hooks
//  (useState, useEffect) and packages them for reuse.
//
//  RULE: Hook names always start with "use"
//
//  WHY: Keeps App.jsx clean — it only handles rendering.
//       All data-fetching logic lives here.
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { getCurrentWeather, getForecast } from "../utils/weatherApi";

// The hook returns an object with everything the UI needs
export function useWeather(defaultCity = "London") {
  // ── State ────────────────────────────────────────────────
  const [weather, setWeather] = useState(null);   // current conditions
  const [forecast, setForecast] = useState([]);   // 5-day array
  const [loading, setLoading] = useState(false);  // spinner flag
  const [error, setError] = useState("");         // error message

  // ── fetchWeather ─────────────────────────────────────────
  //
  //  useCallback memoizes the function so it doesn't get
  //  recreated on every render — important for useEffect deps.
  //
  const fetchWeather = useCallback(async (city) => {
    if (!city.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Step 1: Get current weather (also gives us lat/lon)
      const current = await getCurrentWeather(city);
      setWeather(current);

      // Step 2: Use lat/lon to get the forecast
      const days = await getForecast(current.lat, current.lon);
      setForecast(days);

    } catch (err) {
      // Friendly messages for common API errors
      if (err.message.includes("404") || err.message.toLowerCase().includes("not found")) {
        setError(`"${city}" not found. Check the spelling and try again.`);
      } else if (err.message.includes("401")) {
        setError("Invalid API key. Check your .env file.");
      } else {
        setError(`Something went wrong: ${err.message}`);
      }
      setWeather(null);
      setForecast([]);
    } finally {
      // Always runs — hides the spinner whether success or fail
      setLoading(false);
    }
  }, []);

  // ── Load default city on mount ───────────────────────────
  useEffect(() => {
    fetchWeather(defaultCity);
  }, [defaultCity, fetchWeather]);

  // ── Return everything the UI needs ───────────────────────
  return { weather, forecast, loading, error, fetchWeather };
}
