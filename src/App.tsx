import { AccentVars } from './components/AccentVars'
import { ScrollProgress } from './components/ScrollProgress'
import { SiteHeader } from './components/SiteHeader'
import { CloverOverlayScene } from './components/three/CloverOverlayScene'
import { FaqSection } from './components/sections/FaqSection'
import { FinaleSection } from './components/sections/FinaleSection'
import { HeroSection } from './components/sections/HeroSection'
import { SiteFooter } from './components/sections/SiteFooter'
import { SpecsSection } from './components/sections/SpecsSection'
import { StorySection } from './components/sections/StorySection'
import { TapMockupSection } from './components/sections/TapMockupSection'
import { useScrollReveal } from './hooks/useScrollReveal'
import { useRef } from 'react'

export default function App() {
  const mainRef = useRef<HTMLDivElement>(null)
  useScrollReveal(mainRef)

  return (
    <>
      <AccentVars />
      <main className="scroll-rail" ref={mainRef}>
        <HeroSection />
        <StorySection />
        <SpecsSection />
        <TapMockupSection />
        <FaqSection />
        <FinaleSection />
        <SiteFooter />
      </main>
      <CloverOverlayScene />
      <SiteHeader />
      <ScrollProgress />
    </>
  )
}
