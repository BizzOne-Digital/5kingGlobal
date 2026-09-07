import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';

export default function BlogPostLoading() {
  return (
    <article className="py-16 pb-24">
      <Container size="narrow">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="mt-4 h-9 w-full" />
        <Skeleton className="mt-4 h-4 w-48" />
        <Skeleton className="mt-8 aspect-video w-full" />
        <Skeleton className="mt-10 h-4 w-full" />
        <Skeleton className="mt-3 h-4 w-11/12" />
        <Skeleton className="mt-3 h-4 w-3/4" />
      </Container>
    </article>
  );
}
