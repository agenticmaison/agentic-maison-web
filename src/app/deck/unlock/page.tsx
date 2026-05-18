import { UnlockForm } from './unlock-form';

/**
 * /deck/unlock — password gate for the /deck route. Reached either
 * directly (`/deck/unlock`) or via a rewrite from src/proxy.ts when the
 * `am-deck` cookie is missing or invalid.
 *
 * Restrained, maison voice. Title block + brand mark, one input, one
 * submit, one neutral helper line, optional inline "Incorrect" error.
 * No "Welcome!", no help text, no animation.
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
    <div className="unlock-shell">
      <section
        className="unlock-card"
        aria-labelledby="unlock-title"
        role="region"
      >
        <span className="reg tl" aria-hidden="true" />
        <span className="reg tr" aria-hidden="true" />
        <span className="reg bl" aria-hidden="true" />
        <span className="reg br" aria-hidden="true" />
        <span className="unlock-brand">
          <b>Agentic</b>
          <span className="diamond" aria-hidden="true" />
          <i>Maison</i>
        </span>
        <p className="unlock-doctype">AI Practice · Presentation</p>
        <h1 id="unlock-title" className="unlock-title">
          Restricted <em>access.</em>
        </h1>
        <p className="unlock-line">Enter the password to view.</p>
        <UnlockForm from={safeFrom} />
      </section>
    </div>
  );
}
