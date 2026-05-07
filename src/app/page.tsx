import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarqueeBar from "@/components/MarqueeBar";
import About from "@/components/About";
import Work from "@/components/Work";
import Projects from "@/components/Projects";
import Marketing from "@/components/Marketing";
import Stats from "@/components/Stats";
import Artwork from "@/components/Artwork";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <MarqueeBar />
      <About />
      <Work />
      <Projects />
      <Marketing />
      <Stats />
      <Artwork />
      <Footer />
    </>
  );
}
