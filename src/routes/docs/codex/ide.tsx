import { createFileRoute } from '@tanstack/react-router';

import { CodexdownDocPage } from '@/components/codexdown-inner';

export const Route = createFileRoute('/docs/codex/ide')({
  head: () => ({ meta: [{ title: 'Codex IDE 扩展 | Codex 中文网' }] }),
  component: () => <CodexdownDocPage slug="codex/ide" />,
});
