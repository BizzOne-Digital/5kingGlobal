import { cn } from '@/lib/utils/cn';

const toneClasses: Record<string, string> = {
  neutral: 'bg-navy-900/5 text-navy-800',
  gold: 'bg-gold-100 text-gold-800',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-sky-50 text-sky-700',
};

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof toneClasses;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
