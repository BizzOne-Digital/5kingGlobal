import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ServicesLoading() {
  return (
    <div className="pb-24">
      <div className="bg-navy-950 py-24">
        <Container>
          <Skeleton className="h-10 w-72 bg-white/10" />
          <Skeleton className="mt-4 h-5 w-full max-w-xl bg-white/10" />
        </Container>
      </div>
      <Container className="mt-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      </Container>
    </div>
  );
}
