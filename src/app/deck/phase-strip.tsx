import { Bilingual } from './deck-i18n';

type Phase = 1 | 2 | 3;

const PILLS: { phase: Phase; en: string; zh: string }[] = [
  { phase: 1, en: '1 · Discovery', zh: '1 · 探索' },
  { phase: 2, en: '2 · Pilot', zh: '2 · Pilot' },
  { phase: 3, en: '3 · Run', zh: '3 · 持續進行' },
];

export function PhaseStrip({ active }: { active: Phase }) {
  return (
    <div className="phase-strip">
      {PILLS.map(({ phase, en, zh }) => (
        <span
          key={phase}
          className={phase === active ? 'pill active' : 'pill'}
        >
          <Bilingual en={en} zh={zh} />
        </span>
      ))}
    </div>
  );
}
