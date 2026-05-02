import HeroSection from "@/components/hero/Hero";
import AppSection from "@/components/home/AppSecttion/AppSection";
import ChatSection from "@/components/home/ChatInterface/ChatInterface";
import PrivacySection from "@/components/home/PrivacySection/PrivacySection";
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
      <AppSection />
      <WhereSoulsMeet />
      <ChatSection />
      <PrivacySection />
      <SectionDivider />
      <Footer />
    </>
  );
}
