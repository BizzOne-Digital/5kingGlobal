'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Quote, Star } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { TestimonialForm } from '@/components/admin/testimonials/TestimonialForm';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/providers/ToastProvider';
import { apiClient } from '@/lib/api-client';
import type { ITestimonial } from '@/models/Testimonial';

export default function AdminTestimonialsPage() {
  const toast = useToast();
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalItem, setModalItem] = useState<ITestimonial | 'new' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ITestimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      setTestimonials(await apiClient.get<ITestimonial[]>('/api/admin/testimonials'));
    } catch {
      toast.error('Unable to load testimonials');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/admin/testimonials/${deleteTarget._id}`);
      toast.success('Testimonial deleted');
      setDeleteTarget(null);
      load();
    } catch {
      toast.error('Unable to delete testimonial');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Only add testimonials from real, verified customers."
        action={<Button onClick={() => setModalItem('new')}><Plus className="h-4 w-4" /> New Testimonial</Button>}
      />

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-navy-400" /></div>
      ) : testimonials.length === 0 ? (
        <EmptyState icon={Quote} title="No testimonials yet" description="Add real customer feedback as it comes in." action={<Button onClick={() => setModalItem('new')}>New Testimonial</Button>} />
      ) : (
        <Table>
          <Thead>
            <Th>Name</Th>
            <Th>Rating</Th>
            <Th>Status</Th>
            <Th>Featured</Th>
            <Th className="text-right">Actions</Th>
          </Thead>
          <Tbody>
            {testimonials.map((item) => (
              <Tr key={item._id.toString()}>
                <Td className="font-medium text-navy-950">{item.name}{item.company ? ` · ${item.company}` : ''}</Td>
                <Td>
                  <div className="flex gap-0.5 text-gold-500">
                    {Array.from({ length: item.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                  </div>
                </Td>
                <Td><Badge tone={item.isActive ? 'success' : 'neutral'}>{item.isActive ? 'Published' : 'Draft'}</Badge></Td>
                <Td>{item.isFeatured ? <Badge tone="gold">Featured</Badge> : '—'}</Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setModalItem(item)} className="rounded-sm p-2 text-navy-500 hover:bg-navy-50 hover:text-navy-900" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteTarget(item)} className="rounded-sm p-2 text-navy-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={modalItem !== null} onClose={() => setModalItem(null)} title={modalItem === 'new' ? 'New Testimonial' : 'Edit Testimonial'}>
        {modalItem !== null && (
          <TestimonialForm
            testimonial={modalItem === 'new' ? undefined : modalItem}
            onCancel={() => setModalItem(null)}
            onSaved={() => { setModalItem(null); toast.success('Testimonial saved'); load(); }}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete testimonial?"
        description={`This will permanently remove the testimonial from "${deleteTarget?.name}".`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
