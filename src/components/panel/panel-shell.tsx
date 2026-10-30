import { LogOut, Store } from "lucide-react";
import Link from "next/link";

import { logout } from "@/app/actions/auth";
import { Logo } from "@/components/logo";
import { ROLE_LABELS, isAdmin } from "@/lib/auth";
import type { User } from "@/lib/types";

import { PanelNav } from "./panel-nav";

export function PanelShell({ user, children }: { user: User; children: React.ReactNode }) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email;

  return (
    <div className="flex min-h-screen flex-1 flex-col lg:flex-row">
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col gap-4 p-4">
          <div className="flex items-center justify-between gap-2 px-2">
            <Logo />
            <span className="rounded-full bg-info-soft px-2.5 py-1 text-xs font-semibold text-info">Panel</span>
          </div>

          <PanelNav showUsers={isAdmin(user)} />

          <div className="mt-auto space-y-1 border-t border-line pt-3">
            <div className="px-3 py-2">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="text-xs text-ink-muted">{ROLE_LABELS[user.role]}</p>
            </div>
            <Link href="/" className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-ink-muted transition hover:bg-surface-muted hover:text-ink">
              <Store className="size-4" /> Ver la tienda
            </Link>
            <form action={logout}>
              <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-ink-muted transition hover:bg-surface-muted hover:text-danger">
                <LogOut className="size-4" /> Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}

export function PanelShellSkeleton() {
  return (
    <div className="flex min-h-screen flex-1 flex-col lg:flex-row">
      <aside className="h-20 border-b border-line bg-surface lg:h-screen lg:w-64 lg:border-b-0 lg:border-r" />
      <main className="flex-1 space-y-6 px-4 py-8 sm:px-8">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-surface-muted" />
        <div className="card h-64 animate-pulse" />
      </main>
    </div>
  );
}
