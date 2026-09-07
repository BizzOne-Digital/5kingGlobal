import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/seo/JsonLd';
import { getServiceBySlug, getActiveServices } from '@/lib/data/services';
import { getSiteSettings } from '@/lib/data/settings';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getActiveServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.shortDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: service.image ? { images: [service.image] } : undefined,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([getServiceBySlug(slug), getSiteSettings()]);
  if (!service) notFound();

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.title,
    name: service.title,
    description: service.seoDescription || service.shortDescription,
    category: service.category,
    image: service.image || undefined,
    areaServed: settings.serviceAreas,
    provider: {
      '@type': 'HomeAndConstructionBusiness',
      name: settings.businessName,
      telephone: settings.phone,
      email: settings.email,
      url: siteUrl,
    },
    url: `${siteUrl}/services/${service.slug}`,
  };

  return (
    <div className="pb-24">
      <JsonLd data={serviceJsonLd} />
      <section className="relative overflow-hidden bg-navy-gradient py-20 text-white">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            {service.category}
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl sm:text-5xl">{service.title}</h1>
          <p className="mt-5 max-w-2xl text-white/75">{service.shortDescription}</p>
          <Button href="/booking" variant="gold" size="lg" className="mt-8">
            Book This Service
          </Button>
        </Container>
      </section>

      <Container className="mt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {service.image && (
              <div className="relative mb-10 aspect-video overflow-hidden rounded-md shadow-card">
                <Image src={service.image} alt={service.title} fill className="object-cover" />
              </div>
            )}
            <div className="prose prose-navy max-w-none prose-headings:font-display">
              <p className="whitespace-pre-line text-navy-700">{service.description}</p>
            </div>
          </div>

          <aside>
            {service.features.length > 0 && (
              <div className="rounded-md border border-navy-900/10 bg-navy-50/50 p-8">
                <h2 className="font-display text-lg text-navy-950">What&apos;s Included</h2>
                <ul className="mt-5 space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-navy-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button href="/booking" variant="primary" className="mt-8 w-full">
                  Request a Quote
                </Button>
              </div>
            )}
          </aside>
        </div>
      </Container>
    </div>
  );
}
