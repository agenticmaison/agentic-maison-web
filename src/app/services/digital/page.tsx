import Link from "next/link";
import type { Metadata } from "next";
import { SheetShell } from "@/components/sheet-shell";

export const metadata: Metadata = {
  title: "Digital Practice",
  description:
    "Sites built like buildings. Agentic Maison's Digital Practice — bespoke web work designed in-house and built to last past a single refresh cycle.",
  alternates: { canonical: "/services/digital" },
};

export default function DigitalPracticeStub() {
  return (
    <SheetShell>
      <main className="stub-page">
        <span className="stub-ref">
          <span lang="en">Plate III · Digital Practice</span>
          <span lang="zh">圖版 III · 數位實踐</span>
        </span>
        <h1>
          <span lang="en">Sites built like <em>buildings</em>.</span>
          <span lang="zh">如<em>建築</em>般打造的網站。</span>
        </h1>
        <p>
          <span lang="en">
            The full Digital Practice plate is being drawn in the atelier. For
            now, please reach the studio directly.
          </span>
          <span lang="zh">
            完整的數位實踐圖版正在工坊繪製中。在此之前，歡迎直接與工坊聯絡。
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
