import { getActivePricingPlans } from '@/lib/data/pricing';
import { jsonOk, jsonServerError } from '@/lib/utils/api-response';

export async function GET() {
  try {
    const plans = await getActivePricingPlans();
    return jsonOk(plans);
  } catch (error) {
    return jsonServerError(error, 'Unable to load pricing');
  }
}
