import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { OneStopShop } from '@/components/home/OneStopShop';
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { CustomerPathways } from '@/components/home/CustomerPathways';
import { SecurityTechSection } from '@/components/home/SecurityTechSection';
import { ElectricalSolarSection } from '@/components/home/ElectricalSolarSection';
import { TradeNetworkSection } from '@/components/home/TradeNetworkSection';
import { RecruitingSection } from '@/components/home/RecruitingSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FinalCta } from '@/components/home/FinalCta';
import { getFeaturedServices, getActiveServices } from '@/lib/data/services';
import { getActiveTestimonials } from '@/lib/data/testimonials';
import { getSiteSettings } from '@/lib/data/settings';

export const metadata: Metadata = {
  title: 'Home',
  alternates: { canonical: '/' },
};

export const revalidate = 60;

export default async function HomePage() {
  const [featured, settings, testimonials] = await Promise.all([
    getFeaturedServices(6),
    getSiteSettings(),
    getActiveTestimonials(true),
  ]);

  const services = featured.length > 0 ? featured : await getActiveServices();

  return (
    <>
      <Hero serviceAreas={settings.serviceAreas} />
      <OneStopShop />
      <ServicesGrid services={services} />
      <CustomerPathways />
      <SecurityTechSection />
      <ElectricalSolarSection />
      <TradeNetworkSection />
      <RecruitingSection />
      <TestimonialsSection testimonials={testimonials} />
      <FinalCta phone={settings.phone} />
    </>
  );
}
