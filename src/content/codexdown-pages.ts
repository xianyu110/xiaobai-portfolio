export type CodexGuide = {
  slug: string;
  title: string;
  description: string;
  sections: Array<{
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
    code?: string;
  }>;
};

const sharedIdeSections = (name: string, focus: string) => [
  {
    heading: `${name} 用户开始前先看这三件事`,
    paragraphs: [
      `先确认账号和官方 ${name} 入口，再决定如何把终端和仓库接进来。${focus}`,
    ],
    bullets: [
      '先核对官方入口、账号状态和当前计划。',
      '把 Codex 放进已有编辑器、终端和真实仓库。',
      '根据任务结果继续检查、测试和修改，而不是只看一次补全。',
    ],
  },
  {
    heading: `${name} 用户开始用 Codex 的顺序`,
    paragraphs: [
      '先确认账号是否已经出现 Codex 能力，再按官方 IDE 路线理解入口，最后把 CLI、Git 和仓库上下文接到连续任务中。',
    ],
  },
  {
    heading: '最有价值的真实任务',
    bullets: [
      '在现有项目中定位并修复问题。',
      '围绕多个文件和模块做有上下文的重构。',
      '根据终端输出补测试、整理文档并复核结果。',
    ],
  },
  {
    heading: '常见问题',
    paragraphs: [
      `Codex 可以在 ${name} 场景中使用，但具体界面、账号可见性和功能范围以当前版本与官方说明为准。它通常不是一个独立的第三方下载包，而是通过官方 IDE 路线、账号能力和 CLI 协同进入工作流。`,
    ],
  },
];

export const codexGuides: CodexGuide[] = [
  {
    slug: 'updates',
    title: 'Codex 更新中心',
    description: '跟进桌面端、CLI、Codex Remote 和配置文档的公开更新。',
    sections: [
      {
        heading: 'ChatGPT 桌面版已集成 Codex，CLI 0.144.0 同步发布',
        paragraphs: [
          '官方 changelog 显示，ChatGPT macOS 和 Windows 桌面版已集成 Codex，现有 Codex app 用户可继续更新并保留项目、设置和工作流。CLI 0.144.0 同步带来 writes 审批、MCP 交互认证、用量重置明细和 MCP 工具覆盖修复。',
        ],
      },
      {
        heading: 'CLI 0.143.0 强化升级、认证与会话体验',
        paragraphs: [
          'CLI 0.143.0 聚焦稳定性和运维体验，修复 npm 安装提示路径，记录 Microsoft Store 安装的最新版本，支持 MCP 401 重新认证，并优化 web search 预算、panic 日志、恢复会话排序和 shell 回退表现。',
        ],
      },
      {
        heading: 'Codex Remote 正式可用，CLI 0.142.x 持续增强',
        paragraphs: [
          'Codex Remote 可通过 ChatGPT 移动端连接 Mac 或 Windows 主机、查看进度并审批操作；CLI 0.142.x 同步增强 MCP tool search、系统代理、插件暗色 Logo、凭证提示和 PowerShell 安全审批。',
        ],
      },
      {
        heading: '后续建议固定更新的栏目',
        bullets: [
          '客户端版本与更新状态。',
          '热门报错与配置排障。',
          '官方文档变化和第三方 API 配置变化。',
          '新增教程和插件入口。',
        ],
      },
    ],
  },
  {
    slug: 'windows',
    title: 'Codex Windows 下载与使用指南 2026',
    description: '整理 Windows 桌面端、CLI、PowerShell 和 IDE 工作流入口。',
    sections: sharedIdeSections(
      'Windows',
      'Windows 用户可以从桌面端开始，也可以直接使用 PowerShell、Windows Terminal 或 VS Code 集成终端。'
    ),
  },
  {
    slug: 'mac',
    title: 'Codex Mac 下载与使用指南 2026',
    description: '整理 macOS 桌面端、Terminal、CLI 与编辑器协同入口。',
    sections: sharedIdeSections(
      'Mac',
      'macOS 用户通常会同时关注桌面端、Terminal、Git、VS Code、Cursor 和 Windsurf。'
    ),
  },
  {
    slug: 'cli',
    title: 'Codex CLI 使用指南 2026',
    description: '安装、登录、命令行工作流与常见问题。',
    sections: [
      {
        heading: 'CLI 用户开始前先看这三件事',
        paragraphs: [
          '先看官方安装文档，再确认账号状态，最后直接把 Codex 放进真实仓库。CLI 更适合围绕终端、Git、测试和连续任务工作。',
        ],
        bullets: [
          '安装入口与官方文档。',
          'ChatGPT 登录、计划和额度。',
          '在真实仓库里完成修复、重构、补测试和文档任务。',
        ],
      },
      {
        heading: 'Codex CLI 的开始顺序',
        paragraphs: [
          '常见安装方式会使用 @openai/codex。安装后完成登录，然后在已有项目目录中启动首个任务。',
        ],
        code: 'npm install -g @openai/codex\ncodex',
      },
      {
        heading: 'CLI 页面适合解决哪些问题',
        bullets: [
          'Codex CLI 安装与登录。',
          '@openai/codex 包名与命令行入口。',
          'Windows PowerShell、macOS Terminal 和编辑器集成终端。',
          'CLI 与 VS Code、Cursor、Windsurf 的连续工作流。',
        ],
      },
      {
        heading: 'Codex CLI 常见问题',
        paragraphs: [
          '安装后通常通过 ChatGPT 账号或相关凭证完成登录，具体流程以当前官方文档为准。CLI 可以在 PowerShell、Windows Terminal、macOS Terminal 和 VS Code 集成终端中使用。',
        ],
      },
    ],
  },
  {
    slug: 'vscode',
    title: 'Codex VS Code 使用指南 2026',
    description: 'IDE 扩展、CLI 协同、账号可用性和真实仓库场景。',
    sections: sharedIdeSections(
      'VS Code',
      'VS Code 用户通常已经有工程环境，重点是让 Codex 理解项目结构、终端输出和当前任务目标。'
    ),
  },
  {
    slug: 'cursor',
    title: 'Codex Cursor 使用指南 2026',
    description: 'IDE 工作流、CLI 协同与多文件任务场景。',
    sections: sharedIdeSections(
      'Cursor',
      'Cursor 用户更关心如何把 Codex 插进现有仓库、终端和多文件开发场景，而不是寻找所谓的独立资源包。'
    ),
  },
  {
    slug: 'windsurf',
    title: 'Codex Windsurf 使用指南 2026',
    description: 'IDE 入口、CLI 协同、账号可用性与连续任务。',
    sections: sharedIdeSections(
      'Windsurf',
      'Windsurf 用户适合把跨文件修改、终端反馈、测试和文档整理串成一套完整任务流程。'
    ),
  },
];

export const findGuide = (slug: string) =>
  codexGuides.find((guide) => guide.slug === slug);
