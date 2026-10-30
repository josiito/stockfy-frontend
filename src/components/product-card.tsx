import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

import { ImagePlaceholder } from "./image-placeholder";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/productos/${product.slug}`} className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-muted">
        {product.primary_image ? (
          <Image
            src={product.primary_image.url}
            alt={product.primary_image.alt_text || product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <ImagePlaceholder seed={product.id} />
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {product.featured && (
            <span className="rounded-sm bg-surface/95 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">
              Destacado
            </span>
          )}
          {!product.in_stock && (
            <span className="rounded-sm bg-ink/85 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-background">
              Agotado
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 pt-4">
        <span className="text-xs uppercase tracking-[0.14em] text-ink-muted">{product.category.name}</span>
        <h3 className="font-display text-lg font-medium leading-snug transition group-hover:text-brand">{product.name}</h3>
        <p className="mt-1 text-sm text-ink-muted">
          Desde <span className="font-semibold text-ink">{formatPrice(product.price_from)}</span>
        </p>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="aspect-[4/5] animate-pulse rounded-lg bg-surface-muted" />
      <div className="space-y-2.5 pt-4">
        <div className="h-3 w-20 animate-pulse rounded bg-surface-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-surface-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-muted" />
      </div>
    </div>
  );
}
