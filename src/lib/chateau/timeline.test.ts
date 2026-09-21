import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scenes } from './content.ts';
import {
  beatOpacity,
  buildTimeline,
  copyReadyVh,
  coverFit,
  localFrameAt,
  sampleAt,
} from './timeline.ts';

const timeline = buildTimeline(scenes);

test('the tour is 670 vh and 504 frames', () => {
  assert.equal(timeline.totalVh, 670);
  assert.equal(timeline.totalFrames, 504);
});

test('scene allocations match the approved pacing', () => {
  const lengths = timeline.ranges.map((r) => r.lengthVh);
  assert.deepEqual(lengths, [200, 170, 150, 150]);
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
  for (let vh = 0; vh <= 670; vh += 0.5) {
    const s = sampleAt(timeline, vh);
    assert.ok(s.frame >= prev, `frame went backwards at ${vh}vh`);
    prev = s.frame;
  }
  assert.equal(sampleAt(timeline, 670).frame, 503);
  assert.equal(sampleAt(timeline, 5000).frame, 503);
  assert.equal(sampleAt(timeline, -5).frame, 0);
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

test('each Next target lands after the next copy block has fully entered', () => {
  for (let i = 1; i < timeline.ranges.length; i++) {
    const r = timeline.ranges[i];
    const target = copyReadyVh(r);
    const s = sampleAt(timeline, target);
    assert.equal(s.range.scene.id, r.scene.id);
    assert.equal(beatOpacity(r.scene.copy.beat, s.localVh), 1);
  }
});
