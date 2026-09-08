import 'server-only';
import connectToDatabase from '@/lib/db';
import SiteSettings from '@/models/SiteSettings';

/** Plain data shape used across the app — deliberately decoupled from the
 * Mongoose Document type so both the seeded document and the hardcoded
 * fallback below satisfy it without awkward casts. */
export interface SiteSettingsData {
  _id?: string;
  businessName: string;
  phone: string;
  email: string;
  logo?: string;
  favicon?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  address?: string;
  serviceAreas: string[];
  businessHours: { day: string; hours: string }[];
  footerText?: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  primaryColor: string;
  secondaryColor: string;
}

export const DEFAULT_SETTINGS: SiteSettingsData = {
  businessName: '5Kings Global',
  phone: '+1 404-431-3466',
  email: 'dgoodall@5kingsconcierges.com',
  logo: '',
  favicon: '',
  socialLinks: {},
  address: '',
  serviceAreas: ['Florida', 'Georgia', 'Mississippi', 'North Carolina', 'Tennessee', 'Texas'],
  businessHours: [],
  footerText: '© ' + new Date().getFullYear() + ' 5Kings Global. All Rights Reserved.',
  defaultSeoTitle: '5Kings Global | White Glove Security, Smart Home & Trade Services',
  defaultSeoDescription:
    '5Kings Global delivers white glove security, smart home, electrical, and solar services for homes and businesses — backed by a nationwide workforce network.',
  primaryColor: '#0a1730',
  secondaryColor: '#c19620',
};

/**
 * Site settings are a true singleton. This returns the one document,
 * seeding sensible (factual, not invented) defaults if none exists yet
 * so the site never renders with empty contact info.
 */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  await connectToDatabase();
  const settings = await SiteSettings.findOne().lean();
  if (settings) {
    return JSON.parse(JSON.stringify(settings)) as SiteSettingsData;
  }
  return DEFAULT_SETTINGS;
}
