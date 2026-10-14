import Link from "next/link";

export default function Footer({ name }: { name: string }) {
  const brand = name.split(" ")[0]?.toUpperCase() || "SAJANI";
  return (
    <footer className="border-t border-foreground/10">
      <div className="container flex flex-col items-center justify-between gap-6 py-12 md:flex-row">
        <Link href="/" className="font-display text-lg tracking-[0.28em]">
          {brand}
        </Link>
        <p className="text-center text-xs uppercase tracking-[0.22em] text-muted-foreground">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
