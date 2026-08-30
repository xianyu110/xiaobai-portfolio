import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { hasPermission } from '@/modules/rbac/service';
import { listAllTickets, type TicketStatus } from '@/modules/tickets/service';
import { respErr, respPage } from '@/lib/resp';

const VALID_STATUSES: TicketStatus[] = ['open', 'replied', 'closed'];

async function checkAdmin(request: Request) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) throw new Error('Unauthorized');
  const isAdmin = await hasPermission(session.user.id, 'admin.*');
  if (!isAdmin) throw new Error('Forbidden');
  return session;
}

async function GET({ request }: { request: Request }) {
  try {
    await checkAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('pageSize') || '20'))
    );
    const status = searchParams.get('status') as TicketStatus | null;
    const search = searchParams.get('keyword') || undefined;

    const { items, total } = await listAllTickets({
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

export const Route = createFileRoute('/api/admin/tickets')({
  server: {
    handlers: { GET },
  },
});
