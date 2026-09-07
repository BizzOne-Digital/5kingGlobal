'use client';

import { useState } from 'react';
import { Label, Input, Textarea, Select, FieldError, FieldHint } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { apiClient, ApiError } from '@/lib/api-client';
import type { IService } from '@/models/Service';

const CATEGORIES = ['Security & CCTV', 'Smart Home', 'Electrical & Solar', 'Handyman & Trades', 'Workforce Solutions'];

export function ServiceForm({
  service,
  onSaved,
  onCancel,
}: {
  service?: IService;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: service?.title || '',
    category: service?.category || CATEGORIES[0],
    shortDescription: service?.shortDescription || '',
    description: service?.description || '',
    features: service?.features.join('\n') || '',
    image: service?.image || '',
    icon: service?.icon || '',
    isFeatured: service?.isFeatured ?? false,
    isActive: service?.isActive ?? true,
    sortOrder: service?.sortOrder ?? 0,
    seoTitle: service?.seoTitle || '',
    seoDescription: service?.seoDescription || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const payload = {
      ...form,
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
      sortOrder: Number(form.sortOrder),
    };

    try {
      if (service) {
        await apiClient.patch(`/api/admin/services/${service._id}`, payload);
      } else {
        await apiClient.post('/api/admin/services', payload);
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
          <Label htmlFor="title" required>Title</Label>
          <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <FieldError>{errors.title}</FieldError>
        </div>
        <div>
          <Label htmlFor="category" required>Category</Label>
          <Select id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
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
        <Label htmlFor="features">Features (one per line)</Label>
        <Textarea id="features" rows={4} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
      </div>

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Paste a URL, or select one from Media Library" />
        <FieldHint>Upload the image in Media Library, then paste its URL here.</FieldHint>
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
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save Service'}</Button>
      </div>
    </form>
  );
}
