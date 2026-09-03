import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "http", hostname: "68.178.164.48" },
      { protocol: "http", hostname: "10.10.26.159" },
      { protocol: "http", hostname: "10.10.26.173" },
      { protocol: "http", hostname: "31.97.103.122" },
      { protocol: "https", hostname: "api.thehubology.com" },
    ],
  },
  allowedDevOrigins: ["10.10.26.173", "api.thehubology.com"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async rewrites() {
    return [
      { source: "/:lang/calendar", destination: "/:lang/events" },
      { source: "/calendar", destination: "/events" },
    ];
  },
  async redirects() {
    return [
      { source: "/store", destination: "/shop", permanent: false },
      { source: "/store/:path*", destination: "/shop", permanent: false },
      { source: "/office-supplies", destination: "/shop", permanent: false },
      {
        source: "/office-supplies/:path*",
        destination: "/shop",
        permanent: false,
      },
      { source: "/ifundayiti", destination: "/", permanent: false },
      {
        source: "/donate/track",
        destination: "/track-application",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
