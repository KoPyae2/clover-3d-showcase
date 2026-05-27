# Graph Report - clover  (2026-05-27)

## Corpus Check
- 28 files · ~14,978 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 61 nodes · 35 edges · 1 communities detected
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]

## God Nodes (most connected - your core abstractions)
1. `updateRect()` - 2 edges
2. `setTapTargetRect()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `updateRect()` --calls--> `setTapTargetRect()`  [INFERRED]
  src\components\PhoneMockup.tsx → src\lib\tapTargetRect.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.25
Nodes (2): updateRect(), setTapTargetRect()

## Knowledge Gaps
- **Thin community `Community 0`** (8 nodes): `hexToRgba()`, `tick()`, `updateRect()`, `getTapTargetRect()`, `pointInTapTarget()`, `setTapTargetRect()`, `PhoneMockup.tsx`, `tapTargetRect.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._