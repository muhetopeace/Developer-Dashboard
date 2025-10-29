import React from 'react'

type ErrorCardProps = {
  message: string
}

export default function ErrorCard({ message }: ErrorCardProps): JSX.Element {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
      {message}
    </div>
  )
}


