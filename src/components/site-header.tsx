import { UserRound } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { getCurrentUser } from "@/lib/api";

import { CartButton } from "./cart/cart-button";
import { Logo } from "./logo";

const NAV = [
  { href: "/productos", label: "Catálogo" },
  { href: "/productos?featured=true", label: "Destacados" },
  { href: "/productos?ordering=-created_at", label: "Novedades" },
];

async function AccountLink() {
  const user = await getCurrentUser().catch(() => null);

  if (!user) {
    return (
      <Link href="/login" className="btn-ghost hidden sm:inline-flex">
        Entrar
      </Link>
    );
  }

  return (
    <Link
      href="/cuenta"
      className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-4 text-sm font-medium transition hover:border-brand"
    >
      <span className="grid size-9 place-items-center rounded-full bg-brand-soft font-semibold text-brand">
        {(user.first_name || user.email).charAt(0).toUpperCase()}
      </span>
      <span className="hidden sm:inline">{user.first_name || "Mi cuenta"}</span>
    </Link>
  );
}

function AccountFallback() {
  return (
    <Link
      href="/cuenta"
      aria-label="Mi cuenta"
      className="grid size-11 place-items-center rounded-full border border-line bg-surface"
    >
      <UserRound className="size-5" />
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-18 items-center justify-between gap-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-muted transition hover:bg-surface-muted hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Suspense fallback={<AccountFallback />}>
            <AccountLink />
          </Suspense>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
