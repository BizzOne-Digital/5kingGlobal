import { Hammer, PaintRoller, Wrench } from 'lucide-react';
import { SplitFeatureSection } from './SplitFeatureSection';
import { STOCK_IMAGES } from '@/lib/stock-images';

export function TradeNetworkSection() {
  return (
    <SplitFeatureSection
      eyebrow="Handyman & Trade Network"
      title="A nationwide network of experienced trade professionals."
      description="Our handyman and skilled trade network handles the work that keeps a home or business running — coordinated through 5Kings Global so you only have to make one call."
      image={STOCK_IMAGES.electricianAtPanel}
      imageAlt="Skilled tradesman performing electrical repair work"
      points={[
        {
          icon: Wrench,
          title: 'Repairs & Installation',
          description: 'Highly experienced repair work for any part of your home, from TV mounting to construction.',
        },
        {
          icon: PaintRoller,
          title: 'Painting & Finishing',
          description: 'Interior and exterior painting alongside pressure washing and carpet cleaning services.',
        },
        {
          icon: Hammer,
          title: 'HVAC, Roofing & Plumbing',
          description: 'Coordinated trade professionals for roofing, HVAC, and plumbing work, residential or commercial.',
        },
      ]}
      ctaHref="/services"
      ctaLabel="View Handyman Services"
    />
  );
}
