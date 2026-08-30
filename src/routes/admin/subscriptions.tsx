import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { tDynamic } from '@/core/i18n/dynamic';
import { apiGet, type PageResult } from '@/lib/api-client';
import { formatDateTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { DataTable, type Column } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Subscription {
  id: string;
  subscriptionNo: string;
  userId: string;
  userEmail: string | null;
  status: string;
  amount: number | null;
  currency: string | null;
  interval: string | null;
  paymentProvider: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  description: string | null;
  createdAt: string;
}

const PAGE_SIZE = 20;

const TABS = ['all', 'month', 'year'] as const;
type Tab = (typeof TABS)[number];

function SubscriptionsPage() {
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [tab, debouncedSearch]);

  const query = useQuery({
    queryKey: ['admin-subscriptions', page, tab, debouncedSearch],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (tab === 'month') params.set('interval', 'month');
      if (tab === 'year') params.set('interval', 'year');
      if (debouncedSearch) params.set('search', debouncedSearch);
      return apiGet<PageResult<Subscription>>(
        `/api/admin/subscriptions?${params}`
      );
    },
    placeholderData: keepPreviousData,
  });

  const subscriptions = query.data?.items ?? [];
  const total = query.data?.total ?? 0;

  function formatAmount(amount: number | null, currency: string | null) {
    if (amount == null) return '—';
    const value = amount / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(value);
  }

  function formatDate(d: string | null) {
    if (!d) return '—';
    return formatDateTime(d);
  }

  const statusVariant = (s: string) => {
    if (s === 'active' || s === 'trialing') return 'default' as const;
    if (s === 'canceled' || s === 'expired') return 'destructive' as const;
    return 'secondary' as const;
  };

  const columns: Column<Subscription>[] = [
    {
      header: m['admin.subscriptions.subscription_no'](),
      cell: (s) => (
        <span className="font-mono text-xs">{s.subscriptionNo}</span>
      ),
    },
    {
      header: m['admin.subscriptions.user'](),
      cell: (s) => <span className="text-sm">{s.userEmail || s.userId}</span>,
    },
    {
      header: m['admin.subscriptions.amount'](),
      cell: (s) => (
        <span className="font-medium">
          {formatAmount(s.amount, s.currency)}
        </span>
      ),
    },
    {
      header: m['admin.subscriptions.interval'](),
      cell: (s) => s.interval || '—',
    },
    {
      header: m['admin.subscriptions.status'](),
      cell: (s) => <Badge variant={statusVariant(s.status)}>{s.status}</Badge>,
    },
    {
      header: m['admin.subscriptions.provider'](),
      cell: (s) => s.paymentProvider,
    },
    {
      header: m['admin.subscriptions.period'](),
      cell: (s) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(s.currentPeriodStart)} ~ {formatDate(s.currentPeriodEnd)}
        </span>
      ),
    },
    {
      header: m['admin.subscriptions.created_at'](),
      cell: (s) => (
        <span className="text-muted-foreground text-sm">
          {formatDateTime(s.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">
          {m['admin.subscriptions.title']()}
        </h1>
        <p className="text-muted-foreground">
          {m['admin.subscriptions.description']()}
        </p>
      </div>

      <div className="border-border flex gap-1 overflow-x-auto overflow-y-hidden border-b">
        {TABS.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={cn(
              '-mb-px border-b-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
              tab === tb
                ? 'border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            )}
          >
            {tDynamic(`admin.subscriptions.tab_${tb}`)}
          </button>
        ))}
      </div>

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            data={subscriptions}
            total={total}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            rowKey={(s) => s.id}
            emptyText={m['admin.subscriptions.no_subscriptions']()}
            search={search}
            onSearchChange={setSearch}
            onRefresh={() => query.refetch()}
            loading={query.isFetching}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute('/admin/subscriptions')({
  component: SubscriptionsPage,
});
