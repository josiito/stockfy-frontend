import { ArrowLeft, Archive, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { archiveProduct } from "@/app/panel/actions/products";
import { ApiUnavailable } from "@/components/api-error";
import { ConfirmForm } from "@/components/panel/confirm-form";
import { ImageManager } from "@/components/panel/image-manager";
import { PageHeader } from "@/components/panel/page-header";
import { ProductForm } from "@/components/panel/product-form";
import { Badge, PRODUCT_STATUS } from "@/components/panel/status-badge";
import { VariantManager } from "@/components/panel/variant-manager";
import {
  getAdminCategories,
  getAdminProduct,
  getCategoryAttributes,
  getProductImages,
  getProductVariants,
} from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

export const metadata: Metadata = { title: "Editar producto" };

async function ProductEditor({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  let product, categories;
  try {
    [product, categories] = await Promise.all([getAdminProduct(id), getAdminCategories()]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return <ApiUnavailable />;
  }

  const category = categories.results.find((c) => c.id === product.category);

  let variants, images, attributes;
  try {
    [variants, images, attributes] = await Promise.all([
      getProductVariants(product.slug),
      getProductImages(product.id),
      // Solo las categorías activas exponen sus atributos.
      category ? getCategoryAttributes(category.slug).catch(() => []) : Promise.resolve([]),
    ]);
  } catch {
    return <ApiUnavailable />;
  }

  const status = PRODUCT_STATUS[product.status];

  return (
    <>
      <PageHeader
        title={product.name}
        subtitle={category ? `Categoría: ${category.name}` : undefined}
        actions={
          <>
            <Badge tone={status.tone}>{status.label}</Badge>
            {product.status === "ACTIVE" && (
              <Link href={`/productos/${product.slug}`} target="_blank" className="btn-ghost">
                <ExternalLink className="size-4" /> Ver en la tienda
              </Link>
            )}
            {product.status !== "ARCHIVED" && (
              <ConfirmForm
                action={archiveProduct}
                fields={{ product_id: product.id }}
                confirm={`¿Archivar «${product.name}»? Dejará de verse en la tienda. Puedes recuperarlo cambiando su estado.`}
                className="btn-ghost text-danger hover:border-danger hover:text-danger"
              >
                <Archive className="size-4" /> Archivar
              </ConfirmForm>
            )}
          </>
        }
      />

      <div className="space-y-10">
        <section>
          <h2 className="mb-3 font-display text-xl font-medium">Datos del producto</h2>
          <ProductForm product={product} categories={categories.results} />
        </section>

        <section id="variantes">
          <h2 className="mb-1 font-display text-xl font-medium">Variantes y stock</h2>
          <p className="mb-3 text-sm text-ink-muted">
            Cada combinación de atributos (medida, color…) es una variante con su precio y su stock.
            El stock solo cambia con movimientos, que quedan registrados.
          </p>
          {attributes.length === 0 && (
            <p className="mb-3 rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">
              La categoría de este producto no tiene atributos configurados (o está inactiva).
            </p>
          )}
          <VariantManager productId={product.id} variants={variants.results} attributes={attributes} />
        </section>

        <section id="imagenes">
          <h2 className="mb-3 font-display text-xl font-medium">Imágenes</h2>
          <ImageManager productId={product.id} images={images.results} />
        </section>
      </div>
    </>
  );
}

export default function EditProductPage(props: PageProps<"/panel/productos/[id]">) {
  return (
    <>
      <Link href="/panel/productos" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Productos
      </Link>
      <Suspense fallback={<div className="space-y-6"><div className="h-10 w-72 animate-pulse rounded-xl bg-surface-muted" /><div className="card h-[32rem] animate-pulse" /></div>}>
        <ProductEditor params={props.params} />
      </Suspense>
    </>
  );
}
