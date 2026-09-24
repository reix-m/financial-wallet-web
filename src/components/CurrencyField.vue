<template>
  <v-text-field
    :disabled="disabled"
    :error-messages="errorMessages"
    inputmode="numeric"
    :label="label"
    :model-value="displayValue"
    prefix="R$"
    variant="outlined"
    @update:model-value="handleInput"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  defineProps<{
    label: string
    disabled?: boolean
    errorMessages?: string | string[]
  }>()

  const model = defineModel<number>({ required: true })

  const displayValue = computed(() =>
    (model.value / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  )

  function handleInput (value: string): void {
    const digits = String(value).replace(/\D/g, '')

    model.value = digits === '' ? 0 : Number.parseInt(digits, 10)
  }
</script>
