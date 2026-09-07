'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { PricingForm } from '@/components/admin/pricing/PricingForm';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/providers/ToastProvider';
import { apiClient } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils/format';
import type { IPricingPlan } from '@/models/PricingPlan';

export default function AdminPricingPage() {
  const toast = useToast();
  const [plans, setPlans] = useState<IPricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalPlan, setModalPlan] = useState<IPricingPlan | 'new' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IPricingPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      setPlans(await apiClient.get<IPricingPlan[]>('/api/admin/pricing'));
    } catch {
      toast.error('Unable to load pricing plans');
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
      await apiClient.delete(`/api/admin/pricing/${deleteTarget._id}`);
      toast.success('Pricing plan deleted');
      setDeleteTarget(null);
      load();
    } catch {
      toast.error('Unable to delete pricing plan');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Pricing"
        description="Manage pricing plans shown on the public pricing page."
        action={<Button onClick={() => setModalPlan('new')}><Plus className="h-4 w-4" /> New Plan</Button>}
      />

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-navy-400" /></div>
      ) : plans.length === 0 ? (
        <EmptyState icon={Tag} title="No pricing plans yet" description="Add a plan, or leave this empty to keep pricing fully quote-based." action={<Button onClick={() => setModalPlan('new')}>New Plan</Button>} />
      ) : (
        <Table>
          <Thead>
            <Th>Name</Th>
            <Th>Price</Th>
            <Th>Status</Th>
            <Th>Featured</Th>
            <Th className="text-right">Actions</Th>
          </Thead>
          <Tbody>
            {plans.map((plan) => (
              <Tr key={plan._id.toString()}>
                <Td className="font-medium text-navy-950">{plan.name}</Td>
                <Td>{plan.billingType === 'quote' || plan.price == null ? 'Custom Quote' : formatCurrency(plan.price)}</Td>
                <Td><Badge tone={plan.isActive ? 'success' : 'neutral'}>{plan.isActive ? 'Published' : 'Draft'}</Badge></Td>
                <Td>{plan.isFeatured ? <Badge tone="gold">Featured</Badge> : '—'}</Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setModalPlan(plan)} className="rounded-sm p-2 text-navy-500 hover:bg-navy-50 hover:text-navy-900" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteTarget(plan)} className="rounded-sm p-2 text-navy-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={modalPlan !== null} onClose={() => setModalPlan(null)} title={modalPlan === 'new' ? 'New Pricing Plan' : 'Edit Pricing Plan'}>
        {modalPlan !== null && (
          <PricingForm
            plan={modalPlan === 'new' ? undefined : modalPlan}
            onCancel={() => setModalPlan(null)}
            onSaved={() => { setModalPlan(null); toast.success('Pricing plan saved'); load(); }}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete pricing plan?"
        description={`This will permanently remove "${deleteTarget?.name}".`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
