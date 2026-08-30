import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import * as postsService from '@/modules/posts/service';
import { hasPermission } from '@/modules/rbac/service';
import { respData, respErr, respOk, respPage } from '@/lib/resp';

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

    // Single post (with content) — used by the editor
    const id = searchParams.get('id');
    if (id) {
      const post = await postsService.getById(id);
      if (!post) return respErr('Post not found');
      return respData(post);
    }

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('pageSize') || '20'))
    );
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    const { items, total } = await postsService.list({
      search,
      status,
      page,
      pageSize,
    });
    return respPage(items, total);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

async function POST({ request }: { request: Request }) {
  try {
    const session = await checkAdmin(request);
    const {
      slug,
      title,
      description,
      image,
      content,
      categories,
      authorName,
      status,
    } = await request.json();
    if (!slug || !title) return respErr('slug and title are required');
    const result = await postsService.create({
      userId: session.user.id,
      slug,
      title,
      description,
      image,
      content,
      categories,
      authorName,
      status,
    });
    return respData(result);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

async function PUT({ request }: { request: Request }) {
  try {
    await checkAdmin(request);
    const {
      id,
      slug,
      title,
      description,
      image,
      content,
      categories,
      authorName,
      status,
    } = await request.json();
    if (!id) return respErr('ID is required');
    const result = await postsService.update(id, {
      slug,
      title,
      description,
      image,
      content,
      categories,
      authorName,
      status,
    });
    return respData(result);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

async function DELETE({ request }: { request: Request }) {
  try {
    await checkAdmin(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return respErr('ID is required');
    await postsService.remove(id);
    return respOk();
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/admin/posts')({
  server: {
    handlers: { GET, POST, PUT, DELETE },
  },
});
