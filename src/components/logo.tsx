import Link from "next/link";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Stockfy, inicio">
      <span
        className={`grid size-9 place-items-center rounded-md font-display text-lg font-semibold ${
          inverted ? "bg-white text-brand-fill" : "bg-brand-fill text-white"
        }`}
      >
        S
      </span>
      <span className={`font-display text-xl font-semibold tracking-tight ${inverted ? "text-white" : ""}`}>
        Stockfy
      </span>
    </Link>
  );
}
