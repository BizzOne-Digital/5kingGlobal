import { ArrowRight, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function FinalCta({ phone }: { phone: string }) {
  return (
    <section className="bg-gold-gradient py-16">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="font-display text-2xl text-navy-950 sm:text-3xl">
              Ready for the white glove treatment?
            </h2>
            <p className="mt-2 text-navy-800/80">
              Request a quote today or call our office to speak with our team.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={`tel:${phone.replace(/[^0-9+]/g, '')}`} variant="outline" className="border-navy-900/30 text-navy-950 hover:bg-navy-900/5">
              <Phone className="h-4 w-4" /> {phone}
            </Button>
            <Button href="/booking" variant="primary">
              Request a Quote <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
