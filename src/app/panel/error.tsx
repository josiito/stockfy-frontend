"use client";

import { AlertTriangle } from "lucide-react";

export default function PanelError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="card mx-auto mt-10 max-w-lg p-8 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-danger/10 text-danger">
        <AlertTriangle className="size-6" />
      </span>
      <h1 className="mt-4 font-display text-xl font-medium">No se ha podido completar la acción</h1>
      <p className="mt-2 text-sm text-ink-muted">{error.message}</p>
      <button onClick={reset} className="btn-primary mt-6">Volver a intentarlo</button>
    </div>
  );
}
