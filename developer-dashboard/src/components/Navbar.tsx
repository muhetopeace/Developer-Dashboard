import React from 'react'

type NavbarProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps): JSX.Element {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold sm:text-xl">Developer Dashboard</h1>
        <button
          aria-label="Toggle theme"
          onClick={onToggleTheme}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
          <span aria-hidden>
            {theme === 'dark' ? '🌙' : '🌞'}
          </span>
        </button>
      </div>
    </header>
  )
}


