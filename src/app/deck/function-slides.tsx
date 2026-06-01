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
              <span lang="zh">專屬銷售智能體</span>
        </>
      }>
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
      </FuncSlide>
      <FuncSlide id={6} total={total} title={
        <>
<span lang="en">
                Agents for <em>Account Management</em>
              </span>
              <span lang="zh">專屬客戶管理智能體</span>
        </>
      }>
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
      </FuncSlide>
      <FuncSlide id={7} total={total} title={
        <>
<span lang="en">
                Agents for <em>Operations</em>
              </span>
              <span lang="zh">專屬營運智能體</span>
        </>
      }>
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
      </FuncSlide>
      <FuncSlide id={8} total={total} title={
        <>
<span lang="en">
                Agents for <em>Accounting</em>
              </span>
              <span lang="zh">專屬帳務與合規智能體</span>
        </>
      }>
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
      </FuncSlide>
      <FuncSlide id={9} total={total} title={
        <>
<span lang="en">
                Agents for <em>Human Resources</em>
              </span>
              <span lang="zh">專屬人事與團隊智能體</span>
        </>
      }>
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
      </FuncSlide>
      <FuncSlide id={10} total={total} title={
        <>
<span lang="en">
                Agents for <em>Marketing</em>
              </span>
              <span lang="zh">專屬品牌與行銷智能體</span>
        </>
      }>
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
      </FuncSlide>
      <FuncSlide id={11} total={total} title={
        <>
<span lang="en">
                Agents for <em>You</em>
              </span>
              <span lang="zh">專屬經營者全局的智能體</span>
        </>
      }>
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
      </FuncSlide>
    </>
  );
}
