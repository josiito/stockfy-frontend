"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

/** En móvil los filtros se pliegan para no tapar los productos; en escritorio siempre se ven. */
export function FiltersToggle({ active, children }: { active: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="btn-ghost w-full justify-between lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="size-4" /> Filtros
          {active > 0 && (
            <span className="rounded-full bg-brand-fill px-2 text-xs leading-5 text-white">{active}</span>
          )}
        </span>
        <ChevronDown className={`size-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`${open ? "mt-3 block" : "hidden"} lg:mt-0 lg:block`}>{children}</div>
    </>
  );
}
