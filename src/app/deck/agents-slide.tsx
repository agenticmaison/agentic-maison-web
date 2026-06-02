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
 * Bilingual (EN + ZH-Hant). Language visibility is toggled via `data-lang`
 * on `<html>` using the same `<span lang="en">` / `<span lang="zh">` pattern
 * used by the rest of the deck.
 *
 * Round 2 (operator): all 10 rows live on a single slide (id 18). No
 * italics anywhere; the column header row is dropped (rows are
 * self-describing); the 10 rows are spread to fill the cage evenly.
 */

type AgentRow = {
  nickname: string;
  plain: string;
  uses: string[];
  zh: {
    nickname: string;
    plain: string;
    uses: string[];
  };
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
    zh: {
      nickname: '企業智庫',
      plain: '全面掌握公司大小事',
      uses: [
        '知識庫',
        '入職培訓導師',
        '員工手冊',
        '自動填寫 CRM',
        '團隊集體記憶',
      ],
    },
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
    zh: {
      nickname: 'AI 文案專員',
      plain: '代勞所有訊息撰寫',
      uses: [
        '營銷文案',
        '冷啟動郵件',
        '事項跟進',
        '訊息回覆',
        '報價單',
        '企劃書',
      ],
    },
  },
  {
    nickname: 'Briefing assistant',
    plain: 'Gets you ready for the day',
    uses: ['morning brief', 'inbox summary', 'meeting prep'],
    zh: {
      nickname: '簡報助手',
      plain: '為你打點全日行程與準備',
      uses: ['晨間簡報', '收件箱摘要', '會議準備工作'],
    },
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
    zh: {
      nickname: '逾期事項跟進主任',
      plain: '追蹤及解決所有過期工作',
      uses: ['未付發票', '逾期供應商', '停滯交易', '續期提醒', '最後限期'],
    },
  },
  {
    nickname: 'Gatekeeper',
    plain: 'Sorts and ranks your inbox',
    uses: ['scores leads', 'screens CVs', 'filters emails'],
    zh: {
      nickname: '電郵篩選助手',
      plain: '自動過濾及整理收件箱',
      uses: ['潛在客戶評分', '篩選履歷', '郵件過濾'],
    },
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
    zh: {
      nickname: '資訊研究專員',
      plain: '助你搜羅及整理所需資料',
      uses: ['聯絡人搜尋', '供應商對比', '每日新聞摘要', '會議簡報'],
    },
  },
  {
    nickname: 'Matcher',
    plain: 'Matches things up for you',
    uses: ['payments to invoices', 'expenses', 'catches mismatches'],
    zh: {
      nickname: '對帳專員',
      plain: '精準對接各項單據與帳目',
      uses: ['收款對帳', '支出核對', '抓出錯誤帳目'],
    },
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
    zh: {
      nickname: '行政文件助手',
      plain: '代你處理各類表格及文件',
      uses: ['發票開立', '報價單', '月度報表', '董事會報告', '合規文件'],
    },
  },
  {
    nickname: 'Tracker',
    plain: 'Tracks your projects',
    uses: ['project tracker', 'quality checker', 'status answerer'],
    zh: {
      nickname: '項目進度主任',
      plain: '全程追蹤項目進度與質量',
      uses: ['項目進度追蹤', '品質監控', '進度查詢回覆'],
    },
  },
  {
    nickname: 'In-house analyst',
    plain: 'Helps you make decisions',
    uses: ['when to buy/sell', 'market timing', 'deal-matching'],
    zh: {
      nickname: '決策幕僚',
      plain: '助你分析時機，精準決策',
      uses: ['買賣時機分析', '市場走勢', '交易配對'],
    },
  },
];

function UseList({ uses }: { uses: string[] }) {
  return (
    <span className="agents-uses">
      {uses.map((use, i) => (
        <span className="agents-use-wrap" key={use}>
          <span className="agents-use">{use}</span>
          {i < uses.length - 1 ? (
            <span className="agents-sep" aria-hidden="true">
              {' '}
              ·{' '}
            </span>
          ) : null}
        </span>
      ))}
    </span>
  );
}

function AgentsTable({ rows }: { rows: AgentRow[] }) {
  return (
    <div className="agents-table" role="table" aria-label="Agents catalog">
      {rows.map((row) => (
        <div className="agents-row" role="row" key={row.nickname}>
          <span className="agents-cell agents-col-nick" role="cell">
            <b className="agents-nick">
              <span lang="en">{row.nickname}</span>
              <span lang="zh">{row.zh.nickname}</span>
            </b>
          </span>
          <span className="agents-cell agents-col-plain" role="cell">
            <span lang="en">{row.plain}</span>
            <span lang="zh">{row.zh.plain}</span>
          </span>
          <span className="agents-cell agents-col-uses" role="cell">
            <span lang="en">
              <UseList uses={row.uses} />
            </span>
            <span lang="zh">
              <UseList uses={row.zh.uses} />
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

const AGENTS_TITLE: ReactNode = (
  <>
    <span lang="en">
      Meet the <em>agents.</em>
    </span>
    <span lang="zh">
      <em>AI agents</em>
    </span>
  </>
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
