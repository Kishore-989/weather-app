# React Weather App 🌤️

A production-grade React weather app with real OpenWeatherMap API integration,
animations, unit conversion, and 5-day forecasts.

---

## Quick Start

### 1. Get a Free API Key
1. Go to https://openweathermap.org/api
2. Sign up (free)
3. Go to your profile → **API keys** tab
4. Copy your key

### 2. Setup
```bash
# Clone or unzip the project, then:
cd weather-app
npm install

# Create your .env file
cp .env.example .env

# Open .env and replace YOUR_API_KEY_HERE with your real key
```

### 3. Run
```bash
npm start
# Opens at http://localhost:3000
```

### 4. Build for production
```bash
npm run build
# Optimised files go to /build folder
```

---

## Project Structure & What Each File Does

```
weather-app/
├── public/
│   └── index.html          ← HTML shell — React mounts into <div id="root">
│
├── src/
│   ├── index.js            ← Entry point — calls ReactDOM.createRoot()
│   ├── App.jsx             ← Root component — composes everything
│   ├── App.css             ← Global styles + animated background
│   │
│   ├── hooks/
│   │   └── useWeather.js   ← Custom hook — all data fetching logic
│   │
│   ├── utils/
│   │   └── weatherApi.js   ← API utility — raw fetch calls + data normalisation
│   │
│   └── components/
│       ├── SearchBar.jsx   ← Controlled input + search button
│       ├── SearchBar.css
│       ├── UnitToggle.jsx  ← °C / °F switch
│       ├── UnitToggle.css
│       ├── WeatherCard.jsx ← Main weather display card
│       ├── WeatherCard.css
│       ├── ForecastRow.jsx ← 5-day horizontal forecast strip
│       └── ForecastRow.css
│
├── .env.example            ← Template for environment variables
├── .env                    ← Your actual API key (git-ignored!)
└── package.json            ← Dependencies and scripts
```

---

## React Concepts Used — Full Explanation

### 1. Components
Every `.jsx` file is a **component** — a function that returns JSX (HTML-like syntax).

```jsx
// Simple component
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Usage:
<Greeting name="World" />
```

Components are reusable. `ForecastDay` is rendered 5 times with different data.

---

### 2. useState
Stores data that can change. When state updates, React re-renders the component.

```js
const [unit, setUnit] = useState("C");
//     ↑ read    ↑ write   ↑ initial value

setUnit("F"); // triggers re-render with new value
```

---

### 3. useEffect
Runs code *after* the component renders. Used for API calls, timers, subscriptions.

```js
useEffect(() => {
  fetchWeather("London");
}, []); // [] = run once on mount only
```

The dependency array controls when it runs:
- `[]` → once on mount
- `[city]` → every time `city` changes
- no array → every render

---

### 4. Custom Hooks (useWeather)
A function starting with `use` that wraps built-in hooks.
Lets you extract and reuse stateful logic across components.

```js
// Instead of this mess in App.jsx:
const [weather, setWeather] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
// ... 40 lines of fetch logic ...

// You write this:
const { weather, forecast, loading, error, fetchWeather } = useWeather("London");
```

---

### 5. Props
Read-only data passed from parent to child.

```jsx
// Parent:
<WeatherCard weather={weather} unit="C" />

// Child receives it:
function WeatherCard({ weather, unit }) {
  return <div>{weather.city} — {weather.temp}°{unit}</div>;
}
```

---

### 6. Conditional Rendering
Show/hide elements based on state.

```jsx
{loading && <Spinner />}               // show if loading is true
{error && <Error msg={error} />}       // show if error is truthy
{weather && <WeatherCard {...} />}     // show only when data exists
```

---

### 7. List Rendering with .map()
Turn an array of data into an array of JSX elements.

```jsx
{forecast.map((day, index) => (
  <ForecastDay
    key={day.day}   // ← required! helps React track list items
    day={day}
    index={index}
  />
))}
```

Always include a unique `key` prop — React uses it to reconcile the list.

---

### 8. Async/Await + Error Handling

```js
async function fetchWeather(city) {
  setLoading(true);
  try {
    const data = await getCurrentWeather(city); // waits for API
    setWeather(data);
  } catch (err) {
    setError(err.message); // handles network errors, 404s, etc.
  } finally {
    setLoading(false); // always runs
  }
}
```

---

### 9. Lifting State Up
`unit` lives in `App.jsx` because both `WeatherCard` and `ForecastRow` need it.
If state only one component needs it, keep it local.

```
App.jsx         ← unit state lives HERE
├── WeatherCard ← gets unit via props
└── ForecastRow ← gets unit via props
    └── ForecastDay ← gets unit via props
```

---

### 10. Environment Variables
Never hardcode API keys in source code. Use `.env` files.

```
REACT_APP_WEATHER_API_KEY=abc123
```

```js
// Access in code:
const key = process.env.REACT_APP_WEATHER_API_KEY;
```

React only exposes env vars prefixed with `REACT_APP_`.
The `.env` file is listed in `.gitignore` so it's never committed.

---

## API Reference

### getCurrentWeather(city)
Calls: `GET /weather?q={city}&units=metric`
Returns normalised object: `{ city, country, temp, feels, humidity, wind, condition, iconCode, lat, lon }`

### getForecast(lat, lon)
Calls: `GET /forecast?lat={lat}&lon={lon}&units=metric`
Returns: Array of 5 day objects: `{ day, temp, iconCode, condition }`

### getWeatherIconUrl(iconCode)
Returns: Image URL string for OpenWeatherMap weather icons

---

## Extending the App

Ideas for your next steps:

- **Geolocation**: Use `navigator.geolocation.getCurrentPosition()` to auto-detect city
- **Search history**: Save recent searches with `localStorage`
- **Hourly forecast**: Add `/forecast` hourly breakdown chart
- **Dark/Light mode**: Toggle theme with a context + CSS variables
- **Favourites**: Let users pin cities with a ⭐ button
- **React Router**: Add pages — `/` for search, `/city/:name` for detail view
