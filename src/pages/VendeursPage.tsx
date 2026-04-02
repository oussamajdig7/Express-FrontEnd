import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '../components/ui/Button'
import { Field, FormRow, Input } from '../components/ui/Form'
import Table, { type Column } from '../components/ui/Table'
import { ErrorBanner, Loading } from '../components/ui/Status'
import { getErrorMessage } from '../services/api'
import { createResource, deleteResource, listResource, updateResource } from '../services/resources'
import type { Vendeur } from '../types/models'

type FormState = {
  name: string
  email: string
  password: string
}

const emptyForm: FormState = { name: '', email: '', password: '' }

export default function VendeursPage() {
  const [rows, setRows] = useState<Vendeur[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setRows(await listResource<Vendeur>('/vendeurs'))
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
    async (v: Vendeur) => {
      const ok = window.confirm(`Delete vendeur "${v.name}"?`)
      if (!ok) return
      setSaving(true)
      setError(null)
      try {
        await deleteResource('/vendeurs', v.id)
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

  const columns = useMemo((): Array<Column<Vendeur>> => {
    return [
      { header: 'ID', width: '80px', render: (v) => v.id },
      { header: 'Name', render: (v) => v.name },
      { header: 'Email', render: (v) => v.email },
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
                setForm({ name: v.name ?? '', email: v.email ?? '', password: '' })
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
    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      email: form.email.trim(),
    }
    if (form.password.trim()) payload.password = form.password

    try {
      if (editingId) await updateResource<Vendeur>('/vendeurs', editingId, payload)
      else await createResource<Vendeur>('/vendeurs', { ...payload, password: form.password })
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
          <div className="page-title">Vendeurs</div>
          <div className="page-subtitle">Manage vendeurs (admin)</div>
        </div>
        <Button type="button" variant="secondary" onClick={onCancel}>
          New Vendeur
        </Button>
      </div>

      {error ? <ErrorBanner message={error} /> : null}

      <div className="panel">
        <div className="panel-title">{editingId ? `Edit Vendeur #${editingId}` : 'Create Vendeur'}</div>
        <form className="form" onSubmit={onSubmit}>
          <FormRow>
            <Field label="Name">
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </Field>
            <Field label="Email">
              <Input
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                type="email"
                required
              />
            </Field>
          </FormRow>

          <Field label={editingId ? 'Password (leave empty to keep)' : 'Password'}>
            <Input
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              type="password"
              required={!editingId}
            />
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
      <Table columns={columns} rows={rows} keyOf={(r) => r.id} emptyText="No vendeurs yet" />
    </div>
  )
}
