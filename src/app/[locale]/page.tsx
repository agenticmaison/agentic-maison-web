import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContactForm } from '@/components/contact-form';
import { SheetShell } from '@/components/sheet-shell';
import { HeroMechanismLayers } from '@/components/hero-mechanism-layers';
import { journalEntries } from '@/lib/journal/entries';
import { isLocale, type Locale } from '@/i18n/config';
import { localePath } from '@/i18n/paths';

/**
 * Agentic Maison landing — Iteration F (animated-mechanism-v2).
 *
 * Single-page architecture:
 *   Hero -> About (The Maison) -> Process -> Other Work -> Journal -> Contact
 *
 * The two-column grid (left content | 1px rule | right sticky mechanism)
 * spans Hero through Journal. Contact sits outside the grid below.
 *
 * Visible strings are bilingual via <span lang="en"> / <span lang="zh">;
 * globals.css hides the inactive one based on [data-lang] on <html>.
 */

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;

  return (
    <SheetShell locale={locale}>
      <main>
        {/* ============================================================
            MECHANISM STAGE — Hero through Journal
            Two-column grid: left content scrolls, right mechanism sticks.
            ============================================================ */}
        <section
          className="grid grid-cols-[1.1fr_1px_1fr] max-[980px]:grid-cols-1 border-b border-rule relative"
          aria-label="The Company Brain"
        >
          {/* LEFT COLUMN — all scrolling content */}
          <div className="grid">
            {/* ── Hero ────────────────────────────────────────────── */}
            <div
              className={
                'pt-[clamp(4.5rem,11vh,9rem)] px-[clamp(1.5rem,3vw,3rem)] pb-[clamp(3rem,6vw,5rem)] min-h-[90vh] max-[980px]:min-h-0 ' +
                'border-b border-rule grid content-start gap-[clamp(3rem,5.5vw,4.5rem)] header-offset'
              }
              data-section="hero"
            >
              <h1 className="font-display font-semibold text-[clamp(2.6rem,5.5vw,4.8rem)] leading-[1.02] tracking-[-0.022em] m-0 [&_em]:italic [&_em]:font-bold [&_em]:text-brass">
                <span lang="en">
                  Systems for the routine. Agents for the exceptional.
                </span>
                <span lang="zh">讓系統處理日常，讓智能體處理非凡。</span>
              </h1>
              <div className="flex flex-wrap gap-y-[0.85rem] gap-x-[1.25rem] items-center mt-[0.25rem]">
                <Link
                  className="cta cta-primary"
                  href={localePath(locale, '/#contact')}
                >
                  <span lang="en">Enquire</span>
                  <span lang="zh">諮詢</span>
                </Link>
                <Link
                  className="cta cta-secondary"
                  href={localePath(locale, '/#maison')}
                >
                  <span lang="en">Learn more</span>
                  <span lang="zh">了解更多</span>
                </Link>
              </div>
            </div>

            {/* ── Mobile-only mechanism block ─────────────────────── */}
            <div
              data-mech-runway
              className="min-[981px]:hidden bg-grid-paper border-b border-rule relative isolate overflow-hidden h-[78svh] min-h-[460px] max-h-[640px] grid grid-rows-[auto_1fr_auto] p-[clamp(1.25rem,3vw,2rem)] gap-[1rem]"
              aria-hidden="true"
            >
              <div className="plate-head text-[0.7rem] tracking-[0.14em]">
                <span>
                  <span lang="en">
                    Fig. 01a — <b>The Company Brain · gear-train view</b>
                  </span>
                  <span lang="zh">
                    圖 1a — <b>公司大腦 · 齒輪傳動視圖</b>
                  </span>
                </span>
              </div>
              <HeroMechanismLayers />
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

            {/* ── About (The Maison) ─────────────────────────────── */}
            <div
              className="px-[clamp(1.5rem,3vw,3rem)] py-[clamp(2.5rem,5vw,4rem)] min-h-[110vh] max-[980px]:min-h-0 border-b border-rule max-[980px]:border-b header-offset"
              id="maison"
              data-section="about"
            >
              <span className="section-index">
                <span lang="en">What we build, and why it holds</span>
                <span lang="zh">我們建造什麼，以及為何它能撐住</span>
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
                    Every business runs on a collection of systems — and most of
                    those systems depend on manual operation — each with its own
                    rhythm, each with its own quiet logic. We build the
                    architecture that removes those points of failure: AI
                    agents, designed to the operator&apos;s logic, running the
                    operational work that currently doesn&apos;t scale.
                  </span>
                  <span lang="zh">
                    每個業務都運行著一套系統——其中多數系統仍然依賴人工操作——各自有著自己的節奏、各自有著自己的內在邏輯。我們建構一套架構來消除那些故障點：AI
                    智能體，按操作者的邏輯設計，執行目前無法擴展的營運工作。
                  </span>
                </p>
                <p>
                  <span lang="en">
                    What we build is specific to each engagement. Agents shaped
                    around your actual workflows — not templates, not
                    off-the-shelf automation. Research conducted to your brief.
                    Drafts produced in your voice. Qualification run to your
                    criteria. Follow-up handled at your standard. The
                    reliability of AI agents on real operational tasks has
                    quadrupled in the past year; what remains difficult is
                    designing systems precise enough to hold inside a business
                    that runs on judgment, not just rules.
                  </span>
                  <span lang="zh">
                    我們建造的東西針對每個項目量身定做。智能體根據你實際的工作流設計——不是範本，不是現成自動化。研究依據你的簡介進行。草稿以你的聲音產生。資格審查按你的標準進行。後續追蹤按你的標準進行。在真實營運任務上，AI
                    智能體的可靠性在過去一年提高三倍；困難的是設計足夠精密的系統，足以在以判斷而非規則運作的業務中保持運作。
                  </span>
                </p>
                <p>
                  <span lang="en">
                    The result is structural. Information surfaces before you
                    ask for it. Decisions move without waiting for you to be in
                    the room. Operations carry themselves. The business gains
                    capacity it didn&apos;t have to hire for.{' '}
                    <em>The maison holds</em> — and you spend your time on the
                    work that actually requires you.
                  </span>
                  <span lang="zh">
                    結果是結構性的。資訊在你開口前便浮現。決策無需你在場就能推進。營運自行運轉。業務獲得它無須雇用就能有的能力。這座工坊撐住了——你把時間投注在真正需要你的工作上。
                  </span>
                </p>
              </div>
            </div>

            {/* ── Process ────────────────────────────────────────── */}
            <div
              className="px-[clamp(1.5rem,3vw,3rem)] py-[clamp(2.5rem,5vw,4rem)] border-b border-rule max-[980px]:border-b header-offset"
              id="process"
              data-section="process"
            >
              <span className="section-index">
                <span lang="en">Three phases, one outcome</span>
                <span lang="zh">三個階段，一個結果</span>
              </span>
              <h2 className="section-h2 mb-[clamp(1.5rem,3vw,2.25rem)] text-ink">
                <span lang="en">
                  The <em>Process</em>.
                </span>
                <span lang="zh">
                  <em>過程</em>。
                </span>
              </h2>
              <div className="grid gap-[clamp(2rem,4vw,3rem)] max-w-[56ch]">
                {/* Discover */}
                <div className="grid gap-[0.5rem]">
                  <h3 className="font-display font-semibold text-[clamp(1.35rem,2vw,1.65rem)] leading-[1.15] tracking-[-0.01em] m-0 text-ink">
                    <span lang="en">
                      <em className="text-brass italic">Discover</em>
                    </span>
                    <span lang="zh">
                      <em className="text-brass italic">探索</em>
                    </span>
                  </h3>
                  <p className="font-body text-[clamp(1.02rem,1.15vw,1.12rem)] leading-[1.68] text-ink-2 m-0 max-w-[52ch]">
                    <span lang="en">
                      We map your workflows, identify where AI creates
                      leverage, and propose a pilot. You receive a written audit
                      and a ranked roadmap of opportunities, whether or not you
                      decide to continue.
                    </span>
                    <span lang="zh">
                      我們繪製你的工作流，識別 AI
                      創造槓桿的地方，並提出試點建議。你將獲得書面審計——機會排名路線圖——無論你是否決定繼續。
                    </span>
                  </p>
                </div>
                {/* Pilot */}
                <div className="grid gap-[0.5rem]">
                  <h3 className="font-display font-semibold text-[clamp(1.35rem,2vw,1.65rem)] leading-[1.15] tracking-[-0.01em] m-0 text-ink">
                    <span lang="en">
                      <em className="text-brass italic">Pilot</em>
                    </span>
                    <span lang="zh">
                      <em className="text-brass italic">試點</em>
                    </span>
                  </h3>
                  <p className="font-body text-[clamp(1.02rem,1.15vw,1.12rem)] leading-[1.68] text-ink-2 m-0 max-w-[52ch]">
                    <span lang="en">
                      We build and run one workflow end-to-end. Your team uses
                      it in production. We measure the outcome, iterate based on
                      what happens, and you decide whether to scale.
                    </span>
                    <span lang="zh">
                      我們端到端構建並運行一個工作流。你的團隊在生產環境中使用它。我們衡量結果，根據實際情況進行迭代，你決定是否擴展。
                    </span>
                  </p>
                </div>
                {/* Orchestrate */}
                <div className="grid gap-[0.5rem]">
                  <h3 className="font-display font-semibold text-[clamp(1.35rem,2vw,1.65rem)] leading-[1.15] tracking-[-0.01em] m-0 text-ink">
                    <span lang="en">
                      <em className="text-brass italic">Orchestrate</em>
                    </span>
                    <span lang="zh">
                      <em className="text-brass italic">協調</em>
                    </span>
                  </h3>
                  <p className="font-body text-[clamp(1.02rem,1.15vw,1.12rem)] leading-[1.68] text-ink-2 m-0 max-w-[52ch]">
                    <span lang="en">
                      We operate your agents on retainer. We monitor them, tune
                      them monthly, and surface new automation opportunities
                      from what actually happens in production.
                    </span>
                    <span lang="zh">
                      我們在顧問基礎上運行你的智能體。我們監控它們，每月調整，並根據生產環境中發生的實際情況提出新的自動化機會。
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* ── Other Work ─────────────────────────────────────── */}
            <div
              className="px-[clamp(1.5rem,3vw,3rem)] py-[clamp(2rem,4vw,3rem)] border-b border-rule max-[980px]:border-b header-offset"
              id="other-work"
              data-section="other-work"
            >
              <span className="section-index">
                <span lang="en">When the business needs more than systems</span>
                <span lang="zh">當業務需要超越系統</span>
              </span>
              <h2 className="section-h2 mb-[clamp(1rem,2vw,1.5rem)] text-ink text-[clamp(1.6rem,3.2vw,2.6rem)]">
                <span lang="en">
                  Other <em>Work</em>.
                </span>
                <span lang="zh">
                  其他<em>工作</em>。
                </span>
              </h2>
              <p className="font-body text-[clamp(1.02rem,1.15vw,1.12rem)] leading-[1.68] text-ink-3 m-0 max-w-[52ch]">
                <span lang="en">
                  We also design and build bespoke digital
                  experiences — custom websites, brand systems, and
                  applications — for companies that demand the same rigor in
                  their digital presence as they do in their operations.
                  Designed in-house, built with intention, built to endure.
                </span>
                <span lang="zh">
                  我們還為那些要求數位形象與營運同等嚴謹的公司設計和構建定制數位體驗——自訂網站、品牌系統和應用程式。內部設計、刻意構建、為持久而建。
                </span>
              </p>
              <div className="mt-[clamp(1rem,2vw,1.5rem)]">
                <Link
                  className="font-mono text-[0.74rem] tracking-[0.14em] uppercase text-ink border-b border-ink pb-[4px] w-fit inline-flex transition-colors duration-200 hover:text-brass hover:border-brass"
                  href={localePath(locale, '/digital')}
                >
                  <span lang="en">The Digital Practice →</span>
                  <span lang="zh">數位實踐 →</span>
                </Link>
              </div>
            </div>

            {/* ── Journal ────────────────────────────────────────── */}
            <div
              className="py-[clamp(2.5rem,5vw,4rem)] px-[clamp(1.5rem,3vw,3rem)] header-offset"
              id="journal"
              data-section="journal"
            >
              <div className="block p-0">
                <span className="section-index">
                  <span lang="en">Leaves from the Journal</span>
                  <span lang="zh">札記之葉</span>
                </span>
                <h2 className="section-h2">
                  <span lang="en">
                    The <em>Journal</em>.
                  </span>
                  <span lang="zh">
                    <em>札記</em>。
                  </span>
                </h2>
              </div>
              <div
                className={
                  'mt-[clamp(1.5rem,3vw,2rem)] grid gap-0 border-t border-rule ' +
                  (journalEntries.length === 1
                    ? 'grid-cols-1'
                    : journalEntries.length === 2
                      ? 'grid-cols-2 max-[880px]:grid-cols-1'
                      : 'grid-cols-3 max-[880px]:grid-cols-1')
                }
              >
                {journalEntries.map((entry) => (
                  <Link
                    key={entry.slug}
                    className="leaf"
                    href={localePath(locale, `/journal/${entry.slug}`)}
                  >
                    <span className="leaf-meta">
                      <span className="font-mono text-[0.66rem] tracking-[0.16em] uppercase text-brass">
                        {entry.num}
                      </span>
                      <span className="leaf-date">
                        <span lang="en">{entry.dateDisplay.en}</span>
                        <span lang="zh">{entry.dateDisplay.zh}</span>
                      </span>
                    </span>
                    <h3 className="leaf-title">
                      <span lang="en">{entry.leafTitle.en}</span>
                      <span lang="zh">{entry.leafTitle.zh}</span>
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Center vertical rule */}
          <div className="bg-rule max-[980px]:hidden" aria-hidden="true" />

          {/* RIGHT — sticky schematic */}
          <div className="relative max-[980px]:hidden">
            <div
              data-mech-sticky
              className="bg-grid-paper sticky top-[var(--header-band-h)] h-[calc(100svh-var(--header-band-h))] grid grid-rows-[auto_1fr_auto] p-[clamp(1.5rem,3vw,2.5rem)] gap-[1.25rem]"
            >
              <div className="plate-head text-[0.7rem] tracking-[0.14em]">
                <span>
                  <span lang="en">
                    Fig. 01a — <b>The Company Brain · gear-train view</b>
                  </span>
                  <span lang="zh">
                    圖 1a — <b>公司大腦 · 齒輪傳動視圖</b>
                  </span>
                </span>
              </div>
              <HeroMechanismLayers />
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

        {/* Hidden Services section — superseded by Process + Other Work */}
        <section id="services" className="hidden" aria-hidden="true" />

        {/* ============================================================
            CONTACT — outside the two-column grid
            ============================================================ */}
        <section
          className="bg-paper-2 border-t border-b border-rule header-offset"
          id="contact"
        >
          <div className="pt-[clamp(2rem,4vw,3rem)] px-[clamp(1.5rem,3vw,3rem)] pb-[clamp(2.5rem,5vw,4rem)] grid grid-cols-2 max-[980px]:grid-cols-1 gap-[clamp(2rem,4vw,4rem)] items-start">
            <div>
              <div className="block pt-0 px-0 pb-[clamp(1.25rem,2vw,1.75rem)]">
                <span className="section-index section-index--wide">
                  <span lang="en">Begin a correspondence.</span>
                  <span lang="zh">開始一段書信往來。</span>
                </span>
                <h2 className="section-h2 section-h2--wide">
                  <span lang="en">
                    Get <em>In Touch</em>.
                  </span>
                  <span lang="zh">
                    與我們<em>聯絡</em>。
                  </span>
                </h2>
              </div>
              <div className="[&_p]:font-body [&_p]:text-[1.08rem] [&_p]:leading-[1.7] [&_p]:text-ink [&_p]:m-0 [&_p]:mb-[1.1em] [&_p]:max-w-[50ch] [&_em]:text-brass-2 [&_em]:italic">
                <p>
                  <span lang="en">
                    For all inquiries, collaborations, further information, or
                    if you just want to say hi, please don&apos;t hesitate to
                    reach out.
                  </span>
                  <span lang="zh">
                    無論是諮詢、合作、進一步了解，或只是想打聲招呼，歡迎隨時與我們聯絡。
                  </span>
                </p>
              </div>
              <div className="grid gap-[1.5rem] content-start mt-[1.5rem]">
                <a
                  className="email-anchor"
                  href="mailto:studio@agenticmaison.com"
                >
                  studio@agenticmaison.com
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
    </SheetShell>
  );
}
