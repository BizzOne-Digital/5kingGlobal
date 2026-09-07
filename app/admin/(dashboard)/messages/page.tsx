'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Trash2, Eye, Mail } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchInput } from '@/components/admin/SearchInput';
import { MessageDetailModal } from '@/components/admin/messages/MessageDetailModal';
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
import type { IContactMessage } from '@/models/ContactMessage';

interface MessageListResponse {
  items: IContactMessage[];
  page: number;
  totalPages: number;
}

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-navy-400" /></div>}>
      <AdminMessagesContent />
    </Suspense>
  );
}

function AdminMessagesContent() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const [data, setData] = useState<MessageListResponse>({ items: [], page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<IContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      params.set('page', String(page));
      const result = await apiClient.get<MessageListResponse>(`/api/admin/contact?${params.toString()}`);
      setData(result);
    } catch {
      toast.error('Unable to load messages');
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
      await apiClient.delete(`/api/admin/contact/${deleteTarget._id}`);
      toast.success('Message deleted');
      setDeleteTarget(null);
      load();
    } catch {
      toast.error('Unable to delete message');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader title="Messages" description="Contact form submissions from the public site." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search messages…" />
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="sm:w-56">
          <option value="">All Statuses</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-navy-400" /></div>
      ) : data.items.length === 0 ? (
        <EmptyState icon={Mail} title="No messages found" description="Contact form submissions will appear here." />
      ) : (
        <>
          <Table>
            <Thead>
              <Th>Name</Th>
              <Th>Subject</Th>
              <Th>Received</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </Thead>
            <Tbody>
              {data.items.map((message) => (
                <Tr key={message._id.toString()}>
                  <Td className="font-medium text-navy-950">{message.name}</Td>
                  <Td>{message.subject}</Td>
                  <Td>{formatDate(message.createdAt)}</Td>
                  <Td><StatusBadge status={message.status} /></Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setSelected(message)} className="rounded-sm p-2 text-navy-500 hover:bg-navy-50 hover:text-navy-900" aria-label="View"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteTarget(message)} className="rounded-sm p-2 text-navy-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <div className="mt-2"><Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} /></div>
        </>
      )}

      <MessageDetailModal message={selected} onClose={() => setSelected(null)} onUpdated={load} />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete message?"
        description={`This will permanently remove the message from "${deleteTarget?.name}".`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
