'use client';

import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Check,
  Folder,
  Folders,
  Headphones,
  Infinity as InfinityIcon,
  Mail,
  Puzzle,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { useRouter } from '@/core/i18n/navigation';
import { apiPost } from '@/lib/api-client';
import { currentPathWithQuery } from '@/lib/redirect';
import { m } from '@/paraglide/messages.js';
import { usePublicConfig } from '@/hooks/use-public-config';
import {
  PaymentProviderModal,
  type PaymentProvider,
} from '@/components/payment-provider-modal';
import {
  PricingTable,
  type PricingGroup,
  type PricingPlan,
} from '@/components/pricing-table';

const ALL_PROVIDERS: PaymentProvider[] = [
  'stripe',
  'creem',
  'paypal',
  'alipay',
  'wechat',
];

export function Pricing({ title }: { title?: string } = {}) {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: configsData } = usePublicConfig();
  const configs = configsData ?? {};
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<PricingPlan | null>(null);
  const [loadingProvider, setLoadingProvider] =
    useState<PaymentProvider | null>(null);

  const enabledProviders = useMemo<PaymentProvider[]>(
    () => ALL_PROVIDERS.filter((p) => configs[`${p}_enabled`] === 'true'),
    [configs]
  );

  const starterFeatures = [
    { icon: Folder, label: m['landing.pricing.feature_1_project']() },
    { icon: Sparkles, label: m['landing.pricing.feature_5k_credits']() },
    { icon: Mail, label: m['landing.pricing.feature_email_support']() },
  ];
  const proFeatures = [
    { icon: Folders, label: m['landing.pricing.feature_unlimited_projects']() },
    { icon: Sparkles, label: m['landing.pricing.feature_50k_credits']() },
    { icon: Zap, label: m['landing.pricing.feature_priority_support']() },
    { icon: Terminal, label: m['landing.pricing.feature_api_access']() },
  ];
  const enterpriseFeatures = [
    { icon: Check, label: m['landing.pricing.feature_everything_pro']() },
    {
      icon: InfinityIcon,
      label: m['landing.pricing.feature_unlimited_credits'](),
    },
    {
      icon: Headphones,
      label: m['landing.pricing.feature_dedicated_support'](),
    },
    { icon: Puzzle, label: m['landing.pricing.feature_custom_integrations']() },
  ];

  const groups: PricingGroup[] = [
    {
      key: 'monthly',
      label: m['landing.pricing.monthly'](),
      plans: [
        {
          id: 'starter-monthly',
          name: m['landing.pricing.starter'](),
          description: m['landing.pricing.starter_desc'](),
          price: '$9',
          interval: 'mo',
          features: starterFeatures,
          productId: 'starter_monthly',
          priceInCents: 900,
          currency: 'usd',
          credits: 5000,
          plan: { name: 'Starter', interval: 'month', intervalCount: 1 },
        },
        {
          id: 'pro-monthly',
          name: m['landing.pricing.pro'](),
          description: m['landing.pricing.pro_desc'](),
          price: '$29',
          interval: 'mo',
          featured: true,
          badge: m['landing.pricing.popular'](),
          features: proFeatures,
          productId: 'pro_monthly',
          priceInCents: 2900,
          currency: 'usd',
          credits: 50000,
          plan: { name: 'Pro', interval: 'month', intervalCount: 1 },
        },
        {
          id: 'enterprise-monthly',
          name: m['landing.pricing.enterprise'](),
          description: m['landing.pricing.enterprise_desc'](),
          price: '$99',
          interval: 'mo',
          features: enterpriseFeatures,
          productId: 'enterprise_monthly',
          priceInCents: 9900,
          currency: 'usd',
          credits: 500000,
          plan: { name: 'Enterprise', interval: 'month', intervalCount: 1 },
        },
      ],
    },
    {
      key: 'yearly',
      label: m['landing.pricing.yearly'](),
      plans: [
        {
          id: 'starter-yearly',
          name: m['landing.pricing.starter'](),
          description: m['landing.pricing.starter_desc'](),
          price: '$86',
          originalPrice: '$108',
          interval: 'yr',
          features: starterFeatures,
          productId: 'starter_yearly',
          priceInCents: 8600,
          currency: 'usd',
          credits: 60000,
          plan: { name: 'Starter', interval: 'year', intervalCount: 1 },
        },
        {
          id: 'pro-yearly',
          name: m['landing.pricing.pro'](),
          description: m['landing.pricing.pro_desc'](),
          price: '$278',
          originalPrice: '$348',
          interval: 'yr',
          featured: true,
          badge: m['landing.pricing.popular'](),
          features: proFeatures,
          productId: 'pro_yearly',
          priceInCents: 27800,
          currency: 'usd',
          credits: 600000,
          plan: { name: 'Pro', interval: 'year', intervalCount: 1 },
        },
        {
          id: 'enterprise-yearly',
          name: m['landing.pricing.enterprise'](),
          description: m['landing.pricing.enterprise_desc'](),
          price: '$950',
          originalPrice: '$1,188',
          interval: 'yr',
          features: enterpriseFeatures,
          productId: 'enterprise_yearly',
          priceInCents: 95000,
          currency: 'usd',
          credits: 6000000,
          plan: { name: 'Enterprise', interval: 'year', intervalCount: 1 },
        },
      ],
    },
    {
      key: 'lifetime',
      label: m['landing.pricing.lifetime'](),
      plans: [
        {
          id: 'starter-lifetime',
          name: m['landing.pricing.starter'](),
          description: m['landing.pricing.starter_desc'](),
          price: '$149',
          features: starterFeatures,
          productId: 'starter_lifetime',
          priceInCents: 14900,
          currency: 'usd',
          credits: 100000,
          buttonText: m['landing.pricing.buy_lifetime'](),
        },
        {
          id: 'pro-lifetime',
          name: m['landing.pricing.pro'](),
          description: m['landing.pricing.pro_desc'](),
          price: '$499',
          features: proFeatures,
          featured: true,
          badge: m['landing.pricing.best_value'](),
          productId: 'pro_lifetime',
          priceInCents: 49900,
          currency: 'usd',
          credits: 1000000,
          buttonText: m['landing.pricing.buy_lifetime'](),
        },
        {
          id: 'enterprise-lifetime',
          name: m['landing.pricing.enterprise'](),
          description: m['landing.pricing.enterprise_desc'](),
          price: '$1,999',
          features: enterpriseFeatures,
          productId: 'enterprise_lifetime',
          priceInCents: 199900,
          currency: 'usd',
          credits: 10000000,
          buttonText: m['landing.pricing.buy_lifetime'](),
        },
      ],
    },
  ];

  const checkoutMutation = useMutation({
    mutationFn: ({
      plan,
      provider,
    }: {
      plan: PricingPlan;
      provider: PaymentProvider;
    }) =>
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
        payment_provider: provider,
        // Come back to the page the user paid from.
        redirect: currentPathWithQuery('/settings/billing'),
      }),
    onSuccess: (data) => {
      if (!data?.checkout_url) {
        toast.error('Checkout failed');
        setLoadingProvider(null);
        return;
      }
      window.location.href = data.checkout_url;
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Checkout failed');
      setLoadingProvider(null);
    },
  });

  function startCheckout(plan: PricingPlan, provider: PaymentProvider) {
    setLoadingProvider(provider);
    checkoutMutation.mutate({ plan, provider });
  }

  async function handleCheckout(plan: PricingPlan) {
    if (!session?.user) {
      const callbackUrl = encodeURIComponent(currentPathWithQuery('/pricing'));
      router.push(`/sign-in?callbackUrl=${callbackUrl}`);
      return;
    }

    const selectEnabled = configs.select_payment_enabled === 'true';
    const defaultProvider = (configs.default_payment_provider ||
      enabledProviders[0] ||
      'stripe') as PaymentProvider;

    if (selectEnabled && enabledProviders.length > 1) {
      setPendingPlan(plan);
      setModalOpen(true);
      return;
    }

    await startCheckout(plan, defaultProvider);
  }

  function handleProviderSelect(provider: PaymentProvider) {
    if (!pendingPlan) return;
    startCheckout(pendingPlan, provider);
  }

  return (
    <section
      id="pricing"
      className="border-border border-t px-4 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-20 text-center">
          <h2 className="font-serif text-4xl font-normal tracking-tight sm:text-5xl">
            {title ?? m['landing.pricing.title']()}
          </h2>
          <p className="text-muted-foreground mt-5">
            {m['landing.pricing.description']()}
          </p>
        </div>
        <PricingTable groups={groups} onCheckout={handleCheckout} />
      </div>

      <PaymentProviderModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) {
            setPendingPlan(null);
            setLoadingProvider(null);
          }
        }}
        providers={enabledProviders.length ? enabledProviders : ['stripe']}
        loadingProvider={loadingProvider}
        onSelect={handleProviderSelect}
        planName={pendingPlan?.name}
        price={pendingPlan?.price}
      />
    </section>
  );
}
