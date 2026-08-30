import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import {
  addMessage,
  getTicketById,
  getTicketMessages,
  sanitizeAttachments,
  updateTicketStatus,
} from '@/modules/tickets/service';
import { respData, respErr, respOk } from '@/lib/resp';

async function getOwnedTicket(request: Request, id: string) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) throw new Error('Unauthorized');
  const row = await getTicketById(id);
  if (!row || row.userId !== session.user.id)
    throw new Error('Ticket not found');
  return { session, ticket: row };
}

async function GET({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  try {
    const { id } = params;
    const { ticket } = await getOwnedTicket(request, id);
    const messages = await getTicketMessages(id);
    return respData({ ticket, messages });
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

// User reply — re-opens the ticket for admin attention
async function POST({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  try {
    const { id } = params;
    const { session, ticket } = await getOwnedTicket(request, id);
    if (ticket.status === 'closed') return respErr('Ticket is closed');

    const body = await request.json().catch(() => ({}));
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    if (!content) return respErr('Content is required');
    if (content.length > 5000) return respErr('Content is too long');

    const attachments = sanitizeAttachments(body.attachments);
    if (attachments === null) return respErr('Invalid attachments');

    const message = await addMessage({
      ticketId: id,
      userId: session.user.id,
      role: 'user',
      content,
      attachments,
    });
    return respData(message);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

// User closes their own ticket
async function PATCH({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  try {
    const { id } = params;
    await getOwnedTicket(request, id);

    const body = await request.json().catch(() => ({}));
    if (body.status !== 'closed') return respErr('Invalid status');

    await updateTicketStatus(id, 'closed');
    return respOk();
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/tickets/$id')({
  server: {
    handlers: { GET, POST, PATCH },
  },
});
