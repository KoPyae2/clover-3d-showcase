# Graph Report - c:\Users\mumu\OneDrive\Desktop\aicoder\clover  (2026-05-04)

## Corpus Check
- Corpus is ~6,586 words - fits in a single context window. You may not need a graph.

## Summary
- 103 nodes · 95 edges · 12 communities detected
- Extraction: 72% EXTRACTED · 27% INFERRED · 1% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Rope sim and product UI|Rope sim and product UI]]
- [[_COMMUNITY_HTML shell and README|HTML shell and README]]
- [[_COMMUNITY_Favicon SVG design|Favicon SVG design]]
- [[_COMMUNITY_Social icon sprite|Social icon sprite]]
- [[_COMMUNITY_Marketing hero image|Marketing hero image]]
- [[_COMMUNITY_App shell and scenes|App shell and scenes]]
- [[_COMMUNITY_React logo asset|React logo asset]]
- [[_COMMUNITY_Vite logo asset|Vite logo asset]]
- [[_COMMUNITY_React Compiler docs|React Compiler docs]]
- [[_COMMUNITY_ESLint flat config|ESLint flat config]]
- [[_COMMUNITY_Vite Tailwind plugin|Vite Tailwind plugin]]
- [[_COMMUNITY_Navbar chrome|Navbar chrome]]

## God Nodes (most connected - your core abstractions)
1. `HeroScene inner Scene (rope sim, drag, scan zone, lights)` - 10 edges
2. `Zustand app store (color, modelX, scanTriggered)` - 8 edges
3. `React + TypeScript + Vite template` - 6 edges
4. `SVG sprite sheet root` - 6 edges
5. `index.html Vite HTML shell` - 5 edges
6. `Favicon SVG asset (48×46 viewport)` - 5 edges
7. `Interior blurred ellipse streaks (feGaussianBlur)` - 5 edges
8. `CloverModel (forwardRef GLTF, leaf color, swing lerp)` - 5 edges
9. `Isometric stacked rounded-square layers` - 4 edges
10. `Upper wireframe rounded-square layer` - 4 edges

## Surprising Connections (you probably didn't know these)
- `index.html Vite HTML shell` --semantically_similar_to--> `React + TypeScript + Vite template`  [AMBIGUOUS] [semantically similar]
  index.html → README.md
- `gltfjsx-generated Model (Curve005 meshes)` --semantically_similar_to--> `CloverModel (forwardRef GLTF, leaf color, swing lerp)`  [INFERRED] [semantically similar]
  Clover.tsx → src/components/three/CloverModel.tsx
- `React + TypeScript + Vite template` --conceptually_related_to--> `/src/main.tsx module entry`  [INFERRED]
  README.md → index.html
- `TestScene OrbitControls dev harness` --semantically_similar_to--> `HeroScene Canvas wrapper`  [INFERRED] [semantically similar]
  src/components/three/TestScene.tsx → src/components/three/HeroScene.tsx
- `HeroScene inner Scene (rope sim, drag, scan zone, lights)` --conceptually_related_to--> `PhoneMockup NFC pulse (SCAN_ZONE doc)`  [INFERRED]
  src/components/three/HeroScene.tsx → src/components/ui/PhoneMockup.tsx

## Hyperedges (group relationships)
- **All reusable symbol definitions in one sprite file** — icons_symbol_bluesky, icons_symbol_discord, icons_symbol_documentation, icons_symbol_github, icons_symbol_social, icons_symbol_x [EXTRACTED 1.00]
- **Brand marks using solid fill #08060d** — icons_symbol_bluesky, icons_symbol_discord, icons_symbol_github, icons_symbol_x [INFERRED 0.78]
- **Outlined UI icons sharing purple stroke styling** — icons_svg_sprite_root, icons_symbol_documentation, icons_symbol_social [INFERRED 0.71]
- **Two-layer isometric stack with corner guides** — hero_wireframe_top_plate, hero_purple_glow_base, hero_dashed_corner_connectors [EXTRACTED 1.00]
- **Purple neon glow on black minimalist shell** — hero_purple_glow_base, hero_black_background, hero_isometric_layer_stack [INFERRED 0.78]
- **Wireframe blueprint layer above powered solid base** — hero_wireframe_top_plate, hero_purple_glow_base, hero_platform_stack_metaphor [INFERRED 0.66]
- **Verlet rope + drag tail + tubes + Clover transform** — heroscene_scene_inner, hook_useverletrope, hook_usedrag, ropemesh_component, clovermodel_component [EXTRACTED 0.95]
- **Palette store fans out to 3D and marketing UI** — store_usecolorstore, heroscene_scene_inner, clovermodel_component, ui_hero_text, ui_color_switcher, ui_story_panel, ui_phone_mockup, ui_scan_modal [INFERRED 0.87]
- **Bottom-center scan zone ties canvas detection to phone affordance + modal** — heroscene_scene_inner, ui_phone_mockup, ui_scan_modal, store_usecolorstore [INFERRED 0.86]

## Communities

### Community 0 - "Rope sim and product UI"
Cohesion: 0.15
Nodes (18): gltfjsx-generated Model (Curve005 meshes), CloverModel (forwardRef GLTF, leaf color, swing lerp), s2w screen anchor to world ray, w2screen world to screen fractions, HeroScene inner Scene (rope sim, drag, scan zone, lights), useDrag pointer plane projection + release velocity, useDrag screenToWorld (z plane), useVerletRope Verlet integrator + constraints (+10 more)

### Community 1 - "HTML shell and README"
Cohesion: 0.17
Nodes (15): favicon.svg, #root DOM mount element, /src/main.tsx module entry, index.html Vite HTML shell, Page title: clover, Hot Module Replacement (HMR), eslint-plugin-react-dom, eslint-plugin-react-x (+7 more)

### Community 2 - "Favicon SVG design"
Cohesion: 0.2
Nodes (11): Alpha mask clipping interior artwork, Interior blurred ellipse streaks (feGaussianBlur), Brand purple fill (#863bff), Browser tab / bookmark brand touchpoint, Display-P3 color function hints in inline styles, Favicon SVG asset (48×46 viewport), Glossy depth design (masked glow + multi-tone purple/cyan), Deep violet streaks (#7e14ff) (+3 more)

### Community 3 - "Social icon sprite"
Cohesion: 0.39
Nodes (8): clipPath bluesky-clip masking Bluesky paths, SVG sprite sheet root, Bluesky butterfly mark (symbol bluesky-icon), Discord logo (symbol discord-icon), Documentation / open-book outline (symbol documentation-icon), GitHub Octocat mark (symbol github-icon), User + badge social outline (symbol social-icon), X (Twitter) logo (symbol x-icon)

### Community 4 - "Marketing hero image"
Cohesion: 0.6
Nodes (6): Solid black negative space background, Dashed vertical corner alignment guides, Isometric stacked rounded-square layers, Platform / modularity / stack marketing metaphor, Lower layer with purple neon extrusion, Upper wireframe rounded-square layer

### Community 5 - "App shell and scenes"
Cohesion: 0.4
Nodes (5): App shell (fixed HeroScene + scroll sections), HeroScene Canvas wrapper, React root mount (StrictMode + App), TestScene OrbitControls dev harness, TestScene Suspense loading cube

### Community 9 - "React logo asset"
Cohesion: 0.67
Nodes (3): React atom logo mark (orbits + nucleus), react.svg (React logo brand asset), React brand cyan (#00D8FF)

### Community 10 - "Vite logo asset"
Cohesion: 0.67
Nodes (3): Vite, Vite lightning bolt (purple path), Vite logo SVG asset

### Community 15 - "React Compiler docs"
Cohesion: 1.0
Nodes (2): React Compiler installation documentation (react.dev), React Compiler

### Community 26 - "ESLint flat config"
Cohesion: 1.0
Nodes (1): ESLint flat config (TS + React hooks + refresh)

### Community 27 - "Vite Tailwind plugin"
Cohesion: 1.0
Nodes (1): Vite build config (React + Tailwind v4 plugin)

### Community 28 - "Navbar chrome"
Cohesion: 1.0
Nodes (1): Navbar fixed chrome

## Ambiguous Edges - Review These
- `index.html Vite HTML shell` → `React + TypeScript + Vite template`  [AMBIGUOUS]
  index.html · relation: semantically_similar_to

## Knowledge Gaps
- **30 isolated node(s):** `Page title: clover`, `favicon.svg`, `Hot Module Replacement (HMR)`, `Oxc`, `SWC` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `React Compiler docs`** (2 nodes): `React Compiler installation documentation (react.dev)`, `React Compiler`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ESLint flat config`** (1 nodes): `ESLint flat config (TS + React hooks + refresh)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Tailwind plugin`** (1 nodes): `Vite build config (React + Tailwind v4 plugin)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Navbar chrome`** (1 nodes): `Navbar fixed chrome`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `index.html Vite HTML shell` and `React + TypeScript + Vite template`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `HeroScene inner Scene (rope sim, drag, scan zone, lights)` connect `Rope sim and product UI` to `App shell and scenes`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `HeroScene inner Scene (rope sim, drag, scan zone, lights)` (e.g. with `Zustand app store (color, modelX, scanTriggered)` and `PhoneMockup NFC pulse (SCAN_ZONE doc)`) actually correct?**
  _`HeroScene inner Scene (rope sim, drag, scan zone, lights)` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Zustand app store (color, modelX, scanTriggered)` (e.g. with `HeroScene inner Scene (rope sim, drag, scan zone, lights)` and `CloverModel (forwardRef GLTF, leaf color, swing lerp)`) actually correct?**
  _`Zustand app store (color, modelX, scanTriggered)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `index.html Vite HTML shell` (e.g. with `Page title: clover` and `#root DOM mount element`) actually correct?**
  _`index.html Vite HTML shell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Page title: clover`, `favicon.svg`, `Hot Module Replacement (HMR)` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._