import { randomBytes } from 'crypto';
import { and, eq, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import { inviteCode, subscription, userInvite } from '@/config/db/schema';
import { getUuid } from '@/lib/hash';

// ─── Admin: Create invite codes ──────────────────────────────────────────────

export async function createInviteCode(params: {
  code?: string;
  maxUses?: number;
  trialDays?: number;
  note?: string;
  createdBy?: string;
  expiresAt?: Date | null;
}) {
  const id = getUuid();
  const code = params.code || generateCode();
  const [row] = await db()
    .insert(inviteCode)
    .values({
      id,
      code,
      maxUses: params.maxUses ?? 1,
      trialDays: params.trialDays ?? 15,
      note: params.note || '',
      createdBy: params.createdBy || null,
      expiresAt: params.expiresAt || null,
    })
    .returning();
  return row;
}

export async function createInviteCodesBatch(params: {
  count: number;
  maxUses?: number;
  trialDays?: number;
  note?: string;
  createdBy?: string;
  expiresAt?: Date | null;
}) {
  const codes = [];
  for (let i = 0; i < params.count; i++) {
    const row = await createInviteCode({
      maxUses: params.maxUses,
      trialDays: params.trialDays,
      note: params.note,
      createdBy: params.createdBy,
      expiresAt: params.expiresAt,
    });
    codes.push(row);
  }
  return codes;
}

export async function listInviteCodes() {
  return db().select().from(inviteCode).orderBy(inviteCode.createdAt);
}

export async function deleteInviteCode(id: string) {
  await db().delete(inviteCode).where(eq(inviteCode.id, id));
}

// ─── Validate & redeem invite code ───────────────────────────────────────────

export async function validateInviteCode(code: string): Promise<{
  valid: boolean;
  error?: string;
  inviteCodeId?: string;
  trialDays?: number;
}> {
  const [row] = await db()
    .select()
    .from(inviteCode)
    .where(eq(inviteCode.code, code))
    .limit(1);

  if (!row) {
    return { valid: false, error: 'Invalid invite code' };
  }

  if (row.expiresAt && row.expiresAt < new Date()) {
    return { valid: false, error: 'Invite code has expired' };
  }

  if (row.usedCount >= row.maxUses) {
    return { valid: false, error: 'Invite code has been fully used' };
  }

  return { valid: true, inviteCodeId: row.id, trialDays: row.trialDays };
}

/**
 * Atomically redeem an invite code for a user.
 *
 * The row is locked inside a transaction so that concurrent requests can't
 * over-redeem (usedCount > maxUses). If the user has already redeemed any
 * code, returns the existing trialEndsAt unchanged.
 */
export async function redeemInviteCode(params: {
  userId: string;
  code: string;
}): Promise<{
  ok: boolean;
  error?: string;
  trialEndsAt?: Date;
}> {
  return db().transaction(async (tx: any) => {
    // 1. Idempotency: user already has an invite record → return it
    const [existing] = await tx
      .select()
      .from(userInvite)
      .where(eq(userInvite.userId, params.userId))
      .limit(1);
    if (existing) {
      return { ok: true, trialEndsAt: existing.trialEndsAt };
    }

    // 2. Lock the invite-code row (postgres/mysql honor FOR UPDATE;
    //    sqlite serializes writes inside the transaction anyway).
    const lockedQuery = tx
      .select()
      .from(inviteCode)
      .where(eq(inviteCode.code, params.code))
      .limit(1);
    const [row] = await (lockedQuery.for
      ? lockedQuery.for('update')
      : lockedQuery);
    if (!row) {
      return { ok: false, error: 'Invalid invite code' };
    }
    if (row.expiresAt && row.expiresAt < new Date()) {
      return { ok: false, error: 'Invite code has expired' };
    }
    if (row.usedCount >= row.maxUses) {
      return { ok: false, error: 'Invite code has been fully used' };
    }

    // 3. Insert user_invite and bump usedCount in the same transaction
    const id = getUuid();
    const now = new Date();
    const trialEndsAt = new Date(
      now.getTime() + row.trialDays * 24 * 60 * 60 * 1000
    );

    await tx.insert(userInvite).values({
      id,
      userId: params.userId,
      inviteCodeId: row.id,
      activatedAt: now,
      trialEndsAt,
    });
    await tx
      .update(inviteCode)
      .set({ usedCount: sql`${inviteCode.usedCount} + 1` })
      .where(eq(inviteCode.id, row.id));

    return { ok: true, trialEndsAt };
  });
}

// ─── User status ─────────────────────────────────────────────────────────────

export type UserPlan = 'none' | 'trial' | 'expired' | 'member';

export async function getUserPlan(userId: string): Promise<{
  plan: UserPlan;
  trialEndsAt?: Date;
}> {
  // 1. Check active subscription first (paid member)
  const [activeSub] = await db()
    .select()
    .from(subscription)
    .where(
      and(eq(subscription.userId, userId), eq(subscription.status, 'active'))
    )
    .limit(1);

  if (activeSub) {
    return { plan: 'member' };
  }

  // 2. Check invite/trial status
  const [invite] = await db()
    .select()
    .from(userInvite)
    .where(eq(userInvite.userId, userId))
    .limit(1);

  if (!invite) {
    return { plan: 'none' };
  }

  const now = new Date();
  if (invite.trialEndsAt > now) {
    return { plan: 'trial', trialEndsAt: invite.trialEndsAt };
  }

  return { plan: 'expired', trialEndsAt: invite.trialEndsAt };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateCode(): string {
  // 12 chars from a 32-symbol alphabet → 60 bits entropy.
  // Sampled from CSPRNG, with rejection sampling to avoid modulo bias.
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const out: string[] = [];
  while (out.length < 12) {
    const buf = randomBytes(16);
    for (let i = 0; i < buf.length && out.length < 12; i++) {
      const b = buf[i];
      // 8 bits → only use values < 256-256%32 = 256 (exactly divisible), no bias
      if (b < 256 - (256 % chars.length)) {
        out.push(chars[b % chars.length]);
      }
    }
  }
  return out.join('');
}
