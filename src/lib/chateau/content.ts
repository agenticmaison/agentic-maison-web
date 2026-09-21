/**
 * /chateau — every string, manifest and pacing number the tour uses.
 *
 * Edit copy here. Edit pacing here. The component files read this and
 * nothing else; nothing below is baked into pixels.
 *
 * Units: `vh` is CSS viewport heights of pinned scroll travel. Frames are
 * local to their scene's 12 fps sequence, zero-based. A segment whose `from`
 * equals its `to` is a still-frame reading hold.
 */

export type SceneId = 'exterior' | 'foyer' | 'decision-support' | 'insights';

export interface SceneManifest {
  /** Folder under `FRAME_BASE`. */
  dir: string;
  /** Decoded frame count of the 12 fps AVIF sequence. */
  count: number;
  width: number;
  height: number;
  /** Zero-padded index pattern, e.g. `0000.avif`. */
  pattern: '%04d.avif';
  /** Poster / reduced-motion still. Absolute public path. */
  poster: string;
  /**
   * Where the frame's subject sits, as fractions of the frame. When the
   * viewport is a different shape from the frame, the cover crop keeps this
   * point in view instead of the centre, so a portrait phone still shows the
   * chateau, the sphere and the projection.
   */
  focus: [number, number];
}

export interface Segment {
  /** Scroll distance this beat occupies, in vh. */
  vh: number;
  /** Local frame at the start of the beat. */
  from: number;
  /** Local frame at the end of the beat. Equal to `from` for a hold. */
  to: number;
}

/** A copy block's opacity ramp, in local vh of its scene. */
export interface CopyBeat {
  /** [start, end] vh over which the block fades in. */
  enter: [number, number];
  /** [start, end] vh over which the block fades out. */
  exit: [number, number];
}

export interface SceneCopy {
  heading: string;
  support: string;
  /** Where the block sits over the footage. */
  placement: 'hero' | 'lower-left';
  next?: string;
  beat: CopyBeat;
}

export interface Scene {
  id: SceneId;
  /** Accessible scene name, used by the reduced-motion layout and image alt text. */
  name: string;
  manifest: SceneManifest;
  segments: Segment[];
  copy: SceneCopy;
}

export const FRAME_BASE = '/assets/chateau/frames';

export const ui = {
  loaderTitle: 'Preparing your visit',
  loaderFailed: 'The tour couldn’t load. You can still explore the work below.',
  afterTourId: 'after-tour',
  contactEmail: 'studio@agenticmaison.com',
} as const;

export interface MenuLink {
  label: string;
  /** A site path (`/journal`), an in-page anchor (`#after-tour`) or a `mailto:`. */
  href: string;
}

/** The chrome's menu. In-page anchors scroll the tour; paths get the locale. */
export const menu = {
  ariaLabel: 'Menu',
  open: 'Navigate',
  close: 'Close',
  pages: [
    { label: 'The Maison', href: '/#maison' },
    { label: 'The Journal', href: '/journal' },
    { label: 'Contact', href: '#after-tour' },
  ] as MenuLink[],
  small: [
    {
      label: 'studio@agenticmaison.com',
      href: 'mailto:studio@agenticmaison.com',
    },
  ] as MenuLink[],
} as const;

export const contact = {
  heading: 'Start with the work that needs attention.',
  support:
    'Tell us where your team gets stuck. We’ll explore where AI could help.',
} as const;

export const metadata = {
  title: 'A tour of the maison',
  description:
    'A scroll-driven walk through Agentic Maison: the Company Brain, the Overseer and the Insights Agent.',
} as const;

/**
 * Scenes in tour order. Frame counts are the decoded counts of the delivery
 * sequences (`designs/chateau/assembly/README.md`). Beat frames were chosen
 * from the footage; see the production note for the reasoning per scene.
 */
export const scenes: Scene[] = [
  {
    id: 'exterior',
    name: 'The chateau from the approach',
    manifest: {
      dir: '01-exterior',
      count: 144,
      width: 2560,
      height: 1440,
      pattern: '%04d.avif',
      poster: '/assets/chateau/posters/01-exterior.webp',
      focus: [0.7, 0.62],
    },
    // 200 vh, including one 30 vh hold.
    segments: [
      { vh: 60, from: 0, to: 48 }, // descent: distant house becomes a destination
      { vh: 30, from: 48, to: 48 }, // hold: house established, hero readable
      { vh: 60, from: 48, to: 114 }, // approach to walking height and the forecourt
      { vh: 40, from: 114, to: 138 }, // slowed: steps and the front door fill the frame
      { vh: 10, from: 138, to: 143 }, // through the door into the dark
    ],
    copy: {
      heading: 'Empower Sales with AI Agents.',
      support: '',
      placement: 'hero',
      next: 'Enter the Maison',
      beat: { enter: [0, 0], exit: [90, 110] },
    },
  },
  {
    id: 'foyer',
    name: 'The foyer and the company brain',
    manifest: {
      dir: '02-foyer',
      count: 120,
      width: 2560,
      height: 1440,
      pattern: '%04d.avif',
      poster: '/assets/chateau/posters/02-foyer.webp',
      focus: [0.56, 0.5],
    },
    // 170 vh, including one 30 vh hold.
    segments: [
      { vh: 10, from: 0, to: 6 }, // dark corridor, lit doorway ahead
      { vh: 45, from: 6, to: 42 }, // through the door; the sphere is revealed
      { vh: 30, from: 42, to: 42 }, // hold: full reveal
      { vh: 45, from: 42, to: 84 }, // arc right of the sphere
      { vh: 30, from: 84, to: 114 }, // slowed approach to the single rear door
      { vh: 10, from: 114, to: 119 }, // into the dark
    ],
    copy: {
      heading: 'The Company Brain.',
      support:
        'We transform company data into a central knowledge base for AI agents.',
      placement: 'lower-left',
      next: 'The Overseer',
      beat: { enter: [35, 50], exit: [85, 100] },
    },
  },
  {
    id: 'decision-support',
    name: 'Decision Support Agent — the monitor chamber',
    manifest: {
      dir: '04-decision-support',
      count: 120,
      width: 2560,
      height: 1440,
      pattern: '%04d.avif',
      poster: '/assets/chateau/posters/04-decision-support.webp',
      focus: [0.5, 0.55],
    },
    // 150 vh, including one 30 vh hold.
    segments: [
      { vh: 10, from: 0, to: 18 }, // doorway pass: the chamber is visible through the door from frame 0
      { vh: 25, from: 18, to: 54 }, // settle; the figure centres under the chandelier
      { vh: 30, from: 54, to: 54 }, // hold: figure central, monitor wall complete, chandelier in frame
      { vh: 30, from: 54, to: 78 }, // slowed arc past the figure
      { vh: 45, from: 78, to: 108 }, // turn and departure to the oak door
      { vh: 10, from: 108, to: 119 }, // dark oak
    ],
    copy: {
      heading: 'The Overseer.',
      support:
        'Gain a full picture of your sales operations to inform your decisions.',
      placement: 'lower-left',
      next: 'The Oracle',
      beat: { enter: [15, 30], exit: [70, 85] },
    },
  },
  {
    id: 'insights',
    name: 'Insights Agent — the hologram console',
    manifest: {
      dir: '05-insights',
      count: 120,
      width: 2560,
      height: 1440,
      pattern: '%04d.avif',
      poster: '/assets/chateau/posters/05-insights.webp',
      focus: [0.6, 0.5],
    },
    // 150 vh, including one 30 vh hold.
    segments: [
      { vh: 10, from: 0, to: 6 }, // dark entry
      { vh: 25, from: 6, to: 48 }, // approach; robot and holograms
      { vh: 30, from: 48, to: 48 }, // hold
      { vh: 30, from: 48, to: 78 }, // slowed gesture at the console
      { vh: 45, from: 78, to: 114 }, // turn to the side exit
      { vh: 10, from: 114, to: 119 }, // dark oak; hands to contact
    ],
    copy: {
      heading: 'The Oracle.',
      support: 'Discover trends, patterns and insights from sales data.',
      placement: 'lower-left',
      beat: { enter: [15, 30], exit: [70, 85] },
    },
  },
];
