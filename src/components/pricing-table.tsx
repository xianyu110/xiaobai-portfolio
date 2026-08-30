'use client';

import { useState, type ComponentType, type SVGProps } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Check } from 'lucide-react';

import { apiPost } from '@/lib/api-client';
import { currentPathWithQuery } from '@/lib/redirect';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { Button } from '@/components/ui/button';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type PricingFeature =
  | string
  | { icon?: IconComponent; label: string; tooltip?: string };

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  price: string;
  originalPrice?: string;
  currency?: string;
  interval?: string;
  featured?: boolean;
  badge?: string;
  features: PricingFeature[];
  buttonText?: string;
  productId?: string;
  productName?: string;
  paymentProvider?: string;
  priceInCents?: number;
  credits?: number;
  creditsValidDays?: number;
  plan?: {
    name: string;
    interval: string;
    intervalCount: number;
  };
}

export interface PricingGroup {
  key: string;
  label: string;
  plans: PricingPlan[];
}

export function PricingTable({
  groups,
  onCheckout,
}: {
  groups: PricingGroup[];
  onCheckout?: (plan: PricingPlan) => void;
}) {
  const [activeGroup, setActiveGroup] = useState(groups[0]?.key || '');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const currentGroup = groups.find((g) => g.key === activeGroup) || groups[0];

  const checkoutMutation = useMutation({
    mutationFn: (plan: PricingPlan) =>
      apiPost<{ checkout_url?: string }>('/api/payment/checkout', {
        product_id: plan.productId,
        product_name: plan.productName || plan.name,
        plan_name: plan.plan?.name || plan.name,
        price: plan.priceInCents,
        currency: plan.currency || 'usd',
        type: plan.plan ? 'subscription' : 'one-time',
        description: plan.name,
        plan: plan.plan,
        credits: plan.credits,
        credits_valid_days: plan.creditsValidDays,
        payment_provider: plan.paymentProvider || 'stripe',
        // Come back to the page the user paid from.
        redirect: currentPathWithQuery('/settings/billing'),
      }),
    onSuccess: (data) => {
      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      }
    },
    onSettled: () => {
      setLoadingId(null);
    },
  });

  function handleCheckout(plan: PricingPlan) {
    if (onCheckout) {
      onCheckout(plan);
      return;
    }

    if (!plan.productId || !plan.priceInCents) return;

    setLoadingId(plan.id);
    checkoutMutation.mutate(plan);
  }

  return (
    <div className="space-y-10">
      {/* Group tabs — pill toggle */}
      {groups.length > 1 && (
        <div className="flex justify-center">
          <div className="border-border bg-muted/40 inline-flex items-center rounded-full border p-1">
            {groups.map((group) => (
              <button
                key={group.key}
                onClick={() => setActiveGroup(group.key)}
                className={cn(
                  'rounded-full px-5 py-1.5 text-sm font-medium transition-colors',
                  activeGroup === group.key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {group.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Plans grid */}
      <div
        className={cn(
          'mx-auto grid gap-6',
          currentGroup?.plans.length === 2
            ? 'max-w-3xl sm:grid-cols-2'
            : currentGroup?.plans.length === 3
              ? 'max-w-5xl sm:grid-cols-2 lg:grid-cols-3'
              : 'max-w-6xl sm:grid-cols-2 lg:grid-cols-4'
        )}
      >
        {currentGroup?.plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'border-border relative flex flex-col rounded-2xl border p-8 transition-all',
              plan.featured
                ? 'bg-card ring-foreground/10 shadow-md ring-1'
                : 'bg-background hover:border-foreground/30'
            )}
          >
            {/* Plan name */}
            {plan.name && (
              <p className="text-foreground mb-2 text-sm font-medium">
                {plan.name}
              </p>
            )}

            {/* Price */}
            <div className="mb-2 flex items-baseline gap-1">
              <span className="font-serif text-5xl tracking-tight">
                {plan.price}
              </span>
              {plan.interval && (
                <span className="text-muted-foreground text-sm">
                  /{plan.interval}
                </span>
              )}
            </div>
            {plan.originalPrice && (
              <span className="text-muted-foreground mb-1 text-sm line-through">
                {plan.originalPrice}
              </span>
            )}

            {/* Description */}
            {plan.description && (
              <p className="text-muted-foreground mb-8 text-sm">
                {plan.description}
              </p>
            )}

            {/* CTA — full-width pill */}
            <Button
              variant={plan.featured ? 'default' : 'outline'}
              className="h-10 w-full rounded-full text-sm font-medium"
              onClick={() => handleCheckout(plan)}
              disabled={loadingId === plan.id}
            >
              {loadingId === plan.id
                ? m['common.pricing.processing']()
                : plan.buttonText || m['common.pricing.get_started']()}
            </Button>

            {/* Features */}
            <ul className="mt-8 space-y-3">
              {plan.features.map((feature, i) => {
                const isObj = typeof feature !== 'string';
                const Icon: IconComponent = (isObj && feature.icon) || Check;
                const label = isObj ? feature.label : feature;
                return (
                  <li key={i} className="flex items-center gap-2.5 text-sm">
                    <Icon className="text-muted-foreground size-4 shrink-0" />
                    <span className="text-foreground/90">{label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
