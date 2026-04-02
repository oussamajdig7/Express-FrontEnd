import axios from 'axios'
import { getToken } from './storage'

export const api = axios.create({
  baseURL: "http://localhost:5000",
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]
  const maybe = payload as { data?: unknown; items?: unknown; results?: unknown }
  const list = maybe?.data ?? maybe?.items ?? maybe?.results
  return Array.isArray(list) ? (list as T[]) : []
}

export function unwrapObject<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const maybe = payload as { data?: unknown }
    if (maybe.data && typeof maybe.data === 'object') return maybe.data as T
  }
  return payload as T
}

export function getErrorMessage(err: unknown): string {
  if (!err) return 'Unknown error'
  if (typeof err === 'string') return err
  if (typeof err === 'object') {
    const anyErr = err as { message?: unknown; response?: { data?: unknown } }
    const msg = anyErr.message
    if (typeof msg === 'string' && msg.trim()) return msg

    const data = anyErr.response?.data as unknown
    if (typeof data === 'string' && data.trim()) return data
    if (data && typeof data === 'object') {
      const anyData = data as { message?: unknown; error?: unknown }
      if (typeof anyData.message === 'string' && anyData.message.trim())
        return anyData.message
      if (typeof anyData.error === 'string' && anyData.error.trim())
        return anyData.error
    }
  }
  return 'Request failed'
}
