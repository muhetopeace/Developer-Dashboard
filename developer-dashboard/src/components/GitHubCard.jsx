import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import ErrorCard from './ErrorCard';

export default function GitHubCard({ username }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;
    const controller = new AbortController();
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.github.com/users/${username}`, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`GitHub returned ${res.status}`);
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
    return () => controller.abort();
  }, [username]);

  if (!username) return <div className="p-4 text-sm text-gray-500">Enter a GitHub username above to fetch profile.</div>;
  if (loading) return <Loading message="Fetching GitHub profile..." />;
  if (error) return <ErrorCard message={error} />;

  return data ? (
    <article className="bg-white dark:bg-slate-800 shadow rounded-lg p-4">
      <div className="flex items-center gap-4">
        <img src={data.avatar_url} alt={`${data.login} avatar`} className="w-20 h-20 rounded-full object-cover" />
        <div>
          <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{data.name || data.login}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">@{data.login}</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{data.bio}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-300">Repos</div>
          <div className="font-semibold text-slate-800 dark:text-slate-100">{data.public_repos}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-300">Followers</div>
          <div className="font-semibold text-slate-800 dark:text-slate-100">{data.followers}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-300">Following</div>
          <div className="font-semibold text-slate-800 dark:text-slate-100">{data.following}</div>
        </div>
      </div>

      <div className="mt-4">
        <a href={data.html_url} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400">View on GitHub</a>
      </div>
    </article>
  ) : null;
}
