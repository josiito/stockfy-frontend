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
