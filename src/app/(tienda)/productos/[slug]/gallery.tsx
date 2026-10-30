"use client";

import Image from "next/image";
import { useState } from "react";

import { ImagePlaceholder } from "@/components/image-placeholder";
import type { ProductImage } from "@/lib/types";

export function Gallery({ images, name, seed }: { images: ProductImage[]; name: string; seed: number }) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-surface-muted">
        {current ? (
          <Image src={current.url} alt={current.alt_text || name} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        ) : (
          <ImagePlaceholder seed={seed} />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={`relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                i === index ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
