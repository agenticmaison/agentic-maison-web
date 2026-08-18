<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Brand positioning (updated 2026-05-24) <!-- added 2026-05-24 -->

Agentic Maison positions as an **AI consultancy** as the umbrella brand. The Digital Practice (website services) is auxiliary — "other work we also do" — not co-equal. All homepage messaging should lead with AI consultancy identity, mission, and impact.

- **AI consultancy is the focus.** The homepage should read as an AI consultancy that also does other things, not a dual-practice studio.
- **Digital services are secondary.** Shown under an "Other Work" section that links out to `/digital` for details. Not given equal visual weight.
- **Process section paints a picture, not a spec.** Three phases — Discover, Pilot, Orchestrate — described at a high level. No pricing, no timelines, no deliverable specifics. Competitors should not be able to reconstruct the engagement model from the homepage.
- **About copy is direct and concrete.** Leads with the problem solved and the outcome delivered. The maison metaphor is flavor, not the whole message. Not shallow/conceptual — it's a service business, not a fashion brand.

Read `../../AGENTS.md` — the vault root — for brand-level vocabulary, tone, and do-not-use list. Read `../../services/ai/AGENTS.md` for internal AI Practice doctrine (do not expose internal-only details on the site). <!-- paths repointed 2026-08-04: this repo moved from the HQ tree to unshared/website/ and both were one level short. Outside a checkout of the vault neither resolves, which is expected. -->

## Page metadata <!-- added 2026-08-18 -->

**Never write an `openGraph` object inside `src/app/`. It is an ESLint error, and the rule exists because the failure it prevents is silent.**

Next merges segment metadata *shallowly*: a segment exporting `openGraph` replaces its parent's object wholesale rather than merging field by field. A page that sets `openGraph` for a better title, and says nothing about `images`, does not inherit the site card — it drops it. The build passes, the page renders, and the omission is visible only when someone pastes the URL into LinkedIn. Two live pages shipped that way before it was caught.

Compose metadata through `pageMetadata()` in `src/lib/metadata/page-metadata.ts`, which builds the whole `openGraph`/`twitter` shape from plain fields, so the broken state is inexpressible rather than merely discouraged. An `opengraph-image` file at an ancestor segment does **not** protect descendants — that was tested, not assumed.

One trap if you edit the helper: Next gates the file-convention image on `hasOwnProperty('images')`, so `{ images: undefined }` suppresses a generated card exactly as firmly as a real value. The key must be omitted, not set to undefined. There is a test asserting it.

## The journal <!-- added 2026-08-18 -->

**Adding a post is a file drop.** A folder under `src/content/journal/` containing `index.en.md` and `index.zh.md` publishes a post. No TypeScript is edited, and there is no registry to keep in step — `src/lib/journal/mdx.ts` discovers content from the filesystem.

**That filename shape is a constraint, not a preference.** It is Sveltia CMS's page-bundle layout (`path: '{{slug}}/index'` with `multiple_files` i18n), and it is the only supported way to keep one folder per entry. No Sveltia i18n structure produces `<slug>/en.md`. Do not tidy it.

Metadata is YAML frontmatter. FAQ content lives there too, as a `faq` list of question/answer objects, and the schema.org `FAQPage` object is built in code — a Sveltia collection entry maps to exactly one file, so sidecar JSON would be uneditable by the person who owns content.

**Open Graph cards for journal entries are generated** from the post title by `opengraph-image.tsx`, never uploaded. There is deliberately no OG image field anywhere an editor can see.

**Heading anchors and the table of contents come from one pass.** A collector plugin runs after `rehype-slug` and reads the ids it assigned. Never derive heading ids a second way; that divergence existed once and produced links that scroll nowhere.

## Builds are network-dependent <!-- added 2026-08-18 -->

`next/font/google` fetches from `fonts.gstatic.com` at build time. A build here has failed with a wall of errors purely because that 404'd, and the identical tree built clean on retry. **Retry a red build before you debug it.**

Relatedly, `pnpm`'s isolated `node_modules` does not expose transitive packages to application code. A package visible in the store is unresolvable from `src/` until it is a direct dependency — true of `@mdx-js/mdx` despite `@next/mdx` depending on it.

## Homepage section order <!-- added 2026-05-24 -->

Top to bottom: Hero → About (The Maison) → Process → Contact → Journal → Other Work.

The `data-mech-sticky` right-column schematic spans Hero through Process only. Journal and Other Work are full-width below Contact. Mobile uses the existing inline mechanism block between Hero and About.

Services section (`id="services"`) is hidden / commented out — superseded by the Process + Other Work sections.
