/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

const noStoreHeaders = [
  { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
  { key: "Pragma", value: "no-cache" },
  { key: "Expires", value: "0" },
];

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    if (isDev) {
      return [
        {
          source: "/:path*",
          headers: noStoreHeaders,
        },
      ];
    }

    return [
      {
        source: "/",
        headers: noStoreHeaders,
      },
      {
        source: "/lp/:path*",
        headers: noStoreHeaders,
      },
      {
        source: "/api/content/:path*",
        headers: noStoreHeaders,
      },
      {
        source: "/api/settings",
        headers: noStoreHeaders,
      },
    ];
  },
};

export default nextConfig;
