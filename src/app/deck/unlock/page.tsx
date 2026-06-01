import { DeckBrand } from '../deck-brand';
import { UnlockForm } from './unlock-form';

/**
 * /deck/unlock — password gate for the /deck route. Reached either
 * directly (`/deck/unlock`) or via a rewrite from src/proxy.ts when the
 * `am-deck` cookie is missing or invalid.
 */
export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = params.from;
  const from = Array.isArray(raw) ? raw[0] : raw;
  const safeFrom = from && from.startsWith('/deck') ? from : '/deck';

  return (
    <div className="grid min-h-dvh place-items-center p-[clamp(24px,5vw,48px)]">
      <section
        className="unlock-card relative flex w-full max-w-[420px] flex-col gap-[1.6rem] border border-rule bg-paper p-[clamp(28px,4vw,44px)_clamp(28px,4vw,44px)_clamp(32px,5vw,48px)]"
        aria-labelledby="unlock-title"
        role="region"
      >
        <span className="reg tl" aria-hidden="true" />
        <span className="reg tr" aria-hidden="true" />
        <span className="reg bl" aria-hidden="true" />
        <span className="reg br" aria-hidden="true" />
        <DeckBrand className="text-[1.15rem]" />
        <p className="m-0 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-3">
          AI Practice · Presentation
        </p>
        <h1
          id="unlock-title"
          className="m-0 font-display text-[clamp(1.7rem,3.4vw,2.3rem)] font-medium leading-[1.1] tracking-[-0.012em] text-ink [&_em]:font-medium [&_em]:text-brass [&_em]:italic"
        >
          Restricted <em>access.</em>
        </h1>
        <p className="m-0 font-body text-[0.95rem] text-ink-3">
          Enter the password to view.
        </p>
        <UnlockForm from={safeFrom} />
      </section>
    </div>
  );
}
