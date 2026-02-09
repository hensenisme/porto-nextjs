/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog.hendri.tech', // Pastikan ini hostname WordPress Anda
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  reactStrictMode: true,
  sassOptions: {
    // Perbaikan: Baris yang rusak telah digabungkan dengan benar
    includePaths: [path.join(__dirname, 'css')],
  },
  // Perbaikan: Baris 'trailingSlash' dan 'devIndicators' yang salah tempat telah dihapus
  // Jika Anda membutuhkannya, letakkan di sini, di dalam objek nextConfig:
  // trailingSlash: true,
  devIndicators: {
    buildActivity: false,
  },
  async rewrites() {
    return [
      {
        source: '/wp-content/:path*',
        destination: 'https://blog.hendri.tech/wp-content/:path*',
      },
    ];
  },
};

module.exports = nextConfig;