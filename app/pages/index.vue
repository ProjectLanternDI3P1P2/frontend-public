<script setup lang="ts">
/**
 * Placeholder route, statically generated (ADR-FE-003 default).
 *
 * `app/pages/` is intentionally almost empty: pages belong to the squads that
 * own the corresponding feature. This file exists so the router has an entry
 * point and so the prerendering path is exercised by the build.
 *
 * Every route added here must also declare its rendering mode in
 * `nuxt.config.ts` → `routeRules` and justify it in `docs/rendering-modes.md`.
 */
useHead({ title: "Public site" });

const { $keycloak } = useNuxtApp();
const isStartingLogin = ref(false);

async function login() {
  isStartingLogin.value = true;

  try {
    await $keycloak.login({ redirectUri: window.location.origin });
  } finally {
    // The browser normally leaves this page. Restore the button if the
    // redirect cannot be initiated (for example, when Keycloak is offline).
    isStartingLogin.value = false;
  }
}
</script>

<template>
  <div class="home">
    <h1>Project Lantern — public site</h1>
    <p>
      Architecture skeleton. Routes are added by the squad that owns the
      corresponding feature, with their rendering mode declared and justified.
    </p>

    <UiButton :busy="isStartingLogin" @click="login">
      Se connecter
    </UiButton>
  </div>
</template>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);

  p {
    max-inline-size: 60ch;
    color: var(--color-text-muted);
  }
}
</style>
