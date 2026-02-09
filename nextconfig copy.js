/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  output: 'export',

  // SOLUSI: Tambahkan bagian ini untuk menonaktifkan optimasi gambar server-side.
  // Ini akan membuat komponen <Image> kompatibel dengan 'output: export'.
  images: {
    unoptimized: true,
  },

  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'css')],
  },
  trailingSlash: true,
  devIndicators: {
    buildActivity: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
