import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger'
}

export default function Button({ variant = 'primary', className, ...props }: Props) {
  const cls = ['btn', variant !== 'primary' ? `btn-${variant}` : '', className ?? '']
    .join(' ')
    .trim()
  return <button {...props} className={cls} />
}

