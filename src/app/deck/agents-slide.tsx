import type { ReactNode } from 'react';
import { DeckSlide } from './deck-slide';
import { slidePos } from './deck-config';

/**
 * Agents overview — the personified agent catalog rendered as a client-safe
 * table (aip-037). Columns: Nickname · Function · Called, by use.
 *
 * CLIENT-FACING SURFACE. The internal agent catalog
 * (areas/agentic-maison/ai/materials/agent-catalog.md) is internal-only:
 * this slide carries ONLY the plain-name layer. No A#/V# IDs, no
 * archetype/umbrella/horizontal/vertical/bespoke wording, no [client] tags.
 * Strings here are verbatim from the PRD's "Slide content" table.
 *
 * English-only for this slide + the appendix divider (the rest of the deck
 * is bilingual; zh is a later pass). Nicknames stay roman.
 *
 * Round 2 (operator): all 10 rows live on a single slide (id 18). No
 * italics anywhere; the column header row is dropped (rows are
 * self-describing); the 10 rows are spread to fill the cage evenly.
 */

type AgentRow = {
  nickname: string;
  plain: string;
  uses: string[];
};

const AGENTS: AgentRow[] = [
  {
    nickname: 'Company brain',
    plain: 'Knows everything about your company',
    uses: [
      'knowledge base',
      'onboarding mentor',
      'employee handbook',
      'self-filling CRM',
      'team memory',
    ],
  },
  {
    nickname: 'AI writer',
    plain: 'Writes your messages',
    uses: [
      'marketing copy',
      'cold outreach',
      'follow-ups',
      'replies',
      'quotes',
      'proposals',
    ],
  },
  {
    nickname: 'Briefing assistant',
    plain: 'Gets you ready for the day',
    uses: ['morning brief', 'inbox summary', 'meeting prep'],
  },
  {
    nickname: 'Watchdog',
    plain: 'Chases down overdue tasks',
    uses: [
      'unpaid invoices',
      'late suppliers',
      'stale deals',
      'renewals',
      'deadlines',
    ],
  },
  {
    nickname: 'Gatekeeper',
    plain: 'Sorts and ranks your inbox',
    uses: ['scores leads', 'screens CVs', 'filters emails'],
  },
  {
    nickname: 'Researcher',
    plain: 'Looks things up for you',
    uses: [
      'contact finder',
      'supplier comparison',
      'news digest',
      'pre-meeting one-pager',
    ],
  },
  {
    nickname: 'Matcher',
    plain: 'Matches things up for you',
    uses: ['payments to invoices', 'expenses', 'catches mismatches'],
  },
  {
    nickname: 'Report filler',
    plain: 'Fills outs your documents',
    uses: [
      'invoices',
      'quotes',
      'monthly reports',
      'board updates',
      'compliance documents',
    ],
  },
  {
    nickname: 'Tracker',
    plain: 'Tracks your projects',
    uses: ['project tracker', 'quality checker', 'status answerer'],
  },
  {
    nickname: 'In-house analyst',
    plain: 'Helps you make decisions',
    uses: ['when to buy/sell', 'market timing', 'deal-matching'],
  },
];

function AgentsTable({ rows }: { rows: AgentRow[] }) {
  return (
    <div className="agents-table" role="table" aria-label="Agents catalog">
      {rows.map((row) => (
        <div className="agents-row" role="row" key={row.nickname}>
          <span className="agents-cell agents-col-nick" role="cell">
            <b className="agents-nick">{row.nickname}</b>
          </span>
          <span className="agents-cell agents-col-plain" role="cell">
            {row.plain}
          </span>
          <span className="agents-cell agents-col-uses" role="cell">
            <span className="agents-uses">
              {row.uses.map((use, i) => (
                <span className="agents-use-wrap" key={use}>
                  <span className="agents-use">{use}</span>
                  {i < row.uses.length - 1 ? (
                    <span className="agents-sep" aria-hidden="true">
                      {' '}
                      ·{' '}
                    </span>
                  ) : null}
                </span>
              ))}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

const AGENTS_TITLE: ReactNode = (
  <span lang="en">
    Meet the <em>agents.</em>
  </span>
);

/** Agents overview slide (id 18) — the full 10-row roster (Ernest → Nate). */
export function AgentsSlideA({ total }: { total: number }) {
  return (
    <DeckSlide
      id={18}
      extraClass="agents-slide"
      position={slidePos(18)}
      total={total}
      title={AGENTS_TITLE}
    >
      <AgentsTable rows={AGENTS} />
    </DeckSlide>
  );
}
