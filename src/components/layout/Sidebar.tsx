import { NavLink } from 'react-router-dom'

type Props = {
  open: boolean
  onClose: () => void
}

const navItems: Array<{ to: string; label: string }> = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/clients', label: 'Clients' },
  { to: '/produits', label: 'Produits' },
  { to: '/ventes', label: 'Ventes' },
  { to: '/categories', label: 'Categories' },
  { to: '/vendeurs', label: 'Vendeurs' },
]

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      <div className={open ? 'sidebar-backdrop open' : 'sidebar-backdrop'} onClick={onClose} />
      <aside className={open ? 'sidebar open' : 'sidebar'}>
        <div className="sidebar-header">
          <div className="brand">Admin</div>
          <button className="icon-btn" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

