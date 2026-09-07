import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/components/providers/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { getSiteSettings } from '@/lib/data/settings';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <CartProvider>
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
      <CartDrawer />
    </CartProvider>
  );
}
