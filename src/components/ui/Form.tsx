import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

export function FormRow({ children }: { children: ReactNode }) {
  return <div className="form-row">{children}</div>
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <div className="field-label">{label}</div>
      {children}
    </label>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input(props: InputProps) {
  return <input {...props} className={['input', props.className ?? ''].join(' ').trim()} />
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export function TextArea(props: TextAreaProps) {
  return <textarea {...props} className={['textarea', props.className ?? ''].join(' ').trim()} />
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export function Select(props: SelectProps) {
  return <select {...props} className={['select', props.className ?? ''].join(' ').trim()} />
}
