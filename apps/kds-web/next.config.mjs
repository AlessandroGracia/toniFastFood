/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@tonios/contracts", "@tonios/realtime-client", "@tonios/ui"]
};

export default nextConfig;
