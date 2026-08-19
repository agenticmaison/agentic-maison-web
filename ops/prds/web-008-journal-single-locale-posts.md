---
id: web-008
title: Make Traditional Chinese optional per journal entry, English as fallback
status: done
project: website
plan: journal-publishing-pipeline
agent: coder
operator: sean
working_path: .
depends_on: [web-004]
review_mode: human
created: 2026-08-18
updated: 2026-08-19
---

# PRD: web-008 Make Traditional Chinese optional per journal entry, English as fallback

## Objective

Let a journal entry publish with `index.en.md` alone. A folder missing `index.zh.md` is a legal, complete entry: the `zh` locale serves the English content as its fallback rather than 404ing or failing the build, and nothing an editor sees demands a zh file exist.

## Context

The Q3 content pipeline (vault-side, `company/marketing/content/` — see the dated note `company/marketing/notes/2026-08-11-journal-publishing-pipeline.md` for the vault/repo split rationale) was decided on 2026-08-18 to produce **English-only** articles. The journal as refactored by [[web-001-journal-content-format-refactor|web-001]] treats a missing locale file as a malformed entry — the loader kept `assertMdxRegistryComplete`'s loud-failure philosophy, which was correct when every post was bilingual and is now a wall: the next seven planned articles have no zh, and the first file drop would fail the build.

The four existing posts are bilingual and must stay exactly as they are. This PRD changes what is *permitted*, not what exists.

Sveltia constraints (see the plan's 2026-08-11 revision): the page-bundle layout `<slug>/index.<locale>.md` is fixed; Sveltia's i18n config has per-locale requirement options — whether a locale can be marked optional in the collection config without breaking `web-004`'s field modelling is part of this PRD's investigation, and [[web-004-sveltia-cms-install|web-004]] is in progress, which is why this depends on it rather than racing it on the same config file.

## Acceptance Criteria

- [x] A journal folder containing only `index.en.md` builds and renders: the `/en/...` route serves it normally, and the `/zh/...` route for that slug serves the English content (dek, body, FAQ, TOC) — visibly, not a 404, not a blank page. If a "this article is available in English only" affordance is added on the zh route, it follows the site's existing bilingual UI conventions and vault-root voice.
- [x] The loader's loud failure survives for genuinely malformed entries: a folder with **no** `index.en.md` (zh-only or empty) still fails the build with a clear message. English is the required locale; zh is the optional one — not "any one locale."
- [x] Journal landing pages, OG image routes, sitemap, and structured data (`FAQPage`) behave correctly for a single-locale entry in both locales — no zh-side entry pointing at a missing resource, no duplicate-content hreflang mistakes: `hreflang` for a fallback zh page must not claim it is Chinese-language content (investigate and record the chosen pattern — canonical to `/en/`, `x-default`, or omission — in the Work Log).
- [x] The four existing bilingual posts render byte-identically before and after (same standard web-001 held itself to).
- [x] Sveltia: creating or editing an English-only entry in the CMS neither fails validation nor silently fabricates an empty `index.zh.md`. If Sveltia's i18n cannot express an optional locale cleanly, document the constraint and the chosen workaround in the Work Log rather than degrading the editor into a state where saving an entry corrupts it.
- [x] Tests cover: en-only entry renders on both routes, en-missing entry fails the build, bilingual entry unaffected.

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

### 2026-08-19 — Correction to Context

The Context section above says [[web-004-sveltia-cms-install|web-004]] "is in
progress". It is not: it is complete, reviewed and committed (`0577755`), and
`public/admin/config.yml` was modified by this PRD without contention.

### 2026-08-19 — Where the fallback lives

Resolved in the loader, as the Implementation Notes require. `src/lib/journal/mdx.ts`
gains two exported functions and no duplicate files are written anywhere:

- `hasEntryLocale(slug, lang)` — does this entry have that source file.
- `sourceLocale(slug, lang)` — which file backs a request for that locale. `zh`
  falls back to `en`; **`en` never falls back**, so the loud failure survives.

The missing-file error is now locale-aware. A folder with no `index.en.md`
fails the build with the slug and the fix; a request for a `zh` file that does
not exist can only happen if a caller skipped `sourceLocale()`, and the message
says so rather than pretending the content is malformed.

`JOURNAL_CONTENT_DIR` was added as a test-only override of the content
directory. Without it the two failure cases under test — a zh-only folder and an
empty folder — would have to be committed to `src/content/journal/`, where they
would fail every subsequent build. Documented in the file as not a deployment
knob.

### 2026-08-19 — The decision the PRD singled out: hreflang on a fallback zh page

Four options were considered against current Google guidance (researched, not
recalled — sources below):

- **A. Self-canonical `/zh/`, keep the `zh-HK` alternate.** Rejected. It claims
  English text is Chinese-language content, and Google's duplicate detection can
  fold the two URLs together anyway, so the declared signals are not even
  reliably honoured.
- **B. `/zh/` canonicalises to `/en/`, `zh-HK` alternate dropped from both
  URLs.** **Chosen.**
- **C. Self-canonical both, emit only `en` + `x-default`.** Rejected: avoids the
  false claim but hands the consolidation decision to Google's heuristics, which
  is the ambiguity `rel=canonical` exists to remove.
- **D. `noindex` the `/zh/` URL.** Rejected: heavier than needed, and Google
  explicitly steers away from `noindex` for within-site duplicates in favour of
  canonical. Illyes has also said a `noindex` on one cluster member can affect
  the whole cluster.

B is a verbatim match to Google's rule for this exact case: *"If you're using
hreflang elements, make sure to specify a canonical page in the same language,
or the best possible substitute language if a canonical page doesn't exist for
the same language"*
(`developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls`).
The alternate is dropped from **both** URLs rather than only the zh one, because
hreflang must be reciprocal — a one-sided `zh-HK` entry left on the `/en/` page
is ignored regardless — and because a page canonicalising elsewhere has its own
annotations disregarded (Mueller, `johnmu.com/hreflang-canonical/`).

`x-default` is deliberately **not** added in the head. It only means anything in
a multi-version cluster, this site emits no `x-default` in any page head today,
and a single-language entry has a cluster of one. The sitemap keeps `x-default`
for genuinely bilingual pages, unchanged.

Consequences carried through with it: `og:url` and `og:locale` follow the
canonical URL (a card pointing at `/zh/` and declaring `zh_HK` would repeat the
same false claim), and the sitemap emits one `/en/` row with no alternates for an
English-only entry — advertising a URL the site itself declares non-canonical is
the opposite of what a sitemap is for. The page stays `index, follow`.

Expressed in `pageMetadata()` as one new optional input, `availableLocales`, so
a caller still cannot hand-write an `openGraph` object ([[web-006-openGraph-segment-merge|web-006]]'s
ESLint rule is untouched and still passes).

Sources: Google, *Consolidate duplicate URLs* and *Localized versions of your
pages*; `johnmu.com/hreflang-canonical/`; Search Engine Journal, "Google Reminds
That Hreflang Tags Are Hints, Not Directives" (May 2025); Search Engine
Roundtable on Illyes' noindex/cluster remark.

### 2026-08-19 — The rendering trap, and the one CSS change

The site renders every string twice — `<span lang="en">` and `<span lang="zh">`
— and hides the inactive one from `globals.css`. Putting English text inside the
`lang="zh"` span would have been the smallest change and was rejected: it is the
element-level version of the `hreflang="zh-HK"` mistake, and it makes a screen
reader announce English prose in a Chinese voice.

So fallback content is emitted **once**, marked `lang="en"` — which the existing
`[data-lang='zh'] [lang='en']` rule would hide, leaving a blank page. One
attribute, `data-en-fallback`, marks "English on purpose, on a Chinese page", and
the rule became:

```css
[data-lang='zh'] [lang='en']:not([data-en-fallback]) { display: none !important; }
```

The exclusion had to go **into** that rule rather than into a separate override:
these declarations sit in `@layer base`, and `!important` reverses layer order,
so an unlayered `display: revert !important` would have lost to them. The
exemption is per-element, not inherited, so the bilingual CTA inside a fallback
article still behaves normally.

`<html lang>` is set from the URL by the root layout and stays `zh-HK` on the zh
route. That is correct: the chrome really is Chinese, and the English article
declares its own language on the elements that hold it.

**Judgment call — the affordance.** Added, as the criterion permits: one mono
caps line above the headline on the zh route, `本文只有英文版本。`, in brass,
matching the existing meta-row typography. Not repeated on the journal index or
homepage cards, where the English title is self-evidently English and a badge on
every card would be noise.

**Judgment call — documentation.** `src/content/journal/README.md` and
`docs/cms-editor-guide.md` both asserted that both locale files are required.
Both were updated. The PRD's out-of-scope line ("no changes under
`src/content/`") is read as covering *content*; leaving the folder's own
contributor README stating the opposite of the new rule would be a defect.

### 2026-08-19 — Sveltia: the locale is expressible, cleanly

`initial_locales` is Sveltia's supported expression of an optional locale, and it
does exactly what the criterion asks. Added to the global `i18n` block as
`initial_locales: [en]`. Per Sveltia's own documentation:

> "Developers can specify locales to be enabled by default when users create a
> new entry draft, using the `initial_locales` i18n option... The default locale
> is always enabled, even if it's excluded from `initial_locales`, while other
> locales can be enabled or disabled by users in the Content Editor through the
> three-dot menu in the top right corner."

Three consequences worth recording: a new draft opens with English alone, so an
English-only save is the *default* path and cannot fail validation on absent
Chinese fields; a disabled locale is not written, so no empty `index.zh.md` is
fabricated; and English cannot be switched off, so the CMS cannot produce the
one folder shape that fails the build. `save_all_locales: false` is the older
spelling of roughly this and is deprecated for removal in Sveltia 1.0 — a note
in the config says not to reintroduce it.

Field order in `config.yml` was not touched, so no post's frontmatter key order
changes on its next save ([[web-009-simplify-journal-fields|web-009]] owns the field set).

The config validates against Sveltia's own JSON schema at the pinned version:

```
$ python3 -c "... jsonschema.Draft7Validator(sveltia-cms@0.193.0 schema) over public/admin/config.yml"
VALID against @sveltia/cms@0.193.0 schema
```

**Not verified in a browser, and here is why.** Sveltia's local backend uses the
File System Access API, which requires a native OS directory-picker gesture that
no automation driver can supply — Playwright and Chrome DevTools alike stop at
the dialog. The editor behaviour above is therefore documented and
schema-validated but not exercised. It is the one criterion resting on Sveltia's
documentation rather than on observed output; see Handoff.

### 2026-08-19 — Verification

All commands run in `/Users/sean/agentic-maison/unshared/website`.

**Tests** — 16 before, 25 after (9 added; none removed, none changed):

```
$ pnpm test
...
ok 9 - a folder with only index.en.md is a complete entry
ok 10 - the zh route of an English-only entry is served by the English file
ok 11 - the en route of an English-only entry is unremarkable
ok 12 - a bilingual entry is unaffected: each locale still reads its own file
ok 13 - a folder with no index.en.md fails, naming the slug and the file
ok 14 - an empty folder fails the same way
...
# tests 25
# pass 25
# fail 0
```

**Lint** — at baseline, 8 warnings / 0 errors, all pre-existing `no-img-element`
warnings in `deck/page.tsx` and `hero-mechanism-layers.tsx`:

```
$ pnpm lint
✖ 8 problems (0 errors, 8 warnings)
```

**Build** — green first attempt, no font flake:

```
$ pnpm build
✓ Compiled successfully in 2.4s
✓ Generating static pages using 9 workers (39/39) in 510ms
```

**A zh-only folder still fails the build.** `index.en.md` was renamed to
`index.zh.md` in a temporary entry and the build re-run:

```
$ pnpm build
Error: Journal content error — "english-only-smoke-test" has no index.en.md. Every folder under src/content/journal/ needs an index.en.md; index.zh.md is optional, and an entry without one serves its English text on the /zh/ route.
> Build error occurred
 ELIFECYCLE  Command failed with exit code 1.
```

**An English-only folder builds and serves on both routes.** A temporary
`english-only-smoke-test/index.en.md` was added, built, and served from
`next start`:

```
en route: HTTP 200  113833 bytes
zh route: HTTP 200  113730 bytes
```

Head of the **zh** route — canonical points at `/en/`, the only alternate is
`en`, the card follows the canonical URL, and the page stays indexable:

```
<html lang="zh-HK" data-theme="dark" data-lang="zh" ...>
<title>An entry with no Chinese translation · Agentic Maison</title>
<link rel="canonical" href="https://agenticmaison.com/en/journal/english-only-smoke-test"/>
<link rel="alternate" hrefLang="en" href="https://agenticmaison.com/en/journal/english-only-smoke-test"/>
<meta property="og:url" content="https://agenticmaison.com/en/journal/english-only-smoke-test"/>
<meta property="og:locale" content="en_US"/>
<meta name="robots" content="index, follow"/>
```

(no `zh-HK` alternate on either route; the `/en/` route emits the same canonical
and the same single alternate.)

Body of the zh route — the article is there, marked English, under the note:

```
<span lang="en" data-en-fallback="">19 August 2026</span>
<p lang="zh" class="font-mono ... text-brass ...">本文只有英文版本。</p>
<h1 ...><span lang="en" data-en-fallback="">An entry with <em>no Chinese translation</em>.</span></h1>
<nav lang="en" data-en-fallback="" ... aria-label="Table of contents">
<span lang="en" data-en-fallback="">A temporary entry used to verify ...</span>
<div lang="en" data-en-fallback="" class="font-body ...">
  <h2 ...>The first heading</h2>
  <p>Body text in English, on a folder with no <code>index.zh.md</code> beside it.</p>
```

`FAQPage` JSON-LD is emitted on the zh route from the English `faq` list — the
questions the reader can actually see — rather than being dropped.

**It is visible, not merely present in the markup.** The three URLs were driven
in a real Chromium through Playwright and computed styles read off the page.

On `/zh/journal/english-only-smoke-test` (`data-lang="zh"`), all five
`[data-en-fallback]` elements carry `lang="en"` and are laid out: the date span
`display: inline`, the h1 title span `display: inline`, the dek span
`display: inline`, the article body div `display: block`, each with
`getBoundingClientRect().height > 0`. The table-of-contents `nav` reads
`display: none` at a 1200px viewport and `display: block` with height at 1400px
— that is its own pre-existing `hidden min-[1280px]:block` desktop breakpoint,
not the language rule, and was confirmed by resizing.

`article.innerText` returns the full English article — dek, all three headings
and their paragraphs. The note `本文只有英文版本。` is `display: block` with
height. Walking the article for non-empty elements computing to `display: none`
returned exactly one: the closing CTA's English span, which is ordinary chrome
with a real Chinese translation and whose Chinese sibling is the one on screen.
Nothing English and load-bearing is hidden.

Controls behaved: `/en/journal/english-only-smoke-test` and the bilingual
`/zh/journal/what-is-an-ai-agent` both report **zero** `[data-en-fallback]`
elements, and on the bilingual zh page the Chinese spans render while the
English spans are `display: none` exactly as before.

A full-page screenshot at 1400px shows Chinese chrome throughout (工坊 / 過程 /
札記, 返回札記), the brass Chinese note under the breadcrumb, then the English
headline, dek, "CONTENTS" rail and body. No blank region, no sentence rendered
twice, no English/Chinese mixing inside a content block.

**Sitemap** — one row for the English-only entry, no alternates; bilingual
entries unchanged:

```
$ curl -sS http://localhost:3112/sitemap.xml
<loc>https://agenticmaison.com/en/journal/english-only-smoke-test</loc>
   (no xhtml:link alternates, and no /zh/ row)

<loc>https://agenticmaison.com/zh/journal/what-is-an-ai-agent</loc>
<xhtml:link rel="alternate" hreflang="en" href=".../en/journal/what-is-an-ai-agent"/>
<xhtml:link rel="alternate" hreflang="zh-HK" href=".../zh/journal/what-is-an-ai-agent"/>
```

**Landing surfaces** — the entry appears on the Chinese journal index and the
Chinese homepage leaf grid, in English, rather than vanishing:

```
<h2 class="font-display ..."><span lang="en" data-en-fallback="">An entry with no Chinese translation</span></h2>
<h3 class="leaf-title"><span lang="en" data-en-fallback="">An entry with <em>no Chinese translation</em></span></h3>
```

**Open Graph card** — the generated card exists for both locales and is
byte-identical between them (both render the English title). The zh-route card
was opened and inspected: cream ground, the title set large in the display
serif, wordmark lower-left with the brass diamond. `1200 x 630 PNG, 47129 bytes`,
identical file on `/en/` and `/zh/`.

**The four existing bilingual posts render byte-identically.** Method: capture
every page from `next start` on the *pre-change* build, apply the change,
rebuild, capture again from a fresh server, and diff. (A comparison worktree was
not needed and its two known false positives were therefore not in play. One
false negative was: the first "after" capture came back byte-identical on every
file because the old `next start` process was still bound to the port and
serving the previous build from memory — it was caught by an `after` capture
referencing a CSS chunk that no longer existed on disk. Re-run against a
confirmed-fresh server.)

Raw HTML differs in exactly three places, none of them rendered markup:

1. the Next **build id** (`"b":"Zd9o…"` → `"b":"mfQx…"`), which changes on every
   build including a no-op one;
2. the **CSS chunk filename**, because `globals.css` gained the `:not()` above;
3. on the entry pages only, two artefacts inside the RSC flight payload — a
   `false` where the new `{isFallback && …}` expression sits, and
   `"englishFallback":false` in the `JournalToc` props. Both render nothing.

With the flight payload and asset hashes normalised, the served DOM is identical:

```
=== rendered DOM, flight payload and asset hashes excluded ===
IDENTICAL  en-ai-automation-guide-small-business.html
IDENTICAL  en-ai-vs-automation-vs-ai-agents.html
IDENTICAL  en-home.html
IDENTICAL  en-journal-index.html
IDENTICAL  en-what-is-an-ai-agent.html
IDENTICAL  en-why-most-ai-projects-fail.html
IDENTICAL  zh-ai-automation-guide-small-business.html
IDENTICAL  zh-ai-vs-automation-vs-ai-agents.html
IDENTICAL  zh-home.html
IDENTICAL  zh-journal-index.html
IDENTICAL  zh-what-is-an-ai-agent.html
IDENTICAL  zh-why-most-ai-projects-fail.html
```

The eight generated OG cards for those four posts are byte-identical too:

```
IDENTICAL og  en/ai-automation-guide-small-business
IDENTICAL og  en/ai-vs-automation-vs-ai-agents
IDENTICAL og  en/what-is-an-ai-agent
IDENTICAL og  en/why-most-ai-projects-fail
IDENTICAL og  zh/ai-automation-guide-small-business
IDENTICAL og  zh/ai-vs-automation-vs-ai-agents
IDENTICAL og  zh/what-is-an-ai-agent
IDENTICAL og  zh/why-most-ai-projects-fail
```

`sitemap.xml` differs only in its `lastmod` timestamps, which are `new Date()` at
render time; the journal rows are unchanged.

The temporary entry `src/content/journal/english-only-smoke-test/` was deleted
after verification. `src/content/` is back to the four bilingual posts and its
README, and the unrelated untracked drafts under `src/content/blog/` were not
touched.

## Handoff / Next Action

**For Sean — review, then stage and commit.** Nothing is committed; the working
tree carries the change. The untracked drafts under `src/content/blog/` belong to
another PRD and were not touched.

Three things worth a deliberate look:

1. **The hreflang decision** is the one with real SEO consequence. It is argued
   in the Work Log with the options that were rejected and why. If you disagree
   with canonicalising the `/zh/` URL to `/en/`, the change is one input:
   `availableLocales` in `pageMetadata()`.
2. **The Chinese note.** `本文只有英文版本。` — brass mono caps above the
   headline, on the zh route only. Copy and placement are a judgment call; it is
   one line in `src/app/[locale]/journal/[slug]/page.tsx`.
3. **The CMS behaviour is documented, not observed.** `initial_locales: [en]` is
   Sveltia's own mechanism and the config validates against Sveltia's schema at
   the pinned version, but the editor was not driven: local editing goes through
   the File System Access API, whose native directory picker cannot be automated.
   Worth five minutes at `/admin` the next time you are in Chrome — create a new
   entry, confirm it opens with English alone and saves with no `index.zh.md`,
   and confirm an existing bilingual post still opens with both tabs on.
   **Whichever way that lands, the site is safe**: the loader now accepts a
   folder with or without `index.zh.md`, so neither outcome can break a build.

Not done, deliberately, and available if you want them: no "English only" badge
on the journal-index or homepage cards (the note lives on the article itself),
and no `x-default` in any page head (the site emits none today; the sitemap keeps
its own for bilingual pages).

Nothing here blocks [[web-009-simplify-journal-fields|web-009]]: `num`,
`dateDisplay`, `leafEmphasis`, `titleEmphasis` and `dek` were left exactly as
found, and the `config.yml` field order is unchanged. web-009 should know that
`JournalEntryMeta` gained one field, `hasZh`, and that three call sites now
render entry text through `<Bilingual>` rather than a hand-written span pair.

## Result
### Summary

A journal folder containing only `index.en.md` is now a complete, publishable
entry. The `/zh/` route for it serves the English article — visibly, marked
`lang="en"`, under a one-line Chinese note — and both routes tell search engines
the `/en/` URL is the canonical one, with no `zh-HK` alternate claimed on either.
English remains mandatory: a folder with no `index.en.md` still fails the build
with a message naming the slug and the fix.

The fallback is resolved in the loader, not by writing duplicate files: there is
still exactly one source file per language that exists. The four existing
bilingual posts render byte-identically, and their generated OG cards are
byte-identical files.

In the CMS, `initial_locales: [en]` makes English-only the default shape of a new
entry and Chinese an opt-in per entry, so saving one neither fails validation nor
fabricates an empty `index.zh.md`.

`pnpm test` 25/25 (16 before, 9 added), `pnpm lint` 8 warnings / 0 errors
(baseline), `pnpm build` green.

### Files Modified

- `src/lib/journal/mdx.ts` — `hasEntryLocale()` and `sourceLocale()`; locale-aware
  missing-file error; test-only `JOURNAL_CONTENT_DIR` override.
- `src/lib/journal/entries.tsx` — `hasZh` on `JournalEntryMeta`; `zh` fields fall
  back to the English values.
- `src/lib/journal/single-locale.test.ts` — new; six cases over a fixture tree.
- `src/lib/metadata/page-metadata.ts` — `availableLocales` input driving
  `canonical`, `alternates.languages`, `og:url` and `og:locale`.
- `src/lib/metadata/page-metadata.test.ts` — three cases for the above.
- `src/components/bilingual.tsx` — new; the span pair, or one marked English span.
- `src/components/journal-toc.tsx` — `englishFallback` prop.
- `src/app/[locale]/journal/[slug]/page.tsx` — serve and mark the fallback body,
  FAQ and metadata; the Chinese note.
- `src/app/[locale]/journal/page.tsx`, `src/app/[locale]/page.tsx` — entry text
  through `<Bilingual>`.
- `src/app/sitemap.ts` — one `/en/` row, no alternates, for an English-only entry.
- `src/app/globals.css` — `:not([data-en-fallback])` on the zh hiding rule.
- `public/admin/config.yml` — `initial_locales: [en]`; collection description.
- `docs/cms-editor-guide.md`, `src/content/journal/README.md` — both said a post
  needs two locale files.

### Discoveries

- **`!important` reverses `@layer` order.** The language-hiding rules live in
  `@layer base`, so an unlayered `display: revert !important` override loses to
  them. Any future exception to those rules has to be written into the selector
  itself, not layered on top.
- **A journal page is dynamic, not prerendered.** The root layout calls
  `headers()` for the proxy's `x-locale`, so `/[locale]/journal/[slug]` builds as
  `ƒ` despite `generateStaticParams` and `dynamicParams = false`. Only the OG
  images land on disk. A before/after render comparison therefore has to run
  `next start` and fetch, not diff `.next/server/app/**`.
- **`next start` survives its own build being replaced.** A stale server keeps
  serving the previous build from memory and quietly produces a byte-identical
  "after" capture. The tell is an asset URL in the response that no longer exists
  on disk. Confirm the port is free before trusting a comparison.
- **The RSC flight payload is not a rendering difference.** A conditional
  `{flag && <x/>}` serialises a literal `false` into the payload and a new prop
  serialises even at its default. Both render nothing; a byte comparison has to
  exclude `__next_f.push` lines and the build id, or it reports noise.
- **Node's test runner cannot import a `.tsx` module** — it strips types but does
  not compile JSX — and it resolves imports itself, so it knows nothing of the
  `@/` alias. A value import of `@/i18n/config` into an otherwise-testable module
  breaks `pnpm test` while the build stays green; a type-only import is erased
  and is safe. `page-metadata.ts` derives its locale list from its own
  `Record<Locale, string>` map instead, which the type system keeps exhaustive.
- **Sveltia's local backend cannot be automated.** The File System Access API
  needs a native directory-picker gesture; no browser driver can supply it. CMS
  editor behaviour on this repo is verifiable by hand only.
