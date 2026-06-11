import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Projektordner als Root festlegen (es liegt noch eine package-lock.json im Home-Verzeichnis).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
