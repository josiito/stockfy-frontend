export function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="status" className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand">
      {message}
    </p>
  );
}
