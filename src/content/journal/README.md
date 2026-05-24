# Adding a new journal entry

## 1. Create content files

Create a new folder under `src/content/journal/` with the entry's slug:

```
src/content/journal/<your-slug>/
  en.mdx
  zh.mdx
  assets/   (optional — co-located images)
```

## 2. Add the meta export

Each MDX file must start with an `export const meta` block:

```js
export const meta = {
  slug: "your-slug",              // must match the folder name
  num: "No. 002",                 // sequential entry number
  date: "2026-06-01",             // ISO date
  dateDisplay: "1 June 2026",     // human-readable (localized per file)
  title: "Your title here",
  dek: "One-sentence summary for the index card.",
  metaDescription: "SEO meta description.",
  author: "sean",                 // key from src/lib/journal/authors.ts
  leafEmphasis: "word",           // optional — substring of title to italicize on homepage leaf
  titleEmphasis: "word",          // optional — substring to italicize in the entry h1
}
```

Then write the body in standard markdown below the export. `## Heading` and `### Heading` map to the site's editorial styles automatically. `---` renders as a thin hairline rule.

## 3. Register the MDX imports

In `src/app/journal/[slug]/page.tsx`, add an entry to `mdxContentMap`:

```ts
"your-slug": {
  en: () => import("@/content/journal/your-slug/en.mdx"),
  zh: () => import("@/content/journal/your-slug/zh.mdx"),
},
```

That's it — the dynamic `[slug]` route, homepage journal section, and sitemap will pick it up automatically.

## Authors

Author data lives in `src/lib/journal/authors.ts`. Available keys: `sean`, `vincent`. Add new authors there with a `name`, `bio` (bilingual), and `avatar` path.

## Images

Co-locate images in an `assets/` folder next to the MDX files. Reference them in markdown relative to `public/` or use Next.js `<Image>` via MDX component imports.
