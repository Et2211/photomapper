/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["exifr"],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
};

module.exports = nextConfig;
