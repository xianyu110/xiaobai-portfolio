import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import {
  createTicket,
  listUserTickets,
  sanitizeAttachments,
  type TicketStatus,
} from '@/modules/tickets/service';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr, respPage } from '@/lib/resp';

const VALID_STATUSES: TicketStatus[] = ['open', 'replied', 'closed'];

async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('pageSize') || '20'))
    );
    const status = searchParams.get('status') as TicketStatus | null;
    const search = searchParams.get('keyword') || undefined;

    const { items, total } = await listUserTickets({
      userId: session.user.id,
      page,
      pageSize,
      status: status && VALID_STATUSES.includes(status) ? status : undefined,
      search,
    });
    return respPage(items, total);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

async function POST({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    // Prevent ticket spam: at most one creation per 30s per user
    const limited = enforceMinIntervalRateLimit(request, {
      intervalMs: 30_000,
      keyPrefix: 'ticket-create',
      extraKey: session.user.id,
    });
    if (limited) return limited;

    const body = await request.json().catch(() => ({}));
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    if (!title || !content) return respErr('Title and content are required');
    if (title.length > 200) return respErr('Title is too long');
    if (content.length > 5000) return respErr('Content is too long');

    const attachments = sanitizeAttachments(body.attachments);
    if (attachments === null) return respErr('Invalid attachments');

    const row = await createTicket({
      userId: session.user.id,
      title,
      content,
      attachments,
    });
    return respData(row);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/tickets')({
  server: {
    handlers: { GET, POST },
  },
});
