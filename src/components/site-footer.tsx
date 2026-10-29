import Link from "next/link";

import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed text-ink-muted">
            Cabeceros, somieres y artesanía hechos a mano. Producción propia, stock real y envío
            a toda la península.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold">Tienda</h3>
          <ul className="space-y-2.5 text-sm text-ink-muted">
            <li><Link className="hover:text-brand" href="/productos">Catálogo</Link></li>
            <li><Link className="hover:text-brand" href="/productos?featured=true">Destacados</Link></li>
            <li><Link className="hover:text-brand" href="/carrito">Carrito</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold">Tu cuenta</h3>
          <ul className="space-y-2.5 text-sm text-ink-muted">
            <li><Link className="hover:text-brand" href="/cuenta">Mis pedidos</Link></li>
            <li><Link className="hover:text-brand" href="/cuenta/favoritos">Favoritos</Link></li>
            <li><Link className="hover:text-brand" href="/registro">Crear cuenta</Link></li>
          </ul>
        </div>
      </div>
      <div className="h-1.5 bg-[linear-gradient(90deg,var(--brand)_0_45%,var(--accent)_45%_75%,var(--info)_75%)]" />
    </footer>
  );
}
