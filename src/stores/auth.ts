import type { AuthResponse, User } from '@/types/auth'
import { computed, reactive, readonly } from 'vue'
import * as authService from '@/services/auth'
import { clearToken, getToken, setToken } from '@/services/http'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
}

const state = reactive<AuthState>({
  user: null,
  loading: false,
  initialized: false,
})

const isAuthenticated = computed(() => state.user !== null)

function applySession (response: AuthResponse): void {
  setToken(response.access_token, response.expires_at)
  state.user = response.data
}

async function login (input: authService.LoginInput): Promise<void> {
  state.loading = true

  try {
    applySession(await authService.login(input))
  } finally {
    state.loading = false
  }
}

async function register (input: authService.RegisterInput): Promise<void> {
  state.loading = true

  try {
    applySession(await authService.register(input))
  } finally {
    state.loading = false
  }
}

function logout (): void {
  clearToken()
  state.user = null
}

async function restoreSession (): Promise<void> {
  if (!getToken()) {
    state.initialized = true

    return
  }

  try {
    const { data } = await authService.me()
    state.user = data
  } catch {
    clearToken()
    state.user = null
  } finally {
    state.initialized = true
  }
}

export function useAuth () {
  return {
    state: readonly(state),
    isAuthenticated,
    login,
    register,
    logout,
    restoreSession,
  }
}
