import { useState, type CSSProperties, type ReactNode } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Search,
} from 'lucide-react';

import '@/styles/codexdown-home.css';

const A = '/codexdown';
const DOWNLOAD_URL = 'https://pan.quark.cn/s/0f1763fe2ac9?pwd=rTQw#/list/share';
const CODEX_PLUS_PLUS_GITHUB_URL = 'https://github.com/xianyu110/CodexPlusPlus';
const CODEX_PLUS_PLUS_QUARK_URL = 'https://pan.quark.cn/s/2f2874a911e9';

const modelCards = [
  {
    name: 'GPT-5.6 Sol',
    badge: '最新旗舰',
    image: 'gpt-5.6-sol.jpg',
    desc: '前沿旗舰模型，适合复杂专业工作、深度推理、代码生成和多模态问答。',
    facts: ['能力优先', '2026-02-16', '$5 / $30', '1.05M'],
  },
  {
    name: 'GPT-5.6 Terra',
    badge: '高吞吐',
    image: 'gpt-5.6-terra.jpg',
    desc: '适合需要更高吞吐、更低延迟的生产调用，在能力和响应速度之间取平衡。',
    facts: ['均衡调用', '2026-02-16', '$2.50 / $15', '1.05M'],
  },
  {
    name: 'GPT-5.6 Luna',
    badge: '轻量低成本',
    image: 'gpt-5.6-luna.jpg',
    desc: '适合移动、边缘设备和批量轻任务，成本更低，响应更快。',
    facts: ['轻量任务', '2026-02-16', '$1 / $6', '1.05M'],
  },
  {
    name: 'GPT-5.5',
    badge: '上一代稳定',
    image: 'gpt-5.5.jpg',
    desc: '面向编码和专业工作的稳定模型，适合已经配置好的工作流。',
    facts: ['稳定配置', '2025-12-01', '$5 / $30', '1.05M'],
  },
];

const personalPlans = [
  ['轻量体验', 'Free', '$0', '无需订阅即可开始体验', '免费'],
  ['地区入门', 'Go', '$8', '从 Free 升级，获得更多使用空间', '地区'],
  ['日常开发', 'Plus', '$20', '适合 CLI、IDE 和云端日常编码', '1x'],
  ['高强度开发', 'Pro', '$100', '更高的本地与云端任务窗口', '5x / 20x'],
];

const teamPlans = [
  ['协作入门', 'Business', '$25', '面向团队的共享工作空间与管理能力', '团队'],
  [
    '规模部署',
    'Enterprise',
    '联系销售',
    '适合需要治理、安全与规模化支持的组织',
    '企业',
  ],
];

const plugins = [
  [
    'Computer Use',
    '直接操作电脑',
    '看屏幕、点按钮、改设置，替你跑桌面软件和重复流程。',
  ],
  [
    'Chrome',
    '接管真实浏览器',
    '沿用登录状态，查后台、看资料、操作真实网页工作流。',
  ],
  [
    'HyperFrames',
    '网页动效成片',
    '用 HTML 动效制作标题卡、产品展示和图文短视频。',
  ],
  [
    'Figma',
    '设计稿到代码',
    '读取组件、样式和页面结构，辅助生成可修改的前端页面。',
  ],
  [
    'Product Design',
    '想法快速成原型',
    '把产品想法拆成页面结构、交互草图与完整功能流。',
  ],
  [
    'Browser',
    '网页自动验收',
    '打开本地网页，检查按钮、表单、跳转和响应式布局。',
  ],
  [
    'Spreadsheets',
    '表格自动处理',
    '生成 Excel、清洗数据、添加公式图表并解读关键指标。',
  ],
  [
    'Presentations',
    '一键生成 PPT',
    '把大纲和素材做成可编辑演示文稿与汇报初稿。',
  ],
  [
    'GitHub',
    '仓库协作自动化',
    '查看 PR、Issue 和 CI 报错，定位问题并推进代码协作。',
  ],
];

const assistantSteps = [
  {
    title: '从真实任务开始',
    text: '选择团队已经在做的工作，例如发布简报、客户总结、KPI 报告或后续跟进。通过每一次输出逐步建立信任。',
    image: 'assistant-plan.png',
  },
  {
    title: 'Codex 收集所需数据',
    text: '连接任务需要的文档、网页和项目文件，让上下文保持完整。',
    image: 'assistant-research.png',
  },
  {
    title: '自动化',
    text: '将重复步骤交给自动化，在关键决策和外部操作前仍由你确认。',
    image: 'assistant-automate.png',
  },
  {
    title: '一切由你掌控',
    text: '检查输出、调整方向，并决定哪些内容会被使用、发送或分享。',
    image: 'assistant-write.png',
  },
];

const tutorials = [
  [
    '最新教程',
    'Codex 使用 CC-Switch 接入 GPT-5.5 第三方 API 教程',
    '从注册 API 平台、创建 Key 到新增渠道，按步骤完成接入。',
  ],
  [
    '用量说明',
    'OpenAI Codex 用量限制怎么看',
    '先分清计划窗口、workspace credits 和 API key 按量计费。',
  ],
  [
    '配置指南',
    'Codex config.toml 配置',
    '分清个人配置、项目配置、profile 和命令行覆盖的边界。',
  ],
  [
    '计费路由',
    'Codex API Key 和 ChatGPT 订阅怎么选？',
    '先分清 ChatGPT 登录、API key 登录和 credits 的计费归属。',
  ],
];

const prompts = [
  [
    '项目概述',
    '将此计划文件转化为给老板的报告表，概括讨论结果，提出负责人建议。',
  ],
  ['每周总结', '根据我的日历、消息和文档，生成每周总结，突出风险和后续步骤。'],
  ['客户洞察', '查看调查数据，找出规律，提取代表性引述并起草团队进展报告。'],
  ['电子邮件审核', '找出需要回复的消息，总结每条消息，并准备好回复草稿。'],
  ['启动计划', '使用产品文档和发布时间表，制定清晰的发布计划。'],
  ['活动策划', '汇总参会人员名单，起草邀请函，建立跟踪表。'],
];

const faqs = [
  [
    '什么是 OpenAI Codex？',
    'Codex 是面向开发场景的 coding agent，适合处理写代码、调试、重构、测试和文档整理等任务。',
  ],
  [
    'Codex 怎么一键安装？',
    '在终端运行 npm i -g @openai/codex@latest，安装完成后按官方说明登录。',
  ],
  [
    'Codex 官网入口在哪里？',
    '官方产品与文档入口以 OpenAI 官网和开发者文档为准。',
  ],
  [
    'Codex 需要单独下载吗？',
    'CLI 可以通过 npm 安装；图形客户端是否可用取决于当前发布状态和系统平台。',
  ],
  [
    'Codex 支持 Windows 和 macOS 吗？',
    'Codex 支持主流桌面系统，具体能力以最新官方发布说明为准。',
  ],
  [
    'Codex 能在 VS Code、Cursor 或 Windsurf 中使用吗？',
    '可以通过 CLI、IDE 扩展或集成工作流使用，配置方式因编辑器而异。',
  ],
  [
    '使用 Codex 是否必须订阅 ChatGPT 付费计划？',
    '可用方式与额度可能动态调整，请以账号页面和官方价格页实时显示为准。',
  ],
];

function ArrowLink({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`cd-arrow-link ${className}`}>
      {children} <ExternalLink aria-hidden="true" size={16} />
    </span>
  );
}

export function CodexdownHome() {
  const [pricingMode, setPricingMode] = useState<'personal' | 'team'>(
    'personal'
  );
  const [assistantStep, setAssistantStep] = useState(0);
  const [skin, setSkin] = useState(0);
  const [compare, setCompare] = useState(50);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const plans = pricingMode === 'personal' ? personalPlans : teamPlans;
  const skins = ['skin-01.jpg', 'skin-02.jpg', 'skin-03.jpg', 'skin-09.jpg'];

  const copyCommand = async () => {
    await navigator.clipboard.writeText('npm i -g @openai/codex@latest');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="cd-page" id="top">
      <header className="cd-header">
        <a className="cd-brand" href="#top" aria-label="Codex 首页">
          <img src={`${A}/icon.png`} alt="Codex 图标" />
          <span>codex中文网</span>
        </a>
        <div className="cd-header-tools">
          <label className="cd-search">
            <Search aria-hidden="true" size={20} />
            <input aria-label="搜索 Codex 内容" placeholder="搜索 Codex 内容" />
          </label>
          <nav aria-label="主导航">
            <a href="/articles/">文章</a>
            <a href="/docs/">文档</a>
            <a href="/showcase/">案例</a>
            <a href="#plugins">插件</a>
          </nav>
        </div>
      </header>

      <main className="cd-main">
        <section className="cd-hero cd-glass">
          <div className="cd-hero-copy">
            <span className="cd-domain">codexinstall.asia</span>
            <h1>Codex 完全实操指南</h1>
            <p className="cd-lead">
              专为零基础小白准备，从认识、安装到插件和实战技巧。
            </p>
            <p className="cd-sublead">
              OpenAI Codex 客户端、安装命令、Windows / macOS / Linux、CLI / IDE
              使用说明持续同步更新。
            </p>
            <div className="cd-actions">
              <a
                className="cd-button cd-button-dark"
                href={DOWNLOAD_URL}
                target="_blank"
                rel="noreferrer"
              >
                <ArrowLink>下载 Codex 客户端</ArrowLink>
              </a>
              <a className="cd-button cd-button-light" href="/docs/">
                查看文档
              </a>
            </div>
            <p className="cd-version">
              <i /> 当前最新版 <strong>v26.803.10989.0</strong>
              <span>·</span> 2026年8月12日更新
            </p>
            <div className="cd-actions cd-actions-secondary">
              <a className="cd-button cd-button-green" href="#install">
                <ArrowLink>新手下载及安装指南</ArrowLink>
              </a>
              <a
                className="cd-button cd-button-blue"
                href={CODEX_PLUS_PLUS_GITHUB_URL}
                target="_blank"
                rel="noreferrer"
              >
                <ArrowLink>Codex++ GitHub 下载</ArrowLink>
              </a>
              <a
                className="cd-button cd-button-light"
                href={CODEX_PLUS_PLUS_QUARK_URL}
                target="_blank"
                rel="noreferrer"
              >
                <ArrowLink>Codex++ 夸克网盘</ArrowLink>
              </a>
            </div>
          </div>
          <div className="cd-hero-visual" aria-hidden="true">
            <div className="cd-orbit" />
            <span className="cd-orbit-tag cd-tag-one">下载</span>
            <span className="cd-orbit-tag cd-tag-two">安装</span>
            <span className="cd-orbit-tag cd-tag-three">实操</span>
            <div className="cd-logo-card">
              <img src={`${A}/logo.jpg`} alt="" />
            </div>
          </div>
        </section>

        <section
          className="cd-section cd-install"
          id="install"
          aria-labelledby="install-title"
        >
          <div>
            <span className="cd-kicker">Install Command</span>
            <h2 id="install-title">Codex 一键安装命令</h2>
            <p>Windows 使用 CMD 或 PowerShell，macOS / Linux 在终端执行。</p>
          </div>
          <div className="cd-command">
            <span>npm command</span>
            <button
              type="button"
              onClick={copyCommand}
              aria-label="复制安装命令"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <code>npm i -g @openai/codex@latest</code>
            <small>安装命令以官方 npm / CLI 发布状态为准。</small>
          </div>
        </section>

        <section className="cd-section cd-skin" aria-labelledby="skin-title">
          <div className="cd-skin-copy">
            <span className="cd-kicker">CodexSkin · Codex 主题美化工具</span>
            <h2 id="skin-title">
              换个界面，<em>让灵感常驻</em>
            </h2>
            <p>从默认黑白到你的专属氛围，拖动滑杆看看 CodexSkin 带来的变化。</p>
            <a
              className="cd-button cd-button-dark"
              href="https://pan.quark.cn/s/edf4a5c11c98"
              target="_blank"
              rel="noreferrer"
            >
              <ArrowLink>Codexskin</ArrowLink>
            </a>
            <div className="cd-skin-picker" aria-label="选择 CodexSkin 皮肤">
              {skins.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  className={skin === index ? 'active' : ''}
                  aria-label={`切换到 CodexSkin 皮肤 ${index + 1}`}
                  aria-pressed={skin === index}
                  onClick={() => setSkin(index)}
                >
                  <img src={`${A}/${item}`} alt="" />
                  {skin === index && <Check size={15} />}
                </button>
              ))}
            </div>
          </div>
          <div
            className="cd-compare"
            style={{ '--compare': `${compare}%` } as CSSProperties}
          >
            <img src={`${A}/${skins[skin]}`} alt="CodexSkin 美化后的界面" />
            <div className="cd-compare-after">
              <img src={`${A}/skin-default.png`} alt="" />
            </div>
            <span className="cd-before-label">原版界面</span>
            <span className="cd-after-label">CodexSkin</span>
            <div className="cd-divider">
              <span>‹ ›</span>
            </div>
            <input
              aria-label="拖动对比 Codex 原版界面与 CodexSkin 美化界面"
              type="range"
              min="0"
              max="100"
              value={compare}
              onChange={(event) => setCompare(Number(event.target.value))}
            />
          </div>
        </section>

        <section className="cd-section" aria-labelledby="stories-title">
          <div className="cd-story-grid">
            {[
              [
                'GPT-5.6',
                '第三方 API 手动切换 GPT-5.6',
                'gpt-5.6-sol.jpg',
                '模型列表暂无 GPT-5.6 时，手动修改新会话与已有会话使用的模型。',
                'https://doc.momoai.asia/blog/codex-china-gpt-5-6-launch',
              ],
              [
                'CC-Switch',
                '使用 CC-Switch 接入 GPT-5.5',
                'cc-switch-logo.png',
                '从注册 API 平台、创建 Key 到新增渠道，图形化完成第三方接口配置。',
                'https://doc.momoai.asia/blog/codex-china-gpt-5-6-launch',
              ],
              [
                'GPT-5.5',
                '配置第三方 API 中转',
                'api-logo.png',
                '从创建 API Key 到修改配置文件，完整演示接入。',
                'https://doc.momoai.asia/blog/codex-china-gpt-5-6-launch',
              ],
              [
                'DeepSeek',
                'Codex 接入 DeepSeek 教程',
                'deepseek-logo.png',
                '通过 CC-Switch 配置 API 渠道，开启本地路由。',
                '',
              ],
            ].map(([tag, title, image, text, href]) => (
              <article className="cd-story" key={title}>
                <span>{tag}</span>
                <h2
                  id={
                    title === '第三方 API 手动切换 GPT-5.6'
                      ? 'stories-title'
                      : undefined
                  }
                >
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer">
                      {title}
                    </a>
                  ) : (
                    title
                  )}
                </h2>
                <p>{text}</p>
                <img src={`${A}/${image}`} alt="" />
              </article>
            ))}
          </div>
        </section>

        <section
          className="cd-section cd-models"
          aria-labelledby="models-title"
        >
          <div className="cd-section-heading">
            <div>
              <span className="cd-kicker">最新模型</span>
              <h2 id="models-title">GPT-5.6 模型列表</h2>
            </div>
            <p>
              Sol 旗舰能力，Terra 高吞吐低延迟，Luna 轻量低成本；GPT-5.5
              适合稳定配置参考。
            </p>
          </div>
          <div className="cd-model-grid">
            {modelCards.map((model) => (
              <article className="cd-model-card" key={model.name}>
                <div
                  className="cd-model-image"
                  style={{ backgroundImage: `url(${A}/${model.image})` }}
                >
                  <span>{model.badge}</span>
                  <strong>{model.name}</strong>
                </div>
                <p>{model.desc}</p>
                <dl>
                  {['定位', '知识库', '价格', '上下文'].map((label, i) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{model.facts[i]}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </section>

        <nav
          className="cd-section cd-docs"
          id="docs"
          aria-label="Codex 中文文档核心页面"
        >
          <div className="cd-section-heading">
            <div>
              <span className="cd-kicker">Docs</span>
              <h2>Codex 中文文档</h2>
            </div>
            <a className="cd-small-button" href="/docs/">
              进入文档首页
            </a>
          </div>
          <div className="cd-doc-links">
            {[
              ['快速开始', '/docs/quickstart/'],
              ['Codex App', '/docs/app/'],
              ['Codex CLI', '/docs/codex/cli/'],
              ['IDE 扩展', '/docs/codex/ide/'],
              ['基础配置', '/docs/configuration/'],
              ['配置参考', '/articles/codex-config-toml-guide/'],
              [
                'Windows 部署',
                '/articles/codex-client-installation-guide-2026/',
              ],
              ['GitHub Action', '/docs/developers/'],
            ].map(([item, href]) => (
              <a key={item} href={href}>
                {item}
              </a>
            ))}
          </div>
        </nav>

        <section
          className="cd-section cd-pricing"
          id="pricing"
          aria-labelledby="pricing-title"
        >
          <div className="cd-section-heading">
            <div>
              <span className="cd-kicker">Codex Pricing</span>
              <h2 id="pricing-title">价格</h2>
            </div>
            <p>个人计划按月订阅，团队计划按 workspace 规则计费。</p>
          </div>
          <div className="cd-tabs" role="tablist" aria-label="价格计划类型">
            <button
              type="button"
              role="tab"
              aria-selected={pricingMode === 'personal'}
              onClick={() => setPricingMode('personal')}
            >
              个人方案
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={pricingMode === 'team'}
              onClick={() => setPricingMode('team')}
            >
              团队与企业
            </button>
          </div>
          <div
            className={`cd-plan-grid ${pricingMode === 'team' ? 'team' : ''}`}
            role="tabpanel"
          >
            {plans.map(([eyebrow, name, price, desc, badge]) => (
              <article className="cd-plan" key={name}>
                <span>{eyebrow}</span>
                <div>
                  <h3>{name}</h3>
                  <b>{badge}</b>
                </div>
                <strong>
                  {price}
                  <small>/ 月</small>
                </strong>
                <p>{desc}</p>
                <ul>
                  <li>
                    <Check size={15} />
                    额度以账号页面为准
                  </li>
                  <li>
                    <Check size={15} />
                    支持 Codex 工作流
                  </li>
                  <li>
                    <Check size={15} />
                    可随时查看使用状态
                  </li>
                </ul>
                <a href="#faq">
                  查看 {name} 详情 <ArrowRight size={16} />
                </a>
              </article>
            ))}
          </div>
          <p className="cd-note">
            <strong>计费提醒：</strong>ChatGPT 计划包含的 Codex 用量、additional
            credits 与 OpenAI Platform API 账单彼此独立。
          </p>
        </section>

        <section
          className="cd-section cd-plugins"
          id="plugins"
          aria-labelledby="plugins-title"
        >
          <div className="cd-plugin-intro">
            <span>Codex 插件清单</span>
            <h2 id="plugins-title">
              Codex 必备插件 <em>Top 9</em>
            </h2>
            <p>
              从操作电脑到设计、表格、PPT 和代码协作，把 Agent
              能力接进真实工作流。
            </p>
            <div className="cd-plugin-mosaic">
              {plugins.map((item, i) => (
                <img key={item[0]} src={`${A}/plugin-${i + 1}.png`} alt="" />
              ))}
            </div>
          </div>
          <div className="cd-plugin-list">
            {plugins.map((item, i) => (
              <article key={item[0]}>
                <img src={`${A}/plugin-${i + 1}.png`} alt="" />
                <span>No.{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{item[0]}</h3>
                  <strong>{item[1]}</strong>
                  <p>{item[2]}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="cd-section cd-assistant"
          aria-labelledby="assistant-title"
        >
          <div className="cd-section-heading">
            <div>
              <span className="cd-kicker">CONTROLLED BY YOU</span>
              <h2 id="assistant-title">你的个人助手</h2>
            </div>
            <p>Codex 帮你完成工作，同时始终由你掌控。</p>
          </div>
          <div className="cd-assistant-layout">
            <div className="cd-assistant-visual">
              <img
                src={`${A}/${assistantSteps[assistantStep].image}`}
                alt={`Codex ${assistantSteps[assistantStep].title}的预览图`}
              />
            </div>
            <div className="cd-assistant-steps">
              {assistantSteps.map((step, i) => (
                <article
                  className={assistantStep === i ? 'active' : ''}
                  key={step.title}
                >
                  <button
                    type="button"
                    aria-expanded={assistantStep === i}
                    onClick={() => setAssistantStep(i)}
                  >
                    <span>{step.title}</span>
                    <ChevronDown size={20} />
                  </button>
                  {assistantStep === i && <p>{step.text}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="cd-section cd-articles"
          id="articles"
          aria-labelledby="articles-title"
        >
          <div className="cd-section-heading">
            <div>
              <span className="cd-kicker">文章中心</span>
              <h2 id="articles-title">实用教程</h2>
            </div>
            <p>
              从下载安装、账号登录到计费路由与日常用法，把高频问题拆成独立教程。
            </p>
          </div>
          <div className="cd-tutorial-grid">
            {tutorials.map(([tag, title, text], i) => (
              <article key={title} className={i === 0 ? 'featured' : ''}>
                <span>{tag}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <a
                  href={
                    [
                      '/articles/codex-client-installation-guide-2026/',
                      '/articles/codex-cc-switch-gpt-55-third-party-api-guide/',
                      '/articles/codex-config-toml-guide/',
                      '/articles/codex-api-key-vs-chatgpt-subscription/',
                    ][i]
                  }
                >
                  阅读全文 <ArrowRight size={16} />
                </a>
              </article>
            ))}
          </div>
          <a className="cd-section-link" href="/articles/">
            查看全部文章 <ArrowRight size={16} />
          </a>
        </section>

        <section
          className="cd-section cd-prompts"
          aria-labelledby="prompts-title"
        >
          <div className="cd-section-heading">
            <div>
              <span className="cd-kicker">团队流程</span>
              <h2 id="prompts-title">团队如何使用 Codex</h2>
            </div>
            <p>尝试使用这些示例提示来创建文档、报告和更新。</p>
          </div>
          <div className="cd-prompt-grid">
            {prompts.map(([title, text], i) => (
              <article key={title}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="cd-section cd-workflows"
          id="workflows"
          aria-labelledby="workflow-title"
        >
          <div className="cd-section-heading">
            <div>
              <span className="cd-kicker">真实使用场景</span>
              <h2 id="workflow-title">项目工作流</h2>
            </div>
            <p>
              当你把需求说清楚，Codex 更像一个能看仓库、能改代码、能补测试的
              coding agent。
            </p>
          </div>
          <div className="cd-flow">
            {[
              ['prompt', '为现有项目新增订单筛选页，并补齐测试与文档'],
              ['analyze', '读取仓库结构、路由约定、组件模式和已有接口层'],
              ['patch', '生成页面、类型、请求逻辑，并补充必要的测试'],
              ['verify', '继续修复 lint / typecheck 问题，再整理最终方案'],
            ].map(([label, text], i) => (
              <article key={label}>
                <b>{String(i + 1).padStart(2, '0')}</b>
                <span>{label}</span>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="cd-section cd-faq"
          id="faq"
          aria-labelledby="faq-title"
        >
          <div className="cd-section-heading">
            <div>
              <span className="cd-kicker">常见问题</span>
              <h2 id="faq-title">常见问题</h2>
            </div>
            <p>集中回答官网入口、下载方式、平台支持和接入门槛。</p>
          </div>
          <div className="cd-faq-list">
            {faqs.map(([question, answer], i) => (
              <article className={openFaq === i ? 'open' : ''} key={question}>
                <button
                  type="button"
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  <span>{question}</span>
                  <ChevronDown size={21} />
                </button>
                {openFaq === i && <p>{answer}</p>}
              </article>
            ))}
          </div>
        </section>

        <section className="cd-section cd-final">
          <span className="cd-kicker">准备开始了吗</span>
          <h2>开始使用</h2>
          <p>
            直接前往下载资源，也可以先查看文档，再按自己的设备与工作流开始使用。
          </p>
          <div className="cd-actions">
            <a
              className="cd-button cd-button-dark"
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer"
            >
              <ArrowLink>立即下载 Codex 资源</ArrowLink>
            </a>
            <a className="cd-button cd-button-light" href="/docs/">
              查看 Codex 文档
            </a>
          </div>
        </section>
      </main>

      <footer className="cd-footer">
        <a className="cd-brand" href="#top">
          <img src={`${A}/icon.png`} alt="" />
          <span>codex中文网</span>
        </a>
        <p>Codex 中文下载、安装与实操指南</p>
        <nav>
          <a href="/articles/">文章</a>
          <a href="/docs/">文档</a>
          <a href="/showcase/">案例</a>
          <a href="#plugins">插件</a>
          <a href="#faq">FAQ</a>
        </nav>
      </footer>
    </div>
  );
}
