import Link from 'next/link';
import { DeckControls } from './deck-controls';
import { localePath } from '@/i18n/paths';

/**
 * Add slide IDs here to exclude them from the visible deck.
 * Page numbers and totals recalculate automatically.
 */
const HIDDEN_SLIDES = new Set<number>([2]);

const ALL_SLIDE_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
];
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
              <h1 className="slide-title text-balance">
                Your team is doing work an <em>AI agent</em> could do.
              </h1>
              <p className="cover-lede">
                <span lang="en">
                  Specialized agents, built around your workflows. Yours to own.
                </span>
                <span lang="zh">
                  打造專屬智能體，處理團隊反覆執行的工作。為你的業務訂製。在你現有的工具間運作。即時交付成果。
                </span>
              </p>
              <p className="cover-date">
                <span lang="en">Updated on June 2026</span>
                <span lang="zh">更新於 2026 年 6 月</span>
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

        {/* Slide 4 — Why bespoke agents (overview) */}
        <article
          className={slideClass(4, 'outcome-slide overview-slide')}
          data-slide="4"
        >
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">&quot;AI&quot; vs Agentic Workflows</span>
              <span lang="zh">為何要專屬智能體？</span>
            </h2>
          </div>
          <div className="slide-body">
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
                    <span lang="zh">
                      牛津高材生剛加入公司。每次對話,都是他們第一天上班。
                    </span>
                  </li>
                  <li>
                    <span lang="en">
                      Every new conversation is their first day at work.
                    </span>
                    <span lang="zh">
                      聰明如牛津高材生——卻對貴司業務、甚至昨天做過的事毫無記憶。
                    </span>
                  </li>
                  <li>
                    <span lang="en">
                      You brief it from scratch every single time you talk to
                      it.
                    </span>
                    <span lang="zh">每次對話,您都得從頭交代一次。</span>
                  </li>
                  <li>
                    <span lang="en">
                      A blank chat box that waits for you to start.
                    </span>
                    <span lang="zh">一個空白對話框,等著您動手。</span>
                  </li>
                  <li>
                    <span lang="en">
                      Lives in a separate tab you have to copy work out of.
                    </span>
                    <span lang="zh">活在另一個分頁裡,您得把成果複製出來。</span>
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
                    <span lang="zh">專屬 AI 智能體</span>
                  </h3>
                </div>
                <ul className="compare-list">
                  <li>
                    <span lang="en">
                      The Harvard graduate who has worked for you for years.
                    </span>
                    <span lang="zh">早已為您工作多年的牛津畢業生。</span>
                  </li>
                  <li>
                    <span lang="en">
                      It remembers everything you&apos;ve discussed, better than
                      you do.
                    </span>
                    <span lang="zh">它知道該做什麼,無需您告訴它。</span>
                  </li>
                  <li>
                    <span lang="en">
                      It performs tasks better than any explanation you give.
                    </span>
                    <span lang="zh">它執行任務比您給的任何解釋都好。</span>
                  </li>
                  <li>
                    <span lang="en">
                      It runs on its own without you telling it to.
                    </span>
                    <span lang="zh">它默默地自行運作,無需您告知。</span>
                  </li>
                  <li>
                    <span lang="en">
                      It lives inside your tools and acts there.
                    </span>
                    <span lang="zh">它就在您的工具中運作執行。</span>
                  </li>
                </ul>
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

        {/* Slide 5 — Sales */}
        <article
          className={slideClass(5, 'outcome-slide function-slide')}
          data-slide="5"
        >
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                Agents for <em>Sales</em>
              </span>
              <span lang="zh">專屬銷售智能體</span>
            </h2>
          </div>
          <div className="slide-body">
            <div className="func-cols">
              <div className="spotlight">
                <span className="spot-kicker">
                  <span lang="en">Featured · Name-card follow-up</span>
                  <span lang="zh">焦點 · 名片跟進</span>
                </span>
                <h3 className="spot-title">
                  <span lang="en">
                    Forty name cards. Forty follow-ups. <em>Ten minutes.</em>
                  </span>
                  <span lang="zh">
                    四十張名片,四十封跟進,<em>十分鐘。</em>
                  </span>
                </h3>
                <div className="spot-flow">
                  <div className="spot-step">
                    <span className="spot-label">
                      <span lang="en">Scenario</span>
                      <span lang="zh">情境</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        You came back from the event with forty name cards and
                        good intentions. Three weeks later, the stack is still
                        on your desk.
                      </span>
                      <span lang="zh">
                        您從活動帶回四十張名片,滿懷跟進的打算。三週過去,那疊名片仍擱在桌上。
                      </span>
                    </p>
                  </div>
                  <div className="spot-step">
                    <span className="spot-label">
                      <span lang="en">Before</span>
                      <span lang="zh">過去</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        Each card means recalling the conversation, finding the
                        right angle, and writing a personal note. Forty of those
                        is a day you never have — so most never get sent.
                      </span>
                      <span lang="zh">
                        每張名片都得回想當時的對話、找出切入點、寫一封個人化的訊息。四十封等於一整天——您騰不出來,於是多數從未寄出。
                      </span>
                    </p>
                  </div>
                  <div className="spot-step spot-after">
                    <span className="spot-label">
                      <span lang="en">After</span>
                      <span lang="zh">現在</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        From your notes, the agent drafts forty personalized
                        first emails — each referencing what you actually
                        discussed. You review and send. Forty follow-ups go out
                        in 10 minutes, not never.
                      </span>
                      <span lang="zh">
                        智能體依您的筆記,起草四十封個人化開發信——每封都提及當時實際談過的內容。您過目後寄出。四十封跟進在十分鐘內送出,而非石沉大海。
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="func-list">
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Proposal first drafts</span>
                    <span lang="zh">提案初稿</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      A discovery call ends; the agent drafts the proposal from
                      the call and your previous proposals — you refine instead
                      of starting blank.
                    </span>
                    <span lang="zh">
                      探索會議一結束,智能體便依會議內容與您過往的提案起草初稿——您只需修潤,無需從零開始。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Pre-meeting brief</span>
                    <span lang="zh">會前簡報</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Five minutes before every call, a one-page brief lands in
                      your inbox — who they are, the history, what to ask.
                    </span>
                    <span lang="zh">
                      每場會議前五分鐘,一頁簡報送進您的收件匣——對方是誰、過往脈絡、該問些什麼。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Stale-lead revival</span>
                    <span lang="zh">喚醒舊名單</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Two hundred leads went cold in the CRM; the agent
                      re-engages them on a schedule, in your voice, and flags
                      the ones who reply.
                    </span>
                    <span lang="zh">
                      CRM
                      裡兩百條名單已轉冷,智能體依排程、以您的語氣逐一喚醒,並標出有回覆的對象。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Post-meeting CRM update</span>
                    <span lang="zh">會後 CRM 紀錄</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      The agent listens to the call recording and logs the
                      notes, next steps, and owner by end of day — nothing falls
                      through.
                    </span>
                    <span lang="zh">
                      智能體聆聽通話錄音,當日完成筆記、後續步驟與負責人的紀錄——不再有遺漏。
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

        {/* Slide 6 — Accounts */}
        <article
          className={slideClass(6, 'outcome-slide function-slide')}
          data-slide="6"
        >
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                Agents for <em>Account Management</em>
              </span>
              <span lang="zh">專屬客戶管理智能體</span>
            </h2>
          </div>
          <div className="slide-body">
            <div className="func-cols">
              <div className="spotlight">
                <span className="spot-kicker">
                  <span lang="en">
                    Featured · The resend request, fulfilled
                  </span>
                  <span lang="zh">焦點 · 重發請求,已完成</span>
                </span>
                <h3 className="spot-title">
                  <span lang="en">
                    &ldquo;Can you send that over again?&rdquo; <em>Done.</em>
                  </span>
                  <span lang="zh">
                    「能再發一次給我嗎?」<em>已完成。</em>
                  </span>
                </h3>
                <div className="spot-flow">
                  <div className="spot-step">
                    <span className="spot-label">
                      <span lang="en">Scenario</span>
                      <span lang="zh">情境</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        A client emails: can you resend the catalogue — or the
                        contract, or the proposal — you sent a while back?
                        It&rsquo;s somewhere in your sent folder, three versions
                        deep.
                      </span>
                      <span lang="zh">
                        一位客戶來信:能否再發一次之前那份目錄——或合約、或提案?它就埋在您的寄件備份裡,還有好幾個版本。
                      </span>
                    </p>
                  </div>
                  <div className="spot-step">
                    <span className="spot-label">
                      <span lang="en">Before</span>
                      <span lang="zh">過去</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        You stop what you&rsquo;re doing, dig through old
                        threads to find the right file and the latest version,
                        and write the reply. A two-minute favor that breaks your
                        focus five times a week.
                      </span>
                      <span lang="zh">
                        您放下手邊的事,翻找舊郵件,確認是哪一份、是不是最新版,再寫回覆。一件兩分鐘的小忙,每週卻打斷您五次。
                      </span>
                    </p>
                  </div>
                  <div className="spot-step spot-after">
                    <span className="spot-label">
                      <span lang="en">After</span>
                      <span lang="zh">現在</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        The agent finds the latest version, attaches it, and
                        sends a polite note in your voice — then tells you
                        it&rsquo;s handled. You never break stride.
                      </span>
                      <span lang="zh">
                        智能體找出最新版本、附上檔案,以您的語氣寫一段客氣的說明寄出——再告知您已處理妥當。您的節奏完全不受打斷。
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="func-list">
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Renewal reminders</span>
                    <span lang="zh">續約提醒</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Sixty days before a renewal, the agent flags it and drafts
                      the email — the contract never lapses by accident.
                    </span>
                    <span lang="zh">
                      續約前六十天,智能體主動提醒並備好信件初稿——合約不再因疏忽而失效。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Quarterly check-in &amp; QBR drafts</span>
                    <span lang="zh">季度回訪與 QBR 初稿</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      From the project history, the agent drafts the quarterly
                      review — what you delivered, what&rsquo;s next — ready for
                      you to send.
                    </span>
                    <span lang="zh">
                      智能體依專案歷史起草季度回顧——已交付什麼、下一步是什麼——供您直接寄出。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Birthday &amp; festival greetings</span>
                    <span lang="zh">生日與節慶問候</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Birthdays, Mid-Autumn, Lunar New Year — the agent drafts a
                      warm note to each client in your voice, personalized from
                      your last exchange.
                    </span>
                    <span lang="zh">
                      生日、中秋、農曆新年——智能體以您的語氣,參酌上次往來,為每位客戶起草一段溫馨問候。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Dormant-client wake-up</span>
                    <span lang="zh">喚醒沉睡客戶</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      A client has gone quiet for months; the agent reaches out
                      with what&rsquo;s genuinely new and worth their attention.
                    </span>
                    <span lang="zh">
                      客戶已沉寂數月,智能體主動以真正值得一提的新動態與其重新聯繫。
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
              <b>{slidePos(6)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 7 — Operations */}
        <article
          className={slideClass(7, 'outcome-slide function-slide')}
          data-slide="7"
        >
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                Agents for <em>Operations</em>
              </span>
              <span lang="zh">專屬營運智能體</span>
            </h2>
          </div>
          <div className="slide-body">
            <div className="func-cols">
              <div className="spotlight">
                <span className="spot-kicker">
                  <span lang="en">Featured · Four group chats, one brief</span>
                  <span lang="zh">焦點 · 四個群組,一份摘要</span>
                </span>
                <h3 className="spot-title">
                  <span lang="en">
                    Four group chats, read for you <em>by 8am.</em>
                  </span>
                  <span lang="zh">
                    四個群組,八點前<em>已為您讀完。</em>
                  </span>
                </h3>
                <div className="spot-flow">
                  <div className="spot-step">
                    <span className="spot-label">
                      <span lang="en">Scenario</span>
                      <span lang="zh">情境</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        Your operation runs across four WhatsApp groups —
                        suppliers, the warehouse, the storefront, the delivery
                        team. Something always happened overnight.
                      </span>
                      <span lang="zh">
                        貴司的營運分散在四個 WhatsApp
                        群組——供應商、倉庫、門市、配送團隊。每晚總有事情發生。
                      </span>
                    </p>
                  </div>
                  <div className="spot-step">
                    <span className="spot-label">
                      <span lang="en">Before</span>
                      <span lang="zh">過去</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        You scroll all four every morning, piecing together
                        what&rsquo;s urgent from hundreds of messages — and
                        still miss the one that mattered.
                      </span>
                      <span lang="zh">
                        您每早把四個群組逐一滑過,從數百則訊息中拼湊出哪些要緊——卻仍會漏掉最關鍵的那一則。
                      </span>
                    </p>
                  </div>
                  <div className="spot-step spot-after">
                    <span className="spot-label">
                      <span lang="en">After</span>
                      <span lang="zh">現在</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        The agent reads all four overnight and hands you a
                        five-line brief by 8am: what shipped, what&rsquo;s
                        stuck, what needs you today.
                      </span>
                      <span lang="zh">
                        智能體在夜間讀完四個群組,八點前交給您一份五行摘要:什麼已出貨、什麼卡住了、什麼今天需要您處理。
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="func-list">
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">SOP drafting → the Company Brain</span>
                    <span lang="zh">撰寫標準作業流程 → 公司大腦</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      New hires keep asking how to do something; the agent
                      writes the SOP, and files it in the Company Brain — a
                      central, queryable knowledge base the whole team can ask.
                    </span>
                    <span lang="zh">
                      新人反覆詢問某件事該怎麼做;智能體看您示範一次,便寫成標準作業流程,並歸入「公司大腦」——一個全團隊皆可查詢的中央知識庫。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Supplier chasing</span>
                    <span lang="zh">催辦供應商</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      The agent chases suppliers on schedule and escalates to
                      you only if there&rsquo;s no reply after 24 hours.
                    </span>
                    <span lang="zh">
                      智能體按時催辦供應商,逾 24 小時仍無回覆時才上報給您。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Sourcing comparison</span>
                    <span lang="zh">採購比價</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Need a part or a product? The agent compares five sellers
                      and hands you a ranked shortlist, not a search tab.
                    </span>
                    <span lang="zh">
                      需要某項零件或產品?智能體比較五家賣家,交給您一份排序後的精選名單,而非一個搜尋分頁。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Deliverable tracking</span>
                    <span lang="zh">交付追蹤</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Five jobs, thirty deliverables; the agent tracks every one
                      and flags slippage before the client notices.
                    </span>
                    <span lang="zh">
                      五個專案、三十項交付;智能體逐一追蹤,在客戶察覺之前先示警進度落後。
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
              <b>{slidePos(7)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 8 — Money & compliance */}
        <article
          className={slideClass(8, 'outcome-slide function-slide')}
          data-slide="8"
        >
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                Agents for <em>Accounting</em>
              </span>
              <span lang="zh">專屬帳務與合規智能體</span>
            </h2>
          </div>
          <div className="slide-body">
            <div className="func-cols">
              <div className="spotlight">
                <span className="spot-kicker">
                  <span lang="en">Featured · The margin-watch agent</span>
                  <span lang="zh">焦點 · 利潤率監控代理</span>
                </span>
                <h3 className="spot-title">
                  <span lang="en">
                    No single sale looks wrong. <em>The trend is.</em>
                  </span>
                  <span lang="zh">
                    沒有一筆銷售看起來不對。<em>趨勢是對的。</em>
                  </span>
                </h3>
                <div className="spot-flow">
                  <div className="spot-step">
                    <span className="spot-label">
                      <span lang="en">Scenario</span>
                      <span lang="zh">情境</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        A product line still sells fine. But freight crept up, a
                        key input got pricier, and nobody re-priced — margin has
                        quietly slipped three points over four months.
                      </span>
                      <span lang="zh">
                        今天的現金沒問題。但三週後,兩筆大額帳款逾期未收,又恰逢一筆供應商款項到期——卻沒有人算過這筆帳。
                      </span>
                    </p>
                  </div>
                  <div className="spot-step">
                    <span className="spot-label">
                      <span lang="en">Before</span>
                      <span lang="zh">過去</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        You spot it in the quarterly review, after a full
                        quarter of selling at the wrong price. The fix is
                        retroactive, and the lost margin is gone.
                      </span>
                      <span lang="zh">
                        您在季度審查中發現,經過四個月的錯誤定價後,利潤率已下滑三個百分點。修正是追溯性的,損失的利潤已經無法挽回。
                      </span>
                    </p>
                  </div>
                  <div className="spot-step spot-after">
                    <span className="spot-label">
                      <span lang="en">After</span>
                      <span lang="zh">現在</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        The agent tracks margin by line against cost inputs and
                        flags the drift early: this line is down three points
                        since January, driven by freight and materials. Re-price
                        now, not in April.
                      </span>
                      <span lang="zh">
                        智能體追蹤每條產品的利潤率,早期發現偏差:這條產品的利潤率自一月以來下降了三個百分點,主要是由於運費和原材料的價格上漲。現在重新定價,而不是四月。
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="func-list">
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Compliance-deadline tracker</span>
                    <span lang="zh">合規期限追蹤</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Licence, MPF, and tax deadlines tracked, with 30/14/7-day
                      reminders — you never pay a late penalty again.
                    </span>
                    <span lang="zh">
                      牌照、強積金與稅務期限全程追蹤,提前 30/14/7
                      天提醒——不再因逾期而受罰。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Overdue-invoice chasing</span>
                    <span lang="zh">逾期帳款催收</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Overdue invoices chased on a schedule — gentle at 30 days,
                      firm at 45, escalated to you at 60.
                    </span>
                    <span lang="zh">
                      逾期帳款依排程催收——30 天溫和、45 天正式、60 天上報給您。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Quote and invoice generation</span>
                    <span lang="zh">報價與發票生成</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Standard quote, standard invoice, customer email request.
                      Agent generates the draft, you approve.
                    </span>
                    <span lang="zh">
                      標準報價、標準發票,客戶郵件申請。智能體生成初稿,您批准。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Monthly P&L prep for accountant.</span>
                    <span lang="zh">月度損益表準備</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Agent compiles the breakdown your bookkeeper asks for
                      every month.
                    </span>
                    <span lang="zh">智能體編製會計師每月要求的損益表分解</span>
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
              <b>{slidePos(8)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 9 — People & team (HR) */}
        <article
          className={slideClass(9, 'outcome-slide function-slide')}
          data-slide="9"
        >
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                Agents for <em>Human Resources</em>
              </span>
              <span lang="zh">專屬人事與團隊智能體</span>
            </h2>
          </div>
          <div className="slide-body">
            <div className="func-cols">
              <div className="spotlight">
                <span className="spot-kicker">
                  <span lang="en">
                    Featured · The employee-handbook assistant
                  </span>
                  <span lang="zh">焦點 · 員工手冊助理</span>
                </span>
                <h3 className="spot-title">
                  <span lang="en">
                    The handbook that <em>answers back.</em>
                  </span>
                  <span lang="zh">
                    晚上十一點的政策疑問,<em>此刻就有答案。</em>
                  </span>
                </h3>
                <div className="spot-flow">
                  <div className="spot-step">
                    <span className="spot-label">
                      <span lang="en">Scenario</span>
                      <span lang="zh">情境</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        It&rsquo;s 11pm. An employee needs the parental-leave
                        policy to finish a form tonight — and HR is asleep.
                      </span>
                      <span lang="zh">
                        晚上十一點。一位員工今晚要填一份表格,需要查育嬰假政策——而人資已經下班。
                      </span>
                    </p>
                  </div>
                  <div className="spot-step">
                    <span className="spot-label">
                      <span lang="en">Before</span>
                      <span lang="zh">過去</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        The question sits in HR&rsquo;s inbox for sixteen hours.
                        The form waits. The same handful of policy questions
                        land on HR every week, each one breaking someone&rsquo;s
                        focus.
                      </span>
                      <span lang="zh">
                        這個問題在人資的收件匣裡躺了十六個小時。表格只能等。同樣幾個政策問題每週都會落到人資身上,每一次都打斷某人的工作。
                      </span>
                    </p>
                  </div>
                  <div className="spot-step spot-after">
                    <span className="spot-label">
                      <span lang="en">After</span>
                      <span lang="zh">現在</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        The employee asks the handbook assistant directly and
                        gets the exact policy, in plain language, in seconds —
                        any hour, any day. HR only hears about the genuine
                        exceptions.
                      </span>
                      <span lang="zh">
                        員工直接向手冊助理提問,數秒內便得到準確的政策說明,以淺白的文字呈現——任何時間、任何一天皆可。人資只需處理真正的例外情況。
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="func-list">
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">New-hire onboarding</span>
                    <span lang="zh">新人入職</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      A new hire&rsquo;s first-week questions are answered
                      automatically; the agent walks them through the tools,
                      account setup, and how things are done here.
                    </span>
                    <span lang="zh">
                      新人首週的問題自動獲得解答;智能體逐步引導他們熟悉工具、帳號設定,以及這裡的做事方式。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Job-description drafts</span>
                    <span lang="zh">職缺說明初稿</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Hiring for a role? The agent drafts the job description
                      from your past postings and what you tell it about the
                      need.
                    </span>
                    <span lang="zh">
                      要招募新職位?智能體依您過往的職缺說明,以及您對需求的描述,起草職缺說明。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Exit-interview debrief</span>
                    <span lang="zh">離職面談摘要</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      The agent runs the exit interview, then summarizes the
                      themes: compensation, manager, growth, so every departure
                      is captured the same way
                    </span>
                    <span lang="zh">
                      智能體進行離職面談,然後總結主題:薪酬、管理、成長,以便每次離職都能以相同的方式被捕捉。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Performance review</span>
                    <span lang="zh">績效審查提示</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Agent pulls each person&apos;s work for review season, and
                      compares it to their previous performance.
                    </span>
                    <span lang="zh">每季度智能體向每位員工審查其績效。</span>
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
              <b>{slidePos(9)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 10 — Brand & marketing */}
        <article
          className={slideClass(10, 'outcome-slide function-slide')}
          data-slide="10"
        >
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                Agents for <em>Marketing</em>
              </span>
              <span lang="zh">專屬品牌與行銷智能體</span>
            </h2>
          </div>
          <div className="slide-body">
            <div className="func-cols">
              <div className="spotlight">
                <span className="spot-kicker">
                  <span lang="en">Featured · THE TREND YOU CAUGHT IN TIME</span>
                  <span lang="zh">焦點 · 您捕捉到的趨勢</span>
                </span>
                <h3 className="spot-title">
                  <span lang="en">
                    It spots what&apos;s moving <em>while it still matters.</em>
                  </span>
                  <span lang="zh">
                    它發現什麼正在發生<em>而它仍然重要。</em>
                  </span>
                </h3>
                <div className="spot-flow">
                  <div className="spot-step">
                    <span className="spot-label">
                      <span lang="en">Scenario</span>
                      <span lang="zh">情境</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        A format, topic, or product angle starts gaining
                        traction on Xiaohongshu and IG in your category. The
                        window to ride it is short.
                      </span>
                      <span lang="zh">
                        您錄了一集精彩的
                        podcast。整整一小時的紮實內容——如今卻只是躺在播放清單裡,無人問津。
                      </span>
                    </p>
                  </div>
                  <div className="spot-step">
                    <span className="spot-label">
                      <span lang="en">Before</span>
                      <span lang="zh">過去</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        You hear about it once it&apos;s everywhere — from a
                        competitor&apos;s post that&apos;s already done the
                        numbers. By the time you react, the moment has passed
                        and the post feels late.
                      </span>
                      <span lang="zh">
                        您得知它已經到處都是——來自競爭對手的貼文,已經算過數字。等到您反應過來,時機已經過了,貼文看起來已經太晚。
                      </span>
                    </p>
                  </div>
                  <div className="spot-step spot-after">
                    <span className="spot-label">
                      <span lang="en">After</span>
                      <span lang="zh">現在</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        The agent watches your category daily and flags
                        what&apos;s gaining traction while it&apos;s still
                        early: this angle is climbing, here&apos;s a post
                        drafted in your voice — ready before everyone else piles
                        in.
                      </span>
                      <span lang="zh">
                        智能體每日監控您的類別,早期發現正在流行的角度:這個角度正在上升,這裡有一篇貼文以您的語氣撰寫——準備在其他人湧入之前發佈。
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="func-list">
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">LinkedIn drafts</span>
                    <span lang="zh">LinkedIn 貼文初稿</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Three posts a week, drafted from what&rsquo;s actually
                      happening in the business — you approve, the feed stays
                      alive.
                    </span>
                    <span lang="zh">
                      每週三篇貼文,取材自業務的真實動態——您核可後發佈,讓動態保持活躍。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Review replies</span>
                    <span lang="zh">評論回覆</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Google reviews are answered in your voice, within the day
                      — no review sits ignored.
                    </span>
                    <span lang="zh">
                      Google
                      上的評論,當日內以您的語氣回覆——沒有一則評論被晾在一旁。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Newsletter & EDM drafts</span>
                    <span lang="zh">電子報與 EDM 初稿</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Newsletter and EDM drafts are generated from your brand
                      voice, ready to schedule.
                    </span>
                    <span lang="zh">
                      電子報與 EDM 初稿以您的品牌語氣生成,隨時可排程發佈。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Blog & SEO drafts</span>
                    <span lang="zh">部落格與 SEO 初稿</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Articles drafted around what customers actually search for
                      in your market, keeping the site relevant and page rank
                      high.
                    </span>
                    <span lang="zh">
                      文章以客戶實際搜索的關鍵詞為中心,保持網站相關且頁面排名高。
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
              <b>{slidePos(10)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 11 — The owner's view (Decision support) */}
        <article
          className={slideClass(11, 'outcome-slide function-slide')}
          data-slide="11"
        >
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                Agents for <em>You</em>
              </span>
              <span lang="zh">專屬經營者全局的智能體</span>
            </h2>
          </div>
          <div className="slide-body">
            <div className="func-cols">
              <div className="spotlight">
                <span className="spot-kicker">
                  <span lang="en">Featured · Your personal Chief of Staff</span>
                  <span lang="zh">焦點 · 您的個人首席幕僚長</span>
                </span>
                <h3 className="spot-title">
                  <span lang="en">
                    A chief of staff who&rsquo;s <em>already up.</em>
                  </span>
                  <span lang="zh">
                    一位早已起身的<em>幕僚長。</em>
                  </span>
                </h3>
                <div className="spot-flow">
                  <div className="spot-step">
                    <span className="spot-label">
                      <span lang="en">Scenario</span>
                      <span lang="zh">情境</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        It&rsquo;s 7am. You have four meetings, a full inbox,
                        and two people you&rsquo;re seeing today whose names you
                        half-remember.
                      </span>
                      <span lang="zh">
                        早上七點。您有四場會議、一個滿溢的收件匣,以及兩位今天要見、名字卻只記得一半的人。
                      </span>
                    </p>
                  </div>
                  <div className="spot-step">
                    <span className="spot-label">
                      <span lang="en">Before</span>
                      <span lang="zh">過去</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        You spend the first ninety minutes triaging email,
                        looking people up, and reconstructing where each thread
                        left off — before the real work starts.
                      </span>
                      <span lang="zh">
                        您花掉頭 90
                        分鐘整理郵件、查找人物、回想每段對話進行到哪——真正的工作還沒開始。
                      </span>
                    </p>
                  </div>
                  <div className="spot-step spot-after">
                    <span className="spot-label">
                      <span lang="en">After</span>
                      <span lang="zh">現在</span>
                    </span>
                    <p className="spot-text">
                      <span lang="en">
                        By the time you sit down, the agent has already read
                        your email and calendar, researched the people and
                        companies you&rsquo;ll see, and laid out the day. Where
                        a reply is needed, it asks how you&rsquo;d like to
                        respond — then drafts it. You make the calls; it does
                        the work.
                      </span>
                      <span lang="zh">
                        當您坐下時,智能體已讀完您的郵件與行事曆,研究過今天要見的人與公司,並把一天整理妥當。需要回覆之處,它先問您想怎麼回應——再代為起草。您做判斷,它來執行。
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="func-list">
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Monday-morning brief</span>
                    <span lang="zh">週一晨間簡報</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Five bullets by 8:30 Monday: what shipped, what&rsquo;s
                      blocked, what needs your call.
                    </span>
                    <span lang="zh">
                      週一上午八點半,五個要點:什麼已完成、什麼卡住了、什麼待您裁決。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Risk &amp; opportunity scan</span>
                    <span lang="zh">風險與機會掃描</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Churn signals, supplier trouble, team capacity — the agent
                      flags them while they&rsquo;re still small.
                    </span>
                    <span lang="zh">
                      流失徵兆、供應商問題、團隊負荷——智能體在它們還小的時候就先示警。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Pre-meeting notes</span>
                    <span lang="zh">會前筆記</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      1 hour before any meeting, agent drops a 1-page brief: who
                      you&apos;re meeting, what was last discussed, talking
                      points.
                    </span>
                    <span lang="zh">
                      會前1小時,智能體交給您一份1頁的簡報:您要見的人、上次討論的內容、討論重點。
                    </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Competitor tracking</span>
                    <span lang="zh">競爭對手追蹤</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Five competitors watched daily; the agent hands you one
                      weekly digest of what actually changed.
                    </span>
                    <span lang="zh">
                      每日追蹤五個競爭對手;智能體每週交給您一份摘要,只談真正有變動的部分。
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
              <b>{slidePos(11)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 12 — The process (three pillars) */}
        <article className={slideClass(12)} data-slide="12">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              <span lang="en">
                The <em>Process</em>
              </span>
              <span lang="zh">
                服務<em>流程</em>
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
              <b>{slidePos(12)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 13 — Phase 1: Discovery · How it works */}
        <article className={slideClass(13, 'phase-detail')} data-slide="13">
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
                  <span lang="en">The Process</span>
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
              <b>{slidePos(13)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 14 — Phase 1: Discovery · What you get */}
        <article className={slideClass(14, 'phase-detail')} data-slide="14">
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
              <b>{slidePos(14)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 15 — Phase 2: Pilot */}
        <article className={slideClass(15, 'phase-detail')} data-slide="15">
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
              <b>{slidePos(15)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 16 — Phase 3: Run at scale */}
        <article className={slideClass(16, 'phase-detail')} data-slide="16">
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
              <b>{slidePos(16)}</b> / {total}
            </span>
          </footer>
        </article>

        {/* Slide 17 — Thank you */}
        <article className={slideClass(17, 'thanks-slide')} data-slide="17">
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
              <b>{slidePos(17)}</b> / {total}
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
