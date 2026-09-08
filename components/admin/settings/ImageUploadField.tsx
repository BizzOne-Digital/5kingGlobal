'use client';

import { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { Label } from '@/components/ui/FormField';
import { useToast } from '@/components/providers/ToastProvider';
import { apiClient } from '@/lib/api-client';

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  folder?: string;
}

/**
 * One-click image upload for branding fields (logo, favicon) — uploads
 * straight to the Media Library (MongoDB GridFS) and fills in the resulting
 * URL, so there's no separate "upload elsewhere, then paste the URL here"
 * step.
 */
export function ImageUploadField({ label, value, onChange, hint, folder = 'branding' }: Props) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      const media = await apiClient.post<{ url: string }>('/api/media', formData);
      onChange(media.url);
      toast.success('Image uploaded');
    } catch {
      toast.error('Unable to upload image');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <Label htmlFor={`${label}-upload`}>{label}</Label>
      <div className="mt-1.5 flex items-center gap-4">
        <div className="flex h-16 w-32 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-navy-900/15 bg-navy-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={label} className="h-full w-full object-contain" />
          ) : (
            <span className="text-xs text-navy-400">No image</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              id={`${label}-upload`}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-sm border border-navy-900/15 px-3 py-1.5 text-xs font-medium text-navy-800 transition-colors hover:bg-navy-50 disabled:opacity-50"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              {isUploading ? 'Uploading…' : value ? 'Replace' : 'Upload'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1 rounded-sm border border-navy-900/15 px-3 py-1.5 text-xs font-medium text-navy-500 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>
          {hint && <p className="text-xs text-navy-500">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
