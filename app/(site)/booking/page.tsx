import type { Metadata } from 'next';
import { Phone, Mail } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BookingForm } from '@/components/booking/BookingForm';
import { getActiveServices } from '@/lib/data/services';
import { getSiteSettings } from '@/lib/data/settings';

export const metadata: Metadata = {
  title: 'Book a Service',
  description: 'Request a quote or book a service appointment with 5Kings Global.',
  alternates: { canonical: '/booking' },
};

export const revalidate = 60;

export default async function BookingPage() {
  const [services, settings] = await Promise.all([getActiveServices(), getSiteSettings()]);

  return (
    <div className="py-20">
      <Container size="narrow">
        <SectionHeading
          eyebrow="Book a Service"
          title="Request your quote"
          description="Tell us about your project and preferred timing. Our team will follow up to confirm details — bookings are reviewed and confirmed by our office, not automatically."
        />

        <div className="mt-10 rounded-md border border-navy-900/10 bg-white p-8 shadow-card sm:p-10">
          <BookingForm services={services} />
        </div>

        <div className="mt-10 flex flex-col gap-3 text-sm text-navy-600 sm:flex-row sm:items-center sm:gap-8">
          <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 hover:text-navy-950">
            <Phone className="h-4 w-4 text-gold-600" /> {settings.phone}
          </a>
          <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-navy-950">
            <Mail className="h-4 w-4 text-gold-600" /> {settings.email}
          </a>
        </div>
      </Container>
    </div>
  );
}
