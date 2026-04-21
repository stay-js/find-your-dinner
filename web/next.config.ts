import './src/env.js';

import { type NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    if (process.env.NODE_ENV !== 'development') return [];

    return [
      {
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
        source: '/api/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: '**',
        protocol: 'https',
      },
    ],
  },
};

export default nextConfig;
