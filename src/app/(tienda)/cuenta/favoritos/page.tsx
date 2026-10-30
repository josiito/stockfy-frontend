import { Heart } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ApiUnavailable } from "@/components/api-error";
import { getWishlists } from "@/lib/api";

import { ListHeader, NewListForm, RemoveItemButton } from "./list-controls";

export const metadata: Metadata = { title: "Favoritos" };

async function Favorites({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lista } = await searchParams;

  let lists;
  try {
    lists = await getWishlists();
  } catch {
    return <ApiUnavailable />;
  }

  const selected = lists.find((l) => String(l.id) === lista) ?? lists[0];
  if (!selected) return <ApiUnavailable />;

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="space-y-4">
        <nav className="card p-2" aria-label="Listas de favoritos">
          <ul className="space-y-1">
            {lists.map((list) => {
              const active = list.id === selected.id;
              return (
                <li key={list.id}>
                  <Link
                    href={`/cuenta/favoritos?lista=${list.id}`}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm transition ${
                      active ? "bg-brand-soft font-semibold text-brand-strong" : "hover:bg-surface-muted"
                    }`}
                  >
                    <span className="flex-1 truncate">{list.name}</span>
                    <span className="text-xs text-ink-muted">{list.items.length}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <NewListForm />
      </aside>

      <section>
        <ListHeader key={selected.id} list={selected} />

        {selected.items.length ? (
          <ul className="grid gap-4 xl:grid-cols-2">
            {selected.items.map((item) => (
              <li key={item.id} className="card flex items-start gap-4 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
                  <Heart className="size-5 fill-current" />
                </span>
                <div className="flex-1">
                  <Link href={`/productos/${item.product.slug}`} className="font-display text-lg font-semibold hover:text-brand">
                    {item.product.name}
                  </Link>
                  {item.product.short_description && (
                    <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{item.product.short_description}</p>
                  )}
                </div>
                <RemoveItemButton listId={selected.id} itemId={item.id} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="card flex flex-col items-center p-12 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-accent-soft text-accent">
              <Heart className="size-6" />
            </span>
            <p className="mt-5 font-display text-xl font-semibold">Esta lista está vacía</p>
            <p className="mt-1 text-sm text-ink-muted">Pulsa el corazón en cualquier producto y elige esta lista.</p>
            <Link href="/productos" className="btn-primary mt-6">Explorar catálogo</Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default function WishlistPage(props: PageProps<"/cuenta/favoritos">) {
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold">Favoritos</h1>
      <Suspense fallback={<div className="card h-48 animate-pulse" />}>
        <Favorites searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
