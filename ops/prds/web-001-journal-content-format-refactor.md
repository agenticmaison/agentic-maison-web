---
id: web-001
title: Journal content-format refactor — YAML frontmatter and a filesystem loader
status: done
project: website
plan: journal-publishing-pipeline
agent: coder
operator: sean
working_path: .
depends_on: []
review_mode: human
created: 2026-08-11
updated: 2026-08-17
---

# PRD: web-001 Journal content-format refactor — YAML frontmatter and a filesystem loader

## Objective

Make adding a journal post a file drop, in the exact on-disk layout Sveltia CMS is able to edit. After this PRD, creating a folder under `src/content/journal/` containing `index.en.md` and `index.zh.md` publishes a post, with no TypeScript file edited anywhere in the repo.

Rendering is **behaviour-preserving**. The four existing posts must look and emit exactly what they do today. What changes is where the source lives and how it is parsed.

## Context

### What blocks publishing today

Publishing a journal post currently has four touch points, one of them source code:

1. Journal entries carry their metadata as a JavaScript block — `export const meta = { ... }` — at the top of `src/content/journal/<slug>/en.mdx` and `zh.mdx`. This is not frontmatter. Sveltia parses YAML, TOML and JSON frontmatter only; it has no ability to read a JS export.
2. `src/app/[locale]/journal/[slug]/page.tsx` holds `mdxContentMap`, a hand-maintained registry of static import pairs keyed by slug, with the comment "Next.js requires statically analyzable imports for MDX React components." It is guarded by `assertMdxRegistryComplete`, which hard-fails the build when a post exists in `src/content/journal/` but not in the map.

That guard is correct engineering — it fails loudly rather than silently. It is also an absolute wall, because it means creating a post requires a human to edit a `.tsx` file.

### Why this is cheap

Every journal body in the repo was grepped for JSX elements, `import` statements and `export` statements. There are none — not one component, not one import, and exactly one `export const` per file, which is the meta block itself. **The journal's `.mdx` files are plain markdown wearing an `.mdx` extension.** Nothing in them requires MDX.

`gray-matter` is already a dependency of this repo.

### The CMS is decided, and it dictates the layout

The owner has chosen **Sveltia CMS**. It is git-backed: content stays as files in this repo, commits stay the audit trail, and agents keep authoring posts by writing files. Installing and configuring it is a **later PRD** and is not your work. But its file-layout constraints are load-bearing here, because this PRD is what fixes the layout in place, and getting it wrong means migrating every post twice.

Three constraints were verified against Sveltia's documentation and issue tracker, and they are the reason this PRD's target shape is not simply the current shape:

- **No i18n structure produces `<slug>/en.md` + `<slug>/zh.md`.** Sveltia inherits Decap's five `i18n.structure` values, and all five are checked: `multiple_files` puts the locale in the *filename suffix* (`what-is-an-ai-agent.en.md`), `multiple_folders` puts it in a *parent directory* (`en/what-is-an-ai-agent.md`), and the single-file modes put both locales inside one file. A directory named for the slug containing files named for the locale is not among them.
- **Per-entry folders are supported, as "page bundles."** Setting `path: '{{slug}}/index'` on an entry collection, combined with `multiple_files` i18n, produces `<slug>/index.en.md` and `<slug>/index.zh.md` — the folder-per-slug shape preserved, with the filename stem fixed at `index`. With `media_folder: ''` and `public_folder: ''` this also gives each entry its own media folder, so post-adjacent images work. This is the target.
- **One collection entry is one file.** There is no mechanism — no nested widget, no second collection — that pulls a sidecar file into the same editing form. So `faq-en.json` and `faq-zh.json`, as separate files, would be permanently uneditable by the person who owns content.

### The FAQ files are structured data, not prose

`getFaqJsonLd` in `src/lib/journal/mdx.ts` reads `faq-<lang>.json`, validates it is a schema.org `FAQPage` with a `mainEntity` array, and `page.tsx` emits it as a `<script type="application/ld+json">` block. Three of the four posts have them; `why-most-ai-projects-fail` has none, and its `assets/` folder is empty.

Moving this into frontmatter is not merely a workaround for the one-file constraint — it is better on its own terms. An editor should type a question and an answer. Nobody should be hand-writing `"@type": "AcceptedAnswer"` boilerplate into a JSON file, and every character of that boilerplate is a chance to produce structured data that silently fails validation.

### What already works and must not be broken

`src/lib/journal/entries.tsx` is well built and mostly survives. It already discovers slugs by scanning `src/content/journal/` via `getJournalSlugs`, parses each file's metadata via `parseRawMeta` in `src/lib/journal/mdx.ts`, merges the English and Chinese files into one `JournalEntryMeta` with `{ en, zh }` shaped fields, sorts by date descending, and builds JSX leaf titles from `leafEmphasis` and `titleEmphasis`. The metadata is therefore **not** duplicated between the content files and a registry — the content file is already canonical. Only the import map has to go.

The `{ en, zh }` merge behaviour is load-bearing and must be preserved: `dateDisplay`, `title` and `dek` take their English value from `en` and their Chinese value from `zh`, while `metaDescription` is a single string taken from the English file, and `entry.dek.zh` is used as the Chinese meta description at `page.tsx` line 82.

## Acceptance Criteria

- [x] Every journal entry is stored as `src/content/journal/<slug>/index.en.md` and `src/content/journal/<slug>/index.zh.md`, with YAML frontmatter delimited by `---`.
- [x] `grep -rn "export const" src/content/` returns no results.
- [x] `grep -rn "mdxContentMap" src/` returns no results, and the hand-maintained import registry no longer exists anywhere in the repo.
- [x] No `faq-*.json` files remain. FAQ content lives in the frontmatter of the locale file it belongs to.
- [x] Adding a new content folder with valid `index.en.md` and `index.zh.md` produces a working route at `/en/journal/<slug>` and `/zh/journal/<slug>` with **no source file edited**. Verify by creating a throwaway post, building, confirming both routes render, then deleting it — and record in the Work Log that you did.
- [x] The four existing posts (`why-most-ai-projects-fail`, `ai-automation-guide-small-business`, `what-is-an-ai-agent`, `ai-vs-automation-vs-ai-agents`) render identically before and after, in both locales. "Identically" means: page title, `<h1>` including its emphasis span, dek, displayed date, author, full body HTML, and heading anchor ids. Capture the rendered HTML for all eight pages before you start and diff against it after. Attach the diff result to the Work Log.
- [x] The emitted FAQ JSON-LD is **semantically equivalent** to what is emitted today for the three posts that have it — same questions, same answers, same order, same schema.org types — and still validates as a `FAQPage`. Key ordering within the JSON may differ; content may not. The post without FAQ data must still emit no JSON-LD block at all.
- [x] The journal index at `/en/journal` and `/zh/journal`, the homepage journal leaves, and the sitemap all still list all four entries, in the same order, with the same leaf emphasis rendering.
- [x] A content folder that is malformed — missing a locale file, missing a required frontmatter key, carrying unparseable YAML, or carrying FAQ entries missing a question or an answer — fails the build with a message naming the offending slug and the specific problem. This replaces the guarantee `assertMdxRegistryComplete` and the old FAQ schema validation were providing.
- [x] `pnpm build` and `pnpm lint` both pass.

## Implementation Notes

**Frontmatter shape.** Map the existing `meta` keys one-to-one into YAML, keeping the same names: `slug`, `num`, `date`, `dateDisplay`, `title`, `dek`, `metaDescription`, `author`, and the optional `leafEmphasis` and `titleEmphasis`. Each locale file carries its own locale's values, exactly as the two `meta` blocks do now; the loader keeps doing the merge. `metaDescription` continues to be read from the English file only.

**FAQ shape.** A `faq` key holding a list of objects with two string fields — use `question` and `answer` as the field names. Absent or empty means no JSON-LD block, matching today's behaviour for `why-most-ai-projects-fail`. Rewrite `getFaqJsonLd` to construct the schema.org `FAQPage` object from that list rather than reading and validating a file; keep it in `src/lib/journal/mdx.ts` and keep its call site in `page.tsx` unchanged. Answers are prose and will contain punctuation that YAML cares about — use block scalars so nothing needs escaping.

**Rendering.** Keep the existing MDX toolchain and compile from the raw file string at build time, preserving the current plugin set — `rehype-slug` in particular, since heading anchor ids are an acceptance criterion — and the current component mapping. This is the option that changes rendering behaviour least, and `@mdx-js/mdx` is already present transitively via `@next/mdx`.

**One dependency addition is pre-approved** and only one: if compiling MDX from a string proves awkward, `next-mdx-remote` may be added. Do not introduce a different markdown pipeline (`react-markdown`, `marked`, `markdown-it`) — a new dialect risks silent rendering differences across four posts in two languages, which is precisely what the diff criterion exists to prevent.

**Extension and filename.** `.md`, not `.mdx` — the bodies are plain markdown and `.md` is unambiguous to both humans and CMS tooling. The `index.` stem is not decorative: it is what Sveltia's page-bundle `path: '{{slug}}/index'` produces, and departing from it is what would force a second migration later.

**Keep `src/lib/journal/entries.tsx` and `mdx.ts` as the seam.** Adapt `parseRawMeta` to read YAML via `gray-matter` instead of parsing a JS object literal, and give the loader a body-content path alongside the metadata path. Callers of `getJournalEntries` and `getEntryBySlug` should not need to change.

**The empty `assets/` folder** under `why-most-ai-projects-fail` contains nothing. Delete it. Under page bundles the entry folder is itself the media folder, so a separate `assets/` subfolder is not the shape future images will take.

## Out of Scope

- **Installing or configuring Sveltia.** A later PRD owns the admin mount, `config.yml`, the collection schema, the OAuth relay and the editorial workflow. Do not add an `admin/` folder, a CMS config file, or any dependency related to it. Your job is to leave the content in a shape that install can succeed against.
- **Open Graph images.** `web-002` owns them. Do not add, remove or alter OG metadata behaviour here.
- **Changing `num` to a derived value.** It is a manually assigned display identifier and a good candidate for a CMS default later, but changing it here would be a behaviour change inside a behaviour-preserving migration, and deriving it from date order would renumber existing posts if a backdated one were ever added. Leave it an explicit frontmatter field.
- **`src/content/blog/`.** Leave those fifteen draft folders and `fact-check-report.md` completely untouched. They are uncommitted and this working copy is currently their only existence anywhere; `mkt-009` copies them into the synced vault before anything may be deleted.
- **Any change to how posts look.** No restyling, no layout changes, no copy edits, no typography changes. If you find a rendering bug, record it in the Work Log rather than fixing it.
- **Committing or pushing.** Leave the work in the working tree for review.

## Work Log

### 2026-08-11 — revised before dispatch

Revised after the owner chose Sveltia CMS and its constraints were verified against current documentation. Three changes, all to prevent a second migration of every post:

- **Target filenames changed from `en.md` / `zh.md` to `index.en.md` / `index.zh.md`.** The original shape was carried over from the current layout on the assumption Sveltia's `multiple_files` i18n structure supported it. It does not — none of the five `i18n.structure` values produces a slug-named directory containing locale-named files. The page-bundle pattern (`path: '{{slug}}/index'` plus `multiple_files`) is the supported way to keep a folder per entry.
- **FAQ content moves from `faq-<lang>.json` sidecars into frontmatter.** One Sveltia collection entry maps to exactly one file, with no documented mechanism for pulling a sidecar into the same form, so the JSON files would have been permanently uneditable by the content owner.
- **The empty `assets/` folder is deleted** rather than preserved, since page bundles make the entry folder its own media folder.

### 2026-08-11 — worker stalled during final verification

Dispatched to `coder` and ran to what appears to be near-completion, then stalled with no output for ten minutes and was killed by the watchdog. It never wrote to this PRD, so everything below was reconstructed by the dispatcher from the working tree, not reported by the worker. Its last emitted line was "Final verification pass — re-capturing HTML from this clean build and re-running the full diff."

**Nothing here has been verified.** No build, lint, render-diff or throwaway-post result exists. Treat the code as written but untested.

State of the working tree at the time of the stall:

- All four entries migrated to `index.en.md` / `index.zh.md`; the `.mdx` files and all six `faq-*.json` files are deleted.
- Modified: `src/lib/journal/mdx.ts` (+311/−…, the bulk of the work), `src/app/[locale]/journal/[slug]/page.tsx` (−69 net, consistent with the import map being removed), `src/lib/journal/entries.tsx`, `src/mdx-components.tsx`, `src/content/journal/README.md`.
- `package.json` gained `@mdx-js/mdx` at a pinned `3.1.1` as a direct dependency. This is not the pre-approved addition, which was `next-mdx-remote` — but it is the package this PRD named as already present transitively, and promoting it to a direct dependency to compile from a string is a defensible reading. Flagged rather than reverted; the reviewer should confirm it.
- `.gitignore` and the repo's `AGENTS.md` are also modified, and **were already modified before dispatch** — verified against the working tree captured at session start. Not this worker's doing, and not to be attributed to it.
- The `assets/` folder deletion and the `src/content/blog/` no-touch constraint both appear respected.

### 2026-08-17 — re-dispatched from `needs_attention` on the operator's instruction

Moved straight from `needs_attention` back to `in_progress` rather than through `queue`, because the operator directed the resume in the room. Second dispatch to `coder`, briefed against the Handoff below rather than the original brief — the work is written and the outstanding job is verification.

### 2026-08-17 — second dispatch: verification pass, all criteria met

Verified the first worker's implementation rather than re-implementing it. Read the tree first and judged it complete — nothing was missing, and nothing was rewritten. All findings below come from commands actually run, with output captured.

**Implementation review.** The migration is sound and matches the brief. `parseRawMeta` now reads YAML through `gray-matter`; `readEntryFile` is a single validating reader behind a cache, feeding `parseRawMeta`, `getEntryBody`, `compileJournalBody` and `getFaqJsonLd`; bodies compile via `@mdx-js/mdx`'s `evaluate` with `rehype-slug` preserved; `entries.tsx` keeps its `{ en, zh }` merge and its JSX leaf/entry title builders untouched. Callers of `getJournalEntries` and `getEntryBySlug` did not change.

One structural change the reconstructed log did not mention: the component map moved out of `src/mdx-components.tsx` into a new `src/lib/journal/prose-components.tsx`, and `useMDXComponents` now re-exports it. Necessary — bodies compiled from a string never pass through the `@next/mdx` hook, so the map has to be handed to `<Content components={...} />` explicitly. The class strings are byte-identical to the originals, which the render diff confirms.

**Build and lint.** `pnpm build` exits 0, 29 routes, identical route table to the pre-migration build. `pnpm lint` exits 0 with `9 problems (0 errors, 9 warnings)` — and the pre-migration baseline produces the same `9 problems (0 errors, 9 warnings)`. No new warning was introduced; all nine are pre-existing `no-img-element` and one unused `htmlLang`.

**Render diff — the baseline was rebuilt from git, and the result is byte-identical.** The lost "before" capture was reconstructed by adding a detached worktree at `HEAD` (`be86a15`), installing into it, and building it — a real pre-migration build, not a reconstruction from diffs. Both versions were served simultaneously on separate ports and all 12 pages fetched from each: the eight entry pages, both journal indexes, and both homepages.

After normalizing three build-identity tokens — the 21-character Next build id, chunk filename hashes, and the contact form's server-action id — **all 12 pages are byte-identical**. Not "no visible difference": the same bytes. That covers page title, `<h1>` and its emphasis span, dek, displayed date, author, entire body HTML, and every heading anchor id, in both locales.

The server-action id needed proof rather than a hand-wave, since it was the one delta left. It is stable across repeated builds of the same tree, and unmoved by adding a comment, adding a module to the graph, or applying the migrated `package.json` — so "it's just build noise" would have been a guess. Building the **identical** `HEAD` code in a second worktree at a different absolute path produced a third distinct id (`…f0f264…`, `…efacd9…`), which establishes it as a hash over the project path. It is an artifact of the baseline living in a scratch directory, not a consequence of this work.

Sitemap: URL set and order identical, diff confined to the `<lastmod>` timestamp, which is `new Date()` at request time. Homepage journal leaves: identical, same three slugs in the same order (`ai-vs-automation-vs-ai-agents`, `what-is-an-ai-agent`, `ai-automation-guide-small-business`) with the same `<em>` emphasis.

**FAQ JSON-LD — byte-identical, exceeding the "semantically equivalent" bar.** Extracted and parsed every `application/ld+json` block from all eight entry pages, before and after. For the six locale-pages that carry FAQ data (three posts × two locales) the emitted `FAQPage` objects match **including key order**: 8 questions for `ai-automation-guide-small-business`, 7 for `what-is-an-ai-agent`, 8 for `ai-vs-automation-vs-ai-agents`, same order, same `Question` / `acceptedAnswer` / `Answer` types, same `@context`. `why-most-ai-projects-fail` emits **zero** `FAQPage` blocks in both `en` and `zh`, before and after — the absent-`faq` path behaves as specified.

**Throwaway-post test — passed, and the throwaway is deleted.** Created `src/content/journal/zzz-throwaway-verification/` with an `index.en.md` and `index.zh.md` and nothing else. Static page count went 27 → 29 and `git status` over `src/` showed the identical set of modified source files as before the folder existed — no source file was edited to publish it. Both routes returned 200; titles, `<h1>` with the `<em>` emphasis span, the `hr` rule mapping, and the body prose all rendered; `rehype-slug` produced anchors in both languages including CJK (`h2#first-section`, `h3#a-nested-heading` / `h2#第一節`, `h3#次級標題`); the frontmatter `faq` emitted a valid `FAQPage`; and the post appeared on both journal indexes and in the sitemap. Folder deleted afterwards — `src/content/journal/zzz-throwaway-verification/` no longer exists and `git status` is clean of it. A clean build and lint were re-run after deletion, and the render diff above was captured from that final post-deletion build.

**Malformed-content failure paths — all four fail the build, naming slug and problem.** Each was produced by mutating the throwaway folder and running a real `pnpm build`; each exited 1:

- Missing locale file → `Journal content error — "zzz-throwaway-verification" has no index.zh.md. Every folder under src/content/journal/ needs both index.en.md and index.zh.md.`
- Missing required key → ``Journal content error — src/content/journal/zzz-throwaway-verification/index.en.md: frontmatter key `dateDisplay` is required and must be a non-empty string (got missing).``
- Unparseable YAML → `Journal content error — …/index.en.md: frontmatter is not valid YAML — unexpected end of the stream within a double quoted scalar at line 17…`
- FAQ entry missing an answer → ``Journal content error — …/index.en.md: faq entry 1 is missing a non-empty `answer` (got missing).``

The loader also emits a targeted hint when `js-yaml` turns an unquoted date into a `Date` — "wrap the value in quotes to keep it a string" — which is the mistake a content author is most likely to make.

**`@mdx-js/mdx` at `3.1.1`: confirmed used, confirmed necessary, left in place.** It is imported in `src/lib/journal/mdx.ts` for `evaluate`, which is what compiles a body from a string. Necessary because pnpm's isolated `node_modules` does not expose transitive packages to application code — the import fails without the direct declaration, so "already present via `@next/mdx`" is true of the store but not of the resolver. The `pnpm-lock.yaml` diff is **three lines** and adds only an importer entry: no new package resolved, nothing downloaded, the version already in the graph. The pre-approved alternative, `next-mdx-remote`, would have been a strictly larger addition that itself depends on `@mdx-js/mdx`. Judgment: keep. The one nit is cosmetic — it is pinned exactly at `3.1.1` while every sibling `@mdx-js/*` uses `^3.1.1`; left as written rather than changed, since an exact pin on the compiler is defensible and this is the operator's call at review.

**Two files were already dirty before the first dispatch and were not touched by either worker:** `.gitignore` (un-ignores `ops/`, with a comment explaining why) and the repo's `AGENTS.md`. Not attributed to this work, not reverted, not edited. The pre-existing `stash@{0}` was left alone; the baseline was reconstructed with worktrees specifically to avoid disturbing it. Both scratch worktrees have been removed.

**One incidental observation, not acted on:** `extractHeadings` in `src/lib/journal/mdx.ts` re-implements `rehype-slug`'s slugifier by hand to build the TOC, so TOC ids are derived independently of the ids `rehype-slug` actually emits. This predates the migration and the two agree on all current content, so it is behaviour-preserving and out of scope here — but it is a latent divergence worth a future PRD, since a heading with punctuation the two treat differently would produce a TOC link that scrolls nowhere.

## Handoff / Next Action

### 2026-08-11 — resume as verification, not re-implementation

Re-dispatch to `coder` with this instruction: **the migration is written; your job is to verify it, not to redo it.** Starting over would discard a substantial and apparently sound piece of work and risks a worse second attempt.

In order:

1. Read the current working tree first and form a view on whether the implementation is complete. If something is genuinely missing, finish that specific thing rather than rewriting what is there.
2. Run `pnpm build` and `pnpm lint`. Fix what breaks.
3. Run the before/after render diff the Acceptance Criteria require. **The "before" capture is gone** — the worker took it in a temp location that did not survive. Reconstruct it from git: the pre-migration files are all recoverable via `git stash` or by building from a clean checkout in a scratch worktree. Do not skip this criterion because the baseline is inconvenient to rebuild; it is the criterion that protects four bilingual articles from silent corruption.
4. Verify the FAQ JSON-LD equivalence for the three posts that have it, and that `why-most-ai-projects-fail` still emits none.
5. Run the throwaway-post test, then delete the throwaway.
6. Confirm the malformed-content-folder failure path produces a message naming the slug and the problem.

Everything in Out of Scope still binds. Do not commit or push.

### 2026-08-17 — verification complete, ready for human review

All ten acceptance criteria are met, each against captured command output. The work is **uncommitted in the working tree**, as the brief requires.

What the reviewer should decide:

1. **`@mdx-js/mdx` as a direct dependency**, in place of the pre-approved `next-mdx-remote`. It is used, it is necessary under pnpm's isolated `node_modules`, and it adds nothing to the lockfile but a three-line importer entry. Recommendation: accept. Secondary nit if you want consistency: it is pinned `3.1.1` where sibling `@mdx-js/*` packages use `^3.1.1`.
2. **Whether to commit as-is.** The tree also carries two files that were dirty before this PRD started — `.gitignore` and the repo's `AGENTS.md` — plus the untracked `src/content/blog/` drafts that `mkt-009` owns. Staging needs to be selective; do not `git add -A`.

No blockers. Nothing is waiting on a decision to proceed.

Follow-on worth queueing, not part of this PRD: `extractHeadings` hand-rolls `rehype-slug`'s slug algorithm for the table of contents instead of reading the ids `rehype-slug` emits. Harmless on today's content and pre-existing, but the two can diverge on punctuation and produce a TOC link that goes nowhere.

The content layout is now what [[web-004-sveltia-cms-install|web-004]] needs to install against: a page bundle per entry, `path: '{{slug}}/index'` with `multiple_files` i18n, one file per collection entry, and no sidecar the CMS cannot edit.

## Result
### Summary

Verified — not re-implemented — the journal content-format migration written by the first dispatch. Publishing a journal post is now a file drop: create a folder under `src/content/journal/` holding `index.en.md` and `index.zh.md`, and the entry route, both journal indexes, the homepage leaves and the sitemap pick it up on the next build, with no TypeScript edited anywhere.

Rendering is behaviour-preserving to the byte. A pre-migration baseline was rebuilt from `HEAD` in a scratch worktree and served alongside the migrated build; all 12 captured pages are byte-identical once three build-identity tokens are normalized, and the last of those three was proven to be a project-path hash rather than a behaviour change. FAQ JSON-LD is byte-identical including key order for the six locale-pages that carry it, and the one post without FAQ data still emits no block at all.

The hand-maintained `mdxContentMap` and `assertMdxRegistryComplete` are gone, replaced by a validating loader that fails the build naming the offending slug and the specific problem — verified against four distinct malformations, each with a real build.

I wrote no production code. The only files I created were a throwaway post used for the file-drop test, since deleted, and scratch verification scripts outside the repo.

### Files Modified

Uncommitted in the working tree at `/Users/sean/agentic-maison/unshared/website`.

Migrated content — each entry folder now holds `index.en.md` + `index.zh.md`, replacing the deleted `en.mdx`, `zh.mdx` and `faq-*.json`:

- `src/content/journal/why-most-ai-projects-fail/`
- `src/content/journal/ai-automation-guide-small-business/`
- `src/content/journal/what-is-an-ai-agent/`
- `src/content/journal/ai-vs-automation-vs-ai-agents/`

Source:

- `src/lib/journal/mdx.ts` — validating filesystem loader; `gray-matter` frontmatter parsing, `evaluate`-based body compilation with `rehype-slug`, `getFaqJsonLd` built from the `faq` list
- `src/lib/journal/prose-components.tsx` — new; the prose component map, passed explicitly to string-compiled bodies
- `src/mdx-components.tsx` — now a thin re-export of the above through `useMDXComponents`
- `src/lib/journal/entries.tsx` — unchanged merge and title-building behaviour, sourced from YAML
- `src/app/[locale]/journal/[slug]/page.tsx` — import registry and its assertion removed
- `src/content/journal/README.md` — authoring guide rewritten for the new layout
- `package.json`, `pnpm-lock.yaml` — `@mdx-js/mdx` promoted to a direct dependency

Deleted: the empty `assets/` folder under `why-most-ai-projects-fail`, all six `faq-*.json` sidecars, all eight `.mdx` bodies.

Untouched, as required: `.gitignore` and the repo's `AGENTS.md` (both dirty before this PRD began), and all of `src/content/blog/`.

### Discoveries

- **The `@next/mdx` component hook does not reach string-compiled bodies.** `useMDXComponents` is a file convention the loader consults; a body compiled through `evaluate` never passes through it. The component map therefore has to live somewhere importable and be handed to the compiled component as a `components` prop. This is why `prose-components.tsx` exists, and it is the one piece of the design that is not obvious from the brief.
- **pnpm's isolated `node_modules` makes "already present transitively" insufficient.** A transitive package is in the store but not resolvable from application code. Any future "it's already a dependency of X" reasoning in this repo needs a direct declaration to actually be importable.
- **Next.js server-action ids hash the absolute project path.** They are stable across rebuilds, across unrelated code edits, and across dependency changes — but not across directories. Anyone diffing this app's rendered HTML against a build made in a worktree or CI checkout at a different path will see that one token move, and it means nothing.
- **`next/font/google` makes builds network-dependent and intermittently flaky.** One build failed with 15 module-resolution errors after `fonts.gstatic.com` returned 404s for Cormorant Garamond woff2 files; the identical tree built clean on retry. Worth knowing before treating a red build here as a real failure.
- **A quoted `date` in frontmatter is load-bearing.** Unquoted, `js-yaml` returns a `Date` object and the required-string check rejects it. The loader emits a specific hint for this, and the README says so, because it is the failure a content author will hit first.
