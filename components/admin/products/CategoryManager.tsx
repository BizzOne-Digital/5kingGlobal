'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Label, Input } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/providers/ToastProvider';
import { apiClient } from '@/lib/api-client';
import type { IProductCategory } from '@/models/ProductCategory';

export function CategoryManager({
  categories,
  onChanged,
}: {
  categories: IProductCategory[];
  onChanged: () => void;
}) {
  const toast = useToast();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await apiClient.post('/api/admin/product-categories', { name: name.trim() });
      setName('');
      toast.success('Category added');
      onChanged();
    } catch {
      toast.error('Unable to add category');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiClient.delete(`/api/admin/product-categories/${id}`);
      toast.success('Category deleted');
      onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete category');
    }
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="flex items-end gap-3">
        <div className="flex-1">
          <Label htmlFor="newCategory">New Category Name</Label>
          <Input id="newCategory" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cameras & Monitoring" />
        </div>
        <Button type="submit" disabled={isSubmitting}><Plus className="h-4 w-4" /> Add</Button>
      </form>

      <ul className="mt-6 divide-y divide-navy-900/10 border-t border-navy-900/10">
        {categories.length === 0 && <li className="py-4 text-sm text-navy-500">No categories yet.</li>}
        {categories.map((category) => (
          <li key={category._id.toString()} className="flex items-center justify-between py-3">
            <span className="text-sm text-navy-900">{category.name}</span>
            <button onClick={() => handleDelete(category._id.toString())} className="rounded-sm p-1.5 text-navy-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete category">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
