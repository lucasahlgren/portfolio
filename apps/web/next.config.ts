import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  experimental: { globalNotFound: true },
  transpilePackages: ["@portfolio/content", "@portfolio/sanity"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      { source: "/work", destination: "/projects", permanent: true },
      { source: "/work/:slug", destination: "/projects/:slug", permanent: true },
      {
        source: "/projects/masterthesis",
        destination: "/projects/tco-calculator",
        permanent: true,
      },
      { source: "/projects/wvs", destination: "/projects/world-values-survey", permanent: true },
      { source: "/projects/snowballwar", destination: "/projects/snowball-war", permanent: true },
      {
        source: "/projects/changedetectiontest",
        destination: "/projects/change-detection-test",
        permanent: true,
      },
      { source: "/projects/sik", destination: "/projects/skillingaryds-ibk", permanent: true },
      { source: "/projects/hu", destination: "/projects/project-hu", permanent: true },
      { source: "/projects/portfolio", destination: "/projects/portfolio-2018", permanent: true },
      { source: "/education", destination: "/experience", permanent: true },
      {
        source: "/:path*",
        has: [{ type: "host", value: "studio.lucasahlgren.se" }],
        destination: "https://lucasahlgren.se/studio/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
