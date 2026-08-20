/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: isStaticExport ? "export" : undefined,
  basePath: basePath || undefined,
  images: {
    unoptimized: true,
  },
  redirects: isStaticExport
    ? undefined
    : async () => {
        return [
          {
            source: "/github",
            destination: "https://github.com/Shreyvats01/vats-editor",
            permanent: true,
          },
          {
            source: "/sdk",
            destination: "https://www.npmjs.com/package/@vats-editor/core",
            permanent: true,
          },
          {
            source: "/npm",
            destination: "https://www.npmjs.com/package/@vats-editor/core",
            permanent: true,
          },
          {
            source: "/feedback",
            destination: "https://github.com/Shreyvats01/vats-editor/issues",
            permanent: true,
          },
        ];
      },
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;
