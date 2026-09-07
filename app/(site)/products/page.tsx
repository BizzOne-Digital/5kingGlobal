import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductsBrowser } from '@/components/products/ProductsBrowser';
import { getActiveProducts, getActiveProductCategories } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse security, smart home, and trade equipment products from 5Kings Global.',
  alternates: { canonical: '/products' },
};

export const revalidate = 60;

export default async function ProductsPage() {
  const [initialData, categories] = await Promise.all([
    getActiveProducts({ page: 1 }),
    getActiveProductCategories(),
  ]);

  return (
    <div className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Shop"
          title="Products"
          description="Security equipment, smart home devices, and trade essentials — sourced and supported by the 5Kings Global team."
        />
        <div className="mt-12">
          <ProductsBrowser initialData={initialData} categories={categories} />
        </div>
      </Container>
    </div>
  );
}
