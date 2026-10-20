import { PetalsMotion } from "@/components/petals/motion/petals-motion";
import { App } from "@/components/petals/raw/app";
import { Close } from "@/components/petals/raw/close";
import { Dawn } from "@/components/petals/raw/dawn";
import { Faq } from "@/components/petals/raw/faq";
import { Features } from "@/components/petals/raw/features";
import { Footer } from "@/components/petals/raw/footer";
import { Grain } from "@/components/petals/raw/grain";
import { Hero } from "@/components/petals/raw/hero";
import { Menu } from "@/components/petals/raw/menu";
import { Nav } from "@/components/petals/raw/nav";
import { Plans } from "@/components/petals/raw/plans";
import { Proof } from "@/components/petals/raw/proof";
import { Security } from "@/components/petals/raw/security";
import { SkipLink } from "@/components/petals/raw/skip-link";
import { Sprite } from "@/components/petals/raw/sprite";
import { Steps } from "@/components/petals/raw/steps";

export default function Home() {
  return (
    <>
      <Sprite />
      <SkipLink />
      <Grain />
      <Nav />
      <Menu />
      <main id="main" lang="en-GB">
        <Dawn>
          <Hero />
          {" "}
          <Proof />
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
