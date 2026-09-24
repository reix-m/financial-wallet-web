export type TransactionTypeValue = 'deposit' | 'transfer_out' | 'transfer_in' | 'reversal'
export type TransactionStatusValue = 'completed' | 'reversed'
export type TransactionDirection = 'credit' | 'debit'

export interface TransactionTypeInfo {
  value: TransactionTypeValue
  label: string
}

export interface TransactionStatusInfo {
  value: TransactionStatusValue
  label: string
}

export interface Counterparty {
  id: string
  code: string
  user_name: string
}

export interface Transaction {
  id: number
  type: TransactionTypeInfo
  direction: TransactionDirection
  amount: number
  formatted_amount: string
  status: TransactionStatusInfo
  created_at: string | null
  counterparty: Counterparty | null
  reversed_transaction: Transaction | null
}

export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
}

export interface Paginated<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: PaginationMeta
}
