import { ShieldX } from "lucide-react";
import Link from "next/link";

export function AccessDenied({ message }: { message?: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="card max-w-md p-10 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-danger/10 text-danger">
          <ShieldX className="size-7" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-medium">Acceso restringido</h1>
        <p className="mt-2 text-ink-muted">
          {message ?? "El panel de gestión solo está disponible para administradores y empleados de la tienda."}
        </p>
        <Link href="/" className="btn-primary mt-8">Volver a la tienda</Link>
      </div>
    </div>
  );
}
