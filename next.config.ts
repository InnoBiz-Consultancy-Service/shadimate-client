import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "res.cloudinary.com",
      //   pathname: "/**",
      // },

      {
        protocol: "https",
        hostname: "**", // Allows all domains
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/features",
        destination: "/feed",
        permanent: false,
      },
      {
        source: "/match",
        destination: "/feed",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
