import type { Metadata } from 'next';
import Image from 'next/image';
import { ShieldCheck, Users, MapPin, GraduationCap, Briefcase, TrendingUp } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { STOCK_IMAGES } from '@/lib/stock-images';
import { getSiteSettings } from '@/lib/data/settings';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    '5Kings Global is a family-owned business providing security, smart home, electrical, solar, and skilled trade services, plus workforce recruiting and training.',
  alternates: { canonical: '/about' },
};

export const revalidate = 300;

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="pb-24">
      <section className="bg-navy-gradient py-24 text-white">
        <Container>
          <SectionHeading
            eyebrow="About 5Kings Global"
            title="Our family protects your family."
            description="As a family-owned and operated business, 5Kings Global has a personal interest in protecting families and businesses throughout the communities we serve."
            light
          />
        </Container>
      </section>

      <Container className="mt-16">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md shadow-premium">
              <Image src={STOCK_IMAGES.technicianPortrait} alt="5Kings Global technician" fill className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">Our Story</p>
            <h2 className="mt-3 font-display text-3xl text-navy-950">
              One company, built to be a single point of trust.
            </h2>
            <p className="mt-4 leading-relaxed text-navy-700">
              5Kings Global (operating in the field as 5 Kings Concierge) started with a simple
              idea: homeowners and businesses shouldn&apos;t need a different vendor for every
              problem. Today, that means residential and commercial security systems, HD cameras
              and CCTV, solar panel installation, medical alert systems, fire alarms, and a full
              handyman network — coordinated through one company.
            </p>
            <p className="mt-4 leading-relaxed text-navy-700">
              Alongside our technical services, 5Kings Global operates a growing sales force and
              workforce development division — recruiting, training, and placing people into
              careers across our technician and sales teams.
            </p>
            <div className="mt-8 flex items-center gap-3 text-navy-800">
              <MapPin className="h-5 w-5 text-gold-600" />
              <span className="text-sm font-medium">
                Serving {settings.serviceAreas.join(', ')}
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'White Glove Standard', description: 'Every job — technical or trade — is handled to the same premium standard of care.' },
            { icon: Users, title: 'One Point of Contact', description: 'A single company coordinating security, trades, and technology so you don’t have to.' },
            { icon: MapPin, title: 'Regional Reach', description: `Active across ${settings.serviceAreas.length} states and growing.` },
          ].map((item) => (
            <div key={item.title} className="rounded-md border border-navy-900/10 bg-white p-8 shadow-card">
              <item.icon className="h-8 w-8 text-navy-800" strokeWidth={1.5} />
              <h3 className="mt-5 font-display text-lg text-navy-950">{item.title}</h3>
              <p className="mt-2 text-sm text-navy-600">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>

      <section id="careers" className="mt-24 bg-navy-950 py-24 text-white">
        <Container>
          <SectionHeading
            eyebrow="Careers & Workforce Development"
            title="Join our team."
            description="As a trusted brand in home and commercial security, 5Kings Global places the same trust in our team members. We're proud to offer a diverse range of fulfilling roles within the United States."
            light
          />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: GraduationCap, title: 'Training', description: 'Hands-on training across security, electrical, and skilled trade disciplines.' },
              { icon: Briefcase, title: 'Recruiting & Hiring', description: 'Open roles across technical, field service, and sales teams.' },
              { icon: TrendingUp, title: 'Job Placement', description: 'A dedicated team focused on developing individuals into long-term careers.' },
            ].map((program) => (
              <div key={program.title} className="rounded-md border border-white/10 bg-white/5 p-8">
                <program.icon className="h-8 w-8 text-gold-300" strokeWidth={1.5} />
                <h3 className="mt-5 font-display text-xl">{program.title}</h3>
                <p className="mt-2 text-sm text-white/60">{program.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button href="/contact?subject=careers" variant="gold" size="lg">
              Submit Your Information
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
