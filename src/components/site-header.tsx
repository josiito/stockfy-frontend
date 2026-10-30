import { LayoutDashboard, UserRound } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { getCurrentUser } from "@/lib/api";
import { isStaff } from "@/lib/auth";

import { CartButton } from "./cart/cart-button";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

const NAV = [
  { href: "/productos", label: "Catálogo" },
  { href: "/productos?ordering=-created_at", label: "Novedades" },
  { href: "/productos?featured=true", label: "Destacados" },
];

async function AccountLink() {
  const user = await getCurrentUser().catch(() => null);

  if (!user) {
    return (
      <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-ink">
        <UserRound className="size-5" />
        <span className="hidden sm:inline">Entrar</span>
      </Link>
    );
  }

  return (
    <>
      {isStaff(user) && (
        <Link href="/panel" className="hidden items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-ink sm:flex">
          <LayoutDashboard className="size-4" /> Panel
        </Link>
      )}
      <Link
        href="/cuenta"
        className="flex items-center gap-2 text-sm font-medium transition hover:text-brand"
      >
        <span className="grid size-9 place-items-center rounded-full bg-brand-soft font-semibold text-brand">
          {(user.first_name || user.email).charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:inline">{user.first_name || "Mi cuenta"}</span>
      </Link>
    </>
  );
}

function AccountFallback() {
  return (
    <Link
      href="/cuenta"
      aria-label="Mi cuenta"
      className="grid size-10 place-items-center text-ink-muted"
    >
      <UserRound className="size-5" />
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <p className="bg-brand-fill px-4 py-2 text-center text-xs tracking-wide text-white/85">
        Fabricado en nuestro taller · Envío a toda la península
        <span className="hidden sm:inline"> · Pago seguro</span>
      </p>
      <div className="relative border-b border-line bg-background/90 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-18">
          <div className="flex items-center gap-3">
            <MobileMenu links={NAV} />
            <Logo />
          </div>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-muted transition hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 sm:gap-5">
            <Suspense fallback={<AccountFallback />}>
              <AccountLink />
            </Suspense>
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
}
