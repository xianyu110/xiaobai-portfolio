import { createFileRoute } from '@tanstack/react-router';

import { CodexdownGuideIndexPage } from '@/components/codexdown-guide';

export const Route = createFileRoute('/guides/')({
  head: () => ({ meta: [{ title: 'Codex 教程中心 | Codex 中文网' }] }),
  component: CodexdownGuideIndexPage,
});
