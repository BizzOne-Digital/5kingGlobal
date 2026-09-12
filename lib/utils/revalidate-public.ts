import { revalidatePath } from 'next/cache';

/**
 * Call this after any admin mutation that changes content shown on the
 * public site (branding/settings, services, products, pricing, blog,
 * testimonials, product categories).
 *
 * Why this exists: the public site's marketing pages are statically
 * rendered with ISR (revalidate: 60s/300s in their page files). Without an
 * explicit revalidation, an admin save only shows up once that window
 * naturally elapses AND another visitor's request triggers a background
 * re-render — it does not update immediately. This is invisible while
 * developing locally with `npm run dev` (no ISR cache there), which is why
 * a change "works on local" but doesn't appear right away once deployed.
 *
 * revalidatePath('/', 'layout') invalidates the entire public route tree
 * rooted at the shared layout (header, footer, and every page under it —
 * home, services, services/[slug], products, products/[slug], pricing,
 * blog, blog/[slug], etc.) so the very next request after a save gets
 * fresh data, with no waiting and nothing for an admin to manually clear.
 */
export function revalidatePublicContent() {
  revalidatePath('/', 'layout');
}
