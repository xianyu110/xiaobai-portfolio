import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { getAllConfigs, isMaskedConfigValue } from '@/modules/config/service';
import { getTestSpec, runTest } from '@/modules/config/settings-test';
import { hasPermission } from '@/modules/rbac/service';
import { respData, respErr } from '@/lib/resp';

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
    const group: string = body?.group;
    const inputs: Record<string, string> = body?.inputs || {};
    const overrides: Record<string, string> = body?.configs || {};
    if (!group) return respErr('group is required');

    const spec = getTestSpec(group);
    if (!spec) return respErr(`No test available for "${group}"`);

    for (const field of spec.fields) {
      if (field.required && !inputs[field.name]) {
        return respErr(`Missing required field: ${field.label}`);
      }
    }

    // Test against the values currently entered in the form (possibly unsaved),
    // falling back to saved config. Masked secrets mean "unchanged" — skip them
    // so the real saved value applies instead of the bullet placeholder.
    const configs = await getAllConfigs();
    for (const [key, value] of Object.entries(overrides)) {
      if (typeof value === 'string' && !isMaskedConfigValue(value)) {
        configs[key] = value;
      }
    }

    const result = await runTest(group, inputs, configs);
    return respData(result);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/admin/settings/test')({
  server: {
    handlers: { POST },
  },
});
