import { createFileRoute } from '@tanstack/react-router';

import { CodexdownShowcasePage } from '@/components/codexdown-showcase';

export const Route = createFileRoute('/showcase/')({
  head: () => ({
    meta: [
      { title: 'OpenAI 案例 - Codex 与 GPT 应用展示 | Codex中文网' },
      {
        name: 'description',
        content:
          '中文整理由 Codex、GPT-5.5、GPT Image 和 Computer Use 构建的 OpenAI Showcase 案例。',
      },
    ],
  }),
  component: CodexdownShowcasePage,
});
