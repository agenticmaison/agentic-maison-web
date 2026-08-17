import type { MDXComponents } from 'mdx/types';
import { proseComponents } from '@/lib/journal/prose-components';

/**
 * Required file convention for `@next/mdx`. The mappings themselves live in
 * `src/lib/journal/prose-components.tsx`, because journal bodies are compiled
 * from a string at build time and pass the map explicitly rather than picking
 * it up through this hook.
 */
export function useMDXComponents(): MDXComponents {
  return proseComponents;
}
