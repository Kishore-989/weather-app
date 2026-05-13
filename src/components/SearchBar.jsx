// ============================================================
//  SearchBar.jsx  — Controlled Input Component
// ============================================================
//
//  CONCEPTS DEMONSTRATED:
//  • Controlled component (value driven by state)
//  • Event handlers: onChange, onKeyDown, onClick
//  • Props: onSearch passed down from parent (App.jsx)
// ============================================================

import { useState } from "react";
import "./SearchBar.css";

// Props:
//   onSearch(city) — called when user submits a city name
//   disabled       — true while a fetch is in progress
export function SearchBar({ onSearch, disabled }) {
  // Local state: only this component needs to know what's typed
  const [input, setInput] = useState("");

  function handleSubmit() {
    if (input.trim() && !disabled) {
      onSearch(input.trim());
      setInput(""); // clear after search
    }
  }

  // Submit on Enter key — better UX than clicking only
  function handleKey(e) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="search-bar">
      <input
        className="search-input"
        type="text"
        placeholder="Search city… e.g. Tokyo, New York"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
        aria-label="City search"
      />
      <button
        className="search-btn"
        onClick={handleSubmit}
        disabled={disabled || !input.trim()}
        aria-label="Search"
      >
        {disabled ? "…" : "Search"}
      </button>
    </div>
  );
}
