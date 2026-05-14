# agentic-maison-web

Production codebase for [agenticmaison.com](https://agenticmaison.com) — the
public-facing website for Agentic Maison.

## Stack

- Next.js 16 (App Router) + TypeScript, Turbopack
- Tailwind CSS v4 (`@theme inline` in `src/app/globals.css`)
- `next/font/google` — Cormorant Garamond, Source Serif 4, JetBrains Mono, Noto Serif TC
- Vercel hosting (team `agenticmaison`)
- Vercel Analytics (no GA, no cookie banner)

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm start        # serve the production build
pnpm lint
```

Node 22. pnpm required (lockfile is pnpm).

## Contact form (Resend)

The landing `#contact` form posts to a Server Action ([`src/app/actions/contact.ts`](src/app/actions/contact.ts)) and sends mail via [Resend](https://resend.com). From/to addresses are hardcoded there as `Agentic Maison <studio@agenticmaison.com>` → `studio@agenticmaison.com` (adjust in code if you change sender or inbox). Copy [`.env.example`](./.env.example) to `.env.local` and set `RESEND_API_KEY` only.

Add `RESEND_API_KEY` in the Vercel project (**Settings → Environment Variables**) for Preview and Production. Spam protection is lightweight: hidden honeypot field, server-side field limits, and a minimum delay after the form mounts before submit is accepted.

## Project structure

```
src/
  app/
    layout.tsx                    Root layout: next/font, metadata, pre-hydration
                                  boot script (data-theme, data-lang).
    page.tsx                      Landing page (port of Iteration F).
    globals.css                   Theme tokens + ported F styles.
    sitemap.ts / robots.ts        SEO files.
    services/ai/page.tsx          Stub subpage.
    services/digital/page.tsx     Stub subpage.
    actions/contact.ts            Server Action: contact form → Resend.
  components/
    sheet-shell.tsx               Drawing-sheet frame + sticky header band + footer.
    contact-form.tsx              Contact section form (Server Action + honeypot).
    atelier-controls.tsx          Client Component wiring up interactive behaviors.
    hero-mechanism-svg.tsx        Hero placeholder SVG (ASSET-SWAP #F1).
    plate-svgs.tsx                Plate placeholder SVGs (ASSET-SWAP #F2 #F3).
```

## Design

Visual identity is locked to Iteration F (`animated-mechanism-v2`). The
reference HTML mock at
`1-projects/agentic-maison-launch/designs/landing-structure/animated-mechanism-v2/index.html`
is the source of truth for visual / structural / interactive behavior.

## i18n

Visible strings are rendered bilingually as paired `<span lang="en">` /
`<span lang="zh">` elements. CSS (`[data-lang="en"] [lang="zh"] { display:
none }` and the inverse) toggles which side is visible based on the
`data-lang` attribute on `<html>`, set pre-hydration by an inline boot
script in the root layout and at runtime by `AtelierControls`.

## Deployment

Production deploys on push to `main`. Preview deploys on PRs. Domains:
`agenticmaison.com` (canonical), `www.agenticmaison.com` (301 to apex),
`agentic.maison` (301 to canonical).

## License

Proprietary. © Agentic Maison.
