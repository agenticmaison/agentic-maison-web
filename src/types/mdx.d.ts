/**
 * Type augmentation for MDX files with journal metadata exports.
 *
 * Journal MDX files export `meta` with entry metadata.
 * This declaration makes TypeScript aware of the export.
 */
declare module "*.mdx" {
  import type { ComponentType } from "react";

  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;

  /** Journal entry metadata exported from MDX frontmatter. */
  export const meta: {
    slug: string;
    date: string;
    title: string;
    description: string;
    author: string;
  };
}
