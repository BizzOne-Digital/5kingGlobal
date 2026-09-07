import Image from 'next/image';
import Link from 'next/link';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function Logo({ logoUrl, light = false }: { logoUrl?: string; light?: boolean }) {
  if (logoUrl) {
    return (
      <Link href="/" className="relative block h-11 w-40">
        <Image src={logoUrl} alt="5Kings Global" fill className="object-contain object-left" priority />
      </Link>
    );
  }

  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-gold-gradient">
        <Crown className="h-5 w-5 text-navy-950" strokeWidth={2} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('font-display text-lg tracking-wide', light ? 'text-white' : 'text-navy-950')}>
          5KINGS
        </span>
        <span className={cn('text-[10px] font-semibold uppercase tracking-[0.3em]', light ? 'text-gold-300' : 'text-gold-600')}>
          Global
        </span>
      </span>
    </Link>
  );
}
