# Dr. Abraham S. Borbor Memorial School Of Excellence

Official website for **Dr. Abraham S. Borbor Memorial School Of Excellence (DASBMSE)** in Mount Barclay, Lower Johnsonville, Liberia.

A mobile-first static site with an admin dashboard for managing all content from the browser (no backend required — content is stored in the visitor's local storage).

## Tech Stack

- React 19 + Vite 7 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Wouter (routing), Framer Motion, Sonner, jsPDF
- pnpm workspace monorepo

## Project Structure

```
artifacts/
  borbor-school/   # The school website (deployed to Vercel)
  api-server/      # Internal-only Replit dev server (NOT deployed)
  mockup-sandbox/  # Internal-only design sandbox (NOT deployed)
```

## Local Development

```bash
pnpm install
pnpm --filter @workspace/borbor-school dev
```

## Production Build

```bash
pnpm --filter @workspace/borbor-school build
# Output: artifacts/borbor-school/dist/public
```

## Deploying to Vercel

The repository ships with a root-level `vercel.json` that already points Vercel at the school site. Just import the repo in Vercel:

1. Go to https://vercel.com/new and import this GitHub repo.
2. **Framework Preset:** Other (leave it as is — `vercel.json` handles it).
3. **Root Directory:** keep as `./` (the repo root). Do **not** change it to `artifacts/borbor-school`.
4. Click **Deploy**. No environment variables are required.

The site is fully client-side, so the SPA rewrite in `vercel.json` ensures deep links like `/about` and `/admin/login` work after a refresh.

## Admin Access

After deployment, visit `/admin/login`.

- **Email:** `borborschool.admin@gmail.com`
- **Password:** `Admin2026`

Change the password from the dashboard's **Security** tab.

> Note: All admin data (school info, news, gallery, staff, contact form submissions) is stored per-browser in `localStorage`. There is no shared backend — each visitor sees the default content unless they are the admin editing on their own device.
