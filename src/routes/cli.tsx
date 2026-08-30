import { createFileRoute } from '@tanstack/react-router';

import { CodexdownGuidePage } from '@/components/codexdown-guide';

export const Route = createFileRoute('/cli')({
  head: () => ({ meta: [{ title: 'Codex CLI 使用指南 | Codex 中文网' }] }),
  component: () => <CodexdownGuidePage slug="cli" />,
});
