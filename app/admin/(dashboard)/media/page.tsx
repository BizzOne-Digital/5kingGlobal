'use client';

import { useEffect, useState } from 'react';
import { Youtube, Image as ImageIcon } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchInput } from '@/components/admin/SearchInput';
import { UploadButton } from '@/components/admin/media/UploadButton';
import { MediaCard } from '@/components/admin/media/MediaCard';
import { AddVideoLinkForm } from '@/components/admin/media/AddVideoLinkForm';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/FormField';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/providers/ToastProvider';
import { apiClient } from '@/lib/api-client';
import type { IMedia } from '@/models/Media';

export default function AdminMediaPage() {
  const toast = useToast();
  const [media, setMedia] = useState<IMedia[]>([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [folder, setFolder] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (type) params.set('type', type);
      const data = await apiClient.get<IMedia[]>(`/api/media?${params.toString()}`);
      setMedia(data);
    } catch {
      toast.error('Unable to load media');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, type]);

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Upload and manage images, graphics, and videos used across the site."
        action={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowVideoModal(true)}><Youtube className="h-4 w-4" /> Add Video Link</Button>
            <UploadButton folder={folder} onUploaded={load} />
          </div>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={setSearch} placeholder="Search filenames…" />
        <Select value={type} onChange={(e) => setType(e.target.value)} className="sm:w-48">
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="graphic">Graphics</option>
        </Select>
        <Select value={folder} onChange={(e) => setFolder(e.target.value)} className="sm:w-48">
          <option value="general">Folder: General</option>
          <option value="services">Folder: Services</option>
          <option value="products">Folder: Products</option>
          <option value="blog">Folder: Blog</option>
          <option value="testimonials">Folder: Testimonials</option>
          <option value="branding">Folder: Branding</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-navy-400" /></div>
      ) : media.length === 0 ? (
        <EmptyState icon={ImageIcon} title="No media yet" description="Upload images, graphics, or link a video to get started." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {media.map((item) => (
            <MediaCard key={item._id.toString()} media={item} onChanged={load} />
          ))}
        </div>
      )}

      <Modal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} title="Add Video Link" size="sm">
        <AddVideoLinkForm onCancel={() => setShowVideoModal(false)} onSaved={() => { setShowVideoModal(false); toast.success('Video added'); load(); }} />
      </Modal>
    </div>
  );
}
