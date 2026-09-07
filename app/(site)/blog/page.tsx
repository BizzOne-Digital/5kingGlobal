import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils/format';
import { getPublishedPosts } from '@/lib/data/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News, tips, and updates from 5Kings Global on security, smart home, electrical, and solar services.',
  alternates: { canonical: '/blog' },
};

export const revalidate = 60;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const { items, totalPages } = await getPublishedPosts({ page: Number(page) || 1 });

  return (
    <div className="py-20">
      <Container>
        <SectionHeading eyebrow="Blog" title="News & Insights" description="Updates from the 5Kings Global team." />

        <div className="mt-12">
          {items.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="No posts published yet"
              description="Check back soon for updates from the 5Kings Global team."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-md border border-navy-900/10 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-premium"
                  >
                    {post.featuredImage && (
                      <div className="relative aspect-video">
                        <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      {post.category && (
                        <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                          {post.category}
                        </span>
                      )}
                      <h2 className="mt-2 font-display text-lg text-navy-950">{post.title}</h2>
                      <p className="mt-2 flex-1 text-sm text-navy-600">{post.excerpt}</p>
                      {post.publishedAt && (
                        <p className="mt-4 text-xs text-navy-400">{formatDate(post.publishedAt)}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === (Number(page) || 1);
                    return (
                      <Link
                        key={pageNum}
                        href={`/blog?page=${pageNum}`}
                        className={
                          isActive
                            ? 'flex h-9 w-9 items-center justify-center rounded-sm bg-navy-950 text-sm font-semibold text-white'
                            : 'flex h-9 w-9 items-center justify-center rounded-sm border border-navy-900/15 text-sm text-navy-700 hover:bg-navy-50'
                        }
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
