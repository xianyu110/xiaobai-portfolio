import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import * as apikeys from '@/modules/apikeys/service';
import { respData, respErr, respOk, respPage } from '@/lib/resp';

async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return respErr('Unauthorized');
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('pageSize') || '20'))
    );
    const search = searchParams.get('search') || undefined;

    const { items, total } = await apikeys.list(
      session.user.id,
      page,
      pageSize,
      search
    );
    return respPage(items, total);
  } catch (error: any) {
    return respErr(error.message || 'Failed to list API keys');
  }
}

async function POST({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return respErr('Unauthorized');
    }

    const body = await request.json();
    const { title } = body;

    if (!title) {
      return respErr('Title is required');
    }

    const key = await apikeys.create({
      userId: session.user.id,
      title,
    });

    return respData(key);
  } catch (error: any) {
    return respErr(error.message || 'Failed to create API key');
  }
}

async function DELETE({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return respErr('Unauthorized');
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('id');

    if (!keyId) {
      return respErr('Key ID is required');
    }

    await apikeys.remove({ userId: session.user.id, keyId });
    return respOk();
  } catch (error: any) {
    return respErr(error.message || 'Failed to delete API key');
  }
}

export const Route = createFileRoute('/api/apikeys')({
  server: {
    handlers: { GET, POST, DELETE },
  },
});
