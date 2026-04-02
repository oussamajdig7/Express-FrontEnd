import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { Field, Input } from '../components/ui/Form'
import { ErrorBanner } from '../components/ui/Status'
import { getErrorMessage } from '../services/api'
import { login } from '../services/auth'
import { getToken } from '../services/storage'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = useMemo(() => {
    const token = getToken()
    if (token) return '/dashboard'
    const st = location.state as { from?: { pathname?: string } } | null
    return st?.from?.pathname ?? '/dashboard'
  }, [location.state])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login({ email, password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-title">Admin Login</div>
        <div className="auth-subtitle">Sign in to access the dashboard</div>

        {error ? <ErrorBanner message={error} /> : null}

        <form className="form" onSubmit={onSubmit}>
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
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              required
            />
          </Field>

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </Button>
        </form>

        <div className="auth-footer">
          No account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  )
}

