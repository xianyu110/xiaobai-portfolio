import { createFileRoute } from '@tanstack/react-router';

import { CodexdownArticlePage } from '@/components/codexdown-inner';

export const Route = createFileRoute('/articles/$slug')({
  head: () => ({ meta: [{ title: 'Codex 教程文章 | Codex 中文网' }] }),
  component: () => <CodexdownArticlePage slug={Route.useParams().slug} />,
});
