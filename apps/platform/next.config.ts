import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@ai-game-hub/game-sdk"],
};

export default nextConfig;
