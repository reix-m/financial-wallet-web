<template>
  <div class="auth-shell">
    <div class="auth-shell__inner">
      <div class="text-center mb-6">
        <v-avatar class="mb-4" color="primary" rounded="lg" size="64">
          <v-icon color="on-primary" size="36">mdi-wallet</v-icon>
        </v-avatar>

        <h1 class="text-2xl font-bold">{{ title }}</h1>

        <p class="text-sm text-on-surface/60 mb-0">{{ subtitle }}</p>
      </div>

      <v-card elevation="3" rounded="lg">
        <v-card-text>
          <slot />
        </v-card-text>
      </v-card>

      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
    subtitle: string
  }>()
</script>

<style scoped>
  .auth-shell {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background:
      radial-gradient(circle at top right, rgba(var(--v-theme-primary), 0.18), transparent 55%),
      rgb(var(--v-theme-background));
  }

  .auth-shell__inner {
    width: 100%;
    max-width: 420px;
  }
</style>
