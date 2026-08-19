/**
 * The generated Open Graph card for a journal entry.
 *
 * One composition, both locales: cream ground, the post's own title set large
 * in the site's display serif, and the wordmark small in the lower-left. No
 * description, no date, no author, no rules. The card is read at thumbnail
 * size in a feed, where a title and a mark are all that survive.
 *
 * Brand notes, from the vault root's identity spec:
 *   - The wordmark is embedded as its finished asset. The wordmark and the seal
 *     are separate assets and are never combined into a lockup, and the brass
 *     diamond never inverts — embedding the PNG honours both without
 *     re-typesetting anything. The seal does not appear on social cards.
 *   - That embedded diamond is the card's brass; nothing else on it is brass,
 *     because a rule or a flourish would be the decorative furniture the card
 *     is specified not to carry.
 *
 * Rendering runs through Satori, which takes fonts as raw binaries rather than
 * through CSS — see `./fonts/README.md` for why the files are committed.
 */

import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Open Graph's canonical card size. Also what LinkedIn and X crop against. */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = 'image/png';

const CREAM = '#ece4d3';
const INK = '#14110b';

const PAD_X = 84;
const PAD_TOP = 84;
const PAD_BOTTOM = 76;
/** Rendered height of the wordmark; its source is 2000 × 139. */
const WORDMARK_H = 30;
const WORDMARK_W = Math.round((2000 / 139) * WORDMARK_H);
/** Air between the last line of the title and the wordmark. */
const WORDMARK_GAP = 60;

const MAX_LINES = 3;
const LINE_WIDTH = OG_SIZE.width - PAD_X * 2;
const TITLE_MAX_HEIGHT =
  OG_SIZE.height - PAD_TOP - PAD_BOTTOM - WORDMARK_H - WORDMARK_GAP;

/** Largest first. The card should be as loud as the title length allows. */
const SIZE_LADDER = [92, 84, 76, 68, 60, 54];

const FONT_DIR = join(process.cwd(), 'src/lib/og/fonts');
const WORDMARK_PATH = join(
  process.cwd(),
  'public/brand/agentic-maison-wordmark-light-2x.png'
);

/**
 * CJK and fullwidth ranges — ideographs, CJK punctuation, compatibility forms
 * and fullwidth Latin. Used both to pick the CJK typesetting metrics and to
 * estimate character widths.
 */
const WIDE_CHAR =
  /[　-〿㐀-䶿一-鿿豈-﫿︰-﹏＀-￯]|[\u{20000}-\u{3ffff}]/u;

/**
 * Assets are read once per process and held. Under static generation that means
 * once per build for all eight cards, rather than eight reads of a 10 MB font.
 */
let assets: Promise<{
  cormorant: Buffer;
  notoSerifTC: Buffer;
  wordmarkSrc: string;
}> | null = null;

function loadAssets() {
  assets ??= (async () => {
    const [cormorant, notoSerifTC, wordmark] = await Promise.all([
      readFile(join(FONT_DIR, 'CormorantGaramond-SemiBold.ttf')),
      readFile(join(FONT_DIR, 'NotoSerifTC-Medium.ttf')),
      readFile(WORDMARK_PATH, 'base64'),
    ]);
    return {
      cormorant,
      notoSerifTC,
      wordmarkSrc: `data:image/png;base64,${wordmark}`,
    };
  })();
  return assets;
}

/** A title is typeset as CJK once ideographs carry more than a fifth of it. */
function isCjkTitle(title: string): boolean {
  const chars = [...title];
  if (chars.length === 0) return false;
  const wide = chars.filter((c) => WIDE_CHAR.test(c)).length;
  return wide / chars.length > 0.2;
}

/**
 * Approximate advance width of a title in em, calibrated against Cormorant
 * Garamond SemiBold rendered by Satori. Only ever used to choose a size from
 * the ladder — the three-line clamp is the real backstop, so being a few
 * percent off costs nothing.
 */
function estimateEmWidth(title: string): number {
  let em = 0;
  for (const ch of title) {
    if (WIDE_CHAR.test(ch)) em += 1;
    else if (ch === ' ') em += 0.24;
    else if (/[A-Z0-9]/.test(ch)) em += 0.6;
    else if (/[a-z]/.test(ch)) em += 0.46;
    else em += 0.45;
  }
  return em;
}

/**
 * Largest ladder size at which the title still fits three lines, by width and
 * by height. Falls through to the smallest size, where the clamp truncates.
 */
function fitTitleSize(title: string, cjk: boolean): number {
  const em = estimateEmWidth(title);
  const lineHeight = cjk ? 1.3 : 1.08;
  // Latin wraps on word boundaries and so wastes some of every line; CJK
  // breaks between any two characters and wastes almost none.
  const usable = LINE_WIDTH * (cjk ? 0.99 : 0.9);

  for (const size of SIZE_LADDER) {
    const lines = Math.ceil((em * size) / usable);
    // The 0.94 is headroom. Noto Serif TC's line box runs taller than
    // `lineHeight × size`, so a three-line Chinese title at the top of the
    // ladder otherwise sits within a few pixels of the wordmark. This costs
    // nothing anywhere else: it only ever rejects the largest size for a
    // three-line CJK title, which is the one case that was crowded.
    const fits = lines * lineHeight * size <= TITLE_MAX_HEIGHT * 0.94;
    if (lines <= MAX_LINES && fits) return size;
  }
  return SIZE_LADDER[SIZE_LADDER.length - 1];
}

/**
 * Render one entry's card.
 *
 * Deliberately takes the title and not the locale: the script of the title
 * itself decides the typesetting, so an English phrase inside a Chinese title —
 * "AI Agent", which two of the four live posts carry — is set in Cormorant
 * while the characters around it are set in Noto Serif TC, and the reverse
 * works too.
 */
export async function renderJournalCard(title: string): Promise<ImageResponse> {
  const { cormorant, notoSerifTC, wordmarkSrc } = await loadAssets();
  const cjk = isCjkTitle(title);
  const fontSize = fitTitleSize(title, cjk);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: CREAM,
          padding: `${PAD_TOP}px ${PAD_X}px ${PAD_BOTTOM}px`,
        }}
      >
        <div
          style={{
            // Satori implements `-webkit-line-clamp`, which is how the title
            // is held to three lines and ellipsised beyond them.
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: MAX_LINES,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: INK,
            fontFamily: '"Cormorant Garamond", "Noto Serif TC"',
            fontSize,
            lineHeight: cjk ? 1.3 : 1.08,
            letterSpacing: cjk ? '-0.005em' : '-0.018em',
          }}
        >
          {title}
        </div>
        <div style={{ display: 'flex', height: WORDMARK_GAP }} />
        {/* Satori renders its own subset of HTML and has no knowledge of
            next/image, so a plain <img> with a data: URI is the only way to
            place the wordmark here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={wordmarkSrc} width={WORDMARK_W} height={WORDMARK_H} alt="" />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        {
          name: 'Cormorant Garamond',
          data: cormorant,
          weight: 600,
          style: 'normal',
        },
        {
          name: 'Noto Serif TC',
          data: notoSerifTC,
          weight: 500,
          style: 'normal',
        },
      ],
    }
  );
}
