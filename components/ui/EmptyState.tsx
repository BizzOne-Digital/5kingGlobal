import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-navy-900/15 bg-navy-50/40 px-6 py-16 text-center">
      <Icon className="mb-4 h-10 w-10 text-navy-300" strokeWidth={1.5} />
      <h3 className="text-base font-semibold text-navy-900">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-navy-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
