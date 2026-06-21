# CI, GitHub Pages, and container publishing

## Workflows

### `ci.yml`

| Job | Triggers | Actions |
|-----|----------|---------|
| `verify` | PR + push to `main` + semver tags | `npm ci`, vendor letter-pro, lint, build, scaffold tests |
| `docker` | push to `main` + semver tags only (after `verify`) | Build `Dockerfile`, push to GHCR |

### `pages.yml`

| Job | Triggers | Actions |
|-----|----------|---------|
| `build` | push to `main`, `workflow_dispatch` | `npm ci`, vendor packages, build with relative asset URLs, upload `dist` |
| `deploy` | after `build` | `deploy-pages` to `github-pages` environment |

**Setup:** Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**. Project-site URL is `https://<owner>.github.io/<repo>/`. Vite uses `base: './'`; runtime HTTP fetches use `appUrl()` (`src/infra/appUrl.ts`) to resolve paths relative to `document.baseURI` (main thread) or a root URL passed to the typst worker at init.

## Registry

## Registry

- **GHCR** (`ghcr.io`) — no PAT needed for this public repo; `GITHUB_TOKEN` with `packages: write` on the `docker` job.
- Image: `ghcr.io/echsecutor/letter_writer` (repository name lowercased in workflow).

## Tags

| Event | Tags pushed |
|-------|-------------|
| Push to `main` | `latest` |
| Tag `v1.2.3` | `latest`, `1.2.3`, `1.2`, `1` |

Tag filter: `v[0-9]+.[0-9]+.[0-9]*` (semver with optional pre-release suffix).

## Actions (pinned majors, June 2026)

- `actions/checkout@v6`, `actions/setup-node@v6`
- `actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`
- `docker/setup-buildx-action@v4`, `docker/login-action@v4`, `docker/metadata-action@v6`, `docker/build-push-action@v7`

Build cache: GitHub Actions cache (`type=gha`).

## First publish

First push from Actions links the package to this repository automatically. If push fails with `permission_denied: write_package`, check package **Settings → Manage Actions access** for the repo.
