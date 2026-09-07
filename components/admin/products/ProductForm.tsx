'use client';

import { useState } from 'react';
import { Label, Input, Textarea, Select, FieldError, FieldHint } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { apiClient, ApiError } from '@/lib/api-client';
import type { IProduct } from '@/models/Product';
import type { IProductCategory } from '@/models/ProductCategory';

export function ProductForm({
  product,
  categories,
  onSaved,
  onCancel,
}: {
  product?: IProduct;
  categories: IProductCategory[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const existingCategory = product?.category as unknown as { _id: string } | string | undefined;
  const [form, setForm] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    category: typeof existingCategory === 'object' ? existingCategory?._id : existingCategory || '',
    price: product?.price ?? 0,
    compareAtPrice: product?.compareAtPrice ?? '',
    inventory: product?.inventory ?? 0,
    images: product?.images?.join('\n') || '',
    shortDescription: product?.shortDescription || '',
    description: product?.description || '',
    isFeatured: product?.isFeatured ?? false,
    isActive: product?.isActive ?? true,
    sortOrder: product?.sortOrder ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice === '' ? undefined : Number(form.compareAtPrice),
      inventory: Number(form.inventory),
      sortOrder: Number(form.sortOrder),
      images: form.images.split('\n').map((i) => i.trim()).filter(Boolean),
      category: form.category || '',
    };

    try {
      if (product) {
        await apiClient.patch(`/api/admin/products/${product._id}`, payload);
      } else {
        await apiClient.post('/api/admin/products', payload);
      }
      onSaved();
    } catch (error) {
      if (error instanceof ApiError && error.details) {
        const fieldErrors = (error.details as { fieldErrors?: Record<string, string[]> }).fieldErrors;
        const flat: Record<string, string> = {};
        if (fieldErrors) Object.entries(fieldErrors).forEach(([k, v]) => { if (v?.[0]) flat[k] = v[0]; });
        setErrors(flat);
      } else if (error instanceof ApiError) {
        setErrors({ form: error.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.form && <FieldError>{errors.form}</FieldError>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>Product Name</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="sku" required>SKU</Label>
          <Input id="sku" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
          <FieldError>{errors.sku}</FieldError>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">No category</option>
            {categories.map((c) => <option key={c.slug} value={c._id.toString()}>{c.name}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="inventory">Inventory</Label>
          <Input id="inventory" type="number" min={0} value={form.inventory} onChange={(e) => setForm({ ...form, inventory: Number(e.target.value) })} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="price" required>Price (USD)</Label>
          <Input id="price" type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
          <FieldError>{errors.price}</FieldError>
        </div>
        <div>
          <Label htmlFor="compareAtPrice">Compare-at Price (optional)</Label>
          <Input id="compareAtPrice" type="number" min={0} step="0.01" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} />
        </div>
      </div>

      <div>
        <Label htmlFor="shortDescription" required>Short Description</Label>
        <Textarea id="shortDescription" rows={2} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} required />
        <FieldError>{errors.shortDescription}</FieldError>
      </div>

      <div>
        <Label htmlFor="description" required>Full Description</Label>
        <Textarea id="description" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <FieldError>{errors.description}</FieldError>
      </div>

      <div>
        <Label htmlFor="images">Image URLs (one per line)</Label>
        <Textarea id="images" rows={3} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
        <FieldHint>Upload images in Media Library, then paste their URLs here. First image is the main product photo.</FieldHint>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        <div>
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input id="sortOrder" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        </div>
        <div className="flex items-end gap-2 pb-2.5">
          <input id="isFeatured" type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="h-4 w-4 rounded border-navy-300" />
          <Label htmlFor="isFeatured">Featured</Label>
        </div>
        <div className="flex items-end gap-2 pb-2.5">
          <input id="isActive" type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-navy-300" />
          <Label htmlFor="isActive">Published</Label>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-navy-900/10 pt-5">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save Product'}</Button>
      </div>
    </form>
  );
}
