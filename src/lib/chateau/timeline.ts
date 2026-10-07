/**
 * Pure scroll-to-frame mapping for the tour. No DOM, so it is unit-tested.
 */
import type { CopyBeat, Scene, Segment } from './content';

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
