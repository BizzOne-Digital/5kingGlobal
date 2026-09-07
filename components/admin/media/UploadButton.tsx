'use client';

import { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/providers/ToastProvider';
import { apiClient } from '@/lib/api-client';

export function UploadButton({ folder, onUploaded }: { folder: string; onUploaded: () => void }) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    let successCount = 0;
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      try {
        // eslint-disable-next-line no-await-in-loop
        await apiClient.post('/api/media', formData);
        successCount += 1;
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    setIsUploading(false);
    if (successCount > 0) {
      toast.success(`Uploaded ${successCount} file${successCount > 1 ? 's' : ''}`);
      onUploaded();
    }
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/mp4,video/webm"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button onClick={() => inputRef.current?.click()} disabled={isUploading}>
        <UploadCloud className="h-4 w-4" />
        {isUploading ? 'Uploading…' : 'Upload Files'}
      </Button>
    </>
  );
}
