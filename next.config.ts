import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Servidor autocontenido en .next/standalone para la imagen de Docker.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  // Las imágenes vienen del backend (media/ en local, Cloudflare R2 en
  // producción). Se sirven tal cual para no tener que listar sus dominios.
  images: {
    unoptimized: true,
  },
  experimental: {
    // Las imágenes de producto se suben desde el panel con una Server
    // Action (por defecto admite 1 MB). El backend acepta hasta 10 MB.
    serverActions: {
      bodySizeLimit: "11mb",
    },
    proxyClientMaxBodySize: "11mb",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
