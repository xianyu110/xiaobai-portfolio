import { createFileRoute } from '@tanstack/react-router';

import { CodexdownGuidePage } from '@/components/codexdown-guide';

export const Route = createFileRoute('/windows')({
  head: () => ({
    meta: [{ title: 'Codex Windows 下载与使用指南 | Codex 中文网' }],
  }),
  component: () => <CodexdownGuidePage slug="windows" />,
});
