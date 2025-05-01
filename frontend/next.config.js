/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This allows us to access env variables on the client side
  // when they are prefixed with NEXT_PUBLIC_
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APTOS_NETWORK: process.env.NEXT_PUBLIC_APTOS_NETWORK,
    NEXT_PUBLIC_APTOS_NODE_URL: process.env.NEXT_PUBLIC_APTOS_NODE_URL,
    NEXT_PUBLIC_MODULE_ADDRESS: process.env.NEXT_PUBLIC_MODULE_ADDRESS
  },
  // Add proper CORS setup if needed
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
  // Configure images
  images: {
    domains: ['aptos-coffee-shop-api.onrender.com'],
  },
};

module.exports = nextConfig;