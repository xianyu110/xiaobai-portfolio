import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import {
  getCustomConfigs,
  replaceCustomConfigs,
  type CustomConfig,
} from '@/modules/config/service';
import { hasPermission } from '@/modules/rbac/service';
import { respData, respErr, respOk } from '@/lib/resp';

const noStore = {
  headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  },
};

async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const isAdmin = await hasPermission(session.user.id, 'admin.settings.read');
    if (!isAdmin) return respErr('Forbidden');

    const configs = await getCustomConfigs();
    return respData(configs, noStore);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

async function POST({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const isAdmin = await hasPermission(
      session.user.id,
      'admin.settings.write'
    );
    if (!isAdmin) return respErr('Forbidden');

    const body = await request.json();
    const configs: CustomConfig[] = Array.isArray(body?.configs)
      ? body.configs
      : [];

    await replaceCustomConfigs(configs);
    return respOk(noStore);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/admin/config/custom')({
  server: {
    handlers: { GET, POST },
  },
});
