import { createFileRoute } from '@tanstack/react-router';
import { eq } from 'drizzle-orm';

import { getAuth } from '@/core/auth';
import { db } from '@/core/db';
import { envConfigs } from '@/config';
import { user } from '@/config/db/schema';
import { respData, respErr } from '@/lib/resp';

async function PATCH({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return respErr('Unauthorized');
    }

    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === 'string' ? body.name.trim() : undefined;
    const image =
      typeof body.image === 'string' ? body.image.trim() : undefined;

    if (name !== undefined && name.length === 0) {
      return respErr('Name cannot be empty');
    }
    if (name !== undefined && name.length > 100) {
      return respErr('Name too long');
    }
    if (image !== undefined && image.length > 0) {
      const isDataUrl = /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(image);
      if (isDataUrl) {
        // Cap inline base64 to avoid bloating the user row (matches upload route default).
        const maxBytes =
          (Number(envConfigs.inline_image_max_kb) || 2048) * 1024;
        // base64 length ≈ ceil(bytes / 3) * 4; reverse with a small slack.
        const approxBytes = Math.floor(
          (image.length - image.indexOf(',') - 1) * 0.75
        );
        if (approxBytes > maxBytes) {
          return respErr('Image too large');
        }
      } else {
        try {
          const u = new URL(image);
          if (u.protocol !== 'http:' && u.protocol !== 'https:') {
            return respErr('Invalid image URL');
          }
        } catch {
          return respErr('Invalid image URL');
        }
      }
    }

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (image !== undefined) updates.image = image.length > 0 ? image : null;

    if (Object.keys(updates).length === 0) {
      return respErr('No changes');
    }

    await db().update(user).set(updates).where(eq(user.id, session.user.id));

    const [updated] = await db()
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    return respData({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      image: updated.image,
    });
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/user/profile')({
  server: {
    handlers: { PATCH },
  },
});
