# Engineering Roadmap

## Goal

Build an enterprise-grade structure where showcase delivery and player package delivery are isolated but coordinated.

## Guiding Principles

- Keep production deploy stable during migration.
- Isolate concerns: showcase app vs package publishing.
- Enforce release quality gates in CI.
- Make versioning and release flow auditable.

## Current Baseline

- Showcase is deployed from `apps/showcase`.
- Player package is built and published from `packages/player`.
- GitHub Actions are split into:
  - `showcase-ci.yml` for quality checks
  - `package-publish.yml` for tag-based publish
- Release automation is available via `scripts/release.sh`.

## Phase 1: Foundation (completed)

1. Add workspace scaffolding without moving runtime code.
2. Add release governance with Changesets.
3. Keep Vercel root deploy unchanged.

Deliverables:

- `pnpm-workspace.yaml`
- `.changeset/` initialized
- release scripts in `package.json`
- workflow separation for CI and publish

## Phase 2: Controlled Extraction (completed)

1. Create `apps/showcase` and move Next.js app there.
2. Create `packages/player` and move package source there.
3. Update imports to consume package from workspace.
4. Configure Vercel to build showcase app path.

Definition of done:

- Local commands work from root via workspace scripts.
- Vercel deploys the showcase app.
- `package-publish.yml` publishes package from `packages/player`.

## Phase 3: Hardening (in progress)

1. Add component/unit/e2e tests.
   Status: unit test baseline completed in `packages/player` with Vitest.
2. Add bundle-size and API-surface checks.
   Status: completed with `size-limit` and API snapshot validation.
3. Enforce branch protection and required checks.
4. Add release runbook and rollback playbook.
   Status: release runbook completed in `docs/RELEASE_RUNBOOK.md`.

Definition of done:

- Every release has changelog entry and semver intent.
- Publish is reproducible from tag with no manual fixes.

## Operational Flow

1. Developer creates a changeset: `pnpm changeset`.
2. PR merges to `main` after `showcase-ci` passes.
3. Release prep updates versions: `pnpm changeset:version`.
4. Tag current package version: `pnpm release:tag`.
5. `package-publish` publishes to npm and creates GitHub release.

## Phase 4: Player Core Architecture (in progress)

1. Introduce adapter registry and pluggable transport layer.
   Status: completed (`src/core/adapters`, `AdapterRegistry`, default adapters).
2. Introduce typed plugin lifecycle for engine-level extensibility.
   Status: completed (`src/core/plugins`, analytics plugin migration).
3. Expose architecture in showcase with interactive plugin toggles.
   Status: completed (plugin playground + runtime signals in showcase).
4. Add architecture reference documentation.
   Status: completed in `docs/PLAYER_ARCHITECTURE.md`.
5. Add source failover support for resilient playback.
   Status: completed (`VideoEngineConfig.fallbackSources` + failover tests).
6. Add DRM/EME foundation with typed config and engine integration.
   Status: completed (`src/core/drm`, `drm` support in `VideoEngineConfig`).
