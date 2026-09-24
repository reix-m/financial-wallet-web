import type { ApiResource, AuthResponse, User } from '@/types/auth'
import { request } from '@/services/http'

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export function login (input: LoginInput): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: input,
    auth: false,
  })
}

export function register (input: RegisterInput): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: input,
    auth: false,
  })
}

export function me (): Promise<ApiResource<User>> {
  return request<ApiResource<User>>('/auth/me')
}
