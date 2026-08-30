import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { hasPermission } from '@/modules/rbac/service';
import {
  addMessage,
  getTicketById,
  getTicketMessages,
  sanitizeAttachments,
  updateTicketStatus,
  type TicketStatus,
} from '@/modules/tickets/service';
import { respData, respErr, respOk } from '@/lib/resp';

const VALID_STATUSES: TicketStatus[] = ['open', 'replied', 'closed'];

async function checkAdmin(request: Request) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) throw new Error('Unauthorized');
  const isAdmin = await hasPermission(session.user.id, 'admin.*');
  if (!isAdmin) throw new Error('Forbidden');
  return session;
}

async function GET({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  try {
    await checkAdmin(request);
    const { id } = params;
    const ticket = await getTicketById(id);
    if (!ticket) return respErr('Ticket not found');
    const messages = await getTicketMessages(id);
    return respData({ ticket, messages });
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

// Admin reply — marks the ticket as replied
async function POST({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  try {
    const session = await checkAdmin(request);
    const { id } = params;
    const ticket = await getTicketById(id);
    if (!ticket) return respErr('Ticket not found');

    const body = await request.json().catch(() => ({}));
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    if (!content) return respErr('Content is required');
    if (content.length > 5000) return respErr('Content is too long');

    const attachments = sanitizeAttachments(body.attachments);
    if (attachments === null) return respErr('Invalid attachments');

    const message = await addMessage({
      ticketId: id,
      userId: session.user.id,
      role: 'admin',
      content,
      attachments,
    });
    return respData(message);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

// Admin updates ticket status (close / reopen)
async function PATCH({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  try {
    await checkAdmin(request);
    const { id } = params;
    const ticket = await getTicketById(id);
    if (!ticket) return respErr('Ticket not found');

    const body = await request.json().catch(() => ({}));
    const status = body.status as TicketStatus;
    if (!VALID_STATUSES.includes(status)) return respErr('Invalid status');

    await updateTicketStatus(id, status);
    return respOk();
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/admin/tickets/$id')({
  server: {
    handlers: { GET, POST, PATCH },
  },
});
