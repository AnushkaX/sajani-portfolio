import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div className={cn(align === 'left' ? 'reveal-on-scroll mb-12 max-w-measure text-left' : 'reveal-on-scroll mx-auto mb-20 max-w-measure text-center', className)}>
      <div className="stagger-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-5 break-words text-[clamp(2.35rem,7vw,4.75rem)] leading-[0.95] text-foreground">{title}</h2>
        {description ? <p className="mt-6 text-base leading-relaxed tracking-wide text-muted-foreground md:text-lg">{description}</p> : null}
      </div>
    </div>
  );
}
