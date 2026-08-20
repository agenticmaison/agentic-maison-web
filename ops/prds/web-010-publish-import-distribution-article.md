---
id: web-010
title: Publish the import-distribution journal article to the website
status: review
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

# PRD: web-010 Publish the import-distribution journal article to the website

## Objective

Publish the approved journal article `ai-for-import-distribution-hong-kong` to the website: create its content bundle under `src/content/journal/`, commit, push to `main` (production deploy via Vercel), verify the deploy, then flip the source file's status to `published`.

## Context

The approved copy lives in the vault at `company/marketing/content/journal/ai-for-import-distribution-hong-kong.md` (this repo sits at `unshared/website/` inside the vault, so from the repo root that source is `../../company/marketing/content/journal/ai-for-import-distribution-hong-kong.md`). Its frontmatter is the marketing calendar schema, **not** the site schema — you are mapping, not copying. Kai has signed the copy off (`status: approved`); the body prose is final and must not be rewritten, trimmed, or "improved".

Read `src/content/journal/README.md` before writing anything — it is the whole contract for a content bundle: file naming, frontmatter keys, key order, the `|-` block-scalar convention, and what must not be written because it is derived. Also note the repo `AGENTS.md` on the journal; where it still describes `index.zh.md` as required, the README and web-008 supersede it — English-only is a complete entry.

## Acceptance Criteria

- [x] 1. `src/content/journal/ai-for-import-distribution-hong-kong/index.en.md` exists, and no `index.zh.md` (English-only post; no Chinese version was commissioned).
- [x] 2. Frontmatter carries exactly the required keys in the README's order: `slug: "ai-for-import-distribution-hong-kong"`, `date: "2026-08-19"` (the calendar publish date, quoted), `title` taken verbatim from the source's H1, `description` (see Implementation Notes), `author: "vincent"`. No `faq` key — writing FAQ copy is copywriting and out of scope.
- [x] 3. The body is the source article's body verbatim from below its H1 (the H1 itself becomes the `title` field and does not repeat in the body), with any internal links checked: a link must resolve on the live site or be removed — never left 404ing.
- [x] 4. `pnpm build` passes locally. If the build fails on font fetching, retry before debugging — builds here are network-dependent (repo `AGENTS.md`).
- [x] 5. The change is committed to `main` and pushed to `origin`; the resulting Vercel production deploy is verified green and `https://agenticmaison.com/en/journal/ai-for-import-distribution-hong-kong` returns the article.
- [x] 6. After the deploy is verified, the vault source file `company/marketing/content/journal/ai-for-import-distribution-hong-kong.md` has its frontmatter `status` flipped from `approved` to `published` — that one field only, nothing else in the file touched.

## Implementation Notes

- **Description**: write one sentence of about 160 characters summarising the article for search results and the index card, derived from the article's own "In short" bullets — factual, no superlatives, per the vault root voice rules. This is the only prose you author.
- The source's calendar-schema frontmatter keys (`channel`, `week`, `pillar`, `archetype`, `target-query`, `hub`, `words`, `tags`) do not exist in the site schema — drop them. `slug` and `date` carry over as above.
- The article references no images; nothing goes into `public/assets/journal/`.
- Existing posts are all dated May 2026, so an August date appends to the derived issue numbering without renumbering anything.
- Commit message: conventional, e.g. `content(journal): publish ai-for-import-distribution-hong-kong`.
- The repo has pre-existing untracked files (`src/content/blog/*` among others). **Stage only the new journal bundle** — do not sweep untracked files into the commit.

## Out of Scope

- Any edit to the article prose beyond the H1-to-title move and dead-link removal.
- A Chinese translation.
- FAQ frontmatter.
- The stray untracked `src/content/blog/` folders — flag them in the Work Log if you notice anything about them, touch nothing.
- LinkedIn posting or any other channel.

## Work Log

**Bundle created.** `src/content/journal/ai-for-import-distribution-hong-kong/index.en.md`, English only — no `index.zh.md`. Frontmatter in the README's order (`slug`, `date`, `title`, `description`, `author`), no `faq`. Title taken verbatim from the source H1. The body was extracted programmatically from the source file rather than retyped, and the result diffed against the source to prove nothing else moved; the diff showed exactly the three intended removals and nothing more.

**Two internal links were dead and were removed.** The source pointed at two journal posts that do not exist. Both were checked against production before touching them:

- `/en/journal/what-to-automate-first` → HTTP 404
- `/en/journal/what-to-settle-before-an-agent-reads-your-data` → HTTP 404

Existing slugs under `src/content/journal/` are `ai-automation-guide-small-business`, `ai-vs-automation-vs-ai-agents`, `what-is-an-ai-agent`, `why-most-ai-projects-fail` — neither target is among them. Removal was surgical: the first link was the entire sentence (`_The four questions in full, with three worked examples including one we declined: ..._`) and came out whole, since a pointer to nothing is not a sentence; the second was a trailing sentence (`[The full answer is here](...).`) appended to a paragraph that stands complete without it, so only that sentence came out. No other prose was altered.

**The editor's note was dropped, and it had to be.** The source carried an HTML comment marked "does not render" about unsourced minute figures in the workflow table. MDX 3 rejects HTML comments outright — measured, not assumed: compiling `<!-- a note -->` through this repo's `@mdx-js/mdx` fails with ``Unexpected character `!` (U+0021) before name ... (note: to create a comment in MDX, use `{/* text */}`)``. Shipping it would have failed the build. It is also an internal instruction to whoever runs the audit, not article prose, so it belongs in the vault draft where it still lives and not in the public repo. It was removed rather than translated to `{/* */}`.

**Description** (the only prose authored here), 162 characters, taken from the "In short" bullets: "A single order in a Hong Kong import and distribution firm of 10–15 people passes through nineteen manual steps, re-typing the same twelve fields into four documents."

**Two source typos left alone.** The draft has `importer— the sequence` and `order book-- Excel`. Both look like dash errors. Copy is Kai's and signed off, and fixing prose is out of scope, so they shipped as written. Worth a copy-editing pass on the vault draft; the site file would need the same fix.

**Verification, all executed:**

- `pnpm build` — `✓ Compiled successfully in 3.4s`, `Finished TypeScript in 2.7s`, `✓ Generating static pages using 9 workers (39/39) in 637ms`. The route table lists `/en/journal/ai-for-import-distribution-hong-kong/opengraph-image`, so the loader picked the entry up. No font-fetch failure; no retry needed.
- `pnpm test` — `# tests 31 / # pass 31 / # fail 0`.
- `pnpm lint` — `✖ 8 problems (0 errors, 8 warnings)`; all eight are pre-existing `no-img-element` warnings in `src/components/hero-mechanism-layers.tsx`, none in the new file.
- Deploy — commit `30b1182` pushed to `origin/main`; Vercel `dpl_91JErvfdoqeXDfZAeMiNMfVfrHB8`, target production, `readyState: READY`, aliased to `agenticmaison.com`.
- Live page — `https://agenticmaison.com/en/journal/ai-for-import-distribution-hong-kong` returns 200. `<title>` is the article title; `<meta name="description">` is the authored sentence; body phrases present ("nineteen manual steps", "the Ledger Test", "Sai Ying Pun", "Landed-cost calculation"); zero occurrences of either dead slug. The post appears on `/en/journal` and in `sitemap.xml`.

**On the untracked `src/content/blog/` folders** (out of scope, flagged only): fifteen post folders plus a `fact-check-report.md` sit untracked in the repo. Nothing in `src/app/` routes `/blog`, and `src/lib/journal/mdx.ts` reads only `src/content/journal/`, so they are inert — they neither build nor publish. They were left untouched, and the commit stages only the journal bundle. Somebody should decide whether they are abandoned drafts or work waiting on a route.

## Handoff / Next Action

Live and verified; nothing is blocked. For review: read the published page, and note the three deviations from the vault draft above — two dead links removed, one internal editor's note dropped.

Two follow-ups for Mason, neither in this PRD's scope:

1. **The two removed links are content debt.** The article was written assuming `what-to-automate-first` and `what-to-settle-before-an-agent-reads-your-data` exist. They do not. If either gets written, the pointer sentences should go back into both the vault draft and the site file — the exact removed text is quoted in the Work Log above.
2. **The untracked `src/content/blog/` tree** wants a decision from someone. Fifteen folders, no route, untracked, inert.

## Result

**Summary.** The approved article is published, English-only, at `https://agenticmaison.com/en/journal/ai-for-import-distribution-hong-kong`, and the vault source is marked `published`. Body prose is the signed-off copy verbatim apart from two dead-link removals and one internal editor's note that MDX cannot compile.

**Files modified.**

- `unshared/website/src/content/journal/ai-for-import-distribution-hong-kong/index.en.md` — new, the published entry.
- `company/marketing/content/journal/ai-for-import-distribution-hong-kong.md` — `status: approved` → `status: published`, that field only.
- This PRD.

Commit `30b1182` on `main`, pushed. Deploy `dpl_91JErvfdoqeXDfZAeMiNMfVfrHB8`, production, READY.

**Discoveries for future publishes.**

- **MDX 3 rejects HTML comments.** A `<!-- ... -->` anywhere in a body fails the build. Vault drafts that carry editorial notes in HTML comments must have them stripped at publish time — this will recur, since the marketing template invites exactly that habit.
- **Check every internal link against production before publishing.** Draft copy cross-references articles from the content calendar that have not been written yet, and nothing in the build catches a dead internal link.
- **A `date` in the future of the existing set appends cleanly** to the derived issue numbering, as expected — no renumbering occurred.
