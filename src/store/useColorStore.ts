import { create } from 'zustand'

export interface ColorEntry {
  id: string
  hex: string
  label: string
  glow: string
  /** Short line under the hero title */
  tagline: string
  /** Dummy SKU suffix for catalogue feel */
  sku: string
  /** Demo UID string for phone mockup after scan */
  nfcUid: string
  highlights: readonly [string, string, string]
  story: { title: string; body: string }
}

export const COLOR_PALETTE: ColorEntry[] = [
  {
    id: 'green',
    hex: '#2E6F40',
    label: 'Signature Green',
    glow: 'rgba(46,111,64,0.25)',
    tagline: 'The original Clover tone — balanced for everyday carry.',
    sku: 'CLV-SGN-GRN-A1',
    nfcUid: '04:8F:2C:A1:90:72:81',
    highlights: [
      'Matte leaf with vapor-honed white rim',
      'Pairs with earth tones and black hardware',
      'Most popular finish in dummy surveys',
    ],
    story: {
      title: 'Timeless & Natural',
      body:
        'Our signature Clover Green embodies growth and calm confidence. Crafted to blend with natural materials while staying readable on desks and in pockets — a quiet nod to luck without shouting for attention.',
    },
  },
  {
    id: 'blue',
    hex: '#60a5fa',
    label: 'Arctic Blue',
    glow: 'rgba(96,165,250,0.25)',
    tagline: 'Cool signal colour for minimal desks and denim.',
    sku: 'CLV-ARC-BLU-A1',
    nfcUid: '04:1B:9D:44:62:11:90',
    highlights: [
      'High-contrast against silver rim',
      'Reads well under cool office lighting',
      'Dummy pairing: Shortcut blueprints & focus timers',
    ],
    story: {
      title: 'Clarity in Every Touch',
      body:
        'Arctic Blue is for people who like their tools precise and legible. Every tap feels intentional — like switching from noise to signal.',
    },
  },
  {
    id: 'red',
    hex: '#ef4444',
    label: 'Cherry Red',
    glow: 'rgba(239,68,68,0.25)',
    tagline: 'High visibility — hard to misplace on a busy desk.',
    sku: 'CLV-CHR-RED-A1',
    nfcUid: '04:6C:AA:01:33:F8:62',
    highlights: [
      'Bold accent for creative studios',
      'Dummy use case: “Do not disturb” flip workflows',
      'Slight pearlescent topcoat in hero render',
    ],
    story: {
      title: 'Bold by Design',
      body:
        'Cherry Red refuses to be background furniture. It is the finish you choose when your keychain should announce that you care about the details.',
    },
  },
  {
    id: 'purple',
    hex: '#a855f7',
    label: 'Lavender',
    glow: 'rgba(168,85,247,0.25)',
    tagline: 'Soft contrast with a tech-forward personality.',
    sku: 'CLV-LAV-PUR-A1',
    nfcUid: '04:22:E7:9C:55:01:BB',
    highlights: [
      'Balanced saturation for OLED screens',
      'Dummy bundle: “Creative mode” NFC playlist',
      'Works with silver or graphite accessories',
    ],
    story: {
      title: 'Quiet Power',
      body:
        'Lavender carries creative energy without theatrics. It is the colour of late-night ideas that still look composed in morning light.',
    },
  },
  {
    id: 'black',
    hex: '#1e293b',
    label: 'Obsidian Black',
    glow: 'rgba(30,41,59,0.25)',
    tagline: 'Invisible until it catches the light.',
    sku: 'CLV-OBS-BLK-A1',
    nfcUid: '04:F0:11:88:AA:4D:90',
    highlights: [
      'Deep slate leaf with bright white rim',
      'Dummy stat: “Lowest reflectance” in lab screenshots',
      'Ideal for monochrome EDC grids',
    ],
    story: {
      title: 'Invisible Intelligence',
      body:
        'Obsidian Black disappears into your carry until the rim catches a highlight. No colour noise — just function and form in balance.',
    },
  },
  {
    id: 'yellow',
    hex: '#eab308',
    label: 'Honey Yellow',
    glow: 'rgba(234,179,8,0.25)',
    tagline: 'Warm highlight — easy to spot in a bag.',
    sku: 'CLV-HNY-YEL-A1',
    nfcUid: '04:77:03:21:CE:90:11',
    highlights: [
      'High-visibility for shared studio keys',
      'Dummy promo: “Sunbeam” limited run (fiction)',
      'Pairs with brass and walnut desk setups',
    ],
    story: {
      title: 'Warmth You Can Feel',
      body:
        'Honey Yellow is generous and optimistic. It is the finish you pick when your workspace could use a little more sunshine.',
    },
  },
]

export interface RopeSettings {
  /** Screen-space anchor X as fraction of viewport width (0–1). */
  anchorX: number
  anchorY: number
  /** Extra world-space Z offset applied after screen unprojection. */
  anchorZ: number
  /** Half-distance in pixels between left/right rope anchors (two strands from top). */
  ropeTwinSpreadPx: number
  /** Strand thickness (TubeGeometry radius in world units). */
  ropeStroke: number
  ropeSpan: number
  ropeNodes: number
  windStrength: number
  windFreq: number
}

export interface ModelSettings {
  eyeletOffsetX: number
  eyeletOffsetY: number
  eyeletOffsetZ: number
  modelScale: number
  windSwayX: number
  windSwayY: number
}

interface AppStore {
  activeId: string
  color: string
  entry: ColorEntry
  setColor: (id: string) => void
  modelX: number
  setModelX: (x: number) => void
  scanTriggered: boolean
  setScanTriggered: (v: boolean) => void
  resetScan: () => void
  modelDragActive: boolean
  setModelDragActive: (v: boolean) => void
  ropeSettings: RopeSettings
  modelSettings: ModelSettings
}

export const DEFAULT_ROPE_SETTINGS: RopeSettings = {
  anchorX: 0.75,
  anchorY: 0,
  anchorZ: 0,
  ropeTwinSpreadPx: 3,
  ropeStroke: 0.011,
  ropeSpan: 1.28,
  ropeNodes: 18,
  windStrength: 0,
  windFreq: 0.3,
}

export const DEFAULT_MODEL_SETTINGS: ModelSettings = {
  eyeletOffsetX: -0.0001,
  eyeletOffsetY: 0,
  eyeletOffsetZ: 0.001,
  modelScale: 12.5,
  windSwayX: 0,
  windSwayY: 0,
}

const DEFAULT_ROPE = DEFAULT_ROPE_SETTINGS
const DEFAULT_MODEL = DEFAULT_MODEL_SETTINGS

export const useColorStore = create<AppStore>((set) => ({
  activeId: 'green',
  color: COLOR_PALETTE[0].hex,
  entry: COLOR_PALETTE[0],
  setColor: (id) => {
    const e = COLOR_PALETTE.find((c) => c.id === id) ?? COLOR_PALETTE[0]
    set({ activeId: id, color: e.hex, entry: e, scanTriggered: false })
  },
  modelX: 0,
  setModelX: (x) => set({ modelX: x }),
  scanTriggered: false,
  setScanTriggered: (v) => set({ scanTriggered: v }),
  resetScan: () => set({ scanTriggered: false }),
  modelDragActive: false,
  setModelDragActive: (v) => set({ modelDragActive: v }),
  ropeSettings: DEFAULT_ROPE,
  modelSettings: DEFAULT_MODEL,
}))

/** Static NFC readout rows (UID comes from active `entry.nfcUid` in UI). */
export const SCAN_RESULT_STATIC = [
  ['Chip', 'NXP NTAG216'],
  ['Protocol', 'ISO 14443 Type A'],
  ['User memory', '888 bytes'],
] as const
