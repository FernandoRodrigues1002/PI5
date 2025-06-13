import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/geocode_cep',
        destination: 'https://api-localizar.onrender.com/geocode_cep',
      },
      {
        source: '/postos_proximos',
        destination: 'https://api-localizar.onrender.com/postos_proximos',
      }
    ]
  },
};

export default nextConfig;