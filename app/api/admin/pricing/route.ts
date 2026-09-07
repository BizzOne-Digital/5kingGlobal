import connectToDatabase from '@/lib/db';
import PricingPlan from '@/models/PricingPlan';
import { requireAdmin } from '@/lib/auth/current-user';
import { pricingPlanSchema } from '@/lib/validations/pricingPlan';
import { jsonOk, jsonServerError } from '@/lib/utils/api-response';

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();
    const plans = await PricingPlan.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return jsonOk(JSON.parse(JSON.stringify(plans)));
  } catch (error) {
    return jsonServerError(error, 'Unable to load pricing plans');
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = pricingPlanSchema.parse(body);

    await connectToDatabase();
    const plan = await PricingPlan.create(data);
    return jsonOk(JSON.parse(JSON.stringify(plan)), 201);
  } catch (error) {
    return jsonServerError(error, 'Unable to create pricing plan');
  }
}
