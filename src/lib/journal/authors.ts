/**
 * Author registry for journal entries.
 *
 * MDX frontmatter references authors by key (e.g. `author: sean`).
 * Avatar images live in `public/assets/team/`.
 */

export interface Author {
  /** Display name. */
  name: { en: string; zh: string };
  /** Short bio — 1-2 lines. */
  bio: { en: string; zh: string };
  /** Path to avatar image (relative to public/). */
  avatar: string;
}

export const authors: Record<string, Author> = {
  sean: {
    name: {
      en: 'Sean',
      zh: 'Sean',
    },
    bio: {
      en: 'Principal',
      zh: '創辦人',
    },
    avatar: '/assets/team/sean.png',
  },
  vincent: {
    name: {
      en: 'Vincent',
      zh: 'Vincent',
    },
    bio: {
      en: 'Partner',
      zh: '合夥人',
    },
    avatar: '/assets/team/vincent.png',
  },
};

export function getAuthor(key: string): Author | undefined {
  return authors[key];
}
