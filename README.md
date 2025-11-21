# HackDeacon Portfolio | 个人作品网站

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-212121?style=for-the-badge&logo=github&logoColor=white)](https://hackdeacon.github.io)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)

**Language :** 中文 | [English](README_EN.md)

> 皆为悦己而作 - Digital Craftsman's Portfolio

</div>

## 📖 项目简介

这是我的个人作品展示网站的源代码，由纯 HTML、CSS 和 JavaScript 构建，无任何框架依赖。网站以**草稿纸美学**为设计灵感，在 GitHub Pages 上自动部署。

访问地址：[https://hackdeacon.github.io/](https://hackdeacon.github.io/)

## ✨ 核心特色

### 🎨 设计理念
- **草稿纸美学**：温暖米白基底配柔和纹理网格
- **极简黑白银配色**：黑、白、银灰配色，局部红色点缀
- **响应式布局**：从移动设备到 4K 显示器的完美适配
- **原生系统字体**：无外部字体依赖，快速加载

### 📱 功能模块

#### 🏠 Hero 首页
- **动态 Logo 切换**：黑白/红 Logo 悬停切换，带扫光动画
- **头像展示**：精美圆形头像，玻璃拟态边框
- **个人标语**："皆为悦己而作"中文标语
- **技能标签**：快速展示核心技能

#### 💡 技能展示
分三大类别展示技能栈：
- **开发技能**：Vue 3、Vite、TypeScript、Pinia、Tailwind CSS
- **数码技能**：Apple、LUMIX、DJI、ASUS、AMD、NVIDIA（产品生态）
- **创作技能**：Final Cut Pro、After Effects、Premiere、DaVinci Resolve

#### 🚀 项目作品
- **卡片式展示**：精美圆角卡片，16:9 比例图片
- **悬停交互**：二维码/链接悬停显示
- **技术标签**：项目所用技术栈
- **当前项目**：
  - 黑胶故事（VitePress 博客）
  - 赛事助手（微信小程序）

#### 📺 内容频道
四大平台链接：
- **微信公众号** + **视频号**
- **Bilibili** + **YouTube**
- **悬停显示**：二维码/频道截图预览
- **内容定位**：产品体验 / 技术分享 / 生活记录

#### 🎪 交互体验
- **平滑滚动**：自定义偏移量的导航滚动
- **滚动动画**：IntersectionObserver 实现的渐显动画
- **悬停效果**：多层视觉反馈（卡片上浮、Logo 扫光）
- **导航高亮**：实时显示当前激活区域

## 🛠️ 技术架构

### 核心技术栈
- **HTML5**：语义化标记，ARIA 可访问性支持
- **CSS3**：现代 CSS 特性，无预处理器
- **JavaScript ES6+**：原生 DOM 操作，无框架依赖

### 现代 CSS 特性
- **CSS 自定义属性**：完整设计令牌系统
  - 颜色系统：草稿纸风格配色
  - 布局变量：智能间距和断点
  - 阴影系统：层次感阴影效果
- **网格布局**：CSS Grid 构建复杂布局
- **弹性盒**：Flexbox 实现灵活组件
- **流体排版**：clamp()、min()、max() 函数
- **圆角设计**：统一 18px 圆角半径

### 性能优化技术
- **GPU 加速**：`translateZ(0)` 硬件加速
- **懒加载**：原生 `loading="lazy"` 实现
- **内容可见性**：`content-visibility: auto` 提升滚动性能
- **图片优化**：`decoding="async"` 异步解码
- **CSS 包含**：`contain` 属性限制重排范围
- **字体策略**：原生系统字体栈，零外部依赖
- **代码分割**：模块化 CSS 结构

### 可访问性 (A11y)
- **语义化 HTML**：正确 section 和 heading 结构
- **ARIA 属性**：适当的 aria-label 和 aria-hidden
- **颜色对比度**：符合 WCAG 标准
- **键盘导航**：平滑滚动和焦点管理
- **减少运动**：`prefers-reduced-motion` 支持
- **触摸优化**：移除点击闪烁，增大触摸区域

## 📐 设计系统

### 色彩系统
```css
--bg: #faf7f0;           /* 温暖米白基底 */
--panel: #ffffff;        /* 纯白面板 */
--text: #1f2022;         /* 深灰文字 */
--muted: #5a5245;        /* 暖灰辅助 */
--accent: #c0c0c0;       /* 银灰点缀 */
```

### 排版系统
- **衬线字体**：Charter / Cambria / Georgia / serif
- **等宽字体**：SF Mono / Cascadia Code / monoid / monospace
- **响应式字号**：clamp() 函数实现流体排版

### 布局系统
- **响应式断点**：560px / 768px / 900px / 1024px
- **容器宽度**：min(1200px, 92%)
- **网格纹理**：36px 基线网格（移动端 28px）

## 🚀 开发指南

### 本地开发
```bash
# 克隆项目
git clone https://github.com/hackdeacon/hackdeacon.github.io.git

# 进入目录
cd hackdeacon.github.io

# 启动本地服务器（任选其一）
# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000

# 访问：http://localhost:8000
```

### 部署方式
网站通过 **GitHub Pages** 自动部署：
- 推送到 `main` 分支自动触发部署
- 部署地址：https://hackdeacon.github.io
- 部署时间：通常 30 秒内完成

### 浏览器兼容性
- **必须支持**：Chrome 90+ | Firefox 88+ | Safari 14+ | Edge 90+
- **部分支持**：IE 11（核心功能可访问）
- **预期特性**：CSS 变量、Grid、Flexbox、clamp()

### 性能指标
- **Lighthouse 评分**：预计 95+ 全绿
- **首次内容渲染 (FCP)**：< 1.5s
- **最大内容渲染 (LCP)**：< 2.5s
- **累计布局偏移 (CLS)**：< 0.1
- **零外部依赖**：无 CDN 资源，纯本地加载

## 📦 项目结构

```
.
├── index.html              # 主页面
├── style.css               # 样式文件 (28KB)
├── script.js               # 交互脚本 (3.4KB)
├── README.md               # 项目文档
├── assets/
│   └── images/             # 图片资源
│       ├── avatar/         # 头像
│       ├── logo/           # Logo
│       └── covers/         # 项目封面
└── .github/
    └── workflows/          # GitHub Actions

总计大小：约 50KB（不含图片）
```

## 🌟 独特亮点

### 1. 草稿纸美学
独创的纹理网格背景，36px 基线网格营造纸本质感，从复杂到简单的渐进式设计（桌面端 → 移动端）。

### 2. 动态 Logo 系统
黑白与红色 Logo 的悬停切换，配合扫光动画，创造独特的品牌交互体验。

### 3. 无依赖架构
从零构建，无框架、无库、无外部依赖，纯粹原生 Web 技术的极致实践。

### 4. 频道预览系统
社交媒体卡片悬停显示二维码和频道截图，提供即时预览体验。

### 5. 性能至上
超过 10 项性能优化技术，实现零外部依赖下的极致性能。

## 🎯 使用场景

- **个人作品展示**：展示开发技能、项目经验
- **内容创作导航**：链接到各大内容平台
- **技能可视化**：清晰展示技术栈和能力范围
- **个人品牌塑造**：独特设计美学留下深刻印象

## 🤝 定制化指南

### 修改个人信息
编辑 `index.html` 中的以下内容：
```html
<!-- 头像 -->
<img class="avatar" src="你的头像地址">

<!-- Logo -->
<img class="logo-img primary" src="黑白logo">
<img class="logo-img alt" src="红色logo">

<!-- 名称和标语 -->
<h1 class="name">你的名字</h1>
<p class="slogan">你的标语</p>

<!-- 社交链接 -->
<a href="你的GitHub地址">
<a href="你的Email地址">
<a href="你的X地址">
```

### 修改技能列表
编辑 `index.html` 中的 `.skills-grid` 区域：
```html
<h3>类别标题</h3>
<div class="tag">技能名称</div>
```

### 添加新项目
在 `.projects-grid` 中添加 `.project-card`：
```html
<div class="project-card">
  <div class="project-image" style="background-image: url('项目图片')">
  </div>
  <div class="project-body">
    <h3 class="project-title">项目名称</h3>
    <p class="project-description">项目描述</p>
    <div class="tech-stack">
      <span class="tech-tag">技术</span>
    </div>
  </div>
</div>
```

## 📝 更新日志

### 2025-11-21
- ✅ 字体系统重构：优化系统字体栈（Charter/SF Mono）
- ✅ 移除冗余字体声明
- ✅ 桌面端装订线动画优化
- ✅ 移动端布局居中修复

### 2025-11-20
- ✅ 完成个人主页重构
- ✅ 添加草稿纸纹理背景
- ✅ 实现响应式网格系统
- ✅ 优化移动端体验

## 🔮 未来规划

- [ ] 深色模式支持（基于 `prefers-color-scheme`）
- [ ] 博客功能集成
- [ ] 国际化支持（i18n）
- [ ] 服务器端渲染优化
- [ ] PWA 支持 + 离线缓存
- [ ] 更丰富的动画效果
- [ ] 深色模式下的 Logo 变体

## 📄 许可证

本项目采用 **MIT 许可证** - 查看 [LICENSE](LICENSE) 文件了解更多。

## 🙏 致谢

- 设计灵感：草稿纸美学
- 字体：系统原生字体（Charter, SF Mono）
- 图标：Simple Icons CDN
- 托管：GitHub Pages
- 编辑器：VS Code + Claude

---

<div align="center">

**Made with ❤️ by hackdeacon**

**Powered by Pure Web Technologies**

</div>
