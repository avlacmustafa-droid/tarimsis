import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@tarimsis/shared", "@tarimsis/supabase"],
};

export default nextConfig;
