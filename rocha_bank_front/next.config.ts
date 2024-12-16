import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Caminho no Next.js
        destination: 'http://localhost:7029/api/:path*', // Caminho da API Backend
      },
    ];
  },
};

export default nextConfig;
