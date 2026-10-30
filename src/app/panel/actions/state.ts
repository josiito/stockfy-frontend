export type ActionState = { error?: string; ok?: string } | undefined;

export function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export const field = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();

export const idField = (formData: FormData, name: string) => {
  const id = Number(formData.get(name));
  if (!Number.isInteger(id) || id <= 0) throw new Error("Falta el identificador.");
  return id;
};

/** "Cabecero de Ratán 150" → "cabecero-de-ratan-150" */
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
