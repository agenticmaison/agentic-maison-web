import Link from "next/link";
import type { Metadata } from "next";
import { SheetShell } from "@/components/sheet-shell";
import { getEntryBySlug } from "@/lib/journal/entries";

/**
 * /journal/why-most-ai-projects-fail — first journal entry.
 *
 * Copy source: `1-projects/agentic-maison-launch/copy/journal-launch-post.md`
 * (am-003). 中文 body is a hand translation working from the EN source
 * and the brand voice memo; flag any phrasing concerns to operator.
 *
 * Design:
 * - Editorial reading column at ~68ch (the `--reading` width keeps measure
 *   short enough for ~10-12 words per line at body size).
 * - Display title in Cormorant; mono fig-mark + date row above; em accents
 *   in brass to match F.
 * - Section rules use thin hairlines instead of headings where the original
 *   has `---` separators.
 */

const SLUG = "why-most-ai-projects-fail";
const entry = getEntryBySlug(SLUG)!;

export const metadata: Metadata = {
  title: entry.title.en,
  description: entry.metaDescription,
  alternates: { canonical: `/journal/${SLUG}` },
  openGraph: {
    title: `${entry.title.en} · Agentic Maison`,
    description: entry.metaDescription,
    url: `https://agenticmaison.com/journal/${SLUG}`,
    type: "article",
    publishedTime: entry.date,
  },
  twitter: {
    card: "summary_large_image",
    title: `${entry.title.en} · Agentic Maison`,
    description: entry.metaDescription,
  },
};

// Tailwind classes for body prose. ~68-70ch keeps measure editorial.
const proseClasses =
  "font-body text-[clamp(1.05rem,1.18vw,1.18rem)] leading-[1.72] text-ink " +
  "[&>p]:m-0 [&>p]:mb-[1.2em] [&>p:last-child]:mb-0 [&_em]:text-brass-2 [&_em]:italic " +
  "[&_strong]:font-medium [&_strong]:text-ink " +
  "[&_a]:text-ink [&_a]:border-b [&_a]:border-ink [&_a]:pb-[1px] " +
  "[&_a]:transition-colors [&_a]:duration-200 hover:[&_a]:text-brass hover:[&_a]:border-brass";

const subheadClasses =
  "font-display font-semibold text-[clamp(1.5rem,2vw,1.85rem)] " +
  "leading-[1.18] tracking-[-0.012em] text-ink mt-[clamp(2rem,3vw,2.75rem)] mb-[clamp(0.85rem,1.5vw,1.15rem)] " +
  "[&_em]:italic [&_em]:text-brass";

const ruleClasses =
  "block w-[3rem] h-px bg-rule border-0 my-[clamp(2rem,3.5vw,2.75rem)]";

export default function WhyMostAiProjectsFailEntry() {
  return (
    <SheetShell>
      <main className="header-offset">
        <article className="mx-auto w-full max-w-[68ch] px-[clamp(1.5rem,3vw,3rem)] pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)]">
          {/* Fig-mark + date row (journal meta — tightened tracking vs default mono caption) */}
          <div className="flex justify-between items-baseline font-mono text-[0.7rem] tracking-[0.08em] uppercase text-ink-3 mb-[clamp(1.5rem,2.5vw,2rem)]">
            <span>
              <span lang="en">Journal</span>
              <span lang="zh">札記</span>
            </span>
            <span>
              <span lang="en">{entry.dateDisplay.en}</span>
              <span lang="zh">{entry.dateDisplay.zh}</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-semibold text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.018em] m-0 text-ink [&_em]:italic [&_em]:text-brass">
            <span lang="en">
              Why most AI implementation projects <em>fail</em>.
            </span>
            <span lang="zh">
              為何大多數 AI 實施項目<em>皆告失敗</em>。
            </span>
          </h1>

          {/* Dek */}
          <p className="mt-[clamp(1.25rem,2vw,1.75rem)] font-body italic text-[clamp(1.1rem,1.3vw,1.25rem)] leading-[1.55] text-ink-2 m-0 max-w-[58ch]">
            <span lang="en">{entry.dek.en}</span>
            <span lang="zh">{entry.dek.zh}</span>
          </p>

          <hr className={ruleClasses} aria-hidden="true" />

          {/* Body — EN */}
          <div lang="en" className={proseClasses}>
            <p>
              I&apos;ve watched dozens of AI implementation projects over the last
              two years. Most fail quietly.
            </p>
            <p>
              They fail not because the technology doesn&apos;t work. It does. But
              they fail because they&apos;re built on the wrong assumption: that
              the goal is <em>features</em>, not <em>change</em>.
            </p>
            <p>Here&apos;s the pattern I see:</p>
            <p>
              A company decides to &ldquo;implement AI.&rdquo; They hire a
              consultant or vendor. There&apos;s a discovery phase, promises are
              made, a budget is set. Someone builds a system — an AI agent that
              processes invoices, or a chatbot that handles support emails, or a
              dashboard that synthesizes reports. The system works technically.
              It does what it&apos;s supposed to do.
            </p>
            <p>
              But the team doesn&apos;t use it. Or they use it for three weeks
              and stop. Or they use it incorrectly, defeating the purpose. The
              real workflow doesn&apos;t change.
            </p>
            <p>
              Six months later, it&apos;s abandoned. The company writes it off
              as &ldquo;AI wasn&apos;t ready yet&rdquo; or &ldquo;we
              didn&apos;t have the data&rdquo; or &ldquo;our business is too
              complex.&rdquo; But that&apos;s not what happened. What happened
              is they built a feature instead of solving a problem.
            </p>

            <h2 className={subheadClasses}>
              The difference between features and problems
            </h2>
            <p>
              A feature is something you build and hand over. A problem is
              something you solve by changing how people work.
            </p>
            <p>
              When someone asks me &ldquo;can you build an AI system that
              processes our intake forms,&rdquo; I first ask a different
              question: &ldquo;How are you processing them now, how long does
              it take, and what&apos;s the actual cost of doing it?&rdquo;
            </p>
            <p>
              Usually they say &ldquo;it takes Sarah four hours a day, and
              she&apos;s probably spending 20% of her time on it.&rdquo;
            </p>
            <p>
              That&apos;s the problem. Not &ldquo;we need an AI intake
              processor.&rdquo; The problem is &ldquo;we&apos;re paying someone
              to do something repetitive instead of having them focus on what
              matters.&rdquo;
            </p>
            <p>
              The feature might be elegant. The problem-solving might be messy.
            </p>
            <p>
              A feature might be a sleek dashboard that scores leads.
              Problem-solving might be: &ldquo;Your sales team is wasting time
              qualifying bad leads because they don&apos;t have context.
              Let&apos;s build a scoring agent that uses your actual conversion
              history to flag the ones worth calling.&rdquo;
            </p>
            <p>
              Same technology. Different framing. One is &ldquo;we built this
              thing.&rdquo; The other is &ldquo;your team&apos;s time freed
              up.&rdquo;
            </p>
            <p>Only the second one actually sticks.</p>

            <h2 className={subheadClasses}>Why it matters</h2>
            <p>The difference shows up in three places:</p>
            <p>
              <strong>In setup:</strong> If you&apos;re solving a problem, you
              start by understanding the actual workflow — not the org chart,
              not what people <em>say</em> they do, but what they actually do.
              How many minutes per day? Which systems does Sarah have to log
              into? What&apos;s the worst-case scenario? What&apos;s the edge
              case that trips everyone up?
            </p>
            <p>
              This is messier than feature-building. It means interviews and
              observation and saying &ldquo;I don&apos;t understand, walk me
              through it again.&rdquo;
            </p>
            <p>
              <strong>In build:</strong> If you&apos;re solving a problem, you
              optimize for adoption, not elegance. That might mean the system
              lives where people already work — in their email, their WhatsApp,
              their existing CRM — instead of behind a new dashboard. It might
              mean starting small (automate 30% of the workflow) instead of
              trying to handle every edge case at once.
            </p>
            <p>
              <strong>In maintenance:</strong> If you&apos;re solving a problem,
              you iterate based on what people actually do after launch, not
              what you guessed before. Sarah uses the system differently than
              you expected. That&apos;s not a bug in the system — it&apos;s a
              signal that the workflow needs adjustment. Good implementation
              means tuning based on reality, not defending the original design.
            </p>

            <h2 className={subheadClasses}>What actually works</h2>
            <p>The AI implementations I&apos;ve seen stick share three things:</p>
            <p>
              <strong>First:</strong> they&apos;re scoped around actual workflow,
              not technology. &ldquo;We&apos;re going to automate the intake
              process&rdquo; instead of &ldquo;we&apos;re going to use this AI
              vendor&apos;s platform.&rdquo; Problem first, technology second.
            </p>
            <p>
              <strong>Second:</strong> there&apos;s a test phase before
              commitment. You don&apos;t sign a six-month contract. You build
              something small, use it for two weeks, and then decide if
              it&apos;s worth expanding. This removes risk and surfaces whether
              it&apos;ll actually be adopted.
            </p>
            <p>
              <strong>Third:</strong> maintenance is built in from the start. A
              system that works on day one might need tuning on day 15. Most
              projects treat launch as the end. Good implementations treat
              launch as the beginning. &ldquo;We built this. Now let&apos;s
              make it actually work in your business.&rdquo;
            </p>

            <h2 className={subheadClasses}>The realistic timeline</h2>
            <p>
              This means good implementation is slower than feature-building.
            </p>
            <p>Discovery: one to two weeks.</p>
            <p>Test build: three to four weeks.</p>
            <p>Try it: two weeks, in your business, with your people.</p>
            <p>Decide: should we keep going?</p>
            <p>
              If yes, tune and expand. If no, you keep what we built and we
              part cleanly.
            </p>
            <p>
              Four to six weeks from start to first meaningful test. That sounds
              slow if you&apos;re thinking in terms of &ldquo;features
              shipped.&rdquo; It&apos;s fast if you&apos;re thinking in terms
              of <em>changing how we work</em>.
            </p>

            <h2 className={subheadClasses}>Why this matters for operators</h2>
            <p>If you&apos;re evaluating an AI implementation, ask these questions.</p>
            <p>
              <strong>Before you start:</strong> What workflow are we actually
              automating? Listen for specificity. &ldquo;Invoicing&rdquo; is
              vague. &ldquo;Sarah spends 45 minutes every morning manually
              matching invoices to POs in the accounting system&rdquo; is real.
              What does success look like? Not &ldquo;we have an AI
              system.&rdquo; Real: &ldquo;Sarah spends 10 minutes on this, not
              45.&rdquo; Are we trying something small first, or committing six
              months to a big build? Small first. Always.
            </p>
            <p>
              <strong>After launch:</strong> Are people actually using this?
              Not on day one — on day 30. What&apos;s different about how it
              works vs. how we expected? This is normal; signals matter. What
              should we tune? And is tuning included, or are you paying per
              change?
            </p>
            <p>
              If a consultant or vendor can&apos;t answer these clearly,
              you&apos;re probably buying features instead of solving problems.
            </p>

            <h2 className={subheadClasses}>One more thing</h2>
            <p>
              Most failed AI projects fail silently because nobody talks about
              them. Companies don&apos;t want to admit they spent £50K on
              something that nobody used. Vendors don&apos;t advertise their
              failures. Consultants move on to the next project.
            </p>
            <p>
              But if you&apos;ve got a workflow that&apos;s tedious and
              repetitive and you&apos;ve been meaning to automate it for two
              years, that&apos;s the signal. There&apos;s probably a good
              implementation waiting there, buried under a bad one.
            </p>
            <p>
              The work that sticks starts with clarity about the actual problem,
              not the latest technology. It moves slowly through a test phase.
              It commits to iteration and tuning.
            </p>
            <p>
              It&apos;s slower. It&apos;s messier. It actually works.
            </p>
          </div>

          {/* Body — 中文 */}
          <div lang="zh" className={proseClasses}>
            <p>
              過去兩年，我看過數十個 AI 實施項目。大多數都靜悄悄地失敗了。
            </p>
            <p>
              它們失敗，並不是因為技術不行 — 技術沒有問題。它們失敗，是因為一開始的假設就錯了：把目標當成<em>功能</em>，而不是<em>改變</em>。
            </p>
            <p>我看到的模式是這樣的：</p>
            <p>
              一家公司決定「導入 AI」。他們找來顧問或供應商，做了一輪需求探查，談好承諾，設定預算。有人建了一套系統 — 一個處理發票的 AI 代理、一個應對客服信件的對話機器人，或一個彙整報告的儀表板。系統技術上是可運作的，做著它該做的事。
            </p>
            <p>
              但團隊不用它。或者用了三星期就停了。又或者用法不對，反而違背了初衷。真正的工作流程，並未改變。
            </p>
            <p>
              半年後，這套系統被棄置。公司把它寫成「AI 還沒成熟」、「我們資料不夠」，或「我們業務太複雜」。但事實並非如此。真正發生的，是他們建了一個功能，卻沒有解決一個問題。
            </p>

            <h2 className={subheadClasses}>功能與問題的分別</h2>
            <p>
              功能是你建好之後交付出去的東西。問題則是要透過改變人們的工作方式才能解決的東西。
            </p>
            <p>
              當有人問我「你能不能建一套 AI 系統來處理我們的收件表單」，我會先反問另一個問題：「你們現在是怎麼處理的？花多少時間？實際的成本是多少？」
            </p>
            <p>
              他們通常會說：「Sarah 每天要花四個小時，大概佔她 20% 的工時。」
            </p>
            <p>
              那才是問題所在。不是「我們需要一套 AI 收件處理器」，而是「我們正在花錢請人做重複的工作，而不是讓他專注於真正重要的事」。
            </p>
            <p>
              功能可以很優雅。解決問題的過程通常很狼狽。
            </p>
            <p>
              功能可能是一個漂亮的儀表板，幫銷售評分線索。解決問題則可能是：「你們的銷售團隊在篩選爛單上浪費時間，因為他們缺少脈絡。我們來建一個評分代理，用你們真正的成交歷史，把值得打電話的那批標出來。」
            </p>
            <p>
              同樣的技術，不同的框架。一個是「我們把它建好了」。另一個是「你的團隊時間被釋放出來了」。
            </p>
            <p>只有後者真的會留下來。</p>

            <h2 className={subheadClasses}>為何這件事重要</h2>
            <p>分別會在三個地方顯現出來：</p>
            <p>
              <strong>在前期設定：</strong>如果你在解決問題，你會從理解真實的工作流程開始 — 不是組織圖，不是大家<em>口頭上</em>說自己做什麼，而是他們實際在做什麼。每天花多少分鐘？Sarah 要登入幾套系統？最糟的情境是什麼？哪個邊角案例最常絆倒所有人？
            </p>
            <p>
              這比堆功能更狼狽。它意味著訪談、觀察，以及不斷說「我還沒搞懂，請你再帶我走一遍」。
            </p>
            <p>
              <strong>在建造過程：</strong>如果你在解決問題，你會為「採用率」最佳化，而不是為「優雅」最佳化。系統可能要住在人們本來就在用的地方 — 電郵、WhatsApp、現有的 CRM — 而不是躲在一個新的儀表板背後。它可能是從小處開始（先自動化 30% 的流程），而不是一開始就想把每個邊角案例都吞下去。
            </p>
            <p>
              <strong>在維護階段：</strong>如果你在解決問題，你會根據人們上線後實際的使用方式去迭代，而不是根據你事前的猜測。Sarah 的用法和你預期的不一樣 — 那不是系統的 bug，而是訊號，告訴你流程需要調整。好的實施，是依照現實去調校，而不是固守原本的設計。
            </p>

            <h2 className={subheadClasses}>真正會奏效的做法</h2>
            <p>我看過真的留得下來的 AI 實施，共通點有三：</p>
            <p>
              <strong>其一：</strong>它們的範圍是圍繞真實的工作流程，不是圍繞技術。是「我們要自動化收件流程」，而不是「我們要用某某 AI 供應商的平台」。先談問題，再談技術。
            </p>
            <p>
              <strong>其二：</strong>承諾之前先試。不要簽半年的合約。先做一個小東西，用上兩星期，再決定值不值得擴張。這既能去除風險，也能讓你看清楚它到底會不會被採用。
            </p>
            <p>
              <strong>其三：</strong>維護從一開始就納入設計。第一天可用的系統，到第十五天可能就需要微調。多數項目把「上線」當成終點，好的實施則把它當成起點。「我們把它建好了。現在，讓它真的在你的業務裡發揮作用。」
            </p>

            <h2 className={subheadClasses}>合理的時程</h2>
            <p>
              這也意味著，好的實施會比堆功能來得慢。
            </p>
            <p>探查：一到兩星期。</p>
            <p>試做：三到四星期。</p>
            <p>試用：兩星期，在你的業務裡，由你的人去用。</p>
            <p>決定：要不要繼續？</p>
            <p>
              要的話，就調校、擴張。不要的話，已建的成果歸你，我們乾淨地分手。
            </p>
            <p>
              從起步到第一次有意義的試用，大約四到六星期。若你用「出了幾個功能」來衡量，這聽起來很慢；若你用<em>改變工作方式</em>來衡量，這其實很快。
            </p>

            <h2 className={subheadClasses}>對委託人而言的意義</h2>
            <p>如果你正在評估一個 AI 實施案，請問這些問題。</p>
            <p>
              <strong>開始之前：</strong>我們究竟要自動化哪一個流程？聽他答得有多具體。「開發票」是模糊。「Sarah 每天早上花 45 分鐘在會計系統裡，手動把發票和採購單對起來」才是真實的。成功會是什麼樣？不是「我們有了一套 AI 系統」，而是「Sarah 把這件事從 45 分鐘做到 10 分鐘」。我們是先試小的，還是一上來就承諾半年的大工程？永遠先試小的。
            </p>
            <p>
              <strong>上線之後：</strong>人們真的有在用嗎？不是第一天，是第三十天。它實際的運作方式，和我們預期的有什麼不同？這是正常的，訊號才是重點。我們該調校什麼？而調校是包含在內，還是每改一次就要再付一次錢？
            </p>
            <p>
              如果一位顧問或供應商沒辦法把這些問題清楚地答出來，你買的多半是功能，不是解方。
            </p>

            <h2 className={subheadClasses}>還有一件事</h2>
            <p>
              多數失敗的 AI 項目，是靜悄悄地失敗的，因為沒人會出來談它。公司不會公開承認自己花了五十萬港幣建了一套沒人用的東西。供應商不會宣傳自己的失敗。顧問則會繼續到下一個案子。
            </p>
            <p>
              但是，如果你手上有一個又繁瑣又重複的流程，已經想了兩年要把它自動化，那就是訊號。那裡很可能埋著一個好的實施 — 只是被一個壞的實施蓋住了。
            </p>
            <p>
              留得下來的工作，從對問題本身的清晰開始，不是從最新的技術開始。它會慢慢走過一段試用期，會持續調校與迭代。
            </p>
            <p>
              它比較慢。它比較狼狽。它真的會奏效。
            </p>
          </div>

          <hr className={ruleClasses} aria-hidden="true" />

          {/* CTA */}
          <p className="font-body text-[clamp(1.05rem,1.18vw,1.18rem)] leading-[1.7] text-ink m-0">
            <span lang="en">
              Want to explore whether AI implementation makes sense for your
              business?{" "}
              <Link
                href="/#contact"
                className="text-ink border-b border-ink pb-[1px] transition-colors duration-200 hover:text-brass hover:border-brass"
              >
                Begin a correspondence.
              </Link>
            </span>
            <span lang="zh">
              想知道 AI 實施對你的業務是否合適？{" "}
              <Link
                href="/#contact"
                className="text-ink border-b border-ink pb-[1px] transition-colors duration-200 hover:text-brass hover:border-brass"
              >
                展開一段書信往來。
              </Link>
            </span>
          </p>

          {/* Back link */}
          <div className="mt-[clamp(2.5rem,4vw,3.5rem)]">
            <Link
              href="/#journal"
              className="font-mono text-[0.74rem] tracking-[0.14em] uppercase text-ink border-b border-ink pb-[4px] w-fit transition-colors duration-200 hover:text-brass hover:border-brass inline-block"
            >
              <span lang="en">← Back to the journal</span>
              <span lang="zh">← 返回札記</span>
            </Link>
          </div>
        </article>
      </main>
    </SheetShell>
  );
}
