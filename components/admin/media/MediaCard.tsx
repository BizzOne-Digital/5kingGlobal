'use client';

import { useState } from 'react';
import { Copy, Trash2, Video, Check } from 'lucide-react';
import { Input } from '@/components/ui/FormField';
import { useToast } from '@/components/providers/ToastProvider';
import { apiClient } from '@/lib/api-client';
import type { IMedia } from '@/models/Media';

export function MediaCard({ media, onChanged }: { media: IMedia; onChanged: () => void }) {
  const toast = useToast();
  const [alt, setAlt] = useState(media.alt || '');
  const [copied, setCopied] = useState(false);

  async function handleAltBlur() {
    if (alt === media.alt) return;
    try {
      await apiClient.patch(`/api/media/${media._id}`, { alt });
    } catch {
      toast.error('Unable to update alt text');
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(media.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleDelete() {
    try {
      await apiClient.delete(`/api/media/${media._id}`);
      toast.success('Media deleted');
      onChanged();
    } catch {
      toast.error('Unable to delete media');
    }
  }

  return (
    <div className="overflow-hidden rounded-md border border-navy-900/10 bg-white shadow-card">
      <div className="relative aspect-square bg-navy-50">
        {media.type === 'video' ? (
          <div className="flex h-full items-center justify-center">
            <Video className="h-8 w-8 text-navy-300" />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.url} alt={media.alt || media.filename} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="p-3">
        <p className="truncate text-xs font-medium text-navy-900" title={media.filename}>{media.filename}</p>
        <Input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          onBlur={handleAltBlur}
          placeholder="Alt text"
          className="mt-2 !py-1.5 text-xs"
        />
        <div className="mt-2 flex justify-between">
          <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-navy-500 hover:text-navy-900">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy URL'}
          </button>
          <button onClick={handleDelete} className="text-navy-400 hover:text-red-600" aria-label="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
