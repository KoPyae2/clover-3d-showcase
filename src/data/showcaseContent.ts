/** Static copy + dummy catalogue data for the interactive showcase (not real commerce). */

export const PRODUCT = {
  name: 'Clover NFC Keychain',
  edition: 'Series A — 3D printed',
  msrp: '$34.00',
  msrpNote: 'Demo pricing · not a live checkout',
  inStock: 'Ships in 2–4 business days (dummy)',
  rating: '4.9',
  reviewCount: '128',
  badge: 'NFC Forum Type 2 · NTAG216',
} as const

export const GLOBAL_SPECS: { label: string; value: string }[] = [
  { label: 'Manufacturing', value: 'FDM / PLA+ body, vapor-smoothed rim' },
  { label: 'NFC IC', value: 'NXP NTAG216 (user memory 888 B)' },
  { label: 'Wireless', value: 'ISO/IEC 14443 Type A, 13.56 MHz' },
  { label: 'Read range', value: 'Typ. 2–4 cm on phones (lab dummy)' },
  { label: 'Dimensions', value: '42 × 38 × 4.2 mm (±0.2 mm)' },
  { label: 'Cord', value: 'Braided polyester, 12 cm hang (dummy)' },
  { label: 'Weight', value: '8.4 g assembled' },
  { label: 'Ingress', value: 'Not IP rated — avoid soaking' },
  { label: 'Warranty', value: '12 mo. limited (fictional)' },
  { label: 'Certifications', value: 'CE / RoHS (placeholder text)' },
]

export const TRUST_POINTS = [
  'Designed in Portland, OR (fictional)',
  'Carbon-neutral shipping badge (dummy)',
  '1% for greenery pledge (sample copy)',
] as const

export const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'Do I need an app?',
    a: 'No. Clover uses the same NFC stack your phone already has for contactless tags. This site is a visual demo — behaviour on real hardware may vary.',
  },
  {
    q: 'What can I write to the tag?',
    a: 'Anything NTAG216 supports: URLs, Wi‑Fi handshakes, vCard snippets, or automation triggers. Memory and rewrite cycles are dummy values on this page.',
  },
  {
    q: 'Is the 3D preview the real product?',
    a: 'The WebGL model is a stylised representation. Actual PLA colour and surface finish can differ slightly batch to batch.',
  },
  {
    q: 'Will it work through a phone case?',
    a: 'Thin cases usually work; thick metal wallets or MagSafe stacks can reduce range. Numbers here are illustrative only.',
  },
]

export const FOOTER_LINKS: { label: string; href: string }[] = [
  { label: 'Privacy (dummy)', href: '#' },
  { label: 'Terms (dummy)', href: '#' },
  { label: 'Support', href: '#section-faq' },
]

export interface HeroStat {
  k: string
  v: string
  sub: string
  icon: 'bolt' | 'palette' | 'signal'
}

export const HERO_STATS: HeroStat[] = [
  { k: 'Tap latency', v: '< 120 ms (lab)', sub: 'Snappy, reliable wake — under 120 ms.', icon: 'bolt' },
  { k: 'Finishes', v: '6 curated colours', sub: 'Pick your vibe — six stunning options.', icon: 'palette' },
  { k: 'Battery', v: 'None — passive NFC', sub: 'No charging. Ever. Always ready.', icon: 'signal' },
]
