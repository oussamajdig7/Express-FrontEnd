import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '../components/ui/Button'
import { Field, FormRow, Input, Select, TextArea } from '../components/ui/Form'
import Table, { type Column } from '../components/ui/Table'
import { ErrorBanner, Loading } from '../components/ui/Status'
import { getErrorMessage } from '../services/api'
import { createResource, deleteResource, listResource, updateResource } from '../services/resources'
import type { Categorie, Produit } from '../types/models'

type ProduitForm = {
  name: string
  description: string
  price: string
  IdCategorie: string
}

const emptyForm: ProduitForm = {
  name: '',
  description: '',
  price: '',
  IdCategorie: '',
}

export default function ProduitsPage() {
  const [produits, setProduits] = useState<Produit[]>([])
  const [categories, setCategories] = useState<Categorie[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<ProduitForm>(emptyForm)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [p, c] = await Promise.all([
        listResource<Produit>('/produits'),
        listResource<Categorie>('/categories'),
      ])
      setProduits(p)
      setCategories(c)
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
    async (p: Produit) => {
      const ok = window.confirm(`Delete produit "${p.name}"?`)
      if (!ok) return
      setSaving(true)
      setError(null)
      try {
        await deleteResource('/produits', p.id)
        await refresh()
        if (editingId === p.id) onCancel()
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setSaving(false)
      }
    },
    [editingId, onCancel, refresh],
  )

  const columns = useMemo((): Array<Column<Produit>> => {
    return [
      { header: 'ID', width: '80px', render: (p) => p.id },
      { header: 'Name', render: (p) => p.name },
      {
        header: 'Price',
        width: '120px',
        render: (p) => Number(p.price ?? 0).toFixed(2),
      },
      {
        header: 'Categorie',
        render: (p) => p.categorie?.name ?? String(p.IdCategorie),
      },
      {
        header: 'Created',
        render: (p) => (p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'),
      },
      {
        header: 'Actions',
        width: '220px',
        render: (p) => (
          <div className="row-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingId(p.id)
                setForm({
                  name: p.name ?? '',
                  description: p.description ?? '',
                  price: String(p.price ?? ''),
                  IdCategorie: String(p.IdCategorie ?? ''),
                })
              }}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => onDelete(p)}
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
      description: form.description.trim(),
      price: Number(form.price),
      IdCategorie: Number(form.IdCategorie),
    }

    try {
      if (editingId) {
        await updateResource<Produit>('/produits', editingId, payload)
      } else {
        await createResource<Produit>('/produits', payload)
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
          <div className="page-title">Produits</div>
          <div className="page-subtitle">Create, update and delete produits</div>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setEditingId(null)
            setForm(emptyForm)
          }}
        >
          New Produit
        </Button>
      </div>

      {error ? <ErrorBanner message={error} /> : null}

      <div className="panel">
        <div className="panel-title">
          {editingId ? `Edit Produit #${editingId}` : 'Create Produit'}
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
            <Field label="Price">
              <Input
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                type="number"
                step="0.01"
                min="0"
                required
              />
            </Field>
          </FormRow>

          <Field label="Description">
            <TextArea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
            />
          </Field>

          <Field label="Categorie">
            <Select
              value={form.IdCategorie}
              onChange={(e) => setForm((f) => ({ ...f, IdCategorie: e.target.value }))}
              required
            >
              <option value="" disabled>
                Select categorie...
              </option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
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
      <Table columns={columns} rows={produits} keyOf={(p) => p.id} emptyText="No produits yet" />
    </div>
  )
}
