import { useEffect, useState } from 'react';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { MessageSquare, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { tDynamic } from '@/core/i18n/dynamic';
import { apiGet, apiPatch, apiPost, type PageResult } from '@/lib/api-client';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type TicketStatus = 'open' | 'replied' | 'closed';

interface TicketRow {
  id: string;
  title: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
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

function TicketsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

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
  }, [debouncedSearch]);

  const listQuery = useQuery({
    queryKey: ['user-tickets', page, debouncedSearch],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (debouncedSearch) params.set('keyword', debouncedSearch);
      return apiGet<PageResult<TicketRow>>(`/api/tickets?${params}`);
    },
    placeholderData: keepPreviousData,
  });
  const rows = listQuery.data?.items ?? [];
  const total = listQuery.data?.total ?? 0;
  const refreshList = () =>
    queryClient.invalidateQueries({ queryKey: ['user-tickets'] });

  async function openDetail(row: TicketRow) {
    try {
      const data = await apiGet<{
        ticket: TicketRow;
        messages: TicketMessageRow[];
      }>(`/api/tickets/${row.id}`);
      setActiveTicket(data.ticket);
      setMessages(data.messages);
      setReplyAttachments([]);
      setReplyUploaderKey((k) => k + 1);
    } catch (e: any) {
      toast.error(e?.message || 'Failed');
    }
  }

  async function submitCreate() {
    if (!title.trim() || !content.trim()) {
      toast.error(m['settings.tickets.required']());
      return;
    }
    setSubmitting(true);
    try {
      await apiPost('/api/tickets', { title, content, attachments });
      toast.success(m['settings.tickets.create_success']());
      setCreateOpen(false);
      setTitle('');
      setContent('');
      setAttachments([]);
      setUploaderKey((k) => k + 1);
      setPage(1);
      refreshList();
    } catch (e: any) {
      toast.error(e?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function submitReply() {
    if (!activeTicket || !reply.trim()) return;
    setReplying(true);
    try {
      await apiPost(`/api/tickets/${activeTicket.id}`, {
        content: reply,
        attachments: replyAttachments,
      });
      setReply('');
      await openDetail(activeTicket);
      refreshList();
    } catch (e: any) {
      toast.error(e?.message || 'Failed');
    } finally {
      setReplying(false);
    }
  }

  async function closeTicket() {
    if (!activeTicket) return;
    try {
      await apiPatch(`/api/tickets/${activeTicket.id}`, { status: 'closed' });
      toast.success(m['settings.tickets.close_success']());
      setActiveTicket(null);
      refreshList();
    } catch (e: any) {
      toast.error(e?.message || 'Failed');
    }
  }

  const columns: Column<TicketRow>[] = [
    {
      header: m['settings.tickets.created_col'](),
      className: 'w-[160px]',
      cell: (r) => (
        <span className="text-muted-foreground">
          {new Date(r.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: m['settings.tickets.title_col'](),
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
      header: m['settings.tickets.latest_reply_col'](),
      cell: (r) => (
        <span className="text-muted-foreground block max-w-[280px] truncate">
          {r.latestReply || '—'}
        </span>
      ),
    },
    {
      header: m['settings.tickets.updated_col'](),
      className: 'w-[160px]',
      cell: (r) => (
        <span className="text-muted-foreground">
          {new Date(r.updatedAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: m['settings.tickets.status_col'](),
      className: 'w-[120px]',
      cell: (r) => (
        <Badge variant={STATUS_BADGE[r.status]}>
          {tDynamic(`settings.tickets.status_${r.status}`)}
        </Badge>
      ),
    },
    {
      header: m['settings.tickets.actions_col'](),
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {m['settings.tickets.title']()}
          </h1>
          <p className="text-muted-foreground">
            {m['settings.tickets.description']()}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="size-4" />
          {m['settings.tickets.create_button']()}
        </Button>
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
            emptyText={m['settings.tickets.empty']()}
            search={search}
            onSearchChange={setSearch}
            onRefresh={() => listQuery.refetch()}
            loading={listQuery.isFetching}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m['settings.tickets.create_title']()}</DialogTitle>
            <DialogDescription>
              {m['settings.tickets.create_description']()}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitCreate();
            }}
          >
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="ticket-title">
                  {m['settings.tickets.title_label']()}
                </Label>
                <Input
                  id="ticket-title"
                  value={title}
                  maxLength={200}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={m['settings.tickets.title_placeholder']()}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ticket-content">
                  {m['settings.tickets.content_label']()}
                </Label>
                <Textarea
                  id="ticket-content"
                  value={content}
                  maxLength={5000}
                  rows={6}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={m['settings.tickets.content_placeholder']()}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{m['settings.tickets.attachments_label']()}</Label>
                <ImageUploader
                  key={uploaderKey}
                  allowMultiple
                  maxImages={9}
                  onChange={(items) => {
                    const { urls, uploading: busy } = uploaderState(items);
                    setAttachments(urls);
                    setUploading(busy);
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                {m['settings.tickets.cancel']()}
              </Button>
              <Button type="submit" disabled={submitting || uploading}>
                {submitting
                  ? m['settings.tickets.creating']()
                  : m['settings.tickets.create_submit']()}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
                  {tDynamic(`settings.tickets.status_${activeTicket.status}`)}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[50vh] space-y-3 overflow-y-auto py-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'rounded-lg p-3 text-sm',
                  msg.role === 'admin' ? 'bg-primary/10 mr-8' : 'bg-muted ml-8'
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
                    {msg.role === 'admin'
                      ? m['settings.tickets.support_team']()
                      : msg.userName || m['settings.tickets.you']()}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <AttachmentGrid urls={msg.attachments} />
              </div>
            ))}
          </div>

          {activeTicket?.status !== 'closed' ? (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                submitReply();
              }}
            >
              <Textarea
                value={reply}
                maxLength={5000}
                rows={3}
                onChange={(e) => setReply(e.target.value)}
                placeholder={m['settings.tickets.reply_placeholder']()}
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
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeTicket}>
                  {m['settings.tickets.close_ticket']()}
                </Button>
                <Button
                  type="submit"
                  disabled={replying || replyUploading || !reply.trim()}
                >
                  {replying
                    ? m['settings.tickets.replying']()
                    : m['settings.tickets.reply_submit']()}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <p className="text-muted-foreground text-sm">
              {m['settings.tickets.closed_notice']()}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute('/settings/tickets')({
  component: TicketsPage,
});
