import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { Field, Input } from '../components/ui/Form'
import { ErrorBanner } from '../components/ui/Status'
import { getErrorMessage } from '../services/api'
import { register } from '../services/auth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const token = await register({ name, email, password })
      navigate(token ? '/dashboard' : '/login', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-title">Create Vendeur Account</div>
        <div className="auth-subtitle">Register to access the admin dashboard</div>

        {error ? <ErrorBanner message={error} /> : null}

        <form className="form" onSubmit={onSubmit}>
          <Field label="Name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              required
            />
          </Field>
          <Field label="Email">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              required
            />
          </Field>
          <Field label="Password">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a strong password"
              type="password"
              autoComplete="new-password"
              required
            />
          </Field>

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Register'}
          </Button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

