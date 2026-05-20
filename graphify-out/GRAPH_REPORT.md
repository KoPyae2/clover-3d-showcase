# Graph Report - clover  (2026-05-07)

## Corpus Check
- 28 files · ~10,579 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 103 nodes · 81 edges · 8 communities detected
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 23|Community 23]]

## God Nodes (most connected - your core abstractions)
1. `SVG sprite sheet root` - 6 edges
2. `Favicon SVG asset (48×46 viewport)` - 5 edges
3. `Interior blurred ellipse streaks (feGaussianBlur)` - 5 edges
4. `React + TypeScript + Vite template` - 4 edges
5. `Isometric stacked rounded-square layers` - 4 edges
6. `Upper wireframe rounded-square layer` - 4 edges
7. `Lower layer with purple neon extrusion` - 4 edges
8. `@vitejs/plugin-react` - 3 edges
9. `@vitejs/plugin-react-swc` - 3 edges
10. `Type-aware ESLint lint rules` - 3 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useScrollReveal()`  [INFERRED]
  src\App.tsx → src\hooks\useScrollReveal.ts

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

### Community 0 - "Community 0"
Cohesion: 0.2
Nodes (11): Alpha mask clipping interior artwork, Interior blurred ellipse streaks (feGaussianBlur), Brand purple fill (#863bff), Browser tab / bookmark brand touchpoint, Display-P3 color function hints in inline styles, Favicon SVG asset (48×46 viewport), Glossy depth design (masked glow + multi-tone purple/cyan), Deep violet streaks (#7e14ff) (+3 more)

### Community 1 - "Community 1"
Cohesion: 0.24
Nodes (10): Hot Module Replacement (HMR), eslint-plugin-react-dom, eslint-plugin-react-x, @vitejs/plugin-react, @vitejs/plugin-react-swc, Type-aware ESLint lint rules, React + TypeScript + Vite template, ESLint (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.39
Nodes (8): clipPath bluesky-clip masking Bluesky paths, SVG sprite sheet root, Bluesky butterfly mark (symbol bluesky-icon), Discord logo (symbol discord-icon), Documentation / open-book outline (symbol documentation-icon), GitHub Octocat mark (symbol github-icon), User + badge social outline (symbol social-icon), X (Twitter) logo (symbol x-icon)

### Community 4 - "Community 4"
Cohesion: 0.6
Nodes (6): Solid black negative space background, Dashed vertical corner alignment guides, Isometric stacked rounded-square layers, Platform / modularity / stack marketing metaphor, Lower layer with purple neon extrusion, Upper wireframe rounded-square layer

### Community 6 - "Community 6"
Cohesion: 0.4
Nodes (2): useScrollReveal(), App()

### Community 11 - "Community 11"
Cohesion: 0.67
Nodes (3): React atom logo mark (orbits + nucleus), react.svg (React logo brand asset), React brand cyan (#00D8FF)

### Community 12 - "Community 12"
Cohesion: 0.67
Nodes (3): Vite, Vite lightning bolt (purple path), Vite logo SVG asset

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (2): React Compiler installation documentation (react.dev), React Compiler

## Knowledge Gaps
- **16 isolated node(s):** `Hot Module Replacement (HMR)`, `Oxc`, `SWC`, `React Compiler`, `React Compiler installation documentation (react.dev)` (+11 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 6`** (5 nodes): `useScrollReveal()`, `App()`, `App.tsx`, `useScrollReveal.ts`, `main.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (2 nodes): `React Compiler installation documentation (react.dev)`, `React Compiler`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 2 inferred relationships involving `Favicon SVG asset (48×46 viewport)` (e.g. with `Browser tab / bookmark brand touchpoint` and `Glossy depth design (masked glow + multi-tone purple/cyan)`) actually correct?**
  _`Favicon SVG asset (48×46 viewport)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Hot Module Replacement (HMR)`, `Oxc`, `SWC` to the rest of the system?**
  _16 weakly-connected nodes found - possible documentation gaps or missing edges._