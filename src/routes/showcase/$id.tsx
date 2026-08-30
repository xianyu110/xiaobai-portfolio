import { createFileRoute } from '@tanstack/react-router';

import { CodexdownShowcaseDetailPage } from '@/components/codexdown-showcase';
import { findShowcaseProject } from '@/content/codexdown-showcase';

export const Route = createFileRoute('/showcase/$id')({
  head: ({ params }) => {
    const project = findShowcaseProject(params.id);
    return {
      meta: [
        {
          title: project
            ? `${project.title} | Codex Showcase`
            : '案例不存在 | Codex Showcase',
        },
      ],
    };
  },
  component: ShowcaseDetailRoute,
});

function ShowcaseDetailRoute() {
  const { id } = Route.useParams();
  return <CodexdownShowcaseDetailPage id={id} />;
}
