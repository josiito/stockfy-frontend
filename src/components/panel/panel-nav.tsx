"use client";

import { LayoutDashboard, type LucideIcon, Package, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string; icon: LucideIcon; exact?: boolean };

const LINKS: NavLink[] = [
  { href: "/panel", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/panel/productos", label: "Productos", icon: Package },
];

const ADMIN_LINKS: NavLink[] = [{ href: "/panel/usuarios", label: "Usuarios", icon: Users }];

export function PanelNav({ showUsers }: { showUsers: boolean }) {
  const pathname = usePathname();
  const links = showUsers ? [...LINKS, ...ADMIN_LINKS] : LINKS;

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
              active ? "bg-brand-soft text-brand" : "text-ink-muted hover:bg-surface-muted hover:text-ink"
            }`}
          >
            <Icon className="size-4" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
