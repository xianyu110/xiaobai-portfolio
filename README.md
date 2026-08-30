# Xiaobai Portfolio

一个带有完整分屏动效和交互体验的个人简历网站。项目根据参考视频重新实现，并使用 ShipAny TanStack 技术栈构建，可部署到 Cloudflare Workers。

## 在线预览

[https://xiaobai.maynor1024.live](https://xiaobai.maynor1024.live)

## 页面内容

网站由五个全屏章节组成：

- `HOME`：个人介绍、打字动画、MBTI 和能力标签
- `INTERNSHIP`：实习经历卡片及详情弹窗
- `PROGRAM`：研究、实习和项目经历展示
- `CREATION`：自媒体作品和手机界面展示
- `MORE`：生活照片墙和联系入口

## 主要功能

- 深色胶囊导航与当前章节高亮
- 全屏滚动和章节平滑定位
- 首页姓名打字动画
- 项目详情弹窗
- 创作内容弹窗
- 参考视频风格的森林背景、卡通人物和照片墙
- 桌面端与移动端响应式布局
- 返回顶部快捷按钮

## 技术栈

- React 19
- TypeScript
- TanStack Start / TanStack Router
- Vite 8
- Nitro
- Cloudflare Workers
- Lucide React
- CSS 响应式布局与动画

## 主要文件

```text
src/
├── components/
│   └── portfolio-home.tsx      # 页面结构和交互逻辑
├── routes/
│   └── index.tsx               # 首页路由和 SEO 信息
└── styles/
    └── portfolio-home.css      # 页面视觉、动画和响应式样式

public/
└── portfolio/                  # 森林背景、角色和照片墙素材
```

## 本地运行

### 环境要求

- Node.js 20 或更高版本
- pnpm 10 或更高版本

### 安装与启动

```bash
git clone https://github.com/xianyu110/xiaobai-portfolio.git
cd xiaobai-portfolio
pnpm install --frozen-lockfile
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看网站。

项目可以在没有数据库和第三方服务凭据的情况下运行个人简历首页。如需启用 ShipAny 的完整后台、登录或支付功能，请根据 `.env.example` 配置对应服务。

## 构建

运行普通生产构建：

```bash
pnpm build
```

运行 Cloudflare Workers 构建：

```bash
pnpm cf:build
```

## 部署到 Cloudflare Workers

复制部署配置模板：

```bash
cp wrangler.example.jsonc wrangler.jsonc
```

个人简历首页不依赖数据库，可以在 `wrangler.jsonc` 中使用以下核心配置，并删除模板中的 `d1_databases`：

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "xiaobai-portfolio",
  "compatibility_flags": ["nodejs_compat"],
  "vars": {
    "DATABASE_PROVIDER": "none",
    "VITE_APP_URL": "https://your-domain.example",
    "VITE_APP_NAME": "小小白的个人简历",
    "VITE_APP_DESCRIPTION": "一份会动的个人简历：项目经历、创作者作品和生活灵感。",
  },
}
```

登录 Cloudflare 并执行部署：

```bash
pnpm exec wrangler login
pnpm cf:deploy
```

部署完成后，可以在 Cloudflare Workers 控制台中为 Worker 添加自定义域名。

## 常用命令

| 命令                | 说明                         |
| ------------------- | ---------------------------- |
| `pnpm dev`          | 启动本地开发服务器           |
| `pnpm build`        | 生成普通生产构建             |
| `pnpm cf:build`     | 生成 Cloudflare Workers 构建 |
| `pnpm cf:deploy`    | 构建并部署到 Cloudflare      |
| `pnpm format:check` | 检查代码格式                 |

## 素材说明

页面素材位于 `public/portfolio/`。替换图片时建议保持原文件名和接近原始素材的宽高比例，以避免角色位置、照片墙布局和移动端显示发生明显偏移。

## License

项目许可信息见 [LICENSE](./LICENSE)。
