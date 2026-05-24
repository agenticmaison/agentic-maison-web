import type { MDXComponents } from 'mdx/types';

/**
 * Global MDX component mappings for journal entries.
 *
 * Maps standard markdown elements to the editorial design system:
 * - h2, h3 → Cormorant display subheading (with scroll offset for TOC anchors)
 * - hr → thin hairline rule (section divider)
 * - p, em, strong, a → body prose styling inherited from wrapper
 *
 * The prose wrapper div on the journal page applies the body typography
 * classes; these component overrides handle elements that need specific
 * class names beyond what the wrapper provides.
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

const components: MDXComponents = {
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
};

export function useMDXComponents(): MDXComponents {
  return components;
}
