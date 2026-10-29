import { CloudOff } from "lucide-react";

/** Aviso cuando el backend no responde (p. ej. en local sin `runserver`). */
export function ApiUnavailable({ message }: { message?: string }) {
  return (
    <div className="card flex items-start gap-4 border-dashed p-6">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
        <CloudOff className="size-5" />
      </span>
      <div>
        <p className="font-semibold">No hemos podido cargar esta sección</p>
        <p className="mt-1 text-sm text-ink-muted">
          {message ?? "El servidor no responde ahora mismo. Prueba de nuevo en unos minutos."}
        </p>
      </div>
    </div>
  );
}
