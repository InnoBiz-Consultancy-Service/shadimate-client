import HeroSection from "@/components/hero/Hero";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import React from "react";

const page = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "radial-gradient(ellipse at 25% 40%, #1e0a42 0%, #0F172A 50%, #06101e 100%)",
      }}
    >
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default page;
