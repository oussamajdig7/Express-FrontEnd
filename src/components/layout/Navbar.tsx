import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/auth'

type Props = {
  title?: string
  onOpenMenu: () => void
}

export default function Navbar({ title, onOpenMenu }: Props) {
  const navigate = useNavigate()

  function onLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="icon-btn" onClick={onOpenMenu} aria-label="Open menu">
          ☰
        </button>
        <div className="navbar-title">{title ?? 'Dashboard'}</div>
      </div>
      <div className="navbar-right">
        <button className="btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

