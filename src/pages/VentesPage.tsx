import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '../components/ui/Button'
import { Field, FormRow, Input, Select } from '../components/ui/Form'
import Table, { type Column } from '../components/ui/Table'
import { ErrorBanner, Loading } from '../components/ui/Status'
import { getErrorMessage } from '../services/api'
import { createResource, deleteResource, listResource, updateResource } from '../services/resources'
import type { Client, Produit, Vente } from '../types/models'

type FormState = {
  idProduit: string
  idClient: string
  Qte: string
  CordonnéGPS: string
}

const emptyForm: FormState = { idProduit: '', idClient: '', Qte: '', CordonnéGPS: '' }

export default function VentesPage() {
  const [rows, setRows] = useState<Vente[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [v, p, c] = await Promise.all([
        listResource<Vente>('/ventes'),
        listResource<Produit>('/produits'),
        listResource<Client>('/clients'),
      ])
      setRows(v)
      setProduits(p)
      setClients(c)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const onCancel = useCallback(() => {
    setEditingId(null)
    setForm(emptyForm)
  }, [])

  const onDelete = useCallback(
    async (v: Vente) => {
      const ok = window.confirm(`Delete vente #${v.id}?`)
      if (!ok) return
      setSaving(true)
      setError(null)
      try {
        await deleteResource('/ventes', v.id)
        await refresh()
        if (editingId === v.id) onCancel()
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setSaving(false)
      }
    },
    [editingId, onCancel, refresh],
  )

  const columns = useMemo((): Array<Column<Vente>> => {
    return [
      { header: 'ID', width: '80px', render: (v) => v.id },
      { header: 'Produit', render: (v) => v.produit?.name ?? String(v.idProduit) },
      {
        header: 'Client',
        render: (v) => {
          const c = v.client
          if (c) return `${c.name} ${c.prenom}`
          return String(v.idClient)
        },
      },
      { header: 'Qte', width: '90px', render: (v) => v.Qte },
      { header: 'GPS', render: (v) => v.CordonnéGPS },
      {
        header: 'Created',
        render: (v) => (v.createdAt ? new Date(v.createdAt).toLocaleString() : '-'),
      },
      {
        header: 'Actions',
        width: '220px',
        render: (v) => (
          <div className="row-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingId(v.id)
                setForm({
                  idProduit: String(v.idProduit ?? ''),
                  idClient: String(v.idClient ?? ''),
                  Qte: String(v.Qte ?? ''),
                  CordonnéGPS: v.CordonnéGPS ?? '',
                })
              }}
            >
              Edit
            </Button>
            <Button type="button" variant="danger" onClick={() => onDelete(v)} disabled={saving}>
              Delete
            </Button>
          </div>
        ),
      },
    ]
  }, [onDelete, saving])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = {
      idProduit: Number(form.idProduit),
      idClient: Number(form.idClient),
      Qte: Number(form.Qte),
      CordonnéGPS: form.CordonnéGPS.trim(),
    }
    try {
      if (editingId) await updateResource<Vente>('/ventes', editingId, payload)
      else await createResource<Vente>('/ventes', payload)
      await refresh()
      onCancel()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header split">
        <div>
          <div className="page-title">Ventes</div>
          <div className="page-subtitle">Manage ventes</div>
        </div>
        <Button type="button" variant="secondary" onClick={onCancel}>
          New Vente
        </Button>
      </div>

      {error ? <ErrorBanner message={error} /> : null}

      <div className="panel">
        <div className="panel-title">{editingId ? `Edit Vente #${editingId}` : 'Create Vente'}</div>
        <form className="form" onSubmit={onSubmit}>
          <FormRow>
            <Field label="Produit">
              <Select
                value={form.idProduit}
                onChange={(e) => setForm((f) => ({ ...f, idProduit: e.target.value }))}
                required
              >
                <option value="" disabled>
                  Select produit...
                </option>
                {produits.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Client">
              <Select
                value={form.idClient}
                onChange={(e) => setForm((f) => ({ ...f, idClient: e.target.value }))}
                required
              >
                <option value="" disabled>
                  Select client...
                </option>
                {clients.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name} {c.prenom}
                  </option>
                ))}
              </Select>
            </Field>
          </FormRow>

          <FormRow>
            <Field label="Qte">
              <Input
                value={form.Qte}
                onChange={(e) => setForm((f) => ({ ...f, Qte: e.target.value }))}
                type="number"
                min="0"
                required
              />
            </Field>
            <Field label="CordonnéGPS">
              <Input
                value={form.CordonnéGPS}
                onChange={(e) => setForm((f) => ({ ...f, CordonnéGPS: e.target.value }))}
                placeholder="lat,lng"
                required
              />
            </Field>
          </FormRow>

          <div className="form-actions">
            {editingId ? (
              <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
                Cancel
              </Button>
            ) : null}
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>

      {loading ? <Loading /> : null}
      <Table columns={columns} rows={rows} keyOf={(r) => r.id} emptyText="No ventes yet" />
    </div>
  )
}
