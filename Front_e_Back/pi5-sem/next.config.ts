import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/geocode_cep',
        destination: 'http://localhost:8000/geocode_cep',
      },
      {
        source: '/postos_proximos',
        destination: 'http://localhost:8000/postos_proximos',
      },
    ]
  },
};


export default nextConfig;
