/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Agar aap backend API CORS, images ya rewrites setup karna chaho toh add karo:
  /* async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Backend API
      },
    ];
  }, */
};

module.exports = nextConfig;