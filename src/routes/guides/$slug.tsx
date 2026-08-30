import { createFileRoute } from '@tanstack/react-router';

import { CodexdownGuidePage } from '@/components/codexdown-guide';

export const Route = createFileRoute('/guides/$slug')({
  head: ({ params }) => ({ meta: [{ title: `${params.slug} | Codex 教程` }] }),
  component: () => <CodexdownGuidePage slug={Route.useParams().slug} />,
});
