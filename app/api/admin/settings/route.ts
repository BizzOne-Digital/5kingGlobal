import connectToDatabase from '@/lib/db';
import SiteSettings from '@/models/SiteSettings';
import { requireAdmin } from '@/lib/auth/current-user';
import { siteSettingsUpdateSchema } from '@/lib/validations/siteSettings';
import { DEFAULT_SETTINGS } from '@/lib/data/settings';
import { jsonOk, jsonServerError } from '@/lib/utils/api-response';

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();
    const settings = await SiteSettings.findOne().lean();
    return jsonOk(JSON.parse(JSON.stringify(settings || DEFAULT_SETTINGS)));
  } catch (error) {
    return jsonServerError(error, 'Unable to load settings');
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = siteSettingsUpdateSchema.parse(body);

    await connectToDatabase();
    const settings = await SiteSettings.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }).lean();

    return jsonOk(JSON.parse(JSON.stringify(settings)));
  } catch (error) {
    return jsonServerError(error, 'Unable to update settings');
  }
}
