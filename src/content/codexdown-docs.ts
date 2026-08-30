export type CodexDocSection = {
  heading?: string;
  level?: 2 | 3;
  paragraphs?: string[];
  bullets?: string[];
  codeBlocks?: string[];
  quotes?: string[];
  tables?: string[][];
};

export type CodexDocDetail = {
  title: string;
  sections: CodexDocSection[];
};

// Local snapshot of the public Codex documentation used by the static docs pages.
export const codexDocDetails: Record<string, CodexDocDetail> = {
  quickstart: {
    title: '快速开始',
    sections: [
      {
        heading: '在哪里使用 ChatGPT',
        level: 2,
        paragraphs: [
          '你可以在不同产品形态中使用 ChatGPT，包括 ChatGPT 桌面 App 和 ChatGPT Web 版。请选择符合当前工作方式的入口。',
          '如果你是开发者，希望在终端或代码编辑器中使用 Codex，可以尝试 Codex CLI 或 Codex IDE 扩展。',
        ],
      },
      {
        heading: '设置',
        level: 2,
      },
      {
        heading: '桌面 App',
        level: 3,
        paragraphs: [
          'ChatGPT 桌面 App 支持 Windows 和 macOS，适合处理项目、本地文件、长时间任务和快速对话。',
          '安装 ChatGPT 桌面 App。 前往桌面 App 页面，选择适用于当前操作系统的版本。',
          '打开 ChatGPT 桌面 App 并登录。 使用 ChatGPT 账号登录。你也可以通过 API key 使用 Codex，但部分功能可能不可用。',
          '选择 ChatGPT 的工作位置。 开始一项任务、创建项目或打开文件夹。ChatGPT 可以读取并修改你所选文件夹中的文件。进一步了解任务与项目。',
          '开始任务。',
          '进一步了解如何使用 ChatGPT。',
          '发送第一条消息。 描述目标，并附上 ChatGPT 所需的文件或上下文。可以从以下示例开始：',
          '继续探索更多使用场景。',
        ],
        bullets: [
          '对于研究、分析，或文档、演示文稿、电子表格和 Sites 等交付物，请从 ChatGPT 下拉菜单中选择 ChatGPT Work。',
          '对于需要代码库上下文和开发者工具的软件开发工作，请从 ChatGPT 下拉菜单中选择 Codex。',
          '对于简短问题或普通对话，请单独打开 Chat（聊天）。',
        ],
        codeBlocks: [
          'Review the reports and notes in this project, compare the options, and create a one-page decision memo with a recommendation, risks, open questions, and source links.',
          'Combine the spreadsheets in this folder, clean inconsistent records, identify the most important trends, and create a concise report with charts and plain-English takeaways.',
          'Inspect this app, identify one high-impact usability improvement, implement it, update the relevant tests, and verify the result on mobile and desktop.',
        ],
      },
      {
        heading: 'Web',
        level: 3,
        paragraphs: [
          'ChatGPT 可直接在 Web 上使用，其中包括 Chat 和 ChatGPT Work。',
          '打开 ChatGPT 并登录。 前往 chatgpt.com，使用 ChatGPT 账号登录。',
          '开始任务。',
          '进一步了解如何使用 ChatGPT。',
          '选择 ChatGPT 的工作位置。 开始聊天或选择项目。项目可以包含聊天、文件和指令。',
          '发送第一条消息。 描述目标，并附上 ChatGPT 所需的文件或上下文。可以从以下示例开始：',
        ],
        bullets: [
          '选择 Chat，以对话方式提出问题、探索想法或深入讨论某个主题。',
          '选择 Work，开展研究、分析信息，并创建文档、演示文稿、电子表格、Sites 或其他完成度较高的交付物。',
        ],
        codeBlocks: [
          'Research whether I should [decision], compare the best options, explain the tradeoffs for my situation, and recommend one with citations.',
          "Every weekday at 8:00 a.m., review my connected calendar and recent messages, then send me a briefing with today's priorities, meeting prep, replies I owe, and blockers.",
          'Help me plan my event. Ask me about the occasion, guests, date, location, budget, and anything else you need. Then create a timeline, budget, invitation copy, and checklist, and publish a Site I can use to invite guests and collect RSVPs.',
        ],
      },
      {
        heading: '后续步骤',
        level: 2,
        bullets: [
          '进一步了解 ChatGPT 桌面 App：使用桌面 App 处理本地项目。',
          '导入现有设置：把受支持的设置、项目和近期工作带入 ChatGPT。',
        ],
      },
    ],
  },
  'use-chatgpt': {
    title: '使用 ChatGPT',
    sections: [
      {
        heading: '从想法走向可用结果',
        level: 2,
        paragraphs: ['ChatGPT 是一个可以用自然语言交流的 AI 智能体：'],
        bullets: [
          '从一个问题、想法、零散笔记、文件或需要完成的任务开始。',
          '让 ChatGPT 解释信息、发展想法、起草内容、研究主题、分析材料或创作新内容。',
          '添加任务需要的上下文和工具，例如文件、Web 搜索、项目或 plugins。',
          '评审结果、纠正方向并提出修改。第一条提示词不需要完美，也不需要特殊命令。',
        ],
      },
      {
        heading: '选择工作方式',
        level: 2,
        paragraphs: [
          '需要提问或普通对话时，打开 Quick Chat。希望把较大的任务推进到可评审结果时，使用 ChatGPT Work。处理软件开发和技术任务时，使用 Codex。',
          '当你需要完成以下事情时，Quick Chat 是很好的起点：',
          '需要重要且可评审的结果时，切换到 Work，并描述所需结果。示例任务、提示词和最佳实践见开始使用 Work。',
        ],
        tables: [
          ['选择', '适合的目标', '示例'],
          [
            'Chat',
            '与 ChatGPT 一起梳理问题',
            '提问、搜索 Web、头脑风暴、起草消息、比较选项',
          ],
          [
            'ChatGPT Work',
            '定义结果并获得可评审交付物',
            '创建演示文稿、分析文件、起草报告、制定项目计划',
          ],
          [
            'Codex',
            '处理软件或技术任务',
            '调试代码、运行测试、评审 PR、实现功能',
          ],
        ],
        bullets: [
          '提问、搜索 Web 或了解一个主题。',
          '用更简单的语言解释陌生概念。',
          '进行头脑风暴。',
          '起草消息、大纲或一段内容。',
          '面向不同语气或受众改写内容。',
          '总结笔记、文字或文件。',
          '比较选项或梳理决策。',
          '在开始更大的任务前明确需求。',
        ],
      },
      {
        heading: '用自然语言与 ChatGPT 交流',
        level: 3,
        paragraphs: [
          '像向一位乐于帮忙的同事说明请求一样写提示词。先说清希望实现什么，再补充会影响答案的细节和所需格式。第一条提示词只是起点，你可以通过后续消息添加上下文或继续完善结果。',
          '你可以用下面这样简单的指令继续：',
          '进一步了解提示词，或参加 AI Foundations 课程进行引导式练习。',
        ],
        bullets: [
          '“Make this shorter.”',
          '“Give me three different approaches.”',
          '“What assumptions are you making?”',
          '“Ask me questions before you continue.”',
        ],
      },
      {
        heading: '为 ChatGPT 提供合适的上下文',
        level: 2,
        paragraphs: [
          '提供与任务有关的信息、工具和指令。你不需要给出所有内容，只要加入会改变优质结果标准的上下文。',
        ],
      },
      {
        heading: '把相关工作放在一个项目中',
        level: 3,
        paragraphs: [
          '项目可以围绕主题、目标或持续工作组织 ChatGPT。当工作会长期继续，或依赖同一套上下文时，把相关对话、任务、文件和指令放在同一个项目中。进一步了解项目。',
        ],
      },
      {
        heading: '附加文件',
        level: 3,
        paragraphs: [
          '你可以上传或附加文档、演示文稿、电子表格、PDF、图片和数据导出文件。适合在以下场景使用附件：',
          'ChatGPT 创建文件后，打开预览并检查内容。无需从头开始，就可以继续要求修改。更多信息见处理文件。',
        ],
        bullets: [
          '总结或比较文件。',
          '查找规律或不一致之处。',
          '提取、清理或重新组织信息。',
          '把文件作为新交付物的来源材料。',
        ],
      },
      {
        heading: '通过 plugins 连接工具',
        level: 3,
        paragraphs: [
          'plugins 可以把 ChatGPT 连接到工作所用的工具和信息，例如 Google Drive、SharePoint、Salesforce 或 Gong。当任务依赖对话之外的信息、需要在另一个系统中执行操作，或适合复用工作流时，可以使用 plugin。',
          'plugin 是否可用取决于套餐、工作区设置和 plugin 本身。详情见 skills 与 plugins。',
        ],
      },
      {
        heading: '让结果可以直接使用',
        level: 2,
        paragraphs: [
          '把第一版结果看成可以检查、质疑和完善的草稿。即使回复很完整，也仍可能遗漏信息或出现错误，因此在使用或分享前应检查重要细节。',
          '检查工作结果：',
          '然后可以让 ChatGPT 对结果做压力测试：',
          '如果 ChatGPT 无法访问某个来源或完成部分任务，让它明确说明。清楚标出的缺口比自信的猜测更容易处理。',
          '法律、财务、医疗、安全及其他高风险决策需要适当的专业评审。ChatGPT 应用于辅助知情判断，而不是替代专业人员。',
        ],
        bullets: [
          '核对重要数字、姓名、日期、引文和事实陈述。',
          '打开生成文件，检查每个章节、标签页、幻灯片或页面。',
          '确认 ChatGPT 使用了正确且最新的来源材料。',
          '查找缺失信息和缺少依据的假设。',
          '当结果偏离目标时，提出聚焦的修改要求。',
          '“What sources did you use for this?”',
          '“Cite the source for each major claim.”',
          '“What assumptions did you make?”',
          '“What information were you unable to access?”',
          '“What would change your recommendation?”',
          '“Check this result against the original files.”',
        ],
      },
      {
        heading: '后续步骤',
        level: 2,
      },
    ],
  },
  'get-started-with-work': {
    title: '开始使用 Work',
    sections: [
      {
        heading: '认识 ChatGPT Work',
        level: 2,
        paragraphs: [
          'Work 是把真实工作委派给 ChatGPT 的一种方式。',
          '需要答案、解释、头脑风暴或简短草稿时，使用 Chat；需要 ChatGPT 完成一项结果明确的任务时，使用 Work，例如简报、演示文稿、分析、定期更新、工作流，或可以评审和使用的文件。更多信息见 Chat 与 Work 的配合方式。',
          'Work 可以使用你的文件、plugins 和已批准工具来检索信息、创建交付物、运行工作流，并完成可供评审的工作。你可以跟踪进度、回答问题、调整方向，并审批重要操作。',
          '在桌面 App 中，当相应工具可用时，Work 还可以使用本地文件、App 和浏览器。',
          '如果你一直使用 Codex 处理非编码工作，可以继续留在 Codex，也可以切换到 Work。Work 具备相同的核心能力，但交互体验更适合日常工作。',
        ],
      },
      {
        heading: '第一个任务可以尝试什么',
        level: 2,
        paragraphs: [
          '先确认 ChatGPT 中已经选择 Work，然后再挑选第一项 Work 任务。好的任务通常有清晰结果、少量来源材料，以及可以检查的输出。',
          '以下是三个常见起点：',
        ],
      },
      {
        heading: '创建演示文稿',
        level: 3,
        paragraphs: [
          '让 Work 把笔记、文档、研究资料或会议材料整理成结构清晰的演示文稿。',
        ],
        codeBlocks: [
          'Review the attached source materials and create an eight-slide presentation for [audience]. Focus on the main themes, include supporting evidence, and flag anything that needs human review. Return a draft for my review.',
        ],
      },
      {
        heading: '创建对比电子表格',
        level: 3,
        paragraphs: [
          '让 Work 把笔记、文件或研究结果整理成用于比较选项、辅助决策的电子表格。',
        ],
        codeBlocks: [
          'Create a spreadsheet comparing the options for [decision]. Use the attached notes and source materials. Include the most important criteria, score each option, flag risks or missing information, and add a summary tab with a recommendation and next steps.',
        ],
      },
      {
        heading: '设置定期更新',
        level: 3,
        paragraphs: [
          '当你希望 Work 随时间重复、监控或刷新某项工作时，使用计划任务。',
          '进一步了解计划任务。',
        ],
        codeBlocks: [
          'Every Monday morning, review new updates from @Slack and @Google Drive for [project]. Refresh the meeting agenda with decisions, blockers, owners, and open questions. Send me a draft before sharing it.',
        ],
      },
      {
        heading: '使用 Work 的最佳实践',
        level: 2,
        paragraphs: [
          '当你希望 ChatGPT 完成任务、创建文件，或持续管理工作时，使用 Work。它适合以下任务：',
          '要获得更好的结果，请告诉 Work：你需要什么结果、应使用哪些来源或 plugins、必须遵循哪些约束、怎样才算做好，以及何时应停下来等待评审或审批。',
          '与其只说：',
          '不如补充受众、来源、结构、事实核对要求与完成标准：',
          '更多信息见 Work 提示词。',
        ],
        bullets: [
          '使用多个来源、plugins、工具或步骤。',
          '如果手动完成，会花费不少时间。',
          '产生需要评审、编辑或复用的结果。',
          '需要随时间重复、监控或更新。',
        ],
        codeBlocks: [
          'Make me a presentation about our customer research.',
          'Review the attached interview notes and survey results. Create an eight-slide presentation for the product leadership meeting. Focus on the three most common customer problems, include supporting evidence, separate findings from recommendations, and flag any claims that are not well supported. Use @Google Drive for the source docs. Return a draft for my review before treating it as final.',
        ],
      },
      {
        heading: '添加 plugins，获得更多上下文和更好结果',
        level: 2,
        paragraphs: [
          'plugins 可以把 Work 连接到团队使用的工具，例如 Slack、Google Drive、SharePoint、电子邮件、日历、CRM 和项目跟踪器。',
          '进一步了解 plugins。',
        ],
        bullets: [
          '在左侧栏选择 Plugins，打开 plugin 库。',
          '安装与工作最相关的 plugins。',
          '如果要让 Work 使用指定工具，请在提示词中输入 @ 和 plugin 名称。',
        ],
      },
      {
        heading: '高效使用 ChatGPT Work',
        level: 2,
        paragraphs: [
          'Work 最适合包含多个步骤、来源或工具，或需要完整交付物的重要任务。Work 代你完成的事情越多，较长或复杂的任务可能使用越多 credits。判断价值时，应关注完成结果，而不只是提示词数量。',
          '通过设置有用的边界让任务保持聚焦，例如：“use only these sources,” “compare the top five options,” 或 “stop before sending anything.”',
          '对于快速提问、简短改写，以及只需要建议的决策，请改用 Chat。',
          '更多建议见高效使用 Work。',
        ],
      },
      {
        heading: '更多使用场景',
        level: 2,
        paragraphs: [
          '你可以继续探索适用于常见团队和任务的 ChatGPT Work 工作流，并先从一个结果明确、可以亲自评审的任务开始。',
        ],
      },
    ],
  },
  import: {
    title: '从其他智能体导入',
    sections: [
      {
        heading: '开始导入',
        level: 2,
        bullets: [
          '在 ChatGPT 桌面应用中打开 Settings > Import（设置 > 导入）。如果设置中还没有独立的 Import 页面，请打开 General（通用），找到 Import other agent setup（导入其他智能体设置）。',
          '选择 Import。',
          '选择要从哪些智能体导入，然后选择 Continue。',
          '在 Select items to import（选择要导入的内容） 页面，选择 Continue 导入全部内容，或选择 Customize 挑选具体内容项。',
          '如果选择自定义导入，请勾选要带入的内容项，然后选择 Confirm。',
          '导入完成后，打开一个已导入的项目或任务继续工作。',
        ],
      },
      {
        heading: '导入如何工作',
        level: 2,
        paragraphs: [
          '导入流程会同时检查用户级设置和现有项目。用户级设置来自你机器上的文件；项目级设置来自你选择的仓库和文件夹。',
          '导入时，ChatGPT 会：',
        ],
        bullets: [
          '检测支持的设置和最近工作。',
          '导入你选择的内容项。',
          '保持现有智能体设置不变。',
          '检查已导入的 plugins 或连接是否仍需配置。',
          '在需要完成后续设置时显示状态卡片。',
        ],
      },
      {
        heading: 'ChatGPT 可以导入什么',
        level: 2,
        tables: [
          ['导入内容', '目标位置'],
          ['指令文件', 'AGENTS.md'],
          ['settings.json', 'config.toml'],
          ['Skills', 'Skills'],
          ['Plugins', 'Plugins'],
          ['现有项目文件夹', '使用同一文件夹的项目'],
          ['最近 30 天的聊天', 'ChatGPT 任务'],
          ['MCP server 配置', 'Codex MCP 配置'],
          ['Hooks', 'Codex hooks'],
          ['Slash commands', 'Skills'],
          ['子智能体', 'Codex 智能体'],
        ],
      },
      {
        heading: '完成导入后的设置',
        level: 2,
        paragraphs: [
          '导入结束后，应用会在左下角显示状态卡片。如果某个已导入的 plugin 或连接仍需设置，卡片会明确指出。',
          '当应用提示某项需要处理时，选择 Finish（完成），然后按提示完成设置。',
        ],
      },
      {
        heading: '导入后要检查什么',
        level: 2,
        paragraphs: ['在依赖已导入设置之前，尤其要检查：'],
        bullets: [
          '已导入 skills 和智能体中的工具限制或权限。',
          '使用自定义认证、headers、环境变量或 transports 的 MCP server 设置；你可能需要重新登录。',
          '导入后行为可能不同的 hooks。',
          '仍需人工配置的 plugins、marketplaces 或其他设置。',
          '依赖参数、shell 插值或文件路径占位符的提示词模板和命令式提示词。',
        ],
      },
      {
        heading: '导入之后',
        level: 2,
        paragraphs: [
          '导入完成后，打开一个已导入的项目继续工作。如何开始下一个任务，请参阅使用 ChatGPT。',
        ],
      },
    ],
  },
  prompting: {
    title: '提示词',
    sections: [
      {
        heading: '提示词概览',
        level: 2,
        paragraphs: [
          '提示词是你告诉 ChatGPT 想知道、创建或修改什么的方式。它可以是问题、指令或目标，不需要技术语法或僵硬公式。先用自己的话描述需求，检查回复，再用后续消息逐步完善结果。',
          '简短提示词通常已经足够。对于更大或更重要的任务，可以加入真正影响结果的部分：',
          '只使用有帮助的部分即可，不需要机械填满每一项，也没有强制格式。',
        ],
        bullets: [
          '目标： ChatGPT 应完成什么？',
          '上下文： 哪些信息或来源会有帮助？',
          '输出： 需要什么格式、长度或细节层次？',
          '边界： 哪些内容必须保持不变？ChatGPT 应避免什么，或执行前先向你确认什么？',
        ],
      },
      {
        heading: '描述所需结果',
        level: 2,
        paragraphs: [
          '先描述结果，而不是一开始就列出详细步骤。当受众或格式会改变输出方式时，把它们一并写清楚。',
          '这条提示词说明了要创建什么，以及谁会阅读。只有当过程本身很重要时才明确规定过程；否则，可以让 ChatGPT 自行搜索、比较信息并调整做法。',
        ],
        codeBlocks: [
          'Turn these meeting notes into a short update for the project team.\nPut the decisions and next steps first.',
        ],
      },
      {
        heading: '添加有用上下文',
        level: 2,
        paragraphs: [
          '提供可能改变结果的信息。只加入重要来源，并说明 ChatGPT 应从每个来源中提取什么。',
        ],
        bullets: [
          '当需要总结、比较、转换内容或创建可评审文件时，附加文档、电子表格、演示文稿或 PDF。',
          '任务依赖视觉上下文时，添加截图、流程图或其他图片输入，并指出关键区域，不要只依赖图片本身。',
          '答案依赖最新信息时，让 ChatGPT 使用 Web 搜索；需要核对结果时，要求提供来源。',
          '当相关聊天或任务需要共享文件、来源或本地文件夹时，使用项目。',
        ],
      },
      {
        heading: '使用连接来源',
        level: 3,
        paragraphs: [
          '如果 ChatGPT 可以访问连接来源，请说明应去哪里查找，以及要找什么，不需要逐条规定每一次搜索。',
          '连接来源需要匹配的 plugin；是否可用可能取决于套餐和工作区设置。',
        ],
        codeBlocks: [
          "Use the latest project plan in Drive and relevant decisions and updates from\nthe project's Slack channel to prepare a status update.",
        ],
      },
      {
        heading: '使用 plugins',
        level: 3,
        paragraphs: [
          'plugins 为 ChatGPT 提供可复用指令，并连接 Google Drive、Gmail、Slack、GitHub 等工具。描述所需结果，让 ChatGPT 从可用工具中选择；如果要指定 plugin，请在输入框中输入 @。',
        ],
      },
      {
        heading: '个性化 ChatGPT',
        level: 3,
        paragraphs: [
          '希望在所有聊天和任务中生效的偏好，可以作为自定义指令放到 Settings > Personalization（设置 > 个性化）。只与当前任务有关的细节应保留在提示词中。',
        ],
      },
      {
        heading: '对话线程与持续上下文',
        level: 3,
        paragraphs: [
          '一条对话线程包含你的提示词、模型回复和工具调用。后续消息会继续使用同一线程的上下文，因此适合在同一结果上补充来源、纠正方向、添加测试或要求修改。',
          '你可以并行运行多条线程，但不要让两条线程同时修改同一批文件。编码任务需要并行时，优先使用独立工作树。',
          '所有上下文都必须放入模型的上下文窗口。长任务中，ChatGPT 或 Codex 可能通过总结相关信息、舍弃次要细节的方式压缩上下文。即使系统会自动压缩，也应主动减少无关文件、重复日志和已经失效的要求。',
        ],
      },
      {
        heading: '设置能够避免实际问题的边界',
        level: 2,
        paragraphs: [
          '边界是少量但关键的指令，用来避免产生额外工作，或执行你没有打算批准的动作。当改错一个细节会让结果无法使用，或者操作影响他人前需要评审时，就应加入边界。',
          '聚焦最重要的一两个边界，不需要控制 ChatGPT 的每一个步骤。',
        ],
        bullets: [
          '保持已批准的日期和预算数字不变。',
          '只使用提供的来源；缺少信息时明确标记，不要猜测。',
          '建议不得超出预算范围。',
          '只把消息准备成草稿，不要发送。',
        ],
      },
      {
        heading: '让结果可以直接使用',
        level: 2,
        paragraphs: [
          '告诉 ChatGPT 结果将如何使用，这会帮助它选择合适的长度、细节和组织方式。',
          '对于重要工作，应要求最终检查，例如确认每个行动项都有负责人和截止日期，或标明无法核实的信息。使用或分享前仍需由你亲自评审。',
        ],
        bullets: [
          '创建一页式摘要，让负责人可以在会前快速浏览，并把决策和下一步放在前面。',
          '把笔记整理成跟进邮件，包含决策、负责人和截止日期。',
          '创建计划支出与实际支出的清晰表格，并突出超过 10% 的差异。',
        ],
      },
      {
        heading: '通过后续消息改善结果',
        level: 2,
        paragraphs: [
          '第一条提示词不必完美。检查结果后，直接描述希望改变的部分。',
          '无需从头开始，就可以补充来源、纠正方向、要求另一种方案或改变细节层次。',
        ],
        codeBlocks: [
          'Make the opening more direct, keep the evidence, and move the recommendation\nabove the background section.',
        ],
      },
      {
        heading: 'Steering 与 queuing',
        level: 3,
        paragraphs: [
          'Codex 工作时，不必等待当前运行结束也可以发送消息：',
          '在 ChatGPT 桌面 App 中，可以通过 Settings > General > Follow-up behavior选择默认行为。排队消息会显示在输入框上方，可以编辑、排序、发送或删除。',
          '在 Codex CLI 中，Codex 工作时按 Enter 引导当前会话轮次，按 Tab 将消息排到下一轮。详情见交互快捷键。',
        ],
        bullets: [
          'Steer（引导） 把消息加入当前运行，用于改变方向、补充遗漏细节或提供新信息。',
          'Queue（排队） 把消息留给下一次运行，适合需要等当前工作结束后再处理的后续事项。',
        ],
      },
      {
        heading: '把各部分组合起来',
        level: 2,
        paragraphs: [
          '下面是一条使用连接来源准备项目更新的完整提示词：',
          '这条提示词包含目标、上下文、输出和边界，并要求最终检查，但没有规定每个执行步骤。',
        ],
        codeBlocks: [
          "Prepare a one-page project status update for Monday's leadership meeting. Use\nthe latest project plan in Drive and relevant decisions and updates from the\nproject's Slack channel.\n\nLead with the decisions leadership needs to make and the next steps. Summarize\nprogress, risks, owners, and due dates. Keep approved dates and budget figures\nunchanged. Flag any conflicting or missing information, and don't send or\npublish anything.\n\nBefore you finish, check that every next step has an owner and due date.",
        ],
      },
      {
        heading: '使用语音听写',
        level: 2,
        paragraphs: [
          '在 ChatGPT 桌面 App 的输入框可见时，按住 Ctrl+M 并开始说话。ChatGPT 会把语音转写到输入框中，你可以先检查和编辑，再发送提示词。',
        ],
      },
      {
        heading: 'Chat 提示词示例',
        level: 2,
        paragraphs: [
          'Chat 适合提问、发展想法、起草内容和处理日常决策。先说明结果，再加入真正会改变答案的细节。',
        ],
      },
      {
        heading: '理解一个主题',
        level: 3,
        codeBlocks: [
          'Explain how compound interest works for someone who has never invested.\nUse one concrete example and define any financial terms you introduce.',
        ],
      },
      {
        heading: '起草并修改文字',
        level: 3,
        codeBlocks: [
          'Draft a friendly email declining this invitation because I will be traveling.\nKeep it under 120 words and leave the door open for a future event.',
        ],
      },
      {
        heading: '比较选项',
        level: 3,
        codeBlocks: [
          'Compare these two phone plans for one person who travels internationally twice\na year. Show the important differences in a table, then recommend one and explain\nthe tradeoff.',
        ],
      },
      {
        heading: '制定实用计划',
        level: 3,
        codeBlocks: [
          'Plan five weekday dinners that take less than 30 minutes. Avoid peanuts, reuse\ningredients across meals, and finish with one consolidated shopping list.',
        ],
      },
      {
        heading: 'Work 提示词',
        level: 2,
        paragraphs: [
          'Chat 适合快速提问、简短改写、头脑风暴和轻量草稿。任务需要多个来源或工具、包含一系列步骤、会执行修改，或要产出更大的交付物时，使用 Work。',
          '为 Work 描述所需结果，提供来源材料，说明受众和评审方式，并要求 ChatGPT 规划、收集信息、创建文件和完成检查。',
        ],
      },
      {
        heading: '高效使用 Work',
        level: 3,
        paragraphs: [
          'Work 适合耗时或重复任务，以及可复用的完整文件。即使任务消耗更多 credits，只要节省时间、提高质量或支持重要决策，也可能值得。',
          '先从一个可以评审的结果开始：',
          '评审第一版结果，改进指令，并在工作流稳定后复用。',
        ],
        bullets: [
          '只加入相关来源，并在适用时限制日期范围。',
          '定义受众、输出格式和期望长度。',
          '区分必需工作与可选改进或润色。',
          '当实现方式很重要时要求先给计划；ChatGPT 发送、发布或修改他人依赖的信息前，必须获得你的批准。',
          '如果任务开始执行不再需要的工作，及时收窄范围或停止。',
        ],
      },
      {
        heading: '把来源材料转换成完整文件',
        level: 3,
        codeBlocks: [
          'Use the attached quarterly reports to create a leadership brief and a six-slide\npresentation.\n\nThe audience is the executive team. Lead with the three decisions they need to\nmake, distinguish reported facts from your analysis, cite each number to its\nsource file, and check that the brief and slides agree before you finish.',
        ],
      },
      {
        heading: '研究一项决策',
        level: 3,
        codeBlocks: [
          'Research three customer-support platforms for a 50-person company. Compare\npricing, security, integrations, and migration effort using current sources.\nDeliver a recommendation memo with links, assumptions, and the questions we\nshould answer before signing a contract.',
        ],
      },
      {
        heading: '协调一次发布',
        level: 3,
        paragraphs: [
          '对于重复工作，先在普通任务中把提示词调整稳定，再从该任务安排计划工作。如果每次计划运行都应开始一项新任务，则创建独立计划任务。',
        ],
        codeBlocks: [
          'Create a launch plan for the attached product brief. Include the timeline,\nowners, dependencies, risks, announcement draft, customer FAQ, and a checklist\nfor launch day. Flag any missing decisions before producing the final files.',
        ],
      },
      {
        heading: 'Codex 提示词',
        level: 2,
        paragraphs: [
          '需要 ChatGPT 处理代码、代码库或开发者工具时，使用 Codex。有效的 Codex 提示词应说明需要的行为，指向相关代码或复现步骤，保留重要约束，并明确如何验证改动。',
        ],
      },
      {
        heading: '计划模式与 Goal mode',
        level: 3,
        paragraphs: [
          '对于多步骤任务，希望 Codex 在改动前调查并提出方案时，在 App 输入框中使用 /plan。当 Goal mode 可用时，可以在计划明确后使用 /goal 设置持续目标。当前命令列表见 App 斜杠命令。',
          '目标文本会同时作为起始提示词和完成标准。一个好目标通常包含具体产出、必要约束，以及可衡量的测试或评审标准。',
          '目标启动后仍可继续引导 Codex，补充库、兼容性或禁止方案等约束。需要状态回顾但不想干扰主任务时，可以使用 Side conversation（侧边会话）。',
        ],
        codeBlocks: [
          'Migrate this codebase from JavaScript to TypeScript. Preserve existing behavior,\ncompile in strict mode without explicit `any` types, and make the full test suite pass.',
        ],
      },
      {
        heading: '如何阅读下面的示例',
        level: 3,
        paragraphs: [
          '每个工作流包含：',
          'Codex 会在沙箱中运行本地命令，限制文件和网络访问。任务需要越过边界时，Codex 会按审批策略处理。',
        ],
        bullets: [
          '适用场景以及更适合的 Codex 入口（IDE、CLI 或云端）。',
          '带有用户提示词示例的步骤。',
          '上下文说明：Codex 会自动看到什么，哪些内容需要主动附加。',
          '验证方式：如何检查输出。',
        ],
      },
      {
        heading: '解释代码库',
        level: 3,
        paragraphs: [
          '适合刚开始了解项目、接手服务，或需要理解协议、数据模型和请求流时使用。',
          '打开最相关的文件。',
          '选中关心的代码（可选，但建议这样做）。',
          '向 Codex 发送：',
          '验证时，让 Codex 生成可以逐项核对的步骤和文件列表：',
          '启动交互式会话：',
          '附加文件并发送：',
          '在输入框中使用 @ 插入工作区路径，或用 /mention 附加特定文件。',
        ],
        codeBlocks: [
          'Explain how the request flows through the selected code.\n\nInclude:\n- a short summary of the responsibilities of each module involved\n- what data is validated and where\n- one or two "gotchas" to watch for when changing this',
          'Summarize the request flow as a numbered list of steps. Then list the files involved.',
          'codex',
          'I need to understand the protocol used by this service. Read @foo.ts @schema.ts and explain the schema and request/response flow. Focus on required vs optional fields and backward compatibility rules.',
        ],
      },
      {
        heading: '修复 bug',
        level: 3,
        paragraphs: [
          '当错误可以在本地复现时，向 Codex 提供复现步骤、相关文件、约束和验证方法。',
          '在仓库根目录启动 Codex：',
          '提供复现步骤：',
          '你提供的复现步骤和约束通常比高层问题描述更重要；Codex 则会补充命令输出、调用点和它触发的堆栈信息。',
          '修复后要求重新执行复现步骤，并运行最小相关检查：',
          '打开可能包含 bug 的文件及其最近调用方。',
          '向 Codex 发送：',
        ],
        codeBlocks: [
          'codex',
          'Bug: Clicking "Save" on the settings screen sometimes shows "Saved" but doesn\'t persist the change.\n\nRepro:\n1) Start the app: npm run dev\n2) Go to /settings\n3) Toggle "Enable alerts"\n4) Click Save\n5) Refresh the page: the toggle resets\n\nConstraints:\n- Do not change the API shape.\n- Keep the fix minimal and add a regression test if feasible.\n\nStart by reproducing the bug locally, then propose a patch and run checks.',
          'After the fix, run lint + the smallest relevant test suite. Report the commands and results.',
          'Find the bug causing "Saved" to show without persisting changes. After proposing the fix, tell me how to verify it in the UI.',
        ],
      },
      {
        heading: '编写测试',
        level: 3,
        paragraphs: [
          '需要明确限定测试范围时，可以基于 IDE 选区或 CLI 中的函数名和路径提出请求。',
          '打开包含目标函数的文件。',
          '选中函数定义，并从命令面板选择 Add to Codex Thread。',
          '发送：',
          '启动 Codex：',
          '按函数名给出提示词：',
        ],
        codeBlocks: [
          'Write a unit test for this function. Follow conventions used in other tests.',
          'codex',
          'Add a test for the invert_list function in @transform.ts. Cover the happy path plus edge cases.',
        ],
      },
      {
        heading: '根据截图制作原型',
        level: 3,
        paragraphs: [
          '当你有设计稿、截图或 UI 参考，需要转换成可运行原型时使用。',
          '把截图保存到本地，例如 ./specs/ui.png。',
          '运行 Codex：',
          '把图片拖入终端附加到提示词。',
          '补充实现约束和交付物：',
          '截图提供视觉要求，但框架、路由、组件方式，以及 hover、校验和键盘交互等不可见行为仍应通过文字说明。',
          '验证时，让 Codex 启动开发服务器并给出准确地址：',
          '在 Codex 任务中附加图片（拖放或粘贴）。',
          '向 Codex 发送：',
        ],
        codeBlocks: [
          'codex',
          'Create a new dashboard based on this image.\n\nConstraints:\n- Use react, vite, and tailwind. Write the code in typescript.\n- Match spacing, typography, and layout as closely as possible.\n\nOutputs:\n- A new route/page that renders the UI\n- Any small components needed\n- README.md with instructions to run it locally',
          'Start the dev server and tell me the local URL/route to view the prototype.',
          'Create a new settings page. Use the attached screenshot as the target UI.\nFollow design and visual patterns from other files in this project.',
        ],
      },
      {
        heading: '通过实时更新迭代 UI',
        level: 3,
        paragraphs: [
          '需要保持“设计、微调、刷新、继续微调”的循环时，可以在另一个终端中运行开发服务器，再让 Codex 进行小而聚焦的改动。',
          '启动 Codex：',
          '在另一个终端窗口中启动开发服务器：',
          '让 Codex 提出改动方向：',
          '选定一个方向后，用小而具体的提示词迭代：',
          '继续提出聚焦请求：',
          '每轮都在浏览器中检查结果。保留喜欢的改动，撤销不需要的改动；手动撤销或修改后应告诉 Codex，避免后续覆盖。',
        ],
        codeBlocks: [
          'codex',
          'npm run dev',
          'Propose 2-3 styling improvements for the landing page.',
          'Go with option 2.\n\nChange only the header:\n- make the typography more editorial\n- increase whitespace\n- ensure it still looks good on mobile',
          'Next iteration: reduce visual noise.\nKeep the layout, but simplify colors and remove any redundant borders.',
        ],
      },
      {
        heading: '把重构委派到云端',
        level: 3,
        paragraphs: [
          '当你希望先结合本地上下文设计方案，再把长时间实现委派给并行云任务时使用。',
          '提交或暂存当前工作，保证后续可以清晰比较。',
          '让 Codex 先制定重构计划：',
          '评审并修改计划：',
          '设置 Codex 云端环境，在 IDE 中选择云端环境，然后发送：',
          '评审云端 diff，在本地运行测试，再创建 PR 或继续下一里程碑。',
          '云端任务运行在隔离环境中；除非为环境启用，否则智能体阶段没有互联网访问。详情见云端网络访问。',
        ],
        codeBlocks: [
          '$plan\n\nWe need to refactor the auth subsystem to:\n- split responsibilities (token parsing vs session loading vs permissions)\n- reduce circular imports\n- improve testability\n\nConstraints:\n- No user-visible behavior changes\n- Keep public APIs stable\n- Include a step-by-step migration plan',
          'Revise the plan to:\n- specify exactly which files move in each milestone\n- include a rollback strategy',
          'Implement Milestone 1 from the plan.',
        ],
      },
      {
        heading: '执行本地代码评审',
        level: 3,
        paragraphs: [
          '启动 Codex：',
          '运行评审命令：',
          '（可选）提供自定义关注点：',
          '根据反馈修复后，再次运行 /review 验证问题是否已经解决。',
        ],
        codeBlocks: [
          'codex',
          '/review',
          '/review Focus on edge cases and security issues',
        ],
      },
      {
        heading: '评审 GitHub PR',
        level: 3,
        paragraphs: [
          '如果希望在不把分支拉到本地的情况下获得反馈，先为仓库启用 Codex Code review（代码评审），详情见代码评审。',
          '在 GitHub 中打开 PR。',
          '留言并明确标记 Codex 与关注范围：',
          '（可选）补充更明确的指令：',
        ],
        codeBlocks: [
          '@codex review',
          '@codex review for security vulnerabilities and security concerns',
        ],
      },
      {
        heading: '更新文档',
        level: 3,
        paragraphs: [
          '明确要修改的文档文件，并在 IDE 中打开或通过 @ 提及（IDE 或 CLI）。',
          '向 Codex 说明范围和验证要求：',
          'Codex 起草后，评审文档并按需要继续迭代。',
          '验证时，应阅读渲染页面，检查标题结构、代码块、链接和示例，而不只是查看原始 Markdown diff。',
        ],
        codeBlocks: [
          'Update the "advanced features" documentation to provide authentication troubleshooting guidance. Verify that all links are valid.',
        ],
      },
    ],
  },
  personalize: {
    title: '个性化 ChatGPT',
    sections: [
      {
        heading: '选择默认性格',
        level: 2,
        paragraphs: [
          '在 Settings > Personalization（设置 > 个性化） 中，将 Friendly（友好）、Pragmatic（务实） 或 None（无） 设为默认性格。性格只会改变 ChatGPT 的沟通方式，不会改变模型能够完成的事情。',
        ],
      },
      {
        heading: '添加自定义指令',
        level: 2,
        paragraphs: [
          '把希望 ChatGPT 在不同聊天和任务中持续遵循的偏好写进自定义指令，例如你喜欢的回复风格。在 Codex 中，这些个人指令保存在全局 AGENTS.md 文件里；项目和仓库也可以提供自己的指令。',
          '了解 AGENTS.md 指令的工作方式。',
        ],
      },
      {
        heading: '通过记忆延续上下文',
        level: 2,
        paragraphs: [
          '记忆让 ChatGPT 可以把早先聊天和任务中的有用上下文带到后续工作中，例如稳定偏好、重复工作流、项目约定，以及其他原本需要反复说明的信息。',
          '记忆不等同于必须遵守的项目规范。始终需要生效的指令应放在 AGENTS.md 或已提交到仓库的项目文档中。',
        ],
      },
      {
        heading: '通过 Chronicle 添加近期屏幕上下文',
        level: 2,
        paragraphs: [
          'Chronicle 是一项可选的研究预览功能，可以用近期屏幕上下文补充记忆。它面向符合条件的 ChatGPT Pro 用户，在 macOS 桌面 App 中提供，并需要屏幕录制和辅助功能权限。',
          '启用前，请先了解 Chronicle 的隐私、安全、存储和速率限制注意事项。你可以随时暂停或关闭 Chronicle。',
        ],
      },
      {
        heading: '管理个性化设置',
        level: 2,
        paragraphs: [
          '打开 Settings（设置），即可更新默认性格、自定义指令、记忆和其他可用的个性化控制。所有日常偏好设置的概览见 ChatGPT 桌面 App 设置。',
        ],
      },
    ],
  },
  'skills-and-plugins': {
    title: 'Skills 与 Plugins',
    sections: [
      {
        heading: '使用 skills 处理重复工作',
        level: 2,
        paragraphs: [
          'skill 是一套可复用工作流，为 ChatGPT 提供与任务相关的指导。它可以固化你已经在使用的重复流程，让 ChatGPT 每次遇到同类任务时都遵循相同方法。',
          '一个 skill 可以组合以下内容：',
          '当好结果依赖一套可重复的方法时，skills 最有价值。例如，skill 可以准备每日简报、评审文档、创建演示文稿、应用团队写作规范，或每周从相同的连接工具中收集信息。',
          '使用 skills 可以提高结果一致性，把团队最佳实践直接放入工作流，并用一套标准流程替代未记录的经验知识。',
          '当请求与 skill 的用途匹配时，ChatGPT 可以自行选择该 skill；你也可以从输入框中显式选择。ChatGPT 支持用 @ 提及，Codex 则支持用 $ 提及 skills。',
        ],
        bullets: [
          '帮助 ChatGPT 判断适用时机的名称与描述。',
          '定义处理流程和预期结果的工作流指令。',
          '模板、示例、品牌规范、schema 或连接工具等配套资源。',
        ],
      },
      {
        heading: '创建 skills',
        level: 2,
        paragraphs: [
          '可以先把一项已经反复执行的任务整理成 ChatGPT 可用的简单操作手册。适合作为第一个 skill 的任务包括每周更新、活动简报、会议跟进，或其他需要稳定步骤和输出格式的工作。',
          '创建实用 skill 的基本流程如下：',
        ],
        bullets: [
          '选择一项聚焦任务。 记录你通常会提供的文件、链接或笔记，以及完成结果应达到的样子。',
          '向 ChatGPT 描述工作流。 新建聊天，以 “Build me a skill…” 开始，说明目标、执行步骤、预期格式，以及始终需要包含或避免的内容。可以附上模板或优质示例。',
          '评审并试用草稿。 检查指令，用真实请求测试 skill；如果遗漏步骤或偏离格式，就继续调整。',
          '安装并复用。 启用后，ChatGPT 可以在相关请求中使用该 skill，你也可以显式选择它。工作区设置允许时，还可以分享给团队成员。',
        ],
      },
      {
        heading: '使用 plugins 接入工具和共享工作流',
        level: 2,
        paragraphs: [
          'plugins 让可复用能力更容易安装和共享。一个 plugin 可以把 skills 与 GitHub、Google Drive 或 Slack 等服务的 app 组合起来，也可以包含提供额外工具与上下文的 MCP server。',
          '如果你想直接添加已有工作流，而不是自己创建，请浏览 plugin 目录。安装后，可以直接描述任务，也可以输入 @ 来选择具体 plugin 或其中的 skill。',
          '了解如何安装和使用 plugins。',
        ],
      },
      {
        heading: '在 skill 与 plugin 之间选择',
        level: 2,
        paragraphs: [
          '需要针对单一任务提供可复用指令时，使用 skill；需要一个可安装的组合包，把指令与连接服务或其他工具放在一起时，使用 plugin。',
          '你也可以用 Record & Replay 演示工作流，并把录制过程转换成可复用 skill。要打包并分发自己的组合包，请参见创建 plugins。',
          '如果 plugin 需要连接服务或公开 MCP 工具，请参见创建 app。准备好提交公开评审后，请参见提交 plugins。更多可复用工作流示例见 OpenAI Academy 中的 skills。',
        ],
      },
    ],
  },
  'permission-modes': {
    title: '权限',
    sections: [
      {
        heading: '权限模式',
        level: 2,
        paragraphs: [
          '权限决定 ChatGPT（桌面 App）和 Codex（CLI 或 IDE）如何处理编辑文件、运行命令、使用互联网等本地操作。你选择的模式会划定 ChatGPT 可以自行完成的范围，以及哪些动作需要评审。',
          '大多数工作建议从 Ask for approval（请求审批） 开始。ChatGPT 可以在当前工作区内推进任务，需要越过这个边界时会暂停并请求确认。',
          '你可以在权限菜单中选择不同模式，了解每种模式的具体行为。',
        ],
      },
      {
        heading: '◉ Ask for approval',
        level: 3,
        paragraphs: [
          'Codex can read and edit files in the current workspace and run routine local commands. It asks before using the internet or going beyond the workspace boundary.',
        ],
      },
      {
        heading: '启用权限模式',
        level: 2,
        paragraphs: [
          '第一次使用 ChatGPT 桌面 App 时，需要先在应用设置中启用所需模式。',
          'Ask for approval 始终可用。要把 Approve for me（替我审批）（设置中称为 Auto-review）或 Full access（完全访问） 加入权限菜单，请打开 ChatGPT 桌面 App 的 Settings > General（设置 > 通用），然后在 Permissions（权限） 下启用相应模式。',
          '启用模式只会让它出现在菜单中，不会自动选中，也不会改变现有对话的权限。',
          '可用模式可能受本地配置和组织要求影响；不允许使用的模式会显示为禁用状态。',
        ],
      },
      {
        heading: '权限如何工作',
        level: 2,
        paragraphs: [
          '下面两项控制会共同生效：',
          '改变由谁评审请求不会扩大沙箱边界。例如，Approve for me 与 Ask for approval 使用同一工作区边界，只是将越界请求发送给自动评审。',
          '在 ChatGPT 桌面 App 或 IDE 扩展中，可以通过输入框下方的权限控件切换模式。在 CLI 中输入 /permissions。',
          '技术细节请参见沙箱、自动评审和权限配置档案。',
        ],
        bullets: [
          '沙箱定义 ChatGPT 可以访问哪些文件和网络资源。',
          '审批决定 ChatGPT 何时必须在操作前暂停，或把请求交给自动评审。',
        ],
      },
    ],
  },
  'whats-new': {
    title: '最新动态',
    sections: [
      {
        heading: '2026 年 7 月 27–31 日',
        level: 2,
      },
      {
        heading: '以更低价格使用 GPT-5.6 Terra 和 Luna',
        level: 3,
        paragraphs: [
          'GPT-5.6 Terra 现已降价 20%，GPT-5.6 Luna 降价 80%，输入、缓存输入和输出费率同比例下降。更新的用量上限与费率让 Terra 更适合日常工作，Luna 则更适用于专注编码和高频任务。',
        ],
      },
      {
        heading: '在浏览器和打开的标签页中查找有用上下文',
        level: 3,
        paragraphs: [
          '在 ChatGPT 桌面应用中，内置浏览器可从地址栏查找浏览历史中的页面，或直接搜索 Google。当任务需要更早的上下文时，ChatGPT 也可以搜索你的浏览历史。',
          'Chrome extension 支持在对话中提及已打开的标签页、把选中的页面文本带入侧边对话、就 YouTube 视频提问，或从页面右键菜单选择 Ask ChatGPT。在 ChatGPT 将浏览历史信息纳入任务前，需要你先评审并批准相应请求。',
        ],
      },
      {
        heading: '跨仓库评审改动',
        level: 3,
        paragraphs: [
          '当本地项目包含多个文件夹时，桌面应用会显示每个仓库及其改动的行数。选择 Review 即可在同一处查看它们的 diff，而无需在多个评审视图之间切换。',
        ],
        codeBlocks: [
          'Review the changes across every repository in this project, identify integration risks, and summarize the fixes needed before I open a pull request.',
        ],
      },
      {
        heading: '在对话中优化生成的图片',
        level: 3,
        paragraphs: [
          '在展开查看器中打开生成的图片后，可在 Focused view（聚焦视图）和 Canvas view（画布视图）之间切换。你可以跨图片添加评论、选择要保留的版本，并在不离开对话的情况下提出针对性修改。参阅图片生成。',
        ],
      },
      {
        heading: '找到需要你关注的对话',
        level: 3,
        paragraphs: [
          '桌面应用新增的 Activity view（活动视图）汇集了你最近参与的对话以及需要关注的工作。点击侧边栏的铃铛图标即可打开该视图。',
          '阅读 7 月 30 日桌面端发布说明。',
        ],
      },
      {
        heading: '用 Sign in with ChatGPT 接入合作伙伴工具',
        level: 3,
        paragraphs: [
          'Sign in with ChatGPT 正在以 beta 形式向受支持的 plugins 和合作站点推出，首批包括 Airtable、GitLab、HubSpot、Notion、Supabase 和 Vercel。你可以用更少的步骤创建或关联合作伙伴账号，然后在 ChatGPT 或 Codex 中开始使用该服务。',
          '合作伙伴在你可用时只能获取你的姓名、邮箱地址和头像。每个 plugin 申请的访问权限仍需单独评审与批准。参阅7 月 29 日登录公告。',
        ],
      },
      {
        heading: '在专属学术研究工作区协作',
        level: 3,
        paragraphs: [
          'ChatGPT for Academic Researchers（面向学术研究者）为符合条件的教职员工和博士后研究人员提供 12 个月免费使用的专属 ChatGPT 工作区。获批团队最多可包含来自同一机构的 5 名经过验证的研究人员，并获得商业数据保护和 ChatGPT Pro 级别的用量上限。参与者可在 ChatGPT、ChatGPT Work 和 Codex 中使用 GPT-5.6，用于研究和编码工作流。',
          '该计划仅覆盖 ChatGPT 使用权限，不含 OpenAI API 额度。申请资格需要通过机构验证并提交符合要求的研究论文。',
        ],
      },
      {
        heading: '在 iOS 上更可靠地继续 Codex 任务',
        level: 3,
        paragraphs: [
          'ChatGPT for iOS 1.2026.202 在你回到应用或用 Face ID 解锁设备时能更可靠地重新连接任务。语音对话使用你选择的 ChatGPT 语音并显示用量上限提醒，输入框现在也能与桌面端一致地推荐已安装的 plugin 及其 skills。',
          '本次发布还改进了目标的暂停与恢复控制、内联表格与视觉主题、大型工作区 diff、选中文本引用，以及模型恢复。参阅7 月 27 日 iOS 发布说明。',
        ],
      },
      {
        heading: '对比安全扫描并管理发现项',
        level: 3,
        paragraphs: [
          '托管版 Codex Security plugin 的 0.1.14 和 0.1.15 版本加入扫描对比、误报反馈、按范围的 SECURITY.md 策略，以及更清晰的仓库和发现项历史。你可以选择要在 Linear 或 GitHub Issues 中跟踪的发现项，Codex 会在你批准前评审建议的操作。',
          '使用现有的 Codex Security workbench 即可在桌面应用中评审已保存的扫描、发现项、仓库历史和修复情况。托管 plugin 目录提供 0.1.15 版本，公共 CLI plugin 市场提供 0.1.11 版本。在使用新功能前，请查阅 Codex Security plugin 更新日志。',
        ],
      },
      {
        heading: '从终端、CI 或 TypeScript 运行安全扫描',
        level: 3,
        paragraphs: [
          '公共的 @openai/codex-security CLI 和 TypeScript SDK 已更新到 0.1.5，其版本号与 Codex Security plugin 相互独立。你可以用该包从 CLI 运行扫描、在 CI 中评审 pull request 改动并上传 SARIF 结果，或针对 GitHub 仓库和固定的 CSV 清单运行可恢复的批量扫描。',
          'Codex Security TypeScript SDK 还支持把扫描、进度上报、成本控制和取消能力集成到你自己的工具中。该包是公开的，但运行扫描仍需 Codex Security 权限。某些全仓库扫描还需要 Cyber 的 Trusted Access。',
        ],
      },
      {
        heading: '整理会话并扩展 Codex CLI 0.146.0',
        level: 3,
        paragraphs: [
          'Codex CLI 0.146.0 允许你用 /new release prep 或 /clear bug bash 为新对话命名，固定重要会话，并在不关闭的情况下切换侧边对话。它还加入了临时对话分叉、面向兼容自定义模型提供商的独立 Web 搜索、执行器提供的 skills，以及对 Agent Plugins 清单、工作区 plugin 发布和其他 plugin 市场的支持。',
          '对于自定义客户端，app server 可以筛选固定会话、创建内存分叉、检查已安装的 connector 状态，以及读取 connector 元数据。实验性的 WebSocket 支持还能把 app-server 连接到远程 Code Mode 主机。在暴露远程连接前，请先评审 app-server 的安全要求。本次发布还改进了代理支持、MCP 重连、终端响应速度和 Windows 沙箱稳定性。',
        ],
      },
      {
        heading: '在托管 Codex 工作中使用 GPT-5.6 Sol',
        level: 3,
        paragraphs: [
          'GPT-5.6 Sol 现已驱动面向合格客户的 Codex 云端代码评审和质量保障。Sol 是面向复杂编码、研究、Computer Use 和安全工作的旗舰 GPT-5.6 模型。Codex 云端会自动选择模型；Terra 和 Luna 在受支持的本地和 Web 端仍可使用。',
        ],
      },
      {
        heading: '为 GPT-5.4 模型退役做好准备',
        level: 3,
        paragraphs: [
          '8 月 31 日，GPT-5.4 和 GPT-5.4 mini 将对使用 ChatGPT 登录的用户从 Codex 退役。请把工作区默认设置、保存的模型设置、受管理配置、自定义 agents 和定时任务中的 gpt-5.4 替换为 gpt-5.6-terra，把 gpt-5.4-mini 替换为 gpt-5.6-luna。',
          'OpenAI API 和使用 API key 认证的 Codex 会话不受影响。请在截止日期前查阅已弃用的 Codex 模型和工作区模型可用性说明。',
        ],
      },
      {
        heading: '2026 年 7 月 20–24 日',
        level: 2,
      },
      {
        heading: '用 ChatGPT Voice 边说边推进工作',
        level: 3,
        paragraphs: [
          '由 GPT-Live 驱动的 ChatGPT Voice 让你在 ChatGPT 桌面应用的 Chat、Work 和 Codex 中用语音推进工作并协调任务。在语音模式下开启新的对话或任务后，可以让 ChatGPT 在其他会话中启动、检查或引导工作。',
          '在 macOS 上，当 Screen context（屏幕上下文）开启时，说一句“Take a look at this”即可分享最前方窗口的 appshot。',
          'Voice 面向 Plus、Pro、Business、Edu 和 Enterprise 套餐，可在桌面应用及 iOS 版 Remote 中使用。',
        ],
      },
      {
        heading: '在一个本地项目中处理多个文件夹',
        level: 3,
        paragraphs: [
          'ChatGPT 桌面应用中的本地项目现在可以包含多个相关文件夹。你可以为新的对话、Git 操作，以及自动发现 AGENTS.md、skills 和 config.toml 选择一个主文件夹；次要文件夹则继续用于文件搜索、读取和编辑。',
          '打开 Edit project（编辑项目）即可添加文件夹并选择主文件夹。',
          '阅读 7 月 23 日发布说明。',
        ],
      },
      {
        heading: '2026 年 7 月 13–17 日',
        level: 2,
      },
      {
        heading: '在桌面端统一管理 Work 对话与 Projects',
        level: 3,
        paragraphs: [
          'ChatGPT 桌面应用现在把 Chat 和 Work 对话统一收纳在 ChatGPT 视图中。云端 Work 对话会在网页、移动端和桌面端之间同步；本地 Work 对话则保留在你的电脑上。ChatGPT Projects 已在桌面端可用。Codex 仍保留独立视图和面向开发工作流的独立历史。',
          '参阅在桌面端比较 ChatGPT Work 与 Codex，选择适合你任务的视图。',
        ],
        codeBlocks: [
          'Open the Launch project, review its files and recent conversations, and continue the launch plan from the latest Work conversation.',
        ],
      },
      {
        heading: '用 Codex Micro 掌控并行的 Codex 工作',
        level: 3,
        paragraphs: [
          '7 月 15 日，OpenAI 与 Work Louder 联合发布了 Codex Micro——一款面向 ChatGPT 桌面应用中 Codex 的限量实体控制面板。它的 Agent Keys 可显示最多 6 个对话的状态并在其间切换；可自定义的 Command Keys、模拟摇杆和旋钮能够触发常用操作或 skills、启动按住说话，并调整推理强度，而无需离开键盘。',
        ],
      },
      {
        heading: '通过 Amazon Bedrock 使用 GPT-5.6',
        level: 3,
        paragraphs: [
          'GPT-5.6 Sol、Terra 和 Luna 已通过 Amazon Bedrock 正式可用。本地 ChatGPT Work 和 Codex 端可以使用内置的 amazon-bedrock provider，配合 Bedrock API key 或 AWS SDK 凭证链。这包括 ChatGPT 桌面应用中的 Work 和 Codex、Codex CLI、IDE 扩展和 Codex SDK。',
        ],
      },
      {
        heading: '在 iOS 上查看 Codex 任务的可视化',
        level: 3,
        paragraphs: [
          'ChatGPT for iOS 1.2026.188 为 Codex 任务加入了内联可视化，并改进了从对话中创建和管理任务的方式，包括可靠地链接到新建任务。参阅7 月 13 日 iOS 发布说明。',
        ],
      },
      {
        heading: '2026 年 7 月 6–10 日',
        level: 2,
      },
      {
        heading: '使用 ChatGPT Work 完成更有挑战性的工作',
        level: 3,
        paragraphs: [
          'ChatGPT Work 是 ChatGPT 中的智能体，可以从文件和 plugins 收集上下文、跨工作流采取行动，并创建可评审的文档、演示文稿、电子表格、Sites 和其他成品。它由 GPT-5.6 驱动，可以把目标拆成步骤并连续工作数小时；期间你可以跟踪进度、回答问题、调整方向并批准重要操作。',
          '定时任务可以在你离开时继续推进工作，支持单次运行、按计划运行、事件触发或持续监控变化。',
        ],
        codeBlocks: [
          'Create a launch brief from the attached research and campaign template. Show me the plan and flag missing information before you build the final document, then adapt the approved brief into assets for three markets.',
        ],
      },
      {
        heading: '选择合适的 GPT-5.6 模型',
        level: 3,
        paragraphs: [
          'GPT-5.6 系列为 ChatGPT Work、ChatGPT 桌面应用、Codex CLI 和 Codex IDE 扩展提供三款推荐模型。Sol 是复杂编码、Computer Use、研究和安全工作的旗舰模型；Terra 在能力与成本之间取得平衡，适合日常工作；Luna 速度最快、成本最低。默认 Power 设置使用中等推理强度的 Sol。',
        ],
      },
      {
        heading: '在 ChatGPT 桌面应用中使用 Codex',
        level: 3,
        paragraphs: [
          '7 月 9 日，Codex App 合并到 macOS 和 Windows 的新版 ChatGPT 桌面应用。Codex 在 Chat 和 Work 旁继续提供专门的编码体验，其中包括在 diff 中直接编辑、在侧边面板评审 pull request、由 GPT-5.6 驱动的更快 Computer Use，以及多仓库项目。',
          '现有 Codex App 用户可以照常更新。你可以把 Codex 设为默认视图、使用 Codex logo 作为应用图标，并从 ChatGPT 移动应用访问桌面端 Codex 项目。新版桌面应用面向全球所有 ChatGPT 套餐提供，包括 Free。',
        ],
      },
      {
        heading: '2026 年 6 月 15–19 日',
        level: 2,
      },
      {
        heading: '把演示过的工作流变成可复用 skills',
        level: 3,
        paragraphs: [
          'Record & Replay 允许你在 macOS 上向 Codex 演示工作流，并把演示转换成可复用 skill。对于容易演示但不易描述的重复任务，可以先生成 skill，再继续完善并使用新输入重放。首批可用范围不包括欧洲经济区、英国和瑞士，并且需要 Computer Use。',
        ],
      },
      {
        heading: '在另一台主机上继续任务',
        level: 3,
        paragraphs: [
          '任务交接可以在本地电脑和已连接远程主机之间移动任务及其 Git 状态。Codex 可以在目标端创建或复用工作树、传输任务，并从对应项目继续工作。',
          '同一桌面版本还为定时运行历史加入批量操作，可以把全部运行标为已读，或一起归档符合条件的运行。',
        ],
      },
      {
        heading: '从 iOS 浏览和评审工作区',
        level: 3,
        paragraphs: [
          'ChatGPT 移动应用的 Remote 在 iOS 上加入工作区文件浏览器、新任务目录选择器、diff 展开与折叠控件，以及按任务或跨任务选择 MCP 审批的能力。',
          'Computer Use、Chrome extension、Memories 和 Chronicle 也开始向欧洲经济区、英国和瑞士推出。Memories 在这些地区仍默认关闭；Chronicle 是面向 macOS ChatGPT Pro 订阅者的可选研究预览。',
          '参阅 6 月 15 日 iOS、6 月 16 日可用性和6 月 18 日 App 发布说明。',
        ],
      },
      {
        heading: '2026 年 6 月 8–12 日',
        level: 2,
      },
      {
        heading: '使用 Browser Developer mode 调试 Web 应用',
        level: 3,
        paragraphs: [
          'Developer mode 让 Codex 以受控方式访问 Chrome 和内置浏览器的 Chrome DevTools Protocol 能力。分析或调试应用时，Codex 可以检查网络流量、控制台输出、运行时错误和页面状态。在 Settings > Browser > Developer mode（设置 > 浏览器 > 开发者模式） 中启用 Enable full CDP access。Codex 在网站上使用该权限前会请求明确批准。',
          'CDP 与 DOM 快照优化减少了浏览器往返次数，Browser Use 速度最高可提升一倍。',
        ],
        codeBlocks: [
          'Use @Browser to reproduce the slow checkout. Inspect the network timing and console errors, fix the cause, and verify the result.',
        ],
      },
      {
        heading: '把现有设置带入 Codex',
        level: 3,
        paragraphs: [
          '新的迁移流程可以在初始设置期间导入其他编码智能体支持的设置。Codex App 还加入 /init，用于创建项目指令，并改进了 plugin 管理、浏览器诊断和已完成任务摘要。',
        ],
      },
      {
        heading: '从 iOS 设置 Codex 任务',
        level: 3,
        paragraphs: [
          'iOS 版 Remote 现在可以选择分支、创建工作树、运行环境设置脚本、管理目标并添加行内评审评论。',
          '参阅 6 月 9 日 App、6 月 9 日 iOS和6 月 11 日 App 发布说明。',
        ],
      },
      {
        heading: '2026 年 6 月 1–5 日',
        level: 2,
      },
      {
        heading: '使用 Sites 构建和部署网站',
        level: 3,
        paragraphs: [
          'Sites 让 ChatGPT 创建、保存、部署和检查由 OpenAI 托管的网站、仪表盘、内部工具、Web 应用和游戏。ChatGPT Web 和桌面端都有独立 Sites 入口，可以返回项目并管理托管环境变量和机密信息，无需自行组装部署栈。',
        ],
        codeBlocks: [
          'Build a responsive launch dashboard from this project with Sites. Validate it at mobile and desktop sizes, then save a version for review. Do not deploy it until I approve the saved version.',
        ],
      },
      {
        heading: '通过 Amazon Bedrock 使用 Codex',
        level: 3,
        paragraphs: [
          '你可以通过 Amazon Bedrock 使用 Codex，在本地工作流中使用 AWS 管理的认证、账户控制和计费。iOS 版 Remote 还增加可选应用锁、后续行为设置、diff 自动换行，以及到 Windows 设备的 SSH 连接。桌面应用则加入终端位置控制和配置档案视图中的活动洞察。',
          '阅读 2026 年 6 月全部发布说明。',
        ],
      },
      {
        heading: '2026 年 5 月 25–29 日',
        level: 2,
      },
      {
        heading: '使用 Windows 应用并远程控制 Codex',
        level: 3,
        paragraphs: [
          'Computer Use 新增查看、点击和输入 Windows 桌面应用的能力。开始前需要安装 Computer Use plugin。在 Windows 上，Codex 使用活动桌面，并在任务运行期间接管前台。远程连接也支持 Windows：在 ChatGPT 移动应用中打开 Remote，可以在 Windows 设备上启动工作；也可以连接运行 ChatGPT 桌面应用的 Mac，在其他位置查看进度。',
          'iOS 版 Remote 还加入 Spotlight 与 Shortcuts 入口、归档任务浏览、/side，以及保存或复制渲染图片的选项。桌面应用加入本地项目与工作树之间的任务协调、按内容和分支名搜索旧任务，以及后台子智能体的一致视觉标识。',
          '参阅 5 月 25 日 iOS和5 月 29 日 App 发布说明。',
        ],
        codeBlocks: [
          'Use @Computer to open the Windows app, reproduce the export failure, save a diagnostic file, and summarize the exact steps that trigger the problem.',
        ],
      },
      {
        heading: '2026 年 5 月 18–22 日',
        level: 2,
      },
      {
        heading: '使用 Appshots 从任意 Mac 应用向 Codex 提供上下文',
        level: 3,
        paragraphs: [
          '同时按下左右 Command 键时，Appshots 会把最前方应用窗口的截图和可用文本发送给 Codex。Codex 可以直接获得设计工具、仪表盘、文档和其他应用中的工作上下文，无需你复制、粘贴或用文字描述屏幕内容。',
        ],
        codeBlocks: [
          'Use this appshot as the visual reference. Match the selected screen in the app, then open a preview and compare spacing, typography, and color.',
        ],
      },
      {
        heading: '持续推进长期目标',
        level: 3,
        paragraphs: [
          'Goal mode 已结束实验状态，可在 Codex App、IDE 扩展和 CLI 中用于耗时数小时或数天的目标。Locked use 允许 Mac 锁定后继续执行已批准的 Computer Use 工作，包括通过 ChatGPT 移动应用中的 Remote 继续。ChatGPT Business 工作区还可以向工作区成员共享可复用的 plugin 组合包。',
          '阅读 5 月 21 日发布说明。',
        ],
      },
      {
        heading: '2026 年 5 月 11–15 日',
        level: 2,
      },
      {
        heading: '从移动端继续桌面工作',
        level: 3,
        paragraphs: [
          'ChatGPT 移动应用中的 Remote 可以连接到运行 ChatGPT 桌面应用的 Mac。由于工作仍在连接的主机上运行，从手机继续时，项目、文件、凭据、plugins、skills 和配置仍然可用。参阅远程连接，设置主机并从另一台设备继续工作。',
        ],
      },
      {
        heading: '自动化可信工作流',
        level: 3,
        paragraphs: [
          'Hooks 已正式可用，可以在智能体生命周期的关键节点运行自定义命令。ChatGPT Enterprise 管理员还可以为可信脚本、调度器和私有 CI 运行器启用 Codex access tokens。企业指南也扩展了 Codex 的受管理设置与控制说明。',
          '阅读 5 月 14 日发布说明。',
        ],
      },
      {
        heading: '2026 年 5 月 4–8 日',
        level: 2,
      },
      {
        heading: '通过 Chrome extension 跨标签页工作',
        level: 3,
        paragraphs: [
          'Chrome extension 可以在后台并行处理多个标签页，而不接管浏览器。你可以控制 Codex 能访问哪些网站，因此可以在一个任务中组合跨 Web 应用的研究、数据录入和验证。',
          'Codex App 还加入听写清理，以及用于姓名、文件路径和代码符号的自定义词典。ChatGPT Enterprise 工作区所有者可以允许成员创建 Codex access tokens，用于可信、非交互式本地工作流。',
          '参阅 5 月 5 日 App、5 月 5 日 access token和 Codex for Chrome发布说明。',
        ],
        codeBlocks: [
          'Compare the open product pages, collect the plan limits in a table, cite each source tab, and flag any differences that need a manual check.',
        ],
      },
      {
        heading: '2026 年 4 月 20–24 日',
        level: 2,
      },
      {
        heading: '使用 GPT-5.5 处理复杂工作',
        level: 3,
        paragraphs: [
          'GPT-5.5 进入 Codex，成为多数任务的推荐模型，擅长实现、调试、测试、Computer Use、研究和知识工作成品交付。',
        ],
      },
      {
        heading: '让 Codex 操作浏览器并评审审批请求',
        level: 3,
        paragraphs: [
          '内置浏览器中的 Computer Use 允许 Codex 点击本地开发服务器和基于文件的页面，以复现问题并验证修复。符合条件的审批请求也可以经过自动审批评审，在操作执行前显示评审状态和风险。',
          '阅读 4 月 23 日发布说明。',
        ],
        codeBlocks: [
          'Use @Browser to open the local app, reproduce the checkout failure, fix it, and verify the flow end to end.',
        ],
      },
      {
        heading: '2026 年 4 月 13–17 日',
        level: 2,
      },
      {
        heading: '在一个位置预览并操作工作成果',
        level: 3,
        paragraphs: [
          '内置浏览器加入实时预览和页面评论；Computer Use 则让 Codex 查看和操作 macOS 应用。两者结合后，视觉实现和端到端验证可以与代码改动在同一任务中完成。',
        ],
      },
      {
        heading: '从任务开始并持续推进',
        level: 3,
        paragraphs: [
          '独立任务允许你不选择项目文件夹就开始工作。同一版本还加入从任务安排定时工作、pull request 上下文、更丰富的文件预览，以及支持跨任务工作的 Memories。',
          '阅读 4 月 16 日 Codex App 发布说明。',
        ],
      },
      {
        heading: '2026 年 4 月 6–10 日',
        level: 2,
      },
      {
        heading: '在应用中评审并交付 pull request',
        level: 3,
        paragraphs: [
          '评审体验加入可折叠行内评论、Inline（行内） 和 Detached（分离） 评审模式，以及更清晰的 Git 和来源上下文。随后，pull request 活动、评论和推送选项也进入应用，并与工作区文件标签页并列，因此无需切换工具即可检查改动并回应反馈。',
          '参阅 4 月 9 日和4 月 10 日 Codex App 发布说明，或了解如何在应用中评审改动。',
        ],
      },
      {
        heading: '2026 年 3 月 23–27 日',
        level: 2,
      },
      {
        heading: '把工作流打包为 plugins',
        level: 3,
        paragraphs: [
          'Plugins 作为由 skills、连接器和 MCP server 组成的可安装组合包推出，使完整工作流更易发现、安装和共享；重新设计的 plugin 与 skill 页面也让内容和状态更清晰。同一周还加入了旧任务搜索。',
          '参阅任务搜索、plugins 发布和 Codex App 发布说明。',
        ],
      },
      {
        heading: '2026 年 3 月 16–20 日',
        level: 2,
      },
      {
        heading: '从更早的位置分叉任务，并在输入框中选择工具',
        level: 3,
        paragraphs: [
          '你可以从更早的消息分叉出新任务，在不丢失原路径的情况下尝试新方案。起草消息时也能使用模型和推理命令；已启用的 skills 会出现在 @ 菜单中；GPT-5.4 mini 则为较轻量任务和子智能体提供更快选项。',
          '参阅 GPT-5.4 mini、对话控制和 skill 菜单 发布说明。',
        ],
      },
      {
        heading: '2026 年 3 月 9–13 日',
        level: 2,
      },
      {
        heading: '在合适环境中安排工作',
        level: 3,
        paragraphs: [
          '定时任务可以在本地或工作树中运行，并显式选择模型和推理强度。可复用模板让常见任务更易配置，自定义主题则让工作区更符合个人偏好。',
        ],
      },
      {
        heading: '让 Codex 检查终端输出',
        level: 3,
        paragraphs: [
          'Codex 还可以读取当前任务的集成终端，直接检查运行中的开发服务器或构建输出，不再需要你手动粘贴。',
          '参阅 3 月 11 日和3 月 12 日 Codex App 发布说明。',
        ],
        codeBlocks: [
          'Every weekday, inspect changes from the last 24 hours, find one likely regression, fix it in a worktree, run the smallest relevant tests, and report the evidence.',
        ],
      },
      {
        heading: '2026 年 3 月 2–6 日',
        level: 2,
      },
      {
        heading: '在 Windows 上原生运行 Codex',
        level: 3,
        paragraphs: [
          'Codex App 登陆 Windows，支持原生 PowerShell 和沙箱，并提供工作树、定时任务和 skills。偏好 Linux 环境的开发者仍可使用 WSL。',
        ],
      },
      {
        heading: '在 Local（本地）与 Worktree（工作树）之间移动任务',
        level: 3,
        paragraphs: [
          '本地与工作树之间的交接允许你移动活跃任务并保留其上下文。同一周，GPT-5.4 也进入 Codex，用于编码、Computer Use 和更长上下文的工作流。',
          '参阅 Windows 发布、工作树交接和 GPT-5.4 发布说明。',
        ],
      },
      {
        heading: '2026 年 2 月 9–13 日',
        level: 2,
      },
      {
        heading: '实时迭代并分叉出新方案',
        level: 3,
        paragraphs: [
          'GPT-5.3-Codex-Spark 进入研究预览，为实时编码迭代提供近乎即时的响应。应用还加入对话分叉和悬浮置顶任务窗口，因此可以探索另一种方案，或让 Codex 始终停留在编辑器或浏览器旁。',
          '参阅 Spark和 Codex App 发布说明，也可以查看当前模型指南。',
        ],
      },
      {
        heading: '2026 年 2 月 2–6 日',
        level: 2,
      },
      {
        heading: 'Codex App 在 macOS 上发布',
        level: 3,
        paragraphs: [
          'Codex App 作为桌面工作区发布，支持并行项目对话、内置 Git 评审、工作树、skills、定时任务和语音听写。这些能力现在位于 ChatGPT 桌面应用的 Codex 中。',
        ],
      },
      {
        heading: '引导进行中的工作并添加文件',
        level: 3,
        paragraphs: [
          '会话轮次中途引导（mid-turn steering）允许你在不停止当前回复的情况下调整 Codex 方向，文件附件也从图片扩展到更多类型。这些模式构成了引导与排队的基础，使后续消息能够携带 Codex 所需上下文。',
          '参阅 Codex App 发布说明和 2 月 5 日 App 发布说明。',
        ],
      },
    ],
  },
  models: {
    title: '模型',
    sections: [
      {
        heading: '选择模型',
        level: 2,
        paragraphs: [
          '在 ChatGPT 桌面 App 中，可以通过输入框下方的模型与推理控件选择可用模型，并调整推理强度。',
          '更高的推理强度可能提升复杂任务的结果，但会花费更长时间并消耗更多 token。建议先使用默认强度，只有当任务需要更深入的规划或分析时再提高。',
          'Ultra 模式并非单智能体运行，而是使用子智能体加速复杂工作，适合能够拆分成多个子任务的大型任务。',
        ],
      },
      {
        heading: 'gpt-5.6-sol 推理强度',
        level: 3,
        paragraphs: ['在输入框下方选择模型和推理强度。'],
        bullets: [
          '1.低 · 快速响应',
          '2.中 · 日常任务',
          '3.高 · 复杂问题',
          '4.极高 · 深度分析',
          '5.Ultra · 自动委派任务',
        ],
      },
      {
        heading: '推荐模型',
        level: 2,
      },
      {
        heading: '5.6 Sol',
        level: 3,
        paragraphs: [
          'GPT-5.6 旗舰模型，在复杂编码、计算机操作、研究和网络安全方面拥有最强能力。',
        ],
      },
      {
        heading: '5.6 Terra',
        level: 3,
        paragraphs: [
          '均衡型 GPT-5.6 模型，以更低成本处理日常编码、分析与知识工作。',
        ],
      },
      {
        heading: '5.6 Luna',
        level: 3,
        paragraphs: [
          '快速且经济的 GPT-5.6 模型，以更低成本提供可靠的日常能力。',
        ],
      },
      {
        heading: 'GPT-5.5',
        level: 3,
        paragraphs: [
          '上一代前沿模型，适合复杂编码、计算机操作、知识工作和研究流程。',
        ],
      },
      {
        heading: '5.3 Codex Spark',
        level: 3,
        paragraphs: ['仅支持文本的研究预览模型，面向近乎即时的实时编码迭代。'],
      },
      {
        heading: '如何选择 Sol、Terra 和 Luna',
        level: 2,
        paragraphs: [
          'Codex 提供三种 GPT-5.6 模型：Sol 注重细节和完成度，Terra 是日常工作的主力模型，Luna 适合边界清晰、可重复的工作。如果不确定从哪里开始，先选择 Sol。',
        ],
      },
      {
        heading: '各模型的优势场景',
        level: 3,
        bullets: [
          'Sol：复杂、开放式工作。 适合模糊、困难或价值较高，需要更多分析、判断或打磨的任务，例如复杂代码修改、深度研究或高完成度文档。对于范围较窄的任务，应明确完成标准，让工作保持聚焦。',
          'Terra：务实的通用模型。 适合需要较强推理和工具使用能力、但不需要 Sol 全部深度的日常工作。过去交给 GPT-5.5 的任务，可以优先从 Terra 开始。',
          'Luna：清晰、可重复的任务。 适合已经明确优质结果标准的具体、高吞吐任务，例如提取、分类、转换和结构化摘要。',
        ],
      },
      {
        heading: '选择推理强度',
        level: 3,
        paragraphs: [
          '优先使用能够产出所需结果的最低推理强度；只有任务需要更多规划、分析或检查时才提高。',
          'GPT-5.5 与 GPT-5.6 的推理强度之间没有精确的一一映射。可以先用较低设置运行一项熟悉任务，再根据结果调整。',
        ],
        bullets: [
          'Codex App、ChatGPT Work 和 IDE 扩展中的 Light，或 CLI 中的 Low，适合快速且范围明确的任务。',
          'Medium 在速度和深度之间取得平衡，适合需要一定规划的任务。',
          'High 与 Extra High 适合包含多个步骤、来源或权衡的困难任务。',
        ],
      },
      {
        heading: '何时使用 Max 或 Ultra',
        level: 3,
        paragraphs: [
          'Max 会给所选模型更多时间，对单项任务进行深入推理。它适合最困难、且深度比速度或用量更重要的问题。如果选项中没有 Max，需要先在 App 设置中启用。',
          'Ultra 使用子智能体并行处理复杂任务的不同部分。只有当工作可以拆成有意义的多个部分时才应使用；大多数任务并不需要 Max 或 Ultra。',
          '如果桌面 App 的模型滑块中没有 Ultra，请前往 Settings（设置） > Configuration（配置），然后开启 Ultra in model picker slider。',
        ],
      },
      {
        heading: '其他模型',
        level: 2,
        paragraphs: [
          '使用 ChatGPT 登录时，Codex 与上面列出的推荐模型配合效果最好。',
        ],
      },
      {
        heading: 'gpt-5.4',
        level: 3,
        paragraphs: [
          '面向专业工作的前沿模型，具备较强的编码、推理、工具使用和智能体工作流能力。',
          '支持： ChatGPT 桌面 App、ChatGPT Web、Codex CLI、Codex IDE 扩展、ChatGPT Credits、API Access。',
          '不支持： Codex 云端。',
        ],
      },
      {
        heading: 'gpt-5.4-mini',
        level: 3,
        paragraphs: [
          '快速、高效的小型模型，适合强调响应速度的编码任务和子智能体。',
          '支持： ChatGPT 桌面 App、ChatGPT Web、Codex CLI、Codex IDE 扩展、ChatGPT Credits、API Access。',
          '不支持： Codex 云端。',
          '你也可以让 Codex 使用任何支持 Chat Completions 或 Responses API 的模型与提供商，以适配特定使用场景。',
          'Codex 对 Chat Completions API 的支持已经弃用，并会在未来版本中移除。',
        ],
      },
      {
        heading: '已弃用的 Codex 模型',
        level: 2,
        paragraphs: [
          '通过 ChatGPT 登录 Codex 时，gpt-5.2 和 gpt-5.3-codex 已经弃用。如果脚本、配置文件或 codex exec --model 命令仍引用这些模型，请更新到上面列出的最新模型。',
          '某些对 ChatGPT 登录方式已经弃用的模型，仍可能通过 API 使用。如果工作流依赖这些模型，请改用 API key 认证，并查看 API 模型页面确认当前可用性。',
        ],
      },
      {
        heading: '配置默认本地模型',
        level: 2,
        paragraphs: [
          'ChatGPT 桌面 App、Codex CLI 和 IDE 扩展共用同一个 config.toml 配置文件。要指定模型，请添加 model 配置项。如果未指定，ChatGPT 桌面 App、Codex CLI 或 IDE 扩展会使用推荐模型。',
        ],
        codeBlocks: ['model = "gpt-5.6"'],
      },
      {
        heading: '为云端任务选择模型',
        level: 2,
        paragraphs: ['目前无法更改 Codex 云端任务的默认模型。'],
      },
    ],
  },
  pricing: {
    title: 'Codex 定价',
    sections: [
      {
        heading: '定价选项',
        level: 2,
      },
      {
        heading: 'Free',
        level: 3,
        paragraphs: [
          '通过简短编码任务体验 Codex 能力。功能可用性与包含额度取决于账号、地区和当前推出阶段。',
          '价格： 0 美元/月。',
        ],
      },
      {
        heading: 'Go',
        level: 3,
        paragraphs: [
          '使用 Codex 处理轻量编码任务。功能可用性与包含额度取决于账号、地区和当前推出阶段。',
          '价格： 8 美元/月。',
        ],
      },
      {
        heading: 'Plus',
        level: 3,
        paragraphs: ['价格： 20 美元/月。'],
        bullets: [
          '在 Web、CLI、IDE 扩展和 iOS 中使用 Codex。',
          '使用自动代码评审、Slack 集成等云端集成。',
          '使用 GPT-5.6 模型系列，包括 Sol、Terra 和 Luna。',
          '对轻量或高频工作负载使用 GPT-5.6 Luna，获得更高使用上限。',
          '通过 ChatGPT credits 灵活扩展使用量。',
          '同时包含 Plus 计划中的其他 ChatGPT 功能。',
        ],
      },
      {
        heading: 'Pro',
        level: 3,
        paragraphs: ['价格： 100 美元/月起。'],
        bullets: [
          '可以使用 GPT-5.3-Codex-Spark（研究预览），它是面向日常编码任务的快速 Codex 模型。',
          'Codex 使用量可达到 Plus 的 5 倍或 20 倍，具体取决于订阅选项与当期规则。',
          '同时包含 Pro 计划中的其他 ChatGPT 功能。',
        ],
      },
      {
        heading: 'API key',
        level: 3,
        bullets: [
          '在 CLI、SDK 或 IDE 扩展中使用 Codex。',
          '不包含 GitHub 代码评审、Slack 等云端功能。',
          '可用模型取决于 API key 可以访问的 API 模型。',
          '只需按 Codex 实际使用的 tokens 支付 API 费用。',
        ],
      },
      {
        heading: 'Business',
        level: 3,
        paragraphs: [
          '价格： 按年计费时至少需要两位用户，每位用户每月 20 美元；按月计费时为每位用户每月 25 美元。',
          '官方套餐卡片注明，按年计费需要至少两位用户。按月计费时，Business 为每位用户每月 25 美元；当前购买条款请以 ChatGPT 定价页为准。',
        ],
        bullets: [
          '在桌面和移动 App 中使用 ChatGPT 与 Codex。',
          '使用更大的虚拟机，加快云端任务运行。',
          '通过 ChatGPT credits 灵活扩展使用量。',
          '获得安全的专用工作区，以及基本管理控制、SAML SSO 和 MFA。',
          '默认不会使用业务数据训练模型。了解更多。',
          '同时包含 Business 计划中的其他 ChatGPT 功能。',
        ],
      },
      {
        heading: 'Enterprise & Edu',
        level: 3,
        paragraphs: [
          'Business、Enterprise 和 Edu 工作区也可以按组织策略使用 API key；API key 模式不包含云端功能，并按 API tokens 计费。',
        ],
        bullets: [
          '请求优先处理。',
          '企业级安全和控制，包括 SCIM、EKM、用户分析、域名验证和基于角色的访问控制（RBAC）。',
          '通过 Compliance API 提供审计日志和使用监控。',
          '数据保留与数据驻留控制。',
          '同时包含 Enterprise 计划中的其他 ChatGPT 功能。',
        ],
      },
      {
        heading: 'API key',
        level: 3,
        bullets: [
          '在 CLI、SDK 或 IDE 扩展中使用 Codex。',
          '不包含 GitHub 代码评审、Slack 等云端功能。',
          '可用模型取决于 API key 可以访问的 API 模型。',
          '只需按 Codex 实际使用的 tokens 支付 API 费用。',
        ],
      },
      {
        heading: '邀请朋友和同事',
        level: 2,
        paragraphs: [
          '符合条件的用户可以从 App 左下角的个人资料菜单发送 Codex 邀请。符合条件的个人计划选择 Invite a friend（邀请朋友）；符合条件的 Business 工作区选择 Invite a coworker（邀请同事），输入收件人邮箱后发送。',
          '邀请对话框会显示当前奖励、收件人要求、邀请上限，以及当前计划或活动中奖励的过期时间。个人推荐和 Business 推荐使用不同的奖励与资格规则；ChatGPT Enterprise 当前不支持推荐活动。',
          '官方来源记录的 2026 年 6 月 11 日至 6 月 24 日 Plus/Pro 邀请活动现已结束。当期符合条件的用户最多可邀请三位朋友；符合条件的收件人发送第一条 Codex 消息后，双方会获得一个可储存的速率限制重置次数，发放后 30 天内有效。Business 推荐使用另一套共享工作区 credit 奖励；发送邀请前请查看当前条款。',
        ],
      },
      {
        heading: '常见问题',
        level: 2,
      },
      {
        heading: 'Sites 如何计费？',
        level: 3,
        paragraphs: [
          'Sites 在公开测试期间包含在符合条件的 ChatGPT 计划中。可用性取决于计划、地区和工作区设置。',
        ],
      },
      {
        heading: '我的计划有哪些使用限制？',
        level: 3,
        paragraphs: [
          '可以发送多少条 Codex 消息取决于所用模型、编码任务的规模与复杂度，以及任务是在本地还是云端运行。小型脚本或常规函数可能只消耗少量额度；较大的代码库、长时间运行任务，或需要长期保留更多上下文的会话，每条消息会明显消耗更多额度。',
          '看起来相似的任务也可能消耗不同额度。模型选择、上下文、推理、工具使用、检索和缓存都会影响使用量，因此不能只用提示词长度估算。',
          '按工作类型选择 GPT-5.6 模型：',
          '以下是官方来源快照中的本地消息估算范围。数字表示共享五小时窗口内的消息量；实际用量会随任务变化。',
          '本地消息与云端任务共享一个五小时窗口，并且可能还有额外的每周限制。来源快照中的这些模型行把 Cloud Tasks 和 Code Reviews 标记为 Not available；实际产品可用性应以账号中的用量仪表盘和相应功能页面为准。',
          '使用灵活定价的 Enterprise/Edu 用户没有固定速率限制，使用量会随 credits 扩展。未使用灵活定价的 Enterprise 和 Edu 计划，在大多数功能上的单席位限制与 Plus 相同。',
          'Codex 的额度会与其他智能体功能共享；相应功能定价生效后会纳入统一限制。目前 Plus 和 Pro 中的 ChatGPT for Excel 已包含在内。',
          '速度配置会提高适用模型的 credit 消耗，也会更快用完包含额度。Fast mode 对支持的模型使用更高 credit 速率，详情见 Speed。图片生成也会计入包含额度；根据质量和尺寸，平均消耗速度约为不含图片生成的类似会话轮次的 3–5 倍。',
          'GPT-5.3-Codex-Spark 目前只向 ChatGPT Pro 用户提供研究预览，发布时不在 API 中提供。它运行在专用低延迟硬件上，因此使用独立额度，限制可能随需求调整。',
        ],
        bullets: [
          'Sol：质量和推理深度最重要时的首选，适合复杂分析、编码、研究和高级工作流。',
          'Terra：日常默认选择，在能力、性能和价格之间取得更均衡的取舍。',
          'Luna：针对速度和成本优化，适合轻量或高频工作负载。',
        ],
        tables: [
          ['模型', 'Plus / Business', 'Pro 5x', 'Pro 20x', 'API key'],
          ['GPT-5.6 Sol', '15–90', '75–450', '300–1800', '按用量计费'],
          ['GPT-5.6 Terra', '20–110', '100–550', '400–2200', '按用量计费'],
          ['GPT-5.6 Luna', '50–280', '250–1400', '1000–5600', '按用量计费'],
          ['GPT-5.5', '15–80', '75–400', '300–1600', '按用量计费'],
          ['GPT-5.4', '20–100', '100–500', '400–2000', '按用量计费'],
          ['GPT-5.4 mini', '60–350', '300–1750', '1200–7000', '按用量计费'],
        ],
      },
      {
        heading: '达到使用限制后会怎样？',
        level: 3,
        paragraphs: [
          '如果在一个正在进行的会话轮次中达到使用限制，在公平使用限制允许的范围内，智能体仍可继续完成该轮工作。',
          '达到限制的 ChatGPT Plus 和 Pro 用户可以购买额外 credits，而无需升级现有计划。采用灵活定价的 Business、Edu 和 Enterprise 计划可以购买额外工作区 credits。',
          '接近限制时，也可以切换到更小的模型，让剩余额度维持更久。所有用户还可以使用 API key 运行额外的本地任务，并按标准 API 价格付费。',
        ],
      },
      {
        heading: '图片生成如何计入使用限制？',
        level: 3,
        paragraphs: [
          '图片生成与本地消息、云端任务共用 Codex 通用额度。根据图片质量和尺寸，平均消耗速度约为不包含图片生成的类似会话轮次的 3–5 倍。用完包含额度后，图片生成也会继续消耗 credits。',
          'Free 计划不提供图片生成。通过 API key 使用 Codex 时，图片生成按 API 价格计费，不使用 ChatGPT 套餐额度。',
        ],
      },
      {
        heading: '在哪里查看当前使用限制？',
        level: 3,
        paragraphs: [
          '可以在 Codex usage dashboard（Codex 用量仪表盘） 查看当前限制。在 Codex CLI 的活动会话中，可以使用 /status 查看剩余额度。',
          '建议每隔一到两周检查用量仪表盘，了解使用速度和剩余容量。如果用量高于预期，可以评估更小模型或更聚焦的任务范围是否仍能提供有用结果。',
        ],
      },
      {
        heading: 'Tokens 和 credits 是什么？',
        level: 3,
        paragraphs: [
          'tokens 是 ChatGPT 读写信息时使用的小型单位。提示词、文件、对话历史、工具结果和回复都会消耗 tokens。',
          'credits 把 token 使用量转换成更容易跟踪和管理的单位。credit 成本会随模型、上下文、推理和工具变化。用完套餐包含额度后，只要仍有 credits，就可以继续工作。',
          'Codex 按每百万输入 tokens、缓存输入 tokens 和输出 tokens 计算 credits。进一步了解 tokens。',
          '下表为官方来源中的每百万 tokens credit 费率：',
          'GPT-5.6 每条消息平均消耗 5–40 credits。Fast mode 对支持的模型使用更高 credit 速率，具体费率见 Speed。',
          '少量 Enterprise 客户在迁移到 Codex 的新 token 定价前，应继续使用旧费率表。如需确认，请联系 OpenAI 销售团队。',
        ],
        tables: [
          ['模型或功能', '输入 tokens', '缓存输入 tokens', '输出 tokens'],
          ['GPT-5.6 Sol', '125 credits', '12.5 credits', '750 credits'],
          ['GPT-5.6 Terra', '62.5 credits', '6.25 credits', '375 credits'],
          ['GPT-5.6 Luna', '25 credits', '2.5 credits', '150 credits'],
          ['GPT-5.5', '125 credits', '12.50 credits', '750 credits'],
          ['GPT-5.4', '62.50 credits', '6.250 credits', '375 credits'],
          ['GPT-5.4 mini', '18.75 credits', '1.875 credits', '113 credits'],
          ['GPT-5.3-Codex-Spark', '研究预览', '研究预览', '研究预览'],
          ['GPT-Image-2（图片）', '200 credits', '50 credits', '750 credits'],
          [
            'GPT-Image-2（文字）',
            '125 credits',
            '31.25 credits',
            '250 credits',
          ],
        ],
        bullets: [
          '了解 ChatGPT Plus 和 Pro 中的 credits',
          '了解 ChatGPT Business、Enterprise 和 Edu 中的 credits',
        ],
      },
      {
        heading: '哪些操作计入 Code Review 用量？',
        level: 3,
        paragraphs: [
          '只有 Codex 通过 GitHub 执行的评审才计入 Code Review 用量，例如在 PR 中通过 @Codex 请求评审，或为仓库启用自动评审。在本地或 GitHub 之外运行的评审计入通用使用限制。',
        ],
      },
      {
        heading: '如何让使用限制维持更久？',
        level: 3,
        paragraphs: [
          '上面的使用限制和 credits 都是平均费率。可以通过以下方式提高额度利用率：',
          '关于如何选择和限定任务范围，见高效使用 Work。',
        ],
        bullets: [
          '控制提示词规模。 指令应准确，但移除不必要上下文。',
          '限制来源材料。 只提供相关文件，并在可能时收窄来源或日期范围。',
          '让输出匹配实际需要。 明确受众、格式和长度，并把必需工作与可选润色分开。',
          '减小 AGENTS.md。 大型项目可以通过在仓库中分层放置 AGENTS.md，控制注入的上下文量。',
          '限制 MCP server 数量。 每个 MCP server都会增加上下文和额度消耗；不需要时应禁用。',
          '为常规任务选择更小模型。 根据当前模型，切换到 GPT-5.4 或 GPT-5.4 mini 可能延长本地消息额度。',
        ],
      },
      {
        heading: '功能可用性',
        level: 2,
        paragraphs: [
          '功能可能受计划、地区、账号、工作区策略和推出阶段影响。标有 * 的功能当前只在特定地区提供；标有 † 的项目表示部分第一方 plugins 不可用。请以具体功能文档和账号中显示的状态为准。',
        ],
      },
      {
        heading: '使用入口与产品界面',
        level: 3,
        tables: [
          ['功能', 'Plus', 'Pro', 'Business', 'Enterprise / Edu', 'API key'],
          ['Codex 云端', '可用', '可用', '可用', '可用', '不可用'],
          ['ChatGPT Web 中的 Work', '可用', '可用', '可用', '可用', '不可用'],
          [
            '用于本地任务的 ChatGPT 桌面 App',
            '可用',
            '可用',
            '可用',
            '可用',
            '可用',
          ],
          ['Codex CLI', '可用', '可用', '可用', '可用', '可用'],
          ['IDE 扩展', '可用', '可用', '可用', '可用', '可用'],
          [
            'Codex SDK、codex exec 和可编程工作流',
            '可用',
            '可用',
            '可用',
            '可用',
            '可用',
          ],
          [
            '用于可信自动化的 Codex access tokens',
            '不可用',
            '不可用',
            '可用',
            '可用',
            '不可用',
          ],
          ['ChatGPT for Excel', '可用', '可用', '可用', '可用', '不可用'],
        ],
      },
      {
        heading: '模型与多模态',
        level: 3,
        tables: [
          ['功能', 'Plus', 'Pro', 'Business', 'Enterprise / Edu', 'API key'],
          ['GPT-5.6', '可用', '可用', '可用', '可用', '可用'],
          ['Fast mode', '可用', '可用', '可用', '可用', '可用'],
          [
            'Codex-Spark 研究预览',
            '不可用',
            '可用',
            '不可用',
            '不可用',
            '不可用',
          ],
          ['图片生成与编辑', '可用', '可用', '可用', '可用', '可用'],
          ['语音听写', '可用', '可用', '可用', '可用', '不可用'],
          ['Web 搜索', '可用', '可用', '可用', '可用', '可用'],
        ],
      },
      {
        heading: '本地功能',
        level: 3,
        tables: [
          ['功能', 'Plus', 'Pro', 'Business', 'Enterprise / Edu', 'API key'],
          [
            '使用 /review 进行本地代码评审',
            '可用',
            '可用',
            '可用',
            '可用',
            '可用',
          ],
          ['审批请求的自动评审', '可用', '可用', '可用', '可用', '可用'],
          ['沙箱与权限控制', '可用', '可用', '可用', '可用', '可用'],
          ['项目级和独立定时任务', '可用', '可用', '可用', '可用', '可用'],
          ['定时任务', '可用', '可用', '可用', '可用', '可用'],
          ['工作树和内置 Git 工具', '可用', '可用', '可用', '可用', '可用'],
          ['本地环境和可复用 action', '可用', '可用', '可用', '可用', '可用'],
          ['Appshots', '可用', '可用', '可用', '不可用', '可用'],
        ],
      },
      {
        heading: '浏览器与远程控制',
        level: 3,
        tables: [
          ['功能', 'Plus', 'Pro', 'Business', 'Enterprise / Edu', 'API key'],
          ['内置浏览器预览与批注', '可用', '可用', '可用', '可用', '可用'],
          [
            '浏览器中的 Computer Use',
            '有限*',
            '有限*',
            '有限*',
            '有限*',
            '有限*',
          ],
          [
            '通过 Chrome 使用 ChatGPT',
            '有限*',
            '有限*',
            '有限*',
            '有限*',
            '有限*',
          ],
          ['Computer Use', '有限*', '有限*', '有限*', '有限*', '有限*'],
          [
            'Record & Replay（macOS）',
            '有限*',
            '有限*',
            '有限*',
            '有限*',
            '有限*',
          ],
          ['SSH 远程连接', '可用', '可用', '可用', '可用', '可用'],
          ['移动端远程控制', '可用', '可用', '可用', '可用', '不可用'],
          [
            'ChatGPT Web 中的 Browser',
            '可用',
            '可用',
            '可用',
            '可用',
            '不可用',
          ],
        ],
      },
      {
        heading: '个性化与扩展',
        level: 3,
        tables: [
          ['功能', 'Plus', 'Pro', 'Business', 'Enterprise / Edu', 'API key'],
          [
            '通过 AGENTS.md 设置自定义指令',
            '可用',
            '可用',
            '可用',
            '可用',
            '可用',
          ],
          ['Skills', '可用', '可用', '可用', '可用', '可用'],
          ['Plugins', '可用', '可用', '可用', '可用', '有限†'],
          ['Plugin 共享', '可用', '可用', '可用', '可用', '不可用'],
          ['连接器', '可用', '可用', '可用', '可用', '不可用'],
          ['MCP', '可用', '可用', '可用', '可用', '可用'],
          ['子智能体和自定义智能体', '可用', '可用', '可用', '可用', '可用'],
          ['记忆', '有限*', '有限*', '有限*', '有限*', '有限*'],
          ['Chronicle', '不可用', '有限*', '不可用', '不可用', '不可用'],
        ],
      },
      {
        heading: '云端与集成',
        level: 3,
        tables: [
          ['功能', 'Plus', 'Pro', 'Business', 'Enterprise / Edu', 'API key'],
          ['Codex 云端任务', '可用', '可用', '可用', '可用', '不可用'],
          ['云端环境与设置脚本', '可用', '可用', '可用', '可用', '不可用'],
          [
            '云端智能体的互联网访问控制',
            '可用',
            '可用',
            '可用',
            '可用',
            '不可用',
          ],
          ['Sites', '不可用', '不可用', '可用', '可用', '不可用'],
          [
            '通过 @codex 委派 GitHub issue 和 PR',
            '可用',
            '可用',
            '可用',
            '可用',
            '不可用',
          ],
          [
            'GitHub 代码评审与自动 PR 评审',
            '可用',
            '可用',
            '可用',
            '可用',
            '不可用',
          ],
          ['Slack 云端集成', '可用', '可用', '可用', '可用', '不可用'],
          ['Linear 云端集成', '可用', '可用', '可用', '可用', '不可用'],
        ],
      },
      {
        heading: '管理、安全与分析',
        level: 3,
        tables: [
          ['功能', 'Plus', 'Pro', 'Business', 'Enterprise / Edu', 'API key'],
          [
            'SAML SSO、MFA 与工作区用户管理',
            '不可用',
            '不可用',
            '可用',
            '可用',
            '不可用',
          ],
          [
            'requirements.toml 受管配置',
            '可用',
            '可用',
            '可用',
            '可用',
            '可用',
          ],
          ['云端管理的配置策略', '不可用', '不可用', '可用', '可用', '不可用'],
          [
            'ChatGPT 工作区 RBAC 与自定义角色',
            '不可用',
            '不可用',
            '不可用',
            '可用',
            '不可用',
          ],
          [
            'SCIM、EKM 与域名验证',
            '不可用',
            '不可用',
            '不可用',
            '可用',
            '不可用',
          ],
          [
            'Enterprise 数据保留与数据驻留控制',
            '不可用',
            '不可用',
            '不可用',
            '可用',
            '不可用',
          ],
          [
            '默认不使用 API 数据或业务数据进行训练',
            '不可用',
            '不可用',
            '可用',
            '可用',
            '可用',
          ],
          ['分析仪表盘', '不可用', '不可用', '不可用', '可用', '不可用'],
          ['Analytics API', '不可用', '不可用', '不可用', '可用', '不可用'],
          [
            'Compliance API 与审计日志',
            '不可用',
            '不可用',
            '不可用',
            '可用',
            '不可用',
          ],
          [
            '用于已连接 GitHub 仓库的 Codex Security',
            '不可用',
            '不可用',
            '不可用',
            '可用',
            '不可用',
          ],
        ],
      },
    ],
  },
  glossary: {
    title: 'ChatGPT 与 Codex 术语表',
    sections: [
      {
        heading: '内容',
        level: 2,
        paragraphs: [
          '快速查找 ChatGPT 桌面应用、Codex CLI、IDE 扩展、云端、SDK 和相关集成中使用的核心术语。',
          '113 个术语',
        ],
        tables: [
          ['术语', '适用范围', '说明'],
          [
            'Agent（智能体）',
            '桌面 App、CLI、IDE 扩展、Cloud',
            '会基于上下文推理、使用工具并完成任务的 Codex 智能体。',
          ],
          [
            'AGENTS.md',
            '桌面 App、CLI、IDE 扩展、Cloud',
            '仓库或用户级指导文件，用来给 Codex 提供持久指令。',
          ],
          [
            'Analytics dashboard（分析仪表盘）',
            '企业',
            '面向管理员的中心页面，用于查看 ChatGPT 工作区采用情况和 Codex 专项报告。',
          ],
          [
            'API key sign-in（API key 登录）',
            '桌面 App、CLI、IDE 扩展',
            '使用 OpenAI API key 完成认证。',
          ],
          [
            'Approval policy（审批策略）',
            '桌面 App、CLI、IDE 扩展',
            '规定 Codex 在执行动作前何时必须请求确认的规则。',
          ],
          [
            'Approval request（审批请求）',
            '桌面 App、CLI、IDE 扩展',
            'Codex 请求允许某个受限制动作。',
          ],
          [
            'Apps (configuration)（配置中的 Apps）',
            '桌面 App、CLI、IDE 扩展',
            'Codex 配置和 app-server 字段中用于表示连接器的兼容名称。',
          ],
          [
            'Appshot（应用截图）',
            '桌面 App',
            '发送到 Work 或 Codex 任务的最前方应用窗口快照。',
          ],
          [
            'Auth cache（认证缓存）',
            '桌面 App、CLI、IDE 扩展',
            'Codex 在本地保存并复用的登录凭据。',
          ],
          [
            'Automatic approval review（自动审批评审）',
            '桌面 App、CLI、IDE 扩展',
            '符合条件的审批请求在继续前，由模型先进行审核。',
          ],
          [
            'Scheduled task（定时任务）',
            '桌面 App、Web',
            'ChatGPT 中按计划或周期运行的任务。',
          ],
          [
            'Scheduled run（定时运行）',
            '桌面 App、Web',
            '定时任务的一次执行；它可以报告发现，也可以自行归档。',
          ],
          [
            'Computer Use in the browser（浏览器中的 Computer Use）',
            '桌面 App',
            '让 ChatGPT 直接操作内置浏览器的能力。',
          ],
          [
            'Chat（聊天）',
            '桌面 App、Web、移动端',
            '包含提示词和响应的普通 ChatGPT 对话。Quick Chat 打开的也是这种对话。',
          ],
          [
            'ChatGPT sign-in（ChatGPT 登录）',
            '桌面 App、CLI、IDE 扩展、Cloud',
            '使用 ChatGPT 账号和工作区权限完成认证。',
          ],
          [
            'Chronicle（执行记录）',
            '桌面 App',
            '可选择启用的功能，会从近期屏幕上下文构建记忆。',
          ],
          [
            'Cloud（云端）',
            '桌面 App、IDE 扩展、Web',
            'Codex 在 OpenAI 托管环境中远程工作的模式。',
          ],
          [
            'Cloud environment（云端环境）',
            'Cloud',
            '用于 Codex 云端任务的容器配置。',
          ],
          [
            'Cloud task（云端任务）',
            'Cloud',
            '在云端环境中远程执行的 Codex 任务。',
          ],
          [
            'Codex',
            '桌面 App、CLI、IDE 扩展、Web、Cloud、SDK',
            'OpenAI 面向软件开发任务的编码智能体。',
          ],
          [
            'ChatGPT desktop app（ChatGPT 桌面应用）',
            '桌面端',
            '集成 ChatGPT Work、Codex 和独立 Quick Chat 窗口的桌面应用，包含项目、文件预览、定时任务和开发者工具。',
          ],
          [
            'Codex app-server',
            '桌面 App、IDE 扩展、SDK',
            '本地 JSON-RPC server，用于把 Codex 对话线程、会话轮次、审批、历史和流式事件嵌入自定义客户端。',
          ],
          ['Codex CLI', '终端', '用于交互式或脚本化运行 Codex 的终端客户端。'],
          [
            'Codex cloud（Codex 云端）',
            'Web、桌面 App、IDE 扩展',
            'OpenAI 托管执行环境，Codex 可以在其中远程处理仓库任务。',
          ],
          ['codex exec', 'CLI', '从脚本或 CI 非交互运行 Codex 的 CLI 命令。'],
          [
            'Codex IDE extension（Codex IDE 扩展）',
            'IDE',
            '在 VS Code、JetBrains IDE、Cursor、Windsurf 等 IDE 内使用 Codex 的编辑器集成。',
          ],
          ['Codex SDK', 'SDK', '用于构建 Codex 驱动工作流或集成的程序化接口。'],
          [
            'Codex-managed worktree（Codex 托管工作树）',
            '桌面 App',
            'Codex 为任务创建并管理的临时工作树。',
          ],
          [
            'Compaction（压缩）',
            '桌面 App、CLI、IDE 扩展、Cloud',
            '把较早上下文摘要化，让长时间运行的工作可以继续。',
          ],
          [
            'Compliance API（合规 API）',
            '企业',
            '用于导出受支持的 ChatGPT 工作区记录和审计元数据的 API。',
          ],
          [
            'Computer Use（计算机操作）',
            '桌面 App',
            '让 ChatGPT 通过 UI 与其他桌面应用交互的能力。',
          ],
          ['config.toml', '桌面 App、CLI、IDE 扩展', 'Codex 的本地配置文件。'],
          [
            'Connected host（连接主机）',
            '桌面 App、移动端',
            '为通过 Remote 打开的 Work 或 Codex 任务提供文件、工具和 shell 访问的计算机或开发环境。',
          ],
          [
            'Connector（连接器）',
            '桌面 App（Work、Codex）、Web（Work）',
            '通过 plugin 让 Work 或 Codex 访问外部服务的连接器。',
          ],
          [
            'Container cache（容器缓存）',
            'Cloud',
            '保存下来的云端容器状态，可加速后续任务。',
          ],
          [
            'Context（上下文）',
            '桌面 App、CLI、IDE 扩展、Cloud、SDK',
            'Codex 工作时可使用的信息，例如文件、先前消息、工具输出和指令。',
          ],
          [
            'Context window（上下文窗口）',
            '桌面 App、CLI、IDE 扩展、Cloud、SDK',
            '模型一次可以考虑的最大信息量。',
          ],
          [
            'Custom agent（自定义智能体）',
            '桌面 App、CLI',
            '用户定义的智能体角色，带有自己的指令和设置。',
          ],
          [
            'Deny-read rule（拒读规则）',
            '桌面 App、CLI、IDE 扩展、企业',
            '阻止 Codex 读取敏感路径或 glob 匹配项的文件系统权限规则。',
          ],
          [
            'Diff',
            '桌面 App、Git、评审',
            '用于检查、评论、暂存或还原的一组 Git 文件变更。',
          ],
          [
            'Domain allowlist（域名允许列表）',
            'Cloud',
            '启用智能体互联网访问时，Codex 云端可以访问的一组域名。',
          ],
          [
            'Environment (local)（本地环境）',
            '桌面 App、工作树',
            '用于告诉 Codex 如何为项目设置工作树的桌面 App 配置。',
          ],
          [
            'Environment variable（环境变量）',
            'Cloud、CLI、IDE 扩展',
            '任务执行期间可用的运行时配置值。',
          ],
          [
            'Ephemeral session（临时会话）',
            'CLI',
            '完成后跳过保存会话状态的非交互运行。',
          ],
          [
            'Fast mode（快速模式）',
            'CLI、IDE 扩展',
            '让支持的模型以更高 credit 成本更快响应的速度设置。',
          ],
          [
            'Filesystem permission（文件系统权限）',
            '桌面 App、CLI、IDE 扩展',
            '授予或拒绝本地命令读取和写入路径的权限配置档案规则。',
          ],
          [
            'Finding（发现）',
            '桌面 App',
            '定时任务产生的值得关注的结果或问题。',
          ],
          [
            'Full access（完全访问）',
            '桌面 App、CLI、IDE 扩展',
            'Codex 在不受常规沙箱限制的情况下运行的模式。',
          ],
          [
            'Git worktree（Git 工作树）',
            '桌面 App、Git',
            '同一个仓库的第二份 checkout，用于并行分支工作。',
          ],
          [
            'Handoff（交接）',
            '桌面 App',
            '在 Local 与 Worktree 之间移动任务及其工作。',
          ],
          [
            'Heartbeat（心跳）',
            '桌面 App',
            '让 ChatGPT 按周期回到同一任务的一种定时工作简称。',
          ],
          [
            'Hook（钩子）',
            '桌面 App、CLI、IDE 扩展',
            '当 Codex 事件匹配时运行的生命周期处理器，例如工具使用、权限请求或会话轮次停止。',
          ],
          [
            'Hook event（钩子事件）',
            '桌面 App、CLI、IDE 扩展',
            '配置的钩子处理器可以运行的生命周期点。',
          ],
          [
            'Hunk',
            '桌面 App、Git、评审',
            'diff 中可独立暂存、取消暂存或还原的连续片段。',
          ],
          [
            'Inline comment（行内评论）',
            '桌面 App',
            '附着在 diff 具体行上的反馈。',
          ],
          [
            'Live web search（实时 Web 搜索）',
            '桌面 App、CLI、IDE 扩展',
            '用于获取当前信息的实时 Web 查询。',
          ],
          [
            'Local（本地）',
            '桌面 App、CLI、IDE 扩展',
            'Codex 在用户自己的计算机上工作的模式。',
          ],
          [
            'Local task（本地任务）',
            '桌面 App、CLI、IDE 扩展',
            '在用户计算机上运行的 Work 或 Codex 任务。',
          ],
          [
            'Maintenance script（维护脚本）',
            'Cloud',
            '缓存云端容器恢复时可选运行的脚本。',
          ],
          [
            'Managed configuration（托管配置）',
            '企业',
            '由组织控制的 Codex 默认值和限制。',
          ],
          [
            'MCP',
            '桌面 App、CLI、IDE 扩展',
            'Model Context Protocol，是把 Codex 连接到外部工具和上下文的标准。',
          ],
          [
            'MCP resource',
            '桌面 App、CLI、IDE 扩展',
            'MCP server 暴露给 Codex 检查的可读上下文。',
          ],
          [
            'MCP server',
            '桌面 App、CLI、IDE 扩展',
            '通过 MCP 暴露的外部工具或上下文提供方。',
          ],
          [
            'MCP tool',
            '桌面 App、CLI、IDE 扩展',
            'MCP server 暴露、Codex 可在任务中调用的动作。',
          ],
          [
            'MDM',
            '企业',
            '用于分发设备配置档案和托管 Codex 设置的移动设备管理工具。',
          ],
          [
            'Memories（记忆）',
            '桌面 App、CLI、IDE 扩展',
            'Codex 可跨会话复用的本地存储上下文。',
          ],
          [
            'Model（模型）',
            '桌面 App、CLI、IDE 扩展、Cloud、SDK',
            'Codex 用于推理和工具工作的 AI 模型。',
          ],
          [
            'Network access（网络访问）',
            '桌面 App、CLI、IDE 扩展、Cloud',
            '命令或环境访问互联网的权限。',
          ],
          [
            'Network policy（网络策略）',
            '桌面 App、CLI、IDE 扩展',
            '约束沙箱化出站网络流量的基于域名的 allow / deny 规则。',
          ],
          [
            'Non-interactive mode（非交互模式）',
            'CLI',
            '从脚本或 CI 运行 Codex 的 CLI 模式。',
          ],
          [
            'Output schema（输出 schema）',
            'CLI',
            '传给 `codex exec`、用于约束最终响应的 JSON Schema。',
          ],
          [
            'Permanent worktree（永久工作树）',
            '桌面 App',
            '作为独立项目保留下来的长期工作树。',
          ],
          [
            'Permission profile（权限配置档案）',
            '桌面 App、CLI、IDE 扩展',
            '为本地命令执行组合文件系统和网络规则的具名最小权限策略。',
          ],
          [
            'Plan（计划）',
            '桌面 App、CLI、IDE 扩展、Cloud',
            'Codex 为完成任务提出或跟踪的一组步骤。',
          ],
          [
            'Plugin（插件）',
            '桌面 App（Work、Codex）、Web（Work）、CLI',
            '可安装的 bundle，可分发技能、工具和集成。',
          ],
          [
            'Plugin manifest（插件 manifest）',
            '桌面 App、CLI、IDE 扩展、Plugins',
            '识别插件并指向其内置技能、apps、MCP servers、hooks 和元数据的插件元数据文件。',
          ],
          [
            'Prefix rule（前缀规则）',
            '桌面 App、CLI、IDE 扩展、企业',
            '匹配命令前缀并允许、提示或禁止该命令的规则模式。',
          ],
          ['Profile（配置档案）', 'CLI、IDE 扩展', 'Codex 的具名配置预设。'],
          [
            'Progressive disclosure（渐进披露）',
            '桌面 App、CLI、IDE 扩展',
            '只在需要时加载技能详情，以节省上下文。',
          ],
          [
            'Project（项目）',
            '桌面 App',
            '一组相关聊天或任务及其共享来源，也可以是用于文件工作的本地文件夹。',
          ],
          [
            'Prompt（提示词）',
            '桌面 App、CLI、IDE 扩展、Cloud、SDK',
            '发送给 ChatGPT 或 Codex 的问题、指令或目标。',
          ],
          [
            'Pull request review（pull request 评审）',
            '桌面 App、CLI、GitHub',
            'Codex 对变更或 pull request 反馈进行的评审。',
          ],
          ['RBAC', '企业', '用于工作区权限的 role-based access control。'],
          [
            'Read-only mode（只读模式）',
            '桌面 App、CLI、IDE 扩展',
            'Codex 可以检查内容，但没有审批就不能修改的模式。',
          ],
          [
            'Reasoning effort（推理强度）',
            '桌面 App、CLI、IDE 扩展、SDK',
            '控制模型使用多少推理预算的设置。',
          ],
          [
            'Remote connection（远程连接）',
            '桌面 App、移动端',
            '通过连接主机在另一台设备上访问 Work 或 Codex 任务的连接。',
          ],
          [
            'requirements.toml',
            '企业',
            '托管 Codex 设置中由管理员强制执行的 requirements 文件。',
          ],
          [
            'Review pane（评审面板）',
            '桌面 App',
            '桌面 App 中用于检查 diff、评论和 Git 变更的视图。',
          ],
          [
            'Rules（规则）',
            '桌面 App、CLI、IDE 扩展',
            '允许、提示或拒绝命令前缀及权限例外的策略。',
          ],
          [
            'Sandbox（沙箱）',
            '桌面 App、CLI、IDE 扩展',
            '限制 Codex 命令可以访问或修改内容的强制边界。',
          ],
          [
            'Sandbox mode（沙箱模式）',
            '桌面 App、CLI、IDE 扩展',
            '定义 Codex 文件系统和网络限制的配置。',
          ],
          [
            'Sandbox preset（沙箱预设）',
            'SDK',
            'SDK 中用于 read-only、workspace-write 或 full access 等常见沙箱策略的简写。',
          ],
          ['Schedule（计划时间）', '桌面 App', '定时任务的时间规则。'],
          [
            'Secret（密文）',
            'Cloud',
            '可供设置脚本使用、但会在智能体阶段前移除的加密值。',
          ],
          [
            'Setup script（设置脚本）',
            '桌面 App 工作树',
            '智能体启动前运行的脚本，用于安装依赖或准备工具。',
          ],
          [
            'Skill（技能）',
            '桌面 App、CLI、IDE 扩展',
            '包含指令以及可选脚本或参考资料的可复用工作流包。',
          ],
          [
            'Skill invocation（技能调用）',
            '桌面 App、CLI、IDE 扩展',
            '显式或隐式激活某个技能。',
          ],
          [
            'Slash command（斜杠命令）',
            'CLI',
            '以斜杠开头、用于控制或检查 Codex CLI 会话的命令。',
          ],
          [
            'Standalone scheduled task（独立定时任务）',
            '桌面 App、Web',
            '每次运行都会新建任务，并在 Triage 中报告发现的定时任务。',
          ],
          [
            'STDIO MCP server',
            'CLI、IDE 扩展',
            '由配置的命令和参数作为本地进程启动的 MCP server。',
          ],
          [
            'Streamable HTTP MCP server',
            'CLI、IDE 扩展',
            '通过 HTTP 访问的 MCP server，可选使用 bearer token（持有者令牌）或 OAuth 认证。',
          ],
          [
            'Subagent（子智能体）',
            '桌面 App、CLI',
            '被派生出来、专门处理部分任务的子级智能体。',
          ],
          [
            'Subagent workflow（子智能体工作流）',
            '桌面 App、CLI',
            'Codex 并行运行委派智能体并合并其结果的工作流。',
          ],
          [
            'Task（任务）',
            '桌面 App、Web、移动端、CLI、IDE 扩展、Cloud',
            'Work 或 Codex 活动的持久工作单元，包含上下文、消息、结果和动作。',
          ],
          [
            'Thread（对话线程）',
            'App-server、SDK',
            'Codex app-server API 和协议字段暴露的技术性对话对象。',
          ],
          [
            'Scheduled work（计划工作）',
            '桌面 App、Web',
            '从现有任务安排的工作；每次定时运行都会回到同一任务上下文。',
          ],
          [
            'Thread fork（对话线程分叉）',
            'App-server、SDK',
            '从现有对话线程的已存历史分叉出来的新对话线程。',
          ],
          [
            'Turn（会话轮次）',
            '桌面 App、CLI、IDE 扩展、Cloud、SDK',
            '聊天或任务中的一次交互，通常包含用户提示词，以及智能体的响应和动作。',
          ],
          [
            'Universal image（通用镜像）',
            'Cloud',
            '默认 Codex 云端容器镜像，预装常用工具。',
          ],
          [
            'Web search cache（Web 搜索缓存）',
            '桌面 App、CLI、IDE 扩展',
            'Codex 不进行实时浏览也可使用的预索引搜索结果。',
          ],
          [
            'ChatGPT Work',
            '桌面 App、Web',
            'ChatGPT Work 是面向研究、分析，以及创建文档、演示文稿、电子表格等交付成果的智能体。',
          ],
          [
            'Worktree（工作树）',
            '桌面 App',
            'Codex 在独立 Git 工作树中隔离变更的模式。',
          ],
          [
            'Writable roots（可写根目录）',
            '桌面 App、CLI、IDE 扩展',
            'Codex 被允许修改的目录。',
          ],
        ],
      },
    ],
  },
  app: {
    title: '复杂工作的指挥中心',
    sections: [
      {
        heading: '概览',
        level: 2,
        paragraphs: ['ChatGPT 桌面应用'],
      },
      {
        heading: '让每项任务都尽在掌握',
        level: 2,
        paragraphs: [
          '在项目、Codex App 任务与 Git 工作树之间切换，而不丢失上下文。',
        ],
      },
      {
        heading: '创建并检查实际产出',
        level: 2,
        paragraphs: [
          '在同一个工作区中打开文档、电子表格、图像和其他文件，并完成代码评审。',
        ],
      },
      {
        heading: '跨工具完成工作',
        level: 2,
        paragraphs: [
          '使用浏览器、集成终端、桌面应用和插件，或直接从任务中安排后续工作。',
          '快速开始',
        ],
      },
      {
        heading: 'App 快速开始：下载 ChatGPT 并登录',
        level: 2,
        paragraphs: [
          '安装 ChatGPT、登录账号、选择工作位置，然后发送第一条消息。',
        ],
        bullets: ['1'],
      },
      {
        heading: '安装 ChatGPT 桌面应用',
        level: 3,
        paragraphs: ['下载适用于 Windows 或 macOS 的 ChatGPT。'],
        bullets: ['2'],
      },
      {
        heading: '打开 ChatGPT 并登录',
        level: 3,
        paragraphs: ['打开应用，然后使用你的 ChatGPT 账号登录。'],
        bullets: ['3'],
      },
      {
        heading: '选择工作位置',
        level: 3,
        paragraphs: [
          '开始任务、创建项目或打开文件夹。ChatGPT 可以使用你所选位置中的文件与上下文。',
        ],
        bullets: ['4'],
      },
      {
        heading: '发送第一条消息',
        level: 3,
        paragraphs: [
          '为任务选择 Chat、Work 或 Codex，描述想要的结果，并补充 ChatGPT 所需的文件或上下文。',
        ],
      },
      {
        heading: '后续步骤',
        level: 2,
        bullets: ['使用项目组织工作', '创建并检查文件', '使用浏览器和你的电脑'],
      },
      {
        heading: '看看桌面应用能做什么',
        level: 2,
        paragraphs: ['把日常工作转化为可以评审、完善和共享的成果。'],
      },
      {
        heading: '每天从聚焦的工作简报开始',
        level: 3,
        paragraphs: ['结合日历、消息、邮件和项目上下文，查看当天的重点事项。'],
      },
      {
        heading: '分析文件并创建交互式视觉内容',
        level: 3,
        paragraphs: ['把数据导出转换成可以检查和共享的洞察。'],
      },
      {
        heading: '把分散上下文整理成完整 PRD',
        level: 3,
        paragraphs: ['汇集多个来源、综合信息，并创建可继续编辑的文档。'],
      },
      {
        heading: '清理并准备杂乱数据',
        level: 3,
        paragraphs: [
          '把杂乱的 CSV 或电子表格整理成干净副本，同时保留原始文件。',
        ],
      },
      {
        heading: '把反馈转化为行动',
        level: 3,
        paragraphs: ['综合多个来源的反馈，形成可供评审的成果。'],
      },
      {
        heading: '这些情况适合使用 ChatGPT 桌面应用…',
        level: 2,
      },
      {
        heading: '其他 ChatGPT 与 Codex 使用界面',
        level: 2,
      },
      {
        heading: 'ChatGPT Web',
        level: 3,
        paragraphs: ['直接在浏览器中研究、分析并创建内容。'],
      },
      {
        heading: 'Codex CLI',
        level: 3,
        paragraphs: ['在终端中检查、编辑代码并运行自动化。'],
      },
      {
        heading: 'IDE 扩展',
        level: 3,
        paragraphs: ['在代码编辑器中让 Codex 与代码并行工作。'],
      },
      {
        heading: 'Codex 云端',
        level: 3,
        paragraphs: ['在并行云环境中运行编码任务。'],
      },
    ],
  },
  web: {
    title: '在浏览器中研究、分析，并创建成果',
    sections: [
      {
        heading: '概览',
        level: 2,
        paragraphs: ['ChatGPT Web'],
      },
      {
        heading: '从明确的任务开始',
        level: 2,
        paragraphs: [
          '说明期望结果、可用上下文，以及任务必须遵守的来源、约束与完成标准。',
        ],
      },
      {
        heading: '使用你的文件和工具',
        level: 2,
        paragraphs: [
          '引入项目文件、连接来源、plugins 和 skills，让 ChatGPT 获得完成任务所需的上下文与工具。',
        ],
      },
      {
        heading: '创建可分享的文件',
        level: 2,
        paragraphs: [
          '把研究和分析转换成文档、演示文稿、电子表格、PDF 及其他可以继续完善的交付物。',
          '快速开始',
        ],
      },
      {
        heading: '在 Web 上开始使用 ChatGPT',
        level: 2,
        paragraphs: [
          '登录 ChatGPT，选择合适的工作模式，再用清晰的目标与上下文启动第一项任务。',
        ],
        bullets: ['1'],
      },
      {
        heading: '打开 ChatGPT 并登录',
        level: 3,
        paragraphs: ['前往 chatgpt.com，然后使用你的 ChatGPT 账号登录。'],
        bullets: ['2'],
      },
      {
        heading: '选择 Chat 或 Work',
        level: 3,
        paragraphs: [
          '问题和聚焦对话使用 Chat；研究、分析、文档、演示文稿或其他多步骤任务使用 Work。',
        ],
        bullets: ['3'],
      },
      {
        heading: '开始聊天或选择项目',
        level: 3,
        paragraphs: [
          '一次性任务可以直接开始聊天；持续工作则使用项目集中管理相关聊天、文件和指令。',
        ],
        bullets: ['4'],
      },
      {
        heading: '发送第一条消息',
        level: 3,
        paragraphs: [
          '说明目标和所需上下文。对于较大的任务，列出预期交付物、来源、约束和完成标准。',
        ],
      },
      {
        heading: '后续步骤',
        level: 2,
        bullets: [
          '了解如何使用 ChatGPT',
          '选择适合任务的模型',
          '使用 skills 和 plugins',
          '创建并检查文件',
        ],
      },
      {
        heading: '看看 ChatGPT Web 能做什么',
        level: 2,
        paragraphs: [
          '从快速问答到多步骤工作流，在浏览器中规划任务、调用工具并完成可评审成果。',
        ],
      },
      {
        heading: '根据任务使用 Chat 或 Work',
        level: 3,
        paragraphs: [
          'Chat 适合问题和聚焦对话；Work 会制定计划、收集上下文、使用工具，并把多步骤任务推进到完整结果。',
        ],
      },
      {
        heading: '选择合适的模型和推理强度',
        level: 3,
        paragraphs: [
          '复杂规划和分析可以选择能力更强的模型或提高推理强度；常规工作则使用更快的模型。',
        ],
      },
      {
        heading: '引入工具和可复用工作流',
        level: 3,
        paragraphs: [
          '使用文件、项目、plugins 和 skills 连接信息来源、执行操作，并让 ChatGPT 遵循可复用流程。',
        ],
      },
      {
        heading: '创建并完善最终文件',
        level: 3,
        paragraphs: [
          '把来源材料转换成文档、演示文稿、电子表格或 PDF，并在分享前打开生成文件逐项检查。',
        ],
      },
      {
        heading: '这些情况适合使用 ChatGPT Web…',
        level: 2,
      },
      {
        heading: '其他 ChatGPT 与 Codex 使用界面',
        level: 2,
      },
      {
        heading: 'ChatGPT 桌面应用',
        level: 3,
        paragraphs: ['在桌面端协调项目与长时间运行的任务。'],
      },
      {
        heading: 'Codex CLI',
        level: 3,
        paragraphs: ['在终端中检查、编辑代码并运行自动化。'],
      },
      {
        heading: 'Codex IDE 扩展',
        level: 3,
        paragraphs: ['在代码编辑器中让 Codex 与代码并行工作。'],
      },
      {
        heading: 'Codex 云端',
        level: 3,
        paragraphs: ['在并行云环境中运行编码任务。'],
      },
    ],
  },
  'codex/cli': {
    title: '直接从终端检查、编辑并运行代码',
    sections: [
      {
        heading: '概览',
        level: 2,
        paragraphs: ['Codex CLI'],
      },
      {
        heading: '直接处理本地仓库',
        level: 2,
        paragraphs: [
          '在项目目录中启动 Codex，让它检查真实文件、运行仓库命令，并直接修改当前工作树。',
        ],
      },
      {
        heading: '始终掌握控制权',
        level: 2,
        paragraphs: [
          '评审计划和 diff，选择审批策略与沙箱模式，并决定 Codex 执行动作前何时必须暂停。',
        ],
      },
      {
        heading: '接入脚本和 CI',
        level: 2,
        paragraphs: [
          '需要人工协作时使用交互式 TUI；需要脚本、CI 和机器可读自动化时使用 codex exec。',
          '快速开始',
        ],
      },
      {
        heading: '开始使用 Codex CLI',
        level: 2,
        paragraphs: [
          '安装 Codex，在本地仓库中登录，然后用明确目标启动第一个终端任务。',
        ],
        bullets: ['1'],
      },
      {
        heading: '安装 Codex',
        level: 3,
        paragraphs: [
          '运行 curl -fsSL https://chatgpt.com/codex/install.sh | sh。Codex CLI 支持 macOS、Windows 和 Linux。',
        ],
        bullets: ['2'],
      },
      {
        heading: '运行 Codex 并登录',
        level: 3,
        paragraphs: [
          '在需要处理的仓库中运行 codex，然后使用 ChatGPT 账号或 API key 登录。',
        ],
        bullets: ['3'],
      },
      {
        heading: '开始第一个任务',
        level: 3,
        paragraphs: [
          '在终端 UI 中输入提示词，提供明确目标、相关路径、约束，以及应运行的验证命令。',
        ],
      },
      {
        heading: '后续步骤',
        level: 2,
        bullets: [
          '查看 CLI 命令目录',
          '配置审批模式',
          '配置 Codex CLI',
          '使用子智能体',
        ],
      },
      {
        heading: '看看 Codex CLI 能做什么',
        level: 2,
        paragraphs: [
          '这些 Codex CLI 功能覆盖交互式编码与可重复自动化，让检查、编辑、运行和评审始终贴近终端与本地仓库。',
        ],
      },
      {
        heading: '在终端中完成编码闭环',
        level: 3,
        paragraphs: [
          '在同一会话中讨论任务、检查计划、编辑代码、运行命令并评审最终 diff。',
        ],
      },
      {
        heading: '使用 skills 和 plugins',
        level: 3,
        paragraphs: [
          '通过 /skills 选择本地 skills，通过 /plugins 浏览 plugins，只启用当前任务需要的能力。',
        ],
      },
      {
        heading: '发布前评审改动',
        level: 3,
        paragraphs: [
          '运行 /review 启动独立评审智能体，并结合仓库已有的 lint、类型检查、测试和构建命令完成验证。',
        ],
      },
      {
        heading: '围绕 Codex 构建终端工作流',
        level: 3,
        paragraphs: [
          '恢复会话、加入图片、拆分子智能体、搜索最新上下文、调用 Codex 云端、连接 MCP servers、设置权限并生成 shell 补全。',
        ],
      },
      {
        heading: '这些情况适合使用 Codex CLI…',
        level: 2,
      },
      {
        heading: '其他 ChatGPT 与 Codex 使用界面',
        level: 2,
      },
      {
        heading: 'ChatGPT 桌面应用',
        level: 3,
        paragraphs: ['在桌面端协调项目与长时间运行的任务。'],
      },
      {
        heading: 'ChatGPT Web',
        level: 3,
        paragraphs: ['直接在浏览器中研究、分析并创建内容。'],
      },
      {
        heading: 'Codex IDE 扩展',
        level: 3,
        paragraphs: ['使用编辑器中已经打开的代码与上下文。'],
      },
      {
        heading: 'Codex 云端',
        level: 3,
        paragraphs: ['在并行云环境中运行编码任务。'],
      },
    ],
  },
  'codex/ide': {
    title: '结合编辑器中已有的上下文进行构建',
    sections: [
      {
        heading: '概览',
        level: 2,
        paragraphs: ['Codex IDE 扩展'],
      },
      {
        heading: '使用已经打开的上下文',
        level: 2,
        paragraphs: [
          'Codex 可以使用打开的文件、选中的代码和你在工作区中提及的文件。',
        ],
      },
      {
        heading: '在代码旁评审改动',
        level: 2,
        paragraphs: [
          '在编辑器中检查 diff、继续对话，并在应用或发布结果前运行仓库已有的检查。',
        ],
      },
      {
        heading: '任务变大时进行委派',
        level: 2,
        paragraphs: [
          '把较大的任务交给 Codex 云端，在本地继续工作，完成后回到 IDE 评审返回的改动。',
          '快速开始',
        ],
      },
      {
        heading: '在 IDE 中开始使用',
        level: 2,
        paragraphs: [
          '安装或启用 Codex，打开侧边栏，然后结合编辑器上下文启动第一项任务。',
        ],
        bullets: ['1'],
      },
      {
        heading: '安装或启用 Codex',
        level: 3,
        paragraphs: [
          'Codex 可用于 Visual Studio Code、Cursor、Windsurf、VS Code Insiders、Xcode 和 JetBrains IDE。',
        ],
        bullets: ['2'],
      },
      {
        heading: '打开 Codex',
        level: 3,
        paragraphs: [
          '点击活动栏中的 Codex 图标，或从 Command Palette 运行 Codex: Open Codex Sidebar。',
        ],
        bullets: ['3'],
      },
      {
        heading: '开始第一个任务',
        level: 3,
        paragraphs: [
          '打开仓库，选中相关代码或文件，并描述明确目标、路径、约束、预期行为与验证命令。',
        ],
      },
      {
        heading: '后续步骤',
        level: 2,
        bullets: [
          '查看 IDE 开发者命令',
          '查看斜杠命令',
          '选择模型',
          '设置 Codex 云端环境',
        ],
      },
      {
        heading: '看看 Codex 在 IDE 中能做什么',
        level: 2,
        paragraphs: [
          'Codex IDE 扩展功能把编辑器上下文、建议补丁、diff 评审和云端委派放进同一个编码工作流。',
        ],
      },
      {
        heading: '使用已经打开的上下文',
        level: 3,
        paragraphs: [
          '选中相关代码、保持文件打开，或用 @ 提及工作区文件；还可以把截图、设计稿和图表加入提示词。',
        ],
      },
      {
        heading: '在代码旁评审改动',
        level: 3,
        paragraphs: [
          '应用修改前检查建议 diff，再运行项目已有的 lint、类型检查、测试和构建命令。',
        ],
      },
      {
        heading: '任务变大时进行委派',
        level: 3,
        paragraphs: [
          '选择 Codex 云端环境并在云端运行任务，完成后在 IDE 中预览改动、发送后续指令并应用 diff。',
        ],
      },
      {
        heading: '这些情况适合使用 Codex IDE 扩展…',
        level: 2,
      },
      {
        heading: '其他 ChatGPT 与 Codex 使用界面',
        level: 2,
      },
      {
        heading: 'ChatGPT 桌面应用',
        level: 3,
        paragraphs: ['在桌面端协调项目与长时间运行的任务。'],
      },
      {
        heading: 'ChatGPT Web',
        level: 3,
        paragraphs: ['直接在浏览器中研究、分析并创建内容。'],
      },
      {
        heading: 'Codex CLI',
        level: 3,
        paragraphs: ['在终端中检查、编辑代码并运行自动化。'],
      },
      {
        heading: 'Codex 云端',
        level: 3,
        paragraphs: ['在并行云环境中运行编码任务。'],
      },
    ],
  },
  cloud: {
    title: '在并行云环境中运行编码任务',
    sections: [
      {
        heading: '概览',
        level: 2,
        paragraphs: ['Codex 云端'],
      },
      {
        heading: '并行运行工作',
        level: 2,
        paragraphs: [
          '为耗时更长的任务提供独立环境，让它们在你处理其他工作时继续运行。',
        ],
      },
      {
        heading: '复现运行环境',
        level: 2,
        paragraphs: ['配置每个仓库所需的依赖、工具、变量与设置步骤。'],
      },
      {
        heading: '合并前先评审',
        level: 2,
        paragraphs: [
          '检查摘要与 diff、提出后续修改，或在结果就绪时打开 PR。',
          '快速开始',
        ],
      },
      {
        heading: '设置 Codex 云端',
        level: 2,
        paragraphs: ['连接 GitHub、创建环境，然后启动第一个云端任务。'],
        bullets: ['1'],
      },
      {
        heading: '打开 Codex 并登录',
        level: 3,
        paragraphs: ['前往 Codex，然后使用你的 ChatGPT 账号登录。'],
        bullets: ['2'],
      },
      {
        heading: '连接 GitHub',
        level: 3,
        paragraphs: [
          '根据提示连接 GitHub 账号，然后选择允许 Codex 访问的仓库。',
        ],
        bullets: ['3'],
      },
      {
        heading: '创建环境',
        level: 3,
        paragraphs: [
          '为仓库创建环境，并配置任务所需的依赖、工具、环境变量或 secrets。',
        ],
        bullets: ['4'],
      },
      {
        heading: '启动第一个任务',
        level: 3,
        paragraphs: [
          '返回 Codex，选择环境并描述想要的结果。你可以查看任务日志，也可以让任务在后台继续运行。',
        ],
        bullets: ['5'],
      },
      {
        heading: '评审结果',
        level: 3,
        paragraphs: [
          '检查摘要与 diff。让 Codex 继续修改，或在工作就绪后打开 PR。',
        ],
      },
      {
        heading: '后续步骤',
        level: 2,
        bullets: [
          '自定义云端环境',
          '配置智能体网络访问',
          '在 GitHub 中使用 Codex',
          '在 Linear 中使用 Codex',
          '在 Slack 中使用 Codex',
        ],
      },
      {
        heading: '看看 Codex 云端能做什么',
        level: 2,
        paragraphs: ['为每项任务提供所需环境，然后按你的节奏评审结果。'],
      },
      {
        heading: '委派多项任务',
        level: 3,
        paragraphs: ['并行启动工作，在每项任务达到可评审状态后再回来处理。'],
      },
      {
        heading: '构建可复现环境',
        level: 3,
        paragraphs: ['配置仓库所需的依赖、工具、变量与设置步骤。'],
      },
      {
        heading: '从集成中委派工作',
        level: 3,
        paragraphs: [
          '从 GitHub PR、Linear issue 或 Slack 频道与对话线程中启动云端任务。',
        ],
      },
      {
        heading: '这些情况适合使用 Codex 云端…',
        level: 2,
      },
      {
        heading: '其他 ChatGPT 与 Codex 使用界面',
        level: 2,
      },
      {
        heading: '桌面应用',
        level: 3,
        paragraphs: ['在桌面端协调项目与长时间运行的任务。'],
      },
      {
        heading: 'ChatGPT Web',
        level: 3,
        paragraphs: ['直接在浏览器中研究、分析并创建内容。'],
      },
      {
        heading: 'Codex CLI',
        level: 3,
        paragraphs: ['在终端中检查、编辑代码并运行自动化。'],
      },
      {
        heading: 'IDE 扩展',
        level: 3,
        paragraphs: ['在代码编辑器中让 Codex 与代码并行工作。'],
      },
    ],
  },
  changelog: {
    title: 'Codex Changelog',
    sections: [
      {
        heading: '2026 年 7 月',
        level: 2,
      },
      {
        heading: '2026-07-21 · Codex CLI 0.145.0',
        level: 3,
        paragraphs: [
          '新增实验性的分页任务历史：支持高效恢复、搜索、持久化名称、子智能体支持与记忆。',
        ],
        codeBlocks: ['npm install -g @openai/[email protected]'],
      },
      {
        heading: '2026-07-14 · Codex CLI 0.144.4',
        level: 3,
        paragraphs: ['这个补丁版本没有面向用户的变更。'],
        codeBlocks: ['npm install -g @openai/[email protected]'],
      },
      {
        heading: '2026-07-13 · ChatGPT for iOS 1.2026.188',
        level: 3,
        paragraphs: [
          '本次更新新增 Codex 任务内行内可视化，并改进了从对话创建和管理任务的流程、工具活动与进度样式、文件打开反馈，以及长提示词和较大字号下的输入框控件。修复内容包括每项任务的 Fast 模式、选定的审批预设、自动补全背景，以及滑动手势期间任务行无响应的问题。',
        ],
      },
      {
        heading: '2026-07-13 · Codex CLI 0.144.3',
        level: 3,
        paragraphs: [
          '这是一个仅更新版本号的发布；自 rust-v0.144.2 以来没有合并新的 PR 变更。',
        ],
        codeBlocks: ['npm install -g @openai/[email protected]'],
      },
      {
        heading: '2026-07-13 · Codex CLI 0.144.2',
        level: 3,
        paragraphs: [
          '本次发布回滚了一项提示词回归，恢复先前的 Guardian 自动评审策略、request 格式和工具行为。',
        ],
        codeBlocks: ['npm install -g @openai/[email protected]'],
      },
      {
        heading: '2026-07-09 · Codex 并入 ChatGPT 桌面 App',
        level: 3,
        paragraphs: [
          'Codex 现已成为 macOS 与 Windows 版 ChatGPT 桌面 App 的一部分。现有 Codex App 用户可以照常更新，并继续保留项目、设置和工作流。',
          '新功能包括直接编辑 Markdown 与代码并使用行内批注、在侧边栏评审 GitHub PR，以及在一个项目中跨多个仓库工作。本次发布还提升了 GPT-5.6 的 Computer Use 速度、任务活动展示、plugin 管理、移动连接可靠性和 SSH 项目视频渲染。',
        ],
      },
      {
        heading: '2026-07-09 · Codex CLI 0.144.1 与 0.144.0',
        level: 3,
        codeBlocks: ['npm install -g @openai/[email protected]'],
      },
      {
        heading: '2026-07-08 · Codex CLI 0.143.0',
        level: 3,
        codeBlocks: ['npm install -g @openai/[email protected]'],
      },
      {
        heading: '2026-07-06 · ChatGPT for iOS 1.2026.181',
        level: 3,
        paragraphs: [
          '本次更新新增 Codex 任务创建与管理、更丰富的 diff 筛选、把对话记录选区加入输入框、附件预览、SSH 连接快捷入口和更清晰的用量信息。',
        ],
      },
      {
        heading: '2026-07-01 · Codex CLI 0.142.5',
        level: 3,
        codeBlocks: ['npm install -g @openai/[email protected]'],
      },
      {
        heading: '更多更新',
        level: 2,
        bullets: [
          '查看完整的 Codex 实时 Changelog',
          '查看整理后的最新动态时间线',
        ],
      },
    ],
  },
  'feature-maturity': {
    title: 'Feature Maturity（功能成熟度）',
    sections: [
      {
        heading: '内容',
        level: 2,
        paragraphs: [
          '如何理解 Codex 文档和发布说明中的成熟度标签',
          '部分 ChatGPT 和 Codex 功能会带上成熟度标签，帮助你判断它当前有多稳定、后续可能发生哪些变化，以及大致可以期待什么级别的支持。',
        ],
        tables: [
          ['Maturity', '含义', '使用建议'],
          ['Under development', '尚未准备好供用户使用。', '不要使用。'],
          [
            'Experimental',
            '不稳定，OpenAI 可能移除或修改它。',
            '自担风险使用。',
          ],
          [
            'Beta',
            '已准备好进行广泛测试；大部分方面已经完整，但仍可能根据用户反馈做小幅调整。',
            '适合评估与试点；预期会有小变化。',
          ],
          [
            'Stable',
            '已完整支持、有文档说明，并可广泛使用；行为和配置在较长时间内保持一致。',
            '可安全用于生产；如需移除，通常会先经过弃用流程。',
          ],
        ],
      },
    ],
  },
  'open-source': {
    title: '开源',
    sections: [
      {
        heading: '开源组件',
        level: 2,
        tables: [
          ['组件', '位置', '说明'],
          ['Codex CLI', 'openai/codex', 'Codex 开源开发的主仓库'],
          ['Codex SDK', 'openai/codex/codex-sdk', 'SDK 源码位于 Codex 仓库中'],
          [
            'Codex App Server',
            'openai/codex/codex-rs/app-server',
            'app-server 源码位于 Codex 仓库中',
          ],
          ['技能', 'openai/skills', '用于扩展 Codex 的可复用技能'],
          ['IDE 扩展', '-', '不开源'],
          ['Codex 云端', '-', '不开源'],
          [
            '通用云端环境',
            'openai/codex-universal',
            'Codex 云端使用的基础环境',
          ],
        ],
      },
      {
        heading: '在哪里报告问题和提出功能请求',
        level: 2,
        paragraphs: [
          '跨 Codex 组件的 bug 报告和功能请求，应统一使用 Codex GitHub 仓库：',
          '提交 issue 时，建议明确说明你正在使用的是哪个组件，例如 CLI、SDK、IDE 扩展或 Codex 云端，并尽量附上版本号。',
        ],
        bullets: ['openai/codex/issues', 'openai/codex/discussions'],
      },
    ],
  },
};
