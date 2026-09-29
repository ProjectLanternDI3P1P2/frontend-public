# Project Lantern — public site

The discoverable half of Project Lantern: landing page, universe, how to play,
the live season, and the service status page.

"EASY TO DISCOVER" is one of the three product promises in the client briefing,
which is why this application exists separately from the game client
(ADR-FE-002) and lives in its own repository (ADR-FE-007).

> **Architecture overview:** open [`docs/architecture.html`](docs/architecture.html)
> in any browser (double-click it). It covers both front-end applications, the
> ADR → code mapping, the data flows and the open decisions. It needs no
> tooling; the diagrams need an internet connection.

## Rendering — the decision this repo exists to carry

ADR-FE-003 requires hybrid rendering, with **every non-default route documented
and justified**. The policy, the two allowed SSR shapes and the register of
routes live in [docs/rendering-modes.md](docs/rendering-modes.md); the modes
themselves are declared in `nuxt.config.ts` → `routeRules`.

In short:

- **Static is the default** — cheap, indexable, readable before JavaScript runs,
  and it survives the API Gateway being down.
- **SSR is the exception and has to be argued**: what changes between two
  requests that a build cannot know? Two shapes are allowed, one with a `swr`
  window, one with caching disabled — and an SSR route without a stated caching
  strategy is not acceptable.
- **CSR is never the default here.** The authenticated game client is the CSR
  application (ADR-FE-004); this one is not.

The register is currently empty: only `/` exists, and it is static.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

## Local authentication (Keycloak)

Start a local Keycloak instance on port 8081 (port 8080 remains available for
the API Gateway):

```bash
docker run -d --name keycloak-local -p 127.0.0.1:8081:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:26.7.4 start-dev
```

Open http://localhost:8081/admin and sign in to the `master` realm with:

```text
username: admin
password: admin
```

Import the realm configuration from
[`keycloak/realm/lantern-realm.json`](keycloak/realm/lantern-realm.json):

1. In the realm selector at the top left, choose **Create realm**.
2. Choose **Browse** and select `keycloak/realm/lantern-realm.json`.
3. Click **Create**.

The import creates a `lantern` realm with the public OIDC client
`lantern-public`, Authorization Code + PKCE (`S256`), a `players` group mapped
to the `player` role, and a `demo` / `demo` test account.

Set `NUXT_PUBLIC_KEYCLOAK_URL` in `.env` to the URL of that instance. It must
not use the same port as the API Gateway. The corresponding public runtime
configuration is listed in `.env.example`. Do not reuse the test account or a
development Keycloak setup outside local development.

### Customize the login page

The login theme source is in
[`keycloak/themes/lantern`](keycloak/themes/lantern). Copy it to the running
container, then restart Keycloak:

```bash
docker cp keycloak/themes/lantern keycloak-local:/opt/keycloak/themes/
docker restart keycloak-local
```

In the Keycloak Admin Console, select the `lantern` realm and set:

```text
Realm settings → Themes → Login theme → lantern → Save
```

After changing `keycloak/themes/lantern/login/resources/css/lantern.css`, copy
the updated files and restart the container again:

```bash
docker cp keycloak/themes/lantern/. keycloak-local:/opt/keycloak/themes/lantern/
docker restart keycloak-local
```

Useful local commands:

```bash
docker logs -f keycloak-local  # Follow startup logs
docker stop keycloak-local     # Stop it without deleting its data
docker start keycloak-local    # Start the same local instance again
```

| Command                             | What it does                                   |
| ----------------------------------- | ---------------------------------------------- |
| `npm run dev`                       | Development server on http://localhost:3000    |
| `npm run build` / `npm run preview` | Production build (server + prerendered routes) |
| `npm run generate`                  | Static-only output, for the prerendered subset |
| `npm run lint`                      | ESLint, including the accessibility rules      |
| `npm run typecheck`                 | `vue-tsc` over the whole application           |
| `npm run test:unit`                 | Vitest                                         |
| `npm run test:e2e`                  | Cypress against a running server               |

`GET /healthz` returns app name, version, commit and build time.

## Architecture map

This repository is an **architecture skeleton**: the rendering policy, the
folder shape, the ownership map and the quality gates are in place. The features
themselves are empty on purpose — they belong to the squads that own them.

```text
app/
  features/
    _template/   the worked example; copy it to start a feature
    universe/    heroes and creatures      | each holds its README:
    rules/       how to play               | owner squad, expected rendering
    season/      live season               | mode, scope
    status/      service health            |
  shared/
    ui/          presentational primitives, auto-imported
    composables/ useGateway
    utils/       gateway transport, telemetry
  pages/         routes; they compose features
  layouts/ plugins/ assets/styles/
server/routes/healthz.ts
cypress/         end-to-end harness
docs/            adr/, rendering modes, tokens, budgets, accessibility
lighthouse-budget.json
```

`app/pages/` holds a single placeholder. Each squad adds its own routes, its
navigation entry, its `routeRules` line and its row in the rendering register.

To start a feature: `cp -r app/features/_template app/features/<name>` and
follow its README.

The structure, the ownership rules and the "add a feature" procedure are the
same as in the game client (ADR-FE-009) — see that repository's README for the
long form. The short version:

- Only `api/` talks to the API Gateway, through hand-written typed functions
  (ADR-FE-011).
- Nothing moves into `shared/` before it has two real consumers.
- No literal colour or spacing in a component: use a design token (ADR-FE-010).
- Every new route declares its rendering mode in `nuxt.config.ts` **and**
  justifies it in `docs/rendering-modes.md` (ADR-FE-003).

## Performance

Budgets and how they are measured: [docs/performance-budgets.md](docs/performance-budgets.md).
Lighthouse runs in CI against the representative routes with
`lighthouse-budget.json`; the field measurements collected by the telemetry
plugin remain the reference for real user experience (ADR-FE-013, ADR-FE-014).

## Accessibility

The public site targets RGAA compliance with **no expected exception**: nothing
here is a gameplay constraint. See [docs/accessibility.md](docs/accessibility.md).
