import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";
import { SmoothScroll } from "@/components/landing/smooth-scroll";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <SmoothScroll>
      <div className="flex flex-col min-h-screen bg-[#000000] text-white selection:bg-[#FF5A00] selection:text-black">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Features />
          <Pricing />
          <FAQ />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
