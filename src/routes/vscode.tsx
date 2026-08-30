import { createFileRoute } from '@tanstack/react-router';

import { CodexdownGuidePage } from '@/components/codexdown-guide';

export const Route = createFileRoute('/vscode')({
  head: () => ({ meta: [{ title: 'Codex VS Code 使用指南 | Codex 中文网' }] }),
  component: () => <CodexdownGuidePage slug="vscode" />,
});
