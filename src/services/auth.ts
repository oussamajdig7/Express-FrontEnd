import { api, unwrapObject } from './api'
import { clearToken, setToken } from './storage'

type LoginRequest = {
  email: string
  password: string
}

type RegisterRequest = {
  name: string
  email: string
  password: string
}

type TokenResponse =
  | { token: string }
  | { accessToken: string }
  | { jwt: string }
  | { data: { token?: string; accessToken?: string; jwt?: string } }

function pickToken(payload: TokenResponse): string | null {
  const obj = unwrapObject<Record<string, unknown>>(payload) ?? {}
  const token =
    (typeof obj.token === 'string' && obj.token) ||
    (typeof obj.accessToken === 'string' && obj.accessToken) ||
    (typeof obj.jwt === 'string' && obj.jwt) ||
    null
  return token
}

function getAuthPath(kind: 'login' | 'register'): string {
  const loginPath = (import.meta.env.VITE_AUTH_LOGIN_PATH as string | undefined) ?? '/login'
  const registerPath =
    (import.meta.env.VITE_AUTH_REGISTER_PATH as string | undefined) ?? '/register'
  return kind === 'login' ? loginPath : registerPath
}

async function postWith404Fallback<T>(paths: string[], body: unknown) {
  let lastErr: unknown = null
  for (const path of paths) {
    try {
      return await api.post<T>(path, body)
    } catch (err) {
      const anyErr = err as { response?: { status?: number } }
      if (anyErr.response?.status === 404) {
        lastErr = err
        continue
      }
      throw err
    }
  }
  throw lastErr ?? new Error('Request failed')
}

export async function login(body: LoginRequest): Promise<string> {
  const primary = getAuthPath('login')
  const res = await postWith404Fallback<TokenResponse>(
    [primary, '/login', '/auth/login', '/api/login'],
    body,
  )
  const token = pickToken(res.data)
  if (!token) throw new Error('Login succeeded but no token returned')
  setToken(token)
  return token
}

export async function register(body: RegisterRequest): Promise<string | null> {
  const res = await api.post("/vendeurs/create", body)

  const token = pickToken(res.data)
  if (token) setToken(token)
  return token
}

export function logout(): void {
  clearToken()
}
