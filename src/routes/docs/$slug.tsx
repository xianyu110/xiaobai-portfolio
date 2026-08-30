import { createFileRoute } from '@tanstack/react-router';

import {
  CodexdownDocCategoryPage,
  CodexdownDocPage,
} from '@/components/codexdown-inner';
import { findDocCategory } from '@/content/codexdown-inner';

export const Route = createFileRoute('/docs/$slug')({
  head: () => ({ meta: [{ title: 'Codex 文档主题 | Codex 中文网' }] }),
  component: () => {
    const { slug } = Route.useParams();
    return findDocCategory(slug) ? (
      <CodexdownDocCategoryPage slug={slug} />
    ) : (
      <CodexdownDocPage slug={slug} />
    );
  },
});
