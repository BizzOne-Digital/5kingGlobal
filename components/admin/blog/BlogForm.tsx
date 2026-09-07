'use client';

import { useState } from 'react';
import { Label, Input, Textarea, Select, FieldError, FieldHint } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { apiClient, ApiError } from '@/lib/api-client';
import type { IBlogPost } from '@/models/BlogPost';

export function BlogForm({
  post,
  onSaved,
  onCancel,
}: {
  post?: IBlogPost;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    featuredImage: post?.featuredImage || '',
    category: post?.category || '',
    tags: post?.tags.join(', ') || '',
    author: post?.author || '',
    status: post?.status || 'draft',
    seoTitle: post?.seoTitle || '',
    seoDescription: post?.seoDescription || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (post) {
        await apiClient.patch(`/api/admin/blog/${post._id}`, payload);
      } else {
        await apiClient.post('/api/admin/blog', payload);
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
        <Label htmlFor="title" required>Title</Label>
        <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <FieldError>{errors.title}</FieldError>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="author" required>Author</Label>
          <Input id="author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
          <FieldError>{errors.author}</FieldError>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>
      </div>

      <div>
        <Label htmlFor="excerpt" required>Excerpt</Label>
        <Textarea id="excerpt" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
        <FieldError>{errors.excerpt}</FieldError>
      </div>

      <div>
        <Label htmlFor="content" required>Content</Label>
        <Textarea id="content" rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
        <FieldError>{errors.content}</FieldError>
      </div>

      <div>
        <Label htmlFor="featuredImage">Featured Image URL</Label>
        <Input id="featuredImage" value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} />
        <FieldHint>Upload the image in Media Library, then paste its URL here.</FieldHint>
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </Select>
      </div>

      <div className="flex justify-end gap-3 border-t border-navy-900/10 pt-5">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save Post'}</Button>
      </div>
    </form>
  );
}
