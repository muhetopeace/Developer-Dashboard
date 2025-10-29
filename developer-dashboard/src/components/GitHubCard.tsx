import { useEffect, useState } from 'react'
import Loading from './Loading'
import ErrorCard from './ErrorCard'

type GitHubCardProps = {
  username: string
}

type GitHubUser = {
  avatar_url: string
  public_repos: number
  followers: number
  following: number
  html_url: string
  name: string | null
  login: string
}

export default function GitHubCard({ username }: GitHubCardProps): JSX.Element {
  const [data, setData] = useState<GitHubUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false
    async function fetchUser() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`)
        if (!res.ok) throw new Error(`GitHub responded ${res.status}`)
        const json = (await res.json()) as GitHubUser
        if (!isCancelled) setData(json)
      } catch (e) {
        if (!isCancelled) setError('Failed to load GitHub profile. Check the username or network.')
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }
    fetchUser()
    return () => {
      isCancelled = true
    }
  }, [username])

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <h2 className="mb-3 text-lg font-semibold">GitHub Profile</h2>
      {loading && <Loading />}
      {error && <ErrorCard message={error} />}
      {!loading && !error && data && (
        <div className="flex items-center gap-4">
          <img src={data.avatar_url} alt="avatar" className="h-16 w-16 rounded-full border border-gray-200 dark:border-gray-800" />
          <div className="flex-1">
            <a href={data.html_url} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              {data.name ?? data.login}
            </a>
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-md bg-gray-50 p-2 text-center dark:bg-gray-900">
                <div className="font-semibold">{data.public_repos}</div>
                <div className="text-gray-500 dark:text-gray-400">Repos</div>
              </div>
              <div className="rounded-md bg-gray-50 p-2 text-center dark:bg-gray-900">
                <div className="font-semibold">{data.followers}</div>
                <div className="text-gray-500 dark:text-gray-400">Followers</div>
              </div>
              <div className="rounded-md bg-gray-50 p-2 text-center dark:bg-gray-900">
                <div className="font-semibold">{data.following}</div>
                <div className="text-gray-500 dark:text-gray-400">Following</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}


