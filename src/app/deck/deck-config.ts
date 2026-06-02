/**
 * Slide visibility and numbering for /deck.
 * Add slide IDs to HIDDEN_SLIDES to exclude them from visible count + present mode.
 */
export const HIDDEN_SLIDES = new Set<number>([2]);

/**
 * DOM order is the source of truth for page numbering + present-mode nav.
 * `slidePos` numbers each visible slide by its POSITION in this array, not by
 * its numeric id — so this array order must match the `[data-slide]` order in
 * page.tsx. New slides carry higher ids (18 Agents, 20 Appendix divider) but
 * are placed at their real ordinal positions below.
 *
 * Order (aip-037): cover → who(hidden) → recent → AI-vs-agentic → Agents (18,
 * a single slide as of round 2) → process → phase 1–3 → thank-you → Appendix
 * divider (20) → 7 function slides (5–11).
 */
export const ALL_SLIDE_IDS = [
  1, 2, 3, 4, 18, 12, 13, 14, 15, 16, 17, 20, 5, 6, 7, 8, 9, 10, 11,
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
