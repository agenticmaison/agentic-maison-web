---
id: web-008
title: Make Traditional Chinese optional per journal entry, English as fallback
status: queue
project: website
plan: journal-publishing-pipeline
agent: coder
operator: sean
working_path: .
depends_on: [web-004]
review_mode: human
created: 2026-08-18
updated: 2026-08-18
---

# PRD: web-008 Make Traditional Chinese optional per journal entry, English as fallback

## Objective

Let a journal entry publish with `index.en.md` alone. A folder missing `index.zh.md` is a legal, complete entry: the `zh` locale serves the English content as its fallback rather than 404ing or failing the build, and nothing an editor sees demands a zh file exist.

## Context

The Q3 content pipeline (vault-side, `company/marketing/content/` — see the dated note `company/marketing/notes/2026-08-11-journal-publishing-pipeline.md` for the vault/repo split rationale) was decided on 2026-08-18 to produce **English-only** articles. The journal as refactored by [[web-001-journal-content-format-refactor|web-001]] treats a missing locale file as a malformed entry — the loader kept `assertMdxRegistryComplete`'s loud-failure philosophy, which was correct when every post was bilingual and is now a wall: the next seven planned articles have no zh, and the first file drop would fail the build.

The four existing posts are bilingual and must stay exactly as they are. This PRD changes what is *permitted*, not what exists.

Sveltia constraints (see the plan's 2026-08-11 revision): the page-bundle layout `<slug>/index.<locale>.md` is fixed; Sveltia's i18n config has per-locale requirement options — whether a locale can be marked optional in the collection config without breaking `web-004`'s field modelling is part of this PRD's investigation, and [[web-004-sveltia-cms-install|web-004]] is in progress, which is why this depends on it rather than racing it on the same config file.

## Acceptance Criteria

- [ ] A journal folder containing only `index.en.md` builds and renders: the `/en/...` route serves it normally, and the `/zh/...` route for that slug serves the English content (dek, body, FAQ, TOC) — visibly, not a 404, not a blank page. If a "this article is available in English only" affordance is added on the zh route, it follows the site's existing bilingual UI conventions and vault-root voice.
- [ ] The loader's loud failure survives for genuinely malformed entries: a folder with **no** `index.en.md` (zh-only or empty) still fails the build with a clear message. English is the required locale; zh is the optional one — not "any one locale."
- [ ] Journal landing pages, OG image routes, sitemap, and structured data (`FAQPage`) behave correctly for a single-locale entry in both locales — no zh-side entry pointing at a missing resource, no duplicate-content hreflang mistakes: `hreflang` for a fallback zh page must not claim it is Chinese-language content (investigate and record the chosen pattern — canonical to `/en/`, `x-default`, or omission — in the Work Log).
- [ ] The four existing bilingual posts render byte-identically before and after (same standard web-001 held itself to).
- [ ] Sveltia: creating or editing an English-only entry in the CMS neither fails validation nor silently fabricates an empty `index.zh.md`. If Sveltia's i18n cannot express an optional locale cleanly, document the constraint and the chosen workaround in the Work Log rather than degrading the editor into a state where saving an entry corrupts it.
- [ ] Tests cover: en-only entry renders on both routes, en-missing entry fails the build, bilingual entry unaffected.

## Implementation Notes

- Read this repo's `AGENTS.md` first — the journal section, the metadata rules (`pageMetadata()`, never a raw `openGraph` object), and the note that this Next.js version differs from training data (`node_modules/next/dist/docs/`).
- The fallback should be resolved in the loader (`src/lib/journal/`), not by duplicating files at build time — one source file per language that exists, per the initiative's no-two-live-copies principle.
- Retry a red build before debugging it (`next/font/google` network flake — see `AGENTS.md`).

## Out of Scope

- Writing or converting any content; no changes under `src/content/`.
- Removing zh support or any existing zh page — this makes zh optional, not deprecated.
- The vault-side content pipeline and its PRDs (mkt-011/012/013).
- web-007's auth/account work.

## Work Log

## Handoff / Next Action

## Result
### Summary

### Files Modified

### Discoveries
