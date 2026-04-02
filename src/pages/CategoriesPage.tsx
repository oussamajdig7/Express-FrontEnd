import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '../components/ui/Button'
import { Field, FormRow, Input } from '../components/ui/Form'
import Table, { type Column } from '../components/ui/Table'
import { ErrorBanner, Loading } from '../components/ui/Status'
import { getErrorMessage } from '../services/api'
import { createResource, deleteResource, listResource, updateResource } from '../services/resources'
import type { Categorie } from '../types/models'

type FormState = {
  name: string
  coleur: string
}

const emptyForm: FormState = { name: '', coleur: '' }

export default function CategoriesPage() {
  const [rows, setRows] = useState<Categorie[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setRows(await listResource<Categorie>('/categories'))
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
    async (c: Categorie) => {
      const ok = window.confirm(`Delete categorie "${c.name}"?`)
      if (!ok) return
      setSaving(true)
      setError(null)
      try {
        await deleteResource('/categories', c.id)
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

  const columns = useMemo((): Array<Column<Categorie>> => {
    return [
      { header: 'ID', width: '80px', render: (c) => c.id },
      { header: 'Name', render: (c) => c.name },
      { header: 'Coleur', render: (c) => c.coleur },
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
                setForm({ name: c.name ?? '', coleur: c.coleur ?? '' })
              }}
            >
              Edit
            </Button>
            <Button type="button" variant="danger" onClick={() => onDelete(c)} disabled={saving}>
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
    const payload = { name: form.name.trim(), coleur: form.coleur.trim() }
    try {
      if (editingId) await updateResource<Categorie>('/categories', editingId, payload)
      else await createResource<Categorie>('/categories', payload)
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
          <div className="page-title">Categories</div>
          <div className="page-subtitle">Manage categories</div>
        </div>
        <Button type="button" variant="secondary" onClick={onCancel}>
          New Categorie
        </Button>
      </div>

      {error ? <ErrorBanner message={error} /> : null}

      <div className="panel">
        <div className="panel-title">
          {editingId ? `Edit Categorie #${editingId}` : 'Create Categorie'}
        </div>
        <form className="form" onSubmit={onSubmit}>
          <FormRow>
            <Field label="Name">
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </Field>
            <Field label="Coleur">
              <Input
                value={form.coleur}
                onChange={(e) => setForm((f) => ({ ...f, coleur: e.target.value }))}
                placeholder="e.g. #ff0000"
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
      <Table columns={columns} rows={rows} keyOf={(r) => r.id} emptyText="No categories yet" />
    </div>
  )
}
