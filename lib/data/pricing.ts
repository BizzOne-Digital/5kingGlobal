import 'server-only';
import connectToDatabase from '@/lib/db';
import PricingPlan, { type IPricingPlan } from '@/models/PricingPlan';

export async function getActivePricingPlans() {
  await connectToDatabase();
  const plans = await PricingPlan.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
  return JSON.parse(JSON.stringify(plans)) as IPricingPlan[];
}
