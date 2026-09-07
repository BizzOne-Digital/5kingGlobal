import { getSiteSettings } from '@/lib/data/settings';
import { jsonOk, jsonServerError } from '@/lib/utils/api-response';

// Public read-only endpoint — site settings contain only business-public
// information (name, phone, email, social links, hours), never secrets.
export async function GET() {
  try {
    const settings = await getSiteSettings();
    return jsonOk(settings);
  } catch (error) {
    return jsonServerError(error, 'Unable to load site settings');
  }
}
