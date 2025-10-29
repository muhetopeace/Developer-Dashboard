import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import GitHubCard from './components/GitHubCard'
import WeatherCard from './components/WeatherCard'
import { loadInitialTheme } from './utils/theme'

export default function App(): JSX.Element {
  const [theme, setTheme] = useState<'light' | 'dark'>(loadInitialTheme())

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
        <GitHubCard username="octocat" />
        <WeatherCard defaultCity="San Francisco" />
      </main>
    </div>
  )
}


