/**
 * Pure scroll-to-frame mapping for the tour. No DOM, so it is unit-tested.
 */
import type { CopyBeat, QuadKey, Scene, Segment } from './content';

export interface SceneRange {
  scene: Scene;
  /** Global vh at which this scene starts. */
  startVh: number;
  /** Total vh this scene occupies. */
  lengthVh: number;
  /** Global frame index of this scene's local frame 0. */
  frameOffset: number;
}

export interface Timeline {
  ranges: SceneRange[];
  totalVh: number;
  totalFrames: number;
}

export function buildTimeline(scenes: Scene[]): Timeline {
  let vh = 0;
  let frames = 0;
  const ranges: SceneRange[] = scenes.map((scene) => {
    const lengthVh = scene.segments.reduce((sum, s) => sum + s.vh, 0);
    const range = { scene, startVh: vh, lengthVh, frameOffset: frames };
    vh += lengthVh;
    frames += scene.manifest.count;
    return range;
  });
  return { ranges, totalVh: vh, totalFrames: frames };
}

export interface Sample {
  range: SceneRange;
  /** Local vh into the scene. */
  localVh: number;
  /** Local frame index, rounded. */
  localFrame: number;
  /** Local frame index, unrounded, for interpolating overlays. */
  localFrameExact: number;
  /** Global frame index. */
  frame: number;
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** Frame within one scene's segments. Half-open intervals; the final endpoint is included. */
export function localFrameAt(segments: Segment[], localVh: number): number {
  let start = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const end = start + seg.vh;
    const last = i === segments.length - 1;
    if (localVh < end || last) {
      const t = seg.vh === 0 ? 1 : clamp((localVh - start) / seg.vh, 0, 1);
      return seg.from + t * (seg.to - seg.from);
    }
    start = end;
  }
  return segments[segments.length - 1].to;
}

export function sampleAt(timeline: Timeline, scrollVh: number): Sample {
  const vh = clamp(scrollVh, 0, timeline.totalVh);
  let range = timeline.ranges[timeline.ranges.length - 1];
  for (const r of timeline.ranges) {
    if (vh < r.startVh + r.lengthVh) {
      range = r;
      break;
    }
  }
  const localVh = vh - range.startVh;
  const exact = localFrameAt(range.scene.segments, localVh);
  const maxLocal = range.scene.manifest.count - 1;
  const localFrame = clamp(Math.round(exact), 0, maxLocal);
  return {
    range,
    localVh,
    localFrame,
    localFrameExact: clamp(exact, 0, maxLocal),
    frame: range.frameOffset + localFrame,
  };
}

/** 0–1 opacity of a copy block at a local vh. Pure, so reverse scroll reconstructs it. */
export function beatOpacity(beat: CopyBeat, localVh: number): number {
  const [inStart, inEnd] = beat.enter;
  const [outStart, outEnd] = beat.exit;
  const rise = inEnd <= inStart ? (localVh >= inStart ? 1 : 0) : clamp((localVh - inStart) / (inEnd - inStart), 0, 1);
  const fall = outEnd <= outStart ? (localVh >= outStart ? 0 : 1) : 1 - clamp((localVh - outStart) / (outEnd - outStart), 0, 1);
  return Math.min(rise, fall);
}

/** Opacity of a tracked overlay from its visible window and feather, by local frame. */
export function windowOpacity(visible: [number, number], feather: number, frame: number): number {
  const [a, b] = visible;
  if (frame < a || frame > b) return 0;
  if (feather <= 0) return 1;
  const inRamp = clamp((frame - a) / feather, 0, 1);
  const outRamp = clamp((b - frame) / feather, 0, 1);
  return Math.min(inRamp, outRamp);
}

export type Quad = QuadKey['quad'];

/** Linear interpolation of a tracked quad at a local frame. Clamps to the outer keys. */
export function quadAt(keys: QuadKey[], frame: number): Quad {
  if (keys.length === 0) throw new Error('quadAt: no keys');
  if (frame <= keys[0].frame) return keys[0].quad;
  const last = keys[keys.length - 1];
  if (frame >= last.frame) return last.quad;
  for (let i = 1; i < keys.length; i++) {
    const k1 = keys[i];
    if (frame <= k1.frame) {
      const k0 = keys[i - 1];
      const t = (frame - k0.frame) / (k1.frame - k0.frame);
      return k0.quad.map((p, j) => [
        p[0] + (k1.quad[j][0] - p[0]) * t,
        p[1] + (k1.quad[j][1] - p[1]) * t,
      ]) as Quad;
    }
  }
  return last.quad;
}

/**
 * How a `width×height` frame is drawn to cover a `vw×vh` viewport:
 * scale plus the top-left offset of the drawn image in viewport pixels.
 */
export function coverFit(
  width: number,
  height: number,
  vw: number,
  vh: number,
  focus: [number, number] = [0.5, 0.5]
): { scale: number; x: number; y: number } {
  const scale = Math.max(vw / width, vh / height);
  // The overflow on each axis is distributed by the focus point: 0.5 centres,
  // 0.7 keeps a subject on the right in view when the sides are cropped.
  return {
    scale,
    x: (vw - width * scale) * focus[0],
    y: (vh - height * scale) * focus[1],
  };
}

/** Global vh at which a scene's copy is fully in, for the Next buttons. */
export function copyReadyVh(range: SceneRange): number {
  return range.startVh + range.scene.copy.beat.enter[1] + 2;
}

/**
 * CSS `matrix3d` mapping an element of size `w×h` (origin top-left) onto a
 * quad given in pixels. Standard unit-square → quadrilateral projective map.
 */
export function quadToMatrix3d(
  w: number,
  h: number,
  quad: [[number, number], [number, number], [number, number], [number, number]]
): string {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = quad;
  // Map unit square to quad (order: TL, TR, BR, BL).
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;
  const det = dx1 * dy2 - dx2 * dy1;
  const g = det === 0 ? 0 : (dx3 * dy2 - dx2 * dy3) / det;
  const hh = det === 0 ? 0 : (dx1 * dy3 - dx3 * dy1) / det;
  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + hh * x3;
  const c = x0;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + hh * y3;
  const f = y0;
  // Pre-scale from element pixels to the unit square.
  const sx = 1 / w;
  const sy = 1 / h;
  const m = [
    a * sx, d * sx, 0, g * sx,
    b * sy, e * sy, 0, hh * sy,
    0, 0, 1, 0,
    c, f, 0, 1,
  ];
  return `matrix3d(${m.map((v) => (Math.abs(v) < 1e-9 ? 0 : v.toFixed(6))).join(',')})`;
}
