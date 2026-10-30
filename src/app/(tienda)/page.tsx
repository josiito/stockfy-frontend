import { ArrowRight, Hammer, PackageCheck, Truck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { ApiUnavailable } from "@/components/api-error";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import { getCategories, getProducts } from "@/lib/api";

const CATEGORY_COLORS = [
  "bg-brand-fill text-white",
  "bg-accent-fill text-white",
  "bg-info-fill text-white",
  "bg-brand-soft text-brand-strong",
  "bg-accent-soft text-accent-strong",
  "bg-info-soft text-info-strong",
];

async function Categories() {
  const categories = await getCategories().catch(() => null);
  if (!categories) return <ApiUnavailable />;
  if (!categories.results.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {categories.results.slice(0, 6).map((category, index) => (
        <Link
          key={category.id}
          href={`/productos?category=${category.slug}`}
          className={`group flex aspect-square flex-col justify-between rounded-3xl p-5 transition hover:-translate-y-1 ${CATEGORY_COLORS[index % CATEGORY_COLORS.length]}`}
        >
          <ArrowRight className="size-5 self-end -rotate-45 transition group-hover:rotate-0" />
          <span className="font-display text-lg font-semibold leading-tight">{category.name}</span>
        </Link>
      ))}
    </div>
  );
}

async function FeaturedProducts() {
  const featured = await getProducts({ featured: true }).catch(() => null);
  if (!featured) return <ApiUnavailable />;

  // Si aún no hay destacados, se enseñan las novedades.
  const products = featured.results.length
    ? featured.results
    : ((await getProducts().catch(() => null))?.results ?? []);

  if (!products.length) {
    return <p className="text-ink-muted">Todavía no hay productos publicados.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.slice(0, 8).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

const PERKS = [
  { icon: Hammer, title: "Hecho a mano", text: "Cada pieza sale de nuestro taller.", tone: "bg-brand-soft text-brand" },
  { icon: PackageCheck, title: "Stock real", text: "Lo que ves disponible, lo tenemos.", tone: "bg-info-soft text-info" },
  { icon: Truck, title: "Envío a domicilio", text: "Te lo llevamos montado o listo para montar.", tone: "bg-accent-soft text-accent" },
];

export default function HomePage() {
  return (
    <>
      <section className="container-page pt-10 lg:pt-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-fill px-6 py-16 text-white sm:px-12 lg:px-16 lg:py-24">
          <div className="absolute -right-24 -top-24 size-96 rounded-full bg-accent-fill/90" aria-hidden />
          <div className="absolute -bottom-32 right-40 size-80 rounded-full bg-info-fill/80" aria-hidden />
          <div className="absolute bottom-10 right-16 hidden size-28 rotate-12 rounded-3xl border-4 border-white/70 lg:block" aria-hidden />

          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <span className="size-2 rounded-full bg-accent-fill" /> Nueva colección de cabeceros
            </span>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Artesanía hecha para descansar mejor.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/85">
              Cabeceros, somieres y piezas únicas fabricadas en nuestro taller, a tu medida y con
              stock en tiempo real.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/productos" className="btn-accent px-7 py-3.5 text-base">
                Ver catálogo <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/productos?featured=true"
                className="btn border border-white/40 px-7 py-3.5 text-base text-white hover:bg-white/10"
              >
                Destacados
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page mt-10 grid gap-4 md:grid-cols-3">
        {PERKS.map(({ icon: Icon, title, text, tone }) => (
          <div key={title} className="card flex items-center gap-4 p-5">
            <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${tone}`}>
              <Icon className="size-6" />
            </span>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-ink-muted">{text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="container-page mt-20">
        <SectionTitle eyebrow="Explora" title="Categorías" href="/productos" />
        <Suspense fallback={<div className="h-40 animate-pulse rounded-3xl bg-surface-muted" />}>
          <Categories />
        </Suspense>
      </section>

      <section className="container-page mt-20">
        <SectionTitle eyebrow="Selección" title="Productos destacados" href="/productos?featured=true" />
        <Suspense fallback={<GridSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </section>
    </>
  );
}

function SectionTitle({ eyebrow, title, href }: { eyebrow: string; title: string; href: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>
        <h2 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      </div>
      <Link href={href} className="hidden items-center gap-1.5 text-sm font-semibold text-brand hover:underline sm:flex">
        Ver todo <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
