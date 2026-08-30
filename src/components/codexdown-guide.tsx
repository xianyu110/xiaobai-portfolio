import { ArrowLeft, ArrowRight } from 'lucide-react';

import { InnerFooter, InnerHeader } from '@/components/codexdown-inner-shell';
import {
  codexGuides,
  findGuide,
  type CodexGuide,
} from '@/content/codexdown-pages';

import '@/styles/codexdown-inner.css';

function GuideSection({
  section,
}: {
  section: CodexGuide['sections'][number];
}) {
  return (
    <section className="cdi-prose-section">
      <h2>{section.heading}</h2>
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {section.bullets ? (
        <ul>
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
      {section.code ? (
        <pre>
          <code>{section.code}</code>
        </pre>
      ) : null}
    </section>
  );
}

export function CodexdownGuideIndexPage() {
  return (
    <div className="cdi-page">
      <InnerHeader active="文章" />
      <main className="cdi-article-index">
        <header className="cdi-index-heading">
          <span className="cdi-eyebrow">教程与平台</span>
          <h1>Codex 教程中心</h1>
          <p>Windows、macOS、CLI、VS Code、Cursor、Windsurf 与更新动态。</p>
        </header>
        <div className="cdi-article-grid">
          {codexGuides.map((guide) => (
            <article className="cdi-article-card" key={guide.slug}>
              <h2>
                <a href={`/${guide.slug}/`}>{guide.title}</a>
              </h2>
              <p>{guide.description}</p>
              <a className="cdi-read-link" href={`/${guide.slug}/`}>
                查看教程 <ArrowRight size={16} />
              </a>
            </article>
          ))}
        </div>
      </main>
      <InnerFooter />
    </div>
  );
}

export function CodexdownGuidePage({ slug }: { slug: string }) {
  const guide = findGuide(slug);
  if (!guide) {
    return (
      <div className="cdi-page">
        <InnerHeader />
        <main className="cdi-not-found">
          <h1>教程不存在</h1>
          <a href="/guides/">返回教程中心</a>
        </main>
      </div>
    );
  }
  const index = codexGuides.findIndex((item) => item.slug === slug);
  const previous =
    codexGuides[(index - 1 + codexGuides.length) % codexGuides.length];
  const next = codexGuides[(index + 1) % codexGuides.length];
  return (
    <div className="cdi-page">
      <InnerHeader active="文章" />
      <main className="cdi-article-detail">
        <a className="cdi-back-link" href="/guides/">
          <ArrowLeft size={16} />
          返回教程中心
        </a>
        <article>
          <header className="cdi-detail-heading">
            <span className="cdi-eyebrow">Codex 教程</span>
            <h1>{guide.title}</h1>
            <p className="cdi-detail-intro">{guide.description}</p>
          </header>
          <div className="cdi-prose">
            {guide.sections.map((section) => (
              <GuideSection key={section.heading} section={section} />
            ))}
          </div>
          <footer className="cdi-detail-next">
            <a href={`/${previous.slug}/`}>
              <ArrowLeft size={16} />
              上一篇
            </a>
            <a href={`/${next.slug}/`}>
              下一篇 <ArrowRight size={16} />
            </a>
          </footer>
        </article>
      </main>
      <InnerFooter />
    </div>
  );
}
