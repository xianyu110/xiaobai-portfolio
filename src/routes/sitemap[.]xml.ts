import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { baseLocale, locales, localizeUrl } from '@/paraglide/runtime.js';
import { articles, docCategories, docGroups } from '@/content/codexdown-inner';
import { getLocalPosts, mergePosts } from '@/content/posts';

const STATIC_PATHS = [
  '',
  '/updates',
  '/windows',
  '/mac',
  '/cli',
  '/vscode',
  '/cursor',
  '/windsurf',
  '/guides',
  '/articles',
  '/docs',
  '/pricing',
  '/blog',
  '/privacy-policy',
  '/terms-of-service',
];

const DOC_CATEGORY_PATHS = docCategories.map(
  (category) => `/docs/${category.slug}`
);
const DOC_PAGE_PATHS = docGroups.flatMap((group) =>
  group.items.map((item) => `/docs/${item.slug}`)
);

type Entry = {
  path: string;
  locale: string;
  lastModified?: string;
};

function urlFor(path: string, locale: string): string {
  return localizeUrl(`${envConfigs.app_url}${path || '/'}`, {
    locale: locale as (typeof locales)[number],
  }).href;
}

function escapeXml(value: string): string {
  return value.replace(
    /[<>&'\"]/g,
    (character) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[character] ?? character
  );
}

function entryXml(e: Entry): string {
  return [
    '  <url>',
    `    <loc>${escapeXml(urlFor(e.path, e.locale))}</loc>`,
    e.lastModified
      ? `    <lastmod>${escapeXml(e.lastModified)}</lastmod>`
      : null,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const entries: Entry[] = [
          ...STATIC_PATHS,
          ...DOC_CATEGORY_PATHS,
          ...DOC_PAGE_PATHS,
        ].flatMap((path) => locales.map((locale) => ({ path, locale })));

        for (const article of articles) {
          for (const locale of locales) {
            entries.push({
              path: `/articles/${article.slug}`,
              locale,
              lastModified: article.updated,
            });
          }
        }

        // Blog posts: db posts merged with local MDX posts.
        try {
          const { listPublishedArticles } =
            await import('@/modules/posts/service');
          const rows = await listPublishedArticles().catch(() => []);
          const dbPosts = rows.map((row) => ({
            slug: row.slug,
            title: row.title || row.slug,
            description: row.description || '',
            createdAt: new Date(row.createdAt).toISOString(),
            source: 'db' as const,
          }));
          const posts = mergePosts(dbPosts, getLocalPosts(baseLocale));
          for (const post of posts) {
            for (const locale of locales) {
              entries.push({
                path: `/blog/${post.slug}`,
                locale,
                lastModified: post.createdAt,
              });
            }
          }
        } catch {
          // Database unreachable — static paths + local posts still listed.
          for (const post of getLocalPosts(baseLocale)) {
            for (const locale of locales) {
              entries.push({
                path: `/blog/${post.slug}`,
                locale,
                lastModified: post.createdAt,
              });
            }
          }
        }

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...entries.map(entryXml),
          '</urlset>',
          '',
        ].join('\n');

        return new Response(xml, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control':
              'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      },
    },
  },
});
