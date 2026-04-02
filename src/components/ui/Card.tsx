import type { ReactNode } from 'react'

export default function Card({
  title,
  value,
  footer,
}: {
  title: string
  value: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      {footer ? <div className="card-footer">{footer}</div> : null}
    </div>
  )
}

