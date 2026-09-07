import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProductDetailLoading() {
  return (
    <div className="py-16 pb-24">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="mt-4 h-9 w-3/4" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-6 h-8 w-32" />
            <Skeleton className="mt-8 h-11 w-40" />
            <Skeleton className="mt-10 h-4 w-full" />
            <Skeleton className="mt-3 h-4 w-5/6" />
          </div>
        </div>
      </Container>
    </div>
  );
}
