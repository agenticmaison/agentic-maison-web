import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContactForm } from '@/components/contact-form';
import { SheetShell } from '@/components/sheet-shell';
import { HeroMechanismLayers } from '@/components/hero-mechanism-layers';
import {
  getJournalEntries,
  JOURNAL_LANDING_LIMIT,
} from '@/lib/journal/entries';
import { isLocale, type Locale } from '@/i18n/config';
import { localePath } from '@/i18n/paths';

/**
 * Agentic Maison landing — Iteration F (animated-mechanism-v2).
 *
 * Single-page architecture:
 *   Hero -> About (The Maison) -> Process (two-column grid with sticky mechanism),
 *   then Contact,
 *   then Journal -> Other Work (full width below Contact).
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
  const landingJournalEntries = getJournalEntries({
    limit: JOURNAL_LANDING_LIMIT,
  });

  return (
    <SheetShell locale={locale}>
      <main>
        {/* ============================================================
            MECHANISM STAGE — Hero through Process
            Two-column grid: left content scrolls, right mechanism sticks.
            Journal and Other Work sit full width below Contact.
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
                'pt-[clamp(4.5rem,20vh,15rem)] px-[clamp(1.5rem,3vw,3rem)] pb-[clamp(3rem,6vw,5rem)] min-h-[90vh] max-[980px]:min-h-0 ' +
                'border-b border-rule grid content-start gap-[clamp(3rem,5.5vw,4.5rem)] header-offset'
              }
              data-section="hero"
            >
              <h1 className="font-display font-semibold text-[clamp(1.1rem,7vw,5rem)] min-[981px]:text-[clamp(2.6rem,4.6vw,5rem)] leading-[1.08] tracking-[-0.022em] m-0 [&_em]:italic [&_em]:font-bold [&_em]:text-brass">
                <span lang="en" className="block">
                  <span className="block whitespace-nowrap">
                    Your team is doing work
                  </span>
                  <span className="block whitespace-nowrap">
                    an <em>AI agent</em> could do.
                  </span>
                </span>
                <span lang="zh" className="block">
                  <span className="block whitespace-nowrap">
                    你的團隊正在做
                  </span>
                  <span className="block whitespace-nowrap">
                    <em>AI agent</em> 可以做的工作。
                  </span>
                </span>
              </h1>
              <p className="font-body text-[clamp(0.95rem,5vw,1.25rem)] leading-[1.55] text-ink-2 m-0 text-balance">
                <span lang="en">
                  Bespoke AI systems designed around your workflows.
                </span>
                <span lang="zh">
                  為你的業務度身訂造 AI 系統，圍繞你實際的 workflow 設計。
                </span>
              </p>
              <div className="flex flex-wrap gap-y-[0.85rem] gap-x-5 items-center mt-1">
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
                    圖 1a — <b>公司大腦 · 齒輪結構圖</b>
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
              className="px-[clamp(1.5rem,3vw,3rem)] py-[clamp(2.5rem,5vw,4rem)] pb-[clamp(2.5rem,5vw,6rem)] max-[980px]:min-h-0 border-b border-rule max-[980px]:border-b header-offset"
              id="maison"
              data-section="about"
            >
              <span className="section-index">
                <span lang="en">What we build, and why it holds</span>
                <span lang="zh">我們打造什麼</span>
              </span>
              <h2 className="section-h2 text-ink mb-[clamp(1.5rem,3vw,3rem)]">
                <span lang="en">
                  The <em>Maison</em>.
                </span>
                <span lang="zh">
                  <em>Maison</em>。
                </span>
              </h2>
              <div className="opening-prose font-body text-[clamp(1.08rem,1.25vw,1.18rem)] leading-[1.72] text-ink [&_p]:m-0 [&_p]:mb-[1.15em] [&_p:last-child]:mb-0 [&_em]:text-brass-2 [&_em]:italic">
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
                    每間公司都靠一堆系統運作，大部分仍靠人手。每個系統有自己的節奏、自己的邏輯。我們打造一套架構，消除這些弱點：AI
                    agent 按你的邏輯設計，接手無法規模化的工作。
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
                    我們每個方案都不同。Agent 圍繞你實際的 workflow
                    設計：研究、草稿、篩選、Follow-up，全部按你的標準。不套範本，不是現成自動化。過去一年，AI
                    agent 的可靠性已提升四倍。難的是設計出夠精密的系統，撐得起一盤靠判斷的生意。
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
                    不是表面修補，是底層改變。資訊送上來，決策推進，營運自己跑。沒多請人，產能多一份。Maison
                    撐起一切。剩下的時間，做只有你能做的事。
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
                <span lang="en">Three phases, one process</span>
                <span lang="zh">三個階段，一套流程</span>
              </span>
              <h2 className="section-h2 mb-[clamp(1.5rem,3vw,3rem)] text-ink">
                <span lang="en">
                  The <em>Procedure</em>.
                </span>
                <span lang="zh">
                  <em>方法</em>。
                </span>
              </h2>
              <div className="grid gap-[clamp(2rem,4vw,3rem)]">
                {/* Discover */}
                <div className="grid gap-2">
                  <h3 className="font-display font-semibold text-[clamp(1.35rem,2vw,1.65rem)] leading-[1.15] tracking-[-0.01em] m-0 text-ink">
                    <span lang="en">
                      <em className="text-brass italic">I. Discover</em>
                    </span>
                    <span lang="zh">
                      <em className="text-brass italic">I. 探索</em>
                    </span>
                  </h3>
                  <p className="font-body text-[clamp(1.02rem,1.15vw,1.12rem)] leading-[1.68] text-ink-2 m-0">
                    <span lang="en">
                      We map your workflows and identify where AI creates
                      leverage. You receive a written audit and a ranked roadmap
                      of opportunities.
                    </span>
                    <span lang="zh">
                      我們拆解你的 workflow，找出 AI
                      最有槓桿的環節。你會拿到一份書面評估，加一份按優先排好的行動藍圖。
                    </span>
                  </p>
                </div>
                {/* Pilot */}
                <div className="grid gap-2">
                  <h3 className="font-display font-semibold text-[clamp(1.35rem,2vw,1.65rem)] leading-[1.15] tracking-[-0.01em] m-0 text-ink">
                    <span lang="en">
                      <em className="text-brass italic">II. Run</em>
                    </span>
                    <span lang="zh">
                      <em className="text-brass italic">II. 運作</em>
                    </span>
                  </h3>
                  <p className="font-body text-[clamp(1.02rem,1.15vw,1.12rem)] leading-[1.68] text-ink-2 m-0">
                    <span lang="en">
                      We build and run one workflow end-to-end. The outcome is
                      measured and iterated based on what happens.
                    </span>
                    <span lang="zh">
                      我們從頭打造一個 workflow，再運作。看效果，邊跑邊調。
                    </span>
                  </p>
                </div>
                {/* Orchestrate */}
                <div className="grid gap-2">
                  <h3 className="font-display font-semibold text-[clamp(1.35rem,2vw,1.65rem)] leading-[1.15] tracking-[-0.01em] m-0 text-ink">
                    <span lang="en">
                      <em className="text-brass italic">III. Scale</em>
                    </span>
                    <span lang="zh">
                      <em className="text-brass italic">III. 擴展</em>
                    </span>
                  </h3>
                  <p className="font-body text-[clamp(1.02rem,1.15vw,1.12rem)] leading-[1.68] text-ink-2 m-0">
                    <span lang="en">
                      Agents are operated at scale through a multi-agentic
                      orchestration workflow. We monitor them, tune them, and
                      surface new automation opportunities.
                    </span>
                    <span lang="zh">
                      我們用 multi-agent orchestration 同時跑你的多個
                      agent。盯著表現，隨時微調，順手找出新的自動化機會。
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Center vertical rule */}
          <div className="bg-rule max-[980px]:hidden" aria-hidden="true" />

          {/* RIGHT — sticky schematic */}
          <div className="relative max-[980px]:hidden">
            <div
              data-mech-sticky
              className="bg-grid-paper sticky top-(--header-band-h) h-[calc(100svh-var(--header-band-h))] grid grid-rows-[auto_1fr_auto] p-[clamp(1.5rem,3vw,2.5rem)] gap-5"
            >
              <div className="plate-head text-[0.7rem] tracking-[0.14em]">
                <span>
                  <span lang="en">
                    Fig. 01a — <b>The Company Brain · gear-train view</b>
                  </span>
                  <span lang="zh">
                    圖 1a — <b>公司大腦 · 齒輪結構圖</b>
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

        {/* ── Journal ────────────────────────────────────────── */}
        <div
          className="py-[clamp(2.5rem,5vw,4rem)] px-[clamp(1.5rem,3vw,3rem)] border-t border-b border-rule max-[980px]:border-b header-offset text-[clamp(1.6rem,3.2vw,2.6rem)]"
          id="journal"
          data-section="journal"
        >
          <div className="flex items-baseline justify-between gap-4 p-0">
            <h2 className="section-h2">
              <span lang="en">
                The <em>Journal</em>.
              </span>
                <span lang="zh">
                  <em>隨筆</em>。
                </span>
            </h2>
            <Link
              href={localePath(locale, '/journal')}
              className="font-mono text-[0.74rem] uppercase tracking-[0.14em] text-ink-3 hover:text-brass transition-colors duration-200 whitespace-nowrap"
            >
              <span lang="en">View all →</span>
              <span lang="zh">查看全部 →</span>
            </Link>
          </div>
          <div
            className={
              'mt-[clamp(1.5rem,3vw,2rem)] grid gap-0 border-t border-rule ' +
              (landingJournalEntries.length === 1
                ? 'grid-cols-1'
                : landingJournalEntries.length === 2
                ? 'grid-cols-2 max-[880px]:grid-cols-1'
                : 'grid-cols-3 max-[880px]:grid-cols-1')
            }
          >
            {landingJournalEntries.map((entry) => (
              <Link
                key={entry.slug}
                className="leaf"
                href={localePath(locale, `/journal/${entry.slug}`)}
              >
                <span className="leaf-meta">
                  <span className="font-mono text-[0.66rem] tracking-[0.16em] uppercase text-brass">
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

        {/* ============================================================
            CONTACT — outside the two-column grid
            ============================================================ */}
        <section
          className="bg-paper-2 border-t border-b border-rule header-offset"
          id="contact"
        >
          <div className="pt-[clamp(2rem,4vw,3rem)] px-[clamp(1.5rem,3vw,3rem)] pb-[clamp(2.5rem,5vw,4rem)] grid grid-cols-2 max-[980px]:grid-cols-1 gap-[clamp(2rem,4vw,4rem)] items-start">
            <div>
              <div className="block pt-0 px-0 pb-[clamp(1.25rem,2.25vw,2.5rem)]">
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
                    諮詢、合作、想了解多一點，或只是打個招呼，歡迎隨時聯絡。
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

        {/* ── Other Work ─────────────────────────────────────── */}
        <div
          className="px-[clamp(1.5rem,3vw,3rem)] py-[clamp(2rem,4vw,3rem)] border-b border-rule header-offset"
          id="other-work"
          data-section="other-work"
        >
          <h2 className="section-h2 mb-[clamp(1rem,2vw,1.5rem)] text-ink text-[clamp(1.6rem,3.2vw,2.6rem)]">
            <span lang="en">
              Other <em>Work</em>.
            </span>
            <span lang="zh">
              其他<em>工作</em>。
            </span>
          </h2>
          <p className="font-body text-[clamp(1.02rem,1.15vw,1.12rem)] leading-[1.68] text-balance text-ink-2 m-0">
            <span lang="en">
              We also build{' '}
              <Link
                className="underline underline-offset-4 decoration-1"
                href={localePath(locale, '/digital')}
              >
                digital experiences
              </Link>{' '}
              — custom websites, brand systems, and applications.
            </span>
            <span lang="zh">
              我們也幫客戶打造{' '}
              <Link
                className="underline underline-offset-4 decoration-1"
                href={localePath(locale, '/digital')}
              >
                數位體驗
              </Link>
              ：訂製網站、品牌系統、應用程式。內部團隊一條龍包辦。
            </span>
          </p>
        </div>
      </main>
    </SheetShell>
  );
}
