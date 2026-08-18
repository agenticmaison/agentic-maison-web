import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const OPEN_GRAPH_MESSAGE = [
  "Don't write an `openGraph` object inside src/app/.",
  'Next.js merges metadata shallowly, so a segment that exports `openGraph`',
  "*replaces* the parent's — a page that sets a card title and says nothing",
  'about `images` silently ships a blank card.',
  'Compose page metadata with `pageMetadata()` from',
  '`src/lib/metadata/page-metadata.ts` instead; it always supplies an image.',
  'A segment with its own `opengraph-image` file passes',
  "`ogImage: 'generated'`.",
].join(' ');

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The structural half of web-006. The helper makes the right thing easy;
    // this makes going around it an error rather than a silent regression.
    files: ['src/app/**/*.ts', 'src/app/**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "Property:matches([key.name='openGraph'], [key.value='openGraph'])",
          message: OPEN_GRAPH_MESSAGE,
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
