import { useMemo, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';

import { InnerFooter } from '@/components/codexdown-inner-shell';
import {
  findShowcaseProject,
  showcaseCategories,
  showcaseProjects,
  type ShowcaseProject,
} from '@/content/codexdown-showcase';

import '@/styles/codexdown-showcase.css';

const A = '/codexdown/showcase';

function ShowcaseHeader() {
  return (
    <header className="showcase-header">
      <a className="showcase-brand" href="/">
        <img src="/codexdown/icon.png" alt="Codex 图标" />
        <span>Codex 下载</span>
      </a>
      <nav aria-label="主导航">
        <a href="/articles/">文章</a>
        <a href="/docs/">文档</a>
        <a className="active" href="/showcase/">
          案例
        </a>
        <a href="/tools/session-converter/">Session 转换</a>
        <a
          className="download"
          href="https://pan.quark.cn/s/0f1763fe2ac9?pwd=rTQw#/list/share"
        >
          下载 Codex
        </a>
      </nav>
    </header>
  );
}

function ProjectCard({
  project,
  featured = false,
}: {
  project: ShowcaseProject;
  featured?: boolean;
}) {
  return (
    <article className={`showcase-card${featured ? 'featured-card' : ''}`}>
      <a className="showcase-card-image" href={`/showcase/${project.id}/`}>
        <img
          src={`${A}/${project.image}`}
          alt={`${project.title} 案例截图`}
          loading="lazy"
        />
      </a>
      <div className="showcase-card-body">
        <div className="showcase-card-meta">
          <span>{project.category}</span>
          <span>{project.builtWith}</span>
        </div>
        <h3>
          <a href={`/showcase/${project.id}/`}>{project.title}</a>
        </h3>
        <p>{project.summary}</p>
        <div className="showcase-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="showcase-card-links">
          <a href={`/showcase/${project.id}/`}>
            查看案例 <ExternalLink size={14} />
          </a>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              在线演示 <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function CodexdownShowcasePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      showcaseProjects.filter((project) => {
        const matchesCategory =
          category === '全部' || project.category === category;
        const haystack = [
          project.title,
          project.author,
          project.category,
          project.builtWith,
          ...project.tags,
        ]
          .join(' ')
          .toLowerCase();
        return (
          matchesCategory &&
          (!normalizedQuery || haystack.includes(normalizedQuery))
        );
      }),
    [category, normalizedQuery]
  );
  const featured = showcaseProjects.filter((project) => project.featured);
  return (
    <div className="showcase-page">
      <ShowcaseHeader />
      <main className="showcase-main">
        <div className="showcase-wrap">
          <section className="showcase-hero">
            <div className="showcase-hero-copy">
              <span className="showcase-eyebrow">OpenAI Showcase</span>
              <h1>案例</h1>
              <p>
                中文整理 OpenAI Developers Showcase 中由 Codex、GPT-5.5、GPT
                Image、Computer Use 等能力构建的网站、游戏、3D 应用和数据应用。
              </p>
              <form
                className="showcase-search"
                role="search"
                onSubmit={(event) => event.preventDefault()}
              >
                <Search size={18} aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索案例、技术栈、作者或标签"
                />
                <button type="submit">搜索</button>
              </form>
            </div>
            <div className="showcase-hero-stat">
              <strong>18</strong>
              <span>
                个官方 Showcase
                案例已中文化整理，包含重点案例、分类筛选、构建过程和官方来源链接。
              </span>
            </div>
          </section>
          <section
            className="showcase-section"
            aria-labelledby="featured-title"
          >
            <div className="showcase-section-head">
              <div>
                <span className="showcase-eyebrow">Featured</span>
                <h2 id="featured-title">精选案例</h2>
              </div>
            </div>
            <div className="showcase-grid featured-grid">
              {featured.map((project) => (
                <ProjectCard featured project={project} key={project.id} />
              ))}
            </div>
          </section>
          <section className="showcase-section" aria-labelledby="all-title">
            <div className="showcase-section-head">
              <div>
                <span className="showcase-eyebrow">All Projects</span>
                <h2 id="all-title">全部案例</h2>
              </div>
            </div>
            <nav className="showcase-filters" aria-label="案例分类">
              {showcaseCategories.map((item) => (
                <button
                  className={category === item ? 'active' : ''}
                  key={item}
                  onClick={() => setCategory(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </nav>
            <div className="showcase-result-bar">
              <span>
                {normalizedQuery
                  ? `搜索“${query}”`
                  : category === '全部'
                    ? '全部案例'
                    : category}
              </span>
              <strong>{filtered.length} 个案例</strong>
            </div>
            <div className="showcase-grid all-grid">
              {filtered.map((project) => (
                <ProjectCard project={project} key={project.id} />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="showcase-empty">
                没有找到匹配的案例，请更换关键词或分类。
              </p>
            )}
          </section>
        </div>
      </main>
      <InnerFooter />
    </div>
  );
}

export function CodexdownShowcaseDetailPage({ id }: { id: string }) {
  const project = findShowcaseProject(id);
  if (!project) {
    return (
      <div className="showcase-page">
        <ShowcaseHeader />
        <main className="showcase-detail showcase-wrap">
          <h1>案例不存在</h1>
          <a className="showcase-back-link" href="/showcase/">
            返回案例中心
          </a>
        </main>
        <InnerFooter />
      </div>
    );
  }
  return (
    <div className="showcase-page">
      <ShowcaseHeader />
      <main className="showcase-detail showcase-wrap">
        <a className="showcase-back-link" href="/showcase/">
          ← 返回案例中心
        </a>
        <article className="showcase-detail-card">
          <img
            src={`${A}/${project.image}`}
            alt={`${project.title} 案例截图`}
          />
          <div className="showcase-detail-copy">
            <span className="showcase-eyebrow">
              {project.category} · {project.author}
            </span>
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
            <dl>
              <div>
                <dt>构建方式</dt>
                <dd>{project.builtWith}</dd>
              </div>
              <div>
                <dt>标签</dt>
                <dd>{project.tags.join(' · ')}</dd>
              </div>
            </dl>
            <div className="showcase-detail-actions">
              {project.liveUrl && (
                <a
                  className="showcase-detail-button primary"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  打开在线演示 <ExternalLink size={15} />
                </a>
              )}
              <a
                className="showcase-detail-button"
                href={project.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                查看官方来源 <ExternalLink size={15} />
              </a>
              {project.repoUrl && (
                <a
                  className="showcase-detail-button"
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  查看 GitHub <ExternalLink size={15} />
                </a>
              )}
            </div>
          </div>
        </article>
      </main>
      <InnerFooter />
    </div>
  );
}
