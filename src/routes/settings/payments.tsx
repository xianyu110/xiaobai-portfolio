import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';

import { tDynamic } from '@/core/i18n/dynamic';
import { apiGet, type PageResult } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { DataTable, type Column } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type Order = {
  id: string;
  orderNo: string;
  status: string;
  amount: number;
  currency: string;
  paymentProvider: string;
  paymentType?: string | null;
  productName?: string | null;
  planName?: string | null;
  invoiceUrl?: string | null;
  paidAt?: string | null;
  createdAt: string;
};

const TABS = ['all', 'one-time', 'subscription', 'renew'] as const;
type Tab = (typeof TABS)[number];

const PAGE_SIZE = 20;

function formatAmount(amount: number, currency: string) {
  const normalized = (currency || 'usd').toUpperCase();
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: normalized,
  }).format(amount / 100);
}

function statusVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const s = status.toLowerCase();
  if (s === 'paid' || s === 'succeeded' || s === 'active') return 'default';
  if (s === 'failed' || s === 'canceled') return 'destructive';
  return 'secondary';
}

function PaymentsPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [page, setPage] = useState(1);
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
    queryKey: ['user-payments', page, tab, debouncedSearch],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (tab !== 'all') params.set('paymentType', tab);
      if (debouncedSearch) params.set('search', debouncedSearch);
      return apiGet<PageResult<Order>>(`/api/user/orders?${params}`);
    },
    placeholderData: keepPreviousData,
  });
  const orders = query.data?.items ?? [];
  const total = query.data?.total ?? 0;

  const columns: Column<Order>[] = [
    {
      header: m['settings.payments.order_no'](),
      cell: (o) => <span className="font-mono text-xs">{o.orderNo}</span>,
    },
    {
      header: m['settings.payments.product'](),
      cell: (o) => <span>{o.planName || o.productName || '—'}</span>,
    },
    {
      header: m['settings.payments.amount'](),
      cell: (o) => (
        <span className="font-medium">
          {formatAmount(o.amount, o.currency)}
        </span>
      ),
    },
    {
      header: m['settings.payments.status'](),
      cell: (o) => <Badge variant={statusVariant(o.status)}>{o.status}</Badge>,
    },
    {
      header: m['settings.payments.type'](),
      cell: (o) => o.paymentType || '—',
    },
    {
      header: m['settings.payments.provider'](),
      cell: (o) => <span className="capitalize">{o.paymentProvider}</span>,
    },
    {
      header: m['settings.payments.date'](),
      cell: (o) => (
        <span className="text-muted-foreground text-sm">
          {new Date(o.paidAt || o.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: m['settings.payments.invoice'](),
      className: 'w-[60px]',
      cell: (o) =>
        o.invoiceUrl ? (
          <a
            href={o.invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
            aria-label={m['settings.payments.invoice']()}
          >
            <ExternalLink className="size-3.5" />
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">{m['settings.payments.title']()}</h1>
        <p className="text-muted-foreground">
          {m['settings.payments.description']()}
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
            {tDynamic(`settings.payments.tab_${tb.replace('-', '_')}`)}
          </button>
        ))}
      </div>

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            data={orders}
            total={total}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            rowKey={(o) => o.id}
            emptyText={m['settings.payments.no_payments']()}
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

export const Route = createFileRoute('/settings/payments')({
  component: PaymentsPage,
});
