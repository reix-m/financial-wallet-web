<template>
  <v-dialog v-model="open" max-width="420">
    <v-card rounded="xl">
      <v-card-title class="text-base font-bold">Transferir</v-card-title>

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

        <v-form ref="formRef" @submit.prevent="submit">
          <v-text-field
            v-model="targetAccountCode"
            class="mb-1"
            :disabled="loading"
            :error-messages="serverErrors.target_account_code"
            label="Código da conta"
            prepend-inner-icon="mdi-account-search-outline"
            :rules="[rules.required, rules.accountCode]"
            variant="outlined"
          />

          <CurrencyField
            v-model="amount"
            :error-messages="amountError ?? serverErrors.amount"
            label="Valor da transferência"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn :disabled="loading" variant="text" @click="open = false">Cancelar</v-btn>

        <v-btn color="primary" :loading="loading" @click="submit">Transferir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { ValidationErrors } from '@/types/auth'
  import type { VForm } from 'vuetify/components'
  import { ref, watch } from 'vue'
  import CurrencyField from '@/components/CurrencyField.vue'
  import { useWallet } from '@/stores/wallet'
  import { errorMessage, rules, validationErrors } from '@/utils/forms'

  const open = defineModel<boolean>({ default: false })
  const emit = defineEmits<{ success: [message: string] }>()

  const wallet = useWallet()

  const formRef = ref<InstanceType<typeof VForm>>()
  const targetAccountCode = ref('')
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
    targetAccountCode.value = ''
    amount.value = 0
    amountError.value = null
    formError.value = null
    serverErrors.value = {}
    idempotencyKey.value = crypto.randomUUID()
  }

  async function submit (): Promise<void> {
    const valid = await formRef.value?.validate()

    if (!valid?.valid) {
      return
    }

    if (amount.value <= 0) {
      amountError.value = 'Informe um valor maior que zero.'

      return
    }

    loading.value = true
    formError.value = null
    serverErrors.value = {}

    try {
      await wallet.transfer(targetAccountCode.value.trim(), amount.value, idempotencyKey.value)
      open.value = false
      emit('success', 'Transferência realizada com sucesso.')
    } catch (error) {
      serverErrors.value = validationErrors(error)
      formError.value = errorMessage(error)
    } finally {
      loading.value = false
    }
  }
</script>
