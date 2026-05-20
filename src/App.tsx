import { AccentVars } from "./components/AccentVars";
import { ScrollProgress } from "./components/ScrollProgress";
import { SiteHeader } from "./components/SiteHeader";
import { CloverOverlayScene } from "./components/three/CloverOverlayScene";
import { FaqSection } from "./components/sections/FaqSection";
import { HeroSection } from "./components/sections/HeroSection";
import { SiteFooter } from "./components/SiteFooter";
import { SpecsSection } from "./components/sections/SpecsSection";
import { StorySection } from "./components/sections/StorySection";
import { TapMockupSection } from "./components/sections/TapMockupSection";
import { LoadingScreen } from "./components/LoadingScreen";

export default function App() {
  return (
    <>
      <LoadingScreen />
      <AccentVars />
      <main className="scroll-rail">
        <HeroSection />
        <StorySection />
        <SpecsSection />
        <TapMockupSection />
        <FaqSection />
        <SiteFooter />
      </main>
      <CloverOverlayScene />
      <SiteHeader />
      <ScrollProgress />
    </>
  );
}
