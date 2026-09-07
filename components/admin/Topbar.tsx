'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Menu } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export function Topbar({
  name,
  role,
  onMenuClick,
}: {
  name: string;
  role: string;
  onMenuClick?: () => void;
}) {
  const router = useRouter();

  async function handleLogout() {
    await apiClient.post('/api/admin/logout');
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="flex h-16 items-center justify-between border-b border-navy-900/10 bg-white px-6">
      <button onClick={onMenuClick} className="rounded-sm p-2 text-navy-700 lg:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-navy-950">{name}</p>
          <p className="text-xs capitalize text-navy-500">{role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-sm border border-navy-900/15 px-3 py-1.5 text-sm text-navy-700 hover:bg-navy-50"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
