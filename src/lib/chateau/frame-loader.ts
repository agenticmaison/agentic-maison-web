/**
 * Frame loader for the tour.
 *
 * Holds one `HTMLImageElement` per fetched frame (compressed AVIF, ~37 MB for
 * the whole tour). Decoded pixels live in the browser's own image cache, which
 * is bounded and evicts on its own; the loader only asks for the frames just
 * ahead of and behind the current one to be decoded early, a bounded number
 * at a time. (An explicit `ImageBitmap` cache was tried first and crashed the
 * renderer under a fast scrub.) Requests are prioritised by distance from the
 * current frame, concurrency is bounded, obsolete queued work is dropped on
 * every new request, and a frame that fails is retried a bounded number of
 * times before being marked failed.
 */
import type { Scene } from './content';
import { FRAME_BASE } from './content';

export type FrameState = 'idle' | 'loading' | 'ready' | 'failed';

export interface LoaderOptions {
  /** Parallel fetches in flight. */
  concurrency?: number;
  /** How many frames either side of the current one get first priority. */
  window?: number;
  /** Fetch attempts per frame before it is marked failed. */
  attempts?: number;
}

interface Entry {
  url: string;
  state: FrameState;
  image: HTMLImageElement | null;
  attempts: number;
}

export class FrameLoader {
  readonly total: number;
  private readonly entries: Entry[];
  private readonly sceneStart: number[]; // global index of each scene's first frame
  private readonly sceneEnd: number[]; // exclusive
  private readonly concurrency: number;
  private readonly window: number;
  private readonly maxAttempts: number;
  private inFlight = 0;
  private queue: number[] = [];
  private current = 0;
  private decoded = new Set<number>();
  private disposed = false;
  private decoding = 0;
  private readonly maxDecoding = 4;
  private listeners = new Set<() => void>();

  constructor(scenes: Scene[], opts: LoaderOptions = {}) {
    this.concurrency = opts.concurrency ?? 6;
    this.window = opts.window ?? 36;
    this.maxAttempts = opts.attempts ?? 3;
    this.entries = [];
    this.sceneStart = [];
    this.sceneEnd = [];
    for (const scene of scenes) {
      this.sceneStart.push(this.entries.length);
      const ext = scene.manifest.pattern.slice(
        scene.manifest.pattern.lastIndexOf('.')
      );
      for (let i = 0; i < scene.manifest.count; i++) {
        const name = String(i).padStart(4, '0') + ext;
        this.entries.push({
          url: `${FRAME_BASE}/${scene.manifest.dir}/${name}`,
          state: 'idle',
          image: null,
          attempts: 0,
        });
      }
      this.sceneEnd.push(this.entries.length);
    }
    this.total = this.entries.length;
  }

  /** Called whenever a frame becomes ready or fails. */
  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    for (const fn of this.listeners) fn();
  }

  state(index: number): FrameState {
    return this.entries[index]?.state ?? 'failed';
  }

  /** Ready count within a scene, for the loader progress. */
  sceneProgress(sceneIndex: number): { ready: number; failed: number; total: number } {
    let ready = 0;
    let failed = 0;
    for (let i = this.sceneStart[sceneIndex]; i < this.sceneEnd[sceneIndex]; i++) {
      const s = this.entries[i].state;
      if (s === 'ready') ready++;
      else if (s === 'failed') failed++;
    }
    return { ready, failed, total: this.sceneEnd[sceneIndex] - this.sceneStart[sceneIndex] };
  }

  /** Queue a whole scene, nearest-first from its start. */
  requestScene(sceneIndex: number) {
    for (let i = this.sceneStart[sceneIndex]; i < this.sceneEnd[sceneIndex]; i++) {
      this.enqueue(i);
    }
    this.pump();
  }

  /**
   * Tell the loader where the visitor is. Re-orders the queue so the
   * requested frame and its neighbours load first, then everything after,
   * then everything before.
   */
  setCurrent(index: number) {
    this.current = index;
    const near: number[] = [];
    const after: number[] = [];
    const before: number[] = [];
    for (let d = 0; d <= this.window; d++) {
      const a = index + d;
      const b = index - d;
      if (a < this.total && this.entries[a].state === 'idle') near.push(a);
      if (d > 0 && b >= 0 && this.entries[b].state === 'idle') near.push(b);
    }
    for (let i = index + this.window + 1; i < this.total; i++) {
      if (this.entries[i].state === 'idle') after.push(i);
    }
    for (let i = index - this.window - 1; i >= 0; i--) {
      if (this.entries[i].state === 'idle') before.push(i);
    }
    this.queue = near.concat(after, before);
    this.pump();
  }

  private enqueue(index: number) {
    const e = this.entries[index];
    if (e.state !== 'idle') return;
    if (!this.queue.includes(index)) this.queue.push(index);
  }

  private pump() {
    if (this.disposed) return;
    while (this.inFlight < this.concurrency && this.queue.length > 0) {
      const index = this.queue.shift()!;
      const e = this.entries[index];
      if (e.state !== 'idle') continue;
      this.fetch(index);
    }
  }

  private fetch(index: number) {
    const e = this.entries[index];
    e.state = 'loading';
    e.attempts++;
    this.inFlight++;
    const img = new Image();
    img.decoding = 'async';
    const done = (ok: boolean) => {
      this.inFlight--;
      if (this.disposed) return;
      if (ok) {
        e.image = img;
        e.state = 'ready';
        this.emit();
      } else if (e.attempts < this.maxAttempts) {
        e.state = 'idle';
        const delay = 300 * 2 ** (e.attempts - 1);
        window.setTimeout(() => {
          if (this.disposed) return;
          // Retry near the front if the visitor is still close to it.
          if (Math.abs(index - this.current) <= this.window) this.queue.unshift(index);
          else this.queue.push(index);
          this.pump();
        }, delay);
      } else {
        e.state = 'failed';
        this.emit();
      }
      this.pump();
    };
    img.onload = () => done(true);
    img.onerror = () => done(false);
    img.src = e.url;
  }

  /**
   * The best drawable for a frame: the exact frame if ready, else the nearest
   * ready frame within the same scene, else null.
   */
  drawable(index: number): { source: CanvasImageSource; index: number } | null {
    const exact = this.entries[index];
    if (exact?.state === 'ready' && exact.image) {
      return { source: exact.image, index };
    }
    const scene = this.sceneOf(index);
    if (scene < 0) return null;
    const lo = this.sceneStart[scene];
    const hi = this.sceneEnd[scene];
    for (let d = 1; d < hi - lo; d++) {
      const a = index + d;
      const b = index - d;
      if (a < hi && this.entries[a].state === 'ready') return { source: this.entries[a].image!, index: a };
      if (b >= lo && this.entries[b].state === 'ready') return { source: this.entries[b].image!, index: b };
    }
    return null;
  }

  private sceneOf(index: number): number {
    for (let s = 0; s < this.sceneStart.length; s++) {
      if (index >= this.sceneStart[s] && index < this.sceneEnd[s]) return s;
    }
    return -1;
  }

  /**
   * Ask the browser to decode the frames just ahead of and behind `index`
   * so scrubbing does not stall on a decode. Bounded in flight; a fast scrub
   * simply skips warming until the decoder catches up.
   */
  warm(index: number, radius = 6) {
    for (let d = 0; d <= radius && this.decoding < this.maxDecoding; d++) {
      for (const i of d === 0 ? [index] : [index + d, index - d]) {
        if (i < 0 || i >= this.total || this.decoding >= this.maxDecoding) continue;
        const e = this.entries[i];
        if (e.state !== 'ready' || !e.image || this.decoded.has(i)) continue;
        if (typeof e.image.decode !== 'function') return;
        this.decoded.add(i);
        this.decoding++;
        e.image.decode().then(
          () => {
            this.decoding--;
          },
          () => {
            this.decoding--;
            this.decoded.delete(i);
          }
        );
      }
    }
    // The set is only a "has been asked" marker; keep it from growing without bound.
    if (this.decoded.size > 200) {
      for (const k of this.decoded) {
        if (Math.abs(k - index) > 60) this.decoded.delete(k);
      }
    }
  }

  dispose() {
    this.disposed = true;
    this.queue = [];
    this.decoded.clear();
    for (const e of this.entries) {
      if (e.image) {
        e.image.onload = null;
        e.image.onerror = null;
      }
      e.image = null;
    }
    this.listeners.clear();
  }
}
