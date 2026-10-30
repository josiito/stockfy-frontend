import type { ProductStatus, Role, VariantStatus } from "@/lib/types";

const TONES = {
  green: "bg-brand-soft text-brand",
  orange: "bg-accent-soft text-accent",
  blue: "bg-info-soft text-info",
  grey: "bg-surface-muted text-ink-muted",
  red: "bg-danger/10 text-danger",
};

type Tone = keyof typeof TONES;

export function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]}`}>
      {children}
    </span>
  );
}

export const PRODUCT_STATUS: Record<ProductStatus, { label: string; tone: Tone }> = {
  ACTIVE: { label: "Activo", tone: "green" },
  DRAFT: { label: "Borrador", tone: "orange" },
  HIDDEN: { label: "Oculto", tone: "grey" },
  ARCHIVED: { label: "Archivado", tone: "red" },
};

export const VARIANT_STATUS: Record<VariantStatus, { label: string; tone: Tone }> = {
  ACTIVE: { label: "Activa", tone: "green" },
  HIDDEN: { label: "Oculta", tone: "grey" },
  DISCONTINUED: { label: "Descatalogada", tone: "red" },
};

export const ROLE_TONES: Record<Role, Tone> = {
  ADMIN: "red",
  EMPLOYEE: "blue",
  CUSTOMER: "grey",
};

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <Badge tone="red">Sin stock</Badge>;
  if (stock <= 3) return <Badge tone="orange">{stock} uds.</Badge>;
  return <Badge tone="green">{stock} uds.</Badge>;
}
