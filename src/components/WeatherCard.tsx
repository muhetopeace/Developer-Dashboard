import { useEffect, useMemo, useState } from 'react'
import Loading from './Loading'
import ErrorCard from './ErrorCard'

type WeatherCardProps = {
  defaultCity: string
}

type GeocodeResult = {
  results?: Array<{
    name: string
    latitude: number
    longitude: number
    country?: string
  }>
}

type CurrentWeather = {
  temperature: number
  windspeed: number
  weathercode: number
  time: string
}

function formatWeatherCode(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Drizzle: light',
    53: 'Drizzle: moderate',
    55: 'Drizzle: dense',
    61: 'Rain: slight',
    63: 'Rain: moderate',
    65: 'Rain: heavy',
    71: 'Snow: slight',
    73: 'Snow: moderate',
    75: 'Snow: heavy',
    80: 'Rain showers: slight',
    81: 'Rain showers: moderate',
    82: 'Rain showers: violent',
    95: 'Thunderstorm',
    96: 'Thunderstorm w/ hail',
    99: 'Thunderstorm w/ heavy hail'
  }
  return map[code] ?? 'Unknown'
}

export default function WeatherCard({ defaultCity }: WeatherCardProps): JSX.Element {
  const [city, setCity] = useState<string>(defaultCity)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [weather, setWeather] = useState<CurrentWeather | null>(null)
  const [resolvedName, setResolvedName] = useState<string>(defaultCity)
  const [now, setNow] = useState<Date>(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function fetchWeather(): Promise<void> {
      setLoading(true)
      setError(null)
      try {
        // 1) Geocode city to lat/lon
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?count=1&name=${encodeURIComponent(city)}`
        )
        if (!geoRes.ok) throw new Error('Geocoding failed')
        const geo = (await geoRes.json()) as GeocodeResult
        const place = geo.results?.[0]
        if (!place) throw new Error('City not found')

        // 2) Get current weather
        const wxRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true`
        )
        if (!wxRes.ok) throw new Error('Weather fetch failed')
        const wxJson = (await wxRes.json()) as { current_weather: CurrentWeather }

        if (!cancelled) {
          setWeather(wxJson.current_weather)
          setResolvedName(`${place.name}${place.country ? ', ' + place.country : ''}`)
        }
      } catch (e) {
        if (!cancelled) setError('Failed to load weather. Try a different city or check network.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchWeather()
    return () => {
      cancelled = true
    }
  }, [city])

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <h2 className="mb-3 text-lg font-semibold">Current Weather</h2>

      <form
        className="mb-4 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget as HTMLFormElement
          const input = form.elements.namedItem('city') as HTMLInputElement
          setCity(input.value.trim() || defaultCity)
        }}
      >
        <input
          defaultValue={defaultCity}
          name="city"
          placeholder="Enter city (e.g., London)"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
        />
        <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 active:bg-blue-800">
          Update
        </button>
      </form>

      {loading && <Loading />}
      {error && <ErrorCard message={error} />}
      {!loading && !error && weather && (
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-900">
            <div className="text-gray-500 dark:text-gray-400">Location</div>
            <div className="text-base font-semibold">{resolvedName}</div>
          </div>
          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-900">
            <div className="text-gray-500 dark:text-gray-400">Temperature</div>
            <div className="text-base font-semibold">{weather.temperature}°C</div>
          </div>
          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-900">
            <div className="text-gray-500 dark:text-gray-400">Condition</div>
            <div className="text-base font-semibold">{formatWeatherCode(weather.weathercode)}</div>
          </div>
          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-900">
            <div className="text-gray-500 dark:text-gray-400">Wind</div>
            <div className="text-base font-semibold">{weather.windspeed} km/h</div>
          </div>
          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-900 sm:col-span-2">
            <div className="text-gray-500 dark:text-gray-400">Current Time</div>
            <div className="text-base font-semibold">{now.toLocaleString()}</div>
          </div>
        </div>
      )}
    </section>
  )
}


