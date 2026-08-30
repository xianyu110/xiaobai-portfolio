import { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Copy, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { tDynamic } from '@/core/i18n/dynamic';
import { apiDelete, apiGet, apiPost, type PageResult } from '@/lib/api-client';
import { formatDateTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { DataTable, type Column } from '@/components/data-table';
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

type Tab = 'all' | 'available' | 'used';
const TABS: Tab[] = ['all', 'available', 'used'];

interface InviteCodeRow {
  id: string;
  code: string;
  maxUses: number;
  usedCount: number;
  trialDays: number;
  note: string | null;
  expiresAt: string | null;
  createdAt: string;
}

const PAGE_SIZE = 20;

const inviteCodeSchema = z.object({
  count: z.coerce.number().min(1),
  maxUses: z.coerce.number().min(1),
  trialDays: z.coerce.number().min(1),
  note: z.string(),
  expiresAt: z.string(),
});
type InviteCodeForm = z.input<typeof inviteCodeSchema>;
const emptyForm: InviteCodeForm = {
  count: '1',
  maxUses: '1',
  trialDays: '15',
  note: '',
  expiresAt: '',
};

function InviteCodesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, tab]);

  const listQuery = useQuery({
    queryKey: ['admin-invite-codes', page, tab, debouncedSearch],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (tab !== 'all') params.set('status', tab);
      if (debouncedSearch) params.set('search', debouncedSearch);
      return apiGet<PageResult<InviteCodeRow>>(
        `/api/admin/invite-codes?${params}`
      );
    },
    placeholderData: keepPreviousData,
  });

  const createForm = useForm({
    defaultValues: emptyForm,
    validators: { onSubmit: inviteCodeSchema },
    onSubmitInvalid: () => {
      toast.error(m['admin.invite_codes.invalid_input']());
    },
    onSubmit: async ({ value }) => {
      const n = Number(value.count);
      const mu = Number(value.maxUses);
      const d = Number(value.trialDays);
      await createMutation.mutateAsync({
        count: n > 1 ? n : undefined,
        maxUses: mu,
        trialDays: d,
        note: value.note || undefined,
        expiresAt: value.expiresAt
          ? new Date(value.expiresAt).toISOString()
          : null,
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: (body: {
      count: number | undefined;
      maxUses: number;
      trialDays: number;
      note: string | undefined;
      expiresAt: string | null;
    }) => apiPost('/api/admin/invite-codes', body),
    onSuccess: () => {
      toast.success(m['admin.invite_codes.create_success']());
      setCreateOpen(false);
      createForm.reset();
      setPage(1);
      queryClient.invalidateQueries({ queryKey: ['admin-invite-codes'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/api/admin/invite-codes?id=${id}`),
    onSuccess: () => {
      toast.success(m['admin.invite_codes.delete_success']());
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-invite-codes'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).then(
      () => toast.success(m['admin.invite_codes.copied']()),
      () => toast.error('Failed')
    );
  }

  const columns: Column<InviteCodeRow>[] = [
    {
      header: m['admin.invite_codes.code_col'](),
      cell: (r) => (
        <div className="flex items-center gap-2">
          <code className="font-mono text-sm">{r.code}</code>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={() => copyCode(r.code)}
          >
            <Copy className="size-3" />
          </Button>
        </div>
      ),
    },
    {
      header: m['admin.invite_codes.usage_col'](),
      className: 'w-[120px]',
      cell: (r) => (
        <span className="tabular-nums">
          {r.usedCount} / {r.maxUses}
        </span>
      ),
    },
    {
      header: m['admin.invite_codes.trial_days_col'](),
      className: 'w-[100px]',
      cell: (r) => <span className="tabular-nums">{r.trialDays}</span>,
    },
    {
      header: m['admin.invite_codes.note_col'](),
      cell: (r) => (
        <span className="text-muted-foreground">{r.note || '—'}</span>
      ),
    },
    {
      header: m['admin.invite_codes.expires_col'](),
      cell: (r) => (
        <span className="text-muted-foreground">
          {r.expiresAt ? formatDateTime(r.expiresAt) : '—'}
        </span>
      ),
    },
    {
      header: m['admin.invite_codes.created_col'](),
      cell: (r) => (
        <span className="text-muted-foreground">
          {formatDateTime(r.createdAt)}
        </span>
      ),
    },
    {
      header: m['admin.invite_codes.actions_col'](),
      className: 'w-[80px]',
      cell: (r) => (
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => setDeletingId(r.id)}
        >
          <Trash2 className="text-destructive size-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {m['admin.invite_codes.title']()}
          </h1>
          <p className="text-muted-foreground">
            {m['admin.invite_codes.description']()}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="size-4" />
          {m['admin.invite_codes.create_button']()}
        </Button>
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
            {tDynamic(`admin.invite_codes.tab_${tb}`)}
          </button>
        ))}
      </div>

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            data={listQuery.data?.items ?? []}
            total={listQuery.data?.total ?? 0}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            rowKey={(r) => r.id}
            emptyText={m['admin.invite_codes.empty']()}
            search={search}
            onSearchChange={setSearch}
            onRefresh={() => listQuery.refetch()}
            loading={listQuery.isFetching}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog
        open={createOpen}
        onOpenChange={(v) => {
          setCreateOpen(v);
          if (!v) createForm.reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m['admin.invite_codes.create_title']()}</DialogTitle>
            <DialogDescription>
              {m['admin.invite_codes.create_description']()}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              createForm.handleSubmit();
            }}
          >
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <createForm.Field name="count">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label>{m['admin.invite_codes.count_label']()}</Label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={String(field.state.value)}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </div>
                  )}
                </createForm.Field>
                <createForm.Field name="maxUses">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label>{m['admin.invite_codes.max_uses_label']()}</Label>
                      <Input
                        type="number"
                        min="1"
                        value={String(field.state.value)}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </div>
                  )}
                </createForm.Field>
              </div>
              <createForm.Field name="trialDays">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label>{m['admin.invite_codes.trial_days_label']()}</Label>
                    <Input
                      type="number"
                      min="1"
                      value={String(field.state.value)}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </div>
                )}
              </createForm.Field>
              <createForm.Field name="expiresAt">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label>{m['admin.invite_codes.expires_label']()}</Label>
                    <Input
                      type="date"
                      value={String(field.state.value)}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </div>
                )}
              </createForm.Field>
              <createForm.Field name="note">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label>{m['admin.invite_codes.note_label']()}</Label>
                    <Input
                      value={String(field.state.value)}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder={m['admin.invite_codes.note_placeholder']()}
                    />
                  </div>
                )}
              </createForm.Field>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                {m['admin.invite_codes.cancel']()}
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending
                  ? m['admin.invite_codes.creating']()
                  : m['admin.invite_codes.create_submit']()}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={!!deletingId}
        onOpenChange={(v) => !v && setDeletingId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m['admin.invite_codes.delete_title']()}</DialogTitle>
            <DialogDescription>
              {m['admin.invite_codes.delete_description']()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              {m['admin.invite_codes.cancel']()}
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
            >
              {m['admin.invite_codes.delete_confirm']()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute('/admin/invite-codes')({
  component: InviteCodesPage,
});
