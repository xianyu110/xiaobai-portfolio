import { and, count, desc, eq, like, or, type SQL } from 'drizzle-orm';

import { db } from '@/core/db';
import { post } from '@/config/db/schema';
import { getUuid } from '@/lib/hash';

export enum PostType {
  ARTICLE = 'article',
  PAGE = 'page',
  LOG = 'log',
}

export enum PostStatus {
  PUBLISHED = 'published',
  PENDING = 'pending',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
}

type Post = typeof post.$inferSelect;
type NewPost = typeof post.$inferInsert;

export type PublishedArticleItem = Pick<
  Post,
  | 'id'
  | 'slug'
  | 'title'
  | 'description'
  | 'image'
  | 'authorName'
  | 'authorImage'
  | 'createdAt'
>;

export async function list(params: {
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const { type, status, search, page = 1, pageSize = 10 } = params;
  const offset = (page - 1) * pageSize;

  const conditions: SQL[] = [];
  if (type) conditions.push(eq(post.type, type));
  if (status) conditions.push(eq(post.status, status));
  if (search) {
    conditions.push(
      or(like(post.title, `%${search}%`), like(post.slug, `%${search}%`))!
    );
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult] = await db()
    .select({ count: count() })
    .from(post)
    .where(where);
  const total = totalResult.count;

  const items = await db()
    .select({
      id: post.id,
      slug: post.slug,
      type: post.type,
      title: post.title,
      description: post.description,
      image: post.image,
      categories: post.categories,
      authorName: post.authorName,
      status: post.status,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    })
    .from(post)
    .where(where)
    .orderBy(desc(post.updatedAt), desc(post.createdAt))
    .limit(pageSize)
    .offset(offset);

  return { items, total };
}

export async function listPublishedArticles(
  params: { limit?: number } = {}
): Promise<PublishedArticleItem[]> {
  const { limit = 100 } = params;
  return db()
    .select({
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.description,
      image: post.image,
      authorName: post.authorName,
      authorImage: post.authorImage,
      createdAt: post.createdAt,
    })
    .from(post)
    .where(
      and(
        eq(post.type, PostType.ARTICLE),
        eq(post.status, PostStatus.PUBLISHED)
      )
    )
    .orderBy(desc(post.createdAt))
    .limit(limit);
}

export async function findPublishedBySlug(
  slug: string
): Promise<Post | undefined> {
  const [result] = await db()
    .select()
    .from(post)
    .where(
      and(
        eq(post.slug, slug.toLowerCase()),
        eq(post.status, PostStatus.PUBLISHED)
      )
    )
    .limit(1);
  return result;
}

export async function getById(id: string) {
  const [result] = await db()
    .select()
    .from(post)
    .where(eq(post.id, id))
    .limit(1);
  return result;
}

export async function create(data: {
  userId: string;
  slug: string;
  title: string;
  description?: string;
  image?: string;
  content?: string;
  categories?: string;
  authorName?: string;
  status?: string;
}) {
  const newPost: NewPost = {
    id: getUuid(),
    userId: data.userId,
    slug: data.slug.toLowerCase(),
    type: PostType.ARTICLE,
    title: data.title,
    description: data.description || '',
    image: data.image || '',
    content: data.content || '',
    categories: data.categories || '',
    authorName: data.authorName || '',
    status: data.status || PostStatus.DRAFT,
  };
  const [result] = await db().insert(post).values(newPost).returning();
  return result;
}

export async function update(
  id: string,
  data: {
    slug?: string;
    title?: string;
    description?: string;
    image?: string;
    content?: string;
    categories?: string;
    authorName?: string;
    status?: string;
  }
) {
  const updateData: any = { ...data };
  if (updateData.slug) updateData.slug = updateData.slug.toLowerCase();
  const [result] = await db()
    .update(post)
    .set(updateData)
    .where(eq(post.id, id))
    .returning();
  return result;
}

export async function remove(id: string) {
  await db()
    .update(post)
    .set({ status: PostStatus.ARCHIVED })
    .where(eq(post.id, id));
}
