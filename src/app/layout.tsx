import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import FloatingHearts from "@/components/shared/FloatingHearts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shadimate",
  description: "ShadiMate – Find your soul's connection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#120810]`}
      >
        <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_25%_40%,#2a0a1a_0%,#180a14_50%,#120810_100%)] overflow-x-hidden">
          <FloatingHearts />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
