---
id: web-005
title: Derive the table of contents from the ids actually emitted
status: done
project: website
plan: journal-publishing-pipeline
agent: coder
operator: sean
working_path: .
depends_on:
  - web-001
review_mode: human
created: 2026-08-17
updated: 2026-08-17
---

# PRD: web-005 Derive the table of contents from the ids actually emitted

## Objective

Make a journal post's table-of-contents links point at the heading ids the page actually renders, by deriving both from one pass over the content instead of two independent implementations that happen to agree.

## Context

### The defect

`extractHeadings` in `src/lib/journal/mdx.ts` builds the table of contents by regex-scanning the raw markdown for lines beginning `##` or `###`, then generating an id with a hand-written slugifier carrying the comment *"Generate slug matching rehype-slug behavior"*:

```ts
const id = text
  .toLowerCase()
  .replace(/[^\p{L}\p{N}\s-]/gu, "")
  .replace(/\s+/g, "-")
  .replace(/-+/g, "-")
  .replace(/^-|-$/g, "");
```

The ids on the page are produced by something else entirely: `rehype-slug`, running as a rehype plugin during compilation, which delegates to `github-slugger` and operates on the **rendered text of a heading node** rather than the raw markdown line.

Two implementations, two inputs, one comment asserting they match. They do agree on all four current posts, which is exactly why this is worth fixing now rather than after it breaks — a TOC link that scrolls nowhere is invisible in review and obvious to a reader.

### Where they diverge

Each of these is a class of content that is entirely reasonable to write and would produce a broken anchor. This list is the test matrix, not background reading.

- **Repeated headings.** `github-slugger` is stateful and de-duplicates: a second `## Examples` becomes `examples-1`. The hand-rolled version is stateless, so both headings get `examples` and both TOC links go to the first.
- **Links inside headings.** `## See [the docs](https://example.com)` — `rehype-slug` sees the rendered text `See the docs` and yields `see-the-docs`. The regex sees the raw line and yields `see-the-docshttpsexamplecom`.
- **Underscores.** `github-slugger` preserves `_`; the character class `[^\p{L}\p{N}\s-]` strips it. `## snake_case` diverges.
- **Fenced code blocks.** A line beginning `## ` inside a fence is not a heading, and `rehype-slug` correctly ignores it. The line-by-line regex does not know it is inside a fence and emits a phantom TOC entry pointing at nothing.
- **Setext headings** — a line underlined with `===` or `---` — are headings that the regex never matches at all, so they are silently missing from the TOC.
- **Inline emphasis and code.** `## The **hard** part` and ``## Using `next/og` `` may or may not coincide depending on the punctuation involved. "May or may not" is the problem.

The Traditional Chinese posts raise the stakes rather than lowering them: CJK punctuation is outside `\p{L}\p{N}`, so it is stripped by one implementation and handled by `github-slugger`'s rules in the other.

### Provenance

Found during `web-001`'s verification pass and deliberately left unfixed. It predates that work — `extractHeadings` is not new — and `web-001` was a behaviour-preserving migration whose whole discipline was to change nothing about rendering. Fixing it there would have meant a silent behaviour change inside a PRD that had a byte-identical render diff as an acceptance criterion. It is recorded in that PRD's Work Log.

## Acceptance Criteria

- [x] The table of contents and the emitted heading anchors are derived from a **single** pass, such that a TOC id cannot differ from the id on the heading it points at. No second slugifier remains in the codebase.
- [x] `grep -n "matching rehype-slug behavior" src/` returns nothing, and the hand-written slug expression in `extractHeadings` is gone rather than corrected in place.
- [x] Every divergence class listed in Context is covered by a test fixture, each asserting the TOC id equals the id on the rendered heading: repeated headings, a link inside a heading, an underscore, a `##` line inside a fenced code block, a setext heading, and inline emphasis and inline code.
- [x] One fixture uses Traditional Chinese headings including CJK punctuation.
- [x] The four existing posts render **byte-identically** in both locales, before and after. They currently agree across both implementations, so a correct fix changes nothing visible. Use the method `web-001` established: build `HEAD` in a detached worktree, serve both, and diff the fetched HTML. Normalising the build-identity tokens is expected; anything else is a finding, not noise.
- [x] `pnpm build` and `pnpm lint` both pass.

## Implementation Notes

**The fix is to collect headings during compilation, not to improve the slugifier.** Copying `github-slugger` into `extractHeadings` would close some of the gaps and leave the architecture — two implementations that must be kept in step by hand — exactly as it is. The next divergence would arrive the same way this one did.

A rehype plugin that runs **after** `rehype-slug` and collects `h2` and `h3` nodes, reading the id `rehype-slug` has already assigned and the node's text content, is the shape that makes divergence impossible. `src/lib/journal/mdx.ts` already composes the plugin array at the `evaluate` call, so this is an addition to a pipeline that exists rather than a new one. Return the headings alongside the compiled content; delete `extractHeadings` and update its callers.

**`github-slugger` is stateful, and that statefulness is the point.** Whatever you build must reuse the same slugger instance `rehype-slug` used for that document, not create a fresh one — a new instance restarts the de-duplication counter and reintroduces the repeated-heading bug in a new place.

**Builds here are network-dependent.** `next/font/google` fetches from `fonts.gstatic.com` at build time, and a build in this repo has already failed with a wall of errors purely because that 404'd; the identical tree built clean on retry. Do not spend an hour debugging a red build without retrying it first.

## Out of Scope

- **Changing any heading text, id, or the TOC's appearance.** This is a correctness fix. If the current ids on current content are ugly, they stay ugly — changing a published heading id breaks every inbound deep link.
- **The `web-004` Sveltia install**, and anything about `config.yml` or the admin mount.
- **Open Graph images** — `web-002`.
- **Refactoring `src/lib/journal/mdx.ts` beyond what this fix requires.** It was substantially rewritten by `web-001` and reviewed; leave the rest of it alone.
- **Committing or pushing.** Leave the work in the working tree for review.

## Work Log

**2026-08-17 — `rehype-slug` does not expose its slugger, and it turns out not to need to.**

The Implementation Notes ask for the same `github-slugger` instance `rehype-slug` used. It cannot be had: `rehype-slug@6.0.0` holds a **module-level** `const slugs = new GithubSlugger()` and calls `slugs.reset()` at the top of each transform. Nothing about the instance is exported or passed out.

That turned out to make the fix simpler rather than harder. The collector plugin runs **after** `rehype-slug` in the same `rehypePlugins` array and reads `node.properties.id` off each `h2`/`h3` — the id `rehype-slug` has already assigned. It never calls a slugger, so the question of which instance to reuse does not arise, and `github-slugger` is not added as a dependency. There is exactly one slugger in the pipeline and the table of contents is downstream of it. De-duplication is preserved for free, because the counter that produced `examples-1` produced the id the TOC now reads.

Ordering is safe: `rehype-slug`'s visit is synchronous, so it runs to completion on one tree before the collector sees it, and the module-level instance cannot interleave across concurrently compiled documents.

**Verified the fixtures actually bite before writing the tests.** Ran each fixture through both the new pipeline and the deleted regex slugifier side by side. Six of the seven diverge:

| fixture | new (page) | old (TOC) |
|---|---|---|
| repeated headings | `examples`, `examples-1` | `examples`, `examples` |
| link in heading | `see-the-docs` | `see-the-docshttpsexamplecom` |
| underscore | `snake_case-matters` | `snakecase-matters` |
| `##` inside a fence | `real-heading` | `real-heading`, `this-is-a-shell-comment-not-a-heading` |
| setext `---` | `setext-level-two` | *(nothing — never matched)* |
| CJK repeated | `為什麼ai-專案會失敗`, `…-1` | `為什麼ai-專案會失敗`, `為什麼ai-專案會失敗` |
| `## The **hard** part` | `the-hard-part` | `the-hard-part` — **agrees** |

The last row is the PRD's "may or may not coincide", and my first draft of the emphasis fixture was the half that coincides — a test that would have passed against the bug. Replaced it with `### Set \`x = 1\` before **launch**`, where the removed `=` leaves `set-x--1-before-launch` on the page against `set-x-1-before-launch` from the regex (`github-slugger` replaces each space individually; the regex collapsed runs). Kept the coinciding heading alongside it so the fixture records both halves of "may or may not".

**No test runner existed.** Added `"test": "node --test \"src/**/*.test.ts\""` — Node 22.21's built-in runner with native TypeScript stripping, no new dependency. The assertion is deliberately end-to-end and algorithm-free: compile the fixture, render it with `react-dom/server`, scrape the `h2`/`h3` ids out of the HTML, and require the TOC to equal that list. If `github-slugger` changes its rules the tests keep passing, which is the property worth locking.

**Minor calls made, in order of how much they will annoy a reviewer:**

1. **`allowImportingTsExtensions: true` in `tsconfig.json`.** Node's type stripping runs the test as ESM, which needs the literal `./mdx.ts` on the import; TypeScript rejects that extension without this flag (`error TS5097`). `./mdx.js` satisfies TypeScript and fails at runtime — tried it, `ERR_MODULE_NOT_FOUND`. The flag only widens what is permitted, requires `noEmit` (already set), and no application import uses an extension. The alternative was dropping test files out of `tsconfig.include`, which buys tidiness by giving up type-checking them.
2. **`getEntryBody` is now unused but kept.** The fix orphaned it — `page.tsx` was its only caller. It is a documented general-purpose accessor and Out of Scope says not to refactor `mdx.ts` beyond what the fix requires, so it stays. Deleting it is a one-line follow-up if the operator prefers.
3. **`JournalToc`'s local `TocItem` was left alone** rather than re-pointed at the new exported `JournalHeading`. It is a client component; even a type-only import from `mdx.ts` invites someone to make it a value import later and drag `fs` toward the client bundle. Structurally identical, so nothing is lost.

**Render diff — 12 pages, all identical.** Built `HEAD` (`34297ef`) in a detached worktree, served it on `:3101` against the current tree on `:3102`, fetched both and diffed. The symlinked-`node_modules` shortcut does not work here — Turbopack rejects it with *"Symlink [project]/node_modules is invalid, it points out of the filesystem root"* — so the worktree needs a real `pnpm install --frozen-lockfile` (3.8s from the store).

The eight journal posts and both journal index pages are byte-identical after normalising the Next build id alone. `/en` and `/zh` needed two further normalisations, both traceable to one cause: the contact form's server-action id (`6034eedd…` vs `60bf0362…`), which hashes the absolute project path and so differs between the worktree and the main checkout — the known false positive — and the content-addressed client chunk filename that carries it (`0h8qssb2h.szk.js` vs `0p3brlqnu2m2w.js`), which changes precisely because its contents embed that id. With those two normalised, both homepages are identical too. Nothing else differed anywhere.

**Not mine, seen in the tree.** `ops/plans/journal-publishing-pipeline.md` gained a `web-006` row and `ops/prds/web-006-openGraph-segment-merge.md` appeared during this run — concurrent authoring, left untouched.

## Handoff / Next Action

Ready for review. Nothing is committed and nothing is staged, per Out of Scope.

**What to look at, in order:**

1. `src/lib/journal/mdx.ts` — `createHeadingCollector` and `compileJournalMarkdown` in. `extractHeadings` out.
2. `src/lib/journal/mdx.test.ts` — the seven divergence fixtures plus a level check.
3. `tsconfig.json` and `package.json` — the two config lines, both explained in the Work Log's minor calls. These are the changes most likely to draw an objection, and both have a stated alternative.

**Three decisions left open deliberately**, none blocking: delete the now-unused `getEntryBody` or keep it; accept `allowImportingTsExtensions` or take the trade of excluding tests from type-checking; point `JournalToc` at the exported `JournalHeading` type or leave its local copy.

To re-verify: `pnpm test` (8 tests), `pnpm lint` (9 warnings, 0 errors — the pre-existing baseline), `pnpm build`. Retry a red build once before debugging it; `next/font/google` fetches at build time and has 404'd here before.

## Result
### Summary

A journal post's table of contents is now read off the page it describes instead of being recomputed from the raw markdown. A rehype plugin runs immediately after `rehype-slug` in the same pipeline, walks the compiled tree for `h2`/`h3`, and records the id `rehype-slug` has already assigned together with the node's text content. `compileJournalBody` returns `{ Content, headings }`; the entry page destructures both from one call. The hand-written slugifier and its *"Generate slug matching rehype-slug behavior"* comment are deleted, and no replacement slugger was introduced — the fix removes the second implementation rather than improving it.

Seven fixtures cover the divergence classes from Context, each asserting the TOC equals the `h2`/`h3` ids scraped from the rendered HTML. Six of the seven were confirmed to produce different ids under the old code before the tests were written.

Verified: `pnpm test` 8/8 pass; `pnpm lint` 9 warnings, 0 errors (unchanged baseline); `pnpm build` compiles and type-checks clean; 12 pages byte-identical against `HEAD` after normalising build-identity tokens only.

### Files Modified

- `src/lib/journal/mdx.ts` — `extractHeadings` deleted; `createHeadingCollector`, `nodeText`, `compileJournalMarkdown`, and the `JournalHeading` / `CompiledJournalBody` types added; `compileJournalBody` now returns content and headings together.
- `src/app/[locale]/journal/[slug]/page.tsx` — one destructured call replaces the compile-then-re-parse pair.
- `src/lib/journal/mdx.test.ts` — new. Seven divergence fixtures plus a heading-level check.
- `package.json` — `test` script.
- `tsconfig.json` — `allowImportingTsExtensions`.

### Discoveries

- **`rehype-slug@6.0.0` keeps its `GithubSlugger` at module scope** and resets it per transform. It is unreachable from outside, which rules out the "reuse the instance" shape — and makes it unnecessary, because reading the assigned id is strictly better than re-deriving it.
- **`github-slugger` never became a dependency.** The pnpm transitive-resolution trap the brief warned about was avoided entirely by not needing the package. Same for `@types/hast`, `unist-util-visit` and `hast-util-to-string`: the tree walk is a dozen lines against a locally declared node shape.
- **Turbopack refuses a symlinked `node_modules`** — *"points out of the filesystem root"*. A comparison worktree needs its own `pnpm install`, which is fast from the store. Worth knowing before the next byte-identical render diff.
- **The contact form's server-action id has a second-order effect on the diff.** It moves the client chunk's content hash too, so a worktree comparison shows *two* unrelated-looking differences on any page carrying the form, not one. Both normalise away; neither indicates a change.
- **Node 22's built-in runner plus native TS stripping is a working test setup for this repo** with no dependency added, at the cost of one `tsconfig` flag.
