<template>
  <v-dialog v-model="open" max-width="420">
    <v-card rounded="xl">
      <v-card-title class="text-base font-bold">Reverter transação</v-card-title>

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

        <p v-if="transaction" class="text-sm mb-0">
          Tem certeza que deseja reverter
          <strong>{{ transaction.type.label }}</strong>
          de <strong>{{ transaction.formatted_amount }}</strong>?
        </p>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn :disabled="loading" variant="text" @click="open = false">Cancelar</v-btn>

        <v-btn color="error" :loading="loading" @click="submit">Reverter</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { Transaction } from '@/types/transaction'
  import { ref, watch } from 'vue'
  import { useWallet } from '@/stores/wallet'
  import { errorMessage } from '@/utils/forms'

  const open = defineModel<boolean>({ default: false })
  const props = defineProps<{ transaction: Transaction | null }>()
  const emit = defineEmits<{ success: [message: string] }>()

  const wallet = useWallet()

  const formError = ref<string | null>(null)
  const loading = ref(false)
  const idempotencyKey = ref('')

  watch(open, value => {
    if (value) {
      formError.value = null
      idempotencyKey.value = crypto.randomUUID()
    }
  })

  async function submit (): Promise<void> {
    if (!props.transaction) {
      return
    }

    loading.value = true
    formError.value = null

    try {
      await wallet.revert(props.transaction.id, idempotencyKey.value)
      open.value = false
      emit('success', 'Transação revertida com sucesso.')
    } catch (error) {
      formError.value = errorMessage(error)
    } finally {
      loading.value = false
    }
  }
</script>
