type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Clave estable para formularios de filtros. Next conserva montadas las
 * páginas ya visitadas y los campos con defaultValue no se actualizan al
 * cambiar la URL; con key={paramsKey(params)} el formulario se vuelve a
 * crear con los valores de la URL nueva.
 */
export function paramsKey(params: SearchParams) {
  return Object.entries(params)
    .filter(([key]) => key !== "page")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(",") : (value ?? "")}`)
    .join("&");
}
