import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/postos_proximos',
        destination: 'http://localhost:8000/postos_proximos', // Porta correta do FastAPI!
      },
    ];
  },
};


export default nextConfig;
