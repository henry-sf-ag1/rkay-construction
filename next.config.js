/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Unoptimized: images served directly from source URL.
    // Avoids domain whitelisting requirements and works with GitHub raw URLs.
    // Upload-time compression (sharp) handles file sizes instead.
    unoptimized: true,
  },
};

module.exports = nextConfig;
