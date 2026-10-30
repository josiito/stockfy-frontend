import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ApiUnavailable } from "@/components/api-error";
import { PageHeader } from "@/components/panel/page-header";
import { ProductForm } from "@/components/panel/product-form";
import { getAdminCategories } from "@/lib/admin-api";

export const metadata: Metadata = { title: "Nuevo producto" };

async function NewProductForm() {
  let categories;
  try {
    categories = (await getAdminCategories()).results;
  } catch {
    return <ApiUnavailable />;
  }
  return <ProductForm categories={categories} />;
}

export default function NewProductPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/panel/productos" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Productos
      </Link>
      <PageHeader title="Nuevo producto" subtitle="Después de crearlo podrás añadir variantes, stock e imágenes." />
      <Suspense fallback={<div className="card h-[32rem] animate-pulse" />}>
        <NewProductForm />
      </Suspense>
    </div>
  );
}
