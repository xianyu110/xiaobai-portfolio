import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  Compass,
  History,
  Monitor,
  Rocket,
  Search,
} from 'lucide-react';

import {
  codexDocDetails,
  type CodexDocSection,
} from '@/content/codexdown-docs';
import {
  articleIndex,
  articles,
  docCategories,
  docGroups,
  findArticle,
  findDoc,
  findDocCategory,
  type ArticleSection,
} from '@/content/codexdown-inner';

import '@/styles/codexdown-inner.css';

const A = '/codexdown';

function InnerHeader({ active = '文章' }: { active?: string }) {
  return (
    <header className="cdi-header">
      <a className="cdi-brand" href="/">
        <img src={`${A}/icon.png`} alt="Codex 图标" />
        <span>codex中文网</span>
      </a>
      <nav aria-label="主导航">
        <a className={active === '首页' ? 'active' : ''} href="/">
          首页
        </a>
        <a className={active === '文章' ? 'active' : ''} href="/articles/">
          文章
        </a>
        <a className={active === '文档' ? 'active' : ''} href="/docs/">
          文档
        </a>
        <a className={active === '教程' ? 'active' : ''} href="/guides/">
          教程
        </a>
        <a href="/#plugins">插件</a>
      </nav>
      <div className="cdi-header-search">
        <Search size={17} aria-hidden="true" />
        <span>搜索内容</span>
      </div>
    </header>
  );
}

function InnerFooter() {
  return (
    <footer className="cdi-footer">
      <a className="cdi-brand" href="/">
        <img src={`${A}/icon.png`} alt="" />
        <span>codex中文网</span>
      </a>
      <span>Codex 下载、安装与实操知识库</span>
      <nav>
        <a href="/">首页</a>
        <a href="/articles/">文章</a>
        <a href="/guides/">教程</a>
        <a href="/docs/">文档</a>
        <a href="/#faq">FAQ</a>
      </nav>
    </footer>
  );
}

function ArticleCard({ article }: { article: (typeof articles)[number] }) {
  return (
    <article className="cdi-article-card">
      <div className="cdi-meta">
        <span>Published {article.published}</span>
        <span>Updated {article.updated}</span>
      </div>
      <div className="cdi-tag-row">
        {article.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
      <h2>
        <a href={`/articles/${article.slug}/`}>{article.title}</a>
      </h2>
      <p>{article.description}</p>
      <a className="cdi-read-link" href={`/articles/${article.slug}/`}>
        阅读全文 <ArrowRight size={16} />
      </a>
    </article>
  );
}

export function CodexdownArticlesPage() {
  return (
    <div className="cdi-page">
      <InnerHeader />
      <main className="cdi-article-index">
        <header className="cdi-index-heading">
          <span className="cdi-eyebrow">合集</span>
          <h1>Codex 文章中心</h1>
          <p>
            Codex 使用指南 · {articleIndex.length} 篇文章 · 最近更新 2026-07-25
          </p>
          <div className="cdi-tag-row">
            <a href="/">#Codex下载</a>
            <a href="/docs/">#Codex 文档</a>
            <a href="/#plugins">#Codex 插件</a>
          </div>
        </header>
        <div className="cdi-article-grid">
          {articleIndex.map((article) => (
            <ArticleCard article={article} key={article.slug} />
          ))}
        </div>
      </main>
      <InnerFooter />
    </div>
  );
}

function RenderArticleSection({
  section,
  index,
}: {
  section: ArticleSection;
  index: number;
}) {
  const Heading = section.level === 3 ? 'h3' : 'h2';
  return (
    <section className="cdi-prose-section" key={`${section.heading}-${index}`}>
      {section.heading && <Heading>{section.heading}</Heading>}
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {section.bullets && (
        <ul>
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
      {section.links && (
        <ul className="cdi-prose-links">
          {section.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
                <span aria-hidden="true"> ↗</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {section.code && (
        <pre>
          <code>{section.code}</code>
        </pre>
      )}
      {section.quote && <blockquote>{section.quote}</blockquote>}
    </section>
  );
}

export function CodexdownArticlePage({ slug }: { slug: string }) {
  const article = findArticle(slug);
  if (!article)
    return (
      <div className="cdi-page">
        <InnerHeader />
        <main className="cdi-not-found">
          <h1>文章不存在</h1>
          <a href="/articles/">返回文章中心</a>
        </main>
      </div>
    );
  return (
    <div className="cdi-page">
      <InnerHeader active="文章" />
      <main className="cdi-article-detail">
        <a className="cdi-back-link" href="/articles/">
          <ArrowLeft size={16} />
          返回文章中心
        </a>
        <article>
          <header className="cdi-detail-heading">
            <div className="cdi-meta">
              <span>原创</span>
              <span>已于 {article.updated} 修改</span>
            </div>
            <div className="cdi-tag-row">
              {article.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
            <h1>{article.title}</h1>
            <p className="cdi-detail-intro">{article.intro}</p>
          </header>
          <div className="cdi-prose">
            {article.sections.map((section, index) => (
              <RenderArticleSection
                index={index}
                section={section}
                key={`${section.heading}-${index}`}
              />
            ))}
          </div>
          <footer className="cdi-detail-next">
            <a href="/articles/">
              <ArrowLeft size={16} />
              文章中心
            </a>
            <a
              href={`/articles/${articles[(articles.findIndex((item) => item.slug === slug) + 1) % articles.length].slug}/`}
            >
              下一篇 <ArrowRight size={16} />
            </a>
          </footer>
        </article>
      </main>
      <InnerFooter />
    </div>
  );
}

function DocsSidebar({ current }: { current?: string }) {
  return (
    <aside className="cdi-docs-sidebar" aria-label="文档导航">
      <a className="cdi-doc-overview" href="/docs/">
        概览
      </a>
      <div className="cdi-doc-category-links">
        <h2>主题</h2>
        {docCategories.map((category) => (
          <a
            className={current === category.slug ? 'active' : ''}
            href={`/docs/${category.slug}/`}
            key={category.slug}
          >
            {category.title}
          </a>
        ))}
      </div>
      {docGroups.map((group) => (
        <div key={group.title}>
          <h2>{group.title}</h2>
          <ul>
            {group.items.map((item) => (
              <li key={item.slug}>
                <a
                  className={current === item.slug ? 'active' : ''}
                  href={`/docs/${item.slug}/`}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}

function DocsTopNav() {
  return (
    <nav className="cdi-docs-topnav" aria-label="文档分类">
      <a href="/docs/">概览</a>
      <a href="/docs/features/">功能</a>
      <a href="/docs/configuration/">配置</a>
      <a href="/docs/developers/">开发者</a>
      <a href="/docs/security-administration/">安全</a>
      <a href="/docs/administration/">管理</a>
      <button type="button" aria-label="文档内容搜索">
        <Search size={16} />
        搜索文档
      </button>
    </nav>
  );
}

const docsOverview = [
  {
    title: '开始使用',
    description: '从快速开始、基础用法和导入流程开始。',
    icon: Rocket,
    items: [
      ['快速开始', 'quickstart'],
      ['使用 ChatGPT', 'use-chatgpt'],
      ['开始使用 ChatGPT Work', 'get-started-with-work'],
      ['从其他智能体导入', 'import'],
    ],
  },
  {
    title: '基础',
    description: '掌握提示词、个性化、技能、插件与权限。',
    icon: Blocks,
    items: [
      ['提示词', 'prompting'],
      ['个性化 ChatGPT', 'personalize'],
      ['技能与插件', 'skills-and-plugins'],
      ['权限', 'permission-modes'],
    ],
  },
  {
    title: '探索',
    description: '查看最新动态、模型、定价和常用术语。',
    icon: Compass,
    items: [
      ['最新动态', 'whats-new'],
      ['模型', 'models'],
      ['定价', 'pricing'],
      ['术语表', 'glossary'],
    ],
  },
  {
    title: '可用平台',
    description: '选择桌面端、Web、CLI、IDE 或云端使用。',
    icon: Monitor,
    items: [
      ['ChatGPT 桌面应用', 'app'],
      ['ChatGPT 网页版', 'web'],
      ['Codex CLI', 'codex/cli'],
      ['Codex IDE 扩展', 'codex/ide'],
      ['Codex 云端', 'cloud'],
    ],
  },
  {
    title: '发布',
    description: '跟进更新日志、功能成熟度和开源进展。',
    icon: History,
    items: [
      ['更新日志', 'changelog'],
      ['功能成熟度', 'feature-maturity'],
      ['开源', 'open-source'],
    ],
  },
];

export function CodexdownDocsPage() {
  return (
    <div className="cdi-page cdi-doc-page">
      <InnerHeader active="文档" />
      <DocsTopNav />
      <div className="cdi-docs-layout">
        <DocsSidebar />
        <main className="cdi-docs-main">
          <section className="cdi-doc-hero">
            <h1>概览</h1>
            <p>
              从一个目标、想法或任务开始。ChatGPT
              可以收集上下文、采取行动，并产出真正有用的结果。
            </p>
            <div className="cdi-doc-hero-actions">
              <a href="/docs/quickstart/">快速开始</a>
              <a
                href="https://learn.chatgpt.com/use-cases"
                target="_blank"
                rel="noreferrer"
              >
                探索用例
              </a>
            </div>
            <img src={`${A}/assistant-plan.png`} alt="Codex 桌面版预览" />
          </section>
          <section
            className="cdi-doc-updates"
            aria-labelledby="docs-updates-title"
          >
            <header className="cdi-doc-section-heading">
              <h2 id="docs-updates-title">最新动态</h2>
              <a href="/docs/whats-new/">查看全部更新</a>
            </header>
            <ol className="cdi-doc-timeline">
              <li>
                <time>2026 年 7 月 6–10 日</time>
                <span aria-hidden="true" />
                <a href="/docs/whats-new/">
                  <strong>使用 ChatGPT Work 完成更有挑战性的工作</strong>
                  <small>2026 年 7 月 6–10 日</small>
                </a>
              </li>
              <li>
                <time>2026 年 6 月 15–19 日</time>
                <span aria-hidden="true" />
                <a href="/docs/whats-new/">
                  <strong>把演示过的工作流变成可复用 skills</strong>
                  <small>2026 年 6 月 15–19 日</small>
                </a>
              </li>
            </ol>
          </section>
          <section
            className="cdi-doc-navigation"
            aria-labelledby="docs-navigation-title"
          >
            <header className="cdi-doc-section-heading">
              <h2 id="docs-navigation-title">文档导航</h2>
            </header>
            <p>
              从入门主题进入，也可以直接查找 Codex CLI、IDE、配置和开发者工具。
            </p>
            <div className="cdi-doc-groups">
              {docsOverview.map(({ title, description, icon: Icon, items }) => (
                <details className="cdi-doc-group" key={title}>
                  <summary>
                    <span className="cdi-doc-group-icon" aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    <h2>{title}</h2>
                    <span className="cdi-doc-group-description">
                      {description}
                    </span>
                    <ArrowRight className="cdi-doc-group-arrow" size={20} />
                  </summary>
                  <ul>
                    {items.map(([itemTitle, slug]) => (
                      <li key={slug}>
                        <a href={`/docs/${slug}/`}>
                          <span>{itemTitle}</span>
                          <ArrowRight size={18} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </section>
          <section
            className="cdi-doc-category-navigation"
            aria-labelledby="docs-category-navigation-title"
          >
            <header className="cdi-doc-section-heading">
              <h2 id="docs-category-navigation-title">按主题浏览</h2>
            </header>
            <p>从功能、配置、开发者、安全和管理主题进入对应的完整文档索引。</p>
            <div className="cdi-doc-category-grid">
              {docCategories.map((category) => (
                <a
                  className="cdi-doc-category-card"
                  href={`/docs/${category.slug}/`}
                  key={category.slug}
                >
                  <strong>{category.title}</strong>
                  <span>{category.description}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
      <InnerFooter />
    </div>
  );
}

export function CodexdownDocCategoryPage({ slug }: { slug: string }) {
  const category = findDocCategory(slug);
  if (!category) return <CodexdownDocPage slug={slug} />;

  return (
    <div className="cdi-page cdi-doc-page">
      <InnerHeader active="文档" />
      <DocsTopNav />
      <div className="cdi-docs-layout">
        <DocsSidebar current={slug} />
        <main className="cdi-docs-main cdi-doc-detail">
          <a className="cdi-back-link" href="/docs/">
            <ArrowLeft size={16} />
            文档概览
          </a>
          <article>
            <header>
              <span className="cdi-eyebrow">文档分类</span>
              <h1>{category.title}</h1>
              <p>{category.description}</p>
            </header>
            {category.sections.map((section) => (
              <section className="cdi-category-section" key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.description}</p>
                <ul className="cdi-category-links">
                  {section.items.map((item) => (
                    <li key={`${section.heading}-${item.title}`}>
                      {item.slug ? (
                        <a href={`/docs/${item.slug}/`}>
                          <strong>{item.title}</strong>
                          <span>{item.description}</span>
                          <ArrowRight size={17} aria-hidden="true" />
                        </a>
                      ) : (
                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.description}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </article>
          <footer className="cdi-detail-next">
            <a href="/docs/">
              <ArrowLeft size={16} />
              返回文档概览
            </a>
          </footer>
        </main>
      </div>
      <InnerFooter />
    </div>
  );
}

function RenderDocSection({
  section,
  index,
}: {
  section: CodexDocSection;
  index: number;
}) {
  const Heading = section.level === 3 ? 'h3' : 'h2';
  return (
    <section className="cdi-prose-section" key={`${section.heading}-${index}`}>
      {section.heading && <Heading>{section.heading}</Heading>}
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {section.bullets && (
        <ul>
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
      {section.codeBlocks?.map((code) => (
        <pre key={code}>
          <code>{code}</code>
        </pre>
      ))}
      {section.quotes?.map((quote) => (
        <blockquote key={quote}>{quote}</blockquote>
      ))}
      {section.tables &&
        section.tables.length > 0 &&
        (() => {
          const [header, ...body] = section.tables;
          return (
            <div className="cdi-doc-table-wrap">
              <table className="cdi-doc-table">
                {header && (
                  <thead>
                    <tr>
                      {header.map((cell) => (
                        <th key={cell}>{cell}</th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {body.map((row, rowIndex) => (
                    <tr key={`${row.join('-')}-${rowIndex}`}>
                      {row.map((cell, cellIndex) =>
                        cellIndex === 0 ? (
                          <th key={cell}>{cell}</th>
                        ) : (
                          <td key={cell}>{cell}</td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
    </section>
  );
}

export function CodexdownDocPage({ slug }: { slug: string }) {
  const doc = findDoc(slug);
  const detail = codexDocDetails[slug];
  return (
    <div className="cdi-page cdi-doc-page">
      <InnerHeader active="文档" />
      <DocsTopNav />
      <div className="cdi-docs-layout">
        <DocsSidebar current={slug} />
        <main className="cdi-docs-main cdi-doc-detail">
          <a className="cdi-back-link" href="/docs/">
            <ArrowLeft size={16} />
            文档概览
          </a>
          <article>
            <header>
              <span className="cdi-eyebrow">开始使用</span>
              <h1>{detail?.title ?? doc?.title ?? '文档主题'}</h1>
              <p>
                {doc?.description ??
                  '了解 Codex 的使用方式、配置边界和常见工作流。'}
              </p>
            </header>
            {detail?.sections.map((section, index) => (
              <RenderDocSection
                index={index}
                key={`${section.heading}-${index}`}
                section={section}
              />
            ))}
            {!detail && (
              <section className="cdi-prose-section">
                <h2>开始实践</h2>
                <p>
                  先明确目标，再提供项目上下文和期望输出。涉及外部操作、文件修改或发送内容时，请在最终确认前检查结果。
                </p>
              </section>
            )}
          </article>
          <footer className="cdi-detail-next">
            <a href="/docs/">
              <ArrowLeft size={16} />
              上一篇 概览
            </a>
            <a href="/docs/quickstart/">
              下一篇 快速开始 <ArrowRight size={16} />
            </a>
          </footer>
        </main>
      </div>
      <InnerFooter />
    </div>
  );
}
