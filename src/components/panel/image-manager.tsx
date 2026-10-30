"use client";

import { Star, Trash2, Upload } from "lucide-react";
import { useActionState } from "react";

import { deleteImage, setPrimaryImage, uploadImage } from "@/app/panel/actions/products";
import { FormError } from "@/components/form-error";
import type { AdminImage } from "@/lib/types";

import { ConfirmForm } from "./confirm-form";
import { FormSuccess } from "./form-success";
import { Badge } from "./status-badge";

export function ImageManager({ productId, images }: { productId: number; images: AdminImage[] }) {
  const [state, action, pending] = useActionState(uploadImage, undefined);

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {images.map((image) => (
            <li key={image.id} className="card overflow-hidden">
              <div className="relative aspect-square bg-surface-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt={image.alt_text} className="size-full object-cover" />
                {image.is_primary && (
                  <span className="absolute left-3 top-3"><Badge tone="green">Principal</Badge></span>
                )}
              </div>
              <div className="flex items-center gap-2 p-3">
                <p className="min-w-0 flex-1 truncate text-xs text-ink-muted">{image.alt_text || "Sin texto alternativo"}</p>
                {!image.is_primary && (
                  <form action={setPrimaryImage}>
                    <input type="hidden" name="product_id" value={productId} />
                    <input type="hidden" name="image_id" value={image.id} />
                    <button className="grid size-8 place-items-center rounded-full text-ink-muted transition hover:bg-surface-muted hover:text-brand" title="Marcar como principal" aria-label="Marcar como principal">
                      <Star className="size-4" />
                    </button>
                  </form>
                )}
                <ConfirmForm
                  action={deleteImage}
                  fields={{ product_id: productId, image_id: image.id }}
                  confirm="¿Eliminar esta imagen? También se borrará del almacenamiento."
                  className="grid size-8 place-items-center rounded-full text-ink-muted transition hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="size-4" aria-label="Eliminar imagen" />
                </ConfirmForm>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form action={action} className="card space-y-4 p-5">
        <input type="hidden" name="product_id" value={productId} />
        <p className="flex items-center gap-2 font-semibold">
          <Upload className="size-4 text-brand" /> Subir imagen
        </p>
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_100px]">
          <input name="file" type="file" accept="image/jpeg,image/png,image/webp" required className="input file:mr-3 file:rounded-full file:border-0 file:bg-brand-soft file:px-3 file:py-1 file:text-sm file:font-semibold file:text-brand" aria-label="Imagen" />
          <input name="alt_text" maxLength={255} placeholder="Texto alternativo (accesibilidad)" className="input" aria-label="Texto alternativo" />
          <input name="position" type="number" min={0} defaultValue={images.length} className="input" aria-label="Posición" title="Posición en la galería" />
        </div>
        <label className="flex items-center gap-2.5 text-sm">
          <input type="checkbox" name="is_primary" defaultChecked={images.length === 0} className="size-4 accent-[var(--brand)]" />
          Usar como imagen principal
        </label>
        <p className="text-xs text-ink-muted">JPG, PNG o WEBP de hasta 10 MB.</p>
        <FormError message={state?.error} />
        <FormSuccess message={state?.ok} />
        <div className="flex justify-end">
          <button className="btn-primary" disabled={pending}>{pending ? "Subiendo…" : "Subir"}</button>
        </div>
      </form>
    </div>
  );
}
