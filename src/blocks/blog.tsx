import { ArrowRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { BlogCard } from '@/components/blog-card';
import { formatPostDate, type BlogPost } from '@/content/posts';

// Latest-posts landing section. Posts arrive via props (fetched in the
// landing route's loader through the blog server functions) so this block
// stays free of database imports.
export function Blog({ posts }: { posts: BlogPost[] }) {
  const locale = getLocale();

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-20 text-center">
          <h2 className="font-serif text-4xl font-normal tracking-tight sm:text-5xl">
            {m['landing.blog.title']()}
          </h2>
          <p className="text-muted-foreground mx-auto mt-5 max-w-lg">
            {m['landing.blog.description']()}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.slug}
              href={`/blog/${post.slug}`}
              title={post.title}
              description={post.description}
              image={post.image}
              date={formatPostDate(post.createdAt, locale)}
              authorName={post.authorName}
              authorImage={post.authorImage}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            {m['landing.blog.view_all']()}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
