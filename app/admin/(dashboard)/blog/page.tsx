'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Newspaper } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { BlogForm } from '@/components/admin/blog/BlogForm';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/FormField';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/providers/ToastProvider';
import { apiClient } from '@/lib/api-client';
import { formatDate } from '@/lib/utils/format';
import type { IBlogPost } from '@/models/BlogPost';

export default function AdminBlogPage() {
  const toast = useToast();
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalPost, setModalPost] = useState<IBlogPost | 'new' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IBlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      const data = await apiClient.get<IBlogPost[]>(`/api/admin/blog${status ? `?status=${status}` : ''}`);
      setPosts(data);
    } catch {
      toast.error('Unable to load blog posts');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/admin/blog/${deleteTarget._id}`);
      toast.success('Post deleted');
      setDeleteTarget(null);
      load();
    } catch {
      toast.error('Unable to delete post');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Manage articles published to the public blog."
        action={<Button onClick={() => setModalPost('new')}><Plus className="h-4 w-4" /> New Post</Button>}
      />

      <div className="mb-4">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-56">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-navy-400" /></div>
      ) : posts.length === 0 ? (
        <EmptyState icon={Newspaper} title="No posts yet" description="Write your first blog post." action={<Button onClick={() => setModalPost('new')}>New Post</Button>} />
      ) : (
        <Table>
          <Thead>
            <Th>Title</Th>
            <Th>Author</Th>
            <Th>Status</Th>
            <Th>Date</Th>
            <Th className="text-right">Actions</Th>
          </Thead>
          <Tbody>
            {posts.map((post) => (
              <Tr key={post._id.toString()}>
                <Td className="font-medium text-navy-950">{post.title}</Td>
                <Td>{post.author}</Td>
                <Td><StatusBadge status={post.status} /></Td>
                <Td>{formatDate(post.publishedAt || post.createdAt)}</Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setModalPost(post)} className="rounded-sm p-2 text-navy-500 hover:bg-navy-50 hover:text-navy-900" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteTarget(post)} className="rounded-sm p-2 text-navy-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={modalPost !== null} onClose={() => setModalPost(null)} title={modalPost === 'new' ? 'New Post' : 'Edit Post'} size="lg">
        {modalPost !== null && (
          <BlogForm
            post={modalPost === 'new' ? undefined : modalPost}
            onCancel={() => setModalPost(null)}
            onSaved={() => { setModalPost(null); toast.success('Post saved'); load(); }}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete post?"
        description={`This will permanently remove "${deleteTarget?.title}".`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
