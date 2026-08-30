import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Activity, CreditCard, Key, TrendingUp } from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { apiGet } from '@/lib/api-client';
import { m } from '@/paraglide/messages.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Subscription = {
  status: string;
  planName?: string | null;
  productName?: string | null;
};

function DashboardPage() {
  const { data: session } = useSession();

  const { data: creditsData } = useQuery({
    queryKey: ['user-credits'],
    queryFn: () => apiGet<{ balance: number }>('/api/credits'),
  });
  const { data: apiKeysData } = useQuery({
    queryKey: ['user-apikeys'],
    queryFn: () => apiGet<unknown[]>('/api/apikeys'),
  });
  const { data: subscriptionData } = useQuery({
    queryKey: ['user-subscription-current'],
    queryFn: () =>
      apiGet<Subscription | null>('/api/user/subscriptions/current'),
  });

  const credits = creditsData?.balance ?? null;
  const apiKeys = apiKeysData?.length ?? null;
  const subscription = subscriptionData ?? null;

  const planLabel =
    subscription?.planName ||
    subscription?.productName ||
    m['settings.overview.plan_free']();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {m['settings.title']()}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {m['settings.welcome']({
            name: session?.user?.name || session?.user?.email || '',
          })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {m['settings.overview.plan']()}
            </CardTitle>
            <TrendingUp className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planLabel}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              {m['settings.overview.plan_description']()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {m['settings.credits.title']()}
            </CardTitle>
            <CreditCard className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{credits ?? '—'}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              {m['settings.credits.description']()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {m['settings.apikeys.title']()}
            </CardTitle>
            <Key className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys ?? '—'}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              {m['settings.overview.apikeys_description']()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {m['settings.overview.usage']()}
            </CardTitle>
            <Activity className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground mt-1 text-xs">
              {m['settings.overview.usage_description']()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {m['settings.overview.getting_started']()}
          </CardTitle>
          <CardDescription>
            {m['settings.overview.getting_started_description']()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-border text-muted-foreground rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm">{m['settings.placeholder']()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute('/settings/')({
  component: DashboardPage,
});
