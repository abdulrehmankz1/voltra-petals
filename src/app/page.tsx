import { Sprite } from "@/components/petals/brand/sprite";
import { Grain, SkipLink } from "@/components/petals/layout/chrome";
import { Footer } from "@/components/petals/layout/footer";
import { Menu } from "@/components/petals/layout/menu";
import { Nav } from "@/components/petals/layout/nav";
import { PetalsMotion } from "@/components/petals/motion/petals-motion";
import { App } from "@/components/petals/sections/app";
import { Close } from "@/components/petals/sections/close";
import { Dawn } from "@/components/petals/sections/dawn";
import { Faq } from "@/components/petals/sections/faq";
import { Features } from "@/components/petals/sections/features";
import { Hero } from "@/components/petals/sections/hero";
import { Plans } from "@/components/petals/sections/plans";
import { Proof } from "@/components/petals/sections/proof";
import { Security } from "@/components/petals/sections/security";
import { Steps } from "@/components/petals/sections/steps";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
      <Sprite />
      <SkipLink />
      <Grain />
      <Nav />
      <Menu />
      <main id="main" lang={site.lang}>
        <Dawn>
          <Hero /> <Proof />
        </Dawn>
        <Features />
        <App />
        <Security />
        <Steps />
        <Plans />
        <Faq />
        <Close />
      </main>
      <Footer />
      <PetalsMotion />
    </>
  );
}
