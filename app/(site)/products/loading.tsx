import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProductsLoading() {
  return (
    <div className="py-20">
      <Container>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-4 h-5 w-full max-w-xl" />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </Container>
    </div>
  );
}
