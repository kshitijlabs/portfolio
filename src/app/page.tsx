import { Hero } from "@/components/sections/Hero";
import { About, Contact, Experience, Stack, Work } from "@/components/sections/HomeSections";

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <About />
      <Stack />
      <Experience />
      <Contact />
    </>
  );
}
