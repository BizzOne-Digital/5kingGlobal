/**
 * Development seed script.
 *
 * Seeds ONLY factual content extracted from the client's existing site
 * (https://5kingsconcierges.com) plus required site structure. It does NOT
 * create fake testimonials, products, pricing plans, or bookings — those
 * are added later by the admin as real business data comes in.
 *
 * Usage: npm run seed
 */
import './load-env';
import mongoose from 'mongoose';
import connectToDatabase from '../lib/db';
import SiteSettings from '../models/SiteSettings';
import Service from '../models/Service';
import User from '../models/User';
import { hashPassword } from '../lib/auth/password';
import { toSlug } from '../lib/utils/slugify';

const REAL_SERVICES = [
  {
    title: 'Security Systems',
    category: 'Security & CCTV',
    icon: 'security',
    shortDescription:
      'Quality, user-friendly security systems at an affordable price for residences and businesses.',
    description:
      '5Kings Global provides home and commercial security systems designed to meet your specific needs — from smart alarm systems to 24-hour monitoring. As a family-owned and operated business, we have a personal interest in protecting families and businesses throughout the communities we serve.',
    features: ['Residential security systems', 'Commercial security systems', 'Smart alarm systems', '24-hour monitoring'],
    isFeatured: true,
    sortOrder: 1,
  },
  {
    title: 'HD Cameras & CCTV',
    category: 'Security & CCTV',
    icon: 'cctv',
    shortDescription:
      'Real-time video that allows you to quickly identify any visitors or service providers that come to your home.',
    description:
      'Our HD camera and CCTV installations give homeowners and businesses real-time visibility into their property, so you can identify visitors or service providers as they arrive — day or night.',
    features: ['HD video cameras', 'Real-time remote viewing', 'Commercial CCTV systems'],
    isFeatured: true,
    sortOrder: 2,
  },
  {
    title: 'Solar Panel Installation',
    category: 'Electrical & Solar',
    icon: 'solar',
    shortDescription:
      'Going solar has many potential benefits, including lowering your energy bills and reducing your carbon footprint.',
    description:
      'Our solar panel installation service helps homeowners and businesses reduce energy costs and environmental impact. Our technicians handle the electrical work required for a safe, code-compliant installation.',
    features: ['Residential solar installation', 'Commercial solar installation'],
    isFeatured: true,
    sortOrder: 3,
  },
  {
    title: 'Medical Alert Systems',
    category: 'Security & CCTV',
    icon: 'medical',
    shortDescription: 'Medical alert systems designed for fast response when it matters most.',
    description:
      'Alongside our security offerings, 5Kings Global provides medical alert systems for households that want an added layer of protection and rapid response capability.',
    features: ['Medical alert monitoring'],
    isFeatured: false,
    sortOrder: 4,
  },
  {
    title: 'Fire Alarms',
    category: 'Security & CCTV',
    icon: 'security',
    shortDescription: 'Residential and commercial fire alarm systems.',
    description:
      '5Kings Global installs and services fire alarm systems for both residential and commercial properties as part of our comprehensive security offering.',
    features: ['Residential fire alarms', 'Commercial fire alarm systems'],
    isFeatured: false,
    sortOrder: 5,
  },
  {
    title: 'Handyman Services',
    category: 'Handyman & Trades',
    icon: 'handyman',
    shortDescription:
      'Highly experienced repair work for any part of your home — pressure washing, carpet cleaning, TV mounting, painting, construction, roofing, and HVAC/plumbing.',
    description:
      'Our handyman and skilled trade network handles the work that keeps a home or business running: pressure washing, carpet cleaning, TV mounting, painting, construction, roofing, and HVAC/plumbing — coordinated through 5Kings Global so you only have to make one call.',
    features: ['Pressure washing', 'Carpet cleaning', 'TV mounting', 'Painting', 'Construction', 'Roofing', 'HVAC & plumbing'],
    isFeatured: true,
    sortOrder: 6,
  },
];

async function seed() {
  await connectToDatabase();
  console.log('Connected to database.');

  // --- Site Settings (singleton) ---
  const existingSettings = await SiteSettings.findOne();
  if (!existingSettings) {
    await SiteSettings.create({
      businessName: '5Kings Global',
      phone: '+1 404-431-3466',
      email: 'dgoodall@5kingsconcierges.com',
      socialLinks: {},
      serviceAreas: ['Florida', 'Georgia', 'Mississippi', 'North Carolina', 'Tennessee', 'Texas'],
      businessHours: [],
      footerText: `© ${new Date().getFullYear()} 5Kings Global. All Rights Reserved.`,
      defaultSeoTitle: '5Kings Global | White Glove Security, Smart Home & Trade Services',
      defaultSeoDescription:
        '5Kings Global delivers white glove security, smart home, electrical, solar, and skilled trade services for homes and businesses — backed by a nationwide workforce development network.',
      primaryColor: '#0a1730',
      secondaryColor: '#c19620',
    });
    console.log('Seeded SiteSettings.');
  } else {
    console.log('SiteSettings already exists — skipped.');
  }

  // --- Services ---
  for (const service of REAL_SERVICES) {
    const slug = toSlug(service.title);
    const existing = await Service.findOne({ slug });
    if (existing) {
      console.log(`Service "${service.title}" already exists — skipped.`);
      continue;
    }
    await Service.create({ ...service, slug, isActive: true });
    console.log(`Seeded service: ${service.title}`);
  }

  // --- Optional admin user (only if credentials are provided via env) ---
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminName = process.env.SEED_ADMIN_NAME || 'Site Administrator';

  if (adminEmail && adminPassword) {
    const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!existingUser) {
      const passwordHash = await hashPassword(adminPassword);
      await User.create({ name: adminName, email: adminEmail.toLowerCase(), passwordHash, role: 'admin' });
      console.log(`Seeded admin user: ${adminEmail}`);
    } else {
      console.log('Admin user already exists — skipped.');
    }
  } else {
    console.log('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — skipping admin user creation.');
  }

  console.log('Seed complete.');
  await mongoose.connection.close();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
