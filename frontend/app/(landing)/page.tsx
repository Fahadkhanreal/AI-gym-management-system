import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import Benefits from "@/sections/Benefits";
import Programs from "@/sections/Programs";
import Transformations from "@/sections/Transformations";
import Facilities from "@/sections/Facilities";
import Trainers from "@/sections/Trainers";
import Pricing from "@/sections/Pricing";
import Testimonials from "@/sections/Testimonials";
import FAQ from "@/sections/FAQ";
import FinalCTA from "@/sections/FinalCTA";
import Footer from "@/sections/Footer";

export default function Home() {
  return (
    <main className="relative bg-background">
      <Navbar />
      <Hero />
      <Benefits />
      <Programs />
      <Transformations />
      <Facilities />
      <Trainers />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
