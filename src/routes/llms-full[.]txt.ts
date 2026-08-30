import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { baseLocale } from '@/paraglide/runtime.js';
import { getLocalPosts, mergePosts } from '@/content/posts';

const STATIC_PAGES: { path: string; title: string; description: string }[] = [
  { path: '', title: 'Home', description: 'Landing page' },
  { path: '/pricing', title: 'Pricing', description: 'Pricing plans' },
  { path: '/blog', title: 'Blog', description: 'Blog posts and articles' },
];

export const Route = createFileRoute('/llms-full.txt')({
  server: {
    handlers: {
      GET: async () => {
        const { app_url, app_name, app_description } = envConfigs;

        const lines: string[] = [
          `# ${app_name}`,
          '',
          `> ${app_description}`,
          '',
          '## Pages',
          '',
          ...STATIC_PAGES.map(
            (p) => `- [${p.title}](${app_url}${p.path}): ${p.description}`
          ),
        ];

        let posts = getLocalPosts(baseLocale);
        try {
          const { listPublishedArticles, findPublishedBySlug } =
            await import('@/modules/posts/service');
          const rows = await listPublishedArticles().catch(() => []);
          const dbPosts = rows.map((row) => ({
            slug: row.slug,
            title: row.title || row.slug,
            description: row.description || '',
            createdAt: new Date(row.createdAt).toISOString(),
            source: 'db' as const,
          }));
          posts = mergePosts(dbPosts, posts);

          if (posts.length > 0) {
            lines.push('', '## Blog Posts', '');

            for (const post of posts) {
              lines.push(`### ${post.title}`, '');
              lines.push(`URL: ${app_url}/blog/${post.slug}`);
              if (post.description)
                lines.push(`Description: ${post.description}`);
              lines.push('');

              if (post.source === 'db') {
                const detail = await findPublishedBySlug(post.slug).catch(
                  () => null
                );
                if (detail?.content) {
                  lines.push(detail.content, '');
                }
              }

              lines.push('---', '');
            }
          }
        } catch {
          // Database unreachable — list local posts without content.
          if (posts.length > 0) {
            lines.push('', '## Blog Posts', '');
            for (const post of posts) {
              lines.push(`### ${post.title}`, '');
              lines.push(`URL: ${app_url}/blog/${post.slug}`);
              if (post.description)
                lines.push(`Description: ${post.description}`);
              lines.push('', '---', '');
            }
          }
        }

        lines.push('');

        return new Response(lines.join('\n'), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      },
    },
  },
});
