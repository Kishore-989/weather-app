// ============================================================
//  UnitToggle.jsx  — °C / °F Switch
// ============================================================
//
//  CONCEPTS DEMONSTRATED:
//  • Lifting state up: 'unit' lives in App.jsx, not here
//  • Callback props: onToggle is a function passed from parent
//  • Conditional className for active state
// ============================================================

import "./UnitToggle.css";

// Props:
//   unit     — current unit: "C" or "F"  (from App.jsx state)
//   onToggle — function to call when user clicks a button
export function UnitToggle({ unit, onToggle }) {
  return (
    <div className="unit-toggle" role="group" aria-label="Temperature unit">
      <button
        className={`unit-btn ${unit === "C" ? "active" : ""}`}
        onClick={() => onToggle("C")}
        aria-pressed={unit === "C"}
      >
        °C
      </button>
      <button
        className={`unit-btn ${unit === "F" ? "active" : ""}`}
        onClick={() => onToggle("F")}
        aria-pressed={unit === "F"}
      >
        °F
      </button>
    </div>
  );
}
