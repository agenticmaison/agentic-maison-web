import Image from 'next/image';
import { type Author } from '@/lib/journal/authors';

/**
 * Author block displayed below the title/standfirst in journal entries.
 *
 * Shows a small circular avatar, the author name, and a 1-2 line bio.
 * Styled to match the editorial design system (Source Serif body,
 * ink palette, consistent with the journal reading column).
 */

export function JournalAuthor({ author }: { author: Author }) {
  return (
    <div className="flex items-start gap-[clamp(0.75rem,1.5vw,1rem)] mb-[clamp(0.5rem,1vw,0.75rem)]">
      <Image
        src={author.avatar}
        alt=""
        width={48}
        height={48}
        className="rounded-full w-[48px] h-[48px] object-cover flex-shrink-0 border border-rule"
      />
      <div className="flex flex-col gap-[0.15rem]">
        <span className="font-display font-semibold text-[0.95rem] tracking-[-0.01em] text-ink leading-[1.3]">
          <span lang="en">{author.name.en}</span>
          <span lang="zh">{author.name.zh}</span>
        </span>
        <span className="font-body text-[0.82rem] leading-[1.5] text-ink-3">
          <span lang="en">{author.bio.en}</span>
          <span lang="zh">{author.bio.zh}</span>
        </span>
      </div>
    </div>
  );
}
