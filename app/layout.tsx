import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { getSiteSettings } from '@/lib/data/settings';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['500', '600', '700'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.defaultSeoTitle,
      template: `%s | ${settings.businessName}`,
    },
    description: settings.defaultSeoDescription,
    openGraph: {
      title: settings.defaultSeoTitle,
      description: settings.defaultSeoDescription,
      url: siteUrl,
      siteName: settings.businessName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.defaultSeoTitle,
      description: settings.defaultSeoDescription,
    },
    icons: settings.favicon ? { icon: settings.favicon } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: '#0a1730',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: settings.businessName,
    telephone: settings.phone,
    email: settings.email,
    url: siteUrl,
    areaServed: settings.serviceAreas,
    sameAs: Object.values(settings.socialLinks || {}).filter(Boolean),
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
