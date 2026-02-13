# Vercel Deployment Checklist

## Project Settings

1. Framework Preset: `Next.js`
2. Root Directory: `apps/showcase`
3. Install Command: `pnpm install`
4. Build Command: `pnpm build`
5. Output Directory: `.next`

## Environment

1. Node.js version: `20.x`
2. Ensure required `NEXT_PUBLIC_*` variables are set in Vercel project settings.

## Validation

1. Push to `main` triggers production deployment.
2. Preview deployment works for pull requests.
3. Build logs show the showcase app build.

## Release Separation

- Vercel deploys showcase only.
- npm publish is handled by GitHub Actions `package-publish.yml` on `v*` tags.
