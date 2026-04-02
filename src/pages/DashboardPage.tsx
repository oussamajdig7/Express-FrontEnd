import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import { ErrorBanner, Loading } from '../components/ui/Status'
import { getErrorMessage } from '../services/api'
import { getStats } from '../services/stats'
import type { Stats } from '../types/models'

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const s = await getStats()
        if (active) setStats(s)
      } catch (err) {
        if (active) setError(getErrorMessage(err))
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Overview</div>
        <div className="page-subtitle">Quick stats across your data</div>
      </div>

      {error ? <ErrorBanner message={error} /> : null}
      {loading ? <Loading /> : null}

      {stats ? (
        <div className="grid">
          <Card title="Clients" value={stats.clients} />
          <Card title="Produits" value={stats.produits} />
          <Card title="Ventes" value={stats.ventes} />
          <Card title="Categories" value={stats.categories} />
        </div>
      ) : null}
    </div>
  )
}

