import Link from 'next/link';

export default function CollectionNotFound() {
  return (
    <main id="content" className="flex min-h-screen flex-col items-start justify-center px-6 md:px-16">
      <p className="eyebrow">Collections</p>
      <h1 className="mt-6 max-w-4xl break-words text-[clamp(2.2rem,7vw,4.5rem)] leading-[0.95]">This collection is unavailable.</h1>
      <Link
        href="/#portfolio"
        className="mt-10 inline-flex items-center gap-4 font-sans text-[0.7rem] uppercase tracking-[0.32em]"
      >
        Back to collections
        <span aria-hidden="true" className="block h-px w-8 bg-foreground" />
      </Link>
    </main>
  );
}
