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
              <v-icon color="on-primary">mdi-bank-outline</v-icon>
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

      <v-card elevation="2" rounded="xl">
        <v-card-text>
          <h2 class="text-base font-bold mb-2">Sua conta</h2>

          <p class="text-sm text-on-surface/60 mb-0">
            Em breve você poderá realizar depósitos, transferências e reverter transações por aqui.
          </p>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuth } from '@/stores/auth'

  const auth = useAuth()
  const router = useRouter()

  const user = computed(() => auth.state.user)

  function logout () {
    auth.logout()
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
