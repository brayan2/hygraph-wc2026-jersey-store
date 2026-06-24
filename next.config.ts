import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'media.graphassets.com' },
      { protocol: 'https', hostname: 'blogger.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: 'image.mysteryunited.shop' },
      { protocol: 'https', hostname: 'goal90.shop' },
      { protocol: 'https', hostname: 'images.puma.com' },
      { protocol: 'https', hostname: 'store.ussoccer.com' },
    ],
  },
};

export default nextConfig;
