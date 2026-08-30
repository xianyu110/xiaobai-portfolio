import { useEffect, useState } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Check, Copy, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  apiDelete,
  apiGet,
  apiPost,
  pageQuery,
  type PageResult,
} from '@/lib/api-client';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ApiKey {
  id: string;
  keyPrefix: string;
  key: string | null;
  title: string;
  lastUsedAt: string | null;
  createdAt: string;
}

const PAGE_SIZE = 20;

function ApiKeysPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [newKeyName, setNewKeyName] = useState('');
  const [open, setOpen] = useState(false);
  const [createdKey, setCreatedKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const listQuery = useQuery({
    queryKey: ['apikeys', page, debouncedSearch],
    queryFn: () =>
      apiGet<PageResult<ApiKey>>(
        pageQuery('/api/apikeys', {
          page,
          pageSize: PAGE_SIZE,
          search: debouncedSearch,
        })
      ),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: (title: string) =>
      apiPost<{ key: string }>('/api/apikeys', { title }),
    onSuccess: (data) => {
      toast.success(m['settings.apikeys.created']());
      setOpen(false);
      setNewKeyName('');
      setCopied(false);
      setCreatedKey(data.key);
      queryClient.invalidateQueries({ queryKey: ['apikeys'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/api/apikeys?id=${id}`),
    onSuccess: () => {
      toast.success(m['settings.apikeys.deleted']());
      setKeyToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['apikeys'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function handleCreate() {
    if (!newKeyName.trim()) return;
    createMutation.mutate(newKeyName);
  }

  async function handleCopyKey(key: string) {
    try {
      await navigator.clipboard.writeText(key);
      toast.success(m['settings.apikeys.key_copied']());
    } catch {
      toast.error(m['settings.apikeys.copy_failed']());
    }
  }

  async function handleCopyCreatedKey() {
    try {
      await navigator.clipboard.writeText(createdKey);
      setCopied(true);
      toast.success(m['settings.apikeys.key_copied']());
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(m['settings.apikeys.copy_failed']());
    }
  }

  const columns: Column<ApiKey>[] = [
    {
      header: m['settings.apikeys.name_col'](),
      cell: (k) => <span className="font-medium">{k.title}</span>,
    },
    {
      header: m['settings.apikeys.key_col'](),
      cell: (k) => <span className="font-mono text-xs">{k.keyPrefix}…</span>,
    },
    {
      header: m['settings.apikeys.created_col'](),
      cell: (k) => (
        <span className="text-muted-foreground text-xs">
          {new Date(k.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: m['settings.apikeys.last_used_col'](),
      cell: (k) => (
        <span className="text-muted-foreground text-xs">
          {k.lastUsedAt
            ? new Date(k.lastUsedAt).toLocaleString()
            : m['settings.apikeys.never_used']()}
        </span>
      ),
    },
    {
      header: m['settings.apikeys.actions_col'](),
      className: 'w-[100px]',
      cell: (k) => (
        <div className="flex gap-1">
          {k.key && (
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => handleCopyKey(k.key!)}
            >
              <Copy className="size-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setKeyToDelete(k)}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {m['settings.apikeys.title']()}
          </h1>
          <p className="text-muted-foreground">
            {m['settings.apikeys.description']()}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/80 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition-colors">
            <Plus className="size-4" />
            {m['settings.apikeys.create_key']()}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{m['settings.apikeys.create_title']()}</DialogTitle>
              <DialogDescription>
                {m['settings.apikeys.create_description']()}
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
            >
              <div className="space-y-2 py-4">
                <Label htmlFor="key-name">
                  {m['settings.apikeys.key_name']()}
                </Label>
                <Input
                  id="key-name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder={m['settings.apikeys.key_name_placeholder']()}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  {m['settings.apikeys.cancel']()}
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending
                    ? m['settings.apikeys.creating']()
                    : m['settings.apikeys.create']()}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
        open={!!createdKey}
        onOpenChange={(v) => {
          if (!v) setCreatedKey('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m['settings.apikeys.created_title']()}</DialogTitle>
            <DialogDescription>
              {m['settings.apikeys.created_warning']()}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 py-4">
            <Input
              readOnly
              value={createdKey}
              className="font-mono text-xs"
              onFocus={(e) => e.currentTarget.select()}
            />
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={handleCopyCreatedKey}
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setCreatedKey('')}>
              {m['settings.apikeys.done']()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!keyToDelete}
        onOpenChange={(isOpen) => {
          if (!isOpen && !deleteMutation.isPending) setKeyToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m['settings.apikeys.delete_title']()}</DialogTitle>
            <DialogDescription>
              {m['settings.apikeys.delete_description']({
                name: keyToDelete?.title ?? '',
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={deleteMutation.isPending}
              onClick={() => setKeyToDelete(null)}
            >
              {m['settings.apikeys.cancel']()}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!keyToDelete || deleteMutation.isPending}
              onClick={() => {
                if (keyToDelete) deleteMutation.mutate(keyToDelete.id);
              }}
            >
              {deleteMutation.isPending
                ? m['settings.apikeys.deleting']()
                : m['settings.apikeys.confirm_delete']()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            data={listQuery.data?.items ?? []}
            total={listQuery.data?.total ?? 0}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            rowKey={(k) => k.id}
            emptyText={m['settings.apikeys.no_keys']()}
            search={search}
            onSearchChange={setSearch}
            onRefresh={() => listQuery.refetch()}
            loading={listQuery.isFetching}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute('/settings/apikeys')({
  component: ApiKeysPage,
});
