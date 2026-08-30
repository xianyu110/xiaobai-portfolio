import { createFileRoute } from '@tanstack/react-router';

import { CodexdownGuidePage } from '@/components/codexdown-guide';

export const Route = createFileRoute('/mac')({
  head: () => ({
    meta: [{ title: 'Codex Mac 下载与使用指南 | Codex 中文网' }],
  }),
  component: () => <CodexdownGuidePage slug="mac" />,
});
