const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  // Disable static optimization for dynamic routes
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;

