import { useEffect, useState } from 'react';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

import { tDynamic } from '@/core/i18n/dynamic';
import { apiGet, apiPatch, apiPost, type PageResult } from '@/lib/api-client';
import { formatDateTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { DataTable, type Column } from '@/components/data-table';
import {
  ImageUploader,
  type ImageUploaderValue,
} from '@/components/image-uploader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

type TicketStatus = 'open' | 'replied' | 'closed';
type Tab = 'all' | TicketStatus;
const TABS: Tab[] = ['all', 'open', 'replied', 'closed'];

interface TicketRow {
  id: string;
  title: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  userName: string | null;
  userEmail: string | null;
  userAvatar: string | null;
  latestReply: string | null;
}

interface TicketMessageRow {
  id: string;
  role: 'user' | 'admin';
  content: string;
  attachments: string[];
  createdAt: string;
  userName: string | null;
  userAvatar: string | null;
}

/** Extract uploaded URLs from uploader items; true while any upload is in flight. */
function uploaderState(items: ImageUploaderValue[]) {
  return {
    urls: items
      .filter((i) => i.status === 'uploaded' && i.url)
      .map((i) => i.url!),
    uploading: items.some((i) => i.status === 'uploading'),
  };
}

function AttachmentGrid({ urls }: { urls: string[] }) {
  if (!urls.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {urls.map((url, i) => (
        <a
          key={`${url}-${i}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={url}
            alt=""
            className="border-border size-16 rounded-md border object-cover transition-opacity hover:opacity-80"
          />
        </a>
      ))}
    </div>
  );
}

const PAGE_SIZE = 20;

const STATUS_BADGE: Record<TicketStatus, 'default' | 'secondary' | 'outline'> =
  {
    open: 'default',
    replied: 'secondary',
    closed: 'outline',
  };

function AdminTicketsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Detail dialog
  const [activeTicket, setActiveTicket] = useState<TicketRow | null>(null);
  const [messages, setMessages] = useState<TicketMessageRow[]>([]);
  const [reply, setReply] = useState('');
  const [replyAttachments, setReplyAttachments] = useState<string[]>([]);
  const [replyUploading, setReplyUploading] = useState(false);
  const [replyUploaderKey, setReplyUploaderKey] = useState(0);
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, tab]);

  const listQuery = useQuery({
    queryKey: ['admin-tickets', page, tab, debouncedSearch],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (tab !== 'all') params.set('status', tab);
      if (debouncedSearch) params.set('keyword', debouncedSearch);
      return apiGet<PageResult<TicketRow>>(`/api/admin/tickets?${params}`);
    },
    placeholderData: keepPreviousData,
  });
  const rows = listQuery.data?.items ?? [];
  const total = listQuery.data?.total ?? 0;
  const refreshList = () =>
    queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });

  async function openDetail(row: TicketRow) {
    try {
      const data = await apiGet<{
        ticket: TicketRow;
        messages: TicketMessageRow[];
      }>(`/api/admin/tickets/${row.id}`);
      setActiveTicket({ ...row, ...data.ticket });
      setMessages(data.messages);
      setReplyAttachments([]);
      setReplyUploaderKey((k) => k + 1);
    } catch (e: any) {
      toast.error(e?.message || 'Failed');
    }
  }

  async function submitReply() {
    if (!activeTicket || !reply.trim()) return;
    setReplying(true);
    try {
      await apiPost(`/api/admin/tickets/${activeTicket.id}`, {
        content: reply,
        attachments: replyAttachments,
      });
      toast.success(m['admin.tickets.reply_success']());
      setReply('');
      await openDetail(activeTicket);
      refreshList();
    } catch (e: any) {
      toast.error(e?.message || 'Failed');
    } finally {
      setReplying(false);
    }
  }

  async function setStatus(status: TicketStatus) {
    if (!activeTicket) return;
    try {
      await apiPatch(`/api/admin/tickets/${activeTicket.id}`, { status });
      toast.success(m['admin.tickets.status_updated']());
      setActiveTicket({ ...activeTicket, status });
      refreshList();
    } catch (e: any) {
      toast.error(e?.message || 'Failed');
    }
  }

  const columns: Column<TicketRow>[] = [
    {
      header: m['admin.tickets.created_col'](),
      className: 'w-[160px]',
      cell: (r) => (
        <span className="text-muted-foreground">
          {formatDateTime(r.createdAt)}
        </span>
      ),
    },
    {
      header: m['admin.tickets.title_col'](),
      cell: (r) => (
        <button
          className="text-left font-medium hover:underline"
          onClick={() => openDetail(r)}
        >
          {r.title}
        </button>
      ),
    },
    {
      header: m['admin.tickets.user_col'](),
      cell: (r) => (
        <div className="flex items-center gap-2">
          <Avatar className="size-7">
            <AvatarImage src={r.userAvatar || undefined} />
            <AvatarFallback className="text-xs">
              {(r.userName || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>{r.userName || '—'}</span>
            <span className="text-muted-foreground text-xs">{r.userEmail}</span>
          </div>
        </div>
      ),
    },
    {
      header: m['admin.tickets.latest_reply_col'](),
      cell: (r) => (
        <span className="text-muted-foreground block max-w-[280px] truncate">
          {r.latestReply || '—'}
        </span>
      ),
    },
    {
      header: m['admin.tickets.updated_col'](),
      className: 'w-[160px]',
      cell: (r) => (
        <span className="text-muted-foreground">
          {formatDateTime(r.updatedAt)}
        </span>
      ),
    },
    {
      header: m['admin.tickets.status_col'](),
      className: 'w-[120px]',
      cell: (r) => (
        <Badge variant={STATUS_BADGE[r.status]}>
          {tDynamic(`admin.tickets.status_${r.status}`)}
        </Badge>
      ),
    },
    {
      header: m['admin.tickets.actions_col'](),
      className: 'w-[80px]',
      cell: (r) => (
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => openDetail(r)}
        >
          <MessageSquare className="size-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">{m['admin.tickets.title']()}</h1>
        <p className="text-muted-foreground">
          {m['admin.tickets.description']()}
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
            {tDynamic(`admin.tickets.tab_${tb}`)}
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
            emptyText={m['admin.tickets.empty']()}
            search={search}
            onSearchChange={setSearch}
            onRefresh={() => listQuery.refetch()}
            loading={listQuery.isFetching}
          />
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog
        open={!!activeTicket}
        onOpenChange={(v) => !v && setActiveTicket(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeTicket?.title}
              {activeTicket && (
                <Badge variant={STATUS_BADGE[activeTicket.status]}>
                  {tDynamic(`admin.tickets.status_${activeTicket.status}`)}
                </Badge>
              )}
            </DialogTitle>
            {activeTicket && (
              <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <Avatar className="size-5">
                  <AvatarImage src={activeTicket.userAvatar || undefined} />
                  <AvatarFallback className="text-[10px]">
                    {(activeTicket.userName || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {activeTicket.userName || '—'} · {activeTicket.userEmail}
              </p>
            )}
          </DialogHeader>

          <div className="max-h-[50vh] space-y-3 overflow-y-auto py-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'rounded-lg p-3 text-sm',
                  msg.role === 'admin' ? 'bg-primary/10 ml-8' : 'bg-muted mr-8'
                )}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-medium">
                    {msg.role === 'user' && (
                      <Avatar className="size-5">
                        <AvatarImage src={msg.userAvatar || undefined} />
                        <AvatarFallback className="text-[10px]">
                          {(msg.userName || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {msg.userName ||
                      (msg.role === 'admin' ? m['admin.tickets.admin']() : '—')}
                    {msg.role === 'admin' && (
                      <Badge
                        variant="secondary"
                        className="px-1 py-0 text-[10px]"
                      >
                        {m['admin.tickets.admin']()}
                      </Badge>
                    )}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatDateTime(msg.createdAt)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <AttachmentGrid urls={msg.attachments} />
              </div>
            ))}
          </div>

          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              submitReply();
            }}
          >
            {activeTicket?.status !== 'closed' && (
              <>
                <Textarea
                  value={reply}
                  maxLength={5000}
                  rows={3}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder={m['admin.tickets.reply_placeholder']()}
                />
                <ImageUploader
                  key={replyUploaderKey}
                  allowMultiple
                  maxImages={9}
                  onChange={(items) => {
                    const { urls, uploading: busy } = uploaderState(items);
                    setReplyAttachments(urls);
                    setReplyUploading(busy);
                  }}
                />
              </>
            )}
            <DialogFooter>
              {activeTicket?.status !== 'closed' ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStatus('closed')}
                  >
                    {m['admin.tickets.close_ticket']()}
                  </Button>
                  <Button
                    type="submit"
                    disabled={replying || replyUploading || !reply.trim()}
                  >
                    {replying
                      ? m['admin.tickets.replying']()
                      : m['admin.tickets.reply_submit']()}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStatus('open')}
                >
                  {m['admin.tickets.reopen_ticket']()}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute('/admin/tickets')({
  component: AdminTicketsPage,
});
