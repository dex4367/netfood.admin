/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
      "chamaobobs.com.br",
      "storage.shopfood.io",
      "static.ifood-static.com.br",
      "www.bobsbrasil.com.br"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'chamaobobs.com.br',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.shopfood.io',
        pathname: '/public/**',
      },
      {
        protocol: 'https',
        hostname: 'www.bobsbrasil.com.br',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
