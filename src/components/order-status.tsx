import type { OrderStatus } from "@/lib/types";

const TONES: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-accent-soft text-accent-strong",
  PAID: "bg-info-soft text-info-strong",
  PROCESSING: "bg-info-soft text-info-strong",
  SHIPPED: "bg-info-soft text-info-strong",
  DELIVERED: "bg-brand-soft text-brand-strong",
  CANCELLED: "bg-surface-muted text-ink-muted",
  REFUNDED: "bg-surface-muted text-ink-muted",
};

export function OrderStatusBadge({ status, label }: { status: OrderStatus; label: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${TONES[status]}`}>
      {label}
    </span>
  );
}
