import { AgentsSlideA } from './agents-slide';
import { DeckControls } from './deck-controls';
import { DECK_TOTAL, slidePos } from './deck-config';
import { DeckCoverSlide, DeckSlide } from './deck-slide';
import { DeckTopbar } from './deck-topbar';
import { FunctionSlides } from './function-slides';
import { PhaseStrip } from './phase-strip';

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
  const total = DECK_TOTAL;

  return (
    <>
      <DeckTopbar />

      <main className="deck" id="deck">
        <DeckCoverSlide
          id={1}
          extraClass="slide-cover"
          position={slidePos(1)}
          total={total}
        >
          <div className="cover-block">
            <h1 className="slide-title">
              <span lang="en">
                Your team is doing work <br /> an <em>AI agent</em> could do.
              </span>
              <span lang="zh">
                你的團隊正在做
                <br />
                <em>AI agent</em> 可以做的工作。
              </span>
            </h1>
            <p className="cover-lede">
              <span lang="en">
                Specialized agents, built around your workflows. Yours to own.
              </span>
              <span lang="zh">
                度身訂造的 AI agent，圍繞你實際的 workflow 設計。完全屬於你。
              </span>
            </p>
            <p className="cover-date">
              <span lang="en">Updated on June 2026</span>
              <span lang="zh">於 2026 年 6 月更新</span>
            </p>
          </div>
        </DeckCoverSlide>

        <DeckSlide
          id={2}
          bodyClassName="slide-body who-body"
          position={slidePos(2)}
          total={total}
          title={
            <>
              <span lang="en">
                Who <em>we are.</em>
              </span>
              <span lang="zh">
                關於<em>我們。</em>
              </span>
            </>
          }
        >
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
                  我們不是平台，做的是專屬合作。同一時間只服務少數幾位
                  operator。
                </span>
              </span>
            </li>
            <li>
              <span>
                <span lang="en">
                  <b>Principal-led.</b> Sean leads every engagement end-to-end —
                  discovery, build, and operation.
                </span>
                <span lang="zh">
                  我們會親自帶你由 Discovery、Build 到 run，全程支援。
                </span>
              </span>
            </li>
            <li>
              <span>
                <span lang="en">
                  <b>Builders who ship.</b> Background in production AI systems,
                  not slideware.
                </span>
                <span lang="zh">
                  我們的背景在 tech，做過真實的 production AI 系統，不是只交
                  deck 的顧問。
                </span>
              </span>
            </li>
            <li>
              <span>
                <span lang="en">
                  <b>Operator empathy.</b> We&rsquo;ve run the businesses we now
                  build for — we know which work is worth automating and which
                  isn&rsquo;t.
                </span>
                <span lang="zh">
                  我們不會什麼都叫你 automate。做過
                  operator，知道哪些工作該交給AI Agent，哪些得留給人。
                </span>
              </span>
            </li>
          </ul>
        </DeckSlide>

        <DeckSlide
          id={3}
          bodyClassName="slide-body recent-body"
          position={slidePos(3)}
          total={total}
          title={
            <>
              <span lang="en">
                Recent developments in <em>AI</em>
              </span>
              <span lang="zh">AI 最近的發展</span>
            </>
          }
        >
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
                  大規模驗證了 language model 的能力。公眾開始留意。
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
                  模型開始真正動手做事，不再只是出字。「Vibe
                  coding」讓不是工程師的人也能用日常語言做出可用的 software。
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
                  開源的 agent runtime，任何企業都能自己 deploy、自己擁有。
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
                <span lang="zh">企業級 agent 基礎建設。</span>
              </span>
              <p className="why">
                <span lang="en">
                  Cloudflare and Google ship production-grade agent stacks. The
                  tooling is now enterprise-ready.
                </span>
                <span lang="zh">
                  Cloudflare 與 Google 推出 production 級的 agent stack。整套
                  tooling 已經企業級 ready。
                </span>
              </p>
            </div>
          </div>

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
              <span lang="zh">一分鐘看完 agentic AI 現在的全貌。</span>
            </figcaption>
          </figure>
        </DeckSlide>

        <DeckSlide
          id={4}
          extraClass="outcome-slide overview-slide"
          position={slidePos(4)}
          total={total}
          title={
            <>
              <span lang="en">&quot;AI&quot; vs Agentic Workflows</span>
              <span lang="zh">「AI」vs Agentic Workflow</span>
            </>
          }
        >
          <div className="compare-cols">
            <div className="compare-col">
              <div className="compare-head">
                <span className="compare-tag">
                  <span lang="en">Before</span>
                  <span lang="zh">之前</span>
                </span>
                <h3 className="compare-name">ChatGPT / Gemini / Claude</h3>
              </div>
              <ul className="compare-list">
                <li>
                  <span lang="en">
                    The Harvard graduate who has just joined your team.
                  </span>
                  <span lang="zh">剛入職的 Harvard 畢業生。</span>
                </li>
                <li>
                  <span lang="en">
                    Every new conversation is their first day at work.
                  </span>
                  <span lang="zh">
                    你每開一段新對話，都是他們上班的第一天。
                  </span>
                </li>
                <li>
                  <span lang="en">
                    You brief it from scratch every single time you talk to it.
                  </span>
                  <span lang="zh">每次對話，你都要從頭給他們指令一次。</span>
                </li>
                <li>
                  <span lang="en">
                    A blank chat box that waits for you to start.
                  </span>
                  <span lang="zh">一個空白的對話框，等你開口。</span>
                </li>
                <li>
                  <span lang="en">
                    Lives in a separate tab you have to copy work out of.
                  </span>
                  <span lang="zh">
                    在另一個分頁裡，你要把東西複製出來才用得到。
                  </span>
                </li>
              </ul>
            </div>
            <div className="compare-col compare-col-after">
              <div className="compare-head">
                <span className="compare-tag">
                  <span lang="en">After</span>
                  <span lang="zh">之後</span>
                </span>
                <h3 className="compare-name">
                  <span lang="en">Bespoke AI Agents</span>
                  <span lang="zh">為你度身訂造的 AI Agent</span>
                </h3>
              </div>
              <ul className="compare-list">
                <li>
                  <span lang="en">
                    The Harvard graduate who has worked for you for years.
                  </span>
                  <span lang="zh">已經為你工作了幾年的 Harvard 畢業生。</span>
                </li>
                <li>
                  <span lang="en">
                    It remembers everything you&apos;ve discussed, better than
                    you do.
                  </span>
                  <span lang="zh">
                    你們討論過的事，它全部記得，比你還清楚。
                  </span>
                </li>
                <li>
                  <span lang="en">
                    It performs tasks better than any explanation you give.
                  </span>
                  <span lang="zh">它執行任務的水準，比你解釋給它的還好。</span>
                </li>
                <li>
                  <span lang="en">
                    It runs on its own without you telling it to.
                  </span>
                  <span lang="zh">不用你叫，它自己會執行。</span>
                </li>
                <li>
                  <span lang="en">
                    It lives inside your tools and acts there.
                  </span>
                  <span lang="zh">它直接在你的工具裡做事。</span>
                </li>
              </ul>
            </div>
          </div>
        </DeckSlide>

        <AgentsSlideA total={total} />

        <DeckSlide
          id={12}
          position={slidePos(12)}
          total={total}
          title={
            <>
              <span lang="en">
                The <em>Process</em>
              </span>
              <span lang="zh">
                服務<em>流程</em>
              </span>
            </>
          }
        >
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
                    operation. You get a written roadmap, fully yours whether or
                    not you continue.
                  </span>
                  <span lang="zh">
                    我們拆解你的 workflow，找出 AI
                    最有槓桿的環節。你會拿到一份完整評估，加一份按優先排好的行動藍圖。無論之後是否繼續合作，這份報告都歸你。
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
                    We build one workflow end-to-end and run it live to measure
                    what actually happens. Your team experiences the system in
                    real work.
                  </span>
                  <span lang="zh">
                    我們從頭打造一個
                    workflow，在你真實環境裡運作，讓你的團隊在實際工作中親身體驗。看效果，邊跑邊調。
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
                    持續維運 <span className="duration">長期</span>
                  </span>
                </h3>
                <p className="desc">
                  <span lang="en">
                    Ongoing operation with continuous monitoring and quarterly
                    additions as you scale. The agents run; we handle the
                    operational work.
                  </span>
                  <span lang="zh">
                    Agent 上線後我們盯著表現，隨時微調，每季加新功能。Agent
                    自己跑，技術交給我們。你只看成果。
                  </span>
                </p>
              </div>
            </div>
          </div>
        </DeckSlide>

        <DeckSlide
          id={13}
          extraClass="phase-detail"
          position={slidePos(13)}
          total={total}
          title={
            <>
              <span lang="en">
                Phase 1: Discovery <em>· How it works.</em>
              </span>
              <span lang="zh">
                第一階段：Discovery <em>· 怎麼進行。</em>
              </span>
            </>
          }
        >
          <PhaseStrip active={1} />
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
                <span lang="en">The Process</span>
                <span lang="zh">流程說明</span>
              </span>
              <ol className="proc-steps">
                <li>
                  <span className="proc-ord">01</span>
                  <span className="proc-text">
                    <span lang="en">Business-owner workflow session</span>
                    <span lang="zh">與企業負責人進行 workflow session</span>
                  </span>
                </li>
                <li>
                  <span className="proc-ord">02</span>
                  <span className="proc-text">
                    <span lang="en">
                      0&ndash;n stakeholder workflow sessions
                    </span>
                    <span lang="zh">與相關團隊成員進行 workflow session</span>
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
                    <span lang="zh">完整 Audit 報告 + 線上 read-out</span>
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
                  <span lang="zh">拆解你目前的 workflow</span>
                </li>
                <li>
                  <span lang="en">
                    A light question bank that goes deeper as the session
                    progresses
                  </span>
                  <span lang="zh">
                    從基本問題開始，依情況逐步深入，確保我們完全理解
                  </span>
                </li>
                <li>
                  <span lang="en">
                    Afterwards: schedule the next stakeholder session
                  </span>
                  <span lang="zh">
                    訪談後：安排下一場相關人員的 workflow session
                  </span>
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
                依 audit 範圍而定（單一 workflow vs. 單一部門 vs. 全公司）。
              </span>
            </span>
          </p>
        </DeckSlide>

        <DeckSlide
          id={14}
          extraClass="phase-detail"
          position={slidePos(14)}
          total={total}
          title={
            <>
              <span lang="en">
                Phase 1: Discovery <em>· What you get.</em>
              </span>
              <span lang="zh">
                第一階段：Discovery <em>· 你會得到什麼。</em>
              </span>
            </>
          }
        >
          <PhaseStrip active={1} />
          <div className="deliver-stack">
            <div className="deliver-head">
              <span className="ph-label">
                <span lang="en">1. AI Audit Report</span>
                <span lang="zh">1. AI Audit 報告</span>
              </span>
            </div>
            <div className="audit-grid">
              <div className="audit-cell">
                <span className="ord">01</span>
                <span className="label">
                  <span lang="en">Visual workflow summary</span>
                  <span lang="zh">Workflow 結構圖</span>
                </span>
                <p className="desc">
                  <span lang="en">
                    Diagrams of how the work moves through your team today.
                  </span>
                  <span lang="zh">用圖表畫出工作目前在你團隊內如何流動。</span>
                </p>
              </div>
              <div className="audit-cell">
                <span className="ord">02</span>
                <span className="label">
                  <span lang="en">Bottlenecks &amp; constraints</span>
                  <span lang="zh">瓶頸和限制</span>
                </span>
                <p className="desc">
                  <span lang="en">
                    Where the work slows, queues, or depends on one person.
                  </span>
                  <span lang="zh">
                    找出哪些地方工作容易卡住，或太過依賴一個人。
                  </span>
                </p>
              </div>
              <div className="audit-cell">
                <span className="ord">03</span>
                <span className="label">
                  <span lang="en">Optimization opportunities</span>
                  <span lang="zh">行動藍圖</span>
                </span>
                <p className="desc">
                  <span lang="en">
                    The workflows where agents create real, ranked leverage.
                  </span>
                  <span lang="zh">
                    按優先排好那些交給 AI Agent 效益最大的 workflow。
                  </span>
                </p>
              </div>
              <div className="audit-cell">
                <span className="ord">04</span>
                <span className="label">
                  <span lang="en">Risks &amp; adoption friction</span>
                  <span lang="zh">風險和阻力</span>
                </span>
                <p className="desc">
                  <span lang="en">
                    For each opportunity: what could stall it, and who to bring
                    along.
                  </span>
                  <span lang="zh">
                    每個改善機會，找出可能會卡住的原因，以及需要拉哪些人一起推動。
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="readout-main">
            <span className="ph-label">
              <span lang="en">2. Live read-out</span>
              <span lang="zh">2. 線上 Read-out</span>
            </span>
            <p className="readout-text">
              <span lang="en">
                Presentation of the findings, opportunities, and potential next
                steps.
              </span>
              <span lang="zh">
                用線上會議向你說明 Audit
                報告的發現、值得改善的環節，以及建議的下一步。
              </span>
            </p>
          </div>
        </DeckSlide>

        <DeckSlide
          id={15}
          extraClass="phase-detail"
          position={slidePos(15)}
          total={total}
          title={
            <>
              <span lang="en">
                Phase 2: <em>Pilot.</em>
              </span>
              <span lang="zh">
                第二階段：<em>Pilot.</em>
              </span>
            </>
          }
        >
          <PhaseStrip active={2} />
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
                    根據 Audit 報告，從頭打造這個 workflow。
                  </span>
                </li>
                <li>
                  <span lang="en">Build and integrate with your systems</span>
                  <span lang="zh">打造並串連你現有的工具和系統</span>
                </li>
                <li>
                  <span lang="en">Run live with your team for 2–3 weeks</span>
                  <span lang="zh">
                    讓 AI Agent 在你的團隊真實環境裡運作 2–3 週。
                  </span>
                </li>
                <li>
                  <span lang="en">
                    Measure what happens and iterate with feedback
                  </span>
                  <span lang="zh">看效果，邊跑邊調，按 feedback 優化</span>
                </li>
                <li>
                  <span lang="en">
                    Review outcomes together and decide next step
                  </span>
                  <span lang="zh">和你一起回顧成果，決定下一步怎麼走</span>
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
                  <span lang="zh">
                    一個在你真實 workflow 中運作的 AI Agent。
                  </span>
                </li>
                <li>
                  <span lang="en">
                    Measurement of actual impact (time, decisions, quality)
                  </span>
                  <span lang="zh">
                    具體的成效 data（省下多少時間、決策速度、輸出品質）
                  </span>
                </li>
                <li>
                  <span lang="en">Code and documentation transfer to you</span>
                  <span lang="zh">所有 code 與技術文件完整交付給你</span>
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
                複雜度而定（簡單決策規則 vs. 多步邏輯加系統 integration）。
              </span>
            </span>
          </p>
        </DeckSlide>

        <DeckSlide
          id={16}
          extraClass="phase-detail"
          position={slidePos(16)}
          total={total}
          title={
            <>
              <span lang="en">
                Phase 3: <em>Run at scale.</em>
              </span>
              <span lang="zh">
                第三階段：<em>規模化運作。</em>
              </span>
            </>
          }
        >
          <PhaseStrip active={3} />
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
                    AI Agent 上線運作，我們全程盯著表現確保穩定
                  </span>
                </li>
                <li>
                  <span lang="en">
                    Review production logs weekly to surface improvements
                  </span>
                  <span lang="zh">
                    每週看運作紀錄，順手找出可以改善的環節。
                  </span>
                </li>
                <li>
                  <span lang="en">
                    Iterate based on team feedback and actual usage patterns
                  </span>
                  <span lang="zh">
                    邊跑邊調，按 team feedback 和實際用法持續優化。
                  </span>
                </li>
                <li>
                  <span lang="en">Add 1–2 new automations per quarter</span>
                  <span lang="zh">每季順手加 1–2 個新自動化，系統越用越好</span>
                </li>
                <li>
                  <span lang="en">
                    Manage integration as your tool stack evolves
                  </span>
                  <span lang="zh">
                    當你更換或新增工具時，我們負責重新 integrate
                  </span>
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
                  <span lang="zh">Agent 自己跑，不需要你每次動手</span>
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
                  <span lang="zh">持續盯著表現，撐得起你擴大規模</span>
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
                費用依實際規模（AI Agent 數量、integration
                複雜度、新增功能頻率）另議。
              </span>
            </span>
          </p>
        </DeckSlide>

        <DeckSlide
          id={17}
          extraClass="thanks-slide"
          position={slidePos(17)}
          total={total}
          title={
            <>
              <span lang="en">
                Thank <em>you.</em>
              </span>
              <span lang="zh">
                謝謝你<em>。</em>
              </span>
            </>
          }
        >
          <div className="thanks-block">
            <p className="thanks-contact">studio@agenticmaison.com</p>
            <p className="thanks-contact">WhatsApp: +852 9696 8828</p>
          </div>
        </DeckSlide>

        {/* aip-037: Appendix — the 7 "Agents for X" function slides, moved
            here from the main flow, behind a divider. English-only. */}
        <DeckSlide
          id={20}
          extraClass="appendix-divider"
          position={slidePos(20)}
          total={total}
          title={
            <>
              <span lang="en">
                Appendix <em>· Agents by function.</em>
              </span>
              <span lang="zh">
                附錄 <em>· 依功能分類的 AI agents。</em>
              </span>
            </>
          }
        >
          <p className="appendix-lede" lang="en">
            The same agents, grouped by the part of the business they work in
            &mdash; with a featured story for each.
          </p>
        </DeckSlide>

        <FunctionSlides total={total} />
      </main>

      <div className="deck-colophon mx-auto mt-14 max-w-[1400px] border-t border-rule px-8 pt-9 text-center font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-3 [&_b]:font-medium [&_b]:text-ink">
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
      </div>

      <DeckControls />
    </>
  );
}
