import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ServiceDetailLoading() {
  return (
    <div className="pb-24">
      <div className="bg-navy-gradient py-20">
        <Container>
          <Skeleton className="h-4 w-32 bg-white/10" />
          <Skeleton className="mt-3 h-10 w-96 max-w-full bg-white/10" />
          <Skeleton className="mt-5 h-5 w-full max-w-xl bg-white/10" />
        </Container>
      </div>
      <Container className="mt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="mb-10 aspect-video w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-3 h-4 w-11/12" />
            <Skeleton className="mt-3 h-4 w-3/4" />
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      </Container>
    </div>
  );
}
