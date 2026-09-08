'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ShoppingBag } from 'lucide-react';
import { Logo } from './Logo';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils/cn';
import { useCart } from '@/components/providers/CartProvider';
import type { SiteSettingsData } from '@/lib/data/settings';

export function Header({ settings }: { settings: SiteSettingsData }) {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled || isOpen ? 'bg-white/95 shadow-card backdrop-blur' : 'bg-transparent'
      )}
    >
      <Container>
        <div className="flex h-28 items-center justify-between">
          <Logo logoUrl={settings.logo} />

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium tracking-wide transition-colors',
                  'text-navy-800 hover:text-navy-950',
                  pathname === link.href && 'text-gold-600'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-2 text-sm font-medium text-navy-800"
            >
              <Phone className="h-4 w-4" />
              {settings.phone}
            </a>
            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative rounded-sm p-2 text-navy-900"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-navy-950">
                  {itemCount}
                </span>
              )}
            </button>
            <Button href="/booking" variant="gold" size="sm">
              Book a Service
            </Button>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <button onClick={openCart} aria-label="Open cart" className="relative rounded-sm p-2 text-navy-900">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-navy-950">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              className="rounded-sm p-2 text-navy-900"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </Container>

      {isOpen && (
        <div className="border-t border-navy-900/10 bg-white px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-base font-medium text-navy-900">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 text-sm font-medium text-navy-800">
              <Phone className="h-4 w-4" />
              {settings.phone}
            </a>
            <Button href="/booking" variant="gold" size="sm" className="w-full">
              Book a Service
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
