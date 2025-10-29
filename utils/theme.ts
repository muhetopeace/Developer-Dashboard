export function loadInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  const persisted = localStorage.getItem('theme') as 'light' | 'dark' | null
  if (persisted === 'light' || persisted === 'dark') return persisted
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}


