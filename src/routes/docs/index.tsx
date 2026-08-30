import { createFileRoute } from '@tanstack/react-router';

import { CCSwitchDocs } from '@/components/ccswitch-docs';

export const Route = createFileRoute('/docs/')({
  head: () => ({
    meta: [
      { title: '快速入门 - CC Switch 文档' },
      {
        name: 'description',
        content:
          'CC Switch 文档：统一管理 AI 编程工具供应商、扩展、路由与用量。',
      },
    ],
  }),
  component: CCSwitchDocs,
});
