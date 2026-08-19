---
id: web-009
title: Simplify the journal content model to the fields an editor should own
status: queue
project: website
plan: journal-publishing-pipeline
agent: coder
operator: sean
working_path: .
depends_on: [web-004, web-008]
review_mode: human
created: 2026-08-18
updated: 2026-08-18
---

# PRD: web-009 Simplify the journal content model to the fields an editor should own

## Objective

Cut the journal's frontmatter to what a person genuinely has to decide, by deriving what can be derived and deleting what nobody should have to maintain. Six changes, listed below, across the content files, the loader, the renderers and the CMS schema.

## Context

### Why

Reviewing the CMS form built by `web-004` showed the content model asking an editor for things she has no basis to decide. An issue number that must be unique and correctly formatted. A written-out date that must agree with the machine-readable one beside it. Two separate emphasis fields that turn out to hold identical values on all four existing posts. And two descriptions — one shown on the index card, one for search results — where one good sentence does both jobs.

Every field is a field the editor sees, and each one is a chance to get something wrong that nobody will notice.

### The six changes

**1. `num` — remove from frontmatter, derive from date order.** Ascending, oldest first. This reproduces every existing value exactly: `why-most-ai-projects-fail` (2026-05-05) is No. 001, `ai-automation-guide-small-business` (05-19) is No. 002, `what-is-an-ai-agent` (05-20) is No. 003, `ai-vs-automation-vs-ai-agents` (05-23) is No. 004. Nothing visible changes. Note the trade the owner accepted: publishing a backdated post renumbers everything after it.

**2. `dateDisplay` — remove, derive from `date` per locale.** English renders `5 May 2026` — day without a leading zero, full month name, year. Traditional Chinese renders `2026年5月5日`. Both match every current value exactly; check all eight files rather than trusting this sentence.

**3 and 4. `leafEmphasis` and `titleEmphasis` — remove entirely, and remove the styling they drive.** Leaf titles on the journal index and homepage, and each entry's `<h1>`, render as plain text with no `<em>` span. This *is* a visible change to published pages and it is intended. The two fields hold identical values on all four posts, which is its own argument that the distinction was never real.

**5. `dek` and `metaDescription` — merge into one field, `description`.** Labelled "Article description" in the CMS, capped at 160 characters. **For the four existing posts, keep the `metaDescription` value and discard the `dek`.** The index cards will therefore change what they say.

This also removes a wart rather than papering over it: `metaDescription` is currently English-only, and the Chinese meta description falls back to `dek.zh` at what is now `page.tsx`'s locale branch. After the merge there is one description per locale and no fallback.

**6. `slug` — relabel in the CMS from "Web address" to "URL Slug".** Label only; the frontmatter key does not change.

### What this collides with

`web-008` makes Traditional Chinese optional per entry with English as the fallback, and it edits the same `config.yml`, the same loader and the same four posts. Running the two concurrently would produce a merge conflict at best and two mutually invalidated render baselines at worst — which is why this PRD depends on `web-008` as well as `web-004`.

**So `web-008` will already have landed when you start.** Some posts may have no `index.zh.md`. Your migration must handle an entry whose Chinese locale is absent without treating it as malformed, and the derived Chinese date format applies only where a Chinese file exists.

## Acceptance Criteria

- [ ] `num`, `dateDisplay`, `leafEmphasis` and `titleEmphasis` appear in no content file, no loader type, no renderer and no CMS field definition. Grep for each by name and show it clean.
- [ ] Issue numbers on the landing-page leaves are derived from date order ascending and read exactly `No. 001` through `No. 004` on the current four posts, matching what they show today.
- [ ] Displayed dates are derived from `date` and render exactly as they do today in both locales, for every post that has that locale.
- [ ] Leaf titles and entry `<h1>`s contain no `<em>` element sourced from the removed fields.
- [ ] Each locale file carries one `description` key. The four existing posts carry the value that was in `metaDescription`, and no `dek` or `metaDescription` key survives anywhere.
- [ ] The CMS shows `description` labelled "Article description" with a 160-character limit that is **enforced on save**, not merely hinted, and `slug` labelled "URL Slug".
- [ ] A post created through the CMS with the reduced field set renders correctly at both locale routes, with a derived issue number and a derived date.
- [ ] A **rendered before/after diff** of every journal page in both locales, with every difference enumerated and matched to one of the six changes above. Unlike the previous PRDs in this initiative, an empty diff is a failure here — it would mean the removals did not take. Any difference you cannot attribute to a change on this list is a finding; stop and record it.
- [ ] The FAQ JSON-LD, the OG cards and the table of contents are unaffected — same content, same URLs, same ids.
- [ ] `pnpm build`, `pnpm lint` and `pnpm test` all pass, at or below their current baselines.

## Implementation Notes

**Derivation belongs in the loader**, beside the existing entry assembly in `src/lib/journal/mdx.ts` and `src/lib/journal/entries.tsx`, so that every consumer — entry pages, the index, the homepage leaves, the sitemap — gets the same derived values from one place. Do not compute a date format or an issue number in a component.

**Derive the issue number from the sorted set, not from a per-entry calculation.** The loader already sorts by date; number ascending across that sorted list. A per-entry derivation cannot know its own position and will drift.

**Locale-aware dates without a dependency if you can.** `Intl.DateTimeFormat` produces both forms; confirm the exact output against all eight current values before trusting it, because a locale's default ordering and separators are not always what you expect. If it cannot reproduce them exactly, hand-format rather than accepting a near-match — these are published pages.

**The 160-character cap must be enforced.** Check whether Sveltia's string or text widget supports a maximum that blocks saving rather than warning. If it does not, say so in the Work Log and use whatever it does support, plus a hint stating the limit.

**Field order in `config.yml` is the frontmatter key order of every saved post.** Removing four fields and merging two therefore changes that order, and the next save of any post would rewrite its frontmatter. Since you are migrating all of them anyway, write them in the new canonical order — the order your `config.yml` defines — so the first CMS save after this lands produces no spurious diff.

**Update `docs/cms-editor-guide.md`** to match the reduced field set. It documents fields that will no longer exist.

**`src/content/journal/README.md` documents the frontmatter contract** and will be wrong in several places once you are done. Correct it. It also currently states that a post's images live beside its Markdown, which was never true in practice — they live in `public/assets/journal/<slug>/`, because `src/content/` is not served.

**Builds are network-dependent** — `next/font/google` fetches from `fonts.gstatic.com` and a build here has failed on a 404 from it. Retry a red build before debugging it. And `pnpm`'s isolated `node_modules` does not expose transitive packages to application code.

## Out of Scope

- **Rewriting any description.** Take the existing `metaDescription` value as-is, even where it exceeds 160 characters — record any that do in the Work Log so the owner can have them rewritten, but do not edit copy yourself.
- **Changing the journal's visual design** beyond removing the `<em>` spans the deleted fields fed. No restyling, no layout changes, no typography.
- **The `backend.base_url` placeholder** and anything else `web-007` owns.
- **Making Chinese optional** — `web-008` owns that and will already have landed.
- **`src/content/blog/`** — fifteen unrelated drafts owned by another PRD. Do not touch them.
- **Committing or pushing.** Leave the work in the working tree for review.

## Work Log

## Handoff / Next Action

## Result
### Summary

### Files Modified

### Discoveries
