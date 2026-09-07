import { Sun, Plug, Gauge } from 'lucide-react';
import { SplitFeatureSection } from './SplitFeatureSection';
import { STOCK_IMAGES } from '@/lib/stock-images';

export function ElectricalSolarSection() {
  return (
    <SplitFeatureSection
      eyebrow="Electrical & Solar"
      title="Lower your energy costs with certified electrical & solar work."
      description="From panel upgrades to full solar installations, our technicians handle the electrical work behind every smart home and energy project — safely, and up to code."
      image={STOCK_IMAGES.solarField}
      imageAlt="Solar panel installation array in a large field"
      points={[
        {
          icon: Sun,
          title: 'Solar Panel Installation',
          description: 'Going solar has many potential benefits, including lowering your energy bills and reducing your carbon footprint.',
        },
        {
          icon: Plug,
          title: 'Electrical Work',
          description: 'Licensed technicians handle wiring, panel upgrades, and installation work tied to security and smart home systems.',
        },
        {
          icon: Gauge,
          title: 'Fire & Safety Systems',
          description: 'Fire alarm and medical alert system installation for added protection across your property.',
        },
      ]}
      ctaHref="/services"
      ctaLabel="View Electrical & Solar Services"
      reverse
      dark
    />
  );
}
