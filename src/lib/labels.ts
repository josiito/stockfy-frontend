import type { MovementType } from "./types";

export const MOVEMENT_LABELS: Record<MovementType, string> = {
  STOCK_IN: "Entrada",
  SALE_STORE: "Venta en tienda",
  SALE_ONLINE: "Venta online",
  RETURN: "Devolución",
  DAMAGED: "Dañado",
  CORRECTION: "Corrección",
};

/** Movimientos que restan stock: la cantidad se envía en negativo. */
export const NEGATIVE_MOVEMENTS: MovementType[] = ["SALE_STORE", "DAMAGED"];
