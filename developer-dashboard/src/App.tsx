import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import GitHubCard from './components/GitHubCard'
import WeatherCard from './components/WeatherCard'
import { loadInitialTheme } from './utils/theme'

export default function App(): JSX.Element {
  const [theme, setTheme] = useState<'light' | 'dark'>(loadInitialTheme())
  const [githubUser, setGithubUser] = useState<string>('muhetopeace')
  const [defaultCity, setDefaultCity] = useState<string>('kigali')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-200 dark:bg-gray-900 dark:text-gray-100">
      <Navbar theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 p-4 sm:grid-cols-2">
        <section className="sm:col-span-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <form
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget as HTMLFormElement
              const user = (form.elements.namedItem('gh') as HTMLInputElement).value.trim()
              const city = (form.elements.namedItem('city') as HTMLInputElement).value.trim()
              if (user) setGithubUser(user)
              if (city) setDefaultCity(city)
            }}
          >
            <input
              name="gh"
              defaultValue={githubUser}
              placeholder="GitHub username"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
            <input
              name="city"
              defaultValue={defaultCity}
              placeholder="Default city (e.g., Kigali)"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
            <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 active:bg-blue-800">
              Apply
            </button>
          </form>
        </section>

        <GitHubCard username={githubUser} />
        <WeatherCard defaultCity={defaultCity} />
      </main>
    </div>
  )
}


