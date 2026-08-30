import { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';

import { tDynamic } from '@/core/i18n/dynamic';
import { apiGet, apiPatch, type PageResult } from '@/lib/api-client';
import { formatDateTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { DataTable, type Column } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ORDER_STATUSES = [
  'pending',
  'created',
  'paid',
  'failed',
  'deleted',
] as const;

interface Order {
  id: string;
  orderNo: string;
  userId: string;
  userEmail: string | null;
  status: string;
  amount: number;
  currency: string;
  paymentType: string | null;
  paymentProvider: string;
  productId: string | null;
  productName: string | null;
  description: string | null;
  createdAt: string;
  paidAt: string | null;
}

const PAGE_SIZE = 20;

const TABS = ['all', 'subscription', 'one_time'] as const;
type Tab = (typeof TABS)[number];

function PaymentsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const editForm = useForm({
    defaultValues: {
      status: '',
      productId: '',
      productName: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      if (!editingOrder) return;
      await editMutation.mutateAsync({
        orderNo: editingOrder.orderNo,
        status: value.status,
        productId: value.productId || null,
        productName: value.productName || null,
        description: value.description || null,
      });
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [tab, statusFilter, debouncedSearch]);

  const query = useQuery({
    queryKey: ['admin-payments', page, tab, statusFilter, debouncedSearch],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (tab === 'subscription') params.set('paymentType', 'subscription');
      if (tab === 'one_time') params.set('paymentType', 'one_time');
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (debouncedSearch) params.set('search', debouncedSearch);
      return apiGet<PageResult<Order>>(`/api/admin/orders?${params}`);
    },
    placeholderData: keepPreviousData,
  });

  const editMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiPatch('/api/admin/orders', body),
    onSuccess: () => {
      toast.success(m['admin.payments.update_success']());
      setEditingOrder(null);
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const orders = query.data?.items ?? [];
  const total = query.data?.total ?? 0;

  function formatAmount(amount: number, currency: string) {
    const value = amount / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(value);
  }

  const statusVariant = (s: string) => {
    if (s === 'paid') return 'default';
    if (s === 'failed') return 'destructive';
    return 'secondary';
  };

  function openEdit(order: Order) {
    editForm.reset({
      status: order.status,
      productId: order.productId || '',
      productName: order.productName || '',
      description: order.description || '',
    });
    setEditingOrder(order);
  }

  const columns: Column<Order>[] = [
    {
      header: m['admin.payments.order_no'](),
      cell: (o) => <span className="font-mono text-xs">{o.orderNo}</span>,
    },
    {
      header: m['admin.payments.user'](),
      cell: (o) => <span className="text-sm">{o.userEmail || o.userId}</span>,
    },
    {
      header: m['admin.payments.amount'](),
      cell: (o) => (
        <span className="font-medium">
          {formatAmount(o.amount, o.currency)}
        </span>
      ),
    },
    {
      header: m['admin.payments.status'](),
      cell: (o) => (
        <Badge variant={statusVariant(o.status)}>
          {tDynamic(`admin.payments.status_${o.status}`)}
        </Badge>
      ),
    },
    {
      header: m['admin.payments.type'](),
      cell: (o) => o.paymentType || '—',
    },
    {
      header: m['admin.payments.provider'](),
      cell: (o) => o.paymentProvider,
    },
    {
      header: m['admin.payments.created_at'](),
      cell: (o) => (
        <span className="text-muted-foreground text-sm">
          {formatDateTime(o.createdAt)}
        </span>
      ),
    },
    {
      header: '',
      className: 'w-[60px]',
      cell: (o) => (
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => openEdit(o)}
        >
          <Pencil className="size-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">{m['admin.payments.title']()}</h1>
        <p className="text-muted-foreground">
          {m['admin.payments.description']()}
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
            {tDynamic(`admin.payments.tab_${tb}`)}
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
            emptyText={m['admin.payments.no_payments']()}
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder={m['admin.payments.search_placeholder']()}
            toolbar={
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value || 'all')}
              >
                <SelectTrigger className="h-8 w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {m['admin.payments.tab_all']()}
                  </SelectItem>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {tDynamic(`admin.payments.status_${status}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
            onRefresh={() => query.refetch()}
            loading={query.isFetching}
          />
        </CardContent>
      </Card>

      <Dialog
        open={!!editingOrder}
        onOpenChange={(open) => {
          if (!open && !editMutation.isPending) setEditingOrder(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m['admin.payments.edit_title']()}</DialogTitle>
            <DialogDescription>
              {m['admin.payments.edit_description']()}
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              editForm.handleSubmit();
            }}
          >
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>{m['admin.payments.order_no']()}</Label>
                <Input value={editingOrder?.orderNo || ''} disabled />
              </div>
              <editForm.Field name="status">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label>{m['admin.payments.status_label']()}</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value || '')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {tDynamic(`admin.payments.status_${status}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </editForm.Field>
              {(['productId', 'productName', 'description'] as const).map(
                (name) => (
                  <editForm.Field key={name} name={name}>
                    {(field) => (
                      <div className="space-y-1.5">
                        <Label>
                          {m[
                            `admin.payments.${
                              name === 'productId'
                                ? 'product_id_label'
                                : name === 'productName'
                                  ? 'product_name_label'
                                  : 'product_description_label'
                            }`
                          ]()}
                        </Label>
                        <Input
                          value={field.state.value}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                        />
                      </div>
                    )}
                  </editForm.Field>
                )
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={editMutation.isPending}
                onClick={() => setEditingOrder(null)}
              >
                {m['admin.payments.cancel']()}
              </Button>
              <Button type="submit" disabled={editMutation.isPending}>
                {editMutation.isPending
                  ? m['admin.payments.saving']()
                  : m['admin.payments.save']()}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute('/admin/payments')({
  component: PaymentsPage,
});
