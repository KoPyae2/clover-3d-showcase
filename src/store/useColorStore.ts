import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "../i18n";

export interface ColorEntry {
  id: string;
  hex: string;
  label: string;
  glow: string;
  /** Short line under the hero title */
  tagline: string;
  highlights: readonly [string, string, string];
  story: { title: string; body: string };
}

export const COLOR_PALETTE: ColorEntry[] = [
  {
    id: "green",
    hex: "#2E6F40",
    label: "Signature Green",
    glow: "rgba(46,111,64,0.25)",
    tagline: "The original Clover tone — balanced for everyday carry.",
    highlights: [
      "Premium matte finish with a vapor-honed rim",
      "Seamlessly complements earth tones and dark hardware",
      "Our most requested finish for everyday carry",
    ],
    story: {
      title: "Timeless & Natural",
      body: "Our signature Clover Green embodies growth and calm confidence. Crafted to blend with natural materials while staying distinct on desks and in pockets—a quiet nod to luck without shouting for attention.",
    },
  },
  {
    id: "blue",
    hex: "#60a5fa",
    label: "Arctic Blue",
    glow: "rgba(96,165,250,0.25)",
    tagline: "A crisp, cool accent for minimalist workspaces.",
    highlights: [
      "Striking high-contrast silver rim pairing",
      "Vibrant clarity under both natural and studio lighting",
      "Perfect for triggering focus modes and productivity shortcuts",
    ],
    story: {
      title: "Clarity in Every Touch",
      body: "Arctic Blue is for those who prefer their tools precise and legible. Every NFC tap feels intentional, smoothly bridging the gap between physical touch and digital action.",
    },
  },
  {
    id: "red",
    hex: "#ef4444",
    label: "Crimson Red",
    glow: "rgba(239,68,68,0.25)",
    tagline: "A bold, high-visibility statement piece.",
    highlights: [
      "Vibrant accent color for dynamic creative studios",
      "Ideal for triggering 'Do Not Disturb' or deep work states",
      "Finished with a subtle, premium pearlescent topcoat",
    ],
    story: {
      title: "Bold by Design",
      body: "Crimson Red refuses to be background furniture. It is the color you choose when you want your tech to make a statement, combining striking aesthetics with effortless smart-device interaction.",
    },
  },
  {
    id: "purple",
    hex: "#a855f7",
    label: "Lavender",
    glow: "rgba(168,85,247,0.25)",
    tagline: "A subtle, tech-forward hue with creative energy.",
    highlights: [
      "Rich saturation that pops against dark accessories",
      "Popular for mapping to creative apps and music playlists",
      "Pairs elegantly with silver or graphite aesthetics",
    ],
    story: {
      title: "Quiet Power",
      body: "Lavender carries creative energy without theatrics. It is a sophisticated, modern shade designed for digital artists and creators who want their physical tools to reflect their imagination.",
    },
  },
  {
    id: "black",
    hex: "#1e293b",
    label: "Obsidian Black",
    glow: "rgba(30,41,59,0.25)",
    tagline: "Sleek, stealthy, and sophisticated.",
    highlights: [
      "Deep matte slate paired with a sharp white rim",
      "Ultra-low reflectance for a true stealth profile",
      "The ultimate addition to any monochrome EDC setup",
    ],
    story: {
      title: "Invisible Intelligence",
      body: "Obsidian Black disappears into your everyday carry until the rim catches the light. No visual noise—just pure function and minimalist form operating in perfect balance.",
    },
  },
  {
    id: "yellow",
    hex: "#eab308",
    label: "Honey Yellow",
    glow: "rgba(234,179,8,0.25)",
    tagline: "Warm, optimistic, and instantly recognizable.",
    highlights: [
      "High-visibility design, perfect for dark bags or deep pockets",
      "An energetic pop of color for modern workspaces",
      "Complements warm lighting, brass, and walnut textures",
    ],
    story: {
      title: "Warmth You Can Feel",
      body: "Honey Yellow is generous and optimistic. It is the finish you pick when your setup could use a little more energy, making every digital interaction feel vibrant and alive.",
    },
  },
];

const getSavedState = () => {
  try {
    const saved = localStorage.getItem("clover-app-store");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.state) {
        return {
          activeId: parsed.state.activeId ?? "green",
          language: parsed.state.language ?? "en",
        };
      }
    }
  } catch (e) {
    console.error(e);
  }
  return { activeId: "green", language: "en" };
};

const { activeId: initialActiveId, language: initialLanguage } = getSavedState();
const initialEntry = COLOR_PALETTE.find((c) => c.id === initialActiveId) ?? COLOR_PALETTE[0];

interface AppStore {
  activeId: string;
  color: string;
  entry: ColorEntry;
  setColor: (id: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  scanTriggered: boolean;
  setScanTriggered: (v: boolean) => void;
  resetScan: () => void;
  isAutoScanning: boolean;
  setIsAutoScanning: (v: boolean) => void;
  modelDragActive: boolean;
  setModelDragActive: (v: boolean) => void;
}

export const useColorStore = create<AppStore>()(
  persist(
    (set) => ({
      activeId: initialActiveId,
      color: initialEntry.hex,
      entry: initialEntry,
      setColor: (id) => {
        const e = COLOR_PALETTE.find((c) => c.id === id) ?? COLOR_PALETTE[0];
        set({ activeId: id, color: e.hex, entry: e, scanTriggered: false, isAutoScanning: false });
      },
      language: initialLanguage,
      setLanguage: (lang) => {
        set({ language: lang });
        i18n.changeLanguage(lang);
      },
      scanTriggered: false,
      setScanTriggered: (v) => set({ scanTriggered: v }),
      resetScan: () => set({ scanTriggered: false, isAutoScanning: false }),
      isAutoScanning: false,
      setIsAutoScanning: (v) => set({ isAutoScanning: v }),
      modelDragActive: false,
      setModelDragActive: (v) => set({ modelDragActive: v }),
    }),
    {
      name: "clover-app-store",
      partialize: (state) => ({
        activeId: state.activeId,
        language: state.language,
      }),
    }
  )
);

/** Static NFC readout rows */
export const SCAN_RESULT_STATIC = [
  ["Chip", "NXP NTAG216"],
  ["Protocol", "ISO 14443 Type A"],
  ["User memory", "888 bytes"],
] as const;
