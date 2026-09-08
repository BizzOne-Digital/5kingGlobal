import Link from 'next/link';
import { Phone, Mail, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';
import type { SiteSettingsData } from '@/lib/data/settings';

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
} as const;

export function Footer({ settings }: { settings: SiteSettingsData }) {
  const socialEntries = Object.entries(settings.socialLinks || {}).filter(([, url]) => url);

  return (
    <footer className="bg-navy-gradient text-white">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo logoUrl={settings.logo} light />
            <p className="mt-5 text-sm leading-relaxed text-white/70">
              One company. Multiple solutions. Security, smart home, electrical, solar, skilled
              trades, and workforce development — delivered with a white glove standard of service.
            </p>
            {socialEntries.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socialEntries.map(([key, url]) => {
                  const Icon = socialIcons[key as keyof typeof socialIcons];
                  if (!Icon || !url) return null;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-gold-500 hover:text-navy-950"
                      aria-label={key}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Company</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/products" className="hover:text-white">Products</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/about#careers" className="hover:text-white">Careers &amp; Recruiting</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Service Areas</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {settings.serviceAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Get In Touch</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li>
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 hover:text-white">
                  <Phone className="h-4 w-4 text-gold-400" /> {settings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-white">
                  <Mail className="h-4 w-4 text-gold-400" /> {settings.email}
                </a>
              </li>
              {settings.address && <li>{settings.address}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 md:flex-row">
          <p>{settings.footerText || `© ${new Date().getFullYear()} ${settings.businessName}. All Rights Reserved.`}</p>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/admin/login" className="hover:text-white">Staff Login</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
