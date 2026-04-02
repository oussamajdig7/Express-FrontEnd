import { api, unwrapList, unwrapObject } from './api'

function normalizePath(path: string): string {
  if (!path) return ''
  const p = path.startsWith('/') ? path : `/${path}`
  return p.endsWith('/') ? p.slice(0, -1) : p
}

function withAction(base: string, action: 'get' | 'create'): string {
  const p = normalizePath(base)
  if (p.endsWith(`/${action}`)) return p
  return `${p}/${action}`
}

function withActionAndId(base: string, action: 'update' | 'delete', id: number): string {
  const p = normalizePath(base)
  if (p.endsWith(`/${action}`)) return `${p}/${id}`
  return `${p}/${action}/${id}`
}

export async function listResource<T>(path: string): Promise<T[]> {
  const res = await api.get(withAction(path, 'get'))
  return unwrapList<T>(res.data)
}

export async function createResource<T>(path: string, body: unknown): Promise<T> {
  const res = await api.post(withAction(path, 'create'), body)
  return unwrapObject<T>(res.data)
}

export async function updateResource<T>(
  path: string,
  id: number,
  body: unknown,
): Promise<T> {
  const res = await api.put(withActionAndId(path, 'update', id), body)
  return unwrapObject<T>(res.data)
}

export async function deleteResource(path: string, id: number): Promise<void> {
  await api.delete(withActionAndId(path, 'delete', id))
}
