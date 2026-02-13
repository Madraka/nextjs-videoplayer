# Vercel Deployment Checklist

## Project Settings

1. Framework Preset: `Next.js`
2. Root Directory: repository root (`.`)
3. Install Command: `pnpm install`
4. Build Command: `pnpm -C apps/showcase build`
5. Output Directory: `apps/showcase/.next`

## Environment

1. Node.js version: `20.x`
2. Ensure any required `NEXT_PUBLIC_*` variables are set in Vercel project settings.

## Validation

1. Push to `main` should trigger Vercel production deployment.
2. Preview deployment should work for pull requests.
3. Build logs should show `apps/showcase` build command.

## Release Separation

- Vercel deploys showcase only.
- npm publish is handled by GitHub Actions `package-publish.yml` on `v*` tags.
