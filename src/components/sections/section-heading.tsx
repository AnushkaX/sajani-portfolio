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
    <div className={align === 'left' ? 'reveal-on-scroll mb-12 max-w-measure text-left' : 'reveal-on-scroll mx-auto mb-20 max-w-measure text-center'}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-5 text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">{title}</h2>
      {description ? <p className="mt-6 text-base leading-relaxed tracking-wide text-muted-foreground md:text-lg">{description}</p> : null}
    </div>
  );
}
