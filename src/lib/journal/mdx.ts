/**
 * MDX content pipeline for journal entries.
 *
 * Reads the `src/content/journal/` directory at build time to discover
 * entries and extract metadata from MDX `export const meta` blocks.
 * Each entry has `en.mdx` and `zh.mdx` files with co-located assets.
 */

import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "src/content/journal");

/** Metadata exported from each MDX file's `export const meta`. */
export interface JournalMdxMeta {
  slug: string;
  num: string;
  date: string;
  dateDisplay: string;
  title: string;
  dek: string;
  metaDescription?: string;
  author: string;
  /** Substring of `title` to wrap in `<em>` on the landing-page leaf. */
  leafEmphasis?: string;
  /** Substring of `title` to wrap in `<em>` in the entry page h1. */
  titleEmphasis?: string;
}

/** Combined metadata for an entry (both languages merged). */
export interface JournalEntryData {
  slug: string;
  num: string;
  date: string;
  dateDisplay: { en: string; zh: string };
  title: { en: string; zh: string };
  dek: { en: string; zh: string };
  metaDescription: string;
  author: string;
}

/**
 * Get all journal entry slugs by scanning the content directory.
 */
export function getJournalSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

/**
 * Extract headings (h2, h3) from MDX content for table of contents.
 * Parses `## Heading` and `### Heading` from raw MDX text.
 */
export function extractHeadings(
  mdxContent: string
): { id: string; text: string; level: 2 | 3 }[] {
  const headings: { id: string; text: string; level: 2 | 3 }[] = [];
  const lines = mdxContent.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length as 2 | 3;
      const text = match[2].trim();
      // Generate slug matching rehype-slug behavior
      const id = text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      headings.push({ id, text, level });
    }
  }

  return headings;
}

/**
 * Read raw MDX file content for heading extraction.
 */
export function getRawMdxContent(slug: string, lang: "en" | "zh"): string {
  const filePath = path.join(CONTENT_DIR, slug, `${lang}.mdx`);
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf-8");
}

/**
 * Extract the `{ ... }` object literal that follows `export const meta =`.
 * Uses brace depth (not regex) so multi-line string values in `meta` parse correctly.
 */
function extractMetaObjectLiteral(source: string): string | null {
  const match = source.match(/export\s+const\s+meta\s*=\s*\{/);
  if (!match || match.index === undefined) return null;
  const openIdx = source.indexOf("{", match.index);
  if (openIdx === -1) return null;
  let depth = 0;
  for (let i = openIdx; i < source.length; i++) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return source.slice(openIdx, i + 1);
    }
  }
  return null;
}

/**
 * Parse `export const meta` from a journal MDX file at build time.
 * Evaluates the object literal (static data only — no user input).
 */
export function parseRawMeta(slug: string, lang: "en" | "zh"): JournalMdxMeta {
  const raw = getRawMdxContent(slug, lang);
  if (!raw.trim()) {
    throw new Error(`Journal MDX missing or empty: ${slug}/${lang}.mdx`);
  }
  const literal = extractMetaObjectLiteral(raw);
  if (!literal) {
    throw new Error(
      `Journal MDX has no export const meta block: ${slug}/${lang}.mdx`
    );
  }
  // Object literal is repo-controlled static content.
  return new Function(`return (${literal})`)() as JournalMdxMeta;
}
