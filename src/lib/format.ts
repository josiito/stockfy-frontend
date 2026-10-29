const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export function formatPrice(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  return priceFormatter.format(Number(value));
}

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}
