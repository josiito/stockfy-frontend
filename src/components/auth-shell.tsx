import { Hammer, ShieldCheck, Truck } from "lucide-react";

/** Marco de dos columnas para login y registro. */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="container-page grid min-h-[calc(100vh-12rem)] items-center gap-10 py-12 lg:grid-cols-2 lg:gap-20">
      <div
        className="relative hidden h-full min-h-[560px] flex-col justify-between overflow-hidden rounded-lg bg-brand-fill p-12 text-white lg:flex"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgb(255 255 255 / 0.04) 0 1px, transparent 1px 12px)",
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Stockfy</p>
        <div>
          <p className="max-w-md font-display text-4xl leading-tight">
            Piezas hechas a mano, pensadas para durar.
          </p>
          <ul className="mt-10 space-y-3 text-sm text-white/75">
            <li className="flex items-center gap-3"><Hammer className="size-4" strokeWidth={1.5} /> Fabricación artesanal propia</li>
            <li className="flex items-center gap-3"><Truck className="size-4" strokeWidth={1.5} /> Envío a toda la península</li>
            <li className="flex items-center gap-3"><ShieldCheck className="size-4" strokeWidth={1.5} /> Pago 100 % seguro</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-display text-4xl tracking-tight">{title}</h1>
        <p className="mt-2 text-ink-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
