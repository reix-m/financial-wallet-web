import type { ValidationErrors } from '@/types/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

const TOKEN_KEY = 'fw.access_token'
const EXPIRES_AT_KEY = 'fw.access_token_expires_at'

export class ApiError extends Error {
  readonly status: number
  readonly errors: ValidationErrors

  constructor (status: number, message: string, errors: ValidationErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export function getToken (): string | null {
  const token = localStorage.getItem(TOKEN_KEY)

  if (!token) {
    return null
  }

  const expiresAt = localStorage.getItem(EXPIRES_AT_KEY)

  if (expiresAt && Date.parse(expiresAt) <= Date.now()) {
    clearToken()

    return null
  }

  return token
}

export function setToken (token: string, expiresAt?: string): void {
  localStorage.setItem(TOKEN_KEY, token)

  if (expiresAt) {
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt)
  } else {
    localStorage.removeItem(EXPIRES_AT_KEY)
  }
}

export function clearToken (): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EXPIRES_AT_KEY)
}

interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
}

export async function request<T> (
  path: string,
  { method = 'GET', body, auth = true }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getToken()

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (response.status === 204) {
    return undefined as T
  }

  const isJson = response.headers.get('content-type')?.includes('application/json') ?? false
  const payload = isJson ? await response.json() : null

  if (!response.ok) {
    if (response.status === 401) {
      clearToken()
    }

    throw new ApiError(
      response.status,
      payload?.message ?? `Request failed with status ${response.status}`,
      payload?.errors ?? {},
    )
  }

  return payload as T
}
