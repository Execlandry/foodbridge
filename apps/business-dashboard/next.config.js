/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["gogole.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "foodbridge-storage.s3.amazonaws.com",
        pathname: "/**", // Matches all paths under the domain
      },
    ],
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
};

module.exports = nextConfig;
