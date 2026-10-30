"use client";

import { useTransition } from "react";

/**
 * Botón para acciones destructivas (archivar, borrar, desactivar…): pide
 * confirmación antes de llamar a la Server Action.
 */
export function ConfirmForm({
  action,
  fields,
  confirm,
  className = "btn-ghost",
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  fields: Record<string, string | number>;
  confirm: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        if (!window.confirm(confirm)) return;
        startTransition(() => action(formData));
      }}
    >
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button className={className} disabled={pending}>
        {children}
      </button>
    </form>
  );
}
