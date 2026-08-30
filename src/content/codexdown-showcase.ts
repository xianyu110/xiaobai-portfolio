export type ShowcaseProject = {
  id: string;
  title: string;
  author: string;
  category: string;
  builtWith: string;
  tags: string[];
  image: string;
  summary: string;
  sourceUrl: string;
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
};

const source = 'https://developers.openai.com/showcase/';

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: 'watchmaker-landing-page',
    title: '高级制表品牌落地页',
    author: 'OpenAI',
    category: '落地页',
    builtWith: 'Codex + GPT-5.5 + GPT Image 2',
    tags: ['品牌官网', '电商', '视觉生成', '高级感'],
    image: 'watchmaker-landing-page.webp',
    summary:
      '一个面向奢华制表品牌的电影感落地页，包含主视觉、产品叙事和编辑式版面。',
    sourceUrl: `${source}watchmaker-landing-page`,
    liveUrl: 'https://openai-landing-page-examples.vercel.app/haute-horlogerie',
    featured: true,
  },
  {
    id: 'arcade-landing-page',
    title: '霓虹街机酒吧落地页',
    author: 'OpenAI',
    category: '落地页',
    builtWith: 'Codex + GPT-5.5 + GPT Image 2',
    tags: ['品牌官网', '活动', '餐饮', '霓虹'],
    image: 'arcade-pinball-bar.webp',
    summary:
      '为街机与弹珠酒吧生成的霓虹风落地页，包含活动、餐饮、饮品和游戏展示区。',
    sourceUrl: `${source}arcade-landing-page`,
    liveUrl:
      'https://openai-landing-page-examples.vercel.app/tilt-signal-arcade-bar/',
    featured: true,
  },
  {
    id: 'forged-in-silence',
    title: 'Forged in Silence 武士刀商店',
    author: 'Nishant Borse',
    category: '电商',
    builtWith: 'Codex + GPT-5.4',
    tags: ['3D', '电商', '滚动叙事', 'React'],
    image: 'forged-in-silence.webp',
    summary: '一个电影感 3D 武士刀体验，像故事一样滚动，也像商店一样完成转化。',
    sourceUrl: `${source}forged-in-silence`,
    liveUrl: 'https://katana-3d-5mdo.vercel.app/',
    featured: true,
  },
  {
    id: 'london-train',
    title: '伦敦梦幻铁路',
    author: 'Peter Gostev',
    category: '3D 应用',
    builtWith: 'Codex + GPT-5.4 + Computer Use validation',
    tags: ['3D', '交互场景', '验证循环', '伦敦'],
    image: 'london-train.webp',
    summary:
      '一个玩具桌版伦敦 3D 场景，包含迷你列车、地标、季节模式和驾驶控制。',
    sourceUrl: `${source}london-train`,
    liveUrl: 'https://petergpt.github.io/london-train/',
    featured: true,
  },
  {
    id: 'time-to-fly',
    title: 'Time to Fly 轨道谜题',
    author: 'OpenAI',
    category: '游戏',
    builtWith: 'Codex + GPT-5.5 + GPT Image 2',
    tags: ['游戏', '物理谜题', '关卡设计', '视觉生成'],
    image: 'time-to-fly.webp',
    summary: '一个关于轨道旋转和引力折返的宇宙逻辑谜题游戏。',
    sourceUrl: `${source}time-to-fly`,
    liveUrl: 'https://codextimetofly.com/',
    featured: true,
  },
  {
    id: 'swifty-roguelike',
    title: 'Swifty Roguelike',
    author: 'OpenAI',
    category: '游戏',
    builtWith: 'Codex + GPT-5.5 + ImageGen',
    tags: ['macOS', 'SwiftUI', 'Roguelike', '游戏'],
    image: 'swifty-roguelike.webp',
    summary:
      '一个原生 macOS ASCII roguelike，用 SwiftUI Canvas 和 Liquid Glass 界面构建。',
    sourceUrl: `${source}swifty-roguelike`,
    repoUrl: 'https://github.com/Dimillian/SwiftyRoguelike',
    featured: true,
  },
  {
    id: 'swifty-dungeon',
    title: 'Swifty Dungeon',
    author: 'OpenAI',
    category: '游戏',
    builtWith: 'Codex + GPT-5.5 + ImageGen',
    tags: ['macOS', 'SwiftUI', '地牢', '游戏'],
    image: 'swifty-dungeon.webp',
    summary:
      '一个原生 SwiftUI 第一人称地牢探索游戏，包含生成纹理、精灵和遥测。',
    sourceUrl: `${source}swifty-dungeon`,
    repoUrl: 'https://github.com/Dimillian/SwiftyDungeon',
    featured: true,
  },
  {
    id: 'rift-vox',
    title: 'Neon FPS',
    author: 'OpenAI',
    category: '游戏',
    builtWith: 'Codex + GPT-5.5 + GPT Image 2',
    tags: ['FPS', '霓虹', '游戏', '视觉生成'],
    image: 'neon-fps.webp',
    summary: '一个霓虹第一人称射击游戏，带有街机式战斗体验。',
    sourceUrl: `${source}rift-vox`,
    liveUrl: 'https://openai-minigames-examples.vercel.app/fps/',
    featured: true,
  },
  {
    id: 'brick-platformer',
    title: '砖墙屋顶平台跳跃',
    author: 'OpenAI',
    category: '游戏',
    builtWith: 'Codex + GPT-5.5 + GPT Image 1.5',
    tags: ['平台跳跃', '浏览器游戏', 'Phaser'],
    image: 'brick-platformer.webp',
    summary: '一个浏览器平台跳跃游戏，场景是砖墙屋顶与横向卷轴动作。',
    sourceUrl: `${source}brick-platformer`,
    liveUrl: 'https://openai-minigames-examples.vercel.app/brick-platformer/',
  },
  {
    id: 'coffee-house-landing-page',
    title: 'Cold Brew House 冷萃咖啡页',
    author: 'OpenAI',
    category: '落地页',
    builtWith: 'Codex + GPT-5.5 + GPT Image 2',
    tags: ['咖啡', '品牌官网', '生活方式'],
    image: 'cold-brew-house.webp',
    summary: '一个极简冷萃咖啡落地页，用产品故事和生活方式图像组织内容。',
    sourceUrl: `${source}coffee-house-landing-page`,
    liveUrl: 'https://openai-landing-page-examples.vercel.app/cold-brew-house/',
  },
  {
    id: 'theme-park-builder',
    title: '主题乐园建造器',
    author: 'OpenAI',
    category: '游戏',
    builtWith: 'Codex + GPT-5.5 + GPT Image 1.5',
    tags: ['经营游戏', '等距视角', '视觉生成'],
    image: 'theme-park.webp',
    summary: '一个可以添加游乐设施、道路、商店和景观的主题乐园建造小游戏。',
    sourceUrl: `${source}theme-park-builder`,
    liveUrl: 'https://openai-miniapps-examples.vercel.app/themepark-5p5/',
  },
  {
    id: 'golden-gate-flight-experience',
    title: '金门大桥飞行体验',
    author: 'OpenAI',
    category: '3D 应用',
    builtWith: 'Codex + GPT-5.5',
    tags: ['3D', '飞行', '场景探索'],
    image: 'golden-gate.webp',
    summary: '一个可以围绕金门大桥飞行、切换视角并调节场景的电影感体验。',
    sourceUrl: `${source}golden-gate-flight-experience`,
    liveUrl: 'https://openai-miniapps-examples.vercel.app/bridge-5p5/',
  },
  {
    id: 'procedural-city-generator',
    title: '程序化城市生成器',
    author: 'OpenAI',
    category: '3D 应用',
    builtWith: 'Codex + GPT-5.5',
    tags: ['3D', '程序化生成', '城市'],
    image: 'city-generator.webp',
    summary:
      '一个浏览器 3D 城市生成器，可实时调整布局、密度、天际线和视觉参数。',
    sourceUrl: `${source}procedural-city-generator`,
    liveUrl: 'https://openai-city-generator-demo.vercel.app/',
  },
  {
    id: 'codex-101',
    title: 'Codex 101 双语教程',
    author: 'Seowoo Han',
    category: '教程',
    builtWith: 'Codex + GPT-5.3-Codex + OpenAI Docs MCP + Computer Use',
    tags: ['教程', 'Codex', '双语'],
    image: 'codex-101.webp',
    summary:
      '一个帮助开发者学习 CLI、桌面端、IDE 和 Web 工作流的 Codex 101 双语教程。',
    sourceUrl: `${source}codex-101`,
    liveUrl: 'https://swhan0329.github.io/codex-101/',
  },
  {
    id: 'typewriterweb',
    title: '1999 年 TypewriterWeb 复原',
    author: 'Marcio S Galli',
    category: '复原',
    builtWith: 'Codex + GPT-5.4',
    tags: ['复古 Web', '修复', '静态站'],
    image: 'typewriterweb.webp',
    summary: '一个用 Codex 5.4 复原的 1999 年 DHTML 演示。',
    sourceUrl: `${source}typewriterweb`,
    liveUrl:
      'https://taboca.github.io/good-old-days-dhtml-demos-typewriter/demo-typewriter/',
  },
  {
    id: 'turn-based-rpg',
    title: '回合制 RPG',
    author: 'OpenAI',
    category: '游戏',
    builtWith: 'Codex + GPT-5.4',
    tags: ['RPG', '回合制', '叙事'],
    image: 'trpg.webp',
    summary:
      '一个浏览器演示，把 GPT-5.4 变成带战斗循环和叙事选择的回合制 RPG。',
    sourceUrl: `${source}turn-based-rpg`,
    liveUrl: 'https://trpg-demo-codex.vercel.app/',
  },
  {
    id: 'real-estate-data-viz',
    title: '巴黎房地产数据可视化',
    author: 'OpenAI',
    category: '数据应用',
    builtWith: 'Codex + GPT-5.4',
    tags: ['数据可视化', 'MCP', '房地产'],
    image: 'real-estate-data.webp',
    summary: '一个使用法国政府 MCP 服务洞察巴黎房地产市场的可视化应用。',
    sourceUrl: `${source}real-estate-data-viz`,
    liveUrl: 'https://real-estate-dataviz-demo.vercel.app/',
  },
  {
    id: 'e-commerce-website',
    title: '电商网站演示',
    author: 'OpenAI',
    category: '电商',
    builtWith: 'Codex + GPT-5.4',
    tags: ['电商', '商品浏览', '视觉生成'],
    image: 'ecommerce.webp',
    summary: '一个零售店铺演示，包含商品浏览、商品详情和购物流程。',
    sourceUrl: `${source}e-commerce-website`,
    liveUrl: 'https://ecommerce-codex-demo.vercel.app/',
  },
];

export const showcaseCategories = [
  '全部',
  '落地页',
  '电商',
  '3D 应用',
  '游戏',
  '教程',
  '复原',
  '数据应用',
];

export function findShowcaseProject(id: string) {
  return showcaseProjects.find((project) => project.id === id);
}
