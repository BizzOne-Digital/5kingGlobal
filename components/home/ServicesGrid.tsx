import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Camera, Sun, Wrench, Zap, HeartPulse, Home } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import type { IService } from '@/models/Service';

const ICONS: Record<string, typeof ShieldCheck> = {
  security: ShieldCheck,
  cctv: Camera,
  cameras: Camera,
  solar: Sun,
  handyman: Wrench,
  electrical: Zap,
  medical: HeartPulse,
  'smart home': Home,
};

function iconFor(service: IService) {
  const key = service.icon?.toLowerCase() || service.category?.toLowerCase() || '';
  return ICONS[key] || ShieldCheck;
}

export function ServicesGrid({ services }: { services: IService[] }) {
  if (services.length === 0) return null;

  return (
    <section className="bg-navy-50/60 py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="What We Do"
            title="Services across every major home & business need"
            description="Explore our core service categories — each backed by vetted technicians and a single point of coordination."
          />
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-600"
          >
            View all services <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = iconFor(service);
            return (
              <Reveal key={service._id.toString()} delay={index * 60}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-md border border-navy-900/10 bg-white p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-premium"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-navy-50 transition-colors group-hover:bg-gold-gradient">
                    <Icon className="h-6 w-6 text-navy-800 transition-colors group-hover:text-navy-950" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-6 font-display text-xl text-navy-950">{service.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">
                    {service.shortDescription}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 group-hover:text-gold-600">
                    Learn more <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
