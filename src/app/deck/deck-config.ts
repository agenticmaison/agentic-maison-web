/**
 * Slide visibility and numbering for /deck.
 * Add slide IDs to HIDDEN_SLIDES to exclude them from visible count + present mode.
 */
export const HIDDEN_SLIDES = new Set<number>([2]);

export const ALL_SLIDE_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
] as const;

export const visibleSlideIds: number[] = ALL_SLIDE_IDS.filter(
  (id) => !HIDDEN_SLIDES.has(id)
);

export const DECK_TOTAL = visibleSlideIds.length;

export function slidePos(id: number): number {
  return visibleSlideIds.indexOf(id) + 1;
}

export function slideClass(id: number, extra = ''): string {
  return ['slide', extra, HIDDEN_SLIDES.has(id) ? '!hidden' : '']
    .filter(Boolean)
    .join(' ');
}
