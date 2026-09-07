import { Camera, Smartphone, Bell } from 'lucide-react';
import { SplitFeatureSection } from './SplitFeatureSection';
import { STOCK_IMAGES } from '@/lib/stock-images';

export function SecurityTechSection() {
  return (
    <SplitFeatureSection
      eyebrow="Security & Technology"
      title="Security systems built around real-time visibility."
      description="Residential and commercial security systems, HD cameras, and 24-hour monitoring designed to be simple to use and easy to trust — installed and serviced by a vetted technician network."
      image={STOCK_IMAGES.smartHomeLock}
      imageAlt="Smart home security lock controlled from a mobile app"
      points={[
        {
          icon: Camera,
          title: 'HD Cameras & CCTV',
          description: 'Real-time video so you can quickly identify visitors or service providers at your home or business.',
        },
        {
          icon: Smartphone,
          title: 'Smart Home Integration',
          description: 'Control alarms, locks, and cameras from your phone with systems designed for everyday use.',
        },
        {
          icon: Bell,
          title: 'Alarm Monitoring',
          description: 'Quality, user-friendly security systems at an affordable price for residences and businesses.',
        },
      ]}
      ctaHref="/services"
      ctaLabel="View Security Services"
    />
  );
}
