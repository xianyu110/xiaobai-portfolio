import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { getDbConfigs } from '@/modules/config/service';

// better-auth catch-all — the handler takes a standard Request and
// returns a standard Response, so it mounts directly.
async function handle(request: Request) {
  const configs = await getDbConfigs();
  const auth = getAuth(configs);
  return auth.handler(request);
}

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
});
