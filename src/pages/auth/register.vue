<template>
  <AuthShell subtitle="Abra sua conta em segundos" title="Criar conta">
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
        v-model="name"
        autocomplete="name"
        class="mb-1"
        :disabled="auth.state.loading"
        :error-messages="serverErrors.name"
        label="Nome"
        prepend-inner-icon="mdi-account-outline"
        :rules="[rules.required]"
        variant="outlined"
      />

      <v-text-field
        v-model="email"
        autocomplete="email"
        class="mb-1"
        :disabled="auth.state.loading"
        :error-messages="serverErrors.email"
        label="E-mail"
        prepend-inner-icon="mdi-email-outline"
        :rules="[rules.required, rules.email]"
        type="email"
        variant="outlined"
      />

      <v-text-field
        v-model="password"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        autocomplete="new-password"
        class="mb-1"
        :disabled="auth.state.loading"
        :error-messages="serverErrors.password"
        hint="Mínimo de 8 caracteres"
        label="Senha"
        prepend-inner-icon="mdi-lock-outline"
        :rules="[rules.required, rules.minLength(8)]"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
        @click:append-inner="showPassword = !showPassword"
      />

      <v-text-field
        v-model="passwordConfirmation"
        autocomplete="new-password"
        class="mb-1"
        :disabled="auth.state.loading"
        label="Confirmar senha"
        prepend-inner-icon="mdi-lock-check-outline"
        :rules="[rules.required, rules.sameAs(() => password)]"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
      />

      <v-btn
        block
        class="mt-2"
        color="primary"
        :loading="auth.state.loading"
        size="large"
        type="submit"
      >
        Criar conta
      </v-btn>
    </v-form>

    <template #footer>
      <p class="text-center text-sm mt-4 mb-0">
        Já tem uma conta?
        <RouterLink class="text-primary font-medium no-underline" :to="{ name: 'login' }">
          Entrar
        </RouterLink>
      </p>
    </template>
  </AuthShell>
</template>

<script setup lang="ts">
  import type { ValidationErrors } from '@/types/auth'
  import type { VForm } from 'vuetify/components'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import AuthShell from '@/components/auth/AuthShell.vue'
  import { useAuth } from '@/stores/auth'
  import { errorMessage, rules, validationErrors } from '@/utils/forms'

  const auth = useAuth()
  const router = useRouter()

  const formRef = ref<InstanceType<typeof VForm>>()
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const passwordConfirmation = ref('')
  const showPassword = ref(false)
  const formError = ref<string | null>(null)
  const serverErrors = ref<ValidationErrors>({})

  async function submit () {
    const valid = await formRef.value?.validate()

    if (!valid?.valid) {
      return
    }

    formError.value = null
    serverErrors.value = {}

    try {
      await auth.register({
        name: name.value.trim(),
        email: email.value.trim().toLowerCase(),
        password: password.value,
      })
      await router.push({ name: 'dashboard' })
    } catch (error) {
      serverErrors.value = validationErrors(error)
      formError.value = errorMessage(error)
    }
  }
</script>
