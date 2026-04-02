export function Loading({ label }: { label?: string }) {
  return <div className="status">{label ?? 'Loading...'}</div>
}

export function ErrorBanner({ message }: { message: string }) {
  return <div className="error">{message}</div>
}

