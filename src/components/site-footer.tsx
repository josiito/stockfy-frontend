import { Hammer, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "Tienda",
    links: [
      { href: "/productos", label: "Catálogo completo" },
      { href: "/productos?ordering=-created_at", label: "Novedades" },
      { href: "/productos?featured=true", label: "Destacados" },
      { href: "/productos?available=true", label: "Disponible ya" },
    ],
  },
  {
    title: "Tu cuenta",
    links: [
      { href: "/cuenta", label: "Mis pedidos" },
      { href: "/cuenta/favoritos", label: "Favoritos" },
      { href: "/carrito", label: "Carrito" },
      { href: "/registro", label: "Crear cuenta" },
    ],
  },
];

const PROMISES = [
  { icon: Hammer, text: "Fabricación artesanal propia" },
  { icon: Truck, text: "Envío a toda la península" },
  { icon: ShieldCheck, text: "Pago 100 % seguro" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-brand-fill text-white/75">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm space-y-5">
          <Logo inverted />
          <p className="text-sm leading-relaxed">
            Cabeceros, somieres y piezas de artesanía fabricados a mano en nuestro taller.
            Materiales nobles, producción propia y stock real.
          </p>
          <ul className="space-y-2.5 text-sm">
            {PROMISES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5">
                <Icon className="size-4 text-white/60" /> {text}
              </li>
            ))}
          </ul>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white">{column.title}</h3>
            <ul className="space-y-3 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link className="transition hover:text-white" href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-6 text-xs text-white/50">
          © Stockfy · Artesanía para tu descanso
        </p>
      </div>
    </footer>
  );
}
