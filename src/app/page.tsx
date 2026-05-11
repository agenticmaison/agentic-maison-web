import Link from "next/link";
import { SheetShell } from "@/components/sheet-shell";
import { HeroMechanismSvg } from "@/components/hero-mechanism-svg";
import { PlateAiSvg, PlateDigitalSvg } from "@/components/plate-svgs";

/**
 * Agentic Maison landing — port of Iteration F (animated-mechanism-v2).
 * See: 1-projects/agentic-maison-launch/designs/landing-structure/animated-mechanism-v2/index.html
 *
 * Single-page architecture: Hero → The Maison → Services → Contact → Journal.
 * Visible strings are bilingual via <span lang="en"> / <span lang="zh">;
 * globals.css hides the inactive one based on [data-lang] on <html>.
 *
 * All interactive behaviors (theme/lang toggles, HKT clock, scroll-bound
 * mechanism, contact form date stamp, dynamic signoff) are wired up by
 * <AtelierControls /> rendered inside <SheetShell />.
 *
 * Styling: repeated UI patterns (CTAs, section headings, plate scaffold)
 * live as `@layer components` classes in globals.css — see the
 * "COMPONENT CLASSES" block there. Inline Tailwind is used for true
 * one-offs (per-section paddings, ad-hoc grids).
 */

export default function Home() {
  return (
    <SheetShell>
      <main>
      {/* ═══════════ MECHANISM STAGE — Hero + About. Schematic sticky on right. ═══════════ */}
      <section
        className="grid grid-cols-[1.1fr_1px_1fr] max-[980px]:grid-cols-1 border-b border-rule relative"
        aria-label="The Company Brain — Hero and About"
      >
        {/* LEFT — scrolling text: Hero + About only. */}
        <div className="grid">
          <div
            className={
              "pt-[clamp(4.5rem,11vh,9rem)] px-[clamp(1.5rem,3vw,3rem)] pb-[clamp(3rem,6vw,5rem)] " +
              "border-b border-rule grid content-start gap-[clamp(3rem,5.5vw,4.5rem)] header-offset"
            }
            data-section="hero"
          >
            <h1 className="font-display font-semibold text-[clamp(3.5rem,7.5vw,6.5rem)] leading-[0.96] tracking-[-0.022em] m-0 [&_em]:italic [&_em]:font-bold [&_em]:text-brass">
              <span lang="en">
                Run your business with <em>AI agents</em>.
              </span>
              <span lang="zh">
                用 <em>AI 智能體</em>
                <br />
                經營你的業務。
              </span>
            </h1>
            <div className="flex flex-wrap gap-y-[0.85rem] gap-x-[1.25rem] items-center mt-[0.25rem]">
              <Link className="cta cta-primary" href="#contact">
                <span lang="en">Enquire</span>
                <span lang="zh">諮詢</span>
              </Link>
              <Link className="cta cta-secondary" href="#maison">
                <span lang="en">Learn more</span>
                <span lang="zh">了解更多</span>
              </Link>
            </div>
          </div>

          {/* About — drop cap on lead paragraph spans 3 lines.
              `.opening-prose` class is preserved for the ::first-letter rule. */}
          <div
            className="px-[clamp(1.5rem,3vw,3rem)] py-[clamp(2.5rem,5vw,4rem)] min-h-[110vh] header-offset"
            id="maison"
            data-section="about"
          >
            <span className="section-index">
              <span lang="en">What we are, and what we are not</span>
              <span lang="zh">我們是什麼，以及不是什麼</span>
            </span>
            <h2 className="section-h2 section-h2--about text-ink">
              <span lang="en">
                The <em>Maison</em>.
              </span>
              <span lang="zh">
                <em>工坊</em>。
              </span>
            </h2>
            <div className="opening-prose max-w-[56ch] font-body text-[clamp(1.08rem,1.25vw,1.18rem)] leading-[1.72] text-ink [&_p]:m-0 [&_p]:mb-[1.15em] [&_p:last-child]:mb-0 [&_em]:text-brass-2 [&_em]:italic">
              <p className="lead">
                <span lang="en">
                  Every business is a small collection of disciplines — sales, operations, customer support, employee
                  performance, marketing — each with its own tempo and its own quiet logic. We build maisons that operate
                  them as a single instrument: a small team of specialist agents, one per discipline, each shaped around
                  the way the principal already runs that part of the company.
                </span>
                <span lang="zh">
                  每一門生意都是若干領域的集合 — 銷售、營運、客戶支援、員工表現、行銷 — 各有自己的節奏，各有自己安靜的邏輯。我們打造的工坊把這些領域當作一具樂器來操作：一支小而專的代理人團隊，一個領域配一位，每一位都依照委託人原本經營該環節的方式來設計。
                </span>
              </p>
              <p>
                <span lang="en">
                  The Playbook is where each engagement begins. We sit with the operator and write down the SOPs that
                  already live in their head — how a lead is qualified, how a delivery is sequenced, how a difficult
                  support ticket is handled, how a quarter is closed. Each play is then commissioned to an agent equipped
                  with the skills that play requires: research, drafting, retrieval, scheduling, dispatch. The agent runs
                  the play as the principal would have run it, and reports back.
                </span>
                <span lang="zh">
                  每次合作的起點是 Playbook。我們與委託人並坐，把原本只在他腦中存在的 SOP 一一寫下 — 如何篩選一位潛在客戶、如何安排一次交付、如何處理一張棘手的支援工單、如何收結一個季度。每一道流程隨後委託給一位具備所需技能的代理人：研究、撰寫、檢索、排程、發送。代理人以委託人原本的方式執行流程，並回報結果。
                </span>
              </p>
              <p>
                <span lang="en">
                  What this produces, day to day, is fewer fires and a steadier feed of insight. Sales activity is
                  tracked and summarised without anyone chasing a CRM. Employee performance is read against the work
                  itself, not the hours logged. Operations move on their own. Customer correspondence is answered in the
                  maison&apos;s voice within the hour. Marketing goes out on schedule.{" "}
                  <em>The principal stops being the bottleneck and starts being the architect</em> — which is, after all,
                  the part of the work they wanted to do in the first place.
                </span>
                <span lang="zh">
                  日復一日，所換來的是更少的救火，與更穩定的洞察流。銷售動態不再靠人追著 CRM 整理。員工表現是依工作本身評讀，不是依工時。營運自行運轉。客戶往來在一小時內以工坊的語氣回覆。行銷如期送出。
                  <em>委託人不再是瓶頸，而成為設計者</em> — 那本來就是他想做的部分。
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Center vertical rule between text and schematic. Hidden on narrow. */}
        <div className="bg-rule max-[980px]:hidden" aria-hidden="true" />

        {/* RIGHT — sticky schematic. */}
        <div className="relative max-[980px]:border-t max-[980px]:border-rule">
          <div className="bg-grid-paper sticky top-[var(--header-band-h)] h-[calc(100vh-var(--header-band-h))] grid grid-rows-[auto_1fr_auto] p-[clamp(1.5rem,3vw,2.5rem)] gap-[1.25rem] max-[980px]:relative max-[980px]:top-0 max-[980px]:h-auto max-[980px]:min-h-[480px]">
            <div className="plate-head text-[0.7rem] tracking-[0.14em]">
              <span>
                <span lang="en">Fig. 01a — <b>The Company Brain · gear-train view</b></span>
                <span lang="zh">圖 1a — <b>公司大腦 · 齒輪傳動視圖</b></span>
              </span>
              <span className="text-brass transition-colors duration-300">
                <span lang="en">State <span data-state>0</span> / 4</span>
                <span lang="zh">狀態 <span data-state-zh>0</span> / 4</span>
              </span>
            </div>
            <div className="plate-svg-wrap max-w-[560px]">
              {/* ASSET-SWAP POINT #F1 — see hero-mechanism-svg.tsx */}
              <HeroMechanismSvg />
            </div>
            <div className="plate-foot text-[0.66rem]">
              <span>
                <span lang="en">Drawn — atelier · Hong Kong</span>
                <span lang="zh">繪 — 工坊 · 香港</span>
              </span>
              <span>
                <span lang="en">Fig. 01a · Cal. AM·01</span>
                <span lang="zh">圖 1a · Cal. AM·01</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ SERVICES — TIPPED-IN PLATES (full container width) ═══════════ */}
      <section id="services" className="header-offset hidden">
        <div className="block pt-[clamp(2.5rem,5vw,4rem)] px-[clamp(1.5rem,3vw,3rem)] pb-0">
          <span className="section-index">
            <span lang="en">Two disciplines, drawn from the same hand.</span>
            <span lang="zh">兩門領域，出自同一隻手。</span>
          </span>
          <h2 className="section-h2">
            <span lang="en">The <em>Services</em>.</span>
            <span lang="zh"><em>服務</em>。</span>
          </h2>
        </div>

        <div className="pt-[clamp(2rem,4vw,3rem)] px-[clamp(1.5rem,3vw,3rem)] pb-[clamp(2.5rem,5vw,4rem)] grid gap-[clamp(2rem,4vw,3rem)]">
          {/* `.plate` scaffold lives in globals.css (component layer). It also
              receives `:nth-child(even)` column-flip and SVG hover animations. */}
          <Link className="plate" href="/services/ai">
            <div className="plate-image">
              <div className="plate-head">
                <span>
                  <span lang="en"><b>Plate II</b> — AI Practice</span>
                  <span lang="zh"><b>圖版 II</b> — AI 實踐</span>
                </span>
                <span>
                  <span lang="en">Scale 1 : 1</span>
                  <span lang="zh">比例 1 : 1</span>
                </span>
              </div>
              <div className="plate-svg-wrap">
                <PlateAiSvg />
              </div>
              <div className="plate-foot">
                <span>
                  <span lang="en">Drawn — atelier · Hong Kong</span>
                  <span lang="zh">繪 — 工坊 · 香港</span>
                </span>
                <span>
                  <span lang="en">Hover to engage</span>
                  <span lang="zh">懸浮以啟動</span>
                </span>
              </div>
            </div>
            <div className="plate-text">
              <span className="plate-fig">
                <span lang="en">Fig. 02 · AI Practice</span>
                <span lang="zh">圖 02 · AI 實踐</span>
              </span>
              <h3 className="plate-h3">
                <span lang="en">Intelligence, made <em>resident</em>.</span>
                <span lang="zh">讓智慧 · <em>駐於業務之中</em>。</span>
              </h3>
              <p className="plate-lede">
                <span lang="en">
                  We embed inside the business and build the AI that ought to already exist there — agents, internal
                  tools, custom evaluations, and the operating habits to keep them useful long past the demo.
                </span>
                <span lang="zh">
                  我們進駐業務之中，打造那些本應存在的 AI — 代理人、內部工具、訂製評估，以及讓它們在展示之後仍然有用的操作習慣。
                </span>
              </p>
              <ul className="plate-ref">
                <li><span lang="en">Agentic systems &amp; internal tools</span><span lang="zh">代理系統與內部工具</span></li>
                <li><span lang="en">Custom evaluations &amp; observability</span><span lang="zh">訂製評估與可觀察性</span></li>
                <li><span lang="en">Workflow redesign for AI-native ops</span><span lang="zh">為 AI 原生運營重新設計流程</span></li>
                <li><span lang="en">Quarterly retainer or fixed engagement</span><span lang="zh">季度顧問或定額合作</span></li>
              </ul>
              <span className="plate-more">
                <span lang="en">Enter the AI plate →</span>
                <span lang="zh">進入 AI 圖版 →</span>
              </span>
            </div>
          </Link>

          <Link className="plate" href="/services/digital">
            <div className="plate-image">
              <div className="plate-head">
                <span>
                  <span lang="en"><b>Plate III</b> — Digital Practice</span>
                  <span lang="zh"><b>圖版 III</b> — 數位實踐</span>
                </span>
                <span>
                  <span lang="en">Scale 1 : 1</span>
                  <span lang="zh">比例 1 : 1</span>
                </span>
              </div>
              <div className="plate-svg-wrap">
                <PlateDigitalSvg />
              </div>
              <div className="plate-foot">
                <span>
                  <span lang="en">Drawn — atelier · Hong Kong</span>
                  <span lang="zh">繪 — 工坊 · 香港</span>
                </span>
                <span>
                  <span lang="en">Hover to occupy</span>
                  <span lang="zh">懸浮以入駐</span>
                </span>
              </div>
            </div>
            <div className="plate-text">
              <span className="plate-fig">
                <span lang="en">Fig. 03 · Digital Practice</span>
                <span lang="zh">圖 03 · 數位實踐</span>
              </span>
              <h3 className="plate-h3">
                <span lang="en">Sites built like <em>buildings</em>.</span>
                <span lang="zh">如<em>建築</em>般打造的網站。</span>
              </h3>
              <p className="plate-lede">
                <span lang="en">
                  Bespoke web work for brands that want their digital presence to read with the same confidence as their
                  best print. Designed in-house, written with intent, built to last past a single refresh cycle.
                </span>
                <span lang="zh">
                  為希望數位形象與其最佳印刷品同樣自信的品牌，提供訂製網頁工作。內部設計，刻意撰寫，建造以經得起多次更新週期。
                </span>
              </p>
              <ul className="plate-ref">
                <li><span lang="en">Brand &amp; identity systems</span><span lang="zh">品牌與識別系統</span></li>
                <li><span lang="en">Site design, build &amp; CMS</span><span lang="zh">網站設計、建置與 CMS</span></li>
                <li><span lang="en">Bespoke applications &amp; portals</span><span lang="zh">訂製應用程式與入口網站</span></li>
                <li><span lang="en">Fixed-scope or studio retainer</span><span lang="zh">定範圍或工坊顧問</span></li>
              </ul>
              <span className="plate-more">
                <span lang="en">Enter the Digital plate →</span>
                <span lang="zh">進入數位圖版 →</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══════════ III — CONTACT (stacked head · prose + form card) ═══════════ */}
      <section className="bg-paper-2 border-t border-b border-rule header-offset" id="contact">
        <div className="pt-[clamp(2rem,4vw,3rem)] px-[clamp(1.5rem,3vw,3rem)] pb-[clamp(2.5rem,5vw,4rem)] grid grid-cols-2 max-[980px]:grid-cols-1 gap-[clamp(2rem,4vw,4rem)] items-start">
          <div>
            <div className="block pt-0 px-0 pb-[clamp(1.25rem,2vw,1.75rem)]">
              <span className="section-index section-index--wide">
                <span lang="en">Begin a correspondence.</span>
                <span lang="zh">開始一段書信往來。</span>
              </span>
              <h2 className="section-h2 section-h2--wide">
                <span lang="en"><em>Contact</em> Us.</span>
                <span lang="zh">與我們<em>聯絡</em>。</span>
              </h2>
            </div>
            <div className="[&_p]:font-body [&_p]:text-[1.08rem] [&_p]:leading-[1.7] [&_p]:text-ink [&_p]:m-0 [&_p]:mb-[1.1em] [&_p]:max-w-[50ch] [&_em]:text-brass-2 [&_em]:italic">
              <p>
                <span lang="en">
                  For all inquiries, collaborations, further information, or if you just want to say hi, please
                  don&apos;t hesitate to reach out.
                </span>
                <span lang="zh">
                  無論是諮詢、合作、進一步了解，或只是想打聲招呼，歡迎隨時與我們聯絡。
                </span>
              </p>
            </div>
            <div className="grid gap-[1.5rem] content-start mt-[1.5rem]">
              <a className="email-anchor" href="mailto:studio@agenticmaison.com">
                studio@agenticmaison.com
              </a>
            </div>
          </div>
          <form
            className="bg-paper border border-rule p-[clamp(1.75rem,3vw,2.5rem)] shadow-[0_1px_0_var(--rule)]"
            action="mailto:studio@agenticmaison.com"
            method="post"
            encType="text/plain"
            aria-label="Contact form"
          >
            <span className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-brass border-b border-rule pb-[0.9rem] mb-[1.5rem] block">
              <span lang="en">Hong Kong · <span data-form-date>—</span></span>
              <span lang="zh">香港 · <span data-form-date-zh>—</span></span>
            </span>
            <div className="mb-[1.1rem] grid gap-[0.5rem]">
              <label htmlFor="f-name" className="font-mono text-[0.66rem] tracking-[0.18em] uppercase text-brass">
                <span lang="en">Name</span>
                <span lang="zh">姓名</span>
              </label>
              <input
                className="am-input"
                type="text"
                id="f-name"
                name="name"
                autoComplete="name"
                required
                data-signoff-source
              />
            </div>
            <div className="mb-[1.1rem] grid gap-[0.5rem]">
              <label htmlFor="f-email" className="font-mono text-[0.66rem] tracking-[0.18em] uppercase text-brass">
                <span lang="en">Email</span>
                <span lang="zh">電子郵件</span>
              </label>
              <input className="am-input" type="email" id="f-email" name="email" autoComplete="email" required />
            </div>
            <div className="mb-[1.1rem] grid gap-[0.5rem]">
              <label htmlFor="f-company" className="font-mono text-[0.66rem] tracking-[0.18em] uppercase text-brass">
                <span lang="en">Company</span>
                <span lang="zh">公司</span>
                <span className="text-ink-3 ml-[0.25em]">
                  <span lang="en">(optional)</span>
                  <span lang="zh">（選填）</span>
                </span>
              </label>
              <input
                className="am-input"
                type="text"
                id="f-company"
                name="company"
                autoComplete="organization"
              />
            </div>
            <div className="mb-[1.1rem] grid gap-[0.5rem]">
              <label htmlFor="f-message" className="font-mono text-[0.66rem] tracking-[0.18em] uppercase text-brass">
                <span lang="en">Message</span>
                <span lang="zh">訊息</span>
              </label>
              <textarea className="am-input" id="f-message" name="message" rows={5} required />
            </div>
            <div className="mt-[1.5rem] font-body italic text-ink-2 text-[1rem] leading-[1.55] [&_em]:text-ink [&_em]:italic">
              <p>
                <span lang="en">With thanks,</span>
                <span lang="zh">謹此致謝，</span>
              </p>
              <p>
                <em>
                  <span lang="en">— <span data-signoff-name>your name</span></span>
                  <span lang="zh">— <span data-signoff-name-zh>您的署名</span></span>
                </em>
              </p>
            </div>
            <div className="mt-[1.5rem]">
              <button type="submit" className="cta cta-submit">
                <span lang="en">Send</span>
                <span lang="zh">寄出</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ═══════════ IV — JOURNAL (full-width) ═══════════ */}
      <section
        className="py-[clamp(2.5rem,5vw,4rem)] px-[clamp(1.5rem,3vw,3rem)] header-offset hidden"
        id="journal"
      >
        <div className="block p-0">
          <span className="section-index">
            <span lang="en">IV — Journal</span>
            <span lang="zh">IV — 札記</span>
          </span>
          <h2 className="section-h2">
            <span lang="en">Leaves from the <em>journal</em>.</span>
            <span lang="zh">札記之<em>葉</em>。</span>
          </h2>
        </div>
        <div className="mt-[clamp(1.5rem,3vw,2rem)] grid grid-cols-3 max-[880px]:grid-cols-1 gap-0 border-t border-rule">
          {[
            {
              num: "No. 001",
              date: "2026 · 04 · 28 — Hong Kong",
              en: <>On building agents that <em>survive</em> their first quarter.</>,
              zh: <>論代理人如何<em>熬過</em>第一季。</>,
            },
            {
              num: "No. 002",
              date: "2026 · 04 · 14 — Hong Kong",
              en: <>A site is a <em>building</em>, not a brochure.</>,
              zh: <>網站是<em>建築</em>，而非小冊子。</>,
            },
            {
              num: "No. 003",
              date: "2026 · 03 · 30 — Hong Kong",
              en: <>Why we draw the work out by <em>hand</em>.</>,
              zh: <>為何我們以<em>手</em>繪製工作。</>,
            },
          ].map((leaf) => (
            <a key={leaf.num} className="leaf" href="#journal">
              <span className="leaf-num">{leaf.num}</span>
              <span className="leaf-date">{leaf.date}</span>
              <h3 className="leaf-title">
                <span lang="en">{leaf.en}</span>
                <span lang="zh">{leaf.zh}</span>
              </h3>
              <span className="leaf-more">
                <span lang="en">Read leaf →</span>
                <span lang="zh">閱覽 →</span>
              </span>
            </a>
          ))}
        </div>
      </section>
      </main>
    </SheetShell>
  );
}
