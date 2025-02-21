import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output:'export',
  images: {
    unoptimized:true,
    domains: ['lh3.googleusercontent.com'], // Add allowed domains here
  },
};

export default nextConfig;
