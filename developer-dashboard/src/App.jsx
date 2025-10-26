import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import GitHubCard from './components/GitHubCard';
import WeatherCard from './components/WeatherCard';
import { getInitialTheme, applyTheme } from './utils/theme';

function App() {
  const [theme, setTheme] = useState(getInitialTheme());
  useEffect(() => applyTheme(theme), [theme]);

  // username state: user can type their GitHub username
  const [username, setUsername] = useState('');

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100`}>
      <Navbar theme={theme} setTheme={setTheme} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded shadow">
              <label className="text-sm block mb-2 text-gray-600 dark:text-gray-300">GitHub Username</label>
              <div className="flex gap-2">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.trim())}
                  placeholder="e.g. octocat"
                  className="flex-1 p-2 border rounded bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Enter a username and the GitHub card will fetch profile data.</p>
            </div>

            <GitHubCard username={username} />
          </div>

          <div className="space-y-4">
            <WeatherCard />
            <div className="bg-white dark:bg-slate-800 p-4 rounded shadow">
              <h3 className="font-semibold text-lg mb-2">Quick Tips</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                <li>Allow geolocation for accurate weather.</li>
                <li>Use a valid GitHub username for profile data.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

