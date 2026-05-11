import Link from "next/link";
import type { Metadata } from "next";
import { SheetShell } from "@/components/sheet-shell";

export const metadata: Metadata = {
  title: "AI Practice",
  description:
    "Intelligence, made resident. Agentic Maison's AI Practice — agents, internal tools, and the operating habits to keep them useful long past the demo.",
  alternates: { canonical: "/services/ai" },
};

export default function AiPracticeStub() {
  return (
    <SheetShell>
      <main className="stub-page">
        <span className="stub-ref">
          <span lang="en">Plate II · AI Practice</span>
          <span lang="zh">圖版 II · AI 實踐</span>
        </span>
        <h1>
          <span lang="en">Intelligence, made <em>resident</em>.</span>
          <span lang="zh">讓智慧 · <em>駐於業務之中</em>。</span>
        </h1>
        <p>
          <span lang="en">
            The full AI Practice plate is being drawn in the atelier. For now,
            please reach the studio directly.
          </span>
          <span lang="zh">
            完整的 AI 實踐圖版正在工坊繪製中。在此之前，歡迎直接與工坊聯絡。
          </span>
        </p>
        <Link className="stub-back" href="/#services">
          <span lang="en">Back to the maison</span>
          <span lang="zh">返回工坊</span>
        </Link>
      </main>
    </SheetShell>
  );
}
