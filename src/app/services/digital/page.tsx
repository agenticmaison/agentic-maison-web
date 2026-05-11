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
      <main className="min-h-[calc(100vh-var(--header-band-h))] grid content-center py-[clamp(3rem,8vw,6rem)] px-[clamp(1.5rem,3vw,3rem)] gap-[1.75rem] max-w-[56ch] mx-auto [scroll-margin-top:var(--header-band-h)]">
        <span className="font-mono text-[0.72rem] tracking-[0.16em] uppercase text-brass">
          <span lang="en">Plate III · Digital Practice</span>
          <span lang="zh">圖版 III · 數位實踐</span>
        </span>
        <h1 className="font-display font-semibold text-[clamp(2.5rem,5vw,4rem)] leading-[1.04] tracking-[-0.02em] m-0 [&_em]:italic [&_em]:text-brass">
          <span lang="en">Sites built like <em>buildings</em>.</span>
          <span lang="zh">如<em>建築</em>般打造的網站。</span>
        </h1>
        <p className="font-body text-[1.08rem] leading-[1.7] text-ink-2 m-0">
          <span lang="en">
            The full Digital Practice plate is being drawn in the atelier. For
            now, please reach the studio directly.
          </span>
          <span lang="zh">
            完整的數位實踐圖版正在工坊繪製中。在此之前，歡迎直接與工坊聯絡。
          </span>
        </p>
        <Link
          className="font-mono text-[0.74rem] tracking-[0.14em] uppercase text-ink border-b border-ink pb-[4px] w-fit transition-colors duration-200 hover:text-brass hover:border-brass"
          href="/#services"
        >
          <span lang="en">← Back to the maison</span>
          <span lang="zh">← 返回工坊</span>
        </Link>
      </main>
    </SheetShell>
  );
}
