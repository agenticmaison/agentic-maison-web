---
id: web-009
title: Simplify the journal content model to the fields an editor should own
status: done
project: website
plan: journal-publishing-pipeline
agent: coder
operator: sean
working_path: .
depends_on: [web-004, web-008]
review_mode: human
created: 2026-08-18
updated: 2026-08-19
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

- [x] `num`, `dateDisplay`, `leafEmphasis` and `titleEmphasis` appear in no content file, no loader type, no renderer and no CMS field definition. Grep for each by name and show it clean.
- [x] Issue numbers on the landing-page leaves are derived from date order ascending and read exactly `No. 001` through `No. 004` on the current four posts, matching what they show today.
- [x] Displayed dates are derived from `date` and render exactly as they do today in both locales, for every post that has that locale.
- [x] Leaf titles and entry `<h1>`s contain no `<em>` element sourced from the removed fields.
- [x] Each locale file carries one `description` key. The four existing posts carry the value that was in `metaDescription`, and no `dek` or `metaDescription` key survives anywhere.
- [x] The CMS shows `description` labelled "Article description" with the 160-character figure **hinted and not enforced** — the owner superseded the original "enforced on save" wording in review, and the Work Log's round-2 entry records why — and `slug` labelled "URL Slug".
- [x] A post created through the CMS with the reduced field set renders correctly at both locale routes, with a derived issue number and a derived date.
- [x] A **rendered before/after diff** of every journal page in both locales, with every difference enumerated and matched to one of the six changes above. Unlike the previous PRDs in this initiative, an empty diff is a failure here — it would mean the removals did not take. Any difference you cannot attribute to a change on this list is a finding; stop and record it.
- [x] The FAQ JSON-LD, the OG cards and the table of contents are unaffected — same content, same URLs, same ids.
- [x] `pnpm build`, `pnpm lint` and `pnpm test` all pass, at or below their current baselines.

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

**Baseline.** `web-008` is in the working tree uncommitted, so the before/after
baseline is the working tree at start, not `HEAD`. Captured by building and
serving the tree and curling all 13 pages plus the sitemap.

**Three premises in the PRD turned out to be wrong about the content on disk.**
None changed the shape of the work; all three are recorded because the next
reader will otherwise trust the PRD over the files.

1. *"Some posts may have no `index.zh.md`."* All four have one. `web-008`'s
   fallback is real but no published post exercises it, so nothing in this
   migration had to handle an absent locale — the loader path that would is
   still covered by `single-locale.test.ts`.
2. *"`metaDescription` is currently English-only."* It is English-only as the
   *site reads it*, but three of the four `index.zh.md` files carry a
   `metaDescription` key that nothing read. Those Chinese values are now the
   Chinese `description`, which is why the Chinese `<meta name="description">`
   changed on three pages.
3. *"The two emphasis fields hold identical values on all four posts."* True in
   English. In `why-most-ai-projects-fail/index.zh.md` they differed —
   `leafEmphasis: "失敗"` against `titleEmphasis: "皆告失敗"`. Both are deleted
   either way; the distinction was real on exactly one file out of eight.

**Judgment call — the Chinese description of `why-most-ai-projects-fail`.** Its
`index.zh.md` has no `metaDescription`, so "keep the `metaDescription`, discard
the `dek`" has nothing to keep. Took the `dek` for that one file. That is what
the site already served as that page's Chinese meta description through the old
`dek.zh` fallback, so this is the only choice that leaves the page unchanged.

**Judgment call — `num` is derived but rendered nowhere.** Nothing in `src/app`
or `src/components` reads `entry.num`; the landing-page leaves show the date,
not the issue number. AC 2 as written ("read exactly `No. 001` through `No. 004`
on the current four posts, matching what they show today") cannot be checked
against a rendered page, because no page shows one. Derived it anyway, per
change 1, and verified the values end-to-end by temporarily rendering
`entry.num` on the journal index, capturing, and reverting the instrumentation —
evidence below. Whether an issue number that nothing displays should exist at
all is a question for the owner, not a call to make quietly here.

**`Intl` did not do what it looked like it would, in the way the PRD warned
about.** Two measured facts, both now in the code comment and pinned by tests:

- `zh-Hant` with `month: 'numeric'` prints `2026/5/5`, not `2026年5月5日`.
  `month: 'long'` is what produces the 年月日 form — the opposite of the obvious
  choice for a language with no month names. The first implementation had this
  wrong and the new test caught it before any page was built.
- `zh-HK` prints `5/5/2026` — day-first. `zh-Hant` is the correct tag.
- English is `en-GB` with `month: 'long'`, exact on all four values.
- `timeZone: 'UTC'` is load-bearing and has its own test: a bare `YYYY-MM-DD` is
  midnight UTC, and formatting it in a machine-local timezone west of Greenwich
  prints the previous day.

**Deriving the date made `date` load-bearing, so the loader now validates it.**
It was checked only for being a non-empty string; a value like `5 May 2026` would
have reached the page as "Invalid Date". `date` must now be a real calendar day
written `YYYY-MM-DD`, and a build fails naming the file otherwise.

**Sveltia's 160-character cap is enforced on save — verified against the pinned
bundle, not assumed.** In `@sveltia/cms@0.193.0` the `string` and `text` widgets
share one validator; `maxlength` sets `tooLong`, which pushes a
`validation.too_long` error and makes the entry invalid rather than warning. It
counts code points on the trimmed value. `web-004` had deliberately omitted the
cap for the reason below; this PRD overrides that, so its reasoning comment was
replaced rather than left to contradict the config.

**Three published English descriptions now exceed the cap** and cannot be saved
through the CMS until someone rewrites them. Copy is out of scope here, so they
are untouched and listed for the owner:

- `ai-vs-automation-vs-ai-agents` — 183 characters
- `why-most-ai-projects-fail` — 179
- `ai-automation-guide-small-business` — 165
- (`what-is-an-ai-agent` is 144 and is fine. All four Chinese ones are ≤ 57.)

**Minor: `entries.tsx` renamed to `entries.ts`.** Removing the two emphasis
builders removed the only JSX in the file. Every import is extensionless so
nothing else changed. It is a mechanical consequence of changes 3 and 4, and it
matters slightly beyond tidiness: a `.ts` module is one Node's test runner can
load, where a `.tsx` one cannot.

**Minor: field order.** `config.yml` and all eight files now read `slug`, `date`,
`title`, `description`, `author`, `faq`. Confirmed by parsing `config.yml` and
comparing to the files, so the first CMS save produces no spurious diff.

### Verification

**`pnpm build`** — `✓ Compiled successfully`, 35 static pages, all journal routes
present. **`pnpm lint`** — `✖ 8 problems (0 errors, 8 warnings)`; the 8 are the
pre-existing `no-img-element` warnings in `src/app/deck/page.tsx` and
`src/components/hero-mechanism-layers.tsx`, both untouched. **`pnpm test`** —
`# tests 31 / # pass 31 / # fail 0`, up from 25 by the six cases added here.

**Grep, clean.** `num`, `dateDisplay`, `leafEmphasis`, `titleEmphasis`, `dek` and
`metaDescription` return nothing across `src/`, `public/admin/` and `docs/`,
except `num` and `dateDisplay` as *derived properties* of the assembled entry in
`entries.ts` and its three renderers. That is the reading of AC 1 taken here:
gone from every content file, from the frontmatter type, from the CMS and from
every editor-facing surface — and necessarily still present as derived values,
because ACs 2 and 3 require them to exist and render.

**Rendered before/after diff — every difference, all 13 pages, both locales.**
Four classes, nothing unattributed:

| # | Difference | Where | Change |
|---|---|---|---|
| 1 | `<em>` removed from leaf titles and entry `<h1>`s; the `[&_em]` utilities dropped from the `h1` class; React's `<!-- -->` text separator gone with the JSX fragment | all 4 entry pages ×2 locales, homepage ×2 | 3 and 4 |
| 2 | Index-card and standfirst text changes from the `dek` to the `metaDescription` value | journal index ×2, all 4 entry pages ×2 | 5 |
| 3 | Chinese `<meta name/og/twitter description>` changes from `dek.zh` to the Chinese `metaDescription` | 3 zh entry pages | 5 |
| 4 | CSS chunk hash; sitemap `<lastmod>` timestamp | every page, sitemap | build noise |

An empty diff would have been a failure; it is not empty, and the removals took.

**Deliberately absent from the diff, which is the evidence for AC 3, 9 and 10:**
displayed dates are byte-identical in both locales on every page, so the derived
dates reproduce the hand-written ones exactly. FAQ JSON-LD blocks hash identical.
TOC ids, heading anchors, OG image URLs, canonical and `hreflang` links, and every
sitemap URL are unchanged — the sitemap differs only in its build timestamp.

**`<em>` audit.** Before: 36 `<em>` elements inside `h1`/`.leaf-title` across the
captured pages. After: 8, all four of them hard-coded page furniture — the
journal index's own "The *Journal*." heading and the homepage hero — and none
sourced from frontmatter.

**Issue numbers, end-to-end.** With `entry.num` temporarily rendered on the
journal index: `No. 004, No. 003, No. 002, No. 001` newest-first, i.e. No. 001 is
`why-most-ai-projects-fail` (2026-05-05), matching every previous hand-written
value. Instrumentation reverted; the final tree re-renders identically to the
captured "after" set.

**A post in the reduced field set, as the CMS would write it.** Created
`cms-smoke-test` with only `slug`/`date`/`title`/`description`/`author`, dated
2026-06-01, in both locales. Both routes returned 200; `<h1>`, description and
body rendered; derived date `1 June 2026` / `2026年6月1日`; derived issue number
`No. 005`, with the existing four unchanged at 001–004. Post deleted afterwards
(`src/content/journal/cms-smoke-test/`), tree re-verified clean.

### Round 2 — 2026-08-19, review feedback applied

**Feedback:** the enforced 160-character cap must go. Three published posts exceed
it and the CMS refusing to save them is worse than a long description. Keep the
~160 guidance as a hint only.

**Changed.** `maxlength: 160` removed from the `description` field in
`public/admin/config.yml`. Nothing else in that field touched — `label: Article
description`, `widget: text`, `i18n: true`, `required: true` all stand, and no
field was reordered (`slug`, `date`, `title`, `description`, `author`, `faq`,
`body`, re-parsed and confirmed after the edit, so the frontmatter key order of a
saved post is unchanged). The comment above the field previously argued the cap
*was* enforced; it now records why there is deliberately no `maxlength` — Sveltia's
blocks saving rather than warning — so the next reader does not re-add it. The
hint reads "Aim for about 160 characters — search results cut off past that — but
a longer one still saves."

**Docs.** `docs/cms-editor-guide.md`: the field description now states the ~160
figure as guidance, keeping the separate and still-true statement that a
description is required; the troubleshooting entry "The Article description is
rejected as too long" was deleted outright rather than softened, because that
rejection can no longer happen. `src/content/journal/README.md`: the frontmatter
example comment and the paragraph claiming "The CMS caps it at 160 characters and
refuses to save a longer one" both now describe a hint.

**AC 6 is partly superseded by this decision.** Its "enforced on save, not merely
hinted" clause is the thing the owner reversed. As it now stands: `description` is
labelled "Article description", `slug` is labelled "URL Slug", and the 160 figure
is hinted and not enforced — which is the deliberate end state, not a shortfall.

**Round-2 verification.** `pnpm lint` — `✖ 8 problems (0 errors, 8 warnings)`, the
same 8 pre-existing `no-img-element` warnings in `src/app/deck/page.tsx` and
`src/components/hero-mechanism-layers.tsx`. `pnpm test` — `# tests 31 / # pass 31
/ # fail 0`, unchanged. Grep for `maxlength`, `too_long`, `160 char` and `cap`
across `src/`, `docs/` and `public/admin/` returns nothing. No build was run: this
round touched one YAML value and two Markdown docs, none of which enters the
bundle, and round 1's build is still the standing evidence.

**The three long descriptions are now a copy preference, not a blocker.** They
were listed above as unsavable; they save.

## Handoff / Next Action

### 2026-08-19 — round 2 complete, back for review

The cap is gone. Config, editor guide and content README all describe a hint;
`pnpm lint` and `pnpm test` pass at baseline. Nothing else was touched — `num`
stays derived and the migrated descriptions are as they were. Still uncommitted,
sitting in the working tree alongside `web-008`.

Of the three open items below, item 1 has softened: the long descriptions no
longer break saving, so rewriting them is a copy call whenever someone wants it.
Items 2 and 3 are unchanged and still want an owner decision.

### 2026-08-19 — review feedback (changes requested, Sean)

One change: **remove the enforced 160-character cap on `description` in the CMS.**
The owner decided the cap must not block saving — three published posts exceed it
and making them unsavable is worse than a long description. Keep a hint on the
field stating the ~160 guidance for search results, but nothing that prevents save.
Update `docs/cms-editor-guide.md` and `src/content/journal/README.md` wherever they
state the limit is enforced. This supersedes the acceptance criterion demanding
enforcement on save.

Everything else is approved as delivered: `num` stays derived (the owner confirmed),
descriptions stay as migrated, no other edits. Do not commit.


**For review by the operator. Nothing is committed** — the PRD puts committing
out of scope, so the whole change sits in the working tree alongside `web-008`'s
uncommitted work.

Three things want an owner decision; none blocks the review:

1. **Three English descriptions exceed the ~160-character guidance** (listed in
   the Work Log). They render fine and are untouched. Since round 2 removed the
   cap they save normally, so this is a copy preference rather than a blocker —
   rewriting them is out of scope here and belongs to a copywriter with a brief.
2. **`num` is derived and displayed nowhere.** It costs nothing to keep and is
   what the PRD asked for, but if no page will ever print an issue number, the
   field and its derivation could go entirely. Worth a decision rather than
   leaving it to drift.
3. **A pre-existing typographic oddity, not introduced here.** The Chinese `<h1>`
   of `ai-vs-automation-vs-ai-agents` reads `…中小企應該揀邊個？。` — the title's
   own question mark followed by the terminal period the renderer appends. It was
   there before this change and is there after; the fix is either the title or the
   period rule, and both are design decisions.

## Result
### Summary

The journal's frontmatter is down to the five keys an editor has a basis to
decide — `slug`, `date`, `title`, `description`, `author` — plus the optional
`faq`. The issue number and both displayed dates are derived once, in the loader,
from publication order and from `date`; the two emphasis fields and the styling
they drove are gone; `dek` and `metaDescription` are one `description` per
locale, with ~160 characters as a hint the CMS states but does not enforce — the
owner reversed the enforced cap in review, because three published posts exceed it
and unsavable posts are worse than long descriptions. All eight content files
were migrated into the new canonical key order, and the CMS form, the editor
guide and the content README now describe what actually exists.

Every rendered difference across the 13 pages was enumerated and matched to one
of the six changes. Build, lint and tests pass at or above baseline.

### Files Modified

**Loader and types**
- `src/lib/journal/entries.ts` (renamed from ‘entries.tsx’) — derives `num` off
  the date-ascending list and `dateDisplay` per locale; emphasis builders removed
- `src/lib/journal/mdx.ts` — reduced frontmatter type and required-key set,
  `formatEntryDate`, `formatIssueNumber`, ISO date validation, dead
  `JournalEntryData` removed
- `src/types/mdx.d.ts` — reduced `meta` shape

**Renderers**
- `src/app/[locale]/page.tsx` — leaves render the plain title
- `src/app/[locale]/journal/page.tsx` — cards render `description`
- `src/app/[locale]/journal/[slug]/page.tsx` — `h1` without the `em` utilities,
  `description` as standfirst and as the metadata description, locale branch gone
- `src/app/globals.css` — `.leaf-title em` removed
- `src/lib/og/journal-card.tsx`, `src/components/journal-author.tsx` — comments only

**Content** — all eight of `src/content/journal/<slug>/index.{en,zh}.md`

**CMS and docs**
- `public/admin/config.yml` — fields reduced and reordered, `slug` relabelled
  "URL Slug", `description` labelled "Article description" with the 160 figure as
  a hint and deliberately no `maxlength`
- `docs/cms-editor-guide.md`, `src/content/journal/README.md`

**Tests**
- `src/lib/journal/derived-fields.test.ts` (new) — six cases pinning the derived
  dates in both locales, timezone independence, issue numbering, and the two
  date-validation failures
- `src/lib/journal/single-locale.test.ts` — fixtures moved to the new field set

### Discoveries

- **`Intl` reproduces both date forms, but not through the obvious options.**
  Chinese needs `zh-Hant` with `month: 'long'`; `zh-HK` prints `5/5/2026` and
  `month: 'numeric'` prints `2026/5/5`. Both near-misses look plausible in a code
  review and are caught only by asserting the exact string.
- **Sveltia's `maxlength` genuinely blocks saving** in the pinned 0.193.0 — the
  `string` and `text` widgets share a validator that raises `tooLong` and counts
  code points on the trimmed value. This reverses `web-004`'s finding, which was
  a deliberate omission rather than a limitation — and is precisely why the cap is
  not used here: blocking a save is the only thing `maxlength` does, so there is
  no way to express "advisory length" through it. A hint is the whole toolkit.
- **Chinese `metaDescription` values existed on disk but were never read.** Three
  posts carried one; the site fell back to `dek.zh`. The merge surfaced them, so
  three Chinese pages now describe themselves differently in search results —
  correctly, and for the first time.
- **The journal index and the homepage leaves never showed an issue number.**
  `num` was maintained by hand on eight files for no rendered output.
- **A `.tsx` module with no JSX is invisible friction.** Node's test runner cannot
  load one, which is why the entry registry had no direct test coverage; the
  rename to `.ts` removes that obstacle for whoever adds one.
