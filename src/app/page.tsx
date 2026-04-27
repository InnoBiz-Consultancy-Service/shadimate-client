import HeroSection from "@/components/hero/Hero";
import AppSection from "@/components/home/AppSecttion/AppSection";
import WhereSoulsMeet from "@/components/home/SoulmateSection/SoulmateSection";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import SectionDivider from "@/components/shared/SectionDivider";

export default function Home() {
  return (
    <>
      {/* <FloatingHearts /> */}
      <Navbar />
      <HeroSection />
      <SectionDivider />
      <AppSection />
      <WhereSoulsMeet />
      <Footer />
    </>
  );
}
