import type { ReactNode } from 'react';
import { DeckSlide } from './deck-slide';
import { slidePos } from './deck-config';

type Props = { total: number };

function FuncSlide({
  id,
  total,
  title,
  children,
}: {
  id: number;
  total: number;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <DeckSlide
      id={id}
      extraClass="outcome-slide function-slide"
      position={slidePos(id)}
      total={total}
      title={title}
    >
      {children}
    </DeckSlide>
  );
}

export function FunctionSlides({ total }: Props) {
  return (
    <>
      <FuncSlide id={5} total={total} title={
        <>
<span lang="en">
                Agents for <em>Sales</em>
              </span>
              <span lang="zh">銷售 agent</span>
        </>
      }>
<div className="func-cols">
              <div className="spotlight">
                <span className="spot-kicker">
                  <span lang="en">Featured · Name-card follow-up</span>
                  <span lang="zh">應用案例 · 名片跟進</span>
                </span>
                <h3 className="spot-title">
                  <span lang="en">
                    Forty name cards. Forty follow-ups. <em>Ten minutes.</em>
                  </span>
                  <span lang="zh">
                    四十張名片。四十封跟進。<em>十分鐘完成。</em>
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
                        你從活動回到公司，帶了四十張名片，打算要跟進。三個禮拜過去，那疊名片還在桌上。
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
                        每張名片都要回想當時談過什麼、找個合適的切入點、寫一封個人化的訊息。四十封等於一整天的工作。你根本擠不出時間。大部分從未寄出。
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
                        Agent 看你的筆記，起草四十封個人化的 message。每封都會提到當時實際談過的內容。你 review 完就 send。四十封跟進十分鐘全部送出。不再只是「打算」。
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="func-list">
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Proposal first drafts</span>
                    <span lang="zh">Proposal 初稿</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      A discovery call ends; the agent drafts the proposal from
                      the call and your previous proposals — you refine instead
                      of starting blank.
                    </span>
                      <span lang="zh">
                        一場 discovery call 結束，agent 根據通話內容和你過往的 proposal 起草新的。你只需修潤，不用從零開始。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Pre-meeting brief</span>
                    <span lang="zh">會前 brief</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Five minutes before every call, a one-page brief lands in
                      your inbox — who they are, the history, what to ask.
                    </span>
                      <span lang="zh">
                        每場 meeting 前五分鐘，一頁 brief 進到你的 inbox。對方是誰、之前談過什麼、這次該問什麼。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Stale-lead revival</span>
                    <span lang="zh">喚醒舊 lead</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Two hundred leads went cold in the CRM; the agent
                      re-engages them on a schedule, in your voice, and flags
                      the ones who reply.
                    </span>
                      <span lang="zh">
                        CRM 裡兩百條 lead 已經 cold 了。Agent 按 schedule、用你的語氣逐一重新接觸，有回覆的就 flag 出來。
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
                        Agent 聽通話錄音，當日完成 notes、next steps、誰負責跟進的紀錄。沒有遺漏。
                      </span>
                  </p>
                </div>
              </div>
            </div>
      </FuncSlide>
      <FuncSlide id={6} total={total} title={
        <>
<span lang="en">
                Agents for <em>Account Management</em>
              </span>
              <span lang="zh">客戶管理 agent</span>
        </>
      }>
<div className="func-cols">
              <div className="spotlight">
                <span className="spot-kicker">
                  <span lang="en">
                    Featured · The resend request, fulfilled
                  </span>
                  <span lang="zh">應用案例 · 自動處理重發請求</span>
                </span>
                <h3 className="spot-title">
                  <span lang="en">
                    &ldquo;Can you send that over again?&rdquo; <em>Done.</em>
                  </span>
                  <span lang="zh">
                    「可以再 send 一次給我嗎？」<em>完成。</em>
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
                        客戶 email 你：可以再 send 一次之前那份 catalogue 嗎？或合約、或 proposal？那份文件埋在你的寄件夾裡，還有三個版本。
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
                        你放下手邊工作，翻舊 email、找回正確那份、檢查是不是最新版、再回覆。明明兩分鐘的小事，一個禮拜打斷你五次。
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
                        Agent 找出最新版本、attach 上、用你的語氣寫一段客氣的說明 send 出去。再告訴你已經完成。你的節奏完全沒被打斷。
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
                        續約前六十天，agent 會提早提醒，順手起草 email。合約不會因為漏掉而失效。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Quarterly check-in &amp; QBR drafts</span>
                    <span lang="zh">季度 check-in 和檢討初稿</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      From the project history, the agent drafts the quarterly
                      review — what you delivered, what&rsquo;s next — ready for
                      you to send.
                    </span>
                      <span lang="zh">
                        Agent 翻 project 歷史，寫好季度回顧：交付了什麼、下一步是什麼。等你 send。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Birthday &amp; festival greetings</span>
                    <span lang="zh">生日和節日問候</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Birthdays, Mid-Autumn, Lunar New Year — the agent drafts a
                      warm note to each client in your voice, personalized from
                      your last exchange.
                    </span>
                      <span lang="zh">
                        生日、中秋、農曆新年。Agent 用你的語氣，參考上次和對方談過什麼，為每位客戶寫一段溫馨問候。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Dormant-client wake-up</span>
                    <span lang="zh">喚醒舊客戶</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      A client has gone quiet for months; the agent reaches out
                      with what&rsquo;s genuinely new and worth their attention.
                    </span>
                      <span lang="zh">
                        客戶幾個月沒消息。Agent 找出真正值得他們留意的新動態，主動聯絡。
                      </span>
                  </p>
                </div>
              </div>
            </div>
      </FuncSlide>
      <FuncSlide id={7} total={total} title={
        <>
<span lang="en">
                Agents for <em>Operations</em>
              </span>
              <span lang="zh">營運 agent</span>
        </>
      }>
<div className="func-cols">
              <div className="spotlight">
                <span className="spot-kicker">
                  <span lang="en">Featured · Four group chats, one brief</span>
                  <span lang="zh">應用案例 · 四個 group chat，一份 brief</span>
                </span>
                <h3 className="spot-title">
                  <span lang="en">
                    Four group chats, read for you <em>by 8am.</em>
                  </span>
                  <span lang="zh">
                    四個 group chat，八點前<em>已經讀完。</em>
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
                        你的 operation 跨四個 WhatsApp group：供應商、倉庫、門市、送貨。每晚總有狀況發生。
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
                        每天早上 scroll 完四個 group，從幾百個 message 拼出哪些重要的。
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
                        Agent 隔夜讀完四個 group。八點前給你一份 brief：哪些已經出貨、哪些卡住、哪些今天要你跟。
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="func-list">
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">SOP drafting → the Company Brain</span>
                    <span lang="zh">寫 SOP → Company Brain</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      New hires keep asking how to do something; the agent
                      writes the SOP, and files it in the Company Brain — a
                      central, queryable knowledge base the whole team can ask.
                    </span>
                      <span lang="zh">
                        新人不停問同一件事怎麼做。Agent 看你做一次，就寫成 SOP 存進「Company Brain」：全公司都能查的中央 knowledge base。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Supplier chasing</span>
                    <span lang="zh">催供應商</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      The agent chases suppliers on schedule and escalates to
                      you only if there&rsquo;s no reply after 24 hours.
                    </span>
                      <span lang="zh">
                        Agent 按 schedule 催供應商，超過 24 小時還沒回覆才 escalate 給你。
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
                        要買零件或產品？Agent 比較五個賣家，給你一份排好序的 shortlist，而不是留一個分頁讓你自己挑。
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
                        五個 project、三十項交付。Agent 逐項 tracking，在客戶察覺前就 flag 出進度落後的部分。
                      </span>
                  </p>
                </div>
              </div>
            </div>
      </FuncSlide>
      <FuncSlide id={8} total={total} title={
        <>
<span lang="en">
                Agents for <em>Accounting</em>
              </span>
              <span lang="zh">會計及財務 agent</span>
        </>
      }>
<div className="func-cols">
              <div className="spotlight">
                <span className="spot-kicker">
                  <span lang="en">Featured · The margin-watch agent</span>
                  <span lang="zh">應用案例 · Margin 監控 agent</span>
                </span>
                <h3 className="spot-title">
                  <span lang="en">
                    No single sale looks wrong. <em>The trend is.</em>
                  </span>
                  <span lang="zh">
                    單單 sale 看起來都對。<em>整體 trend 不對。</em>
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
                        這條產品線還賣得好。但運費悄悄漲、關鍵原料貴了、沒人重新定價。四個月下來，margin 不知不覺跌了三個百分點。
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
                        你在季度檢討才發現。已經錯價賣了整個 quarter。修正只能追溯，跌掉的 margin 拿不回來。
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
                        Agent 對照成本 input，逐條 line tracking margin，早早 flag 出偏差：這條 line 一月以來跌了三個百分點，主因是運費和原料。現在就重新定價，不要等到四月。
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
                        牌照、強積金、稅務期限全部追蹤，提前 30/14/7 天提醒。不會再因逾期被罰。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Overdue-invoice chasing</span>
                    <span lang="zh">催收逾期發票</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Overdue invoices chased on a schedule — gentle at 30 days,
                      firm at 45, escalated to you at 60.
                    </span>
                      <span lang="zh">
                        逾期發票按 schedule 自動 chase：30 天溫和、45 天加強、60 天 escalate 給你。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Quote and invoice generation</span>
                    <span lang="zh">製作 quote 和 invoice</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Standard quote, standard invoice, customer email request.
                      Agent generates the draft, you approve.
                    </span>
                      <span lang="zh">
                        標準 quote、標準 invoice。客戶 email 一到，Agent 就起草，你 approve。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Monthly P&L prep for accountant.</span>
                    <span lang="zh">每月為會計準備 P&amp;L</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Agent compiles the breakdown your bookkeeper asks for
                      every month.
                    </span>
                      <span lang="zh">Agent 每月幫你整理 bookkeeper 要的 breakdown。</span>
                  </p>
                </div>
              </div>
            </div>
      </FuncSlide>
      <FuncSlide id={9} total={total} title={
        <>
<span lang="en">
                Agents for <em>Human Resources</em>
              </span>
              <span lang="zh">人事 Agent</span>
        </>
      }>
<div className="func-cols">
              <div className="spotlight">
                <span className="spot-kicker">
                  <span lang="en">
                    Featured · The employee-handbook assistant
                  </span>
                  <span lang="zh">應用案例 · 員工手冊助理</span>
                </span>
                <h3 className="spot-title">
                  <span lang="en">
                    The handbook that <em>answers back.</em>
                  </span>
                  <span lang="zh">
                    一本會對答的<em>員工手冊。</em>
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
                        晚上十一點。一個員工需要填一張申請表，要問關於育嬰假的申請政策。但是人事部已經下班了。
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
                        這個問題會在人事部職員的收件箱十六個小時。那張 form 只能等。同樣那幾條問題，每當有員工查詢，人事部職員也要重新回答，浪費了寶貴的時間。
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
                        員工直接問手冊助理。幾秒內就有準確的政策答案，用淺白的文字回答。全天候待命。人事部職員只用於例外的事情。
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
                        剛入職的同事，第一週的問題都能即時解答。Agent 會帶他們熟悉公司的內部軟件、設定帳號、介紹這裡的做事方式。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Job-description drafts</span>
                    <span lang="zh">JD 初稿</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Hiring for a role? The agent drafts the job description
                      from your past postings and what you tell it about the
                      need.
                    </span>
                      <span lang="zh">
                        要請新人？Agent 看你過往的職缺，加上你告訴它的需求，起草 JD。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Exit-interview debrief</span>
                    <span lang="zh">離職面談總結</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      The agent runs the exit interview, then summarizes the
                      themes: compensation, manager, growth, so every departure
                      is captured the same way
                    </span>
                      <span lang="zh">
                        Agent 進行離職面談，再總結主題：薪酬、主管、成長空間。每次離職都用同一套方式記錄。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Performance review</span>
                    <span lang="zh">績效評核</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Agent pulls each person&apos;s work for review season, and
                      compares it to their previous performance.
                    </span>
                      <span lang="zh">到評核季，Agent 拿出每位員工的工作，和他之前的表現比較。</span>
                  </p>
                </div>
              </div>
            </div>
      </FuncSlide>
      <FuncSlide id={10} total={total} title={
        <>
<span lang="en">
                Agents for <em>Marketing</em>
              </span>
              <span lang="zh">市場 Agent</span>
        </>
      }>
<div className="func-cols">
              <div className="spotlight">
                <span className="spot-kicker">
                  <span lang="en">Featured · THE TREND YOU CAUGHT IN TIME</span>
                  <span lang="zh">應用案例 · 及時抓到 trend</span>
                </span>
                <h3 className="spot-title">
                  <span lang="en">
                    It spots what&apos;s moving <em>while it still matters.</em>
                  </span>
                  <span lang="zh">
                    趨勢一冒頭，<em>它就抓到了。</em>
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
                        在你的行業，一個話題或產品開始在小紅書和 IG 上興起。通常這個時機不會維持很久，需要快速捕捉及執行。
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
                        等你發現，已經到處都是。看到競爭對手已經爆了，才反應過來。發出去的貼文，永遠慢一拍。
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
                        Agent 替你每天盯著行業，趨勢還沒完全紅起來前就 flag 出來，順手用你的語氣寫好一篇貼文。你只要按 send，趕在所有人湧入之前發出去。
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="func-list">
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">LinkedIn drafts</span>
                    <span lang="zh">LinkedIn post 初稿</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Three posts a week, drafted from what&rsquo;s actually
                      happening in the business — you approve, the feed stays
                      alive.
                    </span>
                      <span lang="zh">
                        每週三篇貼文，全部取材自公司真實發生的事。你核准就發，feed 不會沉悶。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Review replies</span>
                    <span lang="zh">回覆 Review</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Google reviews are answered in your voice, within the day
                      — no review sits ignored.
                    </span>
                      <span lang="zh">
                        Google 評論當日內用你的語氣回覆。沒有一條被晾在那裡。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Newsletter & EDM drafts</span>
                    <span lang="zh">Newsletter 和 EDM 初稿</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Newsletter and EDM drafts are generated from your brand
                      voice, ready to schedule.
                    </span>
                      <span lang="zh">
                        電子報和 EDM 初稿用你的品牌語氣生成，隨時可以 schedule。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Blog & SEO drafts</span>
                    <span lang="zh">Blog 和 SEO 初稿</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Articles drafted around what customers actually search for
                      in your market, keeping the site relevant and page rank
                      high.
                    </span>
                      <span lang="zh">
                        文章圍繞客戶在你的市場真正搜尋的內容來寫。網站保持相關，搜尋排名保持高。
                      </span>
                  </p>
                </div>
              </div>
            </div>
      </FuncSlide>
      <FuncSlide id={11} total={total} title={
        <>
<span lang="en">
                Agents for <em>You</em>
              </span>
              <span lang="zh">你的個人參謀長 Agent</span>
        </>
      }>
<div className="func-cols">
              <div className="spotlight">
                <span className="spot-kicker">
                  <span lang="en">Featured · Your personal Chief of Staff</span>
                  <span lang="zh">應用案例 · 你的個人 Chief of Staff</span>
                </span>
                <h3 className="spot-title">
                  <span lang="en">
                    A chief of staff who&rsquo;s <em>already up.</em>
                  </span>
                  <span lang="zh">
                    一位永遠比你早起的 <em>Chief of Staff。</em>
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
                        早上七點。你有四個 meeting、一個爆滿的收件匣、還有兩個今天要見的人，連名字只記得一半。
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
                        你每天回到公司，頭 90 分鐘都在處理 email、查每個人的背景、回想每段對話進行到哪。真正的工作還沒開始。
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
                        你坐下時，agent 已經讀完你的 email 和 calendar、研究過你今天要見的人和公司、把一天的安排排好。需要回覆的，它先問你想怎麼回，再代你起草。你拍板，它做事。
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="func-list">
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Monday-morning brief</span>
                    <span lang="zh">週一晨報</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Five bullets by 8:30 Monday: what shipped, what&rsquo;s
                      blocked, what needs your call.
                    </span>
                      <span lang="zh">
                        週一早上 8:30，五個要點：什麼已完成、什麼卡住、什麼等你拍板。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Risk &amp; opportunity scan</span>
                    <span lang="zh">風險和機會掃描</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      Churn signals, supplier trouble, team capacity — the agent
                      flags them while they&rsquo;re still small.
                    </span>
                      <span lang="zh">
                        客戶流失徵兆、供應商問題、team capacity。Agent 在問題還小時就 flag 出來。
                      </span>
                  </p>
                </div>
                <div className="func-item">
                  <span className="fi-label">
                    <span lang="en">Pre-meeting notes</span>
                    <span lang="zh">會前 notes</span>
                  </span>
                  <p className="fi-desc">
                    <span lang="en">
                      1 hour before any meeting, agent drops a 1-page brief: who
                      you&apos;re meeting, what was last discussed, talking
                      points.
                    </span>
                      <span lang="zh">
                        任何 meeting 前一小時，agent 把一頁簡報送到你 inbox：你要見誰、上次談過什麼、這次重點。
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
                        每天追蹤五個競爭對手。Agent 每週給你一份摘要，只講真正有變動的部分。
                      </span>
                  </p>
                </div>
              </div>
            </div>
      </FuncSlide>
    </>
  );
}
