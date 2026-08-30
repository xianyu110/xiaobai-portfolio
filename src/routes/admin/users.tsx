import { useEffect, useState } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Coins, MoreHorizontal, Shield } from 'lucide-react';
import { toast } from 'sonner';

import {
  apiDelete,
  apiGet,
  apiPost,
  pageQuery,
  type PageResult,
} from '@/lib/api-client';
import { formatDateTime } from '@/lib/time';
import { m } from '@/paraglide/messages.js';
import { DataTable, type Column } from '@/components/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Input } from '@/components/ui/input';

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  credits: number;
  utmSource: string;
  ip: string;
}

interface RoleInfo {
  id: string;
  name: string;
  title: string;
}

interface UserRoleInfo {
  roleId: string;
  roleName: string;
  roleTitle: string;
}

const PAGE_SIZE = 20;

function UsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Role management dialog
  const [managingUser, setManagingUser] = useState<User | null>(null);

  // Credits dialog
  const [creditsUser, setCreditsUser] = useState<User | null>(null);
  const [creditsAction, setCreditsAction] = useState<'grant' | 'deduct'>(
    'grant'
  );
  const [creditsAmount, setCreditsAmount] = useState('');
  const [creditsDesc, setCreditsDesc] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const listQuery = useQuery({
    queryKey: ['admin-users', page, debouncedSearch],
    queryFn: () =>
      apiGet<PageResult<User>>(
        pageQuery('/api/admin/users', {
          page,
          pageSize: PAGE_SIZE,
          search: debouncedSearch,
        })
      ),
    placeholderData: keepPreviousData,
  });

  // Role dialog queries — only active while a user is being managed.
  const allRolesQuery = useQuery({
    queryKey: ['admin-roles-all'],
    queryFn: () =>
      apiGet<PageResult<RoleInfo>>('/api/admin/roles?page=1&pageSize=999'),
    enabled: !!managingUser,
  });

  const userRolesQuery = useQuery({
    queryKey: ['user-roles', managingUser?.id],
    queryFn: () =>
      apiGet<UserRoleInfo[]>(`/api/admin/roles?userId=${managingUser!.id}`),
    enabled: !!managingUser,
  });

  const allRoles = allRolesQuery.data?.items ?? [];
  const userRoleIds = new Set((userRolesQuery.data ?? []).map((r) => r.roleId));

  function openRoleDialog(u: User) {
    setManagingUser(u);
  }

  function openCreditsDialog(u: User) {
    setCreditsUser(u);
    setCreditsAction('grant');
    setCreditsAmount('');
    setCreditsDesc('');
  }

  const creditsMutation = useMutation({
    mutationFn: (vars: {
      userId: string;
      action: 'grant' | 'deduct';
      credits: number;
      description?: string;
    }) => apiPost<{ balance: number }>('/api/admin/users/credits', vars),
    onSuccess: (_data, vars) => {
      toast.success(
        vars.action === 'grant'
          ? m['admin.users.credits_granted']()
          : m['admin.users.credits_deducted']()
      );
      setCreditsUser(null);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function submitCredits() {
    if (!creditsUser) return;
    const amount = Number(creditsAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error(m['admin.users.credits_invalid_amount']());
      return;
    }
    creditsMutation.mutate({
      userId: creditsUser.id,
      action: creditsAction,
      credits: amount,
      description: creditsDesc || undefined,
    });
  }

  const assignRoleMutation = useMutation({
    mutationFn: (roleId: string) =>
      apiPost('/api/admin/roles/assign', {
        userId: managingUser!.id,
        roleId,
      }),
    onSuccess: () => {
      toast.success(m['admin.users.role_assigned']());
      queryClient.invalidateQueries({
        queryKey: ['user-roles', managingUser?.id],
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeRoleMutation = useMutation({
    mutationFn: (roleId: string) =>
      apiDelete(
        `/api/admin/roles/assign?userId=${managingUser!.id}&roleId=${roleId}`
      ),
    onSuccess: () => {
      toast.success(m['admin.users.role_removed']());
      queryClient.invalidateQueries({
        queryKey: ['user-roles', managingUser?.id],
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggling = assignRoleMutation.isPending || removeRoleMutation.isPending;

  function toggleRole(roleId: string) {
    if (!managingUser || toggling) return;
    if (userRoleIds.has(roleId)) {
      removeRoleMutation.mutate(roleId);
    } else {
      assignRoleMutation.mutate(roleId);
    }
  }

  const columns: Column<User>[] = [
    {
      header: m['admin.users.user_col'](),
      cell: (u) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={u.image || undefined} />
            <AvatarFallback className="text-xs">
              {(u.name || u.email).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{u.name || '—'}</span>
        </div>
      ),
    },
    {
      header: m['admin.users.email_col'](),
      cell: (u) => u.email,
    },
    {
      header: m['admin.users.source_col'](),
      cell: (u) =>
        u.utmSource ? (
          <span className="bg-muted inline-flex rounded-md px-2 py-0.5 text-xs font-medium">
            {u.utmSource}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      header: m['admin.users.ip_col'](),
      cell: (u) =>
        u.ip ? (
          <span className="text-muted-foreground font-mono text-xs">
            {u.ip}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      header: m['admin.users.credits_col'](),
      className: 'w-[120px]',
      cell: (u) => (
        <span className="font-medium tabular-nums">
          {u.credits.toLocaleString()}
        </span>
      ),
    },
    {
      header: m['admin.users.joined_col'](),
      cell: (u) => (
        <span className="text-muted-foreground">
          {formatDateTime(u.createdAt)}
        </span>
      ),
    },
    {
      header: m['admin.users.actions_col'](),
      className: 'w-[80px]',
      cell: (u) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="size-7">
                <MoreHorizontal className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openCreditsDialog(u)}>
              <Coins className="size-4" />
              {m['admin.users.manage_credits_title']()}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openRoleDialog(u)}>
              <Shield className="size-4" />
              {m['admin.users.manage_roles_title']()}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">{m['admin.users.title']()}</h1>
        <p className="text-muted-foreground">
          {m['admin.users.description']()}
        </p>
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
            rowKey={(u) => u.id}
            emptyText={m['admin.users.no_users']()}
            search={search}
            onSearchChange={setSearch}
            onRefresh={() => listQuery.refetch()}
            loading={listQuery.isFetching}
          />
        </CardContent>
      </Card>

      {/* Role Management Dialog */}
      <Dialog
        open={!!managingUser}
        onOpenChange={(v) => !v && setManagingUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m['admin.users.manage_roles_title']()}</DialogTitle>
            <DialogDescription>
              {m['admin.users.manage_roles_description']()}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-64 space-y-3 overflow-y-auto py-4">
            {allRoles.map((r) => (
              <label
                key={r.id}
                className="flex cursor-pointer items-center gap-3"
              >
                <Checkbox
                  checked={userRoleIds.has(r.id)}
                  onCheckedChange={() => toggleRole(r.id)}
                  disabled={toggling}
                />
                <div>
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="text-muted-foreground font-mono text-xs">
                    {r.name}
                  </div>
                </div>
              </label>
            ))}
            {allRoles.length === 0 && (
              <p className="text-muted-foreground py-4 text-center text-sm">
                {m['admin.roles.no_roles']()}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManagingUser(null)}>
              {m['admin.roles.cancel']()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Credits Management Dialog */}
      <Dialog
        open={!!creditsUser}
        onOpenChange={(v) => !v && setCreditsUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m['admin.users.manage_credits_title']()}</DialogTitle>
            <DialogDescription>
              {creditsUser
                ? m['admin.users.manage_credits_for']({
                    name: creditsUser.name || creditsUser.email,
                    balance: creditsUser.credits.toLocaleString(),
                  })
                : ''}
            </DialogDescription>
          </DialogHeader>

          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              submitCredits();
            }}
          >
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCreditsAction('grant')}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                    creditsAction === 'grant'
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {m['admin.users.credits_action_grant']()}
                </button>
                <button
                  type="button"
                  onClick={() => setCreditsAction('deduct')}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                    creditsAction === 'deduct'
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {m['admin.users.credits_action_deduct']()}
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  {m['admin.users.credits_amount_label']()}
                </label>
                <Input
                  type="number"
                  min="1"
                  value={creditsAmount}
                  onChange={(e) => setCreditsAmount(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  {m['admin.users.credits_desc_label']()}
                </label>
                <Input
                  value={creditsDesc}
                  onChange={(e) => setCreditsDesc(e.target.value)}
                  placeholder={m['admin.users.credits_desc_placeholder']()}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreditsUser(null)}
              >
                {m['admin.roles.cancel']()}
              </Button>
              <Button type="submit" disabled={creditsMutation.isPending}>
                {creditsMutation.isPending
                  ? m['admin.users.credits_submitting']()
                  : m['admin.users.credits_submit']()}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute('/admin/users')({
  component: UsersPage,
});
