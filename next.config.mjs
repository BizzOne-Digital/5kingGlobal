/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Media uploaded through the admin (images, graphics, directly-uploaded
    // video posters) is served from this app's own /api/media/file/[id]
    // route — same-origin, so it needs no entry here. These remaining
    // patterns cover placeholder stock photography and YouTube thumbnails.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
