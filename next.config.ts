import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["tesseract.js", "tesseract.js-core"],
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // Increase the limit (set as per requirement)
    },
  },
  outputFileTracingIncludes: {
    "/*": ["./node_modules/tesseract.js/**/*", "./node_modules/tesseract.js-core/**/*"],
    "/api/**/*": ["./node_modules/tesseract.js/**/*", "./node_modules/tesseract.js-core/**/*"]
  }
};

export default nextConfig;
