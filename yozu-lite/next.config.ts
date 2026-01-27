import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: [
    "@yozu/shared",
    "class-validator",
    "class-transformer",
    "@nestjs/mapped-types",
  ],
};

export default nextConfig;
