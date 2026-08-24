---
id: web-011
title: Add GFM support to the journal MDX pipeline so tables render
status: done
project: website
plan: journal-publishing-pipeline
agent: coder
operator: sean
working_path: .
depends_on: []
review_mode: human
created: 2026-08-20
updated: 2026-08-20
---

# PRD: web-011 Add GFM support to the journal MDX pipeline so tables render

## Objective

Make GitHub-Flavored Markdown tables render as tables in journal posts. The live article `/en/journal/ai-for-import-distribution-hong-kong` contains a well-formed pipe table that currently renders as literal pipe-delimited prose, because the MDX compile in `src/lib/journal/mdx.ts` runs no `remark-gfm` and CommonMark has no table syntax.

## Context

This is the first journal post to carry a table, so the gap was invisible until today. The content file is correct — do not touch it. The fix is in the pipeline: add `remark-gfm` and register it in the journal MDX compile. Note the repo `AGENTS.md`: pnpm's isolated `node_modules` does not expose transitive packages, so `remark-gfm` must be a **direct** dependency even if something already depends on it.

Also per the repo `AGENTS.md`: heading anchors and the TOC come from one pass (`rehype-slug` then a collector) — do not disturb the rehype plugin order at `src/lib/journal/mdx.ts` (around line 436).

Since the last dispatch, `origin/main` gained two CMS commits by Kai (`bd93947`, `5b4fc4f`). The local checkout is already fast-forwarded to `5b4fc4f`; pull before you start anyway.

## Acceptance Criteria

1. `remark-gfm` is a direct dependency in `package.json`, version pinned consistently with how the repo pins its other unified/remark packages.
2. Every code path that compiles journal Markdown/MDX in `src/lib/journal/mdx.ts` registers `remark-gfm` in its `remarkPlugins` — if there is more than one compile call (e.g. entry body and anything else that renders post markdown), all of them get it, and the Work Log names each one.
3. The rehype plugin order (`rehypeSlug`, then the heading collector) is unchanged.
4. `pnpm build`, `pnpm test`, `pnpm lint` all pass (retry a red build once before debugging — font fetches are network-dependent).
5. Local verification before pushing: the built page for `ai-for-import-distribution-hong-kong` renders the "What AI automation can do" section as an HTML `<table>`, not literal pipes. Verify against build output or a local render, not by assumption.
6. GFM's other constructs do not break existing posts: the four existing journal entries still build and their pages render without visual regression in structure (spot-check the built HTML for one of them for unexpected new elements).
7. Committed to `main`, pushed, Vercel production deploy verified READY, and `https://agenticmaison.com/en/journal/ai-for-import-distribution-hong-kong` serves the table as a table.
8. Tables wider than the content column must not force the page to scroll horizontally — if the rendered table overflows on a narrow viewport, wrap tables in an `overflow-x: auto` container via the journal's markdown component styling. If it already behaves, record that finding and change nothing.

## Implementation Notes

- The compile lives in `src/lib/journal/mdx.ts`; the existing `rehypePlugins: [rehypeSlug, collector.plugin]` call is the anchor point.
- If journal styling has no table styles at all (likely, since no post had one), add minimal table CSS consistent with the article page's existing typography — borders/spacing legible in the site's existing light and dark treatment if the site has one; match the surrounding prose styles, invent nothing decorative.
- Commit message: conventional, e.g. `fix(journal): render GFM tables in post bodies`.
- Stage only the files this change touches; the repo still carries stray untracked `src/content/blog/` folders — leave them.

## Out of Scope

- Any edit to any content file under `src/content/journal/`.
- The stray `src/content/blog/` folders.
- Sveltia CMS configuration.
- Homepage or non-journal pages.

## Work Log

**Dependency.** `pnpm add remark-gfm` → `remark-gfm@4.0.1`, recorded in `package.json` as `"remark-gfm": "^4.0.1"`. Caret, matching `rehype-slug: ^6.0.0` — the repo's other unified plugin. The exact pin on `@mdx-js/mdx: 3.1.1` is not the precedent to follow: that one is pinned because it is the compiler itself, reached around `@next/mdx`, not because remark/rehype plugins are pinned here.

**Compile sites — there is exactly one.** `evaluate()` is called in a single place in `src/lib/journal/mdx.ts`: `compileJournalMarkdown()` (line ~425), which `compileJournalBody()` delegates to and which the heading tests drive directly. Grepping `src/` for `evaluate(`, `@mdx-js/mdx`, `compileJournalMarkdown` and `compileJournalBody` turns up no second compile path — the journal page, the single-locale tests and the heading tests all funnel through that one function. `remarkPlugins: [remarkGfm]` was added there. The separate `createMDX({ options: { rehypePlugins: ['rehype-slug'] } })` in `next.config.ts` compiles `.mdx` files imported as routes, which the journal no longer uses; left untouched as out of scope.

**Rehype order unchanged.** `rehypePlugins: [rehypeSlug, collector.plugin]` is byte-identical; `remarkPlugins` was added as a new adjacent key.

**Table styling was needed — there was none.** Tailwind preflight strips all default table rendering, so an unstyled GFM table renders as run-together text. Added `table`/`thead`/`th`/`td` to `proseComponents` in `src/lib/journal/prose-components.tsx`, using the same tokens as the surrounding prose (`border-rule` hairlines, `text-ink` headers, `text-ink-2` cells, body face at `0.92em`). Nothing decorative: no zebra striping, no vertical rules, no fill.

**Two judgment calls in that styling, both minor.**
1. The `table` component renders inside an `overflow-x-auto` wrapper `div` rather than styling the `<table>` alone (AC8). Verified in a browser at a 375px viewport against the production build: `document.documentElement.scrollWidth === clientWidth === 375` — the page does not scroll sideways — while the wrapper scrolls internally (`scrollWidth 544` vs `clientWidth 289`).
2. The table carries `min-w-[34rem]`. Without a minimum, a four-column prose table does not overflow at all; it compresses to roughly one word per line on a phone, which is technically compliant and unreadable. The minimum is what makes the scroll container do any work. At 1280px the table is 671px wide and fits the column with no scrolling.

**Verification — commands run, output captured.**
- `pnpm lint` → `✖ 8 problems (0 errors, 8 warnings)`. All eight are pre-existing `@next/next/no-img-element` warnings in `src/app/deck/page.tsx` and `src/components/hero-mechanism-layers.tsx`; none in the files touched here.
- `pnpm test` → `# tests 31 / # pass 31 / # fail 0`.
- `pnpm build` → succeeded on the first attempt, 39/39 static pages generated, no retry needed.
- AC5: served the production build with `pnpm start` and fetched `/en/journal/ai-for-import-distribution-hong-kong`. The HTML contains exactly one `<table>`, its four `<th>` cells read "Workflow / What it costs now / What an agent can do / What stays human", and the literal string `| **Landed-cost` appears zero times. Screenshot confirms the rendered table.
- AC6: fetched all four pre-existing entries in both locales — eight pages, all HTTP 200 — and grepped each for the constructs GFM adds. Zero `<table>`, zero `<del>`, zero `type="checkbox"`, zero `data-footnotes` across all eight. GFM changes nothing in the existing corpus.
- AC7: committed as `079be15` and pushed to `main`. Vercel production deployment `dpl_2e82vB9GgYBNFJzte8vRdGnY6HD1` reports `"state": "READY"` for commit `079be158b3d3` with `agenticmaison.com` among its aliases. Fetching the live URL returns one `<table>` carrying the expected `<th>` cells and zero literal `| **Landed-cost` occurrences.

## Handoff / Next Action

Ready for human review. Live: [https://agenticmaison.com/en/journal/ai-for-import-distribution-hong-kong](https://agenticmaison.com/en/journal/ai-for-import-distribution-hong-kong) — the "What AI automation can do" section renders as a table.

Two notes for whoever curates `unshared/website/AGENTS.md` (not edited here, per doctrine):

1. The journal MDX pipeline now runs GFM. The "Adding a post is a file drop" section is the natural home for a line saying tables, strikethrough, task lists and footnotes are available to a CMS author, and that the styling for them lives in `src/lib/journal/prose-components.tsx`.
2. `next.config.ts` still configures `rehype-slug` only, for `.mdx` route imports. If any future page imports MDX directly and needs tables, that config needs `remark-gfm` separately — the two pipelines do not share plugin lists.

Unrelated and untouched: `ops/prds/web-007-sveltia-auth-and-access.md` carries uncommitted local edits, and the stray `src/content/blog/` folders are still untracked.

## Result

**Summary.** GFM tables render in journal posts. `remark-gfm` is a direct dependency and is registered on the journal's single MDX compile; table styling was added to the journal prose component map, wrapped in a horizontal scroll container so a wide table never scrolls the page. Committed as `fix(journal): render GFM tables in post bodies` and pushed to `main`; the Vercel production deploy is READY and the live page serves the table as a table.

**Files Modified.**
- `unshared/website/package.json`, `unshared/website/pnpm-lock.yaml` — `remark-gfm@^4.0.1` added as a direct dependency.
- `unshared/website/src/lib/journal/mdx.ts` — `remarkPlugins: [remarkGfm]` on the `evaluate()` call in `compileJournalMarkdown()`. Rehype order untouched.
- `unshared/website/src/lib/journal/prose-components.tsx` — `table`, `thead`, `th`, `td` component mappings plus the scroll wrapper.

**Discoveries.**
- There is exactly one MDX compile path for journal content. Anything else that needs to affect journal rendering has one place to go.
- Tailwind preflight means any new HTML element GFM can emit arrives unstyled. Tables were the case that mattered today; task lists and footnotes would each need the same treatment before a post uses one.
- A wide prose table does not overflow its container on its own — it compresses. A `min-width` is required for an `overflow-x` wrapper to be more than decoration.
