---
id: web-005
title: Derive the table of contents from the ids actually emitted
status: queue
project: website
plan: journal-publishing-pipeline
agent: coder
operator: sean
working_path: .
depends_on: [web-001]
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

- [ ] The table of contents and the emitted heading anchors are derived from a **single** pass, such that a TOC id cannot differ from the id on the heading it points at. No second slugifier remains in the codebase.
- [ ] `grep -n "matching rehype-slug behavior" src/` returns nothing, and the hand-written slug expression in `extractHeadings` is gone rather than corrected in place.
- [ ] Every divergence class listed in Context is covered by a test fixture, each asserting the TOC id equals the id on the rendered heading: repeated headings, a link inside a heading, an underscore, a `##` line inside a fenced code block, a setext heading, and inline emphasis and inline code.
- [ ] One fixture uses Traditional Chinese headings including CJK punctuation.
- [ ] The four existing posts render **byte-identically** in both locales, before and after. They currently agree across both implementations, so a correct fix changes nothing visible. Use the method `web-001` established: build `HEAD` in a detached worktree, serve both, and diff the fetched HTML. Normalising the build-identity tokens is expected; anything else is a finding, not noise.
- [ ] `pnpm build` and `pnpm lint` both pass.

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

## Handoff / Next Action

## Result
### Summary

### Files Modified

### Discoveries
