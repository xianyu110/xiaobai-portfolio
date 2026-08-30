import { createServerFn } from '@tanstack/react-start';

import {
  getLocalPosts,
  loadLocalPost,
  mergePosts,
  type BlogPost,
  type BlogPostDetail,
} from './index';

// Database access stays behind server functions (dynamic import keeps
// drizzle out of the client bundle), mirroring the analytics pattern.

async function getDbPosts(): Promise<BlogPost[]> {
  try {
    const { listPublishedArticles } = await import('@/modules/posts/service');
    const rows = await listPublishedArticles();
    return rows.map((row) => ({
      slug: row.slug,
      title: row.title || row.slug,
      description: row.description || '',
      image: row.image || undefined,
      createdAt: new Date(row.createdAt).toISOString(),
      authorName: row.authorName || undefined,
      authorImage: row.authorImage || undefined,
      source: 'db' as const,
    }));
  } catch {
    // Database not configured/reachable — local posts still render.
    return [];
  }
}

/**
 * All blog posts: database posts merged with local MDX posts,
 * deduped by slug (database wins), newest first.
 */
export const getBlogPostsFn = createServerFn()
  .inputValidator((data: { locale: string; limit?: number }) => data)
  .handler(async ({ data }) => {
    const dbPosts = await getDbPosts();
    return mergePosts(dbPosts, getLocalPosts(data.locale), {
      limit: data.limit,
    });
  });

/**
 * Single blog post by slug: database first, local MDX as fallback.
 * Local posts return meta only — the route component resolves the MDX
 * Content from the bundled glob map (components don't serialize).
 */
export const getBlogPostFn = createServerFn()
  .inputValidator((data: { slug: string; locale: string }) => data)
  .handler(async ({ data }): Promise<BlogPostDetail | null> => {
    try {
      const { findPublishedBySlug } = await import('@/modules/posts/service');
      const row = await findPublishedBySlug(data.slug);
      if (row) {
        return {
          slug: row.slug,
          title: row.title || row.slug,
          description: row.description || '',
          image: row.image || undefined,
          createdAt: new Date(row.createdAt).toISOString(),
          authorName: row.authorName || undefined,
          authorImage: row.authorImage || undefined,
          source: 'db',
          content: row.content || '',
        };
      }
    } catch {
      // Database not configured/reachable — fall through to local posts.
    }

    const mod = loadLocalPost(data.slug, data.locale);
    if (!mod) return null;
    const meta = mod.meta;
    return {
      slug: data.slug,
      title: meta.title,
      description: meta.description,
      image: meta.image,
      createdAt: new Date(meta.created_at).toISOString(),
      authorName: meta.author_name,
      authorImage: meta.author_image,
      source: 'local',
    };
  });
