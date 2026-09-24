<template>
  <v-dialog v-model="open" max-width="420">
    <v-card rounded="xl">
      <v-card-title class="text-base font-bold">Depositar</v-card-title>

      <v-card-text>
        <v-alert
          v-if="formError"
          class="mb-4"
          density="comfortable"
          type="error"
          variant="tonal"
        >
          {{ formError }}
        </v-alert>

        <CurrencyField
          v-model="amount"
          :error-messages="amountError ?? serverErrors.amount"
          label="Valor do depósito"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn :disabled="loading" variant="text" @click="open = false">Cancelar</v-btn>

        <v-btn color="primary" :loading="loading" @click="submit">Depositar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { ValidationErrors } from '@/types/auth'
  import { ref, watch } from 'vue'
  import CurrencyField from '@/components/CurrencyField.vue'
  import { useWallet } from '@/stores/wallet'
  import { errorMessage, validationErrors } from '@/utils/forms'

  const open = defineModel<boolean>({ default: false })
  const emit = defineEmits<{ success: [message: string] }>()

  const wallet = useWallet()

  const amount = ref(0)
  const amountError = ref<string | null>(null)
  const formError = ref<string | null>(null)
  const serverErrors = ref<ValidationErrors>({})
  const loading = ref(false)
  const idempotencyKey = ref('')

  watch(open, value => {
    if (value) {
      reset()
    }
  })

  watch(amount, () => {
    amountError.value = null
  })

  function reset (): void {
    amount.value = 0
    amountError.value = null
    formError.value = null
    serverErrors.value = {}
    idempotencyKey.value = crypto.randomUUID()
  }

  async function submit (): Promise<void> {
    if (amount.value <= 0) {
      amountError.value = 'Informe um valor maior que zero.'

      return
    }

    loading.value = true
    formError.value = null
    serverErrors.value = {}

    try {
      await wallet.deposit(amount.value, idempotencyKey.value)
      open.value = false
      emit('success', 'Depósito realizado com sucesso.')
    } catch (error) {
      serverErrors.value = validationErrors(error)
      formError.value = errorMessage(error)
    } finally {
      loading.value = false
    }
  }
</script>
