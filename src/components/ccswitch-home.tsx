import { useState } from 'react';
import {
  ArrowDownToLine,
  ArrowRight,
  Bug,
  ChevronDown,
  Clock3,
  Download,
  Github,
  Globe,
  Layers3,
  Menu,
  Moon,
  Network,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Square,
  Star,
  Sun,
  Trophy,
  X,
  Zap,
} from 'lucide-react';

import '@/styles/ccswitch-home.css';

const GITHUB_URL = 'https://github.com/xianyu110/cc-switch';
const DOWNLOAD_URL = 'https://pan.quark.cn/s/969ec8720b79';

type Language = 'zh' | 'en';

const homeCopy = {
  zh: {
    nav: ['首页', '文档', '攻略', '更新日志', '赞助商', '免费下载'],
    release: '🎉 v... 正式发布',
    tagline: '统一管理你的 AI 编程工具工作流',
    freeDownload: '免费下载',
    viewDocs: '查看文档',
    supported: '支持 macOS 12+ · Windows 10+ · Linux',
    sponsorTitle: '感谢赞助商的支持',
    sponsorText: '如果您需要稳定、高性价比的 API 中转服务，',
    sponsorText2: '欢迎了解一下 MomoAPI。',
    visitMomo: '访问 MomoAPI',
    whyTitle: '为什么选择 CC Switch?',
    whyText: '一个应用管理供应商、路由、用量、会话和技能',
    downloads: '下载',
    supportedApps: '支持应用',
    workflowTitle: '直观的操作界面',
    workflowText: '七应用切换、工具栏和本地路由状态一眼可见',
    workflowTabs: ['Provider 管理', '本地路由', '使用统计'],
    developerTitle: '开发者友好',
    developerText: '零配置，开箱即用',
    devCards: [
      [
        '无需修改代码',
        '开启本地路由即可获得格式转换、热切换、故障转移、请求日志和用量统计。',
      ],
      [
        'Rust 后端 + React 前端',
        '基于 Tauri 2.x 构建，结合 Rust 的性能和 React 的灵活性。',
      ],
      [
        '智能用量追踪',
        '实时监控 Token、缓存、订阅额度和费用，按应用与 Provider 分类统计分析。',
      ],
    ],
    quotesTitle: '用户怎么说',
    quotesText: '来自开发者社区的反馈',
    faqTitle: '常见问题',
    faqText: '有疑问？我们来解答',
    downloadTitle: '准备好体验更高效的',
    downloadTitle2: 'AI 工作流了吗?',
    downloadText: '下载 CC Switch，开启统一管理 AI 编程工具工作流的新方式',
    downloadNow: '立即下载',
    viewGithub: '查看 GitHub',
    footerGroups: ['产品', '资源', '社区'],
    footerLinks: [
      '功能',
      '下载',
      '文档',
      '攻略',
      '更新日志',
      'GitHub / 开源地址',
      '贡献指南',
      '问题反馈',
      '赞助商',
    ],
    copyright: '© 2025 CC Switch. 基于 MIT 协议开源。',
  },
  en: {
    nav: [
      'Home',
      'Docs',
      'Tutorials',
      'Changelog',
      'Sponsors',
      'Download Free',
    ],
    release: '🎉 v... Released',
    tagline: 'Unified Management for Your AI Coding Tool Workflow',
    freeDownload: 'Download Free',
    viewDocs: 'View Docs',
    supported: 'macOS 12+ · Windows 10+ · Linux',
    sponsorTitle: 'Supported by MomoAPI',
    sponsorText: 'Looking for a stable, value-priced API relay?',
    sponsorText2: 'Take a look at MomoAPI, the sponsor backing CC Switch.',
    visitMomo: 'Visit MomoAPI',
    whyTitle: 'Why Choose CC Switch?',
    whyText:
      'Manage providers, routing, usage, sessions, and skills in one app',
    downloads: 'Downloads',
    supportedApps: 'Supported Apps',
    workflowTitle: 'An Interface That Makes Sense',
    workflowText:
      'Switch between seven apps and see routing status at a glance',
    workflowTabs: ['Provider Management', 'Local Routing', 'Usage Analytics'],
    developerTitle: 'Developer Friendly',
    developerText: 'Zero configuration. Ready out of the box.',
    devCards: [
      [
        'No Code Changes',
        'Enable local routing for format conversion, hot switching, failover, request logs, and usage analytics.',
      ],
      [
        'Rust Backend + React Frontend',
        'Built with Tauri 2.x, combining native Rust performance with React flexibility.',
      ],
      [
        'Smart Usage Tracking',
        'Monitor tokens, cache, subscription quotas, and costs by app and provider in real time.',
      ],
    ],
    quotesTitle: 'What Developers Say',
    quotesText: 'Feedback from the developer community',
    faqTitle: 'Frequently Asked Questions',
    faqText: 'Answers to common questions about CC Switch',
    downloadTitle: 'Ready for a More Efficient',
    downloadTitle2: 'AI Workflow?',
    downloadText:
      'Download CC Switch and manage your AI coding workflow from one place.',
    downloadNow: 'Download Now',
    viewGithub: 'View on GitHub',
    footerGroups: ['Product', 'Resources', 'Community'],
    footerLinks: [
      'Features',
      'Download',
      'Docs',
      'Tutorials',
      'Changelog',
      'GitHub / Open Source',
      'Contributing',
      'Report an Issue',
      'Sponsors',
    ],
    copyright: '© 2025 CC Switch. Open source under the MIT License.',
  },
} as const;

const providers = [
  {
    name: 'MomoAI',
    url: 'https://momoai.asia',
    usage: '已使用: 672 剩余: 66 USD',
    color: '#4f87c9',
    updated: '10 分钟前',
    icon: '/ccswitch/logo.png',
  },
  {
    name: 'MiniMax',
    url: 'https://platform.minimaxi.com',
    usage: '5h: 43%   2h40m   7d: 12%   6d',
    color: '#ed6987',
    updated: '2 分钟前',
  },
  {
    name: 'Anthropic',
    url: 'https://www.anthropic.com/claude-code',
    usage: '5h: 36%   2h10m   7d: 64%   3d8h',
    color: '#e48b43',
    updated: '1 分钟前',
  },
];

const providersEn = providers.map((provider, index) => ({
  ...provider,
  usage: index === 0 ? 'Used: 672 · Remaining: 66 USD' : provider.usage,
  updated: ['10 minutes ago', '2 minutes ago', '1 minute ago'][index],
}));

const appTools = [
  ['Claude Code', Sparkles, '#d97757'],
  ['Claude Desktop', Sparkles, '#d97757'],
  ['Codex', Layers3, '#252525'],
  ['Gemini', Sparkles, '#3186ff'],
  ['OpenCode', Square, '#262626'],
  ['OpenClaw', Bug, '#dc3636'],
  ['Hermes', Trophy, '#282828'],
] as const;

const features = [
  [
    '统一管理七大应用',
    '一个界面管理 Claude Code、Claude Desktop、Codex、Gemini CLI、OpenCode、OpenClaw 和 Hermes Agent 的供应商配置。',
    Sparkles,
  ],
  [
    '自动故障转移',
    '本地路由内置熔断器、健康监控和故障转移队列，主 Provider 异常时自动切换到备用 Provider。',
    Zap,
  ],
  [
    '用量与额度可见',
    '实时追踪请求、Token、缓存命中、成本和订阅额度，支持日期范围筛选与自定义模型价格。',
    Clock3,
  ],
  [
    '安全本地存储',
    '所有 API Key 和配置信息都存储在本地 SQLite 数据库，支持完整的 Schema 迁移。',
    ShieldCheck,
  ],
  [
    'MCP / Skills / 会话',
    '统一管理 MCP、Skills、Prompts、Hermes Memory 和跨应用会话恢复，无需手动编辑配置文件。',
    Network,
  ],
  [
    '开源免费',
    '基于 MIT 协议开源，完全免费使用。社区驱动开发，欢迎贡献代码和反馈。',
    Github,
  ],
];

const featuresEn = [
  [
    'Manage Seven Apps',
    'Manage provider configurations for Claude Code, Claude Desktop, Codex, Gemini CLI, OpenCode, OpenClaw, and Hermes Agent in one interface.',
    Sparkles,
  ],
  [
    'Automatic Failover',
    'Local routing includes circuit breakers, health checks, and failover queues that switch providers automatically.',
    Zap,
  ],
  [
    'Visible Usage and Quotas',
    'Track requests, tokens, cache hits, costs, and subscription quotas with custom model pricing.',
    Clock3,
  ],
  [
    'Secure Local Storage',
    'API keys and configuration data stay in your local SQLite database with full schema migration support.',
    ShieldCheck,
  ],
  [
    'MCP / Skills / Sessions',
    'Manage MCP servers, Skills, Prompts, Hermes Memory, and cross-app session recovery without editing config files.',
    Network,
  ],
  [
    'Free and Open Source',
    'Released under the MIT License and free to use. Community contributions and feedback are welcome.',
    Github,
  ],
];

const faqs = [
  [
    'CC Switch 是免费的吗？',
    '是的，CC Switch 完全免费且开源。基于 MIT 协议发布，您可以自由使用、修改和分发。',
  ],
  [
    '支持哪些 AI 编程工具？',
    '目前支持 Claude Code、Claude Desktop、Codex、Gemini CLI、OpenCode、OpenClaw 和 Hermes Agent。',
  ],
  [
    '我的 API Key 安全吗？',
    '所有 API Key 和配置信息都存储在您本地的 SQLite 数据库中，不会上传到任何服务器。',
  ],
  [
    '本地路由服务会影响请求速度吗？',
    '影响微乎其微。本地路由服务基于 Rust 构建，提供格式转换、请求日志、健康监控和故障转移。',
  ],
  [
    '如何参与贡献？',
    '欢迎通过 GitHub 提交 Issue 和 Pull Request，项目基于 MIT 协议开源。',
  ],
  [
    '遇到问题如何获取帮助？',
    '您可以通过 GitHub Issues 反馈问题，或加入社区与其他用户交流。',
  ],
];

const faqsEn = [
  [
    'Is CC Switch free?',
    'Yes. CC Switch is completely free and open source under the MIT License.',
  ],
  [
    'Which AI coding tools are supported?',
    'CC Switch supports Claude Code, Claude Desktop, Codex, Gemini CLI, OpenCode, OpenClaw, and Hermes Agent.',
  ],
  [
    'Are my API keys secure?',
    'All API keys and configuration data are stored locally in SQLite and are never uploaded to a server.',
  ],
  [
    'Does local routing slow down requests?',
    'The overhead is minimal. The Rust-based routing service handles conversion, logging, health checks, and failover efficiently.',
  ],
  [
    'How can I contribute?',
    'Open an issue or pull request on GitHub. Contributions are welcome.',
  ],
  [
    'Where can I get help?',
    'Use GitHub Issues to report a problem or discuss it with the community.',
  ],
];

const testimonials = [
  {
    quote:
      '配置切换神器！UI颜值超高，界面清爽无冗余，一键切换配置特别方便，是我用过最顺手的工具，强烈推荐！',
    name: '蛮吉',
    role: 'Vibe Coding 爱好者',
  },
  {
    quote:
      'CC Switch 彻底改变了我的 AI 开发工作流。多 Provider 故障转移功能让我再也不用担心 API 限流问题，成本追踪功能帮我节省了 30% 的开支。',
    name: '愚者',
    role: '前字节跳动开发工程师',
  },
  {
    quote:
      '作为一个重度使用 Claude Code 的开发者，CC Switch 的 MCP 配置管理功能太好用了。可视化界面让复杂的配置变得简单直观。',
    name: '军师',
    role: '独立开发者',
  },
  {
    quote:
      '开源免费还这么强大，感谢作者的无私奉献！本地路由功能稳定可靠，团队里每个人都在用。',
    name: '荀彧',
    role: 'AI 产品经理',
  },
  {
    quote:
      '多 Provider 自动切换功能非常实用，API 出问题时完全无感知，保证了开发流程的连续性。',
    name: '苟或',
    role: '技术负责人',
  },
  {
    quote:
      '终于不用手动编辑 JSON 配置文件了！Skills 和 Prompts 的可视化管理让效率提升了好几倍，强烈推荐给所有 AI 开发者。',
    name: '菌丝',
    role: '后端开发工程师',
  },
  {
    quote:
      '成本追踪功能太赞了，能清晰看到每个 Provider 的使用情况和费用，帮助我们合理分配预算。',
    name: '白夜',
    role: '运维工程师',
  },
  {
    quote:
      '统一管理这些 AI 编程工具真的太方便了，一个界面搞定所有配置。省去了在不同配置文件之间来回切换的麻烦。',
    name: '念佝',
    role: '前端开发工程师',
  },
  {
    quote:
      '界面设计简洁优雅，交互体验流畅。作为前端架构师，我对 UI/UX 要求很高，CC Switch 完全满足了我的期望。',
    name: 'Mashiro',
    role: '小农科技有限公司 前端架构师',
  },
  {
    quote:
      '平时做实验要在不同 Provider 间反复切换做对比，CC Switch 让这件事变得无比顺滑，配置预设还能在课题组内共享，效率直接拉满。',
    name: '兰大首席格调',
    role: '兰州大学 博士生',
  },
];

const testimonialsEn = [
  {
    quote:
      'The clean UI and one-click provider switching make this the easiest configuration tool I have used.',
    name: 'Manji',
    role: 'Vibe Coding Enthusiast',
  },
  {
    quote:
      'Provider failover keeps my workflow running, while cost tracking has noticeably reduced our API spend.',
    name: 'Yuzhe',
    role: 'Former ByteDance Engineer',
  },
  {
    quote:
      'Visual MCP management turns a complicated configuration process into something straightforward.',
    name: 'Junshi',
    role: 'Independent Developer',
  },
  {
    quote:
      'It is impressive to see a free open-source tool with such reliable local routing.',
    name: 'Xunyu',
    role: 'AI Product Manager',
  },
  {
    quote:
      'Automatic provider switching is seamless when an API endpoint becomes unavailable.',
    name: 'Gouhuo',
    role: 'Technical Lead',
  },
  {
    quote:
      'I no longer edit JSON files by hand. Visual management for Skills and Prompts saves a huge amount of time.',
    name: 'Junsi',
    role: 'Backend Engineer',
  },
];

function AppWindow({ language = 'zh' }: { language?: Language }) {
  const [active, setActive] = useState(0);
  const isEn = language === 'en';
  const providerItems = isEn ? providersEn : providers;
  return (
    <div
      className="cc-window"
      aria-label={
        isEn
          ? 'CC Switch provider management preview'
          : 'CC Switch Provider 管理界面预览'
      }
    >
      <div className="cc-window-bar">
        <i />
        <i />
        <i />
      </div>
      <div className="cc-window-head">
        <b>CC Switch</b>
        <button
          className="cc-window-icon"
          aria-label={isEn ? 'Settings' : '设置'}
        >
          ⚙
        </button>
        <button
          className="cc-toggle"
          aria-label={isEn ? 'Local routing toggle' : '本地路由开关'}
        >
          <span />
        </button>
        <div className="cc-tools">
          {appTools.map(([label, Icon, color], index) => (
            <button
              key={label}
              className={`cc-tool ${index === 0 ? 'is-active' : ''}`}
              aria-label={label}
              style={{ color }}
            >
              <Icon size={16} strokeWidth={2.2} />
            </button>
          ))}
          <span className="cc-tool-divider" />
          <button
            className="cc-tool"
            aria-label={isEn ? 'Manage Skills' : 'Skills 管理'}
          >
            <SlidersHorizontal size={15} />
          </button>
          <button
            className="cc-tool"
            aria-label={isEn ? 'Manage Prompts' : '提示词管理'}
          >
            <Search size={15} />
          </button>
          <button
            className="cc-tool"
            aria-label={isEn ? 'Manage Sessions' : '会话管理'}
          >
            <Clock3 size={15} />
          </button>
          <button
            className="cc-tool"
            aria-label={isEn ? 'Manage MCP' : 'MCP 管理'}
          >
            <Network size={15} />
          </button>
          <button
            className="cc-add-tool"
            aria-label={isEn ? 'Add provider' : '添加供应商'}
          >
            ＋
          </button>
        </div>
      </div>
      <div className="cc-provider-list">
        {providerItems.map(
          ({ name, url, usage, color, updated, icon }, index) => (
            <button
              key={name}
              className={`cc-provider ${active === index ? 'is-active' : ''}`}
              onClick={() => setActive(index)}
            >
              <span className="cc-drag">⁝⁝</span>
              <span className="cc-provider-icon" style={{ color }}>
                {icon ? <img src={icon} alt="" /> : name.slice(0, 1)}
              </span>
              <span className="cc-provider-body">
                <b>{name}</b>
                <a href={url} onClick={(event) => event.stopPropagation()}>
                  {url}
                </a>
              </span>
              <span className="cc-provider-usage">
                <small>◷ {updated}</small>
                <span>{usage}</span>
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
}

export function CCSwitchHome({ language = 'zh' }: { language?: Language }) {
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const isEn = language === 'en';
  const copy = homeCopy[language];
  const featureItems = isEn ? featuresEn : features;
  const faqItems = isEn ? faqsEn : faqs;
  const testimonialItems = isEn ? testimonialsEn : testimonials;
  const homeHref = isEn ? '/en' : '/zh/';
  const docsHref = isEn ? '/en/docs' : '/zh/docs';
  const navHrefs = isEn
    ? [
        '/en',
        '/en/docs',
        '/en/docs',
        `${GITHUB_URL}/releases`,
        '/en#sponsors',
        '#download',
      ]
    : [
        '#top',
        '/zh/docs',
        '/zh/tutorials',
        '/zh/changelog',
        '/zh/sponsors',
        '/zh/download',
      ];
  return (
    <div
      className={['cc-page', isEn && 'cc-page-en', dark && 'cc-dark']
        .filter(Boolean)
        .join(' ')}
    >
      <header className="cc-nav">
        <a href={homeHref} className="cc-brand">
          <img src="/ccswitch/logo.png" alt="CC Switch" />
          <b>CC Switch</b>
        </a>
        <nav id="cc-mobile-navigation" className={menu ? 'is-open' : ''}>
          {copy.nav.map((label, index) => (
            <a href={navHrefs[index]} key={label}>
              {label}
            </a>
          ))}
        </nav>
        <div className="cc-nav-actions">
          <button
            aria-label={isEn ? 'Switch to Chinese' : '切换到英文'}
            onClick={() => window.location.assign(isEn ? '/zh/' : '/en')}
          >
            <Globe size={17} />
            <span>{isEn ? '🇺🇸' : '🇨🇳'}</span>
          </button>
          <button
            aria-label={isEn ? 'Toggle theme' : '切换主题'}
            onClick={() => setDark(!dark)}
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
            className="cc-menu"
            aria-label={isEn ? 'Open menu' : '打开菜单'}
            aria-expanded={menu}
            aria-controls="cc-mobile-navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>
      <main id="top">
        <section className="cc-hero cc-section">
          <div className="cc-hero-copy">
            <span className="cc-release">{copy.release}</span>
            <div className="cc-hero-title">
              <img src="/ccswitch/logo.png" alt="" />
              <h1>CC Switch</h1>
            </div>
            <p className="cc-tagline">{copy.tagline}</p>
            <div className="cc-actions">
              <a className="cc-btn cc-btn-primary" href="#download">
                <ArrowDownToLine size={18} /> {copy.freeDownload}
              </a>
              <a className="cc-btn cc-btn-ghost" href={docsHref}>
                {copy.viewDocs} <ArrowRight size={17} />
              </a>
            </div>
            <small>{copy.supported}</small>
          </div>
          <AppWindow language={language} />
        </section>
        <section id="sponsors" className="cc-sponsors cc-section">
          <div>
            <h2>{copy.sponsorTitle}</h2>
            <p>
              {copy.sponsorText} <br className="cc-desktop-break" />
              {copy.sponsorText2}
            </p>
          </div>
          <a href="https://momoai.asia" target="_blank" rel="noreferrer">
            {copy.visitMomo} <ArrowRight size={16} />
          </a>
        </section>
        <section id="features" className="cc-section cc-features">
          <div className="cc-heading">
            <h2>{copy.whyTitle}</h2>
            <p>{copy.whyText}</p>
          </div>
          <div className="cc-stat-row">
            <div>
              <Star size={20} />
              <strong>129.1k</strong>
              <span>Stars</span>
            </div>
            <div>
              <Download size={20} />
              <strong>16.6M</strong>
              <span>{copy.downloads}</span>
            </div>
            <div>
              <Layers3 size={20} />
              <strong>7</strong>
              <span>{copy.supportedApps}</span>
            </div>
            <div className="cc-rust-badge">
              <Trophy size={16} /> Rust #1
            </div>
          </div>
          <div className="cc-feature-grid">
            {featureItems.map(([title, text, Icon]) => (
              <article key={title as string}>
                <Icon size={22} />
                <h3>{title as string}</h3>
                <p>{text as string}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="workflow" className="cc-section cc-workflow">
          <div className="cc-heading">
            <h2>{copy.workflowTitle}</h2>
            <p>{copy.workflowText}</p>
          </div>
          <div className="cc-workflow-grid">
            <div className="cc-workflow-tabs" role="tablist">
              <button className="is-active" role="tab" aria-selected="true">
                {copy.workflowTabs[0]}
              </button>
              <button role="tab" aria-selected="false">
                {copy.workflowTabs[1]}
              </button>
              <button role="tab" aria-selected="false">
                {copy.workflowTabs[2]}
              </button>
            </div>
            <AppWindow language={language} />
          </div>
        </section>
        <section className="cc-section cc-developer">
          <div className="cc-heading">
            <h2>{copy.developerTitle}</h2>
            <p>{copy.developerText}</p>
          </div>
          <div className="cc-dev-grid">
            <article>
              <SlidersHorizontal />
              <h3>{copy.devCards[0][0]}</h3>
              <p>{copy.devCards[0][1]}</p>
              <code>~/.claude/settings.json</code>
            </article>
            <article>
              <ShieldCheck />
              <h3>{copy.devCards[1][0]}</h3>
              <p>{copy.devCards[1][1]}</p>
              <code>SQLite · Rust · React</code>
            </article>
            <article>
              <Zap />
              <h3>{copy.devCards[2][0]}</h3>
              <p>{copy.devCards[2][1]}</p>
              <code>tokens / cache / cost</code>
            </article>
          </div>
        </section>
        <section className="cc-section cc-quotes">
          <div className="cc-heading">
            <h2>{copy.quotesTitle}</h2>
            <p>{copy.quotesText}</p>
          </div>
          <div className="cc-quote-marquee" aria-label={copy.quotesTitle}>
            <div className="cc-quote-track">
              {testimonialItems.map((item) => (
                <blockquote key={`${item.name}-a`}>
                  <p>“{item.quote}”</p>
                  <cite>
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </cite>
                </blockquote>
              ))}
            </div>
            <div className="cc-quote-track cc-quote-track-reverse">
              {testimonialItems
                .slice()
                .reverse()
                .map((item) => (
                  <blockquote key={`${item.name}-b`}>
                    <p>“{item.quote}”</p>
                    <cite>
                      <strong>{item.name}</strong>
                      <span>{item.role}</span>
                    </cite>
                  </blockquote>
                ))}
            </div>
          </div>
        </section>
        <section id="faq" className="cc-section cc-faq">
          <div className="cc-heading">
            <h2>{copy.faqTitle}</h2>
            <p>{copy.faqText}</p>
          </div>
          <div className="cc-faq-list">
            {faqItems.map(([question, answer], index) => (
              <div
                className={`cc-faq-item ${openFaq === index ? 'open' : ''}`}
                key={question}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  <span>{question}</span>
                  <ChevronDown size={18} />
                </button>
                {openFaq === index && <p>{answer}</p>}
              </div>
            ))}
          </div>
        </section>
        <section id="download" className="cc-download cc-section">
          <img src="/ccswitch/logo.png" alt="" />
          <h2>
            {copy.downloadTitle}
            <br />
            {copy.downloadTitle2}
          </h2>
          <p>{copy.downloadText}</p>
          <div className="cc-download-actions">
            <a
              className="cc-btn cc-btn-primary"
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer"
            >
              <ArrowDownToLine size={18} /> {copy.downloadNow}
            </a>
            <a
              className="cc-btn cc-btn-ghost"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              {copy.viewGithub} <ArrowRight size={17} />
            </a>
          </div>
          <small>{copy.supported.replace(' 12+', '')}</small>
        </section>
      </main>
      <footer className="cc-footer">
        <div className="cc-footer-grid">
          <div className="cc-footer-brand">
            <a href={homeHref} className="cc-brand">
              <img src="/ccswitch/logo.png" alt="CC Switch" />
              <b>CC Switch</b>
            </a>
            <p>{copy.tagline}</p>
            <a
              className="cc-footer-github"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={isEn ? 'GitHub repository' : 'GitHub 开源地址'}
            >
              <Github size={19} />
            </a>
          </div>
          <div>
            <h4>{copy.footerGroups[0]}</h4>
            <a href="#features">{copy.footerLinks[0]}</a>
            <a href="#download">{copy.footerLinks[1]}</a>
          </div>
          <div>
            <h4>{copy.footerGroups[1]}</h4>
            <a href={docsHref}>{copy.footerLinks[2]}</a>
            <a href={docsHref}>{copy.footerLinks[3]}</a>
            <a href={`${GITHUB_URL}/releases`} target="_blank" rel="noreferrer">
              {copy.footerLinks[4]}
            </a>
          </div>
          <div>
            <h4>{copy.footerGroups[2]}</h4>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              {copy.footerLinks[5]}
            </a>
            <a
              href={`${GITHUB_URL}#contributing`}
              target="_blank"
              rel="noreferrer"
            >
              {copy.footerLinks[6]}
            </a>
            <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noreferrer">
              {copy.footerLinks[7]}
            </a>
            <a href={isEn ? '#sponsors' : '/zh/sponsors'}>
              {copy.footerLinks[8]}
            </a>
          </div>
        </div>
        <div className="cc-footer-bottom">
          <span>{copy.copyright}</span>
          <span>Made with ❤️ by CC Switch Team</span>
        </div>
      </footer>
    </div>
  );
}
