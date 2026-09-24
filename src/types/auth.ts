export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface ApiResource<T> {
  data: T
}

export interface AuthResponse extends ApiResource<User> {
  access_token: string
  token_type: string
  expires_at: string
}

export interface ValidationErrors {
  [field: string]: string[]
}
