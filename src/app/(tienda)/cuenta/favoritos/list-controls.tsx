"use client";

import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  createWishlist,
  deleteWishlist,
  removeFromWishlist,
  renameWishlist,
} from "@/app/actions/wishlist";
import type { Wishlist } from "@/lib/types";

export function NewListForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setError(undefined);
    startTransition(async () => {
      const result = await createWishlist(name.trim());
      if (result.error || !result.data) return setError(result.error);
      setName("");
      router.push(`/cuenta/favoritos?lista=${result.data.id}`);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nueva lista"
          maxLength={150}
          aria-label="Nombre de la nueva lista"
          className="input py-2"
        />
        <button
          aria-label="Crear lista"
          disabled={pending || !name.trim()}
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-fill text-white disabled:opacity-50"
        >
          <Plus className="size-4" />
        </button>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </form>
  );
}

export function ListHeader({ list }: { list: Wishlist }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [name, setName] = useState(list.name);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function rename(event: React.FormEvent) {
    event.preventDefault();
    setError(undefined);
    startTransition(async () => {
      const result = await renameWishlist(list.id, name.trim());
      if (result.error) return setError(result.error);
      setEditing(false);
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await deleteWishlist(list.id);
      if (result.error) return setError(result.error);
      router.push("/cuenta/favoritos");
    });
  }

  return (
    <div className="mb-6">
      {editing ? (
        <form onSubmit={rename} className="flex items-center gap-2">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={150}
            aria-label="Nombre de la lista"
            className="input max-w-sm font-display text-xl font-medium"
          />
          <button aria-label="Guardar nombre" disabled={pending || !name.trim()} className="grid size-10 place-items-center rounded-xl bg-brand-fill text-white disabled:opacity-50">
            <Check className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Cancelar"
            onClick={() => {
              setEditing(false);
              setName(list.name);
              setError(undefined);
            }}
            className="grid size-10 place-items-center rounded-xl border border-line"
          >
            <X className="size-4" />
          </button>
        </form>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl font-medium">{list.name}</h2>
          {list.is_default && (
            <span className="rounded-full bg-info-soft px-2.5 py-1 text-xs font-semibold text-info-strong">Por defecto</span>
          )}
          <div className="ml-auto flex gap-1">
            <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-ink-muted hover:bg-surface-muted hover:text-ink">
              <Pencil className="size-4" /> Renombrar
            </button>
            {!list.is_default && (
              <button type="button" onClick={() => setConfirming(true)} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-ink-muted hover:bg-surface-muted hover:text-danger">
                <Trash2 className="size-4" /> Borrar lista
              </button>
            )}
          </div>
        </div>
      )}
      {confirming && (
        <div role="alert" className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-danger/10 p-4 text-sm">
          <p className="flex-1">
            ¿Borrar la lista <strong>{list.name}</strong>? Los productos seguirán en el catálogo.
          </p>
          <button type="button" onClick={() => setConfirming(false)} className="btn-ghost py-2">
            Cancelar
          </button>
          <button type="button" onClick={remove} disabled={pending} className="btn bg-danger py-2 text-white hover:brightness-110">
            {pending ? "Borrando…" : "Borrar"}
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}

export function RemoveItemButton({ listId, itemId }: { listId: number; itemId: number }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-label="Quitar de la lista"
      disabled={pending}
      onClick={() => startTransition(async () => void (await removeFromWishlist(listId, itemId)))}
      className="grid size-8 place-items-center rounded-full text-ink-muted hover:bg-surface-muted hover:text-danger disabled:opacity-50"
    >
      <X className="size-4" />
    </button>
  );
}
