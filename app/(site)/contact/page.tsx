import type { Metadata } from 'next';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ContactForm } from '@/components/contact/ContactForm';
import { getSiteSettings } from '@/lib/data/settings';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact 5Kings Global for security, smart home, electrical, solar, and trade services, or career opportunities.',
  alternates: { canonical: '/contact' },
};

export const revalidate = 60;

const SUBJECT_PRESETS: Record<string, string> = {
  careers: 'Careers & Recruiting Inquiry',
  order: 'Product Order Inquiry',
};

interface Props {
  searchParams: Promise<{ subject?: string }>;
}

export default async function ContactPage({ searchParams }: Props) {
  const [settings, { subject }] = await Promise.all([getSiteSettings(), searchParams]);
  const defaultSubject = subject ? SUBJECT_PRESETS[subject] || subject : '';

  return (
    <div className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          title="Get in touch with us"
          description="Contact us with any questions or to request an appointment. For immediate needs, call our office directly."
        />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-md border border-navy-900/10 bg-white p-8 shadow-card sm:p-10">
            <ContactForm defaultSubject={defaultSubject} />
          </div>

          <aside className="space-y-6">
            <div className="rounded-md border border-navy-900/10 bg-navy-50/50 p-8">
              <h3 className="font-display text-lg text-navy-950">{settings.businessName}</h3>
              <ul className="mt-5 space-y-4 text-sm text-navy-700">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-navy-950">
                    {settings.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <a href={`mailto:${settings.email}`} className="hover:text-navy-950">
                    {settings.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <span>Serving {settings.serviceAreas.join(', ')}</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
