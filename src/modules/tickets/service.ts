import {
  and,
  asc,
  count,
  desc,
  eq,
  inArray,
  like,
  or,
  type SQL,
} from 'drizzle-orm';

import { db } from '@/core/db';
import {
  ticket,
  ticketMessage,
  user,
  type Ticket,
  type TicketMessage,
} from '@/config/db/schema';
import { getUuid } from '@/lib/hash';

export type TicketStatus = 'open' | 'replied' | 'closed';
export type TicketRole = 'user' | 'admin';

/** A ticket message with its attachments JSON column parsed to a URL array. */
export type TicketMessageView = Omit<TicketMessage, 'attachments'> & {
  attachments: string[];
  userName: string | null;
  userAvatar: string | null;
};

function parseAttachments(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((u) => typeof u === 'string')
      : [];
  } catch {
    return [];
  }
}

/**
 * Latest admin reply per ticket, for list previews. One query for the whole
 * page of tickets; newest-first scan keeps the first reply seen per ticket.
 */
async function getLatestAdminReplies(
  ticketIds: string[]
): Promise<Record<string, string>> {
  if (!ticketIds.length) return {};
  const rows = await db()
    .select({
      ticketId: ticketMessage.ticketId,
      content: ticketMessage.content,
    })
    .from(ticketMessage)
    .where(
      and(
        inArray(ticketMessage.ticketId, ticketIds),
        eq(ticketMessage.role, 'admin')
      )
    )
    .orderBy(desc(ticketMessage.createdAt));

  const map: Record<string, string> = {};
  for (const r of rows) {
    if (!(r.ticketId in map)) map[r.ticketId] = r.content;
  }
  return map;
}

/**
 * Validate user-supplied attachment URLs: array of ≤9 strings, each ≤2048
 * chars, relative path or http(s) URL. Returns null when invalid.
 */
export function sanitizeAttachments(input: unknown): string[] | null {
  if (input === undefined || input === null) return [];
  if (!Array.isArray(input)) return null;
  if (input.length > 9) return null;
  const urls: string[] = [];
  for (const item of input) {
    if (typeof item !== 'string' || !item.trim() || item.length > 2048)
      return null;
    const url = item.trim();
    if (!url.startsWith('/') && !/^https?:\/\//.test(url)) return null;
    urls.push(url);
  }
  return urls;
}

/**
 * Create a new ticket with its first message (atomic).
 */
export async function createTicket(params: {
  userId: string;
  title: string;
  content: string;
  attachments?: string[];
}): Promise<Ticket> {
  return db().transaction(async (tx: any) => {
    const now = new Date();
    const [row] = await tx
      .insert(ticket)
      .values({
        id: getUuid(),
        userId: params.userId,
        title: params.title,
        status: 'open',
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    await tx.insert(ticketMessage).values({
      id: getUuid(),
      ticketId: row.id,
      userId: params.userId,
      role: 'user',
      content: params.content,
      attachments: JSON.stringify(params.attachments ?? []),
      createdAt: now,
    });

    return row;
  });
}

/**
 * List a user's own tickets, paginated, newest activity first.
 */
export async function listUserTickets(params: {
  userId: string;
  page?: number;
  pageSize?: number;
  status?: TicketStatus;
  search?: string;
}): Promise<{
  items: Array<Ticket & { latestReply: string | null }>;
  total: number;
}> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));

  const conditions: SQL[] = [eq(ticket.userId, params.userId)];
  if (params.status) conditions.push(eq(ticket.status, params.status));
  if (params.search) conditions.push(like(ticket.title, `%${params.search}%`));
  const where = and(...conditions);

  const [totalResult] = await db()
    .select({ count: count() })
    .from(ticket)
    .where(where);
  const rows = await db()
    .select()
    .from(ticket)
    .where(where)
    .orderBy(desc(ticket.updatedAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const replies = await getLatestAdminReplies(rows.map((r: Ticket) => r.id));
  const items = rows.map((r: Ticket) => ({
    ...r,
    latestReply: replies[r.id] ?? null,
  }));

  return { items, total: totalResult.count };
}

/**
 * Admin: list all tickets with submitter info, paginated.
 */
export async function listAllTickets(params: {
  page?: number;
  pageSize?: number;
  status?: TicketStatus;
  search?: string;
}): Promise<{
  items: Array<
    Ticket & {
      userName: string | null;
      userEmail: string | null;
      userAvatar: string | null;
      latestReply: string | null;
    }
  >;
  total: number;
}> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));

  const conditions: SQL[] = [];
  if (params.status) conditions.push(eq(ticket.status, params.status));
  if (params.search) {
    conditions.push(
      or(
        like(ticket.title, `%${params.search}%`),
        like(user.email, `%${params.search}%`),
        like(user.name, `%${params.search}%`)
      )!
    );
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const base = db()
    .select({ count: count() })
    .from(ticket)
    .leftJoin(user, eq(ticket.userId, user.id));
  const [totalResult] = await (where ? base.where(where) : base);

  const query = db()
    .select({
      id: ticket.id,
      userId: ticket.userId,
      title: ticket.title,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      userName: user.name,
      userEmail: user.email,
      userAvatar: user.image,
    })
    .from(ticket)
    .leftJoin(user, eq(ticket.userId, user.id));
  const rows = await (where ? query.where(where) : query)
    .orderBy(desc(ticket.updatedAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const replies = await getLatestAdminReplies(
    rows.map((r: { id: string }) => r.id)
  );
  const items = rows.map((r: (typeof rows)[number]) => ({
    ...r,
    latestReply: replies[r.id] ?? null,
  }));

  return { items, total: totalResult.count };
}

/**
 * Get a ticket by ID.
 */
export async function getTicketById(id: string): Promise<Ticket | undefined> {
  const [row] = await db()
    .select()
    .from(ticket)
    .where(eq(ticket.id, id))
    .limit(1);
  return row;
}

/**
 * Get a ticket's message thread (oldest first), with sender names.
 */
export async function getTicketMessages(
  ticketId: string
): Promise<TicketMessageView[]> {
  const rows = await db()
    .select({
      id: ticketMessage.id,
      ticketId: ticketMessage.ticketId,
      userId: ticketMessage.userId,
      role: ticketMessage.role,
      content: ticketMessage.content,
      attachments: ticketMessage.attachments,
      createdAt: ticketMessage.createdAt,
      userName: user.name,
      userAvatar: user.image,
    })
    .from(ticketMessage)
    .leftJoin(user, eq(ticketMessage.userId, user.id))
    .where(eq(ticketMessage.ticketId, ticketId))
    .orderBy(asc(ticketMessage.createdAt));

  return rows.map((r: (typeof rows)[number]) => ({
    ...r,
    attachments: parseAttachments(r.attachments),
  }));
}

/**
 * Append a message to a ticket and update its status (atomic).
 *
 * A user reply re-opens the ticket (awaiting admin); an admin reply
 * marks it replied (awaiting user).
 */
export async function addMessage(params: {
  ticketId: string;
  userId: string;
  role: TicketRole;
  content: string;
  attachments?: string[];
}): Promise<TicketMessage> {
  return db().transaction(async (tx: any) => {
    const now = new Date();
    const [row] = await tx
      .insert(ticketMessage)
      .values({
        id: getUuid(),
        ticketId: params.ticketId,
        userId: params.userId,
        role: params.role,
        content: params.content,
        attachments: JSON.stringify(params.attachments ?? []),
        createdAt: now,
      })
      .returning();

    await tx
      .update(ticket)
      .set({
        status: params.role === 'admin' ? 'replied' : 'open',
        updatedAt: now,
      })
      .where(eq(ticket.id, params.ticketId));

    return row;
  });
}

/**
 * Update a ticket's status (e.g. close / reopen).
 */
export async function updateTicketStatus(
  id: string,
  status: TicketStatus
): Promise<Ticket | undefined> {
  const [row] = await db()
    .update(ticket)
    .set({ status, updatedAt: new Date() })
    .where(eq(ticket.id, id))
    .returning();
  return row;
}
