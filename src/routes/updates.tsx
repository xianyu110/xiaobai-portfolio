import { createFileRoute } from '@tanstack/react-router';

import { CodexdownGuidePage } from '@/components/codexdown-guide';

export const Route = createFileRoute('/updates')({
  head: () => ({ meta: [{ title: 'Codex 更新中心 | Codex 中文网' }] }),
  component: () => <CodexdownGuidePage slug="updates" />,
});
