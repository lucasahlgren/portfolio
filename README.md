# lucasahlgren.se

Personal portfolio: a Next.js website, an Expo mobile app and a Sanity CMS in one pnpm + Turborepo monorepo.

```
apps/
  web/        Next.js 16 (App Router, Cache Components) · Tailwind 4 · shadcn/ui
              └─ Sanity Studio embedded at /studio
  mobile/     Expo SDK 58 · Expo Router (native tabs) · NativeWind · React Native Reusables
packages/
  content/    GROQ queries, TypeScript types, Sanity client + image helpers (used by web and mobile)
  sanity/     Studio schemas, desk structure and the seed script for the old portfolio's content
```

Content types: **Profile & settings** (singleton), **Projects**, **Jobs**, **Education**, **Photos**.

## Getting started

Requires Node ≥ 22.12 and pnpm (`corepack enable pnpm`).

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local     # fill in Sanity project ID etc.
cp apps/mobile/.env.example apps/mobile/.env
pnpm dev:web        # http://localhost:3000 (Studio: /studio)
pnpm dev:mobile     # Expo dev server — press i / a for simulators
```

### First-time Sanity setup

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) (or `pnpm --filter @portfolio/web exec sanity init --env`), with a `production` dataset.
2. Put the project ID in `apps/web/.env.local` and `apps/mobile/.env`.
3. Add CORS origins (API → CORS origins, **allow credentials**): `http://localhost:3000` and `https://lucasahlgren.se`.
4. Import the content from the old site: create an **Editor** token (API → Tokens), set `SANITY_API_WRITE_TOKEN` in `apps/web/.env.local`, then run `pnpm seed`. It's safe to re-run.
5. Add your jobs in the Studio (`/studio` → Jobs) and check the project years, several were estimated during the import.

## Scripts

Run from the repo root (Turborepo fans out to every package), or inside a single app.

| Script              | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `pnpm dev`          | Run web + mobile dev servers                         |
| `pnpm build`        | Production build                                     |
| `pnpm lint`         | ESLint (Next config for web, Expo config for mobile) |
| `pnpm lint:fix`     | ESLint with `--fix`                                  |
| `pnpm format`       | Prettier — fix formatting                            |
| `pnpm format:check` | Prettier — check formatting (use in CI)              |
| `pnpm typecheck`    | TypeScript across all packages                       |
| `pnpm seed`         | Import the old portfolio's content into Sanity       |

The web app's Prettier config adds `prettier-plugin-tailwindcss` for class sorting.

## Continuous integration

`.github/workflows/build-validation.yml` (**Build validation**) runs on every pull request and on pushes to `main`: `pnpm format:check`, `pnpm lint`, `pnpm typecheck` and `pnpm build` (Next.js production build + Expo JS bundles for iOS and Android). It uses the public Sanity dataset; override the project ID or dataset with the repository variables `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`. To require it before merging, add **Format, lint & build** as a required status check in the branch protection rules for `main`.

## Deploying the website (Vercel)

1. Import the repo in Vercel and set **Root Directory** to `apps/web` (Vercel detects pnpm and the workspace).
2. Environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SITE_URL=https://lucasahlgren.se`, `SANITY_REVALIDATE_SECRET` (any long random string).
3. Content refresh: in sanity.io/manage → API → Webhooks, add a webhook
   - URL `https://lucasahlgren.se/api/revalidate`, trigger on create/update/delete,
   - projection `{_type}`, secret = `SANITY_REVALIDATE_SECRET`.

   Pages update seconds after publishing. Without the webhook they refresh hourly.

The Studio deploys with the site; no separate hosting is needed. To list it under **Studios** in sanity.io/manage (enables Dashboard and Media Library), run `npx sanity login` once, then `pnpm --filter @portfolio/web studio:register` after the site is live. Re-run it after schema changes.

### Domain (Strato → Vercel)

In Vercel → Project → Domains add `lucasahlgren.se`, `www.lucasahlgren.se` (redirect to apex) and optionally `studio.lucasahlgren.se` (redirects to `/studio`). Then in Strato → Domains → DNS settings create the records Vercel shows, typically:

| Type  | Name     | Value                  |
| ----- | -------- | ---------------------- |
| A     | `@`      | `76.76.21.21`          |
| CNAME | `www`    | `cname.vercel-dns.com` |
| CNAME | `studio` | `cname.vercel-dns.com` |

Use the exact values Vercel displays, since they can be project-specific. If Strato has existing A/AAAA records for `@`, remove them. Alternatively, switch the nameservers to Vercel's.

## Mobile app

Builds with [EAS](https://docs.expo.dev/eas/): `npx eas-cli@latest build:configure`, then `eas build`. Add the `EXPO_PUBLIC_*` variables as EAS environment variables. Bundle ID: `se.lucasahlgren.portfolio`.
