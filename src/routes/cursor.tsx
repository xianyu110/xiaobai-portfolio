import { createFileRoute } from '@tanstack/react-router';

import { CodexdownGuidePage } from '@/components/codexdown-guide';

export const Route = createFileRoute('/cursor')({
  head: () => ({ meta: [{ title: 'Codex Cursor 使用指南 | Codex 中文网' }] }),
  component: () => <CodexdownGuidePage slug="cursor" />,
});
