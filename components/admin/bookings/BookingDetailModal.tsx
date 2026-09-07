'use client';

import { useState } from 'react';
import { Mail, Phone, Calendar, Tag } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useToast } from '@/components/providers/ToastProvider';
import { apiClient } from '@/lib/api-client';
import { formatDate } from '@/lib/utils/format';
import type { IBooking, BookingStatus } from '@/models/Booking';

const STATUSES: BookingStatus[] = ['pending', 'contacted', 'confirmed', 'completed', 'cancelled'];

export function BookingDetailModal({
  booking,
  onClose,
  onUpdated,
}: {
  booking: IBooking | null;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const toast = useToast();
  const [status, setStatus] = useState<BookingStatus | ''>('');
  const [isSaving, setIsSaving] = useState(false);

  if (!booking) return null;
  const currentStatus = status || booking.status;

  async function handleStatusChange(newStatus: BookingStatus) {
    setStatus(newStatus);
    setIsSaving(true);
    try {
      await apiClient.patch(`/api/admin/bookings/${booking!._id}`, { status: newStatus });
      toast.success('Booking status updated');
      onUpdated();
    } catch {
      toast.error('Unable to update status');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal isOpen={!!booking} onClose={onClose} title="Booking Details">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-navy-950">{booking.name}</h3>
          <StatusBadge status={currentStatus} />
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm text-navy-700 sm:grid-cols-2">
          <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold-600" /> {booking.email}</p>
          <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold-600" /> {booking.phone}</p>
          <p className="flex items-center gap-2"><Tag className="h-4 w-4 text-gold-600" /> {booking.service}</p>
          <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gold-600" /> {formatDate(booking.createdAt)}</p>
        </div>

        {(booking.preferredDate || booking.preferredTime) && (
          <div className="rounded-sm bg-navy-50/60 p-4 text-sm text-navy-700">
            <p className="font-medium text-navy-900">Preferred Timing</p>
            <p className="mt-1">
              {booking.preferredDate ? formatDate(booking.preferredDate) : 'No date specified'}
              {booking.preferredTime ? ` · ${booking.preferredTime}` : ''}
            </p>
          </div>
        )}

        {booking.message && (
          <div>
            <p className="text-sm font-medium text-navy-900">Message</p>
            <p className="mt-1 whitespace-pre-line text-sm text-navy-600">{booking.message}</p>
          </div>
        )}

        <div className="border-t border-navy-900/10 pt-5">
          <label className="mb-1.5 block text-sm font-medium text-navy-900">Update Status</label>
          <div className="flex gap-3">
            <Select value={currentStatus} onChange={(e) => handleStatusChange(e.target.value as BookingStatus)} disabled={isSaving}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
