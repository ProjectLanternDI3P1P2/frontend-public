import Keycloak from "keycloak-js";

/**
 * Browser-only OIDC client. Keycloak owns the credential form; this plugin
 * starts the Authorization Code + PKCE flow and exposes the authenticated
 * session to Nuxt components.
 */
export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();

  const keycloak = new Keycloak({
    url: config.public.keycloakUrl,
    realm: config.public.keycloakRealm,
    clientId: config.public.keycloakClientId,
  });

  await keycloak.init({
    onLoad: "check-sso",
    pkceMethod: "S256",
    checkLoginIframe: false,
  });

  return {
    provide: { keycloak },
  };
});
