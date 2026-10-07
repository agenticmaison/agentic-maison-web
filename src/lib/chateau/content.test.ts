import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { clientLogosBeat, roomCallouts, scenes, ui } from './content.ts';
import { beatOpacity } from './timeline.ts';

test('site animations do not branch on the reduced-motion preference', () => {
  const src = new URL('../../', import.meta.url);
  for (const path of readdirSync(src, { recursive: true, encoding: 'utf8' })) {
    if (!/\.(css|tsx?)$/.test(path) || path.endsWith('.test.ts')) continue;
    assert.doesNotMatch(
      readFileSync(new URL(path, src), 'utf8'),
      /prefers-reduced-motion/,
      path,
    );
  }
});

test('all six client logos have accessible names and available image assets', () => {
  assert.equal(ui.clients.length, 6);
  assert.equal(new Set(ui.clients.map((client) => client.src)).size, 6);
  for (const client of ui.clients) {
    assert.ok(client.name.trim());
    assert.ok(client.width > 0 && client.height > 0);
    assert.ok(statSync(new URL(`../../../public${client.src}`, import.meta.url)).size > 0);
  }
});

test('client logos fade before the hero copy and return on reverse scroll', () => {
  const positions = [0, 35, 47.5, 60, 90, 60, 47.5, 35, 0];
  assert.deepEqual(positions.map((vh) => beatOpacity(clientLogosBeat, vh)),
    [1, 1, 0.5, 0, 0, 0, 0.5, 1, 1]);
  assert.equal(beatOpacity(scenes[0].copy.beat, clientLogosBeat.exit[1]), 1);
});

test('every room label has valid desktop, tablet and mobile stage coordinates', () => {
  for (const room of roomCallouts) {
    assert.equal(room.callouts.length, 8);
    for (const label of room.callouts) {
      for (const [profile, width] of [['desktop', 18], ['tablet', 28], ['mobile', 36]] as const) {
        const [x, y] = label[profile];
        assert.ok(Number.isFinite(x) && x >= 0 && x + width <= 100, `${label.text}: ${profile} x`);
        assert.ok(Number.isFinite(y) && y >= 0 && y < 100, `${label.text}: ${profile} y`);
      }
    }
  }
});
