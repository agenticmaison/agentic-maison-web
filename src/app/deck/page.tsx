import { DeckControls } from './deck-controls';

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
          <a href="#" className="deck-brand">
            <b>Agentic</b>
            <span className="diamond" aria-hidden="true" />
            <i>Maison</i>
          </a>
          <span className="doctype">AI Practice · Presentation</span>
        </div>
        <nav className="deck-controls" aria-label="Deck controls">
          <span className="group" role="group" aria-label="Theme">
            <button type="button" data-theme-btn="light">
              Light
            </button>
            <span className="sep">/</span>
            <button type="button" data-theme-btn="dark">
              Dark
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
          Present →
        </button>
      </header>

      <main className="deck" id="deck">
        {/* Slide 1 — Cover (vertically centered) */}
        <article className="slide slide-cover" data-slide="1">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-body">
            <div className="cover-block">
              <h1 className="slide-title">
                Agentic · <em>Maison</em>
              </h1>
              <p className="cover-lede">
                Building specialized agents that handle the work your team
                repeats. Commissioned for your business. Operate across your
                tools. Deliver artifacts immediately.
              </p>
              <p className="cover-date">May 18 2026</p>
            </div>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>01</b> / 09
            </span>
          </footer>
        </article>

        {/* Slide 2 — Who we are */}
        <article className="slide" data-slide="2">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              Who <em>we are.</em>
            </h2>
          </div>
          <div className="slide-body">
            <div>
              <span className="who-placeholder-tag">
                Operator placeholder · Sam to write
              </span>
              <ul className="who-bullets">
                <li>
                  <span>
                    <b>A practice, not a platform.</b> Commissioned work for a
                    small number of operators at any one time.
                  </span>
                </li>
                <li>
                  <span>
                    <b>Principal-led.</b> Sean leads every engagement end-to-end
                    — discovery, build, and operation.
                  </span>
                </li>
                <li>
                  <span>
                    <b>Builders who ship.</b> Background in production AI
                    systems, not slideware.
                  </span>
                </li>
                <li>
                  <span>
                    <b>Operator empathy.</b> We&rsquo;ve run the businesses we
                    now build for — we know which work is worth automating and
                    which isn&rsquo;t.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>02</b> / 09
            </span>
          </footer>
        </article>

        {/* Slide 3 — Recent advancements in AI */}
        <article className="slide" data-slide="3">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              Recent advancements in <em>AI.</em>
            </h2>
          </div>
          <div className="slide-body">
            <div>
              <div className="axis">
                <div className="axis-step">
                  <span className="when">Nov 2022</span>
                  <span className="what">ChatGPT arrives.</span>
                  <p className="why">
                    Proof of concept for language models at scale.
                  </p>
                </div>
                <div className="axis-step">
                  <span className="when">Early 2024</span>
                  <span className="what">Tool use emerges.</span>
                  <p className="why">
                    Agents shift from text generation to taking actions.
                  </p>
                </div>
                <div className="axis-step">
                  <span className="when">Late 2025</span>
                  <span className="what">OpenClaw.</span>
                  <p className="why">
                    Open-source agent runtime anyone can run and own.
                  </p>
                </div>
                <div className="axis-step">
                  <span className="when">April 2026</span>
                  <span className="what">Enterprise agent infrastructure.</span>
                  <p className="why">
                    Cloud providers ship production-grade agent stacks
                    (Cloudflare, Google, OpenAI).
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
              <b>03</b> / 09
            </span>
          </footer>
        </article>

        {/* Slide 4 — Sample business deliverables */}
        <article className="slide" data-slide="4">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              Sample business <em>deliverables.</em>
            </h2>
          </div>
          <div className="slide-body">
            <div className="uses-stack">
              <div className="uses-row row-4">
                <div className="cell">
                  <span className="ord">01</span>
                  <span className="label">Staff productivity reports</span>
                  <p className="desc">
                    Automated visibility into where time is going; replaces
                    manual tracking.
                  </p>
                </div>
                <div className="cell">
                  <span className="ord">02</span>
                  <span className="label">
                    Internal wiki that aligns the team
                  </span>
                  <p className="desc">
                    Agents that keep processes and decisions current as you
                    scale.
                  </p>
                </div>
                <div className="cell">
                  <span className="ord">03</span>
                  <span className="label">Employee handbook assistant</span>
                  <p className="desc">
                    Dedicated agent answering repeated questions; saves HR time.
                  </p>
                </div>
                <div className="cell">
                  <span className="ord">04</span>
                  <span className="label">Onboarding &amp; offboarding</span>
                  <p className="desc">
                    Automates account setup, access, data transfer, exit
                    procedures.
                  </p>
                </div>
              </div>
              <div className="uses-row row-3">
                <div className="cell">
                  <span className="ord">05</span>
                  <span className="label">
                    Competitive intelligence dossiers
                  </span>
                  <p className="desc">
                    Regular scans of competitor moves and market signals
                    delivered on cadence.
                  </p>
                </div>
                <div className="cell">
                  <span className="ord">06</span>
                  <span className="label">Weekly executive brief</span>
                  <p className="desc">
                    Monday digest of team updates and items needing your
                    attention.
                  </p>
                </div>
                <div className="cell">
                  <span className="ord">07</span>
                  <span className="label">Presentation design agents</span>
                  <p className="desc">
                    Agents that produce presentation drafts from raw material
                    and data.
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
              <b>04</b> / 09
            </span>
          </footer>
        </article>

        {/* Slide 5 — The process (three pillars) */}
        <article className="slide" data-slide="5">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              The <em>process.</em>
            </h2>
          </div>
          <div className="slide-body">
            <div>
              <div className="pillars">
                <div className="pillar">
                  <span className="step">Phase 1</span>
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
                    Discovery <span className="duration">3–4 weeks</span>
                  </h3>
                  <p className="desc">
                    A structured audit of where AI creates real value in your
                    operation. You get a written roadmap, fully yours whether or
                    not you continue.
                  </p>
                </div>
                <div className="pillar">
                  <span className="step">Phase 2</span>
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
                    Pilot <span className="duration">6–8 weeks</span>
                  </h3>
                  <p className="desc">
                    We build one workflow end-to-end and run it live to measure
                    what actually happens. Your team experiences the system in
                    real work; you decide whether to scale.
                  </p>
                </div>
                <div className="pillar">
                  <span className="step">Phase 3</span>
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
                    Run <span className="duration">Ongoing</span>
                  </h3>
                  <p className="desc">
                    Ongoing operation with continuous monitoring and quarterly
                    additions as you scale. The agents run; we handle the
                    operational work.
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
              <b>05</b> / 09
            </span>
          </footer>
        </article>

        {/* Slide 6 — Phase 1: Discovery */}
        <article className="slide phase-detail" data-slide="6">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              Phase 1: <em>Discovery.</em>
            </h2>
          </div>
          <div className="slide-body">
            <div className="phase-strip">
              <span className="pill active">1 · Discovery</span>
              <span className="pill">2 · Pilot</span>
              <span className="pill">3 · Run</span>
            </div>
            <div className="phase-blocks">
              <div className="phase-block">
                <span className="ph-label">Duration</span>
                <p className="duration-headline">3–4 weeks</p>
                <div className="market-price">
                  <span className="mp-label">Market Price</span>
                  <p className="mp-range">
                    $10k–$25k<span className="fn-mark">*</span>
                  </p>
                </div>
              </div>
              <div className="phase-block">
                <span className="ph-label">Process Details</span>
                <ul>
                  <li>
                    Structured interviews with key people (4–6 hours total)
                  </li>
                  <li>Map workflows and identify bottlenecks</li>
                  <li>Surface 3–5 workflows we could automate</li>
                  <li>
                    Rank by impact (time saved, decisions accelerated, quality
                    improved)
                  </li>
                  <li>Propose the first one to pilot</li>
                </ul>
              </div>
              <div className="phase-block">
                <span className="ph-label">Deliverable</span>
                <ul>
                  <li>Written audit with recommendations</li>
                  <li>Discussion session to walk through findings</li>
                </ul>
              </div>
            </div>
            <p className="phase-footnote">
              <span className="fn-mark">*</span>
              <span>
                Varies by scope of audit (one workflow vs. one department vs.
                whole company).
              </span>
            </p>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>06</b> / 09
            </span>
          </footer>
        </article>

        {/* Slide 7 — Phase 2: Pilot */}
        <article className="slide phase-detail" data-slide="7">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              Phase 2: <em>Pilot.</em>
            </h2>
          </div>
          <div className="slide-body">
            <div className="phase-strip">
              <span className="pill">1 · Discovery</span>
              <span className="pill active">2 · Pilot</span>
              <span className="pill">3 · Run</span>
            </div>
            <div className="phase-blocks">
              <div className="phase-block">
                <span className="ph-label">Duration</span>
                <p className="duration-headline">6–8 weeks</p>
                <div className="market-price">
                  <span className="mp-label">Market Price</span>
                  <p className="mp-range">
                    $25k–$75k<span className="fn-mark">*</span>
                  </p>
                </div>
              </div>
              <div className="phase-block">
                <span className="ph-label">Process Details</span>
                <ul>
                  <li>
                    Design the workflow based on Discovery recommendations
                  </li>
                  <li>Build and integrate with your systems</li>
                  <li>Run live with your team for 2–3 weeks</li>
                  <li>Measure what happens and iterate with feedback</li>
                  <li>Review outcomes together and decide next step</li>
                </ul>
              </div>
              <div className="phase-block">
                <span className="ph-label">Deliverable</span>
                <ul>
                  <li>Live, working agent handling real workflows</li>
                  <li>
                    Measurement of actual impact (time, decisions, quality)
                  </li>
                  <li>Code and documentation transfer to you</li>
                </ul>
              </div>
            </div>
            <p className="phase-footnote">
              <span className="fn-mark">*</span>
              <span>
                Varies by workflow complexity (straightforward decision rules
                vs. multi-step logic and integrations).
              </span>
            </p>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>07</b> / 09
            </span>
          </footer>
        </article>

        {/* Slide 8 — Phase 3: Run at scale */}
        <article className="slide phase-detail" data-slide="8">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              Phase 3: <em>Run at scale.</em>
            </h2>
          </div>
          <div className="slide-body">
            <div className="phase-strip">
              <span className="pill">1 · Discovery</span>
              <span className="pill">2 · Pilot</span>
              <span className="pill active">3 · Run</span>
            </div>
            <div className="phase-blocks">
              <div className="phase-block">
                <span className="ph-label">Duration</span>
                <p className="duration-headline">Ongoing</p>
                <div className="market-price">
                  <span className="mp-label">Market Price</span>
                  <p className="mp-range">
                    $5k–$25k<span className="per">/ month</span>
                    <span className="fn-mark">*</span>
                  </p>
                </div>
              </div>
              <div className="phase-block">
                <span className="ph-label">Process Details</span>
                <ul>
                  <li>
                    Operate workflows in production with continuous monitoring
                  </li>
                  <li>Review production logs weekly to surface improvements</li>
                  <li>
                    Iterate based on team feedback and actual usage patterns
                  </li>
                  <li>Add 1–2 new automations per quarter</li>
                  <li>Manage integration as your tool stack evolves</li>
                </ul>
              </div>
              <div className="phase-block">
                <span className="ph-label">Deliverable</span>
                <ul>
                  <li>Agents running without requiring your intervention</li>
                  <li>
                    Weekly performance reviews and improvement recommendations
                  </li>
                  <li>Operational oversight and scaling support</li>
                </ul>
              </div>
            </div>
            <p className="phase-footnote">
              <span className="fn-mark">*</span>
              <span>
                Varies by arrangement after Pilot (one agent vs. multiple
                agents, integration complexity, frequency of additions).
              </span>
            </p>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>08</b> / 09
            </span>
          </footer>
        </article>

        {/* Slide 9 — Thank you */}
        <article className="slide thanks-slide" data-slide="9">
          <span className="reg tl" />
          <span className="reg bl" />
          <div className="slide-head" />
          <div className="slide-title-row">
            <h2 className="slide-title">
              Thank <em>you.</em>
            </h2>
          </div>
          <div className="slide-body">
            <div className="thanks-block">
              <p className="thanks-contact">sean@agenticmaison.com</p>
              <p className="thanks-contact">WhatsApp: +852 9696 8828</p>
            </div>
          </div>
          <footer className="slide-foot">
            <span className="brand-mark">
              Agentic <i>Maison</i>
            </span>
            <span className="pageno">
              <b>09</b> / 09
            </span>
          </footer>
        </article>
      </main>

      <div className="deck-colophon">
        <b>Agentic Maison · AI Practice · MMXXVI</b>
        &nbsp;·&nbsp; 9 slides &nbsp;·&nbsp; Press <b>P</b> to present
      </div>

      <div className="present-hud" aria-hidden="true">
        <span className="counter">
          <b id="ctr-current">1</b> / <span id="ctr-total">9</span>
        </span>
        <span className="hint">← → arrows · Esc to exit</span>
      </div>

      <DeckControls />
    </>
  );
}
