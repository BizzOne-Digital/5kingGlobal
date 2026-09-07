export const SITE_NAME = '5Kings Global';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const SERVICE_AREAS = [
  'Florida',
  'Georgia',
  'Mississippi',
  'North Carolina',
  'Tennessee',
  'Texas',
];

export const CUSTOMER_TYPES: { value: string; label: string }[] = [
  { value: 'residential', label: 'Residential Homeowner' },
  { value: 'commercial', label: 'Commercial / Business' },
  { value: 'professional', label: 'Professional / Recruit Inquiry' },
];

export const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Services', href: '/admin/services', icon: 'Wrench' },
  { label: 'Products', href: '/admin/products', icon: 'Package' },
  { label: 'Bookings', href: '/admin/bookings', icon: 'CalendarCheck' },
  { label: 'Messages', href: '/admin/messages', icon: 'Mail' },
  { label: 'Blog', href: '/admin/blog', icon: 'Newspaper' },
  { label: 'Pricing', href: '/admin/pricing', icon: 'Tag' },
  { label: 'Testimonials', href: '/admin/testimonials', icon: 'Quote' },
  { label: 'Media Library', href: '/admin/media', icon: 'Image' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
];
