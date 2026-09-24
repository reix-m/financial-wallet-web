import type { ApiResource } from '@/types/auth'
import type { Paginated, Transaction } from '@/types/transaction'
import type { Wallet } from '@/types/wallet'
import { request } from '@/services/http'

export interface ListTransactionsParams {
  page?: number
  perPage?: number
}

export function showMy (): Promise<ApiResource<Wallet>> {
  return request<ApiResource<Wallet>>('/wallets/my')
}

export function create (): Promise<ApiResource<Wallet>> {
  return request<ApiResource<Wallet>>('/wallets', { method: 'POST' })
}

function idempotencyHeaders (idempotencyKey?: string): Record<string, string> {
  return idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}
}

export function deposit (amount: number, idempotencyKey?: string): Promise<ApiResource<Wallet>> {
  return request<ApiResource<Wallet>>('/wallets/deposit', {
    method: 'POST',
    body: { amount },
    headers: idempotencyHeaders(idempotencyKey),
  })
}

export function transfer (
  targetAccountCode: string,
  amount: number,
  idempotencyKey?: string,
): Promise<ApiResource<Wallet>> {
  return request<ApiResource<Wallet>>('/wallets/transfer', {
    method: 'POST',
    body: { target_account_code: targetAccountCode, amount },
    headers: idempotencyHeaders(idempotencyKey),
  })
}

export function revert (transactionId: number, idempotencyKey?: string): Promise<ApiResource<Wallet>> {
  return request<ApiResource<Wallet>>(`/wallets/transactions/${transactionId}/revert`, {
    method: 'POST',
    headers: idempotencyHeaders(idempotencyKey),
  })
}

export function listTransactions (
  { page = 1, perPage = 15 }: ListTransactionsParams = {},
): Promise<Paginated<Transaction>> {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  })

  return request<Paginated<Transaction>>(`/wallets/transactions?${query.toString()}`)
}
