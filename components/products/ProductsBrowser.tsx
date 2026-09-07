'use client';

import { useEffect, useState, useTransition } from 'react';
import { Search } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Input, Select } from '@/components/ui/FormField';
import { Spinner } from '@/components/ui/Spinner';
import { apiClient } from '@/lib/api-client';
import type { IProduct } from '@/models/Product';
import type { IProductCategory } from '@/models/ProductCategory';

interface ProductListResponse {
  items: IProduct[];
  total: number;
  page: number;
  totalPages: number;
}

export function ProductsBrowser({
  initialData,
  categories,
}: {
  initialData: ProductListResponse;
  categories: IProductCategory[];
}) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      params.set('page', String(page));

      startTransition(async () => {
        try {
          const result = await apiClient.get<ProductListResponse>(`/api/products?${params.toString()}`);
          setData(result);
        } catch {
          // Keep the last good result on transient errors.
        }
      });
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, page]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search products…"
            className="pl-9"
          />
        </div>
        <Select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="sm:w-64"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat._id.toString()}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="relative mt-8 min-h-[200px]">
        {isPending && (
          <div className="absolute right-0 top-0 text-navy-400">
            <Spinner className="h-4 w-4" />
          </div>
        )}

        {data.items.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try a different search term or category, or check back soon — the admin team is regularly adding new products."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((product) => (
              <ProductCard key={product._id.toString()} product={product} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
