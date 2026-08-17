# Plan: journal-publishing-pipeline

## Objective

Make publishing a journal article a file drop rather than a developer task, so that whoever owns content can create, edit and correct articles without the person who owns the repo being in the loop.

## Status

active

## Project Context

- project prefix: `web`
- project path: `unshared/website/`

This is the first plan and the first PRD set in this project. `ops/plans/` and `ops/prds/` already existed and are not gitignored, so no scaffolding step is needed.

**This plan does not sync.** It lives inside `unshared/`, the Obsidian Sync exclusion, so it exists only on machines holding the website checkout. The two marketing-side PRDs this initiative also creates are deliberately standalone, carrying their context inline, because they sync to a machine where this file is absent. A dated note at `company/marketing/notes/2026-08-11-journal-publishing-pipeline.md` carries the parts of this rationale that a marketing reader needs.

## Scope

### Included

- Migrating the journal's four existing posts from `.mdx` with an `export const meta` JavaScript block to `.md` with YAML frontmatter.
- Replacing the hand-maintained `mdxContentMap` static import registry in `src/app/[locale]/journal/[slug]/page.tsx` with a filesystem-driven loader, so that adding a post requires no source-code change.
- Generating Open Graph images at request or build time from post metadata via `next/og`, rather than uploading one per post.
- Evaluating candidate CMS options against the refactored stack and producing a recommendation with reasoning.
- Lifting Vincent's fifteen unpublished drafts out of this repo into the synced vault so the content owner can read them.
- An editorial triage pass over those fifteen drafts.

### Excluded

- **A separate `/blog` route.** The owner decided on a single content type: everything published is a journal entry, under the existing route, template and voice. The `src/content/blog/` directory is emptied by this initiative rather than wired up.
- **Payload CMS.** It is a capable system, but it moves content out of git and into a database, which costs the property this operation depends on — agents authoring content as files with git history as the audit trail. It also adds a database to host and migrations to run. The case for it opens at roughly five editors, real roles and approval states, or a content model too complex for frontmatter. None of those are true here.
- **External image hosting or a CDN.** Repo-committed images served through `next/image` are correct at this volume. Notion is ruled out specifically: its asset URLs expire.
- **Installing a CMS.** Deferred rather than excluded — see below.

## Success Criteria

- A new journal post can be published by creating a folder under `src/content/journal/` containing `en.md` and `zh.md` with YAML frontmatter. No TypeScript file is edited, and the build does not fail for want of a registry entry.
- The four existing posts render byte-identically in the browser after the migration — same titles, deks, emphasis spans, dates, authors, FAQ blocks and body content, in both locales.
- Every journal entry, in both locales, has a valid Open Graph image at a fetchable absolute URL, produced without an editor uploading anything.
- A written recommendation names one CMS, with the reasoning and the rejected alternatives recorded.
- All fifteen of Vincent's drafts are readable from a machine that does not hold `unshared/`.

## Phase Plan

1. **Refactor the content format** (`web-001`). The blocking constraint, and worth doing whether or not a CMS is ever installed. Everything else in the initiative is downstream of the file format being ordinary.
2. **Generate OG images** (`web-002`). Depends on the refactor, because it reads entry metadata from whatever the loader produces.
3. **Install Sveltia** (`web-004`). Depends on the refactor, which is what puts the content into the only layout Sveltia can edit. Carries a hard gate on markdown round-trip fidelity.
4. **Extract and triage the drafts** (`mkt-009`, `mkt-010`, in `company/marketing/`). Independent of all three above.

`web-003` sat between steps 1 and 3 as a CMS evaluation and was cancelled before dispatch when the owner chose Sveltia directly.

### Why the refactor is the load-bearing piece

Publishing a journal post today has four touch points, one of them source code. The metadata is a JavaScript `export const meta = { ... }` object, which no CMS can parse — Sveltia, Keystatic and Payload all read YAML, TOML or JSON frontmatter only. And `src/app/[locale]/journal/[slug]/page.tsx` holds a hand-maintained map of static import pairs, one per slug, guarded by `assertMdxRegistryComplete` so the build fails loudly if a post exists in content but not in the map. That guard is correct engineering and also an absolute wall: creating a post means a human editing a `.tsx` file, and no CMS will ever do that.

The reason this is cheap to fix is that the content does not need MDX. Every journal body was grepped for JSX elements and imports and contains none — not one component, not one import, exactly one `export const` per file, which is the meta block. The files are plain markdown wearing an `.mdx` extension. `gray-matter` is already a dependency.

A second benefit: Vincent's fifteen drafts are **already** `.md` with YAML frontmatter, so the refactor moves the journal toward the format the drafts sit in rather than converting fifteen files toward the journal.

## Child PRDs

| PRD | Title | Agent | Notes |
|-----|-------|-------|-------|
| `web-001` | Journal content-format refactor | `coder` | The blocking piece. No dependencies. |
| `web-002` | Generated Open Graph images | `coder` | Depends on `web-001`. Carries the CJK font problem. |
| `web-003` | CMS evaluation and recommendation | `researcher` | **Cancelled 2026-08-11**, never dispatched — the owner chose Sveltia directly. |
| `web-004` | Install and configure Sveltia CMS | `coder` | Depends on `web-001`. Carries the markdown-fidelity gate. |

Two further PRDs belong to this initiative but live in `company/marketing/` because their subject and their destination do, and because dependencies may not cross projects: `mkt-009` (extract the drafts into the synced vault, `librarian`) and `mkt-010` (editorial triage, a seat PRD whose operator is Kai).

## Open Questions

- Whether the repo gets a GitHub seat for the content owner. The owner is inclined to grant one. Worth noting that with a git-backed CMS this is plumbing rather than something the editor operates: the entire interaction is one "Sign in with GitHub" click, after which the surface is a form. The alternative Sveltia offers — a personal access token pasted into browser storage — is the thing a CMS was bought to avoid, so this question effectively has one acceptable answer.
- Whether OG images for Traditional Chinese posts subset the font per request or accept a heavier route bundle. `web-002` decides it against measurements rather than in advance.
- Whether Sveltia's markdown editor round-trips existing prose without reformatting it. See Risks.

**Resolved 2026-08-11: the CMS is Sveltia.** Chosen by the owner directly, which cancelled `web-003` before it was dispatched. The reasoning that got there is the same one that put the git-backed options ahead of Payload: content stays as files, commits stay the audit trail, and agents keep authoring posts by writing files rather than through an API client.

## Deferred / Recommended Next

- ~~Install Sveltia~~ — **promoted to `web-004` on 2026-08-11**, once the CMS decision made it specifiable. The nine evaluation criteria written into the cancelled `web-003` were the checklist it was written against.
- **Convert whichever drafts survive triage into publishable journal posts** — format conversion, Traditional Chinese adaptation review, FAQ authoring. Count unknown until `mkt-010` reports.
- **Delete `src/content/blog/` from this repo.** Held until `mkt-010` reports. `web-001` and `web-002` both leave the directory alone. Fourteen of the fifteen drafts are uncommitted, so this working copy was their only existence anywhere until `mkt-009` copied them into the synced vault. **The fifteenth is not**: `mkt-009` found `ai-tools-real-estate-hong-kong` already committed and pushed at `baf410a`, correcting this plan's original premise. Removing it is a real deletion of pushed content rather than a discard of untracked files, so it needs its own decision even if the other fourteen go without one.
- **Amend `company/marketing/AGENTS.md`.** Its journal section says the published copy *goes to* `unshared/website/src/content/journal/<slug>/`, a copy operation that leaves two live copies of one document and guarantees drift the first time either is edited. The rule this initiative implies is that the vault owns drafting history and the repo owns the published article, canonically, from the moment it ships. That file is doctrine; the amendment is drafted and proposed, never applied unilaterally, and the owner has not yet been asked for a decision on it.

## Risks / Assumptions

- **The four existing posts must survive the migration unchanged.** `entries.tsx` derives its registry by scanning the content directory and parsing each file's meta, and it builds JSX from `leafEmphasis` and `titleEmphasis` for the landing-page leaves. Those derived fields are easy to lose in a frontmatter migration and the loss is visual, not a build error. `web-001` treats before/after rendering equivalence as an acceptance criterion for that reason.
- **`assertMdxRegistryComplete` is a safety net, not an obstacle.** Removing the import map removes the class of error it guards. The replacement loader should keep an equivalent loud failure for a content folder that is malformed or missing a locale.
- **Sveltia CMS is pre-1.0** — v0.182.0 as of August 2026, actively released, with 1.0 targeted late 2026. Accepted knowingly. The mitigation that matters is the one the whole architecture already provides: content is markdown in git, so abandoning Sveltia costs a config file rather than a migration.
- **Sveltia's markdown editor may not round-trip existing prose faithfully.** A `raw` editing mode is documented, but issue #556 reports the markdown widget escaping asterisks across a whole document on save — including when the editor only touched the title — and it is recorded as intermittent rather than fixed. Frontmatter key ordering on save is undocumented in either direction. The four existing articles are hand-written and bilingual, and silent reformatting would be noticed weeks later, in git diffs nobody reads closely. **The install PRD must test this on a copy of a real post before the CMS is pointed at the live content**, and that test is a gate, not a nice-to-have.
- **The layout is now fixed by an external constraint.** `web-001` targets `<slug>/index.en.md` because that is what Sveltia's page-bundle pattern produces; the shape is no longer a free choice, and changing CMS later could mean changing it again.
- **Vincent's drafts were written against a content strategy that `mkt-003` has since corrected** — they target a non-technical, AI-naive reader, where the evidence says the buyer is AI-literate. Triage should assume a low survival rate rather than a high one.

## Revisions

### 2026-08-11 — Sveltia chosen, `web-003` cancelled, `web-001` revised

The owner selected Sveltia CMS directly rather than waiting on the evaluation, so `web-003` was cancelled before dispatch. Its nine criteria survive as the checklist the install is held against.

Verifying Sveltia's actual constraints then forced three changes to `web-001`, all of which would have been expensive to discover after it shipped:

- **No Sveltia i18n structure supports `<slug>/en.md`.** All five `i18n.structure` values were checked against the docs. `multiple_files` puts the locale in the filename suffix; `multiple_folders` puts it in a parent directory; the single-file modes put both locales in one file. The supported way to keep one folder per entry is the page-bundle pattern — `path: '{{slug}}/index'` with `multiple_files` — which yields `<slug>/index.en.md`. `web-001` was targeting the current layout on an assumption that turned out to be wrong.
- **One collection entry is one file**, with no mechanism for editing a sidecar in the same form. The `faq-<lang>.json` files would therefore have been permanently uneditable by the content owner, so FAQ content moves into frontmatter as a question/answer list, with the schema.org `FAQPage` object constructed in code. This is better regardless: an editor should type a question, not `"@type": "AcceptedAnswer"`.
- **Per-entry media folders are supported** under page bundles, contrary to the earlier reading of issues #190 and #301 — #190 was fixed in v0.37.0, and #301 is a different feature. So post-adjacent images work, and the empty `assets/` folder is deleted rather than preserved as a pattern.

A fourth finding changed no PRD but is recorded under Risks: Sveltia's markdown widget has an open, intermittent report of rewriting source on save.

### 2026-08-11

- Created initial plan.
