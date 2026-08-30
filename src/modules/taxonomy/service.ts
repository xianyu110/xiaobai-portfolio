import { and, count, desc, eq, like, or, type SQL } from 'drizzle-orm';

import { db } from '@/core/db';
import { taxonomy } from '@/config/db/schema';
import { getUuid } from '@/lib/hash';

export enum TaxonomyType {
  CATEGORY = 'category',
  TAG = 'tag',
}

export enum TaxonomyStatus {
  PUBLISHED = 'published',
  PENDING = 'pending',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
}

type NewTaxonomy = typeof taxonomy.$inferInsert;

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
  if (type) conditions.push(eq(taxonomy.type, type));
  if (status) conditions.push(eq(taxonomy.status, status));
  else conditions.push(eq(taxonomy.status, TaxonomyStatus.PUBLISHED));
  if (search) {
    conditions.push(
      or(
        like(taxonomy.title, `%${search}%`),
        like(taxonomy.slug, `%${search}%`)
      )!
    );
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult] = await db()
    .select({ count: count() })
    .from(taxonomy)
    .where(where);
  const total = totalResult.count;

  const items = await db()
    .select()
    .from(taxonomy)
    .where(where)
    .orderBy(desc(taxonomy.createdAt))
    .limit(pageSize)
    .offset(offset);

  return { items, total };
}

export async function getAll(type: string) {
  return db()
    .select({ id: taxonomy.id, title: taxonomy.title, slug: taxonomy.slug })
    .from(taxonomy)
    .where(
      and(
        eq(taxonomy.type, type),
        eq(taxonomy.status, TaxonomyStatus.PUBLISHED)
      )
    )
    .orderBy(desc(taxonomy.createdAt));
}

export async function create(data: {
  userId: string;
  slug: string;
  type: string;
  title: string;
  description?: string;
}) {
  const newTaxonomy: NewTaxonomy = {
    id: getUuid(),
    userId: data.userId,
    slug: data.slug.toLowerCase(),
    type: data.type,
    title: data.title,
    description: data.description || '',
    status: TaxonomyStatus.PUBLISHED,
  };
  const [result] = await db().insert(taxonomy).values(newTaxonomy).returning();
  return result;
}

export async function update(
  id: string,
  data: {
    slug?: string;
    title?: string;
    description?: string;
    status?: string;
  }
) {
  const updateData: any = { ...data };
  if (updateData.slug) updateData.slug = updateData.slug.toLowerCase();
  const [result] = await db()
    .update(taxonomy)
    .set(updateData)
    .where(eq(taxonomy.id, id))
    .returning();
  return result;
}

export async function remove(id: string) {
  await db()
    .update(taxonomy)
    .set({ status: TaxonomyStatus.ARCHIVED })
    .where(eq(taxonomy.id, id));
}
