import connectToDatabase from '@/lib/db';
import PricingPlan from '@/models/PricingPlan';
import { requireAdmin } from '@/lib/auth/current-user';
import { pricingPlanUpdateSchema } from '@/lib/validations/pricingPlan';
import { isValidObjectId } from '@/lib/utils/objectId';
import { jsonError, jsonNotFound, jsonOk, jsonServerError } from '@/lib/utils/api-response';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    const body = await request.json();
    const data = pricingPlanUpdateSchema.parse(body);

    await connectToDatabase();
    const plan = await PricingPlan.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!plan) return jsonNotFound('Pricing plan not found');
    return jsonOk(JSON.parse(JSON.stringify(plan)));
  } catch (error) {
    return jsonServerError(error, 'Unable to update pricing plan');
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    await connectToDatabase();
    const plan = await PricingPlan.findByIdAndDelete(id).lean();
    if (!plan) return jsonNotFound('Pricing plan not found');
    return jsonOk({ deleted: true });
  } catch (error) {
    return jsonServerError(error, 'Unable to delete pricing plan');
  }
}
