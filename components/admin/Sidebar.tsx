'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wrench,
  Package,
  CalendarCheck,
  Mail,
  Newspaper,
  Tag,
  Quote,
  Image as ImageIcon,
  Settings,
  Crown,
} from 'lucide-react';
import { ADMIN_NAV } from '@/lib/constants';
import { cn } from '@/lib/utils/cn';

const ICONS = {
  LayoutDashboard,
  Wrench,
  Package,
  CalendarCheck,
  Mail,
  Newspaper,
  Tag,
  Quote,
  Image: ImageIcon,
  Settings,
} as const;

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn('flex h-full w-64 flex-col bg-navy-950 text-white', className)}>
      <div className="flex items-center gap-2.5 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-gold-gradient">
          <Crown className="h-5 w-5 text-navy-950" />
        </span>
        <div>
          <p className="font-display text-base leading-none">5Kings Global</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gold-300">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {ADMIN_NAV.map((item) => {
          const Icon = ICONS[item.icon as keyof typeof ICONS];
          const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-5 text-xs text-white/40">
        <Link href="/" className="hover:text-white/70">← Back to public site</Link>
      </div>
    </aside>
  );
}
