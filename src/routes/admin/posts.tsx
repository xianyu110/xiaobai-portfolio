import { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { tDynamic } from '@/core/i18n/dynamic';
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  pageQuery,
  type PageResult,
} from '@/lib/api-client';
import { formatDateTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { DataTable, type Column } from '@/components/data-table';
import { TextField } from '@/components/form-field';
import { RichTextEditor } from '@/components/rich-text-editor';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Post {
  id: string;
  slug: string;
  type: string;
  title: string;
  description: string | null;
  image: string | null;
  categories: string | null;
  authorName: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryOption {
  id: string;
  title: string;
  slug: string;
}

const PAGE_SIZE = 20;
const TABS = ['all', 'published', 'draft'] as const;
type Tab = (typeof TABS)[number];

const postSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  content: z.string(),
  categories: z.string(),
  authorName: z.string(),
  status: z.string(),
});
type PostForm = z.infer<typeof postSchema>;
const emptyForm: PostForm = {
  slug: '',
  title: '',
  description: '',
  content: '',
  categories: '',
  authorName: '',
  status: 'draft',
};

function PostsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [tab, debouncedSearch]);

  const categoriesQuery = useQuery({
    queryKey: ['admin-categories', 'options'],
    queryFn: () => apiGet<CategoryOption[]>('/api/admin/categories?all=true'),
  });
  const categoryOptions = categoriesQuery.data ?? [];

  const listQuery = useQuery({
    queryKey: ['admin-posts', page, tab, debouncedSearch],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (tab !== 'all') params.set('status', tab);
      if (debouncedSearch) params.set('search', debouncedSearch);
      return apiGet<PageResult<Post>>(`/api/admin/posts?${params}`);
    },
    placeholderData: keepPreviousData,
  });

  const createForm = useForm({
    defaultValues: emptyForm,
    validators: { onSubmit: postSchema },
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync(value);
    },
  });

  const editForm = useForm({
    defaultValues: emptyForm,
    validators: { onSubmit: postSchema },
    onSubmit: async ({ value }) => {
      if (!editingPost) return;
      const body: Record<string, unknown> = { id: editingPost.id, ...value };
      if (!body.content) delete body.content; // don't overwrite content if empty
      await editMutation.mutateAsync(body);
    },
  });

  const createMutation = useMutation({
    mutationFn: (value: PostForm) => apiPost('/api/admin/posts', value),
    onSuccess: () => {
      toast.success(m['admin.posts.created']());
      setCreateOpen(false);
      createForm.reset();
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const editMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiPut('/api/admin/posts', body),
    onSuccess: () => {
      toast.success(m['admin.posts.updated']());
      setEditingPost(null);
      editForm.reset();
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/api/admin/posts?id=${id}`),
    onSuccess: () => {
      toast.success(m['admin.posts.deleted']());
      setDeletingPost(null);
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openEdit(p: Post) {
    editForm.reset({
      slug: p.slug,
      title: p.title,
      description: p.description || '',
      content: '',
      categories: p.categories || '',
      authorName: p.authorName || '',
      status: p.status,
    });
    setEditingPost(p);
    // list endpoint omits content — load it for the editor
    apiGet<Post & { content: string | null }>(`/api/admin/posts?id=${p.id}`)
      .then((post) => editForm.setFieldValue('content', post.content || ''))
      .catch(() => {});
  }

  const statusVariant = (s: string) => {
    if (s === 'published') return 'default' as const;
    if (s === 'draft') return 'secondary' as const;
    return 'outline' as const;
  };

  const columns: Column<Post>[] = [
    {
      header: m['admin.posts.title_col'](),
      cell: (p) => <span className="font-medium">{p.title}</span>,
    },
    {
      header: m['admin.posts.slug_col'](),
      cell: (p) => <span className="font-mono text-xs">{p.slug}</span>,
    },
    { header: m['admin.posts.author_col'](), cell: (p) => p.authorName || '—' },
    {
      header: m['admin.posts.status_col'](),
      cell: (p) => <Badge variant={statusVariant(p.status)}>{p.status}</Badge>,
    },
    {
      header: m['admin.posts.created_at'](),
      cell: (p) => (
        <span className="text-muted-foreground text-sm">
          {formatDateTime(p.createdAt)}
        </span>
      ),
    },
    {
      header: m['admin.posts.actions_col'](),
      className: 'w-[80px]',
      cell: (p) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => openEdit(p)}
          >
            <Pencil className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setDeletingPost(p)}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      ),
    },
  ];

  function renderFields(form: typeof createForm) {
    return (
      <div className="space-y-4 py-4">
        <form.Field name="slug">
          {(field) => (
            <TextField
              field={field}
              label={m['admin.posts.slug_field']()}
              placeholder={m['admin.posts.slug_placeholder']()}
            />
          )}
        </form.Field>
        <form.Field name="title">
          {(field) => (
            <TextField
              field={field}
              label={m['admin.posts.title_field']()}
              placeholder={m['admin.posts.title_placeholder']()}
            />
          )}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <TextField
              field={field}
              label={m['admin.posts.description_field']()}
              placeholder={m['admin.posts.description_placeholder']()}
            />
          )}
        </form.Field>
        <form.Field name="authorName">
          {(field) => (
            <TextField
              field={field}
              label={m['admin.posts.author_field']()}
              placeholder={m['admin.posts.author_placeholder']()}
            />
          )}
        </form.Field>
        <form.Field name="categories">
          {(field) => (
            <div className="space-y-2">
              <Label>{m['admin.posts.category_field']()}</Label>
              <Select
                value={field.state.value || ''}
                onValueChange={(v) => field.handleChange(v || '')}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={m['admin.posts.category_placeholder']()}
                  />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>
        <form.Field name="status">
          {(field) => (
            <div className="space-y-2">
              <Label>{m['admin.posts.status_field']()}</Label>
              <Select
                value={field.state.value || 'draft'}
                onValueChange={(v) => field.handleChange(v || 'draft')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    {m['admin.posts.status_draft']()}
                  </SelectItem>
                  <SelectItem value="published">
                    {m['admin.posts.status_published']()}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>
        <form.Field name="content">
          {(field) => (
            <div className="space-y-2">
              <Label>{m['admin.posts.content_field']()}</Label>
              <RichTextEditor
                value={field.state.value}
                onChange={(content) => field.handleChange(content)}
                placeholder={m['admin.posts.content_placeholder']()}
              />
            </div>
          )}
        </form.Field>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{m['admin.posts.title']()}</h1>
          <p className="text-muted-foreground">
            {m['admin.posts.description']()}
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/80 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition-colors">
            <Plus className="size-4" />
            {m['admin.posts.create']()}
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>{m['admin.posts.create_title']()}</DialogTitle>
              <DialogDescription>
                {m['admin.posts.create_description']()}
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                createForm.handleSubmit();
              }}
            >
              {renderFields(createForm)}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                >
                  {m['admin.posts.cancel']()}
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {m['admin.posts.save']()}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
            {tDynamic(`admin.posts.tab_${tb}`)}
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
            rowKey={(p) => p.id}
            emptyText={m['admin.posts.no_data']()}
            search={search}
            onSearchChange={setSearch}
            onRefresh={() => listQuery.refetch()}
            loading={listQuery.isFetching}
          />
        </CardContent>
      </Card>

      <Dialog
        open={!!editingPost}
        onOpenChange={(v) => !v && setEditingPost(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{m['admin.posts.edit_title']()}</DialogTitle>
            <DialogDescription>
              {m['admin.posts.edit_description']()}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editForm.handleSubmit();
            }}
          >
            {renderFields(editForm)}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingPost(null)}
              >
                {m['admin.posts.cancel']()}
              </Button>
              <Button type="submit" disabled={editMutation.isPending}>
                {m['admin.posts.save']()}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deletingPost}
        onOpenChange={(v) => !v && setDeletingPost(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m['admin.posts.delete_title']()}</DialogTitle>
            <DialogDescription>
              {m['admin.posts.delete_confirm']()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingPost(null)}>
              {m['admin.posts.cancel']()}
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() =>
                deletingPost && deleteMutation.mutate(deletingPost.id)
              }
            >
              {m['admin.posts.confirm_delete']()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute('/admin/posts')({
  component: PostsPage,
});
