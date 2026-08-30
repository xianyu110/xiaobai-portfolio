import { createFileRoute } from '@tanstack/react-router';

import { CodexdownDocPage } from '@/components/codexdown-inner';

export const Route = createFileRoute('/docs/codex/cli')({
  head: () => ({ meta: [{ title: 'Codex CLI | Codex 中文网' }] }),
  component: () => <CodexdownDocPage slug="codex/cli" />,
});
