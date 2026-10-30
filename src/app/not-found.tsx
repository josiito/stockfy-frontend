import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  // Se renderiza en el layout raíz, fuera de (tienda): añade su propia cabecera.
  return (
    <>
      <SiteHeader />
      <main className="container-page flex flex-1 flex-col items-center py-24 text-center">
        <p className="font-display text-8xl font-medium text-accent">404</p>
        <h1 className="mt-4 font-display text-3xl font-medium">No encontramos esta página</h1>
        <p className="mt-2 text-ink-muted">Puede que el producto ya no esté disponible.</p>
        <Link href="/productos" className="btn-primary mt-8">Volver al catálogo</Link>
      </main>
      <SiteFooter />
    </>
  );
}
