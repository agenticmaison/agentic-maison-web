/**
 * /chateau — every string, manifest and pacing number the tour uses.
 *
 * Edit copy here. Edit pacing here. The component files read this and
 * nothing else; nothing below is baked into pixels.
 *
 * Units: `vh` is CSS viewport heights of pinned scroll travel. Frames are
 * local to their scene's 18 fps sequence, zero-based. A segment whose `from`
 * equals its `to` is a still-frame reading hold.
 */

export type SceneId =
  | 'exterior'
  | 'foyer'
  | 'sales'
  | 'decision-support'
  | 'insights';

export interface SceneManifest {
  /** Folder under `FRAME_BASE`. */
  dir: string;
  /** Decoded frame count of the 18 fps WebP sequence. */
  count: number;
  width: number;
  height: number;
  /** Zero-padded index pattern, e.g. `0000.webp`. */
  pattern: '%04d.webp';
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

/**
 * A tracked plane in the footage: corner positions as fractions of the frame
 * (x right, y down, 0–1; values outside 0–1 mean the corner is off-frame),
 * keyed by local frame. The overlay interpolates between keys.
 */
export interface QuadKey {
  frame: number;
  /** Top-left, top-right, bottom-right, bottom-left. */
  quad: [[number, number], [number, number], [number, number], [number, number]];
}

export interface TrackedPlane {
  keys: QuadKey[];
  /** Local frame window in which the overlay is shown; fades over `feather` frames at each end. */
  visible: [number, number];
  feather: number;
}

export interface SceneCopy {
  /** Small mono label above the heading. Absent on the exterior hero. */
  label?: string;
  heading: string;
  support: string;
  /** Present on rooms; absent where the story says "no copy". */
  cta?: boolean;
  /** Where the block sits over the footage. */
  placement: 'hero' | 'lower-left';
  beat: CopyBeat;
}

export interface Scene {
  id: SceneId;
  /** Accessible scene name, used by the reduced-motion layout and image alt text. */
  name: string;
  manifest: SceneManifest;
  segments: Segment[];
  copy: SceneCopy;
  /** Sales projection plane. */
  plane?: TrackedPlane;
}

export const FRAME_BASE = '/assets/chateau/frames';

export const ui = {
  scrollDown: 'Scroll down',
  next: 'Next',
  cta: 'Discuss your workflow',
  loaderTitle: 'Preparing your visit',
  loaderFailed: 'The tour couldn’t load. You can still explore the work below.',
  demoLabel: 'Illustrative demo',
  afterTourId: 'after-tour',
  nav: {
    home: 'Home',
    journal: 'Journal',
    digital: 'Digital',
    email: 'studio@agenticmaison.com',
  },
} as const;

export const salesDemo = {
  appTitle: 'Sales Ops Agent',
  user: 'What’s next for Harbour Trading?',
  agent:
    'They asked for a revised quote. Confirm delivery timing before following up.',
  source: 'Source: account note',
} as const;

export const contact = {
  heading: 'Start with the work that needs attention.',
  support:
    'Tell us where your team gets stuck. We’ll explore where AI could help.',
} as const;

export const metadata = {
  title: 'A tour of the maison',
  description:
    'A scroll-driven walk through Agentic Maison: the company brain, the Sales Ops Agent, the Decision Support Agent and the Insights Agent.',
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
      count: 217,
      width: 1280,
      height: 720,
      pattern: '%04d.webp',
      poster: '/assets/chateau/posters/01-exterior.webp',
      focus: [0.7, 0.62],
    },
    // 200 vh, including one 30 vh hold.
    segments: [
      { vh: 60, from: 0, to: 72 }, // descent: distant house becomes a destination
      { vh: 30, from: 72, to: 72 }, // hold: house established, hero readable
      { vh: 60, from: 72, to: 171 }, // approach to walking height and the forecourt
      { vh: 40, from: 171, to: 207 }, // slowed: steps and the front door fill the frame
      { vh: 10, from: 207, to: 216 }, // through the door into the dark
    ],
    copy: {
      heading: 'Put AI to work in your business.',
      support:
        'We build AI workflows around your team, your knowledge and the decisions you make.',
      placement: 'hero',
      beat: { enter: [0, 0], exit: [90, 110] },
    },
  },
  {
    id: 'foyer',
    name: 'The foyer and the company brain',
    manifest: {
      dir: '02-foyer',
      count: 180,
      width: 1280,
      height: 720,
      pattern: '%04d.webp',
      poster: '/assets/chateau/posters/02-foyer.webp',
      focus: [0.56, 0.5],
    },
    // 170 vh, including one 30 vh hold.
    segments: [
      { vh: 10, from: 0, to: 9 }, // dark corridor, lit doorway ahead
      { vh: 45, from: 9, to: 63 }, // through the door; the sphere is revealed
      { vh: 30, from: 63, to: 63 }, // hold: full reveal
      { vh: 45, from: 63, to: 126 }, // arc right of the sphere
      { vh: 30, from: 126, to: 171 }, // slowed approach to the single rear door
      { vh: 10, from: 171, to: 179 }, // into the dark
    ],
    copy: {
      label: 'Company brain',
      heading: 'Give AI the context of your business.',
      support:
        'Connect the knowledge your team relies on, so AI can work with the context behind each request.',
      placement: 'lower-left',
      beat: { enter: [35, 50], exit: [85, 100] },
    },
  },
  {
    id: 'sales',
    name: 'Sales Ops Agent — the projection room',
    manifest: {
      dir: '03-sales',
      count: 180,
      width: 1280,
      height: 720,
      pattern: '%04d.webp',
      poster: '/assets/chateau/posters/03-sales.webp',
      focus: [0.6, 0.45],
    },
    // 150 vh, including one 30 vh hold.
    segments: [
      { vh: 10, from: 0, to: 9 }, // doorway
      { vh: 25, from: 9, to: 54 }, // entry; the projection settles centre-right
      { vh: 30, from: 54, to: 81 }, // slowed demonstration move
      { vh: 30, from: 81, to: 81 }, // hold: phone, copy and CTA readable
      { vh: 45, from: 81, to: 171 }, // turn and departure towards the door
      { vh: 10, from: 171, to: 179 }, // the footage ends black
    ],
    copy: {
      label: 'Sales Ops Agent',
      heading: 'Keep the next sales step in view.',
      support:
        'Ask about an account, check the latest update and prepare a follow-up in Telegram.',
      cta: true,
      placement: 'lower-left',
      beat: { enter: [20, 35], exit: [95, 110] },
    },
    plane: {
      // Projection corners read from gridded frames 45, 81, 117 and 135.
      keys: [
        {
          frame: 36,
          quad: [
            [0.4, 0.14],
            [0.76, 0.08],
            [0.76, 0.58],
            [0.4, 0.6],
          ],
        },
        {
          frame: 45,
          quad: [
            [0.402, 0.125],
            [0.781, 0.062],
            [0.781, 0.59],
            [0.402, 0.6],
          ],
        },
        {
          frame: 81,
          quad: [
            [0.402, 0.132],
            [0.805, 0.03],
            [0.805, 0.62],
            [0.402, 0.605],
          ],
        },
        {
          frame: 117,
          quad: [
            [0.06, 0.0],
            [0.585, -0.06],
            [0.585, 0.66],
            [0.06, 0.63],
          ],
        },
        {
          frame: 135,
          quad: [
            [-0.3, -0.02],
            [0.39, -0.1],
            [0.39, 0.71],
            [-0.3, 0.69],
          ],
        },
      ],
      visible: [40, 112],
      feather: 8,
    },
  },
  {
    id: 'decision-support',
    name: 'Decision Support Agent — the monitor chamber',
    manifest: {
      dir: '04-decision-support',
      count: 180,
      width: 1280,
      height: 720,
      pattern: '%04d.webp',
      poster: '/assets/chateau/posters/04-decision-support.webp',
      focus: [0.5, 0.55],
    },
    // 150 vh, including one 30 vh hold.
    segments: [
      { vh: 10, from: 0, to: 9 }, // the room is already visible and brightening
      { vh: 25, from: 9, to: 54 }, // entry; the seated figure stays central
      { vh: 30, from: 54, to: 54 }, // hold: figure and monitor wall
      { vh: 30, from: 54, to: 99 }, // slowed shallow arc
      { vh: 45, from: 99, to: 171 }, // departure past the figure to the door
      { vh: 10, from: 171, to: 179 }, // dark oak
    ],
    copy: {
      label: 'Decision Support Agent',
      heading: 'See the trade-offs before you decide.',
      support:
        'Bring your business information together to compare options, test assumptions and decide what to do next.',
      cta: true,
      placement: 'lower-left',
      beat: { enter: [15, 30], exit: [70, 85] },
    },
  },
  {
    id: 'insights',
    name: 'Insights Agent — the hologram console',
    manifest: {
      dir: '05-insights',
      count: 180,
      width: 1280,
      height: 720,
      pattern: '%04d.webp',
      poster: '/assets/chateau/posters/05-insights.webp',
      focus: [0.6, 0.5],
    },
    // 150 vh, including one 30 vh hold.
    segments: [
      { vh: 10, from: 0, to: 9 }, // dark entry
      { vh: 25, from: 9, to: 72 }, // approach; robot and holograms
      { vh: 30, from: 72, to: 72 }, // hold
      { vh: 30, from: 72, to: 117 }, // slowed gesture at the console
      { vh: 45, from: 117, to: 171 }, // turn to the side exit
      { vh: 10, from: 171, to: 179 }, // dark oak; hands to contact
    ],
    copy: {
      label: 'Insights Agent',
      heading: 'Find what changed. Understand why.',
      support:
        'Surface shifts in your business data and follow the evidence before choosing a response.',
      cta: true,
      placement: 'lower-left',
      beat: { enter: [15, 30], exit: [70, 85] },
    },
  },
];
