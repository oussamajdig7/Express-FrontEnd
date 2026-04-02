import { useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/clients': 'Clients',
  '/produits': 'Produits',
  '/vendeurs': 'Vendeurs',
  '/ventes': 'Ventes',
  '/categories': 'Categories',
}

export default function AdminLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const title = useMemo(() => {
    return titles[location.pathname] ?? 'Admin'
  }, [location.pathname])

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Navbar title={title} onOpenMenu={() => setSidebarOpen(true)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

