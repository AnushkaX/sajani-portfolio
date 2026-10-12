export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
}) {
  return (
    <div className={align === 'left' ? 'reveal-on-scroll mb-8 max-w-xl text-left' : 'reveal-on-scroll mx-auto mb-14 max-w-2xl text-center'}>
      <p className="text-xs uppercase tracking-[0.35em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-4xl tracking-wide text-foreground sm:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p> : null}
    </div>
  );
}
