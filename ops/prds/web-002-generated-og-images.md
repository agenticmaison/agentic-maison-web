---
id: web-002
title: Generated Open Graph images for journal entries
status: queue
project: website
plan: journal-publishing-pipeline
agent: coder
operator: sean
working_path: .
depends_on: [web-001]
review_mode: human
created: 2026-08-11
updated: 2026-08-11
---

# PRD: web-002 Generated Open Graph images for journal entries

## Objective

Give every journal entry, in both locales, a correct on-brand Open Graph image that is generated from the post's own metadata — so that no editor ever uploads one, and no post can ship with a blank social card.

## Context

### Why generated rather than uploaded

An uploaded OG image is a manual step with no upside and a silent failure mode. Someone opens a design tool for every post, gets 1200×630 right, keeps the typography consistent by hand, and remembers to do it. Miss it once and the LinkedIn card renders blank — on the exact channel these articles exist to be shared into. Generating from the title removes the field from the editor's form entirely and makes the failure impossible.

This also settles a question the CMS evaluation would otherwise have to carry: no candidate CMS has any concept of an OG image beyond "an image field like any other," so the tooling was never going to help.

### What exists today

`public/og.png` is a single static image used site-wide. It stays, and remains the fallback for every non-journal route.

Site typography is loaded in `src/app/layout.tsx` via `next/font/google`: Cormorant Garamond, Source Serif 4, JetBrains Mono, and **Noto Serif TC** — the last already carrying Traditional Chinese across the live site.

`public/brand/agentic-maison-wordmark-light-2x.png` is the wordmark lockup for light grounds.

### The brand constraint

The identity spec is the vault root's `AGENTS.md` and it is not negotiable here. Two rules bear directly on this work: the wordmark and the seal are **separate assets and are never combined into a single lockup**, and the **brass diamond stays brass and never inverts**. Embedding the existing wordmark PNG satisfies both without re-typesetting anything — do that rather than reconstructing the lockup from text.

### The real technical risk

`next/og` renders through Satori, which needs every font supplied as a binary buffer rather than loaded through CSS. Latin fonts are small. A Traditional Chinese font is not, and it cannot be subset ahead of time because the text is a title not known until render. Half the posts are Chinese, so this is the part of the work most likely to go wrong, and it is why this PRD asks for measurements rather than assurances.

## Acceptance Criteria

- [ ] Every journal entry route serves an OG image at 1200×630 in both locales. With four posts live that is eight images; all eight must be generated and inspected.
- [ ] The Chinese images render their titles with correct glyphs and **no tofu boxes and no fallback-substituted characters**. Write all eight generated images to a temporary directory outside the repo, open them, and confirm by eye. Record in the Work Log that you looked at all eight.
- [ ] Each journal entry page's rendered `<head>` contains `og:image`, `og:image:width`, `og:image:height` and `twitter:image`, and the image URL is **absolute** — social crawlers do not resolve relative paths.
- [ ] Adding a new journal post produces a correct OG image with no additional work, consistent with `web-001`'s file-drop guarantee. Verify with the same throwaway post method and say so in the Work Log.
- [ ] Non-journal routes still use `public/og.png`, unchanged.
- [ ] The Work Log records the measured render time for an English image and for a Chinese image, plus the resulting route bundle or function size. If a Chinese image takes more than roughly two seconds to render cold, say so plainly rather than shipping it quietly.
- [ ] `pnpm build` and `pnpm lint` both pass.

## Implementation Notes

**Mechanism.** An `opengraph-image.tsx` inside the `src/app/[locale]/journal/[slug]/` route segment. It receives the same params as the page, so it can look the entry up through the loader `web-001` builds. Next wires the meta tags automatically — do not hand-write them.

**Use the Node runtime, not edge.** The edge runtime's bundle ceiling is the single most likely thing to break a build carrying a CJK font. Node has no equivalent limit and can read font files from disk at request time. Cold-start cost is the trade and it is the right one for a route crawlers hit rather than users.

**Fonts.** Use the families the live site already uses — Cormorant Garamond for English titles, Noto Serif TC for Chinese — so a shared card looks like the site it points at. Satori needs the raw font binary, so the font files must be readable at render time; commit them under the route segment or a `src/lib/og/` folder rather than relying on `next/font` internals, which are not a stable interface.

**On the Chinese font size problem — preferred approach first.** Subset Noto Serif TC at request time to only the codepoints present in that title. Falling back is acceptable if subsetting proves fragile: read the full font from disk under the Node runtime and measure the cost. Either is fine; shipping a card with missing glyphs is not. Record which one you took and why.

**Composition.** Cream ground `#ece4d3`, ink text `#14110b`, brass accent `#7a4d18`. The post title set large in the serif, wrapping to at most three lines and truncating with an ellipsis beyond that. `public/brand/agentic-maison-wordmark-light-2x.png` embedded small in a lower corner. Nothing else — no dek, no author photo, no date, no decorative furniture. The card is read at thumbnail size in a feed; a title and a mark is all that survives it.

**Absolute URLs.** Check whether `metadataBase` is set on the root metadata export. If it is not, set it — that is a permitted change and it is the ordinary way Next resolves OG URLs to absolute.

## Out of Scope

- **Any redesign of the journal pages themselves.** This PRD touches metadata and image generation only.
- **OG images for non-journal routes** — the homepage, `/services`, `/digital`. `public/og.png` continues to serve them. Worth doing later; not here.
- **Replacing `public/og.png`.**
- **The seal.** Restricted to the favicon and optionally a namecard. It does not go on a social card.
- **Installing or configuring a CMS.**
- **Committing or pushing.** Leave the work in the working tree for review.

## Work Log

## Handoff / Next Action

## Result
### Summary

### Files Modified

### Discoveries
