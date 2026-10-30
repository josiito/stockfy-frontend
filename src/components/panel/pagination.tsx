import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const PAGE_SIZE = 20; // PAGE_SIZE de DRF en el backend.

type Params = Record<string, string | string[] | undefined>;

export function hrefWith(base: string, params: Params, changes: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...params, ...changes })) {
    const v = Array.isArray(value) ? value[0] : value;
    if (v) search.set(key, v);
  }
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

export function Pagination({
  base,
  params,
  page,
  count,
}: {
  base: string;
  params: Params;
  page: number;
  count: number;
}) {
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  if (pages <= 1) return null;

  return (
    <nav className="mt-6 flex items-center justify-center gap-3" aria-label="Paginación">
      {page > 1 && (
        <Link href={hrefWith(base, params, { page: String(page - 1) })} className="btn-ghost">
          <ChevronLeft className="size-4" /> Anterior
        </Link>
      )}
      <span className="text-sm text-ink-muted">Página {page} de {pages}</span>
      {page < pages && (
        <Link href={hrefWith(base, params, { page: String(page + 1) })} className="btn-ghost">
          Siguiente <ChevronRight className="size-4" />
        </Link>
      )}
    </nav>
  );
}
