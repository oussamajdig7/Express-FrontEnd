import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import { getToken } from '../services/storage'
import CategoriesPage from '../pages/CategoriesPage'
import ClientsPage from '../pages/ClientsPage'
import DashboardPage from '../pages/DashboardPage'
import LoginPage from '../pages/LoginPage'
import ProduitsPage from '../pages/ProduitsPage'
import RegisterPage from '../pages/RegisterPage'
import VendeursPage from '../pages/VendeursPage'
import VentesPage from '../pages/VentesPage'
import ProtectedRoute from './ProtectedRoute'

function HomeRedirect() {
  const token = getToken()
  return <Navigate to={token ? '/dashboard' : '/login'} replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/produits" element={<ProduitsPage />} />
          <Route path="/vendeurs" element={<VendeursPage />} />
          <Route path="/ventes" element={<VentesPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  )
}

