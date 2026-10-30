import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ApiUnavailable } from "@/components/api-error";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import { getCategories, getProducts, type ProductQuery } from "@/lib/api";

export const metadata: Metadata = { title: "Catálogo" };

const PAGE_SIZE = 20; // PAGE_SIZE de DRF en el backend.

const ORDERINGS = [
  { value: "-created_at", label: "Más recientes" },
  { value: "price_from", label: "Precio: menor a mayor" },
  { value: "-price_from", label: "Precio: mayor a menor" },
  { value: "name", label: "Nombre (A-Z)" },
];

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function toQuery(params: SearchParams): ProductQuery {
  return {
    page: Number(first(params.page)) || 1,
    search: first(params.search),
    category: first(params.category),
    ordering: first(params.ordering),
    price_min: first(params.price_min),
    price_max: first(params.price_max),
    featured: first(params.featured) === "true" || undefined,
    available: first(params.available) === "true" || undefined,
  };
}

function hrefWith(params: SearchParams, changes: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...params, ...changes })) {
    const v = first(value);
    if (v) search.set(key, v);
  }
  const qs = search.toString();
  return qs ? `/productos?${qs}` : "/productos";
}

async function Filters({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = toQuery(params);
  const categories = await getCategories().catch(() => null);

  return (
    <form action="/productos" className="card space-y-5 p-5 lg:sticky lg:top-24">
      <div className="flex items-center gap-2 font-semibold">
        <SlidersHorizontal className="size-4 text-brand" /> Filtros
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
        <input name="search" defaultValue={query.search} placeholder="Buscar…" className="input pl-10" />
      </div>

      <div>
        <label className="label" htmlFor="category">Categoría</label>
        <select id="category" name="category" defaultValue={query.category ?? ""} className="input">
          <option value="">Todas</option>
          {categories?.results.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <span className="label">Precio (€)</span>
        <div className="grid grid-cols-2 gap-2">
          <input name="price_min" type="number" min={0} defaultValue={query.price_min} placeholder="Mín." className="input" />
          <input name="price_max" type="number" min={0} defaultValue={query.price_max} placeholder="Máx." className="input" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="ordering">Ordenar por</label>
        <select id="ordering" name="ordering" defaultValue={query.ordering ?? "-created_at"} className="input">
          {ORDERINGS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2.5 text-sm">
        <input type="checkbox" name="available" value="true" defaultChecked={query.available} className="size-4 accent-[var(--brand)]" />
        Solo con stock
      </label>
      {query.featured && <input type="hidden" name="featured" value="true" />}

      <div className="flex gap-2">
        <button className="btn-primary flex-1">Aplicar</button>
        <Link href="/productos" className="btn-ghost">Limpiar</Link>
      </div>
    </form>
  );
}

async function Results({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = toQuery(params);

  let data;
  try {
    data = await getProducts(query);
  } catch {
    return <ApiUnavailable />;
  }

  const page = query.page ?? 1;
  const pages = Math.max(1, Math.ceil(data.count / PAGE_SIZE));

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink-muted">
        {data.count} {data.count === 1 ? "producto" : "productos"}
        {query.search && <> para “<span className="font-medium text-ink">{query.search}</span>”</>}
      </p>

      {data.results.length ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {data.results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="font-display text-xl font-semibold">No hay productos con estos filtros</p>
          <Link href="/productos" className="btn-ghost mt-6">Ver todo el catálogo</Link>
        </div>
      )}

      {pages > 1 && (
        <nav className="flex items-center justify-center gap-3" aria-label="Paginación">
          {data.previous ? (
            <Link href={hrefWith(params, { page: String(page - 1) })} className="btn-ghost">
              <ChevronLeft className="size-4" /> Anterior
            </Link>
          ) : null}
          <span className="text-sm text-ink-muted">
            Página {page} de {pages}
          </span>
          {data.next ? (
            <Link href={hrefWith(params, { page: String(page + 1) })} className="btn-ghost">
              Siguiente <ChevronRight className="size-4" />
            </Link>
          ) : null}
        </nav>
      )}
    </div>
  );
}

export default function ProductsPage(props: PageProps<"/productos">) {
  return (
    <div className="container-page pt-12">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Tienda</p>
        <h1 className="mt-1 font-display text-4xl font-bold tracking-tight sm:text-5xl">Catálogo</h1>
      </header>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside>
          <Suspense fallback={<div className="card h-96 animate-pulse" />}>
            <Filters searchParams={props.searchParams} />
          </Suspense>
        </aside>
        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <Results searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
