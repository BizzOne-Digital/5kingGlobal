'use client';

import { useState } from 'react';
import { Label, Input, Select, FieldError } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { apiClient, ApiError } from '@/lib/api-client';

export function AddVideoLinkForm({ onSaved, onCancel }: { onSaved: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({ externalSource: 'youtube', externalId: '', filename: '', alt: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await apiClient.post('/api/media', form);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to add video');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <FieldError>{error}</FieldError>}
      <div>
        <Label htmlFor="externalSource">Platform</Label>
        <Select id="externalSource" value={form.externalSource} onChange={(e) => setForm({ ...form, externalSource: e.target.value })}>
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="externalId" required>Video ID</Label>
        <Input id="externalId" value={form.externalId} onChange={(e) => setForm({ ...form, externalId: e.target.value })} placeholder="e.g. dQw4w9WgXcQ" required />
      </div>
      <div>
        <Label htmlFor="filename" required>Label</Label>
        <Input id="filename" value={form.filename} onChange={(e) => setForm({ ...form, filename: e.target.value })} placeholder="e.g. Company Overview Video" required />
      </div>
      <div className="flex justify-end gap-3 border-t border-navy-900/10 pt-5">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding…' : 'Add Video'}</Button>
      </div>
    </form>
  );
}
