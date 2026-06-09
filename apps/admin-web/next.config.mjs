/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@tonios/api-sdk", "@tonios/contracts", "@tonios/ui"]
};

export default nextConfig;
