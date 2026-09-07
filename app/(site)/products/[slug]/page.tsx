import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { JsonLd } from '@/components/seo/JsonLd';
import { formatCurrency } from '@/lib/utils/format';
import { getProductBySlug, getActiveProducts } from '@/lib/data/products';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { items } = await getActiveProducts({ page: 1 });
  return items.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: product.images?.[0] ? { images: [product.images[0]] } : undefined,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = product.category as unknown as { name: string; slug: string } | undefined;
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seoDescription || product.shortDescription,
    sku: product.sku,
    image: product.images && product.images.length > 0 ? product.images : undefined,
    category: category?.name,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability:
        product.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${siteUrl}/products/${product.slug}`,
    },
  };

  return (
    <div className="py-16 pb-24">
      <JsonLd data={productJsonLd} />
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-md bg-navy-50 shadow-card">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-16 w-16 text-navy-300" strokeWidth={1.5} />
              </div>
            )}
          </div>

          <div>
            {category && <Badge tone="gold">{category.name}</Badge>}
            <h1 className="mt-4 font-display text-3xl text-navy-950 sm:text-4xl">{product.name}</h1>
            <p className="mt-4 text-navy-600">{product.shortDescription}</p>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-3xl font-semibold text-navy-950">{formatCurrency(product.price)}</span>
              {onSale && (
                <span className="text-lg text-navy-400 line-through">
                  {formatCurrency(product.compareAtPrice as number)}
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-navy-500">SKU: {product.sku}</p>

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>

            <div className="prose prose-navy mt-10 max-w-none prose-headings:font-display">
              <p className="whitespace-pre-line text-navy-700">{product.description}</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
