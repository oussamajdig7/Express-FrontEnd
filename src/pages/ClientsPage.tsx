import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '../components/ui/Button'
import { Field, FormRow, Input, Select } from '../components/ui/Form'
import Table, { type Column } from '../components/ui/Table'
import { ErrorBanner, Loading } from '../components/ui/Status'
import { getErrorMessage } from '../services/api'
import { createResource, deleteResource, listResource, updateResource } from '../services/resources'
import type { Client, Vendeur } from '../types/models'

type ClientForm = {
  name: string
  prenom: string
  idVendeur: string
}

const emptyForm: ClientForm = {
  name: '',
  prenom: '',
  idVendeur: '',
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [vendeurs, setVendeurs] = useState<Vendeur[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<ClientForm>(emptyForm)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [c, v] = await Promise.all([
        listResource<Client>('/clients'),
        listResource<Vendeur>('/vendeurs'),
      ])
      setClients(c)
      setVendeurs(v)
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
    async (c: Client) => {
      const ok = window.confirm(`Delete client "${c.name} ${c.prenom}"?`)
      if (!ok) return
      setSaving(true)
      setError(null)
      try {
        await deleteResource('/clients', c.id)
        await refresh()
        if (editingId === c.id) onCancel()
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setSaving(false)
      }
    },
    [editingId, onCancel, refresh],
  )

  const columns = useMemo((): Array<Column<Client>> => {
    return [
      { header: 'ID', width: '80px', render: (c) => c.id },
      { header: 'Name', render: (c) => c.name },
      { header: 'Prenom', render: (c) => c.prenom },
      {
        header: 'Vendeur',
        render: (c) => c.vendeur?.name ?? String(c.idVendeur),
      },
      {
        header: 'Created',
        render: (c) => (c.createdAt ? new Date(c.createdAt).toLocaleString() : '-'),
      },
      {
        header: 'Actions',
        width: '220px',
        render: (c) => (
          <div className="row-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingId(c.id)
                setForm({
                  name: c.name ?? '',
                  prenom: c.prenom ?? '',
                  idVendeur: String(c.idVendeur ?? ''),
                })
              }}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => onDelete(c)}
              disabled={saving}
            >
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
      name: form.name.trim(),
      prenom: form.prenom.trim(),
      idVendeur: Number(form.idVendeur),
    }

    try {
      if (editingId) {
        await updateResource<Client>('/clients', editingId, payload)
      } else {
        await createResource<Client>('/clients', payload)
      }
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
          <div className="page-title">Clients</div>
          <div className="page-subtitle">Create, update and delete clients</div>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setEditingId(null)
            setForm(emptyForm)
          }}
        >
          New Client
        </Button>
      </div>

      {error ? <ErrorBanner message={error} /> : null}

      <div className="panel">
        <div className="panel-title">{editingId ? `Edit Client #${editingId}` : 'Create Client'}</div>
        <form className="form" onSubmit={onSubmit}>
          <FormRow>
            <Field label="Name">
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </Field>
            <Field label="Prenom">
              <Input
                value={form.prenom}
                onChange={(e) => setForm((f) => ({ ...f, prenom: e.target.value }))}
                required
              />
            </Field>
          </FormRow>

          <Field label="Vendeur">
            <Select
              value={form.idVendeur}
              onChange={(e) => setForm((f) => ({ ...f, idVendeur: e.target.value }))}
              required
            >
              <option value="" disabled>
                Select vendeur...
              </option>
              {vendeurs.map((v) => (
                <option key={v.id} value={String(v.id)}>
                  {v.name} ({v.email})
                </option>
              ))}
            </Select>
          </Field>

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
      <Table columns={columns} rows={clients} keyOf={(c) => c.id} emptyText="No clients yet" />
    </div>
  )
}
