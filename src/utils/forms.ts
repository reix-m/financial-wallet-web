import type { ValidationErrors } from '@/types/auth'
import { ApiError } from '@/services/http'

export const rules = {
  required: (value: unknown) => Boolean(value) || 'Campo obrigatório',
  email: (value: string) =>
    /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(value) || 'Informe um e-mail válido',
  minLength: (min: number) => (value: string) =>
    (value?.length ?? 0) >= min || `Use ao menos ${min} caracteres`,
  sameAs: (target: () => string) => (value: string) =>
    value === target() || 'As senhas não coincidem',
}

export function validationErrors (error: unknown): ValidationErrors {
  return error instanceof ApiError ? error.errors : {}
}

export function errorMessage (error: unknown): string | null {
  if (error instanceof ApiError) {
    return Object.keys(error.errors).length > 0
      ? 'Verifique os campos destacados.'
      : error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Algo deu errado. Tente novamente.'
}
