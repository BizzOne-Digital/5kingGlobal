'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Trash2, Eye, CalendarCheck } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchInput } from '@/components/admin/SearchInput';
import { BookingDetailModal } from '@/components/admin/bookings/BookingDetailModal';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { Select } from '@/components/ui/FormField';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/providers/ToastProvider';
import { apiClient } from '@/lib/api-client';
import { formatDate } from '@/lib/utils/format';
import type { IBooking } from '@/models/Booking';

interface BookingListResponse {
  items: IBooking[];
  page: number;
  totalPages: number;
}

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-navy-400" /></div>}>
      <AdminBookingsContent />
    </Suspense>
  );
}

function AdminBookingsContent() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const [data, setData] = useState<BookingListResponse>({ items: [], page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<IBooking | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IBooking | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      params.set('page', String(page));
      const result = await apiClient.get<BookingListResponse>(`/api/admin/bookings?${params.toString()}`);
      setData(result);
    } catch {
      toast.error('Unable to load bookings');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, page]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/admin/bookings/${deleteTarget._id}`);
      toast.success('Booking deleted');
      setDeleteTarget(null);
      load();
    } catch {
      toast.error('Unable to delete booking');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader title="Bookings" description="Review and manage service booking requests." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search bookings…" />
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="sm:w-56">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-navy-400" /></div>
      ) : data.items.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No bookings found" description="Bookings submitted through the site will appear here." />
      ) : (
        <>
          <Table>
            <Thead>
              <Th>Name</Th>
              <Th>Service</Th>
              <Th>Submitted</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </Thead>
            <Tbody>
              {data.items.map((booking) => (
                <Tr key={booking._id.toString()}>
                  <Td className="font-medium text-navy-950">{booking.name}</Td>
                  <Td>{booking.service}</Td>
                  <Td>{formatDate(booking.createdAt)}</Td>
                  <Td><StatusBadge status={booking.status} /></Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setSelected(booking)} className="rounded-sm p-2 text-navy-500 hover:bg-navy-50 hover:text-navy-900" aria-label="View"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteTarget(booking)} className="rounded-sm p-2 text-navy-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <div className="mt-2"><Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} /></div>
        </>
      )}

      <BookingDetailModal booking={selected} onClose={() => setSelected(null)} onUpdated={load} />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete booking?"
        description={`This will permanently remove the booking from "${deleteTarget?.name}".`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
