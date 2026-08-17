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

## Homepage section order <!-- added 2026-05-24 -->

Top to bottom: Hero → About (The Maison) → Process → Contact → Journal → Other Work.

The `data-mech-sticky` right-column schematic spans Hero through Process only. Journal and Other Work are full-width below Contact. Mobile uses the existing inline mechanism block between Hero and About.

Services section (`id="services"`) is hidden / commented out — superseded by the Process + Other Work sections.
