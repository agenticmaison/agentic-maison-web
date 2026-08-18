---
id: web-004
title: Configure Sveltia CMS for the journal, provable locally
status: queue
project: website
plan: journal-publishing-pipeline
agent: coder
operator: sean
working_path: .
depends_on: [web-001]
review_mode: human
created: 2026-08-11
updated: 2026-08-17
---
	
# PRD: web-004 Configure Sveltia CMS for the journal, provable locally

## Objective

Build and prove the Sveltia configuration for the journal — the admin mount, the collection schema, the field definitions, the media settings, and the proxy fix — entirely on a local machine, with no deployment and no accounts involved.

The end state is a CMS that works against a local checkout and needs only its production authentication wired up. That wiring is `web-007` and belongs to a person, not to you.

## Context

### Why this PRD stops where it stops

An earlier version of this PRD ran all the way to a working production sign-in. That was not dispatchable: creating a GitHub OAuth application requires a browser and the owner's GitHub account, deploying a Cloudflare Worker requires his credentials, and granting the content owner repository access is his to do. A dispatched agent can do none of those and cannot ask for them — so the brief would have stalled on its own acceptance criteria.

The split is: **everything provable locally is yours; everything requiring an account is `web-007`'s.** The risky, fiddly, high-judgment part — the schema, the field modelling, and the markdown fidelity gate — is all on your side of the line. `web-007` is fifteen minutes of clicking, once you have made it correct.

### The state of the content

`web-001` is complete and committed. Journal content is now:

- `src/content/journal/<slug>/index.en.md` and `index.zh.md`
- YAML frontmatter carrying `slug`, `num`, `date`, `dateDisplay`, `title`, `dek`, `metaDescription`, `author`, optional `leafEmphasis` and `titleEmphasis`, and a `faq` list of question/answer objects
- No sidecar JSON, no static import registry — a folder with two valid files publishes a post

Read `src/lib/journal/mdx.ts` for the loader and the exact frontmatter contract. Your `config.yml` has to agree with it precisely; a field name that differs by a character produces content the site cannot render.

### Sveltia was chosen by the owner

It is git-backed: content stays as files in this repo, commits stay the audit trail, and agents keep authoring posts by writing files. Nothing you configure may compromise that.

### Verified constraints to build against

Checked against Sveltia's documentation and issue tracker; these are findings, not assumptions:

- **Page bundles are the only supported way to keep one folder per entry.** `path: '{{slug}}/index'` on an entry collection, plus `i18n.structure: multiple_files`, yields `<slug>/index.en.md` and `<slug>/index.zh.md`. No `i18n.structure` value produces `<slug>/en.md`. `web-001` migrated the content into this exact shape for this exact reason.
- **Per-entry media folders work** under page bundles with `media_folder: ''` and `public_folder: ''`. The entry's own folder becomes its media folder. Fixed in v0.37.0.
- **One collection entry is one file.** Sidecar files cannot be edited as part of an entry — which is why FAQ content now lives in frontmatter.
- **Sveltia is pre-1.0** — v0.182.0 as of August 2026, actively released. Accepted knowingly; pin the version rather than tracking latest, because a silent upgrade to the editing surface is not something to discover through a mangled article.

### The trap in this repo specifically

`src/proxy.ts` rewrites every path that does not already carry a locale segment, sending `/foo` to `/en/foo`. Its matcher excludes `_next/static`, `_next/image`, `assets/`, `brand/`, `favicon.ico`, `sitemap.xml` and `robots.txt` — and nothing else. **A CMS mounted at `/admin` will be rewritten to `/en/admin` and 404.** Adding `admin/` to that exclusion is part of this work.

### The editor this is for

One non-technical person owns content marketing. She does not use git and will not be taught to. Every field you define is a field she sees; every hint you write is documentation she will actually read. Model the form for her, not for the file format.

## The fidelity gate

**This is a gate, not a checklist item. Run it before anything else is called finished, and stop if it fails.**

- [ ] Sveltia's markdown widget has an open, intermittent report (issue #556) of escaping asterisks across an entire document on save — including when the editor only touched the title. Whether the documented `raw` editing mode avoids this is not documented, and neither is frontmatter key ordering on save.

The four existing articles are hand-written, bilingual, and long. Silent reformatting would be discovered weeks later, in a diff nobody read closely.

1. Copy a real post — `what-is-an-ai-agent` — to a throwaway slug.
2. Open it in the CMS, change nothing, save.
3. `git diff` must be **empty**.
4. Then change one character in the title and save. The diff must show that one change and nothing else — no reflowed paragraphs, no altered emphasis characters, no re-escaped punctuation, no reordered frontmatter keys.
5. Repeat both on the Chinese file, which is where escaping and width handling are most likely to differ.

If the diff is not clean, try `raw` mode and repeat. If it is still not clean, **stop and write up exactly what changed** rather than proceeding. That finding is worth more than a half-working install, and it may mean the CMS is used for new posts only while existing ones stay developer-edited. Delete the throwaway when the gate passes.

## Acceptance Criteria

- [ ] `/admin` loads the Sveltia interface against a locally running site, and `src/proxy.ts` no longer rewrites it.
- [ ] The journal collection lists all four existing posts, with both locales bound into a **single entry** — English and Chinese edited as one thing, not two.
- [ ] Creating a post through the interface produces `src/content/journal/<slug>/index.en.md` and `index.zh.md` with frontmatter the loader accepts, and the post renders at both locale routes after a rebuild.
- [ ] Uploading an image through the interface lands it in that entry's own folder and it renders in the post.
- [ ] `metaDescription` is required and cannot be left blank on save.
- [ ] **No Open Graph or social image field appears anywhere in the interface.** `web-002` generates those; an upload field would silently compete with it.
- [ ] FAQ entries are edited as a repeating list of question and answer pairs. At no point does an editor see schema.org vocabulary.
- [ ] The fidelity gate above passes, with its diffs recorded in the Work Log.
- [ ] `config.yml` contains no secrets, no OAuth client id, and no deployed Worker URL. Where `backend.base_url` will go, leave a clearly marked placeholder and a comment naming `web-007` as the PRD that fills it.
- [ ] A draft editor guide at `docs/cms-editor-guide.md` — how to create a post, edit one, upload an image, save for review, and what each field means. Written for someone non-technical: no git vocabulary, no mention of commits or branches. The sign-in section is a `[web-007]` placeholder, since you cannot walk a flow that does not exist yet.
- [ ] `pnpm build` and `pnpm lint` both pass. Lint finishes at the 9-warning baseline, not above it.

## Implementation Notes

**Determine the local testing mechanism from Sveltia's current documentation before assuming one.** It documents a local development mode; whether that is a browser File System Access integration or a proxy server of the Decap lineage is exactly the sort of detail that has changed between versions. Read the docs, use what they say, and record which mechanism you used — `web-007` and the editor guide both depend on knowing.

**Mount.** `public/admin/index.html` loading a pinned Sveltia version, plus `public/admin/config.yml`.

**Collection.** Entry collection over `src/content/journal`, `path: '{{slug}}/index'`, `media_folder: ''`, `public_folder: ''`, `extension: md`, `i18n.structure: multiple_files` with locales `en` and `zh`, default `en`.

**Fields.** Mirror the frontmatter contract in `src/lib/journal/mdx.ts` exactly.

- `author` is a select, not free text — read the valid keys from `src/lib/journal/authors.ts` and enumerate them.
- `title`, `dek`, `dateDisplay`, `leafEmphasis`, `titleEmphasis`, `faq` and the body are per-locale. `slug`, `num`, `date` and `author` are the same across both.
- `metaDescription` is a known wart; label it rather than silently mismodelling it. The site reads it from the English file only, and the Chinese meta description comes from `dek.zh`. Configure it English-only if Sveltia's i18n settings allow a field on one locale; if not, leave it translatable with a hint saying the Chinese value is unused.
- `num` is manually assigned and format-sensitive (`No. 003`). Give it a hint stating the format and that it must be unique. It is a rough edge; note it in the Work Log rather than fixing it here.

**Media.** Enable the client-side optimisation Sveltia performs before commit — WebP conversion, quality 85, and a maximum dimension around 1600px. Editors paste screenshots straight off a retina display; without this the repo accumulates multi-megabyte PNGs.

**`public/admin/` is world-readable**, which is normal for this class of tool — authentication gates writes, not the page. Do not build a secret URL or an access wall around it.

**Builds here are network-dependent.** `next/font/google` fetches from `fonts.gstatic.com` at build time and a build in this repo has already failed with fifteen errors purely because that 404'd. Retry a red build before debugging it.

## Out of Scope

- **Anything requiring an account or a deployment.** No GitHub OAuth application, no Cloudflare Worker, no `wrangler`, no production deploy, no repository access for anyone. That is `web-007`, and it is a person's work.
- **Editorial workflow verification.** The pull-request-backed mode should be configured, but proving that a save produces a PR with a Vercel preview URL requires the deployed auth path. Configure it, state that it is unverified, and leave the proof to `web-007`.
- **Migrating Vincent's fifteen drafts.** `mkt-009` and `mkt-010` own them, and `src/content/blog/` must not be touched, read into this work, or deleted.
- **Editing, restyling or restructuring any existing post.** The fidelity gate's throwaway copy is deleted when the gate passes.
- **Changing how posts render.** `web-001`, `web-002` and `web-005` settled that.
- **Extending the CMS to non-journal content** — site copy, the digital pages, the deck.
- **Committing or pushing.** Leave the work in the working tree for review.

## Work Log

### 2026-08-17 — rescoped before dispatch

Originally written to run through to a working production sign-in. That made it undispatchable: three of its acceptance criteria required a GitHub OAuth application, a deployed Cloudflare Worker, and repository access granted to a named person — all of which need the owner's accounts and a browser, and none of which a dispatched agent can do or ask for. It would have stalled on its own criteria.

Split rather than weakened. Everything provable on a local machine stayed here, including the markdown fidelity gate, which is the genuinely risky part. Everything requiring an account moved to `web-007`, a seat PRD for the owner, which depends on this one.

## Handoff / Next Action

## Result
### Summary

### Files Modified

### Discoveries
