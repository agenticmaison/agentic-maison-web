/**
 * The Open Graph card must survive segment metadata.
 *
 * Two things are checked, and they are different in kind. The first group is
 * ordinary unit testing of `pageMetadata()`. The second walks `src/app/` and
 * asserts the properties Next's own merge algorithm depends on — that no page
 * hand-writes an `openGraph` object, and that the one opt-out from the site
 * card is only claimed by a directory that actually ships an
 * `opengraph-image` file. Those are the two ways a blank card comes back.
 *
 * Run with `pnpm test` (Node's built-in runner, with native TS stripping).
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pageMetadata, SITE_OG_IMAGE, siteDefaultMetadata } from './page-metadata.ts';

const APP_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../app'
);

// ---------------------------------------------------------------------------
// pageMetadata()
// ---------------------------------------------------------------------------

test('a page that says nothing about images still gets the site card', () => {
  const meta = pageMetadata({
    locale: 'en',
    path: '/digital',
    title: 'Digital Practice',
    description: 'A description.',
  });

  assert.deepEqual(meta.openGraph?.images, [SITE_OG_IMAGE]);
});

test('the card URL is absolute', () => {
  const meta = pageMetadata({
    locale: 'en',
    title: 'Home',
    description: 'A description.',
  });
  const [image] = meta.openGraph?.images as [typeof SITE_OG_IMAGE];

  assert.match(image.url, /^https:\/\//);
  assert.equal(image.width, 1200);
  assert.equal(image.height, 630);
});

test('the site defaults carry a card, for routes outside [locale]', () => {
  assert.deepEqual(siteDefaultMetadata.openGraph?.images, [SITE_OG_IMAGE]);
});

test("ogImage: 'generated' omits the images key rather than setting it undefined", () => {
  const meta = pageMetadata({
    locale: 'en',
    path: '/journal/a-slug',
    title: 'An entry',
    description: 'A description.',
    ogType: 'article',
    ogImage: 'generated',
  });

  // Next decides whether to apply a segment's `opengraph-image` file with
  // `hasOwnProperty('images')`, so an own key holding `undefined` would
  // suppress the generated card just as firmly as a real value.
  assert.equal(
    Object.prototype.hasOwnProperty.call(meta.openGraph, 'images'),
    false
  );
});

test('canonical, alternates and og:url are derived from one path', () => {
  const meta = pageMetadata({
    locale: 'zh',
    path: '/journal',
    title: '札記',
    description: 'A description.',
  });

  assert.equal(meta.alternates?.canonical, '/zh/journal');
  assert.equal(meta.alternates?.languages?.['zh-HK'], '/zh/journal');
  assert.equal(
    meta.openGraph?.url,
    'https://agenticmaison.com/zh/journal'
  );
});

test('twitter carries no images key, so Next fills it from openGraph', () => {
  const meta = pageMetadata({
    locale: 'en',
    title: 'Home',
    description: 'A description.',
  });

  assert.equal(
    Object.prototype.hasOwnProperty.call(meta.twitter, 'images'),
    false
  );
});

// ---------------------------------------------------------------------------
// The app directory
// ---------------------------------------------------------------------------

/** Every `page`/`layout` module under `src/app`, absolute paths. */
function routeModules(dir: string): string[] {
  const found: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...routeModules(full));
    } else if (/^(page|layout)\.tsx?$/.test(entry.name)) {
      found.push(full);
    }
  }
  return found;
}

test('no route module hand-writes an openGraph object', () => {
  const offenders = routeModules(APP_DIR).filter((file) =>
    /^\s*openGraph\s*:/m.test(fs.readFileSync(file, 'utf8'))
  );

  assert.deepEqual(
    offenders.map((f) => path.relative(APP_DIR, f)),
    [],
    'Compose metadata with pageMetadata() — a hand-written openGraph object ' +
      "replaces the parent's and drops the site image."
  );
});

test("ogImage: 'generated' is only claimed where an opengraph-image file exists", () => {
  const claimants = routeModules(APP_DIR).filter((file) =>
    /ogImage:\s*['"]generated['"]/.test(fs.readFileSync(file, 'utf8'))
  );

  for (const file of claimants) {
    const siblings = fs.readdirSync(path.dirname(file));
    assert.ok(
      siblings.some((name) => /^opengraph-image\./.test(name)),
      `${path.relative(APP_DIR, file)} opts out of the site card, but its ` +
        'segment has no opengraph-image file to replace it with.'
    );
  }
});
