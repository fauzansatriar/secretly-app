/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ini perintah mutlak supaya build tetep jalan walau TypeScript error
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ini biar ESLint gak ikut-ikutan ngetes kode pas build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;