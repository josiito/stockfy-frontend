"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/** Navegación en pantallas pequeñas (en escritorio va en la cabecera). */
export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="grid size-10 place-items-center rounded-md border border-line bg-surface"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <nav id="mobile-menu" className="absolute inset-x-0 top-full border-b border-line bg-background shadow-lg">
          <ul className="container-page divide-y divide-line py-2">
            {links.map((link) => (
              <li key={link.href}>
                {/* Se cierra al elegir un enlace (usePathname bloquearía el prerenderizado). */}
                <Link href={link.href} onClick={() => setOpen(false)} className="block py-3.5 font-display text-lg">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
