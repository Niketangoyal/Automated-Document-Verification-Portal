import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // Increase the limit (set as per requirement)
    },
  },
};

export default nextConfig;
