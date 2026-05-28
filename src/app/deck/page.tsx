import Link from 'next/link';
import { DeckControls } from './deck-controls';
import { localePath } from '@/i18n/paths';

/**
 * Add slide IDs here to exclude them from the visible deck.
 * Page numbers and totals recalculate automatically.
 */
const HIDDEN_SLIDES = new Set<number>([2]);

const ALL_SLIDE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const visibleSlideIds = ALL_SLIDE_IDS.filter((id) => !HIDDEN_SLIDES.has(id));
const total = visibleSlideIds.length;
const slidePos = (id: number) => visibleSlideIds.indexOf(id) + 1;
const slideClass = (id: number, extra = '') =>
  ['slide', extra, HIDDEN_SLIDES.has(id) ? '!hidden' : '']
    .filter(Boolean)
    .join(' ');

/**
 * /deck — AI Practice pitch deck.
 *
 * Ported 1:1 from `.scratch/deck-mocks/presentation.html` (approved by
 * operator on 2026-05-18, fourth revision pass). Visual + behavioral
 * parity with the mock; only difference is wiring to Next.js's font
 * variables + tailwind tokens via deck.css.
 *
 * NOT wrapped in SheetShell — a deck doesn't want the site's sticky nav
 * band covering slides. Minimal control strip (brand + theme + lang +
 * present) lives inline here.
 *
 * Gated by src/proxy.ts (cookie `am-deck=open`, set by the unlock route's
 * server action). Marked noindex via src/app/deck/layout.tsx metadata.
 *
 * The cqi-based layout means everything inside each .slide scales from
 * the slide's own dimensions. Resize from phone-narrow to 34" full-screen
 * and the slide composition reads identically.
 */
export default function DeckPage() {
  return (
    <>
      <header className="deck-topbar" role="banner">
        <div>
          <Link href={localePath('en', '/')} className="deck-brand">
            <b>Agentic</b>
            <span className="diamond" aria-hidden="true" />
            <i>Maison</i>
          </Link>
          <span className="doctype">
            <span lang="en">AI Practice · Presentation</span>
            <span lang="zh">AI 實務 · 簡報</span>
          </span>
        </div>
        <nav className="deck-controls" aria-label="Deck controls">
          <span className="group" role="group" aria-label="Theme">
            <button type="button" data-theme-btn="light">
              <span lang="en">Light</span>
              <span lang="zh">淺色</span>
            </button>
            <span className="sep">/</span>
            <button type="button" data-theme-btn="dark">
              <span lang="en">Dark</span>
              <span lang="zh">深色</span>
            </button>
          </span>
          <span className="group" role="group" aria-label="Language">
            <button type="button" data-lang-btn="en">
              EN
            </button>
            <span className="sep">/</span>
            <button type="button" data-lang-btn="zh">
              中文
            </button>
          </span>
        </nav>
        <button type="button" className="present-btn" data-present>
          <span lang="en">Present →</span>
          <span lang="zh">簡報 →</span>
        </button>
      </header>

      <main className="deck" id="deck">
        {/* Slide 1 — Cover (vertically centered) */}
        <article className={slideClass(1, 'slide-cover')} data-slide="1">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-body">
            <div className="cover-block">
              <h1 className="slide-title">
                Agentic · <em>Maison</em>
              </h1>
              <p className="cover-lede">
                <span lang="en">
                  Building specialized agents that handle the work your team
                  repeats. Commissioned for your business. Operate across your
                  tools. Deliver artifacts immediately.
                </span>
                <span lang="zh">
                  打造專屬智能體，處理團隊反覆執行的工作。為你的業務訂製。在你現有的工具間運作。即時交付成果。
                </span>
              </p>
              <p className="cover-date">
                <span lang="en">Updated on May 20 2026</span>
                <span lang="zh">更新於 2026 年 5 月 20 日</span>
              </p>
            </div>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>{slidePos(1)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 2 — Who we are */}
        <article className={slideClass(2)} data-slide="2">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                Who <em>we are.</em>
              </span>
              <span lang="zh">
                關於<em>我們。</em>
              </span>
            </h2>
          </div>
          <div className="slide-body who-body">
            <div className="who-portraits">
              {/*
                PORTRAIT PLACEHOLDERS — operator swaps these later.
                To use a real photo, replace the <span className="who-photo">
                block with:
                  <img className="who-photo" src="/assets/team/sean.jpg"
                       alt="Sean, Principal" />
                Keep the 4:5 portrait aspect (drop files cropped to 4:5) and
                the surrounding <figure className="who-portrait"> + caption.
              */}
              <figure className="who-portrait">
                <img
                  className="who-photo"
                  src="/assets/team/sean.png"
                  alt="Sean"
                />
                <figcaption>
                  <span className="who-name">Sean</span>
                </figcaption>
              </figure>
              <figure className="who-portrait">
                <img
                  className="who-photo"
                  src="/assets/team/vincent.png"
                  alt="Vincent"
                />
                <figcaption>
                  <span className="who-name">Vincent</span>
                </figcaption>
              </figure>
            </div>
            <ul className="who-bullets">
              <li>
                <span>
                  <span lang="en">
                    <b>A practice, not a platform.</b> Commissioned work for a
                    small number of operators at any one time.
                  </span>
                  <span lang="zh">
                    <b>實務，而非平台。</b>
                    同一時間只承接少數營運者的委託項目。
                  </span>
                </span>
              </li>
              <li>
                <span>
                  <span lang="en">
                    <b>Principal-led.</b> Sean leads every engagement end-to-end
                    — discovery, build, and operation.
                  </span>
                  <span lang="zh">
                    <b>Principal 親自帶領。</b>
                    Sean 全程主導每個項目——探索、建置與營運。
                  </span>
                </span>
              </li>
              <li>
                <span>
                  <span lang="en">
                    <b>Builders who ship.</b> Background in production AI
                    systems, not slideware.
                  </span>
                  <span lang="zh">
                    <b>能交付的建置者。</b>
                    背景在生產級 AI 系統，而非簡報包裝。
                  </span>
                </span>
              </li>
              <li>
                <span>
                  <span lang="en">
                    <b>Operator empathy.</b> We&rsquo;ve run the businesses we
                    now build for — we know which work is worth automating and
                    which isn&rsquo;t.
                  </span>
                  <span lang="zh">
                    <b>理解營運者。</b>
                    我們曾經營過現今服務的業務——知道哪些工作值得自動化，哪些不值得。
                  </span>
                </span>
              </li>
            </ul>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>{slidePos(2)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 3 — Recent advancements in AI */}
        <article className={slideClass(3)} data-slide="3">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                Recent developments in <em>AI</em>
              </span>
              <span lang="zh">
                AI 的<em>最新發展</em>
              </span>
            </h2>
          </div>
          <div className="slide-body recent-body">
            <div className="axis recent-timeline">
              <div className="axis-step">
                <span className="when">Nov 2022</span>
                <span className="what">
                  <span lang="en">ChatGPT arrives.</span>
                  <span lang="zh">ChatGPT 問世。</span>
                </span>
                <p className="why">
                  <span lang="en">
                    Language models prove out at scale; the public starts paying
                    attention.
                  </span>
                  <span lang="zh">
                    語言模型在大規模上得到驗證；公眾開始關注。
                  </span>
                </p>
              </div>
              <div className="axis-step">
                <span className="when">
                  <span lang="en">Early 2024</span>
                  <span lang="zh">2024 年初</span>
                </span>
                <span className="what">
                  <span lang="en">Tool use &amp; vibe coding.</span>
                  <span lang="zh">工具使用與 vibe coding。</span>
                </span>
                <p className="why">
                  <span lang="en">
                    Models start taking actions, not just generating text — and
                    &ldquo;vibe coding&rdquo; lets non-engineers ship working
                    software in plain language.
                  </span>
                  <span lang="zh">
                    模型開始執行動作，而不只是生成文字——「vibe
                    coding」讓非工程師也能用自然語言交付可用的軟件。
                  </span>
                </p>
              </div>
              <div className="axis-step">
                <span className="when">
                  <span lang="en">Late 2025</span>
                  <span lang="zh">2025 年底</span>
                </span>
                <span className="what">OpenClaw.</span>
                <p className="why">
                  <span lang="en">
                    An open-source agent runtime any business can run and own.
                  </span>
                  <span lang="zh">
                    開源智能體運行環境，任何企業都能自行部署與擁有。
                  </span>
                </p>
              </div>
              <div className="axis-step">
                <span className="when">
                  <span lang="en">April 2026</span>
                  <span lang="zh">2026 年 4 月</span>
                </span>
                <span className="what">
                  <span lang="en">Enterprise agent infrastructure.</span>
                  <span lang="zh">企業級智能體基礎設施。</span>
                </span>
                <p className="why">
                  <span lang="en">
                    Cloudflare and Google ship production-grade agent stacks.
                    The tooling is now enterprise-ready.
                  </span>
                  <span lang="zh">
                    Cloudflare 與 Google
                    推出生產級智能體堆疊。工具鏈已具備企業級就緒度。
                  </span>
                </p>
              </div>
            </div>

            {/*
              VIDEO PLACEHOLDER — operator swaps in the real clip later.
              Drop the .mp4 at public/assets/video/recent-developments.mp4
              (self-hosted; clip sourced from the X post in the PRD). No
              third-party embed or widgets.js — the deck must play offline.

              The <video> already points at the final path. Until the file
              exists the browser shows the styled placeholder frame below
              (corner ticks + brass play glyph via the .recent-video chrome).
              To swap: just drop the file in — nothing here needs to change.
              Optional: add a poster still at the same folder and set
              poster="/assets/video/recent-developments.jpg".
            */}
            <figure className="recent-video">
              <div className="recent-video-frame">
                <video
                  className="recent-video-el"
                  controls
                  preload="metadata"
                  playsInline
                  src="/assets/video/recent-developments.mp4"
                >
                  Your browser does not support the video tag.
                </video>
                <span className="recent-video-mark" aria-hidden="true">
                  <svg viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="15" />
                    <path d="M20 17l11 7-11 7z" />
                  </svg>
                </span>
              </div>
              <figcaption>
                <span lang="en">The state of agentic AI, in one minute.</span>
                <span lang="zh">一分鐘了解智能體 AI 的現況。</span>
              </figcaption>
            </figure>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>{slidePos(3)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 4 — Sample business deliverables */}
        <article className={slideClass(4)} data-slide="4">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                Sample business <em>deliverables.</em>
              </span>
              <span lang="zh">
                業務<em>交付範例。</em>
              </span>
            </h2>
          </div>
          <div className="slide-body">
            <div className="uses-stack">
              <div className="uses-row row-4">
                <div className="cell">
                  <span className="ord">01</span>
                  <span className="label">
                    <span lang="en">Company brain</span>
                    <span lang="zh">企業知識庫</span>
                  </span>
                  <p className="desc">
                    <span lang="en">
                      Keep team processes and decisions in sync with one source
                      of truth.
                    </span>
                    <span lang="zh">
                      把公司的工作方式、決策紀錄集中在同一個地方,讓所有人查閱同一份資料。
                    </span>
                  </p>
                </div>
                <div className="cell">
                  <span className="ord">02</span>
                  <span className="label">
                    <span lang="en">Staff productivity reports</span>
                    <span lang="zh">員工效率報告</span>
                  </span>
                  <p className="desc">
                    <span lang="en">
                      Automated visibility into where time is going; replaces
                      manual tracking.
                    </span>
                    <span lang="zh">自動化追蹤工時分配,取代手動記錄。</span>
                  </p>
                </div>
                <div className="cell">
                  <span className="ord">03</span>
                  <span className="label">
                    <span lang="en">Employee handbook assistant</span>
                    <span lang="zh">員工手冊助手</span>
                  </span>
                  <p className="desc">
                    <span lang="en">
                      Dedicated agent answering repeated questions; saves HR
                      time.
                    </span>
                    <span lang="zh">
                      專屬 AI Agent 回答重複性問題,節省 HR 時間。
                    </span>
                  </p>
                </div>
                <div className="cell">
                  <span className="ord">04</span>
                  <span className="label">
                    <span lang="en">Onboarding &amp; offboarding</span>
                    <span lang="zh">入職與離職管理</span>
                  </span>
                  <p className="desc">
                    <span lang="en">
                      Automate orientation, knowledge transfer, and exit
                      interviews.
                    </span>
                    <span lang="zh">入職與離職管理</span>
                  </p>
                </div>
              </div>
              <div className="uses-row row-3">
                <div className="cell">
                  <span className="ord">05</span>
                  <span className="label">
                    <span lang="en">Competitive intelligence dossiers</span>
                    <span lang="zh">競品分析報告</span>
                  </span>
                  <p className="desc">
                    <span lang="en">
                      Regular scans of competitor moves and market signals
                      delivered on cadence.
                    </span>
                    <span lang="zh">
                      定期追蹤競爭對手動態與市場趨勢,自動整理成報告定時送達。
                    </span>
                  </p>
                </div>
                <div className="cell">
                  <span className="ord">06</span>
                  <span className="label">
                    <span lang="en">Weekly executive brief</span>
                    <span lang="zh">每週高管摘要</span>
                  </span>
                  <p className="desc">
                    <span lang="en">
                      Monday digest of team updates and items needing your
                      attention.
                    </span>
                    <span lang="zh">週一彙總團隊動態及需關注事項。</span>
                  </p>
                </div>
                <div className="cell">
                  <span className="ord">07</span>
                  <span className="label">
                    <span lang="en">Presentation design agents</span>
                    <span lang="zh">簡報設計 AI Agent</span>
                  </span>
                  <p className="desc">
                    <span lang="en">
                      Agents that produce presentation drafts from raw material
                      and data.
                    </span>
                    <span lang="zh">
                      把您提供的資料與數字,自動整理成可以直接使用的簡報初稿。
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>{slidePos(4)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 5 — The process (three pillars) */}
        <article className={slideClass(5)} data-slide="5">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                The <em>process.</em>
              </span>
              <span lang="zh">
                服務<em>流程。</em>
              </span>
            </h2>
          </div>
          <div className="slide-body">
            <div>
              <div className="pillars">
                <div className="pillar">
                  <span className="step">
                    <span lang="en">Phase 1</span>
                    <span lang="zh">第一階段</span>
                  </span>
                  <span className="icon" aria-hidden="true">
                    {/* Compass / magnifying — Discovery */}
                    <svg viewBox="0 0 48 48">
                      <circle cx="21" cy="21" r="13" />
                      <line x1="31" y1="31" x2="42" y2="42" />
                      <line x1="21" y1="14" x2="21" y2="28" />
                      <line x1="14" y1="21" x2="28" y2="21" />
                    </svg>
                  </span>
                  <h3 className="name">
                    <span lang="en">
                      Discovery <span className="duration">3–4 weeks</span>
                    </span>
                    <span lang="zh">
                      探索 <span className="duration">3–4 週</span>
                    </span>
                  </h3>
                  <p className="desc">
                    <span lang="en">
                      A structured audit of where AI creates real value in your
                      operation. You get a written roadmap, fully yours whether
                      or not you continue.
                    </span>
                    <span lang="zh">
                      我們先深入了解您公司的工作流程,找出哪些地方最值得導入
                      AI。結束後您會拿到一份完整的分析報告,不論之後是否繼續合作,報告都歸您所有。
                    </span>
                  </p>
                </div>
                <div className="pillar">
                  <span className="step">
                    <span lang="en">Phase 2</span>
                    <span lang="zh">第二階段</span>
                  </span>
                  <span className="icon" aria-hidden="true">
                    {/* Two interlocking gears — Pilot */}
                    <svg viewBox="0 0 48 48">
                      <circle cx="18" cy="24" r="8" />
                      <circle cx="18" cy="24" r="2.5" />
                      <line x1="18" y1="13" x2="18" y2="15.5" />
                      <line x1="18" y1="32.5" x2="18" y2="35" />
                      <line x1="7" y1="24" x2="9.5" y2="24" />
                      <line x1="26.5" y1="24" x2="29" y2="24" />
                      <line x1="10.5" y1="16.5" x2="12.3" y2="18.3" />
                      <line x1="23.7" y1="29.7" x2="25.5" y2="31.5" />
                      <line x1="10.5" y1="31.5" x2="12.3" y2="29.7" />
                      <line x1="23.7" y1="18.3" x2="25.5" y2="16.5" />
                      <circle cx="35" cy="30" r="5" />
                      <circle cx="35" cy="30" r="1.6" />
                      <line x1="35" y1="23.5" x2="35" y2="25" />
                      <line x1="35" y1="35" x2="35" y2="36.5" />
                      <line x1="28.5" y1="30" x2="30" y2="30" />
                      <line x1="40" y1="30" x2="41.5" y2="30" />
                    </svg>
                  </span>
                  <h3 className="name">
                    <span lang="en">
                      Pilot <span className="duration">6–8 weeks</span>
                    </span>
                    <span lang="zh">
                      Pilot <span className="duration">6–8 週</span>
                    </span>
                  </h3>
                  <p className="desc">
                    <span lang="en">
                      We build one workflow end-to-end and run it live to
                      measure what actually happens. Your team experiences the
                      system in real work.
                    </span>
                    <span lang="zh">
                      我們從頭到尾打造一個 AI
                      Agent,讓它在您的真實工作中實際跑起來,看看效果 如何。
                    </span>
                  </p>
                </div>
                <div className="pillar">
                  <span className="step">
                    <span lang="en">Phase 3</span>
                    <span lang="zh">第三階段</span>
                  </span>
                  <span className="icon" aria-hidden="true">
                    {/* Robot head — Run at scale */}
                    <svg viewBox="0 0 48 48">
                      <line x1="24" y1="6" x2="24" y2="11" />
                      <circle cx="24" cy="5" r="1.4" />
                      <rect
                        x="10"
                        y="12"
                        width="28"
                        height="24"
                        rx="3.5"
                        ry="3.5"
                      />
                      <circle cx="18" cy="22" r="2.2" />
                      <circle cx="30" cy="22" r="2.2" />
                      <line x1="17" y1="29" x2="31" y2="29" />
                      <line x1="10" y1="20" x2="7" y2="20" />
                      <line x1="10" y1="26" x2="7" y2="26" />
                      <line x1="38" y1="20" x2="41" y2="20" />
                      <line x1="38" y1="26" x2="41" y2="26" />
                      <line x1="20" y1="36" x2="20" y2="40" />
                      <line x1="28" y1="36" x2="28" y2="40" />
                      <line x1="16" y1="40" x2="32" y2="40" />
                    </svg>
                  </span>
                  <h3 className="name">
                    <span lang="en">
                      Run <span className="duration">Ongoing</span>
                    </span>
                    <span lang="zh">
                      持續維運 <span className="duration">持續進行</span>
                    </span>
                  </h3>
                  <p className="desc">
                    <span lang="en">
                      Ongoing operation with continuous monitoring and quarterly
                      additions as you scale. The agents run; we handle the
                      operational work.
                    </span>
                    <span lang="zh">
                      AI Agent
                      上線後由我們持續維護、監控,每季再新增功能。您只需要看成果,技
                      術細節交給我們。
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>{slidePos(5)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 6a — Phase 1: Discovery · How it works */}
        <article className={slideClass(6, 'phase-detail')} data-slide="6">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                Phase 1: Discovery <em>· How it works.</em>
              </span>
              <span lang="zh">
                第一階段：探索 <em>· 運作方式。</em>
              </span>
            </h2>
          </div>
          <div className="slide-body">
            <div className="phase-strip">
              <span className="pill active">
                <span lang="en">1 · Discovery</span>
                <span lang="zh">1 · 探索</span>
              </span>
              <span className="pill">
                <span lang="en">2 · Pilot</span>
                <span lang="zh">2 · Pilot</span>
              </span>
              <span className="pill">
                <span lang="en">3 · Run</span>
                <span lang="zh">3 · 持續進行</span>
              </span>
            </div>
            <div className="phase-blocks">
              <div className="phase-block">
                <span className="ph-label">
                  <span lang="en">Duration</span>
                  <span lang="zh">時長</span>
                </span>
                <p className="duration-headline">
                  <span lang="en">3–4 weeks</span>
                  <span lang="zh">3–4 週</span>
                </p>
                <div className="market-price">
                  <span className="mp-label">
                    <span lang="en">Market Price</span>
                    <span lang="zh">市場參考價</span>
                  </span>
                  <p className="mp-range">
                    $10k–$25k<span className="fn-mark">*</span>
                  </p>
                </div>
              </div>
              <div className="phase-block">
                <span className="ph-label">
                  <span lang="en">The process</span>
                  <span lang="zh">流程說明</span>
                </span>
                <ol className="proc-steps">
                  <li>
                    <span className="proc-ord">01</span>
                    <span className="proc-text">
                      <span lang="en">Business-owner workflow session</span>
                      <span lang="zh">與企業負責人進行工作流程訪談</span>
                    </span>
                  </li>
                  <li>
                    <span className="proc-ord">02</span>
                    <span className="proc-text">
                      <span lang="en">
                        0&ndash;n stakeholder workflow sessions
                      </span>
                      <span lang="zh">與相關團隊成員進行工作流程訪談</span>
                    </span>
                  </li>
                  <li>
                    <span className="proc-ord">03</span>
                    <span className="proc-text">
                      <span lang="en">
                        Asynchronous follow-up question window
                      </span>
                      <span lang="zh">訪談後的補充提問與確認</span>
                    </span>
                  </li>
                  <li>
                    <span className="proc-ord">04</span>
                    <span className="proc-text">
                      <span lang="en">Audit report + live read-out</span>
                      <span lang="zh">完整評估報告 + 線上說明會</span>
                    </span>
                  </li>
                </ol>
              </div>
              <div className="phase-block">
                <span className="ph-label">
                  <span lang="en">Inside a workflow session</span>
                  <span lang="zh">訪談會內容</span>
                </span>
                <ul>
                  <li>
                    <span lang="en">Questions about the workflow</span>
                    <span lang="zh">深入了解您目前的工作方式</span>
                  </li>
                  <li>
                    <span lang="en">
                      A light question bank that goes deeper as the session
                      progresses
                    </span>
                    <span lang="zh">依狀況追問細節,確保充分理解</span>
                  </li>
                  <li>
                    <span lang="en">
                      Afterwards: schedule the next stakeholder session
                    </span>
                    <span lang="zh">訪談結束後安排下一場相關人員訪談</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="phase-footnote">
              <span className="fn-mark">*</span>
              <span>
                <span lang="en">
                  Varies by scope of audit (one workflow vs. one department vs.
                  whole company).
                </span>
                <span lang="zh">
                  範圍因審計深度而異(單一工作流 vs 單一部門 vs 全公司)。
                </span>
              </span>
            </p>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>{slidePos(6)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 6b — Phase 1: Discovery · What you get */}
        <article className={slideClass(7, 'phase-detail')} data-slide="7">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                Phase 1: Discovery <em>· What you get.</em>
              </span>
              <span lang="zh">
                第一階段：探索 <em>·您將獲得什麼。</em>
              </span>
            </h2>
          </div>
          <div className="slide-body">
            <div className="phase-strip">
              <span className="pill active">
                <span lang="en">1 · Discovery</span>
                <span lang="zh">1 · 探索</span>
              </span>
              <span className="pill">
                <span lang="en">2 · Pilot</span>
                <span lang="zh">2 · Pilot</span>
              </span>
              <span className="pill">
                <span lang="en">3 · Run</span>
                <span lang="zh">3 · 持續進行</span>
              </span>
            </div>
            <div className="deliver-stack">
              <div className="deliver-head">
                <span className="ph-label">
                  <span lang="en">1. AI Audit Report</span>
                  <span lang="zh">1. AI 審計報告</span>
                </span>
              </div>
              <div className="audit-grid">
                <div className="audit-cell">
                  <span className="ord">01</span>
                  <span className="label">
                    <span lang="en">Visual workflow summary</span>
                    <span lang="zh">工作流程圖</span>
                  </span>
                  <p className="desc">
                    <span lang="en">
                      Diagrams of how the work moves through your team today.
                    </span>
                    <span lang="zh">
                      用圖表清楚呈現工作現在是如何在團隊裡一步一步流轉的。
                    </span>
                  </p>
                </div>
                <div className="audit-cell">
                  <span className="ord">02</span>
                  <span className="label">
                    <span lang="en">Bottlenecks &amp; constraints</span>
                    <span lang="zh">卡關點在哪裡</span>
                  </span>
                  <p className="desc">
                    <span lang="en">
                      Where the work slows, queues, or depends on one person.
                    </span>
                    <span lang="zh">
                      找出哪些環節容易拖慢進度、積壓工作,或只靠某一個人撐著。
                    </span>
                  </p>
                </div>
                <div className="audit-cell">
                  <span className="ord">03</span>
                  <span className="label">
                    <span lang="en">Optimization opportunities</span>
                    <span lang="zh">最值得改善的地方</span>
                  </span>
                  <p className="desc">
                    <span lang="en">
                      The workflows where agents create real, ranked leverage.
                    </span>
                    <span lang="zh">
                      列出哪些工作流程交給 AI Agent
                      處理效益最大,並依優先順序排列。
                    </span>
                  </p>
                </div>
                <div className="audit-cell">
                  <span className="ord">04</span>
                  <span className="label">
                    <span lang="en">Risks &amp; adoption friction</span>
                    <span lang="zh">可能遇到的阻礙</span>
                  </span>
                  <p className="desc">
                    <span lang="en">
                      For each opportunity: what could stall it, and who to
                      bring along.
                    </span>
                    <span lang="zh">
                      針對每個改善機會,說明可能卡住的原因,以及需要哪些人一起推動。
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="readout-main">
              <span className="ph-label">
                <span lang="en">2. Live read-out</span>
                <span lang="zh">2. 線上說明會</span>
              </span>
              <p className="readout-text">
                <span lang="en">
                  Presentation of the findings, opportunities, and potential
                  next steps.
                </span>
                <span lang="zh">
                  把評估報告的發現、可以改善的地方,以及建議的下一步,用線上會議的方式向您
                  說明。
                </span>
              </p>
            </div>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>{slidePos(7)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 8 — Phase 2: Pilot */}
        <article className={slideClass(8, 'phase-detail')} data-slide="8">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                Phase 2: <em>Pilot.</em>
              </span>
              <span lang="zh">
                第二階段：<em>Pilot.</em>
              </span>
            </h2>
          </div>
          <div className="slide-body">
            <div className="phase-strip">
              <span className="pill">
                <span lang="en">1 · Discovery</span>
                <span lang="zh">1 · 探索</span>
              </span>
              <span className="pill active">
                <span lang="en">2 · Pilot</span>
                <span lang="zh">2 · Pilot</span>
              </span>
              <span className="pill">
                <span lang="en">3 · Run</span>
                <span lang="zh">3 · 持續進行</span>
              </span>
            </div>
            <div className="phase-blocks">
              <div className="phase-block">
                <span className="ph-label">
                  <span lang="en">Duration</span>
                  <span lang="zh">時長</span>
                </span>
                <p className="duration-headline">
                  <span lang="en">6–8 weeks</span>
                  <span lang="zh">6–8 週</span>
                </p>
                <div className="market-price">
                  <span className="mp-label">
                    <span lang="en">Market Price</span>
                    <span lang="zh">市場參考價</span>
                  </span>
                  <p className="mp-range">
                    $25k–$75k<span className="fn-mark">*</span>
                  </p>
                </div>
              </div>
              <div className="phase-block">
                <span className="ph-label">
                  <span lang="en">Process Details</span>
                  <span lang="zh">流程詳情</span>
                </span>
                <ul>
                  <li>
                    <span lang="en">
                      Design the workflow based on Discovery recommendations
                    </span>
                    <span lang="zh">
                      根據評估報告的建議,設計 AI Agent 的運作方式
                    </span>
                  </li>
                  <li>
                    <span lang="en">Build and integrate with your systems</span>
                    <span lang="zh">與您現有的工具和系統串接</span>
                  </li>
                  <li>
                    <span lang="en">Run live with your team for 2–3 weeks</span>
                    <span lang="zh">在您的真實工作環境中實際運行 2–3 週</span>
                  </li>
                  <li>
                    <span lang="en">
                      Measure what happens and iterate with feedback
                    </span>
                    <span lang="zh">收集成效數據,持續調整優化</span>
                  </li>
                  <li>
                    <span lang="en">
                      Review outcomes together and decide next step
                    </span>
                    <span lang="zh">與您一起回顧成果,決定接下來怎麼走</span>
                  </li>
                </ul>
              </div>
              <div className="phase-block">
                <span className="ph-label">
                  <span lang="en">Deliverable</span>
                  <span lang="zh">交付成果</span>
                </span>
                <ul>
                  <li>
                    <span lang="en">
                      Live, working agent handling real workflows
                    </span>
                    <span lang="zh">一個在真實工作中實際運行的 AI Agent</span>
                  </li>
                  <li>
                    <span lang="en">
                      Measurement of actual impact (time, decisions, quality)
                    </span>
                    <span lang="zh">
                      具體的成效數據(節省時間、決策速度、輸出品質)
                    </span>
                  </li>
                  <li>
                    <span lang="en">
                      Code and documentation transfer to you
                    </span>
                    <span lang="zh">所有程式碼與技術文件完整移交給您</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="phase-footnote">
              <span className="fn-mark">*</span>
              <span>
                <span lang="en">
                  Varies by workflow complexity (straightforward decision rules
                  vs. multi-step logic and integrations).
                </span>
                <span lang="zh">
                  視工作流程複雜度而定（簡單決策規則 vs. 多步邏輯與系統整合）。
                </span>
              </span>
            </p>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>{slidePos(8)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 9 — Phase 3: Run at scale */}
        <article className={slideClass(9, 'phase-detail')} data-slide="9">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                Phase 3: <em>Run at scale.</em>
              </span>
              <span lang="zh">
                第三階段：<em>持續維運。</em>
              </span>
            </h2>
          </div>
          <div className="slide-body">
            <div className="phase-strip">
              <span className="pill">
                <span lang="en">1 · Discovery</span>
                <span lang="zh">1 · 探索</span>
              </span>
              <span className="pill">
                <span lang="en">2 · Pilot</span>
                <span lang="zh">2 · Pilot</span>
              </span>
              <span className="pill active">
                <span lang="en">3 · Run</span>
                <span lang="zh">3 · 持續進行</span>
              </span>
            </div>
            <div className="phase-blocks">
              <div className="phase-block">
                <span className="ph-label">
                  <span lang="en">Duration</span>
                  <span lang="zh">時長</span>
                </span>
                <p className="duration-headline">
                  <span lang="en">Ongoing</span>
                  <span lang="zh">持續進行</span>
                </p>
                <div className="market-price">
                  <span className="mp-label">
                    <span lang="en">Market Price</span>
                    <span lang="zh">市場參考價</span>
                  </span>
                  <p className="mp-range">
                    $5k–$25k
                    <span className="per">
                      <span lang="en">/ month</span>
                      <span lang="zh">/ 月</span>
                    </span>
                    <span className="fn-mark">*</span>
                  </p>
                </div>
              </div>
              <div className="phase-block">
                <span className="ph-label">
                  <span lang="en">Process Details</span>
                  <span lang="zh">流程詳情</span>
                </span>
                <ul>
                  <li>
                    <span lang="en">
                      Operate workflows in production with continuous monitoring
                    </span>
                    <span lang="zh">
                      AI Agent 正式上線,我們全程監控確保穩定運作
                    </span>
                  </li>
                  <li>
                    <span lang="en">
                      Review production logs weekly to surface improvements
                    </span>
                    <span lang="zh">
                      每週檢視運作紀錄,主動找出可以改善的地方
                    </span>
                  </li>
                  <li>
                    <span lang="en">
                      Iterate based on team feedback and actual usage patterns
                    </span>
                    <span lang="zh">根據您的團隊回饋與使用狀況持續調整</span>
                  </li>
                  <li>
                    <span lang="en">Add 1–2 new automations per quarter</span>
                    <span lang="zh">
                      每季新增 1–2 個自動化功能,讓系統越來越好用
                    </span>
                  </li>
                  <li>
                    <span lang="en">
                      Manage integration as your tool stack evolves
                    </span>
                    <span lang="zh">當您更換或新增工具時,我們負責重新串接</span>
                  </li>
                </ul>
              </div>
              <div className="phase-block">
                <span className="ph-label">
                  <span lang="en">Deliverable</span>
                  <span lang="zh">交付成果</span>
                </span>
                <ul>
                  <li>
                    <span lang="en">
                      Agents running without requiring your intervention
                    </span>
                    <span lang="zh">
                      AI Agent 自動處理工作,不需要您每次手動操作
                    </span>
                  </li>
                  <li>
                    <span lang="en">
                      Weekly performance reviews and improvement recommendations
                    </span>
                    <span lang="zh">每週提供運作報告與改善建議</span>
                  </li>
                  <li>
                    <span lang="en">
                      Operational oversight and scaling support
                    </span>
                    <span lang="zh">持續的技術支援,以及未來擴大規模的協助</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="phase-footnote">
              <span className="fn-mark">*</span>
              <span>
                <span lang="en">
                  Varies by arrangement after Pilot (one agent vs. multiple
                  agents, integration complexity, frequency of additions).
                </span>
                <span lang="zh">
                  費用依實際規模(AI Agent
                  數量、整合複雜度、功能新增頻率)另行議定。
                </span>
              </span>
            </p>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>{slidePos(9)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 10 — Thank you */}
        <article className={slideClass(10, 'thanks-slide')} data-slide="10">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                Thank <em>you.</em>
              </span>
              <span lang="zh">
                感謝您<em>。</em>
              </span>
            </h2>
          </div>
          <div className="slide-body">
            <div className="thanks-block">
              <p className="thanks-contact">studio@agenticmaison.com</p>
              <p className="thanks-contact">WhatsApp: +852 9696 8828</p>
            </div>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>{slidePos(10)}</b> / {total}
            </span>
          </footer>
        </article>
      </main>

      <div className="deck-colophon">
        <b>Agentic Maison · AI Practice · MMXXVI</b>
        &nbsp;·&nbsp; <span lang="en">{total} slides</span>
        <span lang="zh">{total} 張投影片</span>
        &nbsp;·&nbsp;{' '}
        <span lang="en">
          Press <b>P</b> to present
        </span>
        <span lang="zh">
          按 <b>P</b> 進入簡報模式
        </span>
      </div>

      <div className="present-hud" aria-hidden="true">
        <span className="counter">
          <b id="ctr-current">1</b> / <span id="ctr-total">{total}</span>
        </span>
        <span className="hint">
          <span lang="en">← → arrows · Esc to exit</span>
          <span lang="zh">← → 方向鍵 · Esc 退出</span>
        </span>
      </div>

      <DeckControls />
    </>
  );
}
