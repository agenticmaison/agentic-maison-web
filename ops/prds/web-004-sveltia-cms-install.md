---
id: web-004
title: Install and configure Sveltia CMS for the journal
status: queue
project: website
plan: journal-publishing-pipeline
agent: coder
operator: sean
working_path: .
depends_on: [web-001]
review_mode: human
created: 2026-08-11
updated: 2026-08-11
---

# PRD: web-004 Install and configure Sveltia CMS for the journal

## Objective

Stand up Sveltia CMS over this repository so that a non-technical editor can create a journal post, edit a published one, and upload images — through a form, in a browser, without touching git, a terminal, or GitHub's own interface beyond a single sign-in.

## Context

### Where this sits

`web-001` converts journal content to `.md` files with YAML frontmatter in the page-bundle layout Sveltia requires, and replaces the static import registry with a filesystem loader. `web-002` generates Open Graph images in code. Both must be complete before this is dispatched; this PRD assumes their end state and does not repeat their work.

Sveltia was chosen by the owner. It is git-backed: content stays as markdown in this repo, commits stay the audit trail, and agents keep authoring posts by writing files. Nothing here may compromise that — if a configuration choice would move content out of the repo, it is the wrong choice.

### The editor

One non-technical person owns content marketing. She does not use git and will not be taught to. Her entire interaction with GitHub must be clicking "Sign in with GitHub" once. **A setup that ends with her generating a personal access token is a failed setup**, not a fallback — Sveltia offers that path and it is explicitly rejected here, because avoiding exactly that friction is why a CMS is being installed at all.

### Verified constraints to build against

These were checked against Sveltia's documentation and issue tracker and are not assumptions:

- **Page bundles are the only supported way to keep one folder per entry.** `path: '{{slug}}/index'` on an entry collection, plus `i18n.structure: multiple_files`, yields `<slug>/index.en.md` and `<slug>/index.zh.md`. No `i18n.structure` value produces `<slug>/en.md`.
- **Per-entry media folders work** under page bundles with `media_folder: ''` and `public_folder: ''`. The entry's own folder is its media folder. This was fixed in v0.37.0.
- **One collection entry is one file.** Sidecar files cannot be edited as part of an entry — which is why `web-001` moved FAQ content into frontmatter.
- **On Vercel the default OAuth path does not work.** Sveltia's default targets Netlify-hosted sites. The documented route is deploying its `sveltia-cms-auth` Cloudflare Worker and pointing `backend.base_url` at it.
- **Sveltia is pre-1.0** — v0.182.0 as of August 2026, actively released. Accepted knowingly; the exit cost is a config file, because the content never leaves git.

### The trap in this repo specifically

`src/proxy.ts` rewrites every path that does not already carry a locale segment, sending `/foo` to `/en/foo`. Its matcher at line 125 excludes `_next/static`, `_next/image`, `assets/`, `brand/`, `favicon.ico`, `sitemap.xml` and `robots.txt` — and nothing else. **A CMS mounted at `/admin` will be rewritten to `/en/admin` and 404.** Adding `admin/` to that exclusion list is part of this work, and it is the sort of thing that otherwise costs an afternoon.

## Acceptance Criteria

- [ ] `/admin` loads the Sveltia interface in a browser against the deployed site, and `src/proxy.ts` no longer rewrites it.
- [ ] A person with a GitHub account and write access to this repo can sign in at `/admin` by clicking one button, with **no personal access token created and no GitHub settings page visited**. Walk the flow end to end yourself and record each screen in the Work Log.
- [ ] The journal collection lists all existing posts, with both locales bound into a single entry — English and Chinese edited as one thing, not two.
- [ ] Creating a post through the interface produces `src/content/journal/<slug>/index.en.md` and `index.zh.md` with frontmatter matching what `web-001`'s loader expects, and the post renders at both locale routes.
- [ ] Editing an existing post through the interface changes only what was edited. See the fidelity gate below.
- [ ] Uploading an image through the interface lands it in that entry's own folder and it renders in the post.
- [ ] `metaDescription` is a required field and cannot be left blank on save.
- [ ] **No Open Graph or social image field appears anywhere in the interface.** `web-002` generates those; an upload field would silently compete with it.
- [ ] FAQ entries are edited as a repeating list of question and answer pairs. At no point does an editor see schema.org vocabulary.
- [ ] Saving without publishing produces a pull request, and Vercel builds a preview URL against it. Include the preview URL from a real test in the Work Log.
- [ ] An editor guide exists at `docs/cms-editor-guide.md` — how to sign in, create a post, edit one, upload an image, save for review, and what each field means. Written for someone non-technical: no git vocabulary, no mention of commits or branches, screenshots or exact button labels where a step is ambiguous.
- [ ] `pnpm build` and `pnpm lint` both pass.

## The fidelity gate

**This is a gate, not a checklist item. Do it before pointing the CMS at live content, and stop if it fails.**

Sveltia's markdown widget has an open, intermittent report (issue #556) of escaping asterisks across an entire document on save — including when the editor only touched the title. Whether the documented `raw` editing mode avoids this is not documented, and neither is frontmatter key ordering on save.

The four existing articles are hand-written, bilingual, and long. Silent reformatting would be discovered weeks later in a diff nobody read closely.

1. Copy a real post — `what-is-an-ai-agent` — to a throwaway slug.
2. Open it in the CMS, change nothing, save.
3. `git diff` must be **empty**.
4. Then change one character in the title and save. The diff must show that one change and nothing else — no reflowed paragraphs, no altered emphasis characters, no re-escaped punctuation, no reordered frontmatter keys.
5. Repeat both steps on the Chinese file, which is where escaping and width handling are most likely to differ.

If the diff is not clean, try `raw` mode and repeat. If it is still not clean, **stop and write up exactly what changed** rather than proceeding — that finding is worth more than a half-working install, and it may mean the editor works on new posts only while existing ones stay developer-edited.

## Implementation Notes

**Mount.** `public/admin/index.html` loading the Sveltia bundle, plus `public/admin/config.yml`. Pin the Sveltia version rather than tracking latest — it is pre-1.0 and a silent upgrade to the editing surface is not something to discover through a mangled article.

**Collection.** Entry collection over `src/content/journal`, `path: '{{slug}}/index'`, `media_folder: ''`, `public_folder: ''`, `extension: md`, `i18n.structure: multiple_files` with locales `en` and `zh` and `en` as default.

**Fields.** Mirror the frontmatter `web-001` establishes: `slug`, `num`, `date`, `dateDisplay`, `title`, `dek`, `metaDescription`, `author`, optional `leafEmphasis` and `titleEmphasis`, the `faq` list, and the body.

- `author` is a select, not free text — read the valid keys from `src/lib/journal/authors.ts` and enumerate them.
- `title`, `dek`, `dateDisplay`, `leafEmphasis`, `titleEmphasis`, `faq` and the body are per-locale. `slug`, `num`, `date` and `author` are the same across both.
- `metaDescription` is a known wart and should be labelled as one rather than silently mismodelled. The site reads it from the English file only; the Chinese meta description comes from `dek.zh` (`page.tsx` line 82). Configure it English-only if Sveltia's i18n settings allow a field on one locale; if they do not, leave it translatable and give it a hint saying the Chinese value is unused.
- `num` is manually assigned and format-sensitive (`No. 003`). Give it a hint stating the format and that it must be unique. It is a rough edge; note it in the Work Log rather than fixing it here.

**Media.** Enable the client-side optimisation Sveltia does before commit — WebP conversion, quality 85, and a sensible maximum dimension around 1600px wide. Editors paste in screenshots straight off a retina display; without this the repo accumulates multi-megabyte PNGs.

**Auth.** Deploy `sveltia-cms-auth` as a Cloudflare Worker, create the GitHub OAuth app, and set `backend.base_url` to the Worker. Record in the Work Log where the Worker is deployed, which GitHub OAuth app backs it, and where the secrets live — this is infrastructure whose owner will otherwise be forgotten within a month.

**Editorial workflow.** Enable the pull-request-backed mode so an unpublished save becomes a PR that Vercel previews. This is the approval gate for the whole pipeline and the main thing this stack gives that a shared folder cannot.

**`public/admin/` is world-readable** — that is normal for this class of tool, since authentication gates writes rather than the page. Do not build a secret URL or an access wall around it; do confirm the interface refuses writes when signed out.

## Out of Scope

- **Granting repository access to the editor.** An owner action, not a code change. This PRD makes the sign-in flow work; it does not provision anyone.
- **Migrating Vincent's fifteen drafts.** They are `mkt-009` and `mkt-010`, and conversion of survivors is a later PRD.
- **Editing, restyling or restructuring any existing post.** The fidelity gate's throwaway copy is deleted when the gate passes.
- **Changing how posts render.** `web-001` and `web-002` settled that.
- **Extending the CMS to non-journal content** — site copy, the digital pages, the deck. Possible later; not scoped here.
- **Committing or pushing.** Leave the work in the working tree for review. The Cloudflare Worker deployment is necessarily live, which is fine and expected — say so plainly in the Work Log.

## Work Log

## Handoff / Next Action

## Result
### Summary

### Files Modified

### Discoveries
