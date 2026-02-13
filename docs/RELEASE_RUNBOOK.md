# Release Runbook

## Prerequisites

1. Working tree is clean.
2. `main` is up to date.
3. CI is green.
4. `NPM_TOKEN` is configured in GitHub secrets.

## Fast Path (Recommended)

```bash
pnpm release:patch
# or
pnpm release:minor
pnpm release:major
```

This runs:

1. `release:check` quality gate
2. package version bump in `packages/player/package.json`
3. changelog update in `packages/player/CHANGELOG.md`
4. release commit + `vX.Y.Z` tag
5. push commit + tag

Then GitHub Actions `package-publish.yml` publishes to npm and creates GitHub Release.

## Safe Dry Run

```bash
./scripts/release.sh patch --no-push
```

## Manual Flow (Alternative)

```bash
pnpm changeset
pnpm changeset:version
pnpm release:check
pnpm release:tag
```

