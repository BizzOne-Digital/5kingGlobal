import type { MetadataRoute } from 'next';
import { getActiveServices } from '@/lib/data/services';
import { getActiveProducts } from '@/lib/data/products';
import { getPublishedPosts } from '@/lib/data/blog';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, { items: products }, { items: posts }] = await Promise.all([
    getActiveServices(),
    getActiveProducts({ page: 1 }),
    getPublishedPosts({ page: 1 }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/services`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/products`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/pricing`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/booking`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${siteUrl}/services/${s.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
  }));

  return [...staticRoutes, ...serviceRoutes, ...productRoutes, ...blogRoutes];
}
