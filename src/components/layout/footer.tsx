import Link from "next/link";

export default function Footer({ name }: { name: string }) {
  const brand = name.split(" ")[0]?.toUpperCase() || "SAJANI";
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <Link href="#home" className="font-display text-xl tracking-[0.18em]">
          {brand}
        </Link>
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
