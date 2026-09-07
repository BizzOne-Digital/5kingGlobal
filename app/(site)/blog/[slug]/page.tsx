import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { JsonLd } from '@/components/seo/JsonLd';
import { formatDate } from '@/lib/utils/format';
import { getPostBySlug, getPublishedPosts } from '@/lib/data/blog';
import { getSiteSettings } from '@/lib/data/settings';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { items } = await getPublishedPosts({ page: 1 });
  return items.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: post.featuredImage ? { images: [post.featuredImage] } : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSiteSettings()]);
  if (!post) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.featuredImage || undefined,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: settings.businessName,
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <article className="py-16 pb-24">
      <JsonLd data={articleJsonLd} />
      <Container size="narrow">
        {post.category && <Badge tone="gold">{post.category}</Badge>}
        <h1 className="mt-4 font-display text-3xl text-navy-950 sm:text-4xl">{post.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-navy-500">
          <span>By {post.author}</span>
          {post.publishedAt && (
            <>
              <span>·</span>
              <span>{formatDate(post.publishedAt)}</span>
            </>
          )}
        </div>

        {post.featuredImage && (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-md shadow-card">
            <Image src={post.featuredImage} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="prose prose-navy mt-10 max-w-none prose-headings:font-display">
          <p className="whitespace-pre-line text-navy-700">{post.content}</p>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-navy-900/10 pt-6">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </Container>
    </article>
  );
}
