import FloatingHearts from "@/components/shared/FloatingHearts";
import HeroSection from "@/components/hero/Hero";
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
      <Footer />
    </>
  );
}
