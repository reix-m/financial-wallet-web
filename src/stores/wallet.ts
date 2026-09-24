import type { Wallet } from '@/types/wallet'
import { reactive, readonly } from 'vue'
import { ApiError } from '@/services/http'
import * as walletService from '@/services/wallet'
import { errorMessage } from '@/utils/forms'

interface WalletState {
  wallet: Wallet | null
  loading: boolean
  submitting: boolean
  error: string | null
  notFound: boolean
}

const state = reactive<WalletState>({
  wallet: null,
  loading: false,
  submitting: false,
  error: null,
  notFound: false,
})

async function fetchWallet (): Promise<void> {
  state.loading = true
  state.error = null
  state.notFound = false

  try {
    const { data } = await walletService.showMy()
    state.wallet = data
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      state.wallet = null
      state.notFound = true
    } else {
      state.error = errorMessage(error)
    }
  } finally {
    state.loading = false
  }
}

async function createWallet (): Promise<void> {
  state.submitting = true
  state.error = null

  try {
    const { data } = await walletService.create()
    state.wallet = data
    state.notFound = false
  } catch (error) {
    state.error = errorMessage(error)
  } finally {
    state.submitting = false
  }
}

async function deposit (amount: number, idempotencyKey?: string): Promise<void> {
  const { data } = await walletService.deposit(amount, idempotencyKey)
  state.wallet = data
}

async function transfer (targetAccountCode: string, amount: number, idempotencyKey?: string): Promise<void> {
  const { data } = await walletService.transfer(targetAccountCode, amount, idempotencyKey)
  state.wallet = data
}

async function revert (transactionId: number, idempotencyKey?: string): Promise<void> {
  const { data } = await walletService.revert(transactionId, idempotencyKey)
  state.wallet = data
}

function reset (): void {
  state.wallet = null
  state.loading = false
  state.submitting = false
  state.error = null
  state.notFound = false
}

export function useWallet () {
  return {
    state: readonly(state),
    fetchWallet,
    createWallet,
    deposit,
    transfer,
    revert,
    reset,
  }
}
