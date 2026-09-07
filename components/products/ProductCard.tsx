import Image from 'next/image';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import type { IProduct } from '@/models/Product';

export function ProductCard({ product }: { product: IProduct }) {
  const image = product.images?.[0];
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-navy-900/10 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-premium"
    >
      <div className="relative aspect-square bg-navy-50">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-10 w-10 text-navy-300" strokeWidth={1.5} />
          </div>
        )}
        {product.inventory <= 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-semibold uppercase text-white">
            Out of Stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg text-navy-950">{product.name}</h3>
        <p className="mt-1.5 flex-1 text-sm text-navy-600">{product.shortDescription}</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-lg font-semibold text-navy-950">{formatCurrency(product.price)}</span>
          {onSale && (
            <span className="text-sm text-navy-400 line-through">
              {formatCurrency(product.compareAtPrice as number)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
