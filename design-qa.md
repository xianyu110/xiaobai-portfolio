# Codexdown 复刻设计验收

source visual truth path: `/Users/chinamanor/.codex/visualizations/2026/08/13/019ffaab-267b-7112-8355-c212edc45fc4/codexdown-source/`
implementation screenshot path: `/tmp/codexdown-qa/`

## Viewports and states

- Desktop: `1440 x 900`, 首页顶部和完整页面；源站证据为 `source-desktop-00000.png` 与分段截图，实现证据为 `final-desktop-1440.png` 与 `final-desktop-full.png`。
- Mobile: `390 x 844`, 首页顶部和完整页面；源站证据为 `source-mobile-00000.png` 与分段截图，实现证据为 `final-mobile-390.png` 与 `final-mobile-full.png`。
- Default state: 首屏、个人价格方案、CodexSkin 皮肤 1、对比滑杆 50%、助手步骤 1、FAQ 第 1 项展开。
- Focused states: 团队价格页签、助手步骤 2、FAQ 第 2 项展开、CodexSkin 皮肤切换与对比滑杆、复制安装命令。

## Comparison evidence

源站首屏使用蓝紫渐变背景、白色网格玻璃面板、左右分栏 hero；实现保持同样的背景、圆角、层级、标题换行和移动端单列结构。源站页面的模型、价格、插件、助手、教程、工作流和 FAQ 区域均已在实现中保留，并使用捕获的真实图像资源。

Focused region comparison checked fonts/typography, spacing/layout rhythm, colors/tokens, image quality and copy/content. 本地实现截图与源站同 viewport 对比后，未发现 P0/P1/P2 级残留差异。

## Interaction checks

- 复制按钮触发 `navigator.clipboard` 并显示反馈。
- 价格页签在个人方案与团队方案间切换，团队态显示 2 张卡片。
- CodexSkin 缩略图切换当前图片，range 控制对比分割位置。
- 个人助手四个步骤切换图片与说明文字。
- FAQ 项目可展开/收起，并维护 `aria-expanded`。
- 桌面/移动控制台错误均为 0，首页没有 ShipAny React Query Devtools 浮层。

## Comparison history

1. 初始实现发现深色主 CTA 的链接文字继承了页面黑色，导致桌面截图中不可见（P1）。将 `.cd-button-dark` 提升为 `.cd-page .cd-button-dark` 后重拍桌面与移动截图，文字已为白色。
2. 初始移动截图继承了交互后的滚动位置，重新滚动到 `scrollY=0` 后重拍，首屏与源站状态一致。

## Follow-up Polish

- P3：源站使用系统 Segoe/PingFang 字体组合，本地使用 ShipAny 已有 Inter 与系统中文回退，字形会因机器略有差异。
- P3：源站完整页面包含更多外链文章详情页，本次按首页核心路径保留内容入口，不新增外部页面实现。

final result: passed

## Showcase 页面验收（2026-08-14）

源站证据：`https://codexdown.cc/showcase/`，已检查桌面端和 `390 x 844` 移动端完整结构、18 个案例、筛选器、搜索框与卡片链接。

实现范围：新增 `/showcase` 索引页和 `/showcase/$id` 详情页；精选案例为三列，全部案例桌面四列、移动单列；18 张缩略图已下载至 `public/codexdown/showcase/`，无热链资源。搜索会匹配标题、作者、分类、构建方式和标签，分类按钮可筛选结果。

验证记录：

- `pnpm exec prettier --write ...` 通过。
- `pnpm exec tsc --noEmit` 通过。
- `DATABASE_PROVIDER=none NITRO_COMPATIBILITY_DATE=2026-08-13 pnpm cf:build` 通过，数据库初始化显示 skipped。
- 本地 `http://localhost:3000/showcase` 桌面/移动布局可渲染；搜索 `SwiftUI` 返回 2 个案例。
- `http://localhost:3000/showcase/watchmaker-landing-page` 详情页返回 200，官方来源、在线演示和返回索引链接可用。
- 浏览器仅记录现有无数据库认证端点 `/api/auth/get-session` 的 500，不影响 Showcase 页面渲染或交互。

final result: passed

## Article and guide extension (2026-08-13)

Source evidence path: `/tmp/codexdown-articles-source/` and `/tmp/codexdown-pages-source/`

Implemented content:

- Replaced generic article placeholders with source-grounded sections for all 8 non-installation articles, including configuration examples, SQL, troubleshooting and FAQs.
- Added the source site's seven platform/update pages through `/updates/`, `/windows/`, `/mac/`, `/cli/`, `/vscode/`, `/cursor/` and `/windsurf/`.
- Added a unified `/guides/` index and guide navigation, while keeping source-compatible root aliases.
- Added all article details and guide entries to the generated sitemap.
- Connected homepage tutorial cards to their corresponding article details and added a full article index link.

Verification:

- `pnpm exec tsc --noEmit`, Prettier and `pnpm build` passed.
- Local article, guide and source-compatible alias routes returned `200`.
- Production HTTPS checks returned `200` for article details, guide pages, aliases and sitemap.
- Live article content contains source-grounded headings and configuration guidance; no horizontal overflow was introduced by the content expansion.
- Cloudflare Worker remains database-free with only `ASSETS` and `DATABASE_PROVIDER=none` bindings.

final result: passed

## Inner-page extension (2026-08-13)

Source evidence path: `/Users/chinamanor/Downloads/cursor/shipany-tanstack/.codexdown-inner-source/`

Implemented routes:

- `/articles/`: 8-card Codex article collection matching the captured source index.
- `/articles/codex-client-installation-guide-2026/`: long-form Windows installation guide with headings, quote, bullets and PowerShell code block.
- `/docs/`: documentation overview with category bar, sidebar navigation, overview hero and topic cards.
- `/docs/quickstart/`: documentation detail with sidebar, desktop/Web tabs, copy-code control and adjacent-document navigation.

Inner-page checks:

- Desktop and mobile article routes render without horizontal overflow.
- Article list reports 8 cards, matching the source collection; the installation guide remains reachable from the homepage CTA as a dedicated detail route.
- Browser titles are now page-specific instead of the ShipAny default title.
- Web tab sets `aria-selected=true`; copy-code control updates its visual state and copies the example text.
- Browser console errors: 0.

final result: passed
