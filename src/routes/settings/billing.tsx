import { useEffect, useState } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Eye, MoreHorizontal, Pencil, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { tDynamic } from '@/core/i18n/dynamic';
import { Link } from '@/core/i18n/navigation';
import { ApiError, apiGet, apiPost, type PageResult } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { DataTable, type Column } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Subscription = {
  id: string;
  subscriptionNo: string;
  status: string;
  paymentProvider: string;
  planName?: string | null;
  productName?: string | null;
  interval?: string | null;
  intervalCount?: number | null;
  amount?: number | null;
  currency?: string | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  canceledAt?: string | null;
  canceledEndAt?: string | null;
  canceledReason?: string | null;
  createdAt?: string | null;
};

const TABS = [
  'all',
  'active',
  'trialing',
  'paused',
  'expired',
  'pending_cancel',
  'canceled',
] as const;
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
  status?: string | null
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const s = (status || '').toLowerCase();
  if (s === 'active' || s === 'trialing') return 'default';
  if (s === 'canceled' || s === 'expired') return 'destructive';
  return 'secondary';
}

function isCancellable(status?: string | null) {
  const s = (status || '').toLowerCase();
  return s === 'active' || s === 'trialing';
}

function BillingPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>('all');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [viewing, setViewing] = useState<Subscription | null>(null);
  const [canceling, setCanceling] = useState<Subscription | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [tab, debouncedSearch]);

  const currentQuery = useQuery({
    queryKey: ['billing', 'current'],
    queryFn: () =>
      apiGet<Subscription | null>('/api/user/subscriptions/current'),
  });
  const current = currentQuery.data ?? null;
  const currentLoaded = !currentQuery.isPending;

  const listQuery = useQuery({
    queryKey: ['billing', 'list', page, tab, debouncedSearch],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (tab !== 'all') params.set('status', tab);
      if (debouncedSearch) params.set('search', debouncedSearch);
      return apiGet<PageResult<Subscription>>(
        `/api/user/subscriptions?${params}`
      );
    },
    placeholderData: keepPreviousData,
  });
  const rows = listQuery.data?.items ?? [];
  const total = listQuery.data?.total ?? 0;

  const cancelMutation = useMutation({
    mutationFn: (subscriptionNo: string) =>
      apiPost('/api/user/subscriptions/cancel', { subscriptionNo }),
    onSuccess: () => {
      toast.success(m['settings.billing.cancel_success']());
      setCanceling(null);
      queryClient.invalidateQueries({ queryKey: ['billing'] });
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError
          ? err.message || m['settings.billing.cancel_failed']()
          : m['settings.billing.cancel_failed']()
      );
    },
  });
  const submitting = cancelMutation.isPending;

  function confirmCancel() {
    if (!canceling) return;
    cancelMutation.mutate(canceling.subscriptionNo);
  }

  const columns: Column<Subscription>[] = [
    {
      header: m['settings.billing.subscription_no'](),
      cell: (r) => (
        <span className="font-mono text-xs">{r.subscriptionNo}</span>
      ),
    },
    {
      header: m['settings.billing.plan'](),
      cell: (r) => (
        <span className="font-medium">
          {r.planName || r.productName || '—'}
        </span>
      ),
    },
    {
      header: m['settings.billing.interval'](),
      cell: (r) =>
        r.interval ? (
          <span className="text-sm">
            {r.intervalCount ? `${r.intervalCount} ` : ''}
            {r.interval}
          </span>
        ) : (
          '—'
        ),
    },
    {
      header: m['settings.billing.status'](),
      cell: (r) => <Badge variant={statusVariant(r.status)}>{r.status}</Badge>,
    },
    {
      header: m['settings.billing.amount'](),
      cell: (r) =>
        r.amount && r.currency ? (
          <span className="tabular-nums">
            {formatAmount(r.amount, r.currency)}
          </span>
        ) : (
          '—'
        ),
    },
    {
      header: m['settings.billing.current_period'](),
      cell: (r) => (
        <span className="text-muted-foreground text-xs whitespace-pre-line">
          {r.currentPeriodStart && r.currentPeriodEnd
            ? `${new Date(r.currentPeriodStart).toLocaleDateString()}\n~ ${new Date(r.currentPeriodEnd).toLocaleDateString()}`
            : '—'}
        </span>
      ),
    },
    {
      header: m['settings.billing.end_time'](),
      cell: (r) => (
        <span className="text-muted-foreground text-sm">
          {r.canceledEndAt
            ? new Date(r.canceledEndAt).toLocaleDateString()
            : '—'}
        </span>
      ),
    },
    {
      header: m['settings.billing.date'](),
      cell: (r) => (
        <span className="text-muted-foreground text-sm">
          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      header: m['settings.billing.actions_col'](),
      className: 'w-[80px]',
      cell: (r) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="size-7">
                <MoreHorizontal className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setViewing(r)}>
              <Eye className="size-4" />
              {m['settings.billing.view']()}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => isCancellable(r.status) && setCanceling(r)}
              disabled={!isCancellable(r.status)}
            >
              <XCircle className="size-4" />
              {m['settings.billing.cancel']()}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">{m['settings.billing.title']()}</h1>
        <p className="text-muted-foreground">
          {m['settings.billing.description']()}
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{m['settings.billing.subscription']()}</CardTitle>
            <Link
              href="/pricing"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'gap-2'
              )}
            >
              <Pencil className="size-4" />
              {current
                ? m['settings.billing.adjust']()
                : m['settings.billing.subscribe']()}
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!currentLoaded ? (
            <p className="text-muted-foreground text-sm">…</p>
          ) : current ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">
                  {current.planName || current.productName || '—'}
                </p>
                <Badge variant={statusVariant(current.status)}>
                  {current.status}
                </Badge>
              </div>
              {current.amount && current.currency && (
                <p className="text-muted-foreground text-sm">
                  {formatAmount(current.amount, current.currency)}
                  {current.interval ? ` / ${current.interval}` : ''}
                </p>
              )}
              {current.canceledEndAt ? (
                <p className="text-destructive text-sm">
                  {m['settings.billing.ends_on']({
                    date: new Date(current.canceledEndAt).toLocaleDateString(),
                  })}
                </p>
              ) : current.currentPeriodEnd ? (
                <p className="text-muted-foreground text-sm">
                  {m['settings.billing.renews_on']({
                    date: new Date(
                      current.currentPeriodEnd
                    ).toLocaleDateString(),
                  })}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-muted-foreground text-3xl font-bold">
              {m['settings.billing.no_subscription']()}
            </p>
          )}
        </CardContent>
      </Card>

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
            {tDynamic(`settings.billing.tab_${tb}`)}
          </button>
        ))}
      </div>

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            data={rows}
            total={total}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            rowKey={(r) => r.id}
            emptyText={m['settings.billing.no_subscription']()}
            search={search}
            onSearchChange={setSearch}
            onRefresh={async () => {
              currentQuery.refetch();
              await listQuery.refetch();
            }}
            loading={listQuery.isFetching}
          />
        </CardContent>
      </Card>

      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {m['settings.billing.subscription_details']()}
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              {viewing?.subscriptionNo}
            </DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 py-2 text-sm">
              <DetailRow label={m['settings.billing.plan']()}>
                {viewing.planName || viewing.productName || '—'}
              </DetailRow>
              <DetailRow label={m['settings.billing.status']()}>
                <Badge variant={statusVariant(viewing.status)}>
                  {viewing.status}
                </Badge>
              </DetailRow>
              <DetailRow label={m['settings.billing.amount']()}>
                {viewing.amount && viewing.currency
                  ? `${formatAmount(viewing.amount, viewing.currency)}${
                      viewing.interval ? ` / ${viewing.interval}` : ''
                    }`
                  : '—'}
              </DetailRow>
              <DetailRow label={m['settings.billing.provider']()}>
                {viewing.paymentProvider}
              </DetailRow>
              <DetailRow label={m['settings.billing.period_start']()}>
                {viewing.currentPeriodStart
                  ? new Date(viewing.currentPeriodStart).toLocaleString()
                  : '—'}
              </DetailRow>
              <DetailRow label={m['settings.billing.period_end']()}>
                {viewing.currentPeriodEnd
                  ? new Date(viewing.currentPeriodEnd).toLocaleString()
                  : '—'}
              </DetailRow>
              {viewing.canceledAt && (
                <DetailRow label={m['settings.billing.canceled_at']()}>
                  {new Date(viewing.canceledAt).toLocaleString()}
                </DetailRow>
              )}
              {viewing.canceledEndAt && (
                <DetailRow label={m['settings.billing.canceled_end_at']()}>
                  {new Date(viewing.canceledEndAt).toLocaleString()}
                </DetailRow>
              )}
              {viewing.canceledReason && (
                <DetailRow label={m['settings.billing.canceled_reason']()}>
                  {viewing.canceledReason}
                </DetailRow>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewing(null)}>
              {m['settings.billing.close']()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!canceling} onOpenChange={(v) => !v && setCanceling(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m['settings.billing.cancel_title']()}</DialogTitle>
            <DialogDescription>
              {m['settings.billing.cancel_description']({
                plan: canceling?.planName || canceling?.productName || '—',
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCanceling(null)}
              disabled={submitting}
            >
              {m['settings.billing.cancel_back']()}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancel}
              disabled={submitting}
            >
              {submitting
                ? m['settings.billing.canceling']()
                : m['settings.billing.cancel_confirm']()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground w-32 shrink-0">{label}</span>
      <span className="flex-1">{children}</span>
    </div>
  );
}

export const Route = createFileRoute('/settings/billing')({
  component: BillingPage,
});
