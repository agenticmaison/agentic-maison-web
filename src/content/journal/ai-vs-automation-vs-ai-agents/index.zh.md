---
slug: "ai-vs-automation-vs-ai-agents"
num: "No. 004"
date: "2026-05-23"
dateDisplay: "2026年5月23日"
title: "AI、自動化、AI Agent：中小企應該揀邊個？"
dek: |-
  自動化跟規則做嘢、AI理解語言、Agent追求目標 — 大部分中小企買咗Agent但係基本自動化已經做到。
metaDescription: |-
  中小企適用嘅傳統自動化、AI輔助自動化同AI Agent實際分別：邊個情況用邊個、真實成本、同最常見嘅買錯決定。
author: "vincent"
leafEmphasis: "AI Agent"
titleEmphasis: "AI Agent"
faq:
  - question: |-
      AI、自動化同AI Agent有咩分別？
    answer: |-
      自動化跟預設規則做嘢。AI（好似Claude或GPT）係喺workflow入面負責一個理解任務嘅smart component。AI Agent接一個目標然後自己諗步驟，識推理同中途調整。每一個都比前一個powerful，但係亦比前一個貴、比前一個易壞。
  - question: |-
      咩係傳統自動化？
    answer: |-
      傳統自動化係跟固定if-then規則做嘢嘅軟件。你定trigger、步驟同結果，工具就照你寫嘅執行。工具：Zapier、Make、n8n、Microsoft Power Automate。價錢：大部分中小企每月港幣$0至$400。
  - question: |-
      咩係AI-assisted automation？
    answer: |-
      AI-assisted automation即係喺rule-based workflow入面用大型語言模型（Claude或GPT）處理一個specific理解任務（分類、總結、草擬、抽取）。Workflow其餘部分繼續做自動化邏輯。比full AI Agent平，係中小企約90%問題嘅啱pattern。
  - question: |-
      咩係AI Agent？
    answer: |-
      AI Agent係接一個目標然後自己諗步驟嘅軟件。佢推理、叫工具、睇結果、調整plan，一直做到目標達成或者卡住為止。成本：港幣$15,000至$80,000建構，每月港幣$1,000至$10,000運行。
  - question: |-
      我嘅中小企應該揀邊個？
    answer: |-
      用解決到問題嘅最平方案開始。按次序問三個問題：(1) Input可唔可以預測？用自動化。(2) Workflow需唔需要理解語言？加AI-assisted automation。(3) 需唔需要真正多步推理連中途調整？呢個時候先用AI Agent。大部分中小企需要mix，但係重心放喺自動化。
  - question: |-
      中小企幾時應該用AI Agent？
    answer: |-
      只有當(1) workflow真正需要多步推理而唔係固定步驟、(2) input係非結構化同唔可預測、(3) 每個task人類審核嘅成本超過建構同維護agent嘅成本。如果你嘅情況唔match至少兩個，就暫時唔需要AI Agent。
  - question: |-
      2026年每個選項成本幾多？
    answer: |-
      傳統自動化：每月港幣$0至$400。AI-assisted automation：加大約每月港幣$160 AI assistant訂閱。AI Agent：港幣$15,000至$80,000一次性建構，每月港幣$1,000至$10,000運行。港幣$160嘅自動化大約比港幣$40,000嘅agent build平250倍，做同樣嘅結果。
  - question: |-
      揀之間最常見嘅錯誤係咩？
    answer: |-
      買咗AI Agent，但係基本自動化已經做到。Overbuy徵兆：供應商乜都叫做「agent」、workflow有清晰重複pattern、input係結構化（表單、格式可預測嘅email、資料庫event）。結構化workflow係自動化主場，唔係agent地頭。
---

> **價格提示：** AI同自動化嘅價錢經常變。下面數字當作working range睇，唔係正式報價。買之前去各供應商網站check最新價。

2026年3月一次審計，一個6人服務業老闆問我哋應該買邊個「AI工具」。聽完佢嘅問題後，答案係：一個基本Zapier自動化（每月港幣\$160）、Claude Pro做內容草擬（每月港幣\$160）、零個AI Agent。佢之前畀供應商報咗港幣\$40,000整一個讀表單嘅「AI Agent」。Zapier做同一件事，價錢只係零頭。

呢個就係陷阱。三個類別聽落差唔多，但係價錢差天共地。揀錯浪費幾萬蚊。呢份指南用簡單語言解釋三者分別，連住一條主線：用解決到問題嘅最平方案開始。

## AI、自動化同AI Agent有咩分別？

自動化跟預設規則做嘢。AI理解語言或者內容。AI Agent追求目標。每一個都比上一個更powerful、亦更貴、更易壞。

當係請三種唔同嘅人：

- **自動化** 係一個跟checklist做嘢嘅junior admin。Step 1、step 2、step 3。佢幾乎唔會走樣。佢絕對唔會即興。佢都幾乎唔會miss咗一步你寫低嘅嘢（除非API失敗或者schema drift，但係呢啲係工程現實）。
- **AI** 係一個叫嚟做一件事嘅專家。「睇下呢封email，分類佢屬於邊類。」佢做好嗰一件事就走。
- **AI Agent** 係請一個manager畀佢一個目標。「Onboard呢個新客。」佢自己諗步驟、需要時叫其他專家、做完報告畀你。

任何business問題嘅啱答案，通常係三樣mix用。錯誤係用AI Agent去做基本自動化就搞掂嘅嘢。

## 咩係傳統自動化？

傳統自動化係用一組固定if-then規則完成任務嘅軟件。你定trigger、你定步驟、你定結果。軟件就照做，每次都一樣，唔諗。

2026年經典例子：

- 表單提交觸發email去你嘅sales team
- 新Stripe付款喺Google Sheet開一行
- Slack訊息24小時冇人回就archive
- 客戶sign up就入CRM加「trial」tag

做呢啲嘢嘅工具：Zapier、Make、n8n、Microsoft Power Automate。價錢：大部分中小企需要每月港幣\$0至\$400。

幾時壞：input對唔上你寫嘅規則。客人打「呃我可能想退錢？」，你條規則係搵「退款請求」。自動化漏咗，客戶等。

呢個就係自動化嘅長短處，一句講完。Input對得上spec嘅時候，極度可靠。對唔上嘅時候，廢。

## 咩係AI-assisted automation？

AI-assisted automation即係喺rule-based workflow入面用大型語言模型（Claude或GPT嗰啲）處理一個specific task。Workflow本身仍然係自動化邏輯。AI係一個smart component，你需要理解、判斷或者生成嘅時候先叫佢。

常見AI-assisted automation任務：

- 「睇呢封客戶email，分類：退款、技術、銷售或其他」
- 「將30頁合約總結成5個bullet」
- 「按呢個lead嘅查詢，寫個個人化回覆」
- 「將呢封日文email翻譯做英文」
- 「由呢張PDF抽出發票號碼、總額、日期」

AI做一件事。Workflow其餘嘅嘢（幾時叫佢、output點處理、結果送去邊）都係自動化邏輯。

點解呢樣重要：AI inside automation比AI Agent平好多。你係per API call畀錢（每call幾蚊仙），唔係建一個複雜嘅autonomous system。中小企90%嘅問題，呢個就係正確pattern。

## 咩係AI Agent？

AI Agent係接一個目標然後自己諗步驟嘅軟件。佢推理下一步應該做咩。叫工具。睇結果。如果有問題就調整plan。一直做到目標達成或者卡住為止。

簡單workflow問：「Trigger有冇fire？有 -> 做step A -> 做step B -> 完。」

Agent問：「呢個情況需要乜？等我check CRM。係喎，個客嬲緊。等我睇佢上三張ticket。等我draft個回覆。等我check下我個回覆match唔match我哋嘅退款政策。等我send。等我update CRM記低我做咗咩。」

Agent適合嘅地方：

- Onboard新客（讀佢input、5個工具set account、send welcome email、安排check-in）
- 處理客戶投訴（讀歷史、決定可唔可以退、執行、寫道歉、必要時升級畀人）
- 銷售call前research個prospect（拉LinkedIn、最近新聞、公司規模、整brief）

2026年建agent嘅工具：n8n、Make、Microsoft Copilot Studio，加custom build。成本：每月港幣\$1,000至\$10,000運行、港幣\$15,000至\$80,000建構。

幾時壞：CMU/Princeton嘅 **TheAgentCompany** benchmark發現，最強嘅agent喺production-style環境，多步任務自動完成率得30至35%左右（[來源](https://the-agent-company.com/)）。Chain越長，出錯位越多。任何超過5個決定點嘅workflow，要有人類checkpoint。

## 我個生意究竟需要邊個？

用解決到問題嘅最平方案開始。平嘅唔work先升級。呢條規則貫穿我哋做嘅每一個審計。

按次序問三個問題：

**1. Input可唔可以預測？** 可以嘅話用傳統自動化。新Stripe付款一定有同樣fields。表單一定有同樣問題。自動化處理呢啲嘢，每月不足\$20美金，幾乎冇fail。

**2. Workflow需唔需要理解語言或內容？** 需要嘅話，加AI-assisted automation。AI處理理解嗰step（分類、總結、草擬、抽取），workflow其餘部分繼續照rule-based自動化邏輯行。

**3. Workflow需唔需要真正多步推理，連住中途調整？** 只有呢個情況先需要AI Agent。大部分中小企以為自己需要呢個。大部分都唔需要。

簡單測試：如果你寫到workflow做flowchart、有清楚嘅if-then分支，就唔需要agent。自動化加AI component搞得掂。如果workflow更似「諗下應該點做」而唔係「跟住啲步驟做」，咁先可能需要agent。

## 大部分中小企暫時唔需要AI Agent

呢句係呢篇文章最有用嘅句子。供應商唔會講。

我哋審計入面，被pitch做「需要AI Agent」嘅workflow，幾乎全部用自動化或者AI-assisted automation解決會更乾淨。間公司係喺度畀錢養佢唔需要嘅autonomy、佢維護唔到嘅複雜度、佢忍受唔到嘅失敗率。

中小企用AI Agent，只有三種情況啱：

- 真係需要多步推理（真正嘅「諗下應該點做」，唔係「做呢啲步驟」）
- Input係非結構化、唔可預測（open-ended訊息、混合格式、客戶語言千變萬化）
- 每個task人類審核嘅成本，超過建構同維護agent嘅成本

如果你嘅情況唔match至少兩個，就暫時唔需要AI Agent。你需要自動化。可能需要AI-assisted automation。將agent budget留畀你真係需要嗰一年。

幾時用AI Agent：試過平嘅選擇、平嘅真係處理唔到呢份工，先用。

## 2026年每個選項成本幾多？

成本上，三個類別真係分得開。

**傳統自動化：** 每月港幣\$0至\$400工具費。設定時間：每個workflow 1至3小時。幾乎冇持續成本。最平、最可靠嘅選擇。

**AI-assisted automation：** 喺自動化工具上面加一個AI assistant訂閱，大約每月港幣\$160。設定時間：每個workflow 2至5小時，因為要寫好prompt。API成本對中小企好細（大部分use case每月港幣\$40以下）。呢個就係AI automation for SMBs嘅sweet spot。

**AI Agent：** 港幣\$15,000至\$80,000一次性建構成本，要係叫得做合格嘅custom agent。每月港幣\$1,000至\$10,000運行，視乎複雜程度。加每月2小時維護。最powerful嘅選擇，亦都係建構同維護最貴嘅。

條數：港幣\$160嘅自動化解決你嘅問題，大約比港幣\$40,000嘅agent build平250倍。如果自動化work，就用自動化。Agent預算留畀真正需要autonomy嘅workflow。

## 揀錯之間最常見嘅錯誤係咩？

買咗AI Agent，但係基本自動化已經做到。我哋幾乎每次審計都見到。

三個overbuy嘅徵兆：

**供應商乜都叫做「agent」。** 2026年，「AI agent」比「automation」賣得起。供應商喺chatbot、簡單自動化、AI功能上面都貼住呢個label。問清楚個系統可以讀同寫去咩工具。如果只係生成文字，就唔係真正agent。

**Workflow有清晰、重複嘅pattern。** 如果你可以講workflow做「X發生時，做Y，再做Z」，就唔需要agent。需要自動化。決策已經由你做咗，寫咗喺規則入面。

**Input係結構化（表單、格式可預測嘅email、資料庫event）。** 結構化input係自動化嘅主場。Agent嘅強項係非結構化input，需要系統自己諗發生緊咩。

另一面：唔好underbuy。如果你逼自動化處理混亂、非結構化嘅客戶語言加每星期10幾個edge case，你修自動化嘅時間會比人手做workflow更多。咁就要升級去AI-assisted automation，或者真正agent。

## 對你2026年tech stack嚟講即係點？

大部分中小企2026年應該跑：

- 2至5個傳統自動化（lead intake、付款處理、基本通知），每月合共港幣\$160至\$400
- 1或2個AI-assisted automation workflow（客戶支援分流、內容草擬、文件抽取），AI訂閱加自動化工具每月合共港幣\$160至\$400
- 0至1個AI Agent（只有workflow真正需要autonomy先要）

呢個stack工具費每月港幣\$1,600以下。比大部分供應商報你嘅平好多。

返返去主線：用解決到問題嘅最平方案開始。2026年靠AI贏嘅生意，唔係買最先進系統嗰啲。係有紀律、用最平但係穩定work嘅嘢解決workflow嗰啲。佢哋知幾時應該畀港幣\$160，而唔係港幣\$40,000。
