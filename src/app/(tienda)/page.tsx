import { ArrowRight, Hammer, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { ApiUnavailable } from "@/components/api-error";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import { getCategories, getProducts } from "@/lib/api";
import { formatPrice } from "@/lib/format";

/** Imagen principal de la portada: el primer producto destacado con foto. */
async function HeroImage() {
  const featured = await getProducts({ featured: true }).catch(() => null);
  const pool = featured?.results.length ? featured.results : ((await getProducts().catch(() => null))?.results ?? []);
  const product = pool.find((p) => p.primary_image) ?? pool[0];

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-muted lg:aspect-auto lg:h-full">
      {product?.primary_image ? (
        <Image
          src={product.primary_image.url}
          alt={product.primary_image.alt_text || product.name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        <ImagePlaceholder />
      )}
      {product && (
        <Link
          href={`/productos/${product.slug}`}
          className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-md bg-surface/95 p-4 shadow-lg backdrop-blur transition hover:bg-surface sm:inset-x-6 sm:bottom-6"
        >
          <span className="min-w-0">
            <span className="block text-xs uppercase tracking-[0.14em] text-ink-muted">{product.category.name}</span>
            <span className="block truncate font-display text-lg">{product.name}</span>
          </span>
          <span className="shrink-0 text-sm">
            Desde <span className="font-semibold">{formatPrice(product.price_from)}</span>
          </span>
        </Link>
      )}
    </div>
  );
}

async function Categories() {
  const categories = await getCategories().catch(() => null);
  if (!categories) return <ApiUnavailable />;
  if (!categories.results.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.results.slice(0, 6).map((category, index) => (
        <Link
          key={category.id}
          href={`/productos?category=${category.slug}`}
          className="group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-lg border border-line p-6 transition hover:border-ink/30"
        >
          <ImagePlaceholder seed={index} monogram={false} />
          <div className="relative">
            <h3 className="font-display text-2xl">{category.name}</h3>
            {category.description && (
              <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{category.description}</p>
            )}
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
              Ver colección <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </div>
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
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
      {products.slice(0, 8).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

const PERKS = [
  { icon: Hammer, title: "Hecho a mano", text: "Cada pieza sale de nuestro taller." },
  { icon: PackageCheck, title: "Stock real", text: "Lo que ves disponible, lo tenemos." },
  { icon: Truck, title: "Envío a domicilio", text: "Entrega cuidada en toda la península." },
  { icon: ShieldCheck, title: "Pago seguro", text: "Tus datos de pago siempre protegidos." },
];

const STEPS = [
  { title: "Materiales nobles", text: "Seleccionamos maderas, fibras y tejidos pensados para durar años, no temporadas." },
  { title: "Fabricación artesanal", text: "Cada pieza se monta y se termina a mano en nuestro taller, con controles en cada paso." },
  { title: "Entrega en tu casa", text: "Te avisamos en cada fase del pedido y lo recibes listo para disfrutar." },
];

export default function HomePage() {
  return (
    <>
      <section className="container-page grid gap-10 pt-8 lg:min-h-[640px] lg:grid-cols-2 lg:gap-16 lg:pt-12">
        <div className="flex flex-col justify-center py-4 lg:py-16">
          <p className="eyebrow">Artesanía para el dormitorio</p>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
            Piezas hechas a mano para descansar mejor.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
            Cabeceros, somieres y artesanía fabricados en nuestro taller con materiales nobles,
            stock en tiempo real y envío a domicilio.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/productos" className="btn-primary px-7 py-3.5 text-base">
              Ver catálogo <ArrowRight className="size-4" />
            </Link>
            <Link href="/productos?ordering=-created_at" className="btn-ghost px-7 py-3.5 text-base">
              Novedades
            </Link>
          </div>
        </div>
        <Suspense fallback={<div className="aspect-[4/5] animate-pulse rounded-lg bg-surface-muted lg:aspect-auto" />}>
          <HeroImage />
        </Suspense>
      </section>

      <section className="mt-16 border-y border-line bg-surface">
        <ul className="container-page grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <Icon className="mt-0.5 size-6 shrink-0 text-accent" strokeWidth={1.5} />
              <div>
                <p className="font-medium">{title}</p>
                <p className="mt-0.5 text-sm text-ink-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page mt-24">
        <SectionTitle eyebrow="Colecciones" title="Encuentra tu pieza" href="/productos" />
        <Suspense fallback={<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-56 animate-pulse rounded-lg bg-surface-muted" />)}</div>}>
          <Categories />
        </Suspense>
      </section>

      <section className="container-page mt-24">
        <SectionTitle eyebrow="Selección" title="Productos destacados" href="/productos?featured=true" />
        <Suspense fallback={<GridSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </section>

      <section className="mt-28 -mb-24 bg-surface-muted">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div>
            <p className="eyebrow">Nuestro taller</p>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight">
              Del taller a tu casa, sin intermediarios.
            </h2>
            <Link href="/productos" className="mt-8 inline-flex items-center gap-1.5 font-medium text-brand hover:underline">
              Descubre el catálogo <ArrowRight className="size-4" />
            </Link>
          </div>
          <ol className="grid gap-10 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="border-t border-ink/15 pt-6">
                <span className="font-display text-4xl text-accent">0{index + 1}</span>
                <h3 className="mt-4 text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

function SectionTitle({ eyebrow, title, href }: { eyebrow: string; title: string; href: string }) {
  return (
    <div className="mb-10 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">{title}</h2>
      </div>
      <Link href={href} className="hidden items-center gap-1.5 text-sm font-medium hover:text-brand sm:flex">
        Ver todo <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
