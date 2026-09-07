'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Package, FolderCog } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchInput } from '@/components/admin/SearchInput';
import { ProductForm } from '@/components/admin/products/ProductForm';
import { CategoryManager } from '@/components/admin/products/CategoryManager';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/providers/ToastProvider';
import { apiClient } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils/format';
import type { IProduct } from '@/models/Product';
import type { IProductCategory } from '@/models/ProductCategory';

export default function AdminProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState<IProduct | 'new' | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadCategories() {
    try {
      const data = await apiClient.get<IProductCategory[]>('/api/admin/product-categories');
      setCategories(data);
    } catch {
      toast.error('Unable to load categories');
    }
  }

  async function loadProducts() {
    setIsLoading(true);
    try {
      const data = await apiClient.get<IProduct[]>(
        `/api/admin/products${search ? `?search=${encodeURIComponent(search)}` : ''}`
      );
      setProducts(data);
    } catch {
      toast.error('Unable to load products');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(loadProducts, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/admin/products/${deleteTarget._id}`);
      toast.success('Product deleted');
      setDeleteTarget(null);
      loadProducts();
    } catch {
      toast.error('Unable to delete product');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage the products available in your shop."
        action={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowCategories(true)}><FolderCog className="h-4 w-4" /> Categories</Button>
            <Button onClick={() => setModalProduct('new')}><Plus className="h-4 w-4" /> New Product</Button>
          </div>
        }
      />

      <div className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="Search products…" /></div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-navy-400" /></div>
      ) : products.length === 0 ? (
        <EmptyState icon={Package} title="No products yet" description="Add your first product to start selling." action={<Button onClick={() => setModalProduct('new')}>New Product</Button>} />
      ) : (
        <Table>
          <Thead>
            <Th>Name</Th>
            <Th>SKU</Th>
            <Th>Price</Th>
            <Th>Inventory</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </Thead>
          <Tbody>
            {products.map((product) => (
              <Tr key={product._id.toString()}>
                <Td className="font-medium text-navy-950">{product.name}</Td>
                <Td>{product.sku}</Td>
                <Td>{formatCurrency(product.price)}</Td>
                <Td>{product.inventory}</Td>
                <Td><Badge tone={product.isActive ? 'success' : 'neutral'}>{product.isActive ? 'Published' : 'Draft'}</Badge></Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setModalProduct(product)} className="rounded-sm p-2 text-navy-500 hover:bg-navy-50 hover:text-navy-900" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteTarget(product)} className="rounded-sm p-2 text-navy-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={modalProduct !== null} onClose={() => setModalProduct(null)} title={modalProduct === 'new' ? 'New Product' : 'Edit Product'} size="lg">
        {modalProduct !== null && (
          <ProductForm
            product={modalProduct === 'new' ? undefined : modalProduct}
            categories={categories}
            onCancel={() => setModalProduct(null)}
            onSaved={() => { setModalProduct(null); toast.success('Product saved'); loadProducts(); }}
          />
        )}
      </Modal>

      <Modal isOpen={showCategories} onClose={() => setShowCategories(false)} title="Product Categories">
        <CategoryManager categories={categories} onChanged={loadCategories} />
      </Modal>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete product?"
        description={`This will permanently remove "${deleteTarget?.name}". This cannot be undone.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
