import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { Outfit, Syne, Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Primary display/heading font — elegant serif for matrimony
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Body font — clean, highly readable
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

// Kept for backward compatibility with font-outfit className usages
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "primehalf – Find Your Soul's Connection",
    template: "%s | primehalf",
  },
  description:
    "primehalf uses behavioral psychology and AI to match you with your true 99.9% connection.",
  openGraph: {
    title: "primehalf – Find Your Soul's Connection",
    description:
      "Traditional matching is dead. We use behavioral psychology to find your 99.9% true connection.",
    type: "website",
    siteName: "primehalf",
  },
  twitter: {
    card: "summary_large_image",
    title: "primehalf – Find Your Soul's Connection",
    description:
      "Traditional matching is dead. We use behavioral psychology to find your 99.9% true connection.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${lato.variable} ${geistMono.variable} ${outfit.variable} ${syne.variable} antialiased`}
      >
        <div className="relative min-h-screen overflow-x-hidden">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-200 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-brand focus:text-on-brand"
          >
            Skip to content
          </a>
          <main id="main-content" className="relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
