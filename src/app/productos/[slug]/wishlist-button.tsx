"use client";

import { Check, Heart, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

import { addToWishlist, createWishlist, removeFromWishlist } from "@/app/actions/wishlist";
import type { Wishlist } from "@/lib/types";

type Props = {
  productId: number;
  productSlug: string;
  /** null si no hay sesión. */
  lists: Wishlist[] | null;
};

const triggerClass =
  "grid size-13 place-items-center rounded-full border border-line bg-surface transition hover:border-accent hover:text-accent";

export function WishlistButton({ productId, productSlug, lists: initialLists }: Props) {
  const [lists, setLists] = useState(initialLists ?? []);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!initialLists) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(`/productos/${productSlug}`)}`}
        aria-label="Entra para guardar en favoritos"
        className={triggerClass}
      >
        <Heart className="size-5" />
      </Link>
    );
  }

  const itemIn = (list: Wishlist) => list.items.find((i) => i.product.id === productId);
  const saved = lists.some(itemIn);

  function toggle(list: Wishlist) {
    setError(undefined);
    startTransition(async () => {
      const item = itemIn(list);
      if (item) {
        const result = await removeFromWishlist(list.id, item.id);
        if (result.error) return setError(result.error);
        setLists((current) =>
          current.map((l) => (l.id === list.id ? { ...l, items: l.items.filter((i) => i.id !== item.id) } : l)),
        );
      } else {
        const result = await addToWishlist(list.id, productId);
        if (result.error || !result.data) return setError(result.error);
        const added = result.data;
        setLists((current) =>
          current.map((l) => (l.id === list.id ? { ...l, items: [added, ...l.items] } : l)),
        );
      }
    });
  }

  function createAndAdd(event: React.FormEvent) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setError(undefined);
    startTransition(async () => {
      const created = await createWishlist(name);
      if (created.error || !created.data) return setError(created.error);
      const list = created.data;
      const added = await addToWishlist(list.id, productId);
      setLists((current) => [...current, { ...list, items: added.data ? [added.data] : [] }]);
      setNewName("");
      if (added.error) setError(added.error);
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={saved ? "Guardado en favoritos" : "Guardar en favoritos"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`${triggerClass} ${saved ? "border-accent text-accent" : ""}`}
      >
        <Heart className={`size-5 ${saved ? "fill-current" : ""}`} />
      </button>

      {open && (
        <div className="absolute bottom-full right-0 z-30 mb-3 w-72 rounded-3xl border border-line bg-surface p-3 shadow-[0_24px_48px_-20px_rgb(16_42_44/0.45)]">
          <p className="px-2 pb-2 pt-1 text-sm font-semibold">Guardar en…</p>
          <ul className="max-h-60 space-y-1 overflow-y-auto">
            {lists.map((list) => {
              const inList = Boolean(itemIn(list));
              return (
                <li key={list.id}>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => toggle(list)}
                    className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left text-sm transition hover:bg-surface-muted disabled:opacity-60"
                  >
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-lg border transition ${
                        inList ? "border-brand-fill bg-brand-fill text-white" : "border-line"
                      }`}
                    >
                      {inList && <Check className="size-4" />}
                    </span>
                    <span className="flex-1 truncate">{list.name}</span>
                    <span className="text-xs text-ink-muted">{list.items.length}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <form onSubmit={createAndAdd} className="mt-2 flex gap-2 border-t border-line pt-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nueva lista"
              maxLength={150}
              aria-label="Nombre de la nueva lista"
              className="input py-2"
            />
            <button
              aria-label="Crear lista y guardar"
              disabled={pending || !newName.trim()}
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-fill text-white disabled:opacity-50"
            >
              <Plus className="size-4" />
            </button>
          </form>

          {error && <p className="px-2 pt-2 text-xs text-danger">{error}</p>}
        </div>
      )}
    </div>
  );
}
