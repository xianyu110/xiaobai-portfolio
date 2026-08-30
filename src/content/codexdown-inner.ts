export type ArticleSummary = {
  slug: string;
  title: string;
  description: string;
  published: string;
  updated: string;
  tags: string[];
};

export type ArticleSection = {
  heading?: string;
  level?: 2 | 3;
  paragraphs?: string[];
  bullets?: string[];
  links?: Array<{ label: string; href: string }>;
  code?: string;
  quote?: string;
};

export type ArticleDetail = ArticleSummary & {
  intro: string;
  sections: ArticleSection[];
};

export const articles: ArticleSummary[] = [
  {
    slug: 'codex-client-installation-guide-2026',
    title: '2026 年 Codex 客户端与 CLI 安装教程',
    description:
      '面向第一次使用 Codex 的用户，介绍新版 ChatGPT 桌面应用、Codex CLI、登录方式和 IDE 使用入口。',
    published: '2026-07-23',
    updated: '2026-08-14',
    tags: ['Codex客户端', 'Codex CLI', '安装教程'],
  },
  {
    slug: 'codex-cc-switch-gpt-55-third-party-api-guide',
    title: 'Codex 接入 GPT-5.6：使用 CC Switch 配置第三方 API',
    description:
      '使用 CC Switch 管理 Codex 的第三方 OpenAI 兼容接口，从安装、添加供应商到验证 GPT-5.6 模型调用。',
    published: '2026-06-06',
    updated: '2026-08-14',
    tags: ['Codex', 'CC Switch', 'GPT-5.6'],
  },
  {
    slug: 'codex-third-party-api-gpt-56-model-guide',
    title:
      'Codex 桌面端第三方 API 暂无 GPT-5.6 选项？手动修改新旧会话模型的方法',
    description:
      'Codex 桌面端第三方 API 暂无 GPT-5.6 选项时，可通过 config.toml 修改新会话模型，并处理已有会话模型。',
    published: '2026-07-11',
    updated: '2026-08-14',
    tags: ['GPT-5.6', '配置'],
  },
  {
    slug: 'openai-gpt-56-sol-preview',
    title: 'GPT-5.6 正式发布：Sol、Terra、Luna 怎么选？',
    description:
      '整理 GPT-5.6 系列正式发布后的模型 ID、别名、定位、价格和 Codex 用户的选择方法。',
    published: '2026-07-09',
    updated: '2026-08-14',
    tags: ['模型', '更新'],
  },
  {
    slug: 'codex-deepseek-v4-cc-switch-guide',
    title: 'Codex 接入 DeepSeek V4 Pro / Flash 教程',
    description:
      '使用 CC Switch 为 Codex 配置 DeepSeek V4 Pro 或 V4 Flash，从创建 API Key 到选择模型并验证请求。',
    published: '2026-06-18',
    updated: '2026-08-14',
    tags: ['DeepSeek', 'CC-Switch'],
  },
  {
    slug: 'codex-client-third-party-api-gpt-55-guide',
    title: 'Codex 客户端下载和第三方 API 配置教程',
    description:
      '详细演示新版 ChatGPT/Codex 客户端入口、API Key 创建、auth.json 与 config.toml 配置。',
    published: '2026-06-01',
    updated: '2026-08-14',
    tags: ['客户端', 'API', '配置'],
  },
  {
    slug: 'codex-config-toml-guide',
    title: 'Codex config.toml 配置：文件放哪里、谁优先、哪些示例才安全',
    description:
      '先分清个人配置、项目配置、profile 和命令行覆盖的边界，再决定配置应该放在哪一层。',
    published: '2026-05-03',
    updated: '2026-08-14',
    tags: ['配置', 'config.toml'],
  },
  {
    slug: 'openai-codex-usage-limits-guide',
    title: 'OpenAI Codex 用量限制：计划、Credits 和 API Key 怎么看',
    description:
      '分清 ChatGPT 计划窗口、workspace credits 和 API key 按量计费，再看 Codex 当前限制。',
    published: '2026-05-03',
    updated: '2026-08-14',
    tags: ['用量', '价格'],
  },
  {
    slug: 'codex-api-key-vs-chatgpt-subscription',
    title: 'Codex API Key 和 ChatGPT 订阅怎么选？先看计费路由',
    description:
      '先分清 ChatGPT 登录、API key 登录和 credits 的计费归属，再决定下一次 Codex 任务该走哪条路由。',
    published: '2026-05-02',
    updated: '2026-08-14',
    tags: ['计费路由', '入门'],
  },
];

const installSections: ArticleSection[] = [
  {
    heading: '先了解当前 Codex 入口',
    paragraphs: [
      '目前 Codex 主要通过新版 ChatGPT 桌面应用、Codex CLI、IDE 扩展和 Codex Web 使用。桌面应用已整合 Chat、Work 与 Codex，macOS 和 Windows 均可使用。',
    ],
    quote: '先按官方入口登录，再根据需要配置 API Key 或第三方兼容接口。',
  },
  {
    heading: '安装 ChatGPT 桌面应用',
    paragraphs: [
      'Mac 用户可以直接下载官方 macOS 安装包；Windows 用户可以通过微软商店安装，也可以使用本站提供的本地安装包。安装后打开应用并登录 ChatGPT。旧 Codex 应用更新后会迁移到新版 ChatGPT 桌面应用，已有聊天和项目会保留。',
    ],
    links: [
      {
        label: '官方 macOS 下载链接',
        href: 'https://persistent.oaistatic.com/codex-app-prod/Codex.dmg',
      },
      {
        label: 'Windows 本地安装包（夸克网盘）',
        href: 'https://pan.quark.cn/s/0f1763fe2ac9?pwd=rTQw',
      },
      {
        label: 'GitHub 仓库发行版入口',
        href: 'https://github.com/openai/codex/releases',
      },
    ],
    bullets: ['Windows 用户也可以通过微软商店搜索并安装 ChatGPT。'],
  },
  {
    heading: '安装 Codex CLI',
    paragraphs: [
      'macOS 和 Linux 可以使用官方安装脚本；Windows 可以使用 PowerShell 安装脚本，也可以通过 npm 安装。安装完成后在项目目录运行 codex，首次启动按提示使用 ChatGPT 登录或其他可用方式认证。',
    ],
    bullets: [
      'macOS / Linux：curl -fsSL https://chatgpt.com/codex/install.sh | sh',
      'Windows PowerShell：irm https://chatgpt.com/codex/install.ps1 | iex',
      '通用 npm：npm install -g @openai/codex',
    ],
    code: 'codex',
  },
  {
    heading: '登录并开始第一个任务',
    paragraphs: [
      '进入一个本地项目目录后运行 codex，选择 Sign in with ChatGPT 或 API Key 登录方式。然后直接描述任务，例如让 Codex 解释项目、修改一个文件或运行测试。',
    ],
  },
  {
    heading: 'IDE 扩展和其他入口',
    level: 3,
    paragraphs: [
      '如果更习惯编辑器，可以安装 Codex IDE 扩展；也可以使用 Codex Web 处理云端任务。VS Code、Cursor 和 Windsurf 等 VS Code 分支可以使用扩展或在终端运行 Codex CLI。',
    ],
    quote:
      '官方客户端和 CLI 的登录、权限与用量规则可能随计划和地区变化，请以登录界面和官方说明为准。',
  },
  {
    heading: '常见问题',
    level: 2,
    paragraphs: [
      '如果旧 Codex 应用更新后变成 ChatGPT，不需要重复创建账号；新版应用会保留已有 Codex 聊天和项目。CLI 安装后运行 codex --help 可以查看当前版本支持的命令。',
    ],
  },
  {
    heading: '下一步：配置第三方 API',
    paragraphs: [
      '完成官方登录后，如果确实需要第三方 OpenAI 兼容接口，再阅读 CC Switch 配置教程。第三方接口的模型支持、数据留存和计费规则由对应供应商负责。',
    ],
  },
];

const articleSections: Record<string, ArticleSection[]> = {
  'codex-cc-switch-gpt-55-third-party-api-guide': [
    {
      heading: '一、效果展示',
      paragraphs: [
        'CC Switch 是一个免费开源的本地配置管理工具，可以集中管理 Codex provider、API Key 和模型目录，再把当前选中的渠道写入本机配置。它不会替第三方供应商提供模型或额度，实际可用性仍以供应商后台为准。',
        '本文介绍从注册 API 平台、创建 API Key，到通过 CC Switch 新增 provider、选择模型并验证 Codex 请求的完整流程。',
      ],
      bullets: [
        'Codex 正常启动。',
        '支持调用第三方 OpenAI 兼容接口。',
        '选择供应商明确提供的 GPT-5.6 模型，并可继续切换多个 provider。',
        '由 CC Switch 管理本地配置，不必反复手动编辑 TOML。',
      ],
      code: 'Codex 客户端\n    ↓\nCC-Switch\n    ↓\n第三方 API 平台\n    ↓\nGPT-5.6 模型',
    },
    {
      heading: '二、软件下载',
      paragraphs: [
        '先从官方 GitHub 仓库或 Release 页面下载 Codex 客户端和 CC Switch。优先使用官方发布的安装包，不要从带推广参数或不明第三方下载站获取软件。',
      ],
      code: 'Codex 客户端：https://codexinstall.asia/\nCC Switch 源码：https://github.com/farion1231/cc-switch\nCC Switch Releases：https://github.com/farion1231/cc-switch/releases',
    },
    {
      heading: '三、注册 API 平台',
      paragraphs: [
        '访问 API 平台的注册页面，完成账号注册并登录后台。第三方平台的模型、价格和可用性会变化，实际以平台页面实时显示为准。',
      ],
      code: 'https://codex.chatgpt-plus.top/login?mode=register',
    },
    {
      heading: '四、创建 API Key 并导入 CC-Switch',
      paragraphs: [
        '进入 API Key 管理页面，点击“创建 API 密钥”。名称可以填写 codex，分组按平台当前说明选择，保存后立即复制 Key 并放入密码管理工具。',
        '在 CC Switch 的 Codex provider 管理界面点击“新增”，填写 provider 名称、兼容接口 base URL、模型 ID 和 API Key；如果供应商提供一键导入链接，也要先核对域名和字段，再确认导入。',
      ],
      code: 'https://codex.chatgpt-plus.top/keys\n名称：codex\n分组：故障转移分组',
    },
    {
      heading: '五、重启 Codex 客户端',
      paragraphs: [
        '配置导入后关闭 Codex，再重新启动。重新启动可以让客户端重新读取当前接口配置。',
      ],
      code: '退出 Codex\n    ↓\n重新打开 Codex',
    },
    {
      heading: '六、验证是否配置成功',
      paragraphs: [
        '打开 Codex 后发送一个简单测试问题。如果能够正常返回结果，再在 CC Switch 当前 provider 和供应商调用日志中核对模型 ID，确认请求确实走到了选中的 GPT-5.6 渠道。',
      ],
      code: '你好，请介绍一下自己\n\n你是谁',
    },
    {
      heading: '七、常见问题',
      level: 2,
      bullets: [
        'Codex 没有返回内容：检查 provider 的 base URL、协议、模型 ID 和 CC Switch 的 Codex 路由开关。',
        '提示认证失败：确认 Key 没有多余空格、没有过期或被撤销，并重新保存 provider。',
        '修改配置后没有生效：关闭 Codex 和 CC Switch 后重新打开，并确认当前 provider 已激活。',
        '第三方接口的模型支持、计费、数据留存和服务条款由供应商决定，不要仅凭宣传页判断兼容性。',
      ],
    },
    {
      heading: '八、总结',
      paragraphs: [
        '通过 CC Switch 可以集中管理 Codex 的第三方 OpenAI 兼容 provider，并在多个供应商之间切换；它只是本地配置工具，不改变供应商的模型能力和服务责任。',
      ],
      code: '注册平台 → 创建 API Key → 导入 CC-Switch → 重启 Codex → 使用 GPT-5.6',
    },
  ],
  'codex-third-party-api-gpt-56-model-guide': [
    {
      heading: '一、为什么没有 GPT-5.6？',
      paragraphs: [
        'GPT-5.6 已正式发布，但第三方 API 的模型目录仍由各供应商单独维护。模型列表没有 GPT-5.6 时，先确认供应商实际提供的模型 ID，再决定是否手动配置。',
        '常见名称包括 gpt-5.6、gpt-5.6-sol、gpt-5.6-terra 和 gpt-5.6-luna；它们不是所有供应商都会同时提供，不能只凭客户端下拉菜单猜测。',
      ],
    },
    {
      heading: '二、新建会话如何修改模型？',
      paragraphs: [
        '新会话可以修改个人配置文件。macOS 和 Linux 一般位于 ~/.codex/config.toml，Windows 一般位于 C:\\Users\\用户名\\.codex\\config.toml。找到原有 model 设置后，替换为服务商明确支持的模型 ID；推理强度使用 Codex 当前字段 model_reasoning_effort。',
      ],
      code: 'model = "gpt-5.6"\nmodel_reasoning_effort = "max"',
      quote:
        '只有当你的 API 服务明确支持这个模型 ID 和 Responses API 协议时，手动修改才会生效。',
    },
    {
      heading: '三、已有会话如何修改？',
      paragraphs: [
        '已有会话可能把模型选择保存到 Codex 的本地状态库，因此只修改 config.toml 不一定会改变已有会话。这个数据库结构不是面向用户的稳定 API；如确需排查，先完整备份，再使用 SQLiteStudio、DB Browser for SQLite 或 sqlite3 打开对应版本的 .codex 状态库。升级客户端后表结构和字段名可能变化。',
      ],
    },
    {
      heading: '四、先找到会话 ID',
      paragraphs: [
        '打开 Codex，在左侧会话列表中找到目标会话，使用会话菜单复制 Thread ID。记下完整的 thread_ 开头 ID，再进行下一步修改。',
      ],
      code: 'thread_xxxxxxxxxxxxxxxxx',
    },
    {
      heading: '五、执行 SQL 修改模型',
      paragraphs: [
        '只有在确认当前版本表结构、字段名和备份可恢复后，才考虑执行 UPDATE，把目标会话的 model 和 model_reasoning_effort 更新为供应商支持的值。不要把示例中的会话 ID 原样执行，也不要把这当成官方稳定配置方式。',
      ],
      code: "UPDATE threads\nSET model = 'gpt-5.6', model_reasoning_effort = 'max'\nWHERE id = '这里替换成你的会话ID';",
    },
    {
      heading: '六、重启 Codex',
      paragraphs: [
        '保存数据库修改后关闭 Codex 并重新打开目标会话。如果客户端显示“自定义（Custom）”，再到供应商调用日志确认实际模型 ID。若启动报错，立即退出并恢复备份。',
      ],
    },
    {
      heading: '七、需要注意的几点',
      bullets: [
        '这种方式只适用于第三方 API 已经提供对应 GPT-5.6 模型和协议的情况。',
        'API 没有提供 gpt-5.6、gpt-5.6-sol、gpt-5.6-terra 或 gpt-5.6-luna 时，修改后会返回模型不存在或无权限调用。',
        '官方模型列表更新后，可以改回客户端支持的正式选项。',
      ],
    },
  ],
  'openai-gpt-56-sol-preview': [
    {
      heading: '这次上线了什么',
      paragraphs: [
        'OpenAI 在 2026-06-26 发布 GPT-5.6 Sol 的有限预览说明，并于 2026-07-09 宣布 GPT-5.6 正式发布。现在 GPT-5.6 已在 ChatGPT、Codex 和 OpenAI API 中推出，预览公告应作为发布时间线背景阅读。',
        '预览公告：https://openai.com/index/previewing-gpt-5-6-sol/\n正式发布：https://openai.com/index/gpt-5-6/',
      ],
      bullets: [
        'gpt-5.6-sol：复杂推理和高难度编码，输入 $5 / 1M tokens，输出 $30 / 1M tokens。',
        'gpt-5.6-terra：日常编码与推理平衡，输入 $2.50 / 1M tokens，输出 $15 / 1M tokens。',
        'gpt-5.6-luna：更低成本与更快响应，输入 $1 / 1M tokens，输出 $6 / 1M tokens。',
      ],
    },
    {
      heading: '当前谁能用',
      paragraphs: [
        '正式发布后，是否能在某个 ChatGPT 计划、Codex 工作区或 API 项目中看到某个变体，仍取决于账号权限、区域、配额和供应商目录。第三方兼容接口尤其需要以自己的模型列表和计费页面为准。',
      ],
      quote:
        '如果账号或供应商暂时看不到某个变体，不一定是配置错误，也可能是权限、配额或 provider 目录尚未开放。',
    },
    {
      heading: 'Codex 用户需要关注什么',
      bullets: [
        'Codex 的模型选择列表是否出现 GPT-5.6 或 GPT-5.6 Sol。',
        'API 控制台是否出现可调用的 GPT-5.6 系列模型。',
        '第三方兼容接口是否明确支持 GPT-5.6，而不是只在宣传页写“支持 GPT”。',
      ],
    },
    {
      heading: '和 GPT-5.5 有什么关系',
      paragraphs: [
        'GPT-5.6 是 GPT-5.5 之后的新一代模型线。现有 GPT-5.5 工作流仍可继续使用；是否切换应根据任务质量、速度、价格和供应商的实际可用性决定。',
      ],
    },
    {
      heading: '建议的检查步骤',
      code: '查看 OpenAI 官方原文\n↓\n检查 ChatGPT 或 Codex 模型选择器\n↓\n检查 API 控制台模型列表\n↓\n确认服务商支持后再修改配置',
    },
    {
      heading: '常见问题',
      bullets: [
        'GPT-5.6 已正式发布，但具体变体是否可用仍以当前账号、项目和 provider 模型列表为准。',
        'Codex 配置中的高推理档位通常使用 max；Codex 内部还可能显示 ultra，具体选项以当前客户端为准。',
        '第三方 API 必须同时核对模型 ID、Responses API 兼容性、价格、速率限制和数据政策。',
      ],
    },
  ],
  'codex-deepseek-v4-cc-switch-guide': [
    {
      heading: '一、准备工作',
      paragraphs: [
        '准备 Codex 客户端和 CC Switch，下载后分别完成安装。本文使用 CC Switch 的 Codex provider 管理和本地路由，把请求转发到 DeepSeek 官方 API。',
      ],
    },
    {
      heading: '二、获取 DeepSeek API Key',
      paragraphs: [
        '打开 DeepSeek 官方 API 管理页面并登录。如果还没有 Key，点击“创建 API Key”，填写名称后保存。完整 Key 通常只在创建时显示一次，请立即放入密码管理工具；忘记后只能删除并重新创建。',
      ],
      code: 'https://platform.deepseek.com/api_keys\n示例格式：sk-xxxxxxxxxxxxxxxxxxxx',
    },
    {
      heading: '三、配置 CC-Switch',
      paragraphs: [
        '安装并打开 CC-Switch，点击顶部的 OpenAI 图标，再点击右上角“+”新增渠道。',
      ],
    },
    {
      heading: '四、创建 DeepSeek 供应商',
      paragraphs: [
        '在预设供应商中选择 DeepSeek，向下找到 API Key 输入框，粘贴刚才创建的 Key，确认无误后保存。模型目录中优先选择当前官方文档列出的 deepseek-v4-pro 或 deepseek-v4-flash，不要继续使用已下线或未经确认的旧名称。',
      ],
      code: '供应商：DeepSeek\nAPI Key：填入你自己的 Key\n模型：deepseek-v4-pro 或 deepseek-v4-flash\nAPI 文档：https://api-docs.deepseek.com/api/list-models',
    },
    {
      heading: '五、开启本地路由',
      paragraphs: [
        '进入“设置 → 本地路由”，同时打开“路由总开关”和“Codex”开关。这一步决定 Codex 是否会经过 CC-Switch 转发。',
      ],
      bullets: ['路由总开关：开启', 'Codex 开关：开启'],
    },
    {
      heading: '六、切换到 DeepSeek 渠道',
      paragraphs: [
        '返回 CC Switch 主界面，在 Codex provider 或渠道列表中选择刚创建的 DeepSeek，并确认当前激活渠道已经切换成功。Pro 偏向能力和复杂任务，Flash 偏向速度与成本，最终以官方模型说明和你的账户可用性为准。',
      ],
    },
    {
      heading: '七、重启 Codex 客户端',
      paragraphs: ['关闭 Codex 后重新启动，客户端会重新读取本地代理配置。'],
      code: '退出 Codex\n↓\n重新打开 Codex',
    },
    {
      heading: '八、常见问题',
      bullets: [
        'API Key 无效：检查是否复制完整、是否多复制了空格，以及 Key 是否已经被删除。',
        'Codex 没有响应：确认“设置 → 本地路由”中的两个开关都已开启。',
        '仍然无法连接：切换渠道、保存、重启 CC-Switch，再重启 Codex。',
        '模型不存在：检查当前模型列表是否仍包含 deepseek-v4-pro 或 deepseek-v4-flash，并以 DeepSeek 官方模型列表为准。',
      ],
    },
    {
      heading: '配置流程总结',
      code: '安装 Codex → 安装 CC-Switch → 获取 DeepSeek API Key → 新增渠道 → 填写 Key → 开启本地路由 → 切换渠道 → 重启 Codex',
    },
  ],
  'codex-client-third-party-api-gpt-55-guide': [
    {
      heading: '一、下载并安装 Codex 客户端',
      paragraphs: [
        '进入本站首页下载对应系统版本，完成安装后至少打开一次 Codex，确保程序已经初始化 .codex 配置目录。',
      ],
      code: 'https://codexinstall.asia/',
    },
    {
      heading: '二、获取 API Key',
      paragraphs: [
        '注册并登录 API 平台，在 API Key 管理页面点击“创建 API 密钥”。根据平台实时显示选择合适的分组，保存后点击 Key 旁边的“复制”，将 Key 放在安全的密码管理工具中。',
      ],
      code: 'https://codex.chatgpt-plus.top/login?mode=register\nhttps://codex.chatgpt-plus.top/keys',
    },
    {
      heading: '三、找到 Codex 配置目录',
      paragraphs: [
        'Windows 使用 Win + R 打开 %userprofile%\\.codex；macOS 可以在终端使用 ~/.codex。',
      ],
      code: 'Windows: %userprofile%\\.codex\nmacOS: ~/.codex',
    },
    {
      heading: '四、修改 auth.json',
      paragraphs: [
        'auth.json 只保留一个认证字段。不要把模型名、provider 或其它配置混在这个文件里，也不要把含有真实 Key 的文件上传到项目或截图。',
      ],
      code: '{\n  "OPENAI_API_KEY": "替换成你自己的 API Key"\n}',
      quote:
        'API Key 是私密凭据，请使用环境变量或本机凭据存储，并避免提交到 Git。',
    },
    {
      heading: '五、修改 config.toml',
      paragraphs: [
        '打开 config.toml，配置模型提供商、模型名称、推理强度和兼容接口地址。下面示例只展示字段结构；第三方服务的 base_url、模型 ID 和协议必须以供应商当前页面为准，不要盲抄。',
      ],
      code: 'model_provider = "mycodex"\nmodel = "gpt-5.6"\nmodel_reasoning_effort = "medium"\n\n[model_providers.mycodex]\nname = "mycodex"\nbase_url = "https://供应商当前提供的地址/v1"\nwire_api = "responses"',
    },
    {
      heading: '六、配置参数说明',
      bullets: [
        'model_provider 与 [model_providers.mycodex] 的名称必须一致。',
        'model 决定当前使用的模型，例如供应商明确支持的 gpt-5.6。',
        'model_reasoning_effort 可选择供应商和客户端支持的 low、medium、high 或 max。',
        'API Key 应通过本机 auth.json、环境变量或凭据存储提供，不要把真实 Key 写入共享配置。',
        'base_url 是兼容接口地址，wire_api = "responses" 使用 Responses API 协议。',
      ],
    },
    {
      heading: '七、最终配置示例',
      code: 'auth.json\n{ "OPENAI_API_KEY": "替换成你自己的 Key" }\n\nconfig.toml\nmodel_provider = "mycodex"\nmodel = "gpt-5.6"\nmodel_reasoning_effort = "medium"',
    },
    {
      heading: '八、重启 Codex',
      paragraphs: [
        '保存 auth.json 和 config.toml，关闭 Codex 后重新打开，确认可以正常调用供应商列出的模型。',
      ],
    },
    {
      heading: '九、常见问题',
      bullets: [
        'API Key 无效：检查字段名、引号、逗号和 Key 是否完整。',
        '连接失败：检查 base_url 是否为平台当前提供的地址。',
        '修改后不生效：完全退出 Codex 后重新启动，部分版本不会实时读取配置。',
      ],
    },
  ],
  'codex-config-toml-guide': [
    {
      heading: '先决定配置层，而不是先打开文件',
      paragraphs: [
        '个人默认值放在 ~/.codex/config.toml，可信仓库策略才放 .codex/config.toml，临时实验用命令行覆盖，重复使用的 CLI 模式再放进 profile。',
        '不要把 API key、bearer token 或 auth.json 写进共享项目配置。配置文件应减少重复选择，而不是把密钥或过宽权限写死。',
      ],
    },
    {
      heading: '优先级：冲突时到底谁赢',
      paragraphs: [
        '配置没有生效时，先查当前命令是否带有 --config 或 --profile，再查当前目录和项目 trust 状态，最后检查更近的项目配置。命令行和更具体的项目层通常会覆盖个人默认值。',
      ],
      quote:
        '我改了 config.toml 但没生效，通常不是 Codex 忽略了文件，而是另一层配置正在生效。',
    },
    {
      heading: '个人配置：只放跟你有关的默认值',
      paragraphs: [
        '个人配置适合放模型、审批策略、沙盒偏好和本机认证方式。保持短小，不要把只对某个仓库生效的策略塞进用户层。',
      ],
    },
    {
      heading: '项目配置：写共享策略，不写私人状态',
      paragraphs: [
        '项目配置可以描述仓库规则、默认沙盒和项目说明，但不应保存账号 token、本机路径或私人路由。尤其不要把 danger-full-access 与 approval_policy = "never" 当作共享默认值。',
      ],
      code: '[sandbox]\nmode = "workspace-write"\n\n[approval]\npolicy = "on-request"',
    },
    {
      heading: 'MCP、模型和 provider：示例要短，密钥要间接',
      paragraphs: [
        '配置 MCP 时优先使用 codex mcp add 这类 helper，让 Codex 生成不容易写错的 TOML。模型默认值适合长期使用时写入文件，只试一次的模型或权限变化用命令行参数更稳妥。',
      ],
    },
    {
      heading: '沙盒、审批和 profile',
      paragraphs: [
        '日常本地开发通常从 workspace-write + on-request 开始；代码审查或只读排查可以使用 read-only。profile 适合重复使用的 CLI 预设，但目前属于 CLI 便利功能，IDE extension 不一定支持。',
      ],
    },
    {
      heading: '配置没生效时按这个顺序查',
      code: '1. 当前命令是否带 --config / --profile\n2. 项目是否 trusted\n3. 是否存在更近的 .codex/config.toml\n4. 当前目录是否在预期项目内\n5. 最后才检查个人 ~/.codex/config.toml',
    },
    {
      heading: 'FAQ',
      bullets: [
        '用户配置默认位于 ~/.codex/config.toml，可信项目可以有 .codex/config.toml。',
        'API Key 不应写进共享 config.toml，应使用环境变量、系统凭据存储或 secret 管理。',
        '临时实验、一次性模型和临时沙盒变化适合使用 --config。',
        '官方 schema：https://developers.openai.com/codex/config-schema.json',
      ],
    },
  ],
  'openai-codex-usage-limits-guide': [
    {
      heading: '先判断你到底在哪条限制合同上',
      paragraphs: [
        'OpenAI Codex 的用量限制不是一个统一的每日 token 数字。真正生效的限制取决于 ChatGPT 计划包含用量、Business 或 Enterprise credits，还是 API Key 按量计费。',
        '计划窗口、促销倍数、workspace credits 和 rate card 都可能变化，影响花钱决策时要带日期，并以官方页面和当前账户面板为准。',
      ],
    },
    {
      heading: '当前 Codex plan limits 怎么读',
      paragraphs: [
        'Codex pricing 页面通常按 plan、model 和 activity 拆开显示限制，而不是给一个 daily token cap。实际可用量还会受模型、任务大小、复杂度以及 local/cloud 执行方式影响。',
      ],
      quote: '短小本地任务和长时间云端任务，不能当成同一个消耗单位。',
    },
    {
      heading: '为什么你感觉到的限制会不一样',
      bullets: [
        '模型选择不同：轻量模型通常能让 routine local tasks 更耐用。',
        '上下文与任务大小不同：大仓库、长会话和复杂任务会更快消耗窗口。',
        'local 与 cloud 的执行方式不同，体感消耗也不同。',
        'fast 配置、图片生成、过大的 AGENTS.md 和不必要的 MCP servers 都会增加上下文成本。',
      ],
    },
    {
      heading: 'Business、Enterprise 与 token-based credits',
      paragraphs: [
        'Credits 是超出包含用量后的续用单位。Business、Edu 和 Enterprise 还可能涉及 flexible pricing、workspace credits 以及按 token 计费的迁移规则，因此不要把团队页面直接套用到 Plus 或 Pro。',
      ],
    },
    {
      heading: 'API key 分支是什么',
      paragraphs: [
        'API Key 适合额外本地任务、CI 自动化、SDK、IDE extension 和需要项目级预算的工作流。它走 OpenAI Platform 的 usage-based 计费，不等于 ChatGPT plan 的订阅额度，也不能假设拥有 Codex cloud-only 功能。',
      ],
    },
    {
      heading: '撞到限制后怎么做',
      bullets: [
        '打开 Codex usage dashboard，CLI 活跃会话中使用 /status。',
        '把 routine work 切到更轻量的模型，减少上下文开销。',
        '临时超量时再考虑 additional credits 或 workspace credits。',
        '额外的无人值守任务使用 API Key，并按 API 用量预算。',
      ],
      code: '/status',
    },
    {
      heading: 'FAQ',
      bullets: [
        'Codex 没有一个适用于所有人的每日 token 上限。',
        'Plus / Pro 主要按时间窗口和计划规则查看，不是简单 daily limit。',
        'API Key 和 ChatGPT plan 限制不一样，分别查看 Platform Usage 与 Codex Usage。',
        '看不清数字时先确认登录路由，再决定是否购买 credits 或启动自动化。',
      ],
    },
  ],
  'codex-api-key-vs-chatgpt-subscription': [
    {
      heading: '先用一张表区分三条路',
      paragraphs: [
        'ChatGPT 登录属于订阅路线，API Key 登录属于 OpenAI Platform 路线，credits 只是在符合条件的 Codex 使用超过包含额度后提供延续。选错路由，比选错模型更容易造成意外支出。',
      ],
      bullets: [
        '个人 Codex、订阅用量和 Codex cloud：优先 ChatGPT 登录。',
        'CI、SDK、后端和无人值守自动化：使用 API Key。',
        '超出包含用量的符合条件任务：根据计划和 workspace 规则查看 credits。',
      ],
    },
    {
      heading: '花钱前先确认当前路由',
      paragraphs: [
        '不要先升级、购买 credits 或创建 Key。先看 Codex Settings → Usage，再确认 CLI 或 IDE 当前是 ChatGPT 登录还是 API Key 登录；API Key 的账单以 OpenAI Platform Usage 为准。',
      ],
      code: '订阅路线：Codex Settings → Usage\nAPI Key 路线：OpenAI Platform Usage',
    },
    {
      heading: 'API key 登录改变了什么',
      paragraphs: [
        'API Key 会改变这次 Codex 会话的计费归属。用量归到 Platform 账户和 project，适合服务账号、项目预算、usage ledger、CI job、SDK 和后端服务。',
        '代价是功能边界：API Key-only 会话不能假设拥有 Codex cloud、托管集成或 ChatGPT credits 相关功能。',
      ],
    },
    {
      heading: '订阅和 credits 到底覆盖什么',
      paragraphs: [
        'ChatGPT 登录是订阅访问路线，包含用量、计划窗口、符合条件的 credits 和 Codex cloud 相关能力取决于当前计划和 workspace 政策。credits 不等于普通 API Key 余额，也不代表手动 API 调用免费。',
      ],
    },
    {
      heading: '不同工作流该选哪条路',
      bullets: [
        '个人 CLI 或 IDE：想使用订阅用量时用 ChatGPT 登录；明确要按 Platform 用量计费时再用 API Key。',
        'Codex cloud、浏览器 review、托管工作：使用 ChatGPT 登录。',
        'CI、SDK、后端和自动化：使用 API Key，便于非交互凭据、预算与审计。',
        '团队或 workspace：先决定谁拥有支出，再选择个人订阅、workspace 或 Platform project。',
      ],
    },
    {
      heading: '避免意外 API 支出',
      code: '先查路由 → 再查计量表 → 确认是否需要 cloud → 最后再决定 credits、升级或 API Key',
    },
    {
      heading: '常见问题',
      bullets: [
        '已有 ChatGPT Plus 或 Pro 时，普通订阅路线不需要额外 Codex API Key。',
        'ChatGPT 订阅不会自动支付普通 OpenAI API Key 调用。',
        'Codex credits 与 API Key 余额不是同一种东西。',
        'CI 或 SDK 自动化适合 API Key；Codex cloud 适合 ChatGPT 登录。',
      ],
    },
  ],
};

export const articleDetails: Record<string, ArticleDetail> = Object.fromEntries(
  articles.map((article) => [
    article.slug,
    {
      ...article,
      intro:
        article.slug === 'codex-client-installation-guide-2026'
          ? '本文面向第一次使用 Codex 的用户，介绍新版 ChatGPT 桌面应用、Codex CLI、登录方式和 IDE 使用入口。'
          : article.description,
      sections:
        article.slug === 'codex-client-installation-guide-2026'
          ? installSections
          : (articleSections[article.slug] ?? [
              { heading: '先说结论', paragraphs: [article.description] },
            ]),
    },
  ])
) as Record<string, ArticleDetail>;

export type DocSection = { title: string; slug: string; description: string };

export type DocCategorySection = {
  heading: string;
  description: string;
  items: Array<{ title: string; description: string; slug?: string }>;
};

export type DocCategory = {
  slug: string;
  title: string;
  description: string;
  sections: DocCategorySection[];
};

export const docCategories: DocCategory[] = [
  {
    slug: 'features',
    title: '功能',
    description: '了解 ChatGPT、Work 和 Codex 如何把任务推进到可评审结果。',
    sections: [
      {
        heading: '工作流',
        description: '从明确目标开始，把上下文、工具和结果组织成完整工作流。',
        items: [
          {
            title: '开始使用 ChatGPT Work',
            slug: 'get-started-with-work',
            description: '将研究、分析、文件和周期性任务交给 Work。',
          },
          {
            title: '使用 ChatGPT',
            slug: 'use-chatgpt',
            description: '选择 Chat、Work 或 Codex，按任务规模组织上下文。',
          },
        ],
      },
      {
        heading: '能力',
        description: '文件、插件、权限和云端执行共同决定可用能力边界。',
        items: [
          {
            title: '技能与插件',
            slug: 'skills-and-plugins',
            description: '连接外部工具，复用稳定的工作方法。',
          },
          {
            title: '权限',
            slug: 'permission-modes',
            description: '在自动执行和逐步确认之间选择合适的控制方式。',
          },
          {
            title: 'Codex 云端',
            slug: 'cloud',
            description: '在并行云环境中运行、评审并合并编码任务。',
          },
        ],
      },
    ],
  },
  {
    slug: 'configuration',
    title: '配置',
    description: '管理个性化设置、配置文件、模型和 Codex 工作方式。',
    sections: [
      {
        heading: '个性化',
        description: '让 ChatGPT 和 Codex 更贴合你的偏好与日常工作。',
        items: [
          {
            title: '个性化 ChatGPT',
            slug: 'personalize',
            description: '设置默认性格、自定义指令和记忆边界。',
          },
          {
            title: '提示词',
            slug: 'prompting',
            description: '用目标、上下文、约束和验证要求写出可执行提示词。',
          },
        ],
      },
      {
        heading: '配置文件',
        description: '分清用户层、项目层和临时命令行覆盖的优先级。',
        items: [
          {
            title: 'Codex CLI',
            slug: 'codex/cli',
            description: '安装 CLI，并配置本地仓库、脚本和 CI 工作流。',
          },
          {
            title: 'Codex IDE 扩展',
            slug: 'codex/ide',
            description: '在编辑器中使用打开的文件和代码上下文。',
          },
          {
            title: '模型与定价',
            slug: 'models',
            description: '根据能力、速度、推理强度和成本选择模型。',
          },
        ],
      },
    ],
  },
  {
    slug: 'developers',
    title: '开发者',
    description: '从终端、IDE、云端和第三方集成扩展 Codex。',
    sections: [
      {
        heading: '开发工作流',
        description: '让 Codex 进入真实仓库、测试和代码评审闭环。',
        items: [
          {
            title: 'Codex CLI',
            slug: 'codex/cli',
            description: '在本地仓库中检查、编辑、运行测试并提交改动。',
          },
          {
            title: 'Codex IDE 扩展',
            slug: 'codex/ide',
            description: '在代码旁边评审、修改和委派任务。',
          },
          {
            title: 'Codex 云端',
            slug: 'cloud',
            description: '用并行环境处理更大的编码任务。',
          },
        ],
      },
      {
        heading: '扩展与自动化',
        description: '使用 skills、plugins 和项目上下文连接开发工具。',
        items: [
          {
            title: '技能与插件',
            slug: 'skills-and-plugins',
            description: '把重复操作整理成可复用的能力和连接器。',
          },
          {
            title: '从其他智能体导入',
            slug: 'import',
            description: '迁移受支持的设置、项目和近期工作。',
          },
        ],
      },
    ],
  },
  {
    slug: 'security-administration',
    title: '安全',
    description: '理解权限、数据边界、代码安全和功能成熟度。',
    sections: [
      {
        heading: '权限',
        description: '在执行本地命令、修改文件和外部操作前保留控制权。',
        items: [
          {
            title: '权限模式',
            slug: 'permission-modes',
            description: '了解 Ask for approval 等确认模式。',
          },
          {
            title: 'Codex CLI',
            slug: 'codex/cli',
            description: '配置本地仓库和 CI 中的操作边界。',
          },
        ],
      },
      {
        heading: '安全保障',
        description: '在采用新能力前检查成熟度、来源和问题反馈渠道。',
        items: [
          {
            title: '功能成熟度',
            slug: 'feature-maturity',
            description: '判断功能状态、限制和适用范围。',
          },
          {
            title: '开源',
            slug: 'open-source',
            description: '查看相关开源组件、问题和功能请求入口。',
          },
        ],
      },
    ],
  },
  {
    slug: 'administration',
    title: '管理',
    description: '面向团队管理登录、策略、模型、用量和治理。',
    sections: [
      {
        heading: '开始使用',
        description: '先确定账号、工作区和团队需要的使用入口。',
        items: [
          {
            title: '快速开始',
            slug: 'quickstart',
            description: '从桌面 App、Web 或 Codex CLI 开始使用。',
          },
          {
            title: 'ChatGPT 桌面应用',
            slug: 'app',
            description: '在 Windows 和 macOS 上管理项目与本地工作。',
          },
        ],
      },
      {
        heading: '用量与治理',
        description: '按计划、模型和 API 路由理解成本与访问边界。',
        items: [
          {
            title: 'Codex 定价',
            slug: 'pricing',
            description: '比较 Free、Go、Plus、Pro、Business 和 API key。',
          },
          {
            title: '模型',
            slug: 'models',
            description: '查看模型定位、推理强度和选择建议。',
          },
          {
            title: '最新动态',
            slug: 'whats-new',
            description: '跟进能力、版本和策略变化。',
          },
        ],
      },
    ],
  },
];

export const docGroups: Array<{ title: string; items: DocSection[] }> = [
  {
    title: '开始使用',
    items: [
      {
        title: '快速开始',
        slug: 'quickstart',
        description: '从 Web 或桌面 App 开始使用 ChatGPT。',
      },
      {
        title: '使用 ChatGPT',
        slug: 'use-chatgpt',
        description: '了解日常对话与工作流入口。',
      },
      {
        title: '开始使用 ChatGPT Work',
        slug: 'get-started-with-work',
        description: '把真实任务交给可控的工作流。',
      },
      {
        title: '从其他智能体导入',
        slug: 'import',
        description: '导入受支持的设置、项目和近期工作。',
      },
    ],
  },
  {
    title: '基础',
    items: [
      {
        title: '提示词',
        slug: 'prompting',
        description: '让任务目标、上下文和输出更清晰。',
      },
      {
        title: '个性化 ChatGPT',
        slug: 'personalize',
        description: '调整你的偏好和工作方式。',
      },
      {
        title: '技能与插件',
        slug: 'skills-and-plugins',
        description: '把能力接入真实工作流。',
      },
      {
        title: '权限',
        slug: 'permission-modes',
        description: '理解不同操作权限和确认边界。',
      },
    ],
  },
  {
    title: '探索',
    items: [
      {
        title: '最新动态',
        slug: 'whats-new',
        description: '查看近期发布和功能变化。',
      },
      {
        title: '模型',
        slug: 'models',
        description: '比较模型定位与使用场景。',
      },
      {
        title: '定价',
        slug: 'pricing',
        description: '了解计划、用量和计费路由。',
      },
      { title: '术语表', slug: 'glossary', description: '快速查找常见概念。' },
    ],
  },
  {
    title: '可用平台',
    items: [
      {
        title: 'ChatGPT 桌面应用',
        slug: 'app',
        description: '在 Windows 和 macOS 上处理项目。',
      },
      {
        title: 'ChatGPT 网页版',
        slug: 'web',
        description: '直接在 Web 中使用 ChatGPT。',
      },
      {
        title: 'Codex CLI',
        slug: 'codex/cli',
        description: '在终端中运行 Codex 工作流。',
      },
      {
        title: 'Codex IDE 扩展',
        slug: 'codex/ide',
        description: '在代码编辑器中使用 Codex。',
      },
      {
        title: 'Codex 云端',
        slug: 'cloud',
        description: '了解云端任务和项目协作。',
      },
    ],
  },
  {
    title: '发布',
    items: [
      {
        title: '更新日志',
        slug: 'changelog',
        description: '跟进版本与能力更新。',
      },
      {
        title: '功能成熟度',
        slug: 'feature-maturity',
        description: '了解功能状态和适用范围。',
      },
      {
        title: '开源',
        slug: 'open-source',
        description: '查看相关开源项目和资源。',
      },
    ],
  },
];

export const quickstartTabs = {
  desktop: {
    title: '桌面 App',
    description:
      'ChatGPT 桌面 App 支持 Windows 和 macOS，适合处理项目、本地文件、长时间任务和快速对话。',
    steps: [
      '安装 ChatGPT 桌面 App，选择适用于当前操作系统的版本。',
      '打开桌面 App 并登录，使用 ChatGPT 账号完成授权。',
      '选择工作位置、开始任务或创建项目，提供需要的文件和上下文。',
      '描述目标并发送第一条消息，逐步检查输出结果。',
    ],
  },
  web: {
    title: 'Web',
    description: 'ChatGPT 可直接在 Web 上使用，其中包括 Chat 和 ChatGPT Work。',
    steps: [
      '打开 ChatGPT Web 并登录账号。',
      '选择合适的工作模式和项目上下文。',
      '描述目标，附上需要的文件或上下文。',
      '根据输出继续追问、确认或修改任务。',
    ],
  },
};

export const findArticle = (slug: string) => articleDetails[slug];
export const findDoc = (slug: string) =>
  docGroups.flatMap((group) => group.items).find((item) => item.slug === slug);
export const findDocCategory = (slug: string) =>
  docCategories.find((category) => category.slug === slug);

export const articleIndex = articles.filter(
  (article) => article.slug !== 'codex-client-installation-guide-2026'
);
