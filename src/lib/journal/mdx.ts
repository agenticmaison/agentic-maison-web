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

function isValidFaqJsonLd(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return record["@type"] === "FAQPage" && Array.isArray(record.mainEntity);
}

/**
 * Load FAQ JSON-LD for a journal entry when `faq-<lang>.json` exists.
 * Returns null when the file is missing or fails schema sanity checks.
 */
export function getFaqJsonLd(
  slug: string,
  lang: "en" | "zh"
): Record<string, unknown> | null {
  const filePath = path.join(CONTENT_DIR, slug, `faq-${lang}.json`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (isValidFaqJsonLd(parsed)) return parsed;
    console.warn(
      `Invalid FAQ JSON-LD schema (expected FAQPage with mainEntity[]): ${slug}/faq-${lang}.json`
    );
    return null;
  } catch {
    console.warn(`Failed to parse FAQ JSON-LD: ${slug}/faq-${lang}.json`);
    return null;
  }
}

/**
 * Fail fast at build time when content slugs are missing from the MDX import
 * registry. React-component MDX requires statically analyzable imports.
 */
export function assertMdxRegistryComplete(
  slugs: readonly string[],
  registry: Record<string, unknown>
): void {
  const missing = slugs.filter((slug) => !(slug in registry));
  if (missing.length > 0) {
    throw new Error(
      `Journal MDX import registry is missing entries for: ${missing.join(", ")}. ` +
        "Add them to mdxContentMap in src/app/[locale]/journal/[slug]/page.tsx."
    );
  }
}
