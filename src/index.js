// ============================================================
//  index.js  — Application Entry Point
// ============================================================
//
//  This is the FIRST file that runs.
//  It mounts the React app into the <div id="root"> in index.html
//
//  React 18 uses createRoot() instead of the old ReactDOM.render()
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Find the <div id="root"> in public/index.html
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render our App component inside it
// React.StrictMode helps catch bugs during development
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
