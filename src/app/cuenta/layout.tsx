import { Heart, LogOut, Package } from "lucide-react";
import Link from "next/link";

import { logout } from "@/app/actions/auth";

const LINKS = [
  { href: "/cuenta", label: "Mis pedidos", icon: Package },
  { href: "/cuenta/favoritos", label: "Favoritos", icon: Heart },
];

export default function AccountLayout({ children }: LayoutProps<"/cuenta">) {
  return (
    <div className="container-page pt-12">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <nav className="card flex gap-1 p-2 lg:flex-col">
            {LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-surface-muted">
                <Icon className="size-4 text-brand" /> {label}
              </Link>
            ))}
            <form action={logout} className="lg:mt-2 lg:border-t lg:border-line lg:pt-2">
              <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-ink-muted transition hover:bg-surface-muted hover:text-danger">
                <LogOut className="size-4" /> Cerrar sesión
              </button>
            </form>
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
