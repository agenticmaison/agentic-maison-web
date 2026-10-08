import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brainCallouts, roomCallouts, scenes } from './content.ts';
import {
  beatOpacity,
  buildTimeline,
  copyReadyVh,
  coverFit,
  localFrameAt,
  sampleAt,
} from './timeline.ts';

const timeline = buildTimeline(scenes);

test('the tour is 880 vh and 504 frames', () => {
  assert.equal(timeline.totalVh, 880);
  assert.equal(timeline.totalFrames, 504);
});

test('scene allocations match the approved pacing', () => {
  const lengths = timeline.ranges.map((r) => r.lengthVh);
  assert.deepEqual(lengths, [200, 240, 220, 220]);
});

test('every scene ends on its last frame and starts on frame 0', () => {
  for (const r of timeline.ranges) {
    const first = r.scene.segments[0];
    const last = r.scene.segments[r.scene.segments.length - 1];
    assert.equal(first.from, 0, r.scene.id);
    assert.equal(last.to, r.scene.manifest.count - 1, r.scene.id);
  }
});

test('adjacent segments share their endpoint frame', () => {
  for (const r of timeline.ranges) {
    const segs = r.scene.segments;
    for (let i = 1; i < segs.length; i++) {
      assert.equal(segs[i].from, segs[i - 1].to, `${r.scene.id} segment ${i}`);
    }
  }
});

test('a hold maps its whole interval to one frame', () => {
  const exterior = scenes[0].segments;
  assert.equal(localFrameAt(exterior, 60), 48);
  assert.equal(localFrameAt(exterior, 75), 48);
  assert.equal(localFrameAt(exterior, 89.9), 48);
});

test('the mapping is monotonic and reaches the final frame', () => {
  let prev = -1;
  for (let vh = 0; vh <= timeline.totalVh; vh += 0.5) {
    const s = sampleAt(timeline, vh);
    assert.ok(s.frame >= prev, `frame went backwards at ${vh}vh`);
    prev = s.frame;
  }
  assert.equal(sampleAt(timeline, timeline.totalVh).frame, 503);
  assert.equal(sampleAt(timeline, 5000).frame, 503);
  assert.equal(sampleAt(timeline, -5).frame, 0);
});

test('eight brain callouts stagger in, linger and fade out together during the still hold', () => {
  const foyer = scenes.find((scene) => scene.id === 'foyer')!;
  assert.equal(brainCallouts.length, 8);
  assert.equal(localFrameAt(foyer.segments, 55), 42);
  assert.equal(localFrameAt(foyer.segments, 154.9), 42);
  assert.ok(localFrameAt(foyer.segments, 156) > 42);
  assert.deepEqual(brainCallouts.map((callout) => beatOpacity(callout.beat, 63)), [1, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(brainCallouts.map((callout) => beatOpacity(callout.beat, 68)), [1, 1, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(brainCallouts.map((callout) => beatOpacity(callout.beat, 78)), [1, 1, 1, 1, 0, 0, 0, 0]);
  assert.deepEqual(brainCallouts.map((callout) => beatOpacity(callout.beat, 83)), [1, 1, 1, 1, 1, 0, 0, 0]);
  for (const callout of brainCallouts) {
    assert.equal(beatOpacity(callout.beat, 100), 1);
    assert.equal(beatOpacity(callout.beat, 136), 1);
    assert.equal(beatOpacity(callout.beat, 146), 0.5);
    for (const vh of [...callout.beat.enter, ...callout.beat.exit]) {
      assert.equal(localFrameAt(foyer.segments, vh), 42);
      assert.equal(beatOpacity(foyer.copy.beat, vh), 1);
    }
    assert.equal(beatOpacity(callout.beat, 55), 0);
    assert.equal(beatOpacity(callout.beat, 155), 0);
  }
});

test('robot rooms reveal left first on a 100 vh still, then fade together before movement', () => {
  for (const group of roomCallouts) {
    const scene = scenes.find((scene) => scene.id === group.sceneId)!;
    const holdFrame = group.sceneId === 'decision-support' ? 54 : 48;
    assert.deepEqual(scene.segments[2], { vh: 100, from: holdFrame, to: holdFrame });
    assert.equal(group.callouts.length, 8);
    for (const vh of [35, 43, 58, 63, 78, 116, 124.5, 132, 135, 124.5, 78, 63, 58, 43, 35]) {
      assert.equal(localFrameAt(scene.segments, vh), holdFrame);
      assert.equal(beatOpacity(scene.copy.beat, vh), 1);
      const expected = group.callouts.map((_, i) =>
        vh <= 38 + i * 5 ? 0 : vh < 43 + i * 5 ? (vh - 38 - i * 5) / 5 :
          vh <= 117 ? 1 : vh < 132 ? (132 - vh) / 15 : 0
      );
      assert.deepEqual(group.callouts.map((callout) => beatOpacity(callout.beat, vh)), expected);
    }
    assert.ok(localFrameAt(scene.segments, 136) > holdFrame);
    assert.equal(beatOpacity(scene.copy.beat, 140), 1);
    assert.equal(beatOpacity(scene.copy.beat, 155), 0);
  }
});

test('scene boundaries cut to the next scene at its first frame', () => {
  const foyer = timeline.ranges[1];
  const before = sampleAt(timeline, foyer.startVh - 0.01);
  const at = sampleAt(timeline, foyer.startVh);
  assert.equal(before.range.scene.id, 'exterior');
  assert.equal(before.localFrame, 143);
  assert.equal(at.range.scene.id, 'foyer');
  assert.equal(at.localFrame, 0);
});

test('copy opacity ramps and is a pure function of position', () => {
  const beat = { enter: [60, 85] as [number, number], exit: [140, 165] as [number, number] };
  assert.equal(beatOpacity(beat, 0), 0);
  assert.equal(beatOpacity(beat, 60), 0);
  assert.ok(Math.abs(beatOpacity(beat, 72.5) - 0.5) < 1e-9);
  assert.equal(beatOpacity(beat, 100), 1);
  assert.equal(beatOpacity(beat, 165), 0);
  // An instant entry (hero) is visible from 0.
  assert.equal(beatOpacity({ enter: [0, 0], exit: [150, 175] }, 0), 1);
});

test('cover fit centres by default and honours a focus point', () => {
  // Portrait viewport over a landscape frame: only x overflows.
  const c = coverFit(1280, 720, 390, 844);
  assert.ok(Math.abs(c.y) < 1e-6);
  assert.ok(c.x < 0);
  const f = coverFit(1280, 720, 390, 844, [0.7, 0.5]);
  assert.ok(f.x < c.x, 'a right-hand focus shifts the image further left');
  const l = coverFit(1280, 720, 390, 844, [0, 0.5]);
  assert.equal(Math.abs(l.x), 0);
});

test('each Next target lands with the heading and every callout fully visible on the still hold', () => {
  for (let i = 1; i < timeline.ranges.length; i++) {
    const r = timeline.ranges[i];
    const target = copyReadyVh(r);
    const s = sampleAt(timeline, target);
    assert.equal(s.range.scene.id, r.scene.id);
    assert.equal(beatOpacity(r.scene.copy.beat, s.localVh), 1);
    const callouts = r.scene.id === 'foyer'
      ? brainCallouts
      : roomCallouts.find((group) => group.sceneId === r.scene.id)!.callouts;
    for (const callout of callouts) {
      assert.equal(beatOpacity(callout.beat, s.localVh), 1, `${r.scene.id}: ${callout.text}`);
    }
    assert.equal(localFrameAt(r.scene.segments, s.localVh - 1), s.localFrame);
    assert.equal(localFrameAt(r.scene.segments, s.localVh + 1), s.localFrame);
  }
});
