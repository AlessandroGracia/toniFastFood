/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: [
    "@tonios/api-sdk",
    "@tonios/contracts",
    "@tonios/realtime-client",
    "@tonios/sync-client",
    "@tonios/ui"
  ]
};

export default nextConfig;
