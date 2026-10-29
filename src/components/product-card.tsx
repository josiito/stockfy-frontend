import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

import { ImagePlaceholder } from "./image-placeholder";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgb(16_42_44/0.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        {product.primary_image ? (
          <Image
            src={product.primary_image.url}
            alt={product.primary_image.alt_text || product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder seed={product.id} />
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {product.featured && (
            <span className="rounded-full bg-accent-fill px-2.5 py-1 text-xs font-semibold text-white">
              Destacado
            </span>
          )}
          {!product.in_stock && (
            <span className="rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white">
              Agotado
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-info">
          {product.category.name}
        </span>
        <h3 className="font-display text-lg font-semibold leading-snug">{product.name}</h3>
        {product.short_description && (
          <p className="line-clamp-2 text-sm text-ink-muted">{product.short_description}</p>
        )}
        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="text-sm text-ink-muted">
            desde{" "}
            <span className="font-display text-xl font-bold text-ink">
              {formatPrice(product.price_from)}
            </span>
          </p>
          <span className="grid size-9 place-items-center rounded-full bg-brand-soft text-brand transition group-hover:bg-brand-fill group-hover:text-white">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface">
      <div className="aspect-[4/3] animate-pulse bg-surface-muted" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-20 animate-pulse rounded bg-surface-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-surface-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-muted" />
      </div>
    </div>
  );
}
