import type { Metadata } from 'next';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils/cn';
import { formatCurrency } from '@/lib/utils/format';
import { getActivePricingPlans } from '@/lib/data/pricing';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent, quote-based pricing for 5Kings Global security, smart home, electrical, solar, and trade services.',
  alternates: { canonical: '/pricing' },
};

export const revalidate = 60;

const BILLING_LABEL: Record<string, string> = {
  'one-time': 'one-time',
  monthly: '/month',
  yearly: '/year',
  quote: '',
};

export default async function PricingPage() {
  const plans = await getActivePricingPlans();

  return (
    <div className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Straightforward pricing, built around your project"
          description="Every property and project is different. Most of our work is quote-based so you only pay for exactly what you need — request a quote and our team will follow up with clear pricing."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14">
          {plans.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title="Custom quotes for every project"
              description="5Kings Global pricing depends on the scope of work — service type, property size, and equipment needed. Request a free quote and our team will follow up with clear, upfront pricing."
              action={<Button href="/booking">Request a Quote</Button>}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan._id.toString()}
                  className={cn(
                    'flex flex-col rounded-md border p-8',
                    plan.isFeatured
                      ? 'border-gold-400 bg-navy-950 text-white shadow-premium'
                      : 'border-navy-900/10 bg-white shadow-card'
                  )}
                >
                  {plan.isFeatured && <Badge tone="gold" className="mb-4 w-fit">Most Popular</Badge>}
                  <h3 className={cn('font-display text-xl', plan.isFeatured ? 'text-white' : 'text-navy-950')}>
                    {plan.name}
                  </h3>
                  <p className={cn('mt-2 text-sm', plan.isFeatured ? 'text-white/70' : 'text-navy-600')}>
                    {plan.description}
                  </p>
                  <div className="mt-6">
                    {plan.billingType === 'quote' || plan.price == null ? (
                      <span className="font-display text-2xl">Custom Quote</span>
                    ) : (
                      <span className="font-display text-3xl">
                        {formatCurrency(plan.price)}
                        <span className="text-base font-normal">{BILLING_LABEL[plan.billingType]}</span>
                      </span>
                    )}
                  </div>
                  {plan.features.length > 0 && (
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className={cn(
                            'flex items-start gap-2.5 text-sm',
                            plan.isFeatured ? 'text-white/80' : 'text-navy-700'
                          )}
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button
                    href={plan.ctaUrl}
                    variant={plan.isFeatured ? 'gold' : 'outline'}
                    className="mt-8"
                  >
                    {plan.ctaText}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
