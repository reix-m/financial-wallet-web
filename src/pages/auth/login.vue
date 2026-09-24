<template>
  <AuthShell subtitle="Acesse sua conta" title="Bem-vindo de volta">
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
        autocomplete="current-password"
        class="mb-1"
        :disabled="auth.state.loading"
        :error-messages="serverErrors.password"
        label="Senha"
        prepend-inner-icon="mdi-lock-outline"
        :rules="[rules.required]"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
        @click:append-inner="showPassword = !showPassword"
      />

      <v-btn
        block
        class="mt-2"
        color="primary"
        :loading="auth.state.loading"
        size="large"
        type="submit"
      >
        Entrar
      </v-btn>
    </v-form>

    <template #footer>
      <p class="text-center text-sm mt-4 mb-0">
        Não tem uma conta?
        <RouterLink class="text-primary font-medium no-underline" :to="{ name: 'register' }">
          Cadastre-se
        </RouterLink>
      </p>
    </template>
  </AuthShell>
</template>

<script setup lang="ts">
  import type { ValidationErrors } from '@/types/auth'
  import type { VForm } from 'vuetify/components'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import AuthShell from '@/components/auth/AuthShell.vue'
  import { useAuth } from '@/stores/auth'
  import { errorMessage, rules, validationErrors } from '@/utils/forms'

  const auth = useAuth()
  const route = useRoute()
  const router = useRouter()

  const formRef = ref<InstanceType<typeof VForm>>()
  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const formError = ref<string | null>(null)
  const serverErrors = ref<ValidationErrors>({})

  const redirectTarget = computed(() => {
    const redirect = route.query.redirect

    return typeof redirect === 'string' && redirect.startsWith('/')
      ? redirect
      : { name: 'dashboard' }
  })

  async function submit () {
    const valid = await formRef.value?.validate()

    if (!valid?.valid) {
      return
    }

    formError.value = null
    serverErrors.value = {}

    try {
      await auth.login({
        email: email.value.trim().toLowerCase(),
        password: password.value,
      })
      await router.push(redirectTarget.value)
    } catch (error) {
      serverErrors.value = validationErrors(error)
      formError.value = errorMessage(error)
    }
  }
</script>
