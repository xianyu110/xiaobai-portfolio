import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  CircleHelp,
  Github,
  Globe,
  Menu,
  Moon,
  Puzzle,
  Rocket,
  Search,
  Server,
  Sun,
  Users,
  X,
} from 'lucide-react';

import '@/styles/ccswitch-docs.css';

const GITHUB_URL = 'https://github.com/xianyu110/cc-switch';

type Language = 'zh' | 'en';

type Section = {
  id: string;
  title: string;
  icon: typeof Rocket;
  children?: { id: string; title: string }[];
};

const sections: Section[] = [
  {
    id: 'getting-started',
    title: '快速入门',
    icon: Rocket,
    children: [
      { id: 'introduction', title: '软件介绍' },
      { id: 'installation', title: '安装指南' },
      { id: 'overview', title: '界面概览' },
      { id: 'quick-start', title: '快速上手' },
      { id: 'personalization', title: '个性化配置' },
    ],
  },
  { id: 'providers', title: '供应商管理', icon: Users },
  { id: 'extensions', title: '扩展功能', icon: Puzzle },
  { id: 'routing', title: '本地路由与高可用', icon: Server },
  { id: 'faq', title: '常见问题', icon: CircleHelp },
];

const sectionsEn: Section[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Rocket,
    children: [
      { id: 'introduction', title: 'Introduction' },
      { id: 'installation', title: 'Installation' },
      { id: 'overview', title: 'Interface Overview' },
      { id: 'quick-start', title: 'Quick Start' },
      { id: 'personalization', title: 'Settings' },
    ],
  },
  { id: 'providers', title: 'Provider Management', icon: Users },
  { id: 'extensions', title: 'Extensions', icon: Puzzle },
  { id: 'routing', title: 'Local Routing & HA', icon: Server },
  { id: 'faq', title: 'FAQ', icon: CircleHelp },
];

const toc = [
  ['intro', '1.1 软件介绍'],
  ['what-is', '什么是 CC Switch'],
  ['problems', '解决什么问题'],
  ['features', '核心功能'],
  ['providers-content', '供应商管理'],
  ['extensions-content', '扩展功能'],
  ['routing-content', '代理与高可用'],
  ['apps', '支持的应用'],
  ['platforms', '支持的平台'],
  ['architecture', '技术架构'],
] as const;

const tocEn = [
  ['intro', '1.1 Introduction'],
  ['what-is', 'What is CC Switch'],
  ['problems', 'What Problems Does It Solve'],
  ['features', 'Core Features'],
  ['providers-content', 'Provider Management'],
  ['extensions-content', 'Extensions'],
  ['routing-content', 'Proxy & High Availability'],
  ['apps', 'Supported Applications'],
  ['platforms', 'Supported Platforms'],
  ['architecture', 'Technical Architecture'],
] as const;

const appRows = [
  ['Claude Code', 'Anthropic 官方的 AI 编程助手'],
  ['Claude Desktop', 'Claude 桌面应用，支持官方登录与第三方 3P profile'],
  ['Codex', 'OpenAI 的代码生成工具'],
  ['Gemini CLI', 'Google 的 AI 命令行工具'],
  ['OpenCode', '开源 AI 编程终端工具'],
  ['OpenClaw', '开源 AI 编程助手（多供应商网关）'],
  ['Hermes', 'Hermes Agent，支持供应商、MCP、Skills 和 Memory 管理'],
];

const appRowsEn = [
  ['Claude Code', "Anthropic's official AI coding assistant"],
  [
    'Claude Desktop',
    'Claude desktop app with official login and third-party profiles',
  ],
  ['Codex', "OpenAI's code generation tool"],
  ['Gemini CLI', "Google's AI command-line tool"],
  ['OpenCode', 'Open-source AI coding terminal'],
  ['OpenClaw', 'Open-source AI coding assistant with a multi-provider gateway'],
  ['Hermes', 'Hermes Agent with provider, MCP, Skills, and Memory management'],
];

function getSectionFromUrl() {
  if (typeof window === 'undefined') return 'getting-started';
  return (
    new URLSearchParams(window.location.search).get('section') ||
    'getting-started'
  );
}

export function CCSwitchDocs({ language = 'zh' }: { language?: Language }) {
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mobileDocsOpen, setMobileDocsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(getSectionFromUrl);
  const [activeAnchor, setActiveAnchor] = useState('intro');

  const isEn = language === 'en';
  const sectionItems = isEn ? sectionsEn : sections;
  const tocItems = isEn ? tocEn : toc;
  const applicationRows = isEn ? appRowsEn : appRows;
  const homeHref = isEn ? '/en' : '/zh/';
  const docsHref = isEn ? '/en/docs' : '/zh/docs';

  const activeGroup = useMemo(
    () =>
      sectionItems.find((section) => section.id === activeSection) ||
      sectionItems[0],
    [activeSection, sectionItems]
  );

  useEffect(() => {
    const onPopState = () => setActiveSection(getSectionFromUrl());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const selectSection = (id: string) => {
    setActiveSection(id);
    setMobileDocsOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.set('section', id);
    window.history.pushState({}, '', url);
  };

  const selectAnchor = (id: string) => {
    setActiveAnchor(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={`cc-doc-page${dark ? 'cc-doc-dark' : ''}`}>
      <header className="cc-doc-nav">
        <a href={homeHref} className="cc-doc-brand">
          <img src="/ccswitch/logo.png" alt="CC Switch" />
          <b>CC Switch</b>
        </a>
        <nav
          className={`cc-doc-main-nav${menu ? 'is-open' : ''}`}
          id="cc-doc-mobile-navigation"
        >
          <a href={homeHref}>{isEn ? 'Home' : '首页'}</a>
          <a className="is-active" href={docsHref}>
            {isEn ? 'Docs' : '文档'}
          </a>
          <a href={docsHref}>{isEn ? 'Tutorials' : '攻略'}</a>
          <a href={`${GITHUB_URL}/releases`} target="_blank" rel="noreferrer">
            {isEn ? 'Changelog' : '更新日志'}
          </a>
          <a href={isEn ? '/en#sponsors' : '/zh/sponsors'}>
            {isEn ? 'Sponsors' : '赞助商'}
          </a>
          <a
            href="https://pan.quark.cn/s/969ec8720b79"
            target="_blank"
            rel="noreferrer"
          >
            {isEn ? 'Download Free' : '免费下载'}
          </a>
        </nav>
        <div className="cc-doc-nav-actions">
          <button
            type="button"
            aria-label={isEn ? 'Switch to Chinese' : '切换到英文'}
            onClick={() =>
              window.location.assign(isEn ? '/zh/docs' : '/en/docs')
            }
          >
            <Globe size={17} />
            <span>{isEn ? '🇺🇸' : '🇨🇳'}</span>
          </button>
          <button
            type="button"
            aria-label={isEn ? 'Toggle theme' : '切换主题'}
            onClick={() => setDark((value) => !value)}
          >
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
            type="button"
            className="cc-doc-menu"
            aria-label={isEn ? 'Open menu' : '打开菜单'}
            aria-expanded={menu}
            aria-controls="cc-doc-mobile-navigation"
            onClick={() => setMenu((value) => !value)}
          >
            {menu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <div className="cc-doc-layout">
        <aside
          className={`cc-doc-sidebar${mobileDocsOpen ? 'is-open' : ''}`}
          aria-label={isEn ? 'Documentation navigation' : '文档导航'}
        >
          <button
            type="button"
            className="cc-doc-search"
            aria-label={isEn ? 'Search documentation' : '搜索文档'}
          >
            <Search size={17} />
            <span>{isEn ? 'Search docs...' : '搜索文档...'}</span>
            <kbd>⌘ K</kbd>
          </button>
          <nav>
            {sectionItems.map((section) => {
              const Icon = section.icon;
              const isCurrent = activeGroup.id === section.id;
              return (
                <div className="cc-doc-nav-group" key={section.id}>
                  <button
                    type="button"
                    className={[
                      'cc-doc-group-button',
                      isCurrent && 'is-current',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => selectSection(section.id)}
                  >
                    <Icon size={16} />
                    <span>{section.title}</span>
                    <ChevronDown
                      size={16}
                      className={isCurrent ? 'is-expanded' : ''}
                    />
                  </button>
                  {isCurrent && section.children ? (
                    <div className="cc-doc-subnav">
                      {section.children.map((child, index) => (
                        <button
                          type="button"
                          key={child.id}
                          className={index === 0 ? 'is-active' : ''}
                          onClick={() => index === 0 && selectAnchor('intro')}
                        >
                          {child.title}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="cc-doc-content">
          <button
            type="button"
            className="cc-doc-mobile-trigger"
            onClick={() => setMobileDocsOpen((value) => !value)}
            aria-expanded={mobileDocsOpen}
          >
            <Menu size={18} />{' '}
            {mobileDocsOpen
              ? isEn
                ? 'Close navigation'
                : '收起导航'
              : isEn
                ? 'Open navigation'
                : '打开导航'}
          </button>
          <article>
            <h1 id="intro">{isEn ? '1.1 Introduction' : '1.1 软件介绍'}</h1>
            <hr />
            <h2 id="what-is">
              {isEn ? 'What is CC Switch' : '什么是 CC Switch'}
            </h2>
            <p>
              {isEn
                ? 'CC Switch is a cross-platform desktop application designed for developers who use AI coding tools. It helps you centrally manage configurations for '
                : 'CC Switch 是一款跨平台桌面应用，专为使用 AI 编程工具的开发者设计。它帮助你统一管理 '}
              <strong>Claude Code</strong>
              {isEn ? ', ' : '、'}
              <strong>Claude Desktop</strong>
              {isEn ? ', ' : '、'}
              <strong>Codex</strong>
              {isEn ? ', ' : '、'}
              <strong>Gemini CLI</strong>
              {isEn ? ', ' : '、'}
              <strong>OpenCode</strong>
              {isEn ? ', ' : '、'}
              <strong>OpenClaw</strong>
              {isEn ? ', and ' : ' 和 '}
              <strong>Hermes</strong>
              {isEn ? '.' : ' 等受管应用的配置。'}
            </p>

            <h2 id="problems">
              {isEn ? 'What Problems Does It Solve' : '解决什么问题'}
            </h2>
            <p>
              {isEn
                ? 'In your daily development workflow, you may encounter these pain points:'
                : '在日常开发中，你可能会遇到这些痛点：'}
            </p>
            <ul>
              <li>
                <strong>
                  {isEn
                    ? 'Tedious multi-provider switching'
                    : '多供应商切换麻烦'}
                </strong>
                {isEn
                  ? ': Using different API providers (official, proxy services) requires manually editing configuration files'
                  : '：使用不同的 API 供应商（官方、中转服务商），需要手动修改配置文件'}
              </li>
              <li>
                <strong>
                  {isEn ? 'Scattered configurations' : '配置分散难管理'}
                </strong>
                {isEn
                  ? ': Claude Code, Claude Desktop, Codex, Gemini, OpenCode, OpenClaw, and Hermes each have independent configuration files in different formats'
                  : '：Claude Code、Claude Desktop、Codex、Gemini、OpenCode、OpenClaw、Hermes 各有独立的配置文件，格式不同'}
              </li>
              <li>
                <strong>{isEn ? 'No usage monitoring' : '无法监控用量'}</strong>
                {isEn
                  ? ': No visibility into how many API calls were made or how much they cost'
                  : '：不知道 API 调用了多少次，花了多少钱'}
              </li>
              <li>
                <strong>{isEn ? 'Service instability' : '服务不稳定'}</strong>
                {isEn
                  ? ': When a single provider goes down, your entire workflow is interrupted'
                  : '：单一供应商出问题时，整个工作流中断'}
              </li>
            </ul>
            <p>
              {isEn
                ? 'CC Switch solves these problems through a unified interface.'
                : 'CC Switch 通过统一的界面解决这些问题。'}
            </p>

            <h2 id="features">{isEn ? 'Core Features' : '核心功能'}</h2>
            <h3 id="providers-content">
              {isEn ? 'Provider Management' : '供应商管理'}
            </h3>
            <ul>
              <li>
                {isEn
                  ? 'One-click switching between multiple API provider configurations'
                  : '一键切换多个 API 供应商配置'}
              </li>
              <li>
                {isEn
                  ? 'Preset templates for quickly adding common providers'
                  : '支持预设模板，快速添加常用供应商'}
              </li>
              <li>
                {isEn
                  ? 'Universal provider feature for sharing configurations across apps'
                  : '统一供应商功能，跨应用共享配置'}
              </li>
              <li>
                {isEn
                  ? 'Claude Desktop third-party providers, direct mode, and model mapping'
                  : 'Claude Desktop 第三方供应商、直连模式与模型映射'}
              </li>
              <li>
                {isEn
                  ? 'Usage query and balance display'
                  : '用量查询与余额显示'}
              </li>
              <li>{isEn ? 'Endpoint speed testing' : '端点速度测试'}</li>
            </ul>
            <h3 id="extensions-content">{isEn ? 'Extensions' : '扩展功能'}</h3>
            <ul>
              <li>
                <strong>{isEn ? 'MCP Servers' : 'MCP 服务器'}</strong>
                {isEn
                  ? ': manage Model Context Protocol servers to extend AI capabilities.'
                  : '：管理 Model Context Protocol 服务器，扩展 AI 能力'}
              </li>
              <li>
                <strong>Prompts</strong>
                {isEn
                  ? ': manage system prompt presets for different workflows.'
                  : '：管理系统提示词预设，快速切换不同场景'}
              </li>
              <li>
                <strong>Skills</strong>
                {isEn
                  ? ': install and manage skill extensions.'
                  : '：安装和管理技能扩展'}
              </li>
            </ul>
            <h3 id="routing-content">
              {isEn ? 'Proxy & High Availability' : '代理与高可用'}
            </h3>
            <ul>
              <li>
                {isEn
                  ? 'Local proxy service with request logs and usage analytics'
                  : '本地代理服务，记录请求日志和用量统计'}
              </li>
              <li>
                {isEn
                  ? 'Automatic failover to backup providers'
                  : '自动故障转移，主供应商失败时自动切换备用'}
              </li>
              <li>
                {isEn
                  ? 'Circuit breakers that prevent repeated requests to unhealthy providers'
                  : '熔断器机制，防止频繁重试失败的供应商'}
              </li>
              <li>
                {isEn
                  ? 'Detailed token tracking and cost estimates'
                  : '详细的 Token 用量追踪与成本估算'}
              </li>
            </ul>

            <h2 id="apps">{isEn ? 'Supported Applications' : '支持的应用'}</h2>
            <table>
              <thead>
                <tr>
                  <th>{isEn ? 'Application' : '应用'}</th>
                  <th>{isEn ? 'Description' : '说明'}</th>
                </tr>
              </thead>
              <tbody>
                {applicationRows.map(([name, description]) => (
                  <tr key={name}>
                    <td>
                      <strong>{name}</strong>
                    </td>
                    <td>{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 id="platforms">
              {isEn ? 'Supported Platforms' : '支持的平台'}
            </h2>
            <ul>
              <li>
                <strong>Windows</strong> {isEn ? '10 or later' : '10 及以上'}
              </li>
              <li>
                <strong>macOS</strong>{' '}
                {isEn ? '12 (Monterey) or later' : '12 (Monterey) 及以上'}
              </li>
              <li>
                <strong>Linux</strong> Ubuntu 22.04+ / Debian 11+ / Fedora 34+{' '}
                {isEn ? '(x64 / ARM64)' : '（x64 / ARM64）'}
              </li>
            </ul>

            <h2 id="architecture">
              {isEn ? 'Technical Architecture' : '技术架构'}
            </h2>
            <p>
              {isEn
                ? 'CC Switch is built with a modern technology stack:'
                : 'CC Switch 使用现代化的技术栈构建：'}
            </p>
            <ul>
              <li>
                <strong>{isEn ? 'Frontend' : '前端'}</strong>
                {isEn ? ': ' : '：'}React 18 + TypeScript + Tailwind CSS
              </li>
              <li>
                <strong>{isEn ? 'Backend' : '后端'}</strong>
                {isEn ? ': ' : '：'}Tauri 2 + Rust
              </li>
              <li>
                <strong>{isEn ? 'Data storage' : '数据存储'}</strong>
                {isEn
                  ? ': SQLite (providers, MCP, Prompts) + JSON (device settings)'
                  : '：SQLite（供应商、MCP、Prompts）+ JSON（设备设置）'}
              </li>
            </ul>
            <p>{isEn ? 'This architecture provides:' : '这种架构确保了：'}</p>
            <ul>
              <li>
                {isEn
                  ? 'A consistent cross-platform experience'
                  : '跨平台一致的体验'}
              </li>
              <li>{isEn ? 'Native-level performance' : '原生级别的性能'}</li>
              <li>
                {isEn ? 'Secure local data storage' : '安全的本地数据存储'}
              </li>
            </ul>
          </article>
          <div className="cc-doc-article-footer">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              {isEn ? 'Edit this page' : '编辑此页面'}
            </a>
            <span>
              {isEn ? 'Last updated: May 16, 2026' : '最后更新：2026-05-16'}
            </span>
            <button type="button" onClick={() => selectAnchor('what-is')}>
              <span>{isEn ? 'Next' : '下一页'}</span>
              <b>{isEn ? 'Introduction' : '软件介绍'}</b>
              <ArrowRight size={16} />
            </button>
          </div>
        </main>

        <aside
          className="cc-doc-toc"
          aria-label={isEn ? 'On this page' : '本页内容'}
        >
          <h4>{isEn ? 'On this page' : '本页内容'}</h4>
          <ol>
            {tocItems.map(([id, label]) => (
              <li key={id}>
                <button
                  type="button"
                  className={activeAnchor === id ? 'is-active' : ''}
                  onClick={() => selectAnchor(id)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <footer className="cc-doc-footer">
        <div className="cc-doc-footer-grid">
          <div className="cc-doc-footer-brand">
            <a href={homeHref} className="cc-doc-brand">
              <img src="/ccswitch/logo.png" alt="CC Switch" />
              <b>CC Switch</b>
            </a>
            <p>
              {isEn
                ? 'One place to manage your AI coding workflow'
                : '统一管理你的 AI 编程工具工作流'}
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Github size={19} />
            </a>
          </div>
          <div>
            <h4>{isEn ? 'Product' : '产品'}</h4>
            <a href={`${homeHref}#features`}>{isEn ? 'Features' : '功能'}</a>
            <a href={`${homeHref}#download`}>{isEn ? 'Download' : '下载'}</a>
          </div>
          <div>
            <h4>{isEn ? 'Resources' : '资源'}</h4>
            <a href={docsHref}>{isEn ? 'Docs' : '文档'}</a>
            <a href={docsHref}>{isEn ? 'Tutorials' : '攻略'}</a>
            <a href={`${GITHUB_URL}/releases`} target="_blank" rel="noreferrer">
              {isEn ? 'Changelog' : '更新日志'}
            </a>
          </div>
          <div>
            <h4>{isEn ? 'Community' : '社区'}</h4>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a
              href={`${GITHUB_URL}#contributing`}
              target="_blank"
              rel="noreferrer"
            >
              {isEn ? 'Contributing' : '贡献指南'}
            </a>
            <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noreferrer">
              {isEn ? 'Report an Issue' : '问题反馈'}
            </a>
            <a href={isEn ? `${homeHref}#sponsors` : '/zh/sponsors'}>
              {isEn ? 'Sponsors' : '赞助商'}
            </a>
          </div>
        </div>
        <div className="cc-doc-footer-bottom">
          <span>
            {isEn
              ? '© 2025 CC Switch. Open source under the MIT License.'
              : '© 2025 CC Switch. 基于 MIT 协议开源。'}
          </span>
          <span>Made with ❤️ by CC Switch Team</span>
        </div>
      </footer>
    </div>
  );
}
