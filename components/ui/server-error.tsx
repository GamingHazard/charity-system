'use client'

type ServerErrorProps = {
  message: string
}

export function ServerError({ message }: ServerErrorProps) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="mt-8 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      {message}
    </div>
  )
}
