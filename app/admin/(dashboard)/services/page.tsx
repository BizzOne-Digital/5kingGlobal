'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchInput } from '@/components/admin/SearchInput';
import { ServiceForm } from '@/components/admin/services/ServiceForm';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/providers/ToastProvider';
import { apiClient } from '@/lib/api-client';
import type { IService } from '@/models/Service';

export default function AdminServicesPage() {
  const toast = useToast();
  const [services, setServices] = useState<IService[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalService, setModalService] = useState<IService | 'new' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IService | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      const data = await apiClient.get<IService[]>(
        `/api/admin/services${search ? `?search=${encodeURIComponent(search)}` : ''}`
      );
      setServices(data);
    } catch {
      toast.error('Unable to load services');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/admin/services/${deleteTarget._id}`);
      toast.success('Service deleted');
      setDeleteTarget(null);
      load();
    } catch {
      toast.error('Unable to delete service');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage the services shown across the public site."
        action={<Button onClick={() => setModalService('new')}><Plus className="h-4 w-4" /> New Service</Button>}
      />

      <div className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="Search services…" /></div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-navy-400" /></div>
      ) : services.length === 0 ? (
        <EmptyState icon={Wrench} title="No services yet" description="Create your first service to get started." action={<Button onClick={() => setModalService('new')}>New Service</Button>} />
      ) : (
        <Table>
          <Thead>
            <Th>Title</Th>
            <Th>Category</Th>
            <Th>Status</Th>
            <Th>Featured</Th>
            <Th className="text-right">Actions</Th>
          </Thead>
          <Tbody>
            {services.map((service) => (
              <Tr key={service._id.toString()}>
                <Td className="font-medium text-navy-950">{service.title}</Td>
                <Td>{service.category}</Td>
                <Td><Badge tone={service.isActive ? 'success' : 'neutral'}>{service.isActive ? 'Published' : 'Draft'}</Badge></Td>
                <Td>{service.isFeatured ? <Badge tone="gold">Featured</Badge> : '—'}</Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setModalService(service)} className="rounded-sm p-2 text-navy-500 hover:bg-navy-50 hover:text-navy-900" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteTarget(service)} className="rounded-sm p-2 text-navy-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={modalService !== null} onClose={() => setModalService(null)} title={modalService === 'new' ? 'New Service' : 'Edit Service'} size="lg">
        {modalService !== null && (
          <ServiceForm
            service={modalService === 'new' ? undefined : modalService}
            onCancel={() => setModalService(null)}
            onSaved={() => { setModalService(null); toast.success('Service saved'); load(); }}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete service?"
        description={`This will permanently remove "${deleteTarget?.title}". This cannot be undone.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
