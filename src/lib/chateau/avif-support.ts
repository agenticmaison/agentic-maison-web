/**
 * AVIF decode capability for the tour.
 *
 * The delivery frames are AVIF only — there is no WebP fallback set. A browser
 * that cannot decode AVIF must not fetch 504 frames it will fail on, so the
 * tour asks this first and falls back to the reduced-motion stills layout (the
 * posters are WebP) when the answer is no.
 *
 * The probe decodes a 2×2 AVIF data URI. Encode support (`canvas.toDataURL`)
 * is not the same question and is not asked.
 */

/** A 2×2 black AVIF still, 309 bytes. */
const PROBE =
  'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAAD5bWV0YQAAAAAAAAAvaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAFBpY3R1cmVIYW5kbGVyAAAAAA5waXRtAAAAAAABAAAAHmlsb2MAAAAARAAAAQABAAAAAQAAASEAAAAUAAAAKGlpbmYAAAAAAAEAAAAaaW5mZQIAAAAAAQAAYXYwMUNvbG9yAAAAAGppcHJwAAAAS2lwY28AAAAUaXNwZQAAAAAAAAACAAAAAgAAABBwaXhpAAAAAAMICAgAAAAMYXYxQ4EADAAAAAATY29scm5jbHgAAgACAAIAAAAAF2lwbWEAAAAAAAAAAQABBAECgwQAAAAcbWRhdAoFGAA2wCAyCx/wAABYAAAAAK8w';

let cached: Promise<boolean> | null = null;

/** Resolves true when the browser can decode an AVIF still. Probed once. */
export function detectAvifSupport(): Promise<boolean> {
  if (cached) return cached;
  cached = new Promise<boolean>((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(img.width === 2 && img.height === 2);
    img.onerror = () => resolve(false);
    img.src = PROBE;
  });
  return cached;
}
