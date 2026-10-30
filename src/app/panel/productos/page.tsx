import { Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ApiUnavailable } from "@/components/api-error";
import { PageHeader } from "@/components/panel/page-header";
import { Pagination } from "@/components/panel/pagination";
import { Badge, PRODUCT_STATUS, StockBadge } from "@/components/panel/status-badge";
import { getAdminCategories, getAdminProducts } from "@/lib/admin-api";
import { formatDate } from "@/lib/format";
import { paramsKey } from "@/lib/search-params";
import type { ProductStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Productos" };

type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

async function Filters({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const categories = await getAdminCategories().catch(() => null);

  return (
    <form key={paramsKey(params)} action="/panel/productos" className="card mb-6 grid gap-3 p-4 sm:grid-cols-[1fr_180px_200px_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
        <input name="search" defaultValue={first(params.search)} placeholder="Nombre, slug o descripción…" className="input pl-10" aria-label="Buscar" />
      </div>
      <select name="status" defaultValue={first(params.status) ?? ""} className="input" aria-label="Estado">
        <option value="">Todos los estados</option>
        {Object.entries(PRODUCT_STATUS).map(([value, { label }]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <select name="category" defaultValue={first(params.category) ?? ""} className="input" aria-label="Categoría">
        <option value="">Todas las categorías</option>
        {categories?.results.map((c) => (
          <option key={c.id} value={c.slug}>{c.name}</option>
        ))}
      </select>
      <button className="btn-primary">Filtrar</button>
    </form>
  );
}

async function ProductTable({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = Number(first(params.page)) || 1;

  let data;
  try {
    data = await getAdminProducts({
      page,
      search: first(params.search),
      status: first(params.status),
      category: first(params.category),
      ordering: "-updated_at",
    });
  } catch {
    return <ApiUnavailable />;
  }

  if (!data.results.length) {
    return (
      <div className="card p-12 text-center">
        <p className="font-display text-xl font-medium">No hay productos con estos filtros</p>
        <Link href="/panel/productos/nuevo" className="btn-primary mt-6">
          <Plus className="size-4" /> Crear producto
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mb-3 text-sm text-ink-muted">
        {data.count} {data.count === 1 ? "producto" : "productos"}
      </p>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Producto</th>
              <th className="px-3 py-3 font-semibold">Categoría</th>
              <th className="px-3 py-3 font-semibold">Estado</th>
              <th className="px-3 py-3 text-right font-semibold">Variantes</th>
              <th className="px-3 py-3 font-semibold">Stock</th>
              <th className="px-5 py-3 font-semibold">Actualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {data.results.map((p) => {
              const status = PRODUCT_STATUS[p.status as ProductStatus];
              return (
                <tr key={p.id} className="transition hover:bg-surface-muted/60">
                  <td className="px-5 py-3">
                    <Link href={`/panel/productos/${p.id}`} className="flex items-center gap-3">
                      <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                        {p.primary_image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.primary_image_url} alt="" className="size-full object-cover" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-semibold hover:text-brand">{p.name}</span>
                        <span className="block truncate font-mono text-xs text-ink-muted">{p.slug}</span>
                      </span>
                      {p.featured && <Badge tone="blue">Destacado</Badge>}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-ink-muted">{p.category_name}</td>
                  <td className="px-3 py-3"><Badge tone={status.tone}>{status.label}</Badge></td>
                  <td className="px-3 py-3 text-right">{p.variants_count}</td>
                  <td className="px-3 py-3">{p.variants_count ? <StockBadge stock={p.total_stock} /> : <span className="text-ink-muted">—</span>}</td>
                  <td className="px-5 py-3 text-ink-muted">{formatDate(p.updated_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination base="/panel/productos" params={params} page={page} count={data.count} />
    </>
  );
}

export default function PanelProductsPage(props: PageProps<"/panel/productos">) {
  return (
    <>
      <PageHeader
        title="Productos"
        subtitle="Todos los productos de la tienda, incluidos borradores y archivados."
        actions={
          <Link href="/panel/productos/nuevo" className="btn-primary">
            <Plus className="size-4" /> Nuevo producto
          </Link>
        }
      />
      <Suspense fallback={<div className="card mb-6 h-16 animate-pulse" />}>
        <Filters searchParams={props.searchParams} />
      </Suspense>
      <Suspense fallback={<div className="card h-96 animate-pulse" />}>
        <ProductTable searchParams={props.searchParams} />
      </Suspense>
    </>
  );
}
