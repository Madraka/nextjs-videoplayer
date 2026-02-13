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
2. Add bundle-size and API-surface checks.
3. Enforce branch protection and required checks.
4. Add release runbook and rollback playbook.

Definition of done:

- Every release has changelog entry and semver intent.
- Publish is reproducible from tag with no manual fixes.

## Operational Flow

1. Developer creates a changeset: `pnpm changeset`.
2. PR merges to `main` after `showcase-ci` passes.
3. Release prep updates versions: `pnpm changeset:version`.
4. Tag current package version: `pnpm release:tag`.
5. `package-publish` publishes to npm and creates GitHub release.
