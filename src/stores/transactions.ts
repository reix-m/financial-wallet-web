import type { Transaction } from '@/types/transaction'
import { reactive, readonly } from 'vue'
import { ApiError } from '@/services/http'
import * as walletService from '@/services/wallet'
import { errorMessage } from '@/utils/forms'

interface TransactionsState {
  items: Transaction[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  currentPage: number
  lastPage: number
  total: number
  initialized: boolean
}

const state = reactive<TransactionsState>({
  items: [],
  loading: false,
  loadingMore: false,
  error: null,
  currentPage: 1,
  lastPage: 1,
  total: 0,
  initialized: false,
})

async function fetchTransactions (page = 1): Promise<void> {
  if (page === 1) {
    state.loading = true
  } else {
    state.loadingMore = true
  }

  state.error = null

  try {
    const response = await walletService.listTransactions({ page })

    state.items = page === 1 ? response.data : [...state.items, ...response.data]
    state.currentPage = response.meta.current_page
    state.lastPage = response.meta.last_page
    state.total = response.meta.total
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      state.items = []
      state.total = 0
    } else {
      state.error = errorMessage(error)
    }
  } finally {
    state.loading = false
    state.loadingMore = false
    state.initialized = true
  }
}

function loadMore (): Promise<void> | undefined {
  if (state.loading || state.loadingMore || state.currentPage >= state.lastPage) {
    return undefined
  }

  return fetchTransactions(state.currentPage + 1)
}

function reset (): void {
  state.items = []
  state.loading = false
  state.loadingMore = false
  state.error = null
  state.currentPage = 1
  state.lastPage = 1
  state.total = 0
  state.initialized = false
}

export function useTransactions () {
  return {
    state: readonly(state),
    fetchTransactions,
    loadMore,
    reset,
  }
}
