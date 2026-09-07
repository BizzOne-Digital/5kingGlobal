import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Crown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-navy-950 text-white">
      <Container size="narrow" className="text-center">
        <Crown className="mx-auto h-10 w-10 text-gold-400" />
        <p className="mt-6 font-display text-6xl">404</p>
        <h1 className="mt-4 font-display text-2xl">This page isn&apos;t part of the estate.</h1>
        <p className="mt-3 text-white/70">
          The page you&apos;re looking for may have moved. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button href="/" variant="gold">Back to Home</Button>
          <Button href="/contact" variant="outline" className="border-white/30 text-white hover:bg-white/10">
            Contact Us
          </Button>
        </div>
      </Container>
    </div>
  );
}
