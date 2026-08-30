import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowLeft,
  ArrowRight,
  Github,
  Globe,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react';

import { envConfigs } from '@/config';
import { getLocale, locales, localizeUrl } from '@/paraglide/runtime.js';

import '@/styles/ccswitch-home.css';

const GITHUB_URL = 'https://github.com/xianyu110/cc-switch';
const MOMO_API_URL = 'https://momoai.asia';

export const Route = createFileRoute('/sponsors')({
  head: () => {
    const locale = getLocale();
    const urlFor = (loc: string) =>
      localizeUrl(`${envConfigs.app_url}/sponsors`, { locale: loc as any })
        .href;

    return {
      meta: [
        { title: 'MomoAPI 赞助商 | CC Switch' },
        {
          name: 'description',
          content: 'CC Switch 官方赞助商：MomoAPI。',
        },
      ],
      links: [
        { rel: 'canonical', href: urlFor(locale) },
        ...locales.map((loc) => ({
          rel: 'alternate',
          hrefLang: loc,
          href: urlFor(loc),
        })),
        { rel: 'alternate', hrefLang: 'x-default', href: urlFor('zh') },
      ],
    };
  },
  component: CCSwitchSponsors,
});

function CCSwitchSponsors() {
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);

  return (
    <div className={`cc-page cc-sponsor-page${dark ? 'cc-dark' : ''}`}>
      <header className="cc-nav">
        <a href="/zh/" className="cc-brand">
          <img src="/ccswitch/logo.png" alt="CC Switch" />
          <b>CC Switch</b>
        </a>
        <nav id="cc-mobile-navigation" className={menu ? 'is-open' : ''}>
          <a href="/zh/">首页</a>
          <a href="/zh/docs">文档</a>
          <a href="/zh/tutorials">攻略</a>
          <a href="/zh/changelog">更新日志</a>
          <a href="/zh/sponsors">赞助商</a>
          <a href="/zh/download">免费下载</a>
        </nav>
        <div className="cc-nav-actions">
          <button aria-label="切换语言">
            <Globe size={17} />
            <span>🇨🇳</span>
          </button>
          <button aria-label="切换主题" onClick={() => setDark(!dark)}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a
            href={GITHUB_URL}
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={19} />
          </a>
          <button
            className="cc-menu"
            aria-label="打开菜单"
            aria-expanded={menu}
            aria-controls="cc-mobile-navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main className="cc-sponsor-main">
        <section className="cc-sponsor-intro">
          <a className="cc-back-link" href="/zh/">
            <ArrowLeft size={16} /> 返回首页
          </a>
          <span className="cc-release">感谢支持 CC Switch</span>
          <h1>赞助商</h1>
          <p>感谢 MomoAPI 对 CC Switch 开源项目的支持。</p>
        </section>

        <section className="cc-sponsor-card" aria-label="MomoAPI 赞助商">
          <div className="cc-sponsor-card-logo">
            <img src="/ccswitch/logo.png" alt="MomoAPI" />
          </div>
          <div className="cc-sponsor-card-copy">
            <span className="cc-sponsor-label">唯一赞助商</span>
            <h2>MomoAPI</h2>
            <p>
              稳定、高性价比的 API 服务，为 AI 编程工具提供可靠的模型访问体验。
            </p>
            <a
              className="cc-btn cc-btn-primary"
              href={MOMO_API_URL}
              target="_blank"
              rel="noreferrer"
            >
              访问 MomoAPI <ArrowRight size={17} />
            </a>
          </div>
        </section>
      </main>

      <footer className="cc-footer">
        <div className="cc-footer-bottom">
          <span>© 2025 CC Switch. 基于 MIT 协议开源。</span>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub 开源地址
          </a>
        </div>
      </footer>
    </div>
  );
}
