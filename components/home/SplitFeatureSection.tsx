import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils/cn';

interface Point {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function SplitFeatureSection({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  points,
  ctaHref,
  ctaLabel,
  reverse = false,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  points: Point[];
  ctaHref: string;
  ctaLabel: string;
  reverse?: boolean;
  dark?: boolean;
}) {
  return (
    <section className={cn('py-24', dark ? 'bg-navy-950' : 'bg-white')}>
      <Container>
        <div
          className={cn(
            'grid grid-cols-1 items-center gap-14 lg:grid-cols-2',
            reverse && 'lg:[&>*:first-child]:order-2'
          )}
        >
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md shadow-premium">
              <Image src={image} alt={imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">{eyebrow}</p>
            <h2 className={cn('mt-3 font-display text-3xl sm:text-4xl', dark ? 'text-white' : 'text-navy-950')}>
              {title}
            </h2>
            <p className={cn('mt-4 leading-relaxed', dark ? 'text-white/70' : 'text-navy-600')}>
              {description}
            </p>

            <ul className="mt-8 space-y-5">
              {points.map((point) => (
                <li key={point.title} className="flex gap-4">
                  <span
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-sm',
                      dark ? 'bg-white/10' : 'bg-navy-50'
                    )}
                  >
                    <point.icon className={cn('h-5 w-5', dark ? 'text-gold-300' : 'text-navy-800')} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className={cn('font-semibold', dark ? 'text-white' : 'text-navy-950')}>{point.title}</p>
                    <p className={cn('mt-0.5 text-sm', dark ? 'text-white/60' : 'text-navy-600')}>
                      {point.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href={ctaHref}
              className={cn(
                'mt-9 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide',
                dark ? 'text-gold-300 hover:text-gold-200' : 'text-navy-900 hover:text-gold-600'
              )}
            >
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
