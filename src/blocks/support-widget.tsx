import { useState } from 'react';
import { LifeBuoy, X } from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { apiPost } from '@/lib/api-client';
import { currentPathWithQuery } from '@/lib/redirect';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { ImageUploader } from '@/components/image-uploader';
import { Button, buttonVariants } from '@/components/ui/button';
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

/**
 * Floating support button (bottom-right) that opens a quick ticket form.
 * Drop into any page or layout: <SupportWidget />
 *
 * Requires login — unauthenticated users get a sign-in prompt instead.
 */
export function SupportWidget() {
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!title.trim() || !content.trim()) {
      toast.error(m['common.support.required']());
      return;
    }
    setSubmitting(true);
    try {
      await apiPost('/api/tickets', { title, content, attachments });
      toast.success(m['common.support.success']());
      setOpen(false);
      setTitle('');
      setContent('');
      setAttachments([]);
      setUploaderKey((k) => k + 1);
    } catch (e: any) {
      toast.error(e?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        aria-label={m['common.support.open_label']()}
        onClick={() => setOpen(true)}
        className={cn(
          'fixed right-6 bottom-6 z-50 size-12 rounded-full',
          'bg-primary text-primary-foreground shadow-lg',
          'flex items-center justify-center',
          'transition-all hover:scale-105 hover:shadow-xl'
        )}
      >
        {open ? <X className="size-5" /> : <LifeBuoy className="size-5" />}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m['common.support.title']()}</DialogTitle>
            <DialogDescription>
              {m['common.support.description']()}
            </DialogDescription>
          </DialogHeader>

          {!isPending && !session?.user ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <p className="text-muted-foreground text-sm">
                {m['common.support.sign_in_notice']()}
              </p>
              <Link
                href={`/sign-in?callbackUrl=${encodeURIComponent(currentPathWithQuery('/'))}`}
                className={cn(buttonVariants())}
              >
                {m['common.support.sign_in']()}
              </Link>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="support-title">
                    {m['common.support.title_label']()}
                  </Label>
                  <Input
                    id="support-title"
                    value={title}
                    maxLength={200}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={m['common.support.title_placeholder']()}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="support-content">
                    {m['common.support.content_label']()}
                  </Label>
                  <Textarea
                    id="support-content"
                    value={content}
                    maxLength={5000}
                    rows={5}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={m['common.support.content_placeholder']()}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{m['common.support.attachments_label']()}</Label>
                  <ImageUploader
                    key={uploaderKey}
                    allowMultiple
                    maxImages={9}
                    onChange={(items) => {
                      setAttachments(
                        items
                          .filter((i) => i.status === 'uploaded' && i.url)
                          .map((i) => i.url!)
                      );
                      setUploading(items.some((i) => i.status === 'uploading'));
                    }}
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  {m['common.support.track_hint_prefix']()}{' '}
                  <Link
                    href="/settings/tickets"
                    className="hover:text-foreground underline"
                  >
                    {m['common.support.track_hint_link']()}
                  </Link>
                </p>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  {m['common.support.cancel']()}
                </Button>
                <Button type="submit" disabled={submitting || uploading}>
                  {submitting
                    ? m['common.support.submitting']()
                    : m['common.support.submit']()}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
