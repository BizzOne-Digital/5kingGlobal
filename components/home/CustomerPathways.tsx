import { ArrowRight, Home, Users } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

export function CustomerPathways() {
  return (
    <section className="bg-navy-50/60 py-24">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col justify-between rounded-md bg-navy-950 p-10 text-white shadow-premium">
              <div>
                <Home className="h-9 w-9 text-gold-300" strokeWidth={1.5} />
                <h3 className="mt-6 font-display text-2xl">Need a service?</h3>
                <p className="mt-4 text-white/70">
                  From a security system install to solar, electrical, or a full handyman punch
                  list — tell us what you need and we&apos;ll match you with the right team.
                </p>
              </div>
              <Button href="/booking" variant="gold" className="mt-8 w-fit">
                Book a Service <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-full flex-col justify-between rounded-md border border-navy-900/10 bg-white p-10 shadow-card">
              <div>
                <Users className="h-9 w-9 text-navy-800" strokeWidth={1.5} />
                <h3 className="mt-6 font-display text-2xl text-navy-950">
                  Looking for recruiting, training, or job opportunities?
                </h3>
                <p className="mt-4 text-navy-600">
                  5Kings Global is a growing workforce development company. Explore openings
                  across our security, trades, and sales teams and find out where you fit.
                </p>
              </div>
              <Button href="/about#careers" variant="outline" className="mt-8 w-fit">
                Explore Opportunities <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
