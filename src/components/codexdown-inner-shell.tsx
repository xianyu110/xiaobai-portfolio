import { Search } from 'lucide-react';

const A = '/codexdown';

export function InnerHeader({ active = '文章' }: { active?: string }) {
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

export function InnerFooter() {
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
      </nav>
    </footer>
  );
}
