import type { MDXComponents } from 'mdx/types';

/**
 * Component mappings for journal prose.
 *
 * Maps standard markdown elements to the editorial design system:
 * - h2, h3 → Cormorant display subheading (with scroll offset for TOC anchors)
 * - hr → thin hairline rule (section divider)
 * - p, em, strong, a → body prose styling inherited from wrapper
 *
 * The prose wrapper div on the journal page applies the body typography
 * classes; these component overrides handle elements that need specific
 * class names beyond what the wrapper provides.
 *
 * Lives here rather than in `src/mdx-components.tsx` because journal bodies are
 * compiled from a string at build time (see `compileJournalBody`) and pass this
 * map explicitly. `src/mdx-components.tsx` re-exports it through the
 * `useMDXComponents` hook that `@next/mdx` requires as a file convention.
 */

const subheadClasses =
  'font-display font-bold text-[clamp(1.75rem,2vw,2rem)] ' +
  'leading-[1.25] tracking-[-0.012em] text-ink mt-[clamp(2rem,3vw,2.75rem)] mb-[clamp(1.25rem,2vw,1.75rem)] ' +
  '[&_em]:not-italic [&_em]:text-inherit';

/** Scoped under h2 hierarchy; TOC may include ### targets. */
const subheadH3Classes =
  'font-display font-semibold text-[clamp(1.25rem,1.65vw,1.55rem)] ' +
  'leading-[1.22] tracking-[-0.01em] text-ink mt-[clamp(1.5rem,2.5vw,2rem)] mb-[clamp(0.65rem,1.15vw,0.95rem)] ' +
  '[&_em]:not-italic [&_em]:text-inherit';

/** Clears sticky `.sheet-top-bar` when using native #fragment navigation. */
const anchorTargetClasses = 'header-offset';

const ruleClasses =
  'block w-[3rem] h-px bg-rule border-0 my-[clamp(2rem,3.5vw,2.75rem)]';

const imageClasses =
  'block max-w-full h-auto my-[clamp(1.75rem,3vw,2.5rem)] rounded-[2px]';

// Tables arrive only through `remark-gfm`; Tailwind preflight strips every
// default table rule, so without these a table renders as unspaced text.
// Hairlines in `--rule` and the body face, matching the prose around them —
// the same treatment the `hr` divider and the card lists already use.
const tableScrollClasses =
  'block w-full overflow-x-auto my-[clamp(1.75rem,3vw,2.5rem)]';

// `min-w` is what makes the scroll container do anything: without it four prose
// columns compress to one word per line on a phone rather than scrolling.
const tableClasses =
  'w-full min-w-[34rem] border-collapse text-[0.92em] leading-[1.55] text-left';

const theadClasses = 'border-b border-rule';

const thClasses =
  'font-body font-semibold text-ink align-bottom text-left ' +
  'py-[0.65em] px-[0.9em] first:pl-0 last:pr-0';

const tdClasses =
  'text-ink-2 align-top border-b border-rule ' +
  'py-[0.75em] px-[0.9em] first:pl-0 last:pr-0';

export const proseComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2 className={`${subheadClasses} ${anchorTargetClasses}`} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className={`${subheadH3Classes} ${anchorTargetClasses}`} {...props}>
      {children}
    </h3>
  ),
  hr: (props) => <hr className={ruleClasses} aria-hidden="true" {...props} />,
  // Images arrive from the CMS as plain Markdown — `![alt](/assets/journal/…)`
  // — so their intrinsic dimensions are not known at build time and `next/image`
  // has nothing to size against. A bare `<img>` capped at the column width is
  // the correct primitive here; without the cap, the 1600px-wide WebP the CMS
  // produces overflows the prose column horizontally on every viewport.
  // eslint-disable-next-line @next/next/no-img-element
  img: ({ alt, ...props }) => <img className={imageClasses} alt={alt ?? ''} {...props} />,
  // The wrapper is what keeps a wide table from scrolling the whole page
  // sideways. It is a `div` in the markup, so the prose column stays put and
  // only the table moves.
  table: ({ children, ...props }) => (
    <div className={tableScrollClasses}>
      <table className={tableClasses} {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className={theadClasses} {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th className={thClasses} {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className={tdClasses} {...props}>
      {children}
    </td>
  ),
};
