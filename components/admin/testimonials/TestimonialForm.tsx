'use client';

import { useState } from 'react';
import { Label, Input, Textarea, Select, FieldError, FieldHint } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { apiClient, ApiError } from '@/lib/api-client';
import type { ITestimonial } from '@/models/Testimonial';

export function TestimonialForm({
  testimonial,
  onSaved,
  onCancel,
}: {
  testimonial?: ITestimonial;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: testimonial?.name || '',
    company: testimonial?.company || '',
    content: testimonial?.content || '',
    rating: testimonial?.rating ?? 5,
    image: testimonial?.image || '',
    isFeatured: testimonial?.isFeatured ?? false,
    isActive: testimonial?.isActive ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      if (testimonial) {
        await apiClient.patch(`/api/admin/testimonials/${testimonial._id}`, form);
      } else {
        await apiClient.post('/api/admin/testimonials', form);
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
      <FieldHint>
        Only add testimonials from real customers who have given permission — never invented quotes.
      </FieldHint>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>Customer Name</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="company">Company (optional)</Label>
          <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </div>
      </div>

      <div>
        <Label htmlFor="content" required>Testimonial</Label>
        <Textarea id="content" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
        <FieldError>{errors.content}</FieldError>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="rating">Rating</Label>
          <Select id="rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="image">Photo URL (optional)</Label>
          <Input id="image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <input id="isFeatured" type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="h-4 w-4 rounded border-navy-300" />
          <Label htmlFor="isFeatured">Featured on homepage</Label>
        </div>
        <div className="flex items-center gap-2">
          <input id="isActive" type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-navy-300" />
          <Label htmlFor="isActive">Published</Label>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-navy-900/10 pt-5">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save Testimonial'}</Button>
      </div>
    </form>
  );
}
