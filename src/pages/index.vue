<template>
  <div class="home">
    <div class="home__content">
      <header class="mb-6 flex items-center justify-between">
        <div>
          <p class="text-xs text-on-surface/60 mb-0">Olá,</p>
          <h1 class="text-xl font-bold mb-0">{{ user?.name }}</h1>
        </div>

        <v-btn color="primary" prepend-icon="mdi-logout" variant="tonal" @click="logout">
          Sair
        </v-btn>
      </header>

      <v-card class="mb-4" elevation="2" rounded="xl">
        <v-card-text>
          <div class="flex items-center gap-3">
            <v-avatar color="primary" rounded="lg" size="44">
              <v-icon color="on-primary">mdi-account-outline</v-icon>
            </v-avatar>

            <div>
              <p class="text-sm font-medium mb-0">{{ user?.email }}</p>

              <p class="text-xs text-on-surface/60 mb-0">
                {{ user?.email_verified_at ? 'E-mail verificado' : 'E-mail ainda não verificado' }}
              </p>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-alert
        v-if="!user?.email_verified_at"
        class="mb-4"
        density="comfortable"
        type="warning"
        variant="tonal"
      >
        Confirme seu e-mail para movimentar sua conta.
      </v-alert>

      <v-alert
        v-if="wallet.state.error"
        class="mb-4"
        density="comfortable"
        type="error"
        variant="tonal"
      >
        {{ wallet.state.error }}
      </v-alert>

      <v-card class="mb-4" elevation="2" rounded="xl">
        <v-card-text>
          <v-skeleton-loader v-if="wallet.state.loading" type="list-item-two-line" />

          <template v-else-if="wallet.state.wallet">
            <p class="text-xs text-on-surface/60 mb-1">Saldo disponível</p>

            <p class="text-3xl font-bold mb-4">{{ wallet.state.wallet.balance }}</p>

            <div class="flex items-center justify-between">
              <span class="text-xs text-on-surface/60">Código da conta</span>
              <span class="font-mono text-sm font-medium">{{ wallet.state.wallet.code }}</span>
            </div>

            <div class="mt-2 flex items-center justify-between">
              <span class="text-xs text-on-surface/60">Aberta em</span>
              <span class="text-sm">{{ formatDateTime(wallet.state.wallet.created_at) }}</span>
            </div>

            <div class="mt-4 flex gap-2">
              <v-btn class="flex-1" color="primary" prepend-icon="mdi-cash-plus" @click="showDeposit = true">
                Depositar
              </v-btn>

              <v-btn
                class="flex-1"
                color="primary"
                prepend-icon="mdi-send"
                variant="tonal"
                @click="showTransfer = true"
              >
                Transferir
              </v-btn>
            </div>
          </template>

          <div v-else-if="wallet.state.notFound" class="text-center">
            <v-avatar class="mb-3" color="surface-variant" rounded="lg" size="48">
              <v-icon>mdi-bank-plus</v-icon>
            </v-avatar>

            <p class="text-sm font-medium mb-1">Você ainda não tem uma conta</p>

            <p class="text-xs text-on-surface/60 mb-4">
              Crie sua conta para começar a depositar e transferir.
            </p>

            <v-btn color="primary" :loading="wallet.state.submitting" @click="createWallet">
              Criar conta
            </v-btn>
          </div>

          <div v-else class="text-center">
            <v-btn variant="tonal" @click="wallet.fetchWallet()">Tentar novamente</v-btn>
          </div>
        </v-card-text>
      </v-card>

      <v-card v-if="wallet.state.wallet" class="mb-4" elevation="2" rounded="xl">
        <v-card-text>
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-base font-bold mb-0">Transações</h2>

            <span v-if="transactions.state.total > 0" class="text-xs text-on-surface/60">
              {{ transactions.state.total }} no total
            </span>
          </div>

          <v-skeleton-loader v-if="transactions.state.loading" type="list-item-two-line@3" />

          <v-alert
            v-else-if="transactions.state.error"
            density="comfortable"
            type="error"
            variant="tonal"
          >
            {{ transactions.state.error }}
          </v-alert>

          <div v-else-if="transactions.state.items.length === 0" class="py-6 text-center">
            <v-icon class="mb-2" size="32">mdi-swap-vertical</v-icon>

            <p class="text-sm text-on-surface/60 mb-0">Nenhuma transação por aqui ainda.</p>
          </div>

          <template v-else>
            <div
              v-for="transaction in transactions.state.items"
              :key="transaction.id"
              class="flex items-center gap-3 border-b border-on-surface/10 py-3 last:border-0"
            >
              <v-avatar
                :color="transaction.direction === 'credit' ? 'success' : 'error'"
                rounded="lg"
                size="40"
                variant="tonal"
              >
                <v-icon>{{ transactionIcon(transaction) }}</v-icon>
              </v-avatar>

              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <p class="truncate text-sm font-medium mb-0">{{ transaction.type.label }}</p>

                  <v-chip
                    v-if="transaction.status.value === 'reversed'"
                    color="warning"
                    size="x-small"
                    variant="tonal"
                  >
                    Estornada
                  </v-chip>
                </div>

                <p class="truncate text-xs text-on-surface/60 mb-0">
                  {{ transactionDetail(transaction) }}
                </p>
              </div>

              <div class="text-right">
                <p
                  :class="[
                    'text-sm font-bold mb-0',
                    transaction.direction === 'credit' ? 'text-success' : 'text-error',
                  ]"
                >
                  {{ transaction.direction === 'credit' ? '+' : '-' }} {{ transaction.formatted_amount }}
                </p>

                <p class="text-xs text-on-surface/60 mb-0">{{ formatDateTime(transaction.created_at) }}</p>
              </div>

              <v-tooltip v-if="canRevert(transaction)" location="top" text="Reverter transação">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-undo-variant"
                    size="small"
                    variant="text"
                    @click="openRevert(transaction)"
                  />
                </template>
              </v-tooltip>
            </div>

            <div
              v-if="transactions.state.currentPage < transactions.state.lastPage"
              class="mt-4 text-center"
            >
              <v-btn
                :loading="transactions.state.loadingMore"
                variant="tonal"
                @click="transactions.loadMore()"
              >
                Carregar mais
              </v-btn>
            </div>
          </template>
        </v-card-text>
      </v-card>

      <DepositDialog v-model="showDeposit" @success="onOperationSuccess" />

      <TransferDialog v-model="showTransfer" @success="onOperationSuccess" />

      <RevertDialog v-model="showRevert" :transaction="revertTarget" @success="onOperationSuccess" />

      <v-snackbar v-model="snackbar" color="success" location="top" :timeout="2500">
        {{ snackbarMessage }}
      </v-snackbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { Transaction } from '@/types/transaction'
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import DepositDialog from '@/components/wallet/DepositDialog.vue'
  import RevertDialog from '@/components/wallet/RevertDialog.vue'
  import TransferDialog from '@/components/wallet/TransferDialog.vue'
  import { useAuth } from '@/stores/auth'
  import { useTransactions } from '@/stores/transactions'
  import { useWallet } from '@/stores/wallet'
  import { formatDateTime } from '@/utils/format'

  const auth = useAuth()
  const wallet = useWallet()
  const transactions = useTransactions()
  const router = useRouter()

  const user = computed(() => auth.state.user)

  const showDeposit = ref(false)
  const showTransfer = ref(false)
  const showRevert = ref(false)
  const revertTarget = ref<Transaction | null>(null)
  const snackbar = ref(false)
  const snackbarMessage = ref('')

  onMounted(async () => {
    await wallet.fetchWallet()

    if (wallet.state.wallet) {
      await transactions.fetchTransactions()
    }
  })

  async function createWallet () {
    await wallet.createWallet()

    if (wallet.state.wallet) {
      await transactions.fetchTransactions()
    }
  }

  function canRevert (transaction: Transaction): boolean {
    return transaction.status.value === 'completed' && transaction.type.value !== 'reversal'
  }

  function openRevert (transaction: Transaction): void {
    revertTarget.value = transaction
    showRevert.value = true
  }

  function onOperationSuccess (message: string): void {
    snackbarMessage.value = message
    snackbar.value = true
    transactions.fetchTransactions(1)
  }

  function transactionIcon (transaction: Transaction): string {
    switch (transaction.type.value) {
      case 'deposit': {
        return 'mdi-cash-plus'
      }
      case 'transfer_in': {
        return 'mdi-arrow-down-left'
      }
      case 'transfer_out': {
        return 'mdi-arrow-up-right'
      }
      case 'reversal': {
        return 'mdi-undo-variant'
      }
      default: {
        return 'mdi-swap-vertical'
      }
    }
  }

  function transactionDetail (transaction: Transaction): string {
    if (transaction.counterparty) {
      return transaction.direction === 'credit'
        ? `De ${transaction.counterparty.user_name}`
        : `Para ${transaction.counterparty.user_name}`
    }

    return transaction.status.label
  }

  function logout () {
    auth.logout()
    wallet.reset()
    transactions.reset()
    router.push({ name: 'login' })
  }
</script>

<style scoped>
  .home {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding: 48px 20px;
    background:
      radial-gradient(circle at top, rgba(var(--v-theme-primary), 0.12), transparent 55%),
      rgb(var(--v-theme-background));
  }

  .home__content {
    width: 100%;
    max-width: 560px;
  }
</style>
