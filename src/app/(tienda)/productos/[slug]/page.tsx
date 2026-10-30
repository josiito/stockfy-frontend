import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ApiUnavailable } from "@/components/api-error";
import { ApiError, getProduct, getWishlists } from "@/lib/api";
import { getAccessToken } from "@/lib/session";

import { Gallery } from "./gallery";
import { VariantPicker } from "./variant-picker";
import { WishlistButton } from "./wishlist-button";

async function WishlistControl({ productId, slug }: { productId: number; slug: string }) {
  const lists = (await getAccessToken()) ? await getWishlists().catch(() => null) : null;
  return <WishlistButton productId={productId} productSlug={slug} lists={lists} />;
}

async function ProductView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let product;
  try {
    product = await getProduct(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return <ApiUnavailable />;
  }

  const images = [...product.images].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || (a.position ?? 0) - (b.position ?? 0),
  );

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <Gallery images={images} name={product.name} seed={product.id} />

      <div className="lg:py-4">
        <Link
          href={`/productos?category=${product.category.slug}`}
          className="text-sm font-semibold uppercase tracking-wider text-info hover:underline"
        >
          {product.category.name}
        </Link>
        <h1 className="mt-2 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {product.name}
        </h1>
        {product.short_description && (
          <p className="mt-4 text-lg text-ink-muted">{product.short_description}</p>
        )}

        <div className="mt-8">
          <VariantPicker
            product={product}
            image={images[0]?.url ?? null}
            wishlistSlot={
              <Suspense fallback={<div className="size-13 rounded-full border border-line" />}>
                <WishlistControl productId={product.id} slug={product.slug} />
              </Suspense>
            }
          />
        </div>

        {product.description && (
          <div className="mt-10 border-t border-line pt-8">
            <h2 className="mb-3 font-display text-xl font-semibold">Descripción</h2>
            <p className="whitespace-pre-line leading-relaxed text-ink-muted">{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="aspect-square animate-pulse rounded-[2rem] bg-surface-muted" />
      <div className="space-y-4 py-4">
        <div className="h-4 w-24 animate-pulse rounded bg-surface-muted" />
        <div className="h-12 w-3/4 animate-pulse rounded bg-surface-muted" />
        <div className="h-24 animate-pulse rounded bg-surface-muted" />
      </div>
    </div>
  );
}

export async function generateMetadata(props: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug).catch(() => null);
  return product
    ? { title: product.name, description: product.short_description }
    : { title: "Producto" };
}

export default function ProductPage(props: PageProps<"/productos/[slug]">) {
  return (
    <div className="container-page pt-8">
      <Link href="/productos" className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-brand">
        <ChevronLeft className="size-4" /> Volver al catálogo
      </Link>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductView params={props.params} />
      </Suspense>
    </div>
  );
}
