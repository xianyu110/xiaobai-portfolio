import { createFileRoute } from '@tanstack/react-router';

import { CodexdownArticlesPage } from '@/components/codexdown-inner';

export const Route = createFileRoute('/articles/')({
  head: () => ({
    meta: [
      { title: 'Codex 文章中心 | Codex 中文网' },
      {
        name: 'description',
        content: 'Codex 下载、安装、配置、模型与 API 使用教程。',
      },
    ],
  }),
  component: CodexdownArticlesPage,
});
