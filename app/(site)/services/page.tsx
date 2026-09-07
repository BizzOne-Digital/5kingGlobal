import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Camera, Sun, Wrench, Zap, HeartPulse, Home } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { EmptyState } from '@/components/ui/EmptyState';
import { getActiveServices } from '@/lib/data/services';
import { getSiteSettings } from '@/lib/data/settings';
import type { IService } from '@/models/Service';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore 5Kings Global service categories: security & CCTV, smart home, electrical, solar, handyman & trades, and workforce solutions.',
  alternates: { canonical: '/services' },
};

export const revalidate = 60;

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

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getActiveServices(), getSiteSettings()]);

  const grouped = services.reduce<Record<string, IService[]>>((acc, service) => {
    acc[service.category] = acc[service.category] || [];
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <div className="pb-24">
      <section className="bg-navy-gradient py-24 text-white">
        <Container>
          <SectionHeading
            eyebrow="Our Services"
            title="Every solution, one company."
            description={`Security, smart home, electrical, solar, and skilled trades — coordinated for homeowners and businesses across ${settings.serviceAreas.join(', ')}.`}
            light
          />
        </Container>
      </section>

      <Container className="mt-16">
        {services.length === 0 ? (
          <EmptyState
            title="Services are being updated"
            description="Our team is refreshing this page. Please check back soon or contact us directly."
          />
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-16 last:mb-0">
              <h2 className="font-display text-2xl text-navy-950">{category}</h2>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((service, index) => {
                  const Icon = iconFor(service);
                  return (
                    <Reveal key={service.slug} delay={index * 50}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="group flex h-full flex-col rounded-md border border-navy-900/10 bg-white p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-premium"
                      >
                        <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-navy-50 transition-colors group-hover:bg-gold-gradient">
                          <Icon className="h-6 w-6 text-navy-800" strokeWidth={1.5} />
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
            </div>
          ))
        )}
      </Container>
    </div>
  );
}
