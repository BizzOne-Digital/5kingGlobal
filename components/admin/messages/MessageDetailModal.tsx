'use client';

import { useState } from 'react';
import { Mail, Phone, Calendar } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useToast } from '@/components/providers/ToastProvider';
import { apiClient } from '@/lib/api-client';
import { formatDate } from '@/lib/utils/format';
import type { IContactMessage, ContactMessageStatus } from '@/models/ContactMessage';

const STATUSES: ContactMessageStatus[] = ['unread', 'read', 'replied', 'archived'];

export function MessageDetailModal({
  message,
  onClose,
  onUpdated,
}: {
  message: IContactMessage | null;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const toast = useToast();
  const [status, setStatus] = useState<ContactMessageStatus | ''>('');
  const [isSaving, setIsSaving] = useState(false);

  if (!message) return null;
  const currentStatus = status || message.status;

  async function handleStatusChange(newStatus: ContactMessageStatus) {
    setStatus(newStatus);
    setIsSaving(true);
    try {
      await apiClient.patch(`/api/admin/contact/${message!._id}`, { status: newStatus });
      toast.success('Message status updated');
      onUpdated();
    } catch {
      toast.error('Unable to update status');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal isOpen={!!message} onClose={onClose} title="Message Details">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-navy-950">{message.subject}</h3>
          <StatusBadge status={currentStatus} />
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm text-navy-700 sm:grid-cols-2">
          <p>{message.name}</p>
          <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold-600" /> {message.email}</p>
          {message.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold-600" /> {message.phone}</p>}
          <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gold-600" /> {formatDate(message.createdAt)}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-navy-900">Message</p>
          <p className="mt-1 whitespace-pre-line text-sm text-navy-600">{message.message}</p>
        </div>

        <div className="border-t border-navy-900/10 pt-5">
          <label className="mb-1.5 block text-sm font-medium text-navy-900">Update Status</label>
          <div className="flex gap-3">
            <Select value={currentStatus} onChange={(e) => handleStatusChange(e.target.value as ContactMessageStatus)} disabled={isSaving}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
