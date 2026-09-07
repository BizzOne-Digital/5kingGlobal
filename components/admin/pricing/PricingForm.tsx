'use client';

import { useState } from 'react';
import { Label, Input, Textarea, Select, FieldError } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { apiClient, ApiError } from '@/lib/api-client';
import type { IPricingPlan } from '@/models/PricingPlan';

export function PricingForm({
  plan,
  onSaved,
  onCancel,
}: {
  plan?: IPricingPlan;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: plan?.name || '',
    description: plan?.description || '',
    billingType: plan?.billingType || 'quote',
    price: plan?.price ?? '',
    features: plan?.features.join('\n') || '',
    ctaText: plan?.ctaText || 'Request a Quote',
    ctaUrl: plan?.ctaUrl || '/booking',
    isFeatured: plan?.isFeatured ?? false,
    isActive: plan?.isActive ?? true,
    sortOrder: plan?.sortOrder ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const payload = {
      ...form,
      price: form.billingType === 'quote' || form.price === '' ? undefined : Number(form.price),
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
      sortOrder: Number(form.sortOrder),
    };

    try {
      if (plan) {
        await apiClient.patch(`/api/admin/pricing/${plan._id}`, payload);
      } else {
        await apiClient.post('/api/admin/pricing', payload);
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

      <div>
        <Label htmlFor="name" required>Plan Name</Label>
        <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <FieldError>{errors.name}</FieldError>
      </div>

      <div>
        <Label htmlFor="description" required>Description</Label>
        <Textarea id="description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <FieldError>{errors.description}</FieldError>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="billingType">Billing Type</Label>
          <Select id="billingType" value={form.billingType} onChange={(e) => setForm({ ...form, billingType: e.target.value as typeof form.billingType })}>
            <option value="quote">Quote-based (no fixed price)</option>
            <option value="one-time">One-time</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Select>
        </div>
        {form.billingType !== 'quote' && (
          <div>
            <Label htmlFor="price" required>Price (USD)</Label>
            <Input id="price" type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="features">Features (one per line)</Label>
        <Textarea id="features" rows={4} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="ctaText">Button Text</Label>
          <Input id="ctaText" value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="ctaUrl">Button Link</Label>
          <Input id="ctaUrl" value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} />
        </div>
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
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save Plan'}</Button>
      </div>
    </form>
  );
}
