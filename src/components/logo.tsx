import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Stockfy, inicio">
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl bg-brand-fill">
        <span className="absolute -bottom-2 -right-2 size-6 rounded-full bg-accent-fill transition-transform group-hover:scale-125" />
        <span className="absolute -left-2 -top-2 size-5 rounded-full bg-info-fill" />
        <span className="relative font-display text-lg font-extrabold text-white">S</span>
      </span>
      <span className="font-display text-xl font-bold tracking-tight">stockfy</span>
    </Link>
  );
}
