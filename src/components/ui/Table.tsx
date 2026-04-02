import type { ReactNode } from 'react'

export type Column<T> = {
  header: string
  render: (row: T) => ReactNode
  width?: string
}

type Props<T> = {
  columns: Array<Column<T>>
  rows: T[]
  keyOf: (row: T) => string | number
  emptyText?: string
}

export default function Table<T>({ columns, rows, keyOf, emptyText }: Props<T>) {
  if (!rows.length) return <div className="empty">{emptyText ?? 'No data'}</div>

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.header} style={c.width ? { width: c.width } : undefined}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={keyOf(row)}>
              {columns.map((c) => (
                <td key={c.header}>{c.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

