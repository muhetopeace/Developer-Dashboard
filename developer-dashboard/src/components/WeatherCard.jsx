import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import ErrorCard from './ErrorCard';

// default co-ords for Kigali (fallback)
const DEFAULT_COORDS = { lat: -1.9441, lon: 30.0619 };

export default function WeatherCard() {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date());

  // clock updater
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // get geolocation if available, or fallback
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setCoords(DEFAULT_COORDS)
      );
    } else {
      setCoords(DEFAULT_COORDS);
    }
  }, []);

  useEffect(() => {
    if (!coords) return;
    const controller = new AbortController();
    async function fetchWeather() {
      setLoading(true);
      setError(null);
      try {
        // Open-Meteo: current_weather=true
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&timezone=auto`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Weather API ${res.status}`);
        const json = await res.json();
        if (!json.current_weather) throw new Error('No current weather returned');
        setWeather(json.current_weather);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
    return () => controller.abort();
  }, [coords]);

  if (loading) return <Loading message="Fetching weather..." />;
  if (error) return <ErrorCard message={error} />;
  if (!weather) return <div className="p-4 text-sm text-gray-500">Waiting for coordinates...</div>;

  /* Open-Meteo current_weather includes: temperature, windspeed, winddirection, weathercode (number) */
  return (
    <article className="bg-white dark:bg-slate-800 shadow rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Current Weather</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">{time.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{weather.temperature}°C</div>
          <div className="text-sm text-gray-500 dark:text-gray-300">Wind {weather.windspeed} km/h</div>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
        <div>Weather code: {weather.weathercode} (see Open-Meteo docs for codes)</div>
        <div className="mt-2">Wind direction: {weather.winddirection}°</div>
      </div>
    </article>
  );
}
