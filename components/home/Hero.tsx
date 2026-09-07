import Image from 'next/image';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { STOCK_IMAGES } from '@/lib/stock-images';

export function Hero({ serviceAreas }: { serviceAreas: string[] }) {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy-950">
      <Image
        src={STOCK_IMAGES.heroHome}
        alt="Modern home protected by 5Kings Global security and smart home systems"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/30 to-transparent" />

      <Container className="relative z-10 pt-24">
        <div className="max-w-3xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300 backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" />
            One Company. Multiple Solutions.
          </span>
          <h1 className="font-display text-5xl leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            White glove <span className="text-gold-300">treatment.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            5Kings Global delivers security, smart home, electrical, solar, and skilled trade
            services for homes and businesses — backed by a nationwide network of vetted
            technicians and a workforce built to grow with you.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="/booking" variant="gold" size="lg">
              Book a Service <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href="/services"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Explore Services
            </Button>
          </div>
          <p className="mt-10 text-sm uppercase tracking-[0.2em] text-white/50">
            Serving homes &amp; businesses in {serviceAreas.join(' · ')}
          </p>
        </div>
      </Container>
    </section>
  );
}
