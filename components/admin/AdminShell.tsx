'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AdminShell({
  name,
  role,
  children,
}: {
  name: string;
  role: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-navy-50/40">
      <Sidebar className="hidden lg:flex" />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <Sidebar className="flex" />
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="flex-1 bg-navy-950/50 backdrop-blur-sm"
          >
            <span className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white">
              <X className="h-5 w-5" />
            </span>
          </button>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <Topbar name={name} role={role} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
