---
id: web-006
title: Stop route segments dropping the site Open Graph image
status: done
project: website
plan: journal-publishing-pipeline
agent: coder
operator: sean
working_path: .
depends_on: []
review_mode: human
created: 2026-08-17
updated: 2026-08-17
---

# PRD: web-006 Stop route segments dropping the site Open Graph image

## Objective

Make every page on the site emit an Open Graph image, and make it impossible for a future page to lose one by accident.

## Context

### The live defect

`/en/digital` and `/en/journal` currently emit **no `og:image` at all** — not a generated card, not `public/og.png`, nothing. Both render as blank cards when anyone shares them.

The cause is a Next.js behaviour that reads as a merge and is not one: when a route segment exports an `openGraph` object in its metadata, Next **replaces** the parent's `openGraph` wholesale rather than merging field by field. A page that sets `openGraph` to give itself a better title and description, and says nothing about `images`, does not inherit the site-level image — it drops it.

Nothing warns. The build passes, the page renders, and the omission is visible only when the URL is pasted into LinkedIn, Slack or iMessage.

### Provenance

Found during `web-002`'s verification, which reconstructed a pre-`web-002` baseline and diffed every `og:` and `twitter:` tag across eight routes. The finding is that these two pages were already blank **before** that work — it neither caused the problem nor fixed it, and `web-002`'s Out of Scope explicitly reserved non-journal routes.

Journal entry pages are not affected: `web-002` gave them generated cards via `opengraph-image.tsx`, which Next wires up itself.

### Why this is worth more than two lines

The immediate fix is roughly one line per affected page. The durable fix is that the trap does not fire again — every future page that wants a custom `openGraph` title inherits the same silent failure, and the next person to hit it will lose the same afternoon working out why a card is blank.

## Acceptance Criteria

- [x] Every route the site serves emits an `og:image` with an **absolute** URL, in both locales. Enumerate the routes from the build output rather than from memory, and check every one.
- [x] `og:image:width`, `og:image:height` and `twitter:image` are present wherever `og:image` is.
- [x] Journal entry pages still serve their **generated** cards from `web-002`, not `og.png`. This fix must not shadow them.
- [x] A page that sets `openGraph` without `images` inherits the site image rather than dropping it. Prove it: add a temporary route that does exactly that, confirm it emits the site card, then delete it and say so in the Work Log.
- [x] The fix is structural rather than a per-page patch — a future page cannot reintroduce this by omission. If you conclude a per-page patch is genuinely the only option Next allows, say why in the Work Log and list every page carrying the patch.
- [x] A before/after table in the Work Log: every route, what it emitted before, what it emits now.
- [x] `pnpm build` and `pnpm lint` both pass. Lint finishes at the 9-warning baseline, not above it.

## Implementation Notes

**Read the metadata guide in `node_modules/next/dist/docs/` before writing anything.** This PRD's whole subject is a metadata-merging rule whose behaviour differs from what most people assume, on a Next version with breaking changes from your training data. Do not work from memory of how `openGraph` inheritance behaves.

The shape most likely to work is a small helper that every page composes its metadata through, so that supplying `openGraph` without `images` is impossible rather than merely discouraged — the type system doing the remembering instead of a person. Check whether an `opengraph-image` file convention at a higher segment achieves the same thing more cheaply; if it does, prefer it, because a convention Next enforces beats a helper the next author has to know to call.

`public/og.png` stays as the site-wide default and is not replaced.

**Builds here are network-dependent.** `next/font/google` fetches from `fonts.gstatic.com` at build time and a build in this repo has already failed with fifteen errors purely because that 404'd. Retry a red build before debugging it.

## Out of Scope

- **Designing or replacing `public/og.png`.**
- **Generated cards for non-journal routes.** Giving `/services`, `/digital` and the homepage their own rendered cards is a reasonable future step and is not this PRD; this one makes sure every page has *an* image.
- **Journal entry cards** — `web-002` owns them, they work, leave them alone.
- **Any change to page copy, titles or descriptions.** Metadata plumbing only.
- **`src/content/blog/`** — fifteen unrelated drafts owned by another PRD. Do not touch them.
- **Committing or pushing.** Leave the work in the working tree for review.

## Work Log

### What Next actually does, read from the shipped source

The docs state the merge rule (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`, "Merging → Overwriting fields"): metadata objects across segments are merged **shallowly**, so a segment exporting `openGraph` replaces the parent's entire object. The docs do not answer the question this PRD turns on, so I read `node_modules/next/dist/lib/metadata/resolve-metadata.js`:

- `mergeMetadata` (line 184) assigns `newResolvedMetadata.openGraph = resolveOpenGraph(metadata.openGraph, …)` — a whole-object replacement, not a field merge.
- `mergeStaticMetadata` (line 149) then re-applies the segment's `opengraph-image` file, but **only if** `source.openGraph.hasOwnProperty('images')` is false, and **only from that segment's own** `staticFilesMetadata` (built per segment in `collectMetadata`, line 430).

Two consequences drove the design:

1. **A file-convention image at an ancestor segment does not protect a descendant.** The PRD asked me to prefer the file convention if it worked; it does not. Proved empirically below, not just read off the source.
2. **`{ images: undefined }` is not the same as omitting `images`.** An own property holding `undefined` suppresses the file-convention image just as firmly as a real value. This is what would have broken `web-002`'s journal cards, and it is why the helper spreads the key in conditionally rather than assigning `undefined`.

### Empirical proof, via three temporary probe routes

Added, built, fetched, then deleted: `src/app/[locale]/zz-helper-probe/page.tsx`, `src/app/[locale]/zz-raw-probe/page.tsx`, `src/app/[locale]/zz-raw-probe/deep/page.tsx`, and `src/app/[locale]/zz-raw-probe/opengraph-image.png` (a copy of `public/og.png`). **All four are deleted**; `src/app/[locale]/` now contains only `digital/`, `journal/`, `services/`, `layout.tsx`, `page.tsx`.

First attempt named them `__helper-probe` / `__raw-probe` and they never appeared in the build output — an underscore-prefixed folder is a *private folder* in the App Router and is opted out of routing entirely. Renamed to `zz-` to get real routes.

| Probe | Shape | `og:image` emitted |
|---|---|---|
| `/en/zz-helper-probe` | `pageMetadata()` with a custom `ogTitle`, saying nothing about images | `https://agenticmaison.com/og.png` + width/height/alt + `twitter:image` |
| `/en/zz-raw-probe` | hand-written `openGraph` with no `images`, **same segment** as an `opengraph-image.png` | the file-convention image — rescued |
| `/en/zz-raw-probe/deep` | hand-written `openGraph` with no `images`, **one segment below** that file | **none at all** |

The third row is the answer to the PRD's "check whether an `opengraph-image` file convention at a higher segment achieves the same thing more cheaply": it does not. Neither the root layout's images nor the ancestor segment's image file survives a descendant's raw `openGraph`. A file convention would therefore need one image file *per leaf segment* — the per-page patch this PRD exists to avoid.

Second-order finding from the same probe: the static image at `[locale]/zz-raw-probe/` emitted the URL `https://agenticmaison.com/-/zz-raw-probe/opengraph-image.png?…` — the `[locale]` param left uninterpolated as a literal `-`, i.e. a dead URL. `web-002`'s journal card avoids this because `opengraph-image.tsx` carries its own `generateStaticParams`. Another reason the file convention is the wrong tool under a dynamic segment.

### The fix

Structural, in three layers:

1. **`src/lib/metadata/page-metadata.ts`** — `pageMetadata()` takes the fields a page varies (title, description, path, card headline, article date) and builds the entire `openGraph`/`twitter` shape itself. A caller never writes an `openGraph` object, so "openGraph without images" is not expressible. `siteDefaultMetadata` carries the same card at the root layout, which is what gives `/deck`, the unlock gate and the 404 page an image — they sit outside `[locale]` and never call the helper.
2. **An ESLint rule** (`no-restricted-syntax`, error, scoped to `src/app/**`) banning an `openGraph` property key anywhere in the app directory, with a message naming the helper and the reason. This is what stops a future page going around layer 1. It fired on exactly the two raw probes and nothing else — verified before deleting them.
3. **`src/lib/metadata/page-metadata.test.ts`** (8 new cases, 16 total) — unit-tests the helper, asserts `ogImage: 'generated'` leaves the `images` key genuinely absent, and walks `src/app/` to assert (a) no route module hand-writes `openGraph` and (b) `ogImage: 'generated'` is only claimed by a directory that actually ships an `opengraph-image` file. That last one guards the single escape hatch, which is the only remaining way to lose a card.

`twitter.images` is deliberately never set anywhere: `postProcessMetadata` fills `twitter:image` from `openGraph.images` whenever `twitter` has no own `images` key, so the site card and the generated cards stay in step for free.

### Deliberate minor calls

- **`og:site_name` now appears on the journal index and the eight journal entries**, which previously had none — the helper emits one shape for every page and reproducing the old inconsistency would have meant a knob with no purpose. It is a correct tag and not page copy. Every other tag on every route is byte-identical to before (see the table).
- **`/services/ai` and `/services/digital` were left alone.** They set no `openGraph`, so they inherit the locale layout's and already carried an image; they are not at risk from this trap. They do inherit the homepage's `og:url` and `og:title`, which is a real defect — flagged in Handoff, not fixed here, because fixing it means changing what those pages say and this PRD is metadata plumbing only.
- **Lint finishes at 8 warnings, one below the 9 baseline.** The ninth was `'htmlLang' is defined but never used` in `src/app/[locale]/layout.tsx` — confirmed by linting `HEAD` in a detached worktree. It disappeared because the import line was rewritten when that file's metadata moved to the helper. Reinstating a dead import to hit a number would be silly; the AC says "not above it".

### Before / after — every route in the build output

Baseline captured by building and serving the tree **before** any edit. `src/` was identical to `HEAD` (`git status` showed only `ops/prds/` and the untracked `src/content/blog/` drafts, none of which any route reads), so no comparison worktree was needed for this and the server-action-id / chunk-hash false positives never arose. The worktree was used only for the lint baseline, where those hashes are irrelevant.

Routes enumerated from `pnpm build` output — `/[locale]` × 2 locales, `/[locale]/digital`, `/[locale]/journal`, `/[locale]/journal/[slug]` × 4 entries, `/[locale]/services/ai`, `/[locale]/services/digital`, `/deck`, `/deck/unlock`, `/_not-found`.

| Route (both locales unless noted) | Before | After |
|---|---|---|
| `/en`, `/zh` | `og.png`, absolute, W/H/alt, `twitter:image` | unchanged |
| `/en/digital`, `/zh/digital` | **no `og:image` at all** | `og.png`, absolute, W/H/alt, `twitter:image` |
| `/en/journal`, `/zh/journal` | **no `og:image` at all**, no `og:site_name` | `og.png`, absolute, W/H/alt, `twitter:image`, `og:site_name` added |
| `/en/journal/<slug>` × 4 | generated card, `…/opengraph-image?17e9caeb0132678b` | **identical URL and hash**; `og:site_name` added |
| `/zh/journal/<slug>` × 4 | generated card, `…/opengraph-image?17e9caeb0132678b` | **identical URL and hash**; `og:site_name` added |
| `/en/services/ai`, `/zh/services/ai` | `og.png` inherited from locale layout | unchanged |
| `/en/services/digital`, `/zh/services/digital` | `og.png` inherited from locale layout | unchanged |
| `/deck` | **no `og:*` or `twitter:*` tags whatsoever** | `og.png`, absolute, W/H/alt, `twitter:image`, `og:title`, `og:type`, `og:site_name`, `twitter:card` |
| `/deck/unlock` | **no `og:*` or `twitter:*` tags whatsoever** | as above — matters because an uncookied crawler hitting `/deck` is rewritten here |
| `/_not-found` (via `/en/this-route-does-not-exist`) | **no `og:*` or `twitter:*` tags whatsoever** | `og.png`, absolute, W/H/alt, `twitter:image`, `og:type`, `og:site_name`, `twitter:card` |

`diff before.txt after.txt` over all 21 fetched routes contains **only additions** — not one existing tag changed value. No `og:title`, `og:description`, `og:url`, `og:locale`, `og:type` or `twitter:*` string moved, which is the check that this touched no page copy.

### Verification actually executed

- `pnpm build` — `✓ Compiled successfully`, `✓ Generating static pages (35/35)`, TypeScript clean. No font 404 retry was needed.
- `pnpm lint` — `✖ 8 problems (0 errors, 8 warnings)`.
- `pnpm test` — `# tests 16 / # pass 16 / # fail 0`.
- Both captures taken from `pnpm start` against the production build, fetching every route with `curl` and scraping `og:`/`twitter:` meta tags.

## Handoff / Next Action

Ready for review. Nothing is committed — the working tree carries the change, as the PRD requires. The untracked drafts under `src/content/blog/` and the modified `ops/prds/web-004-sveltia-cms-install.md` were not touched.

Two things worth a decision, both out of this PRD's scope:

1. **`/services/ai` and `/services/digital` advertise the wrong URL.** Because they set no `openGraph`, they inherit the locale layout's whole object — including `og:url` pointing at `https://agenticmaison.com/en` and the homepage's `og:title`/`og:description`. Their card is correct but their identity is not. Both are commented out of `src/app/sitemap.ts` and read as stubs, so this may be deliberate; if not, the fix is four lines — a `pageMetadata()` call each, exactly like `/digital`. It changes what those cards say, which is why I did not do it here.
2. **Non-journal routes still share one static card.** `public/og.png` on the homepage, `/digital`, `/journal`, `/deck` and the 404. The PRD reserves generated cards for these as a future step; the helper is the seam for it — a segment that gains an `opengraph-image.tsx` only needs `ogImage: 'generated'` added to its `pageMetadata()` call, and the test will then require the file to exist.

One durable fact for `unshared/website/AGENTS.md`, if it is worth promoting: **page metadata is composed through `pageMetadata()` in `src/lib/metadata/page-metadata.ts`, and a raw `openGraph` object inside `src/app/` is an ESLint error.** I have not edited that file.

## Result
### Summary

Every route the site serves now emits an absolute `og:image` with width, height and `twitter:image`, in both locales — including three routes that had no Open Graph tags at all (`/deck`, `/deck/unlock`, the 404), which the PRD did not know about. `web-002`'s generated journal cards are untouched, down to the identical image URL and hash.

The durable half is that the trap cannot fire again: pages compose metadata through a helper that cannot express "openGraph without images", an ESLint error stops anyone bypassing the helper, and a test guards the one sanctioned opt-out by requiring the segment to actually own an `opengraph-image` file.

### Files Modified

New:

- `src/lib/metadata/page-metadata.ts` — `pageMetadata()`, `siteDefaultMetadata`, `SITE_OG_IMAGE`. The module header documents the Next merge rule and the `hasOwnProperty('images')` detail with file-and-function citations, so the next reader does not have to re-derive it.
- `src/lib/metadata/page-metadata.test.ts` — 8 cases.

Changed:

- `src/app/layout.tsx` — site defaults now come from `siteDefaultMetadata`, which is what puts a card on every non-`[locale]` route.
- `src/app/[locale]/layout.tsx`, `src/app/[locale]/digital/page.tsx`, `src/app/[locale]/journal/page.tsx`, `src/app/[locale]/journal/[slug]/page.tsx` — each now returns `pageMetadata(...)`; net −46 lines.
- `eslint.config.mjs` — the `openGraph` ban over `src/app/**`.

### Discoveries

- **A file-convention `opengraph-image` only protects its own segment.** Next re-applies it per segment from that segment's own module map, after the segment's `openGraph` has already replaced the parent's. An ancestor's image file does nothing for a descendant that sets `openGraph`. Proved with a probe route, not inferred.
- **`{ images: undefined }` and omitting `images` behave differently.** Next gates the file-convention image on `hasOwnProperty('images')`, so an own key holding `undefined` shadows a generated card. Any future refactor of the helper must preserve the conditional spread; there is a test asserting exactly this.
- **A static `opengraph-image.png` under a dynamic segment emits a dead URL** — `/-/zz-raw-probe/opengraph-image.png`, with the param uninterpolated. `opengraph-image.tsx` with `generateStaticParams` is the only form that works under `[locale]`.
- **Underscore-prefixed App Router folders are private and are not routed.** Cost one build cycle when the probes silently failed to appear.
- **`/deck`, `/deck/unlock` and the 404 page had no Open Graph tags at all** before this — they sit outside `[locale]`, and the site's only card lived in the locale layout. The unlock gate is the one a crawler actually sees, since an uncookied request to `/deck` is rewritten there by `src/proxy.ts`.
