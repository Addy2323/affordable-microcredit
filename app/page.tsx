import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Services } from "@/components/landing/services";
import { About } from "@/components/landing/about";
import { Team } from "@/components/landing/team";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { VideoSection } from "@/components/landing/video-section";
import { ImageGallery } from "@/components/landing/image-gallery";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <main className="min-h-screen">
      <Header isLoggedIn={isLoggedIn} />
      <Hero isLoggedIn={isLoggedIn} />
      <Services />
      <ImageGallery />
      <About />
      <Team />
      <CTA isLoggedIn={isLoggedIn} />
      <VideoSection />
      <Footer />
    </main>
  );
}
