import { ShieldCheck, Home, Zap, Sun, Wrench, Users } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

const PILLARS = [
  { icon: ShieldCheck, label: 'Security & CCTV' },
  { icon: Home, label: 'Smart Home' },
  { icon: Zap, label: 'Electrical' },
  { icon: Sun, label: 'Solar' },
  { icon: Wrench, label: 'Skilled Trades' },
  { icon: Users, label: 'Workforce Solutions' },
];

export function OneStopShop() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="Why 5Kings Global"
          title="One company. Multiple solutions."
          description="Most providers make you juggle a different vendor for every problem. 5Kings Global connects you to a single, trusted network across technology, security, skilled trades, and workforce development — so every job gets handled with the same white glove standard."
          align="center"
          className="mx-auto"
        />

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-navy-900/10 sm:grid-cols-3 lg:grid-cols-6">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.label} delay={index * 80}>
              <div className="flex h-full flex-col items-center justify-center gap-3 bg-white px-4 py-10 text-center transition-colors hover:bg-navy-50">
                <pillar.icon className="h-7 w-7 text-navy-800" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-navy-900">{pillar.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
