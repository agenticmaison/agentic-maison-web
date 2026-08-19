/**
 * Issue numbers and displayed dates are derived, and must not move.
 *
 * Both were hand-written frontmatter until web-009 removed them. The values
 * asserted here are the exact strings the four published posts carried on the
 * day they stopped being written by hand, so a change in derivation — an
 * `Intl` default, a timezone, a locale tag — fails here rather than on a
 * published page.
 *
 * `Intl` is the risk this file exists to cover. A Node built without full ICU
 * silently formats `zh-Hant` as English, which is precisely the near-match that
 * would otherwise ship.
 *
 * Run with `pnpm test`.
 */

import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const FIXTURES = fs.mkdtempSync(path.join(os.tmpdir(), "web-009-journal-"));
process.env.JOURNAL_CONTENT_DIR = FIXTURES;
const mdx = await import("./mdx.ts");

test.after(() => fs.rmSync(FIXTURES, { recursive: true, force: true }));

/** The four published posts, oldest first — the order that numbers them. */
const PUBLISHED = [
  { date: "2026-05-05", en: "5 May 2026", zh: "2026年5月5日" },
  { date: "2026-05-19", en: "19 May 2026", zh: "2026年5月19日" },
  { date: "2026-05-20", en: "20 May 2026", zh: "2026年5月20日" },
  { date: "2026-05-23", en: "23 May 2026", zh: "2026年5月23日" },
];

test("displayed dates reproduce what the posts carried by hand", () => {
  for (const { date, en, zh } of PUBLISHED) {
    assert.equal(mdx.formatEntryDate(date, "en"), en);
    assert.equal(mdx.formatEntryDate(date, "zh"), zh);
  }
});

test("a bare date is not shifted by the machine's timezone", () => {
  // A `YYYY-MM-DD` is midnight UTC. Formatted in local time anywhere west of
  // Greenwich it prints the day before, which is how a derived date silently
  // disagrees with the one in the frontmatter.
  const previous = process.env.TZ;
  process.env.TZ = "America/Los_Angeles";
  try {
    assert.equal(mdx.formatEntryDate("2026-05-05", "en"), "5 May 2026");
    assert.equal(mdx.formatEntryDate("2026-05-05", "zh"), "2026年5月5日");
  } finally {
    process.env.TZ = previous;
  }
});

test("issue numbers count up from the oldest post, three digits wide", () => {
  assert.deepEqual(
    PUBLISHED.map((_, index) => mdx.formatIssueNumber(index)),
    ["No. 001", "No. 002", "No. 003", "No. 004"]
  );
  assert.equal(mdx.formatIssueNumber(99), "No. 100");
});

function writeEntry(slug: string, date: string): void {
  fs.mkdirSync(path.join(FIXTURES, slug), { recursive: true });
  fs.writeFileSync(
    path.join(FIXTURES, slug, "index.en.md"),
    [
      "---",
      `slug: "${slug}"`,
      `date: "${date}"`,
      'title: "A title"',
      'description: "A description."',
      'author: "sean"',
      "---",
      "",
      "Body text.",
      "",
    ].join("\n")
  );
}

test("a date the derivation cannot use fails the build, naming the file", () => {
  writeEntry("bad-date", "5 May 2026");
  assert.throws(
    () => mdx.parseRawMeta("bad-date", "en"),
    (error: Error) => {
      assert.match(error.message, /Journal content error/);
      assert.match(error.message, /index\.en\.md/);
      assert.match(error.message, /YYYY-MM-DD/);
      return true;
    }
  );
});

test("a date that looks right but is not a real day fails too", () => {
  writeEntry("impossible-date", "2026-02-30");
  assert.throws(
    () => mdx.parseRawMeta("impossible-date", "en"),
    /real calendar date/
  );
});

test("a well-formed entry parses to exactly the fields an editor owns", () => {
  writeEntry("good", "2026-06-01");
  const meta = mdx.parseRawMeta("good", "en");
  assert.deepEqual(Object.keys(meta).sort(), [
    "author",
    "date",
    "description",
    "slug",
    "title",
  ]);
});
