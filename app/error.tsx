'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ivory">
      <Container size="narrow" className="text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-red-500" />
        <h1 className="mt-6 font-display text-2xl text-navy-950">Something went wrong</h1>
        <p className="mt-3 text-navy-600">
          We hit an unexpected error loading this page. Please try again, or contact us if the
          problem continues.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={reset}>Try Again</Button>
          <Button href="/contact" variant="outline">Contact Us</Button>
        </div>
      </Container>
    </div>
  );
}
