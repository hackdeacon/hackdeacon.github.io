/**
 * hackdeacon - Dynamic Resume Renderer
 * Renders resume from resume.json with robust fallback and interactive features
 */

(function () {
    const APP_CONTAINER_ID = 'resumeApp';
    const TOAST_ID = 'toastBox';
    const TOAST_MSG_ID = 'toastMessage';

    // Helper: Toast message
    let toastTimer = null;
    function showToast(message) {
        const toast = document.getElementById(TOAST_ID);
        const toastMsg = document.getElementById(TOAST_MSG_ID);
        if (!toast || !toastMsg) return;

        if (toastTimer) clearTimeout(toastTimer);
        toastMsg.textContent = message;
        toast.classList.add('show');
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2400);
    }

    // Helper: Copy to clipboard
    async function copyText(text, successMsg) {
        if (!text) return;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const input = document.createElement('textarea');
                input.value = text;
                input.style.position = 'fixed';
                input.style.opacity = '0';
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
            }
            showToast(successMsg || `已复制：${text}`);
        } catch (err) {
            showToast(`复制失败，内容为：${text}`);
        }
    }

    // Render 1: Header (Basic Info)
    function renderHeader(basic) {
        if (!basic) return '';

        const contactsHtml = (basic.contacts || []).map((c) => {
            const iconHtml = `<i class="ti ${c.icon || 'ti-point'}"></i>`;
            let contentHtml = '';

            if (c.href) {
                contentHtml = `<a href="${c.href}" ${c.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''} title="${c.copyable ? '点击联系或复制' : c.label}">${c.label}</a>`;
            } else {
                const displayLabel = c.prefix ? `${c.prefix}${c.label}` : c.label;
                contentHtml = `<span class="${c.copyable ? 'contact-clickable' : ''}" title="${c.copyable ? '点击复制' : displayLabel}">${displayLabel}</span>`;
            }

            return `
                <div class="contact-item contact-item-${c.type || 'default'}" data-copyable="${c.copyable ? 'true' : 'false'}" data-copy-val="${c.copyValue || c.label}">
                    ${iconHtml}
                    ${contentHtml}
                </div>
            `;
        }).join('');

        return `
            <header class="resume-header">
                <div class="header-info">
                    ${(basic.status || basic.tag) ? `
                    <div class="header-badge-row">
                        ${basic.status ? `
                        <span class="status-badge">
                            <span class="status-dot"></span>
                            <span>${basic.status}</span>
                        </span>` : ''}
                        ${basic.tag ? `<span class="header-tag">${basic.tag}</span>` : ''}
                    </div>` : ''}
                    <div class="header-name-row">
                        <h1 class="resume-name">${basic.name || ''}</h1>
                        ${basic.alias ? `<span class="resume-alias">${basic.alias}</span>` : ''}
                    </div>
                    ${basic.headline ? `<p class="resume-headline">${basic.headline}</p>` : ''}
                    <div class="contact-grid">
                        ${contactsHtml}
                    </div>
                </div>
                ${basic.avatar ? `
                <div class="header-avatar-col">
                    <img src="${basic.avatar}" class="resume-avatar" alt="${basic.name || '头像'}" width="108" height="108" loading="eager" fetchpriority="high">
                </div>` : ''}
            </header>
        `;
    }

    // Render 2: Summary & Highlights
    function renderSummary(summary) {
        if (!summary) return '';

        const highlightsHtml = (summary.highlights || []).map((h) => `
            <div class="highlight-card">
                <div class="highlight-card-title">
                    <i class="ti ${h.icon || 'ti-star'}"></i>
                    <span>${h.title || ''}</span>
                </div>
                <div class="highlight-card-desc">
                    ${h.desc || ''}
                </div>
            </div>
        `).join('');

        let contentHtml = '';
        if (Array.isArray(summary.content)) {
            contentHtml = summary.content.map(p => `<p class="summary-para">${p}</p>`).join('');
        } else if (typeof summary.content === 'string') {
            const paragraphs = summary.content
                .split(/<br\s*\/?>|\n\s*\n/i)
                .map(p => p.trim())
                .filter(Boolean);
            contentHtml = paragraphs.map(p => `<p class="summary-para">${p}</p>`).join('');
        }

        return `
            <section class="resume-section">
                <div class="section-header">
                    <i class="section-icon ti ${summary.icon || 'ti-user'}"></i>
                    <h2 class="section-title">${summary.title || '个人简介'}</h2>
                </div>
                ${contentHtml ? `
                <div class="summary-text">
                    ${contentHtml}
                </div>` : ''}
                ${highlightsHtml ? `
                <div class="summary-highlights">
                    ${highlightsHtml}
                </div>` : ''}
            </section>
        `;
    }

    // Render 3: Skills
    function renderSkills(skills) {
        if (!skills) return '';

        const categoriesHtml = (skills.categories || []).map((cat) => {
            const tagsHtml = (cat.tags || []).map((tag) => `<span class="tech-tag">${tag}</span>`).join('');
            return `
                <div class="skill-category-card">
                    <div class="skill-category-header">
                        <span class="skill-category-name">
                            <i class="skill-category-icon ti ${cat.icon || 'ti-code'}"></i>
                            <span>${cat.name || ''}</span>
                        </span>
                    </div>
                    <div class="tags-wrapper">
                        ${tagsHtml}
                    </div>
                    ${cat.desc ? `<p class="skill-desc">${cat.desc}</p>` : ''}
                </div>
            `;
        }).join('');

        return `
            <section class="resume-section">
                <div class="section-header">
                    <i class="section-icon ti ${skills.icon || 'ti-code'}"></i>
                    <h2 class="section-title">${skills.title || '专业技术栈'}</h2>
                    ${skills.badge ? `<span class="section-badge">${skills.badge}</span>` : ''}
                </div>
                <div class="skills-container">
                    ${categoriesHtml}
                </div>
            </section>
        `;
    }

    // Render 4: Experience
    function renderExperiences(experiences) {
        if (!experiences || !experiences.list) return '';

        const itemsHtml = experiences.list.map((exp) => {
            const pointsHtml = (exp.points || []).map((pt) => `<li>${pt}</li>`).join('');
            return `
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-item-header">
                        <div class="timeline-role-company">
                            <span class="timeline-title">${exp.role || ''}</span>
                            ${exp.company ? `<span class="timeline-org">${exp.company}</span>` : ''}
                        </div>
                        <div class="timeline-meta">
                            ${exp.date ? `<span class="timeline-date">${exp.date}</span>` : ''}
                            ${exp.location ? `<span class="timeline-location">${exp.location}</span>` : ''}
                        </div>
                    </div>
                    ${pointsHtml ? `
                    <ul class="timeline-list">
                        ${pointsHtml}
                    </ul>` : ''}
                </div>
            `;
        }).join('');

        return `
            <section class="resume-section">
                <div class="section-header">
                    <i class="section-icon ti ${experiences.icon || 'ti-briefcase'}"></i>
                    <h2 class="section-title">${experiences.title || '工作经历'}</h2>
                    ${experiences.badge ? `<span class="section-badge">${experiences.badge}</span>` : ''}
                </div>
                <div class="timeline">
                    ${itemsHtml}
                </div>
            </section>
        `;
    }

    // Render 5: Projects
    function renderProjects(projects) {
        if (!projects || !projects.list) return '';

        const cardsHtml = projects.list.map((p) => {
            const achievementsHtml = (p.achievements || []).map((a) => `<li>${a}</li>`).join('');
            const tagsHtml = (p.tags || []).map((t) => `<span class="tech-pill">${t}</span>`).join('');

            // Support multiple project links:
            // 1) p.links[] (recommended, supports any number of links)
            // 2) p.link + p.link2 (backward compatible)
            const linkItems = Array.isArray(p.links)
                ? p.links
                    .map((l) => ({
                        href: l.href || l.link || '',
                        label: l.label || l.linkLabel || '访问项目',
                        icon: l.icon || 'ti-external-link'
                    }))
                    .filter((l) => l.href)
                : [
                    p.link ? { href: p.link, label: p.linkLabel || '访问项目', icon: 'ti-external-link' } : null,
                    p.link2 ? { href: p.link2, label: p.link2Label || '访问项目', icon: 'ti-external-link' } : null
                ].filter(Boolean);

            const linksHtml = linkItems.map((l) => `
                <a href="${l.href}" target="_blank" rel="noopener" class="project-link-btn">
                    <span>${l.label}</span>
                    <i class="ti ${l.icon}"></i>
                </a>`).join('');

            return `
                <div class="project-entry-card">
                    <div class="project-entry-header">
                        <div class="project-title-group">
                            <h3 class="project-entry-title">${p.title || ''}</h3>
                            ${p.type ? `<span class="project-type-badge">${p.type}</span>` : ''}
                        </div>
                        ${linksHtml ? `
                        <div class="project-links">
                            ${linksHtml}
                        </div>` : ''}
                    </div>
                    ${p.desc ? `<p class="project-desc-text">${p.desc}</p>` : ''}
                    ${achievementsHtml ? `
                    <ul class="project-achievements">
                        ${achievementsHtml}
                    </ul>` : ''}
                    ${tagsHtml ? `
                    <div class="project-footer-tags">
                        ${tagsHtml}
                    </div>` : ''}
                </div>
            `;
        }).join('');

        return `
            <section class="resume-section">
                <div class="section-header">
                    <i class="section-icon ti ${projects.icon || 'ti-sparkles'}"></i>
                    <h2 class="section-title">${projects.title || '精选项目经历'}</h2>
                    ${projects.badge ? `<span class="section-badge">${projects.badge}</span>` : ''}
                </div>
                <div class="projects-container">
                    ${cardsHtml}
                </div>
            </section>
        `;
    }

    // Render 6: Education
    function renderEducation(education) {
        if (!education || !education.list) return '';

        const cardsHtml = education.list.map((edu) => {
            const certs = edu.certificates || edu.tags || edu.honors || [];
            const certsHtml = certs.length ? `
                <div class="edu-tags-wrapper">
                    ${certs.map(c => {
                        const text = typeof c === 'string' ? c : (c.name || c.title || '');
                        const icon = (typeof c === 'object' && c.icon) ? c.icon : 'ti-certificate';
                        return `<span class="edu-tag"><i class="ti ${icon}"></i>${text}</span>`;
                    }).join('')}
                </div>
            ` : '';

            return `
                <div class="edu-card">
                    <div class="edu-header">
                        <span class="edu-major">${edu.major || ''}</span>
                        ${edu.time ? `<span class="edu-time">${edu.time}</span>` : ''}
                    </div>
                    ${edu.degree ? `<div class="edu-degree">${edu.degree}</div>` : ''}
                    ${edu.desc ? `<p class="edu-desc">${edu.desc}</p>` : ''}
                    ${certsHtml}
                </div>
            `;
        }).join('');

        const topCerts = education.certificates || education.certifications || [];
        const topCertsHtml = topCerts.length ? `
            <div class="edu-tags-wrapper" style="margin-top: 16px;">
                ${topCerts.map(c => {
                    const text = typeof c === 'string' ? c : (c.name || c.title || '');
                    const icon = (typeof c === 'object' && c.icon) ? c.icon : 'ti-certificate';
                    return `<span class="edu-tag"><i class="ti ${icon}"></i>${text}</span>`;
                }).join('')}
            </div>
        ` : '';

        return `
            <section class="resume-section">
                <div class="section-header">
                    <i class="section-icon ti ${education.icon || 'ti-school'}"></i>
                    <h2 class="section-title">${education.title || '教育背景'}</h2>
                </div>
                <div class="edu-grid">
                    ${cardsHtml}
                </div>
                ${topCertsHtml}
            </section>
        `;
    }

    // Main App Renderer
    function renderResume(data) {
        const container = document.getElementById(APP_CONTAINER_ID);
        if (!container) return;

        const html = [
            renderHeader(data.basic),
            renderSummary(data.summary),
            renderSkills(data.skills),
            renderExperiences(data.experiences),
            renderProjects(data.projects),
            renderEducation(data.education)
        ].join('');

        container.innerHTML = html;

        // Bind copy actions for contact items
        container.querySelectorAll('.contact-item[data-copyable="true"]').forEach((item) => {
            const val = item.getAttribute('data-copy-val');
            const linkOrSpan = item.querySelector('a, .contact-clickable');
            if (linkOrSpan && val) {
                linkOrSpan.addEventListener('click', (e) => {
                    // If it's a mailto link, allow default or copy
                    copyText(val, `已复制：${val}`);
                });
            }
        });
    }

    const FALLBACK_DATA = {
  "basic": {
    "name": "黑衣执事",
    "realName": "邱天麟",
    "alias": "hackdeacon",
    "avatar": "https://rz.hackdeacon.cn/hack-640.webp",
    "status": "积极寻找新机会 · 随时到岗 · 支持远程",
    "tag": "04年·26届",
    "headline": "Web 全栈开发 · AI 技术内容编辑 · AI 新媒体运营",
    "contacts": [
      {
        "type": "location",
        "icon": "ti-map-pin",
        "label": "汕头 / 广州 / 深圳"
      },
      {
        "type": "email",
        "icon": "ti-mail",
        "label": "hackdeacon@gmail.com",
        "href": "mailto:hackdeacon@gmail.com",
        "copyable": true
      },
      {
        "type": "wechat",
        "icon": "ti-brand-wechat",
        "label": "GotoVlog",
        "prefix": "",
        "copyable": true
      },
      {
        "type": "link",
        "icon": "ti-world",
        "label": "个人主页",
        "href": "https://hackdeacon.cn"
      },
      {
        "type": "link",
        "icon": "ti-book",
        "label": "Blog",
        "href": "https://hackstory.cn"
      },
      {
        "type": "link",
        "icon": "ti-brand-github",
        "label": "GitHub",
        "href": "https://github.com/hackdeacon"
      }
    ]
  },
  "summary": {
    "title": "个人简介 & 核心优势",
    "icon": "ti-user",
    "content": "<strong>邱天麟</strong>，具备 Web 全栈开发实践经验，能够使用 AI Coding 工具辅助完成产品开发、调试与迭代。<br>长期关注 LLM、Harness、Agent 等前沿内容，对 AI 产品有较丰富的体验和研究兴趣。<br>同时具备 AI 技术内容创作与新媒体运营经验，能够从技术研究、产品体验中提炼选题，完成内容策划、撰写、编辑及多平台发布。",
    "highlights": [
      {
        "icon": "ti-bolt",
        "title": "Web 全栈开发",
        "desc": "专注现代 Web 开发，具备企业级与个人项目实践经验，熟悉移动端适配、i18n 国际化及前后端开发流程。独立搭建个人主页、博客、图床等项目，具备 Git、Cloudflare、Linux VPS 及项目部署运维经验。"
      },
      {
        "icon": "ti-robot",
        "title": "AI Coding",
        "desc": "深入 LLM 生态，熟悉 Prompt 工程，熟练使用 Codex、Claude Code、OpenCode、DeepSeek Harness 等 Agent 产品，拥有完整的 AI 产品开发交付经历。"
      },
      {
        "icon": "ti-movie",
        "title": "公众号运营",
        "desc": "独立运营微信公众号，负责选题策划、内容创作、编辑发布及数据复盘，持续输出 AI、科技与产品相关内容，累计发布 50+ 篇，其中 10+ 篇单篇阅读量破万。"
      }
    ]
  },
  "skills": {
    "title": "专业技术栈",
    "icon": "ti-code",
    "badge": "Skill Matrix",
    "categories": [
      {
        "name": "前端开发",
        "icon": "ti-device-desktop",
        "tags": [
          "HTML",
          "CSS",
          "TypeScript",
          "Vue",
          "React"
        ],
        "desc": "熟练掌握 React 生态与 Next.js App Router 架构；熟悉响应式布局、移动端交互、Web 动画与深浅色自适应；擅长首屏性能调优（FCP / CLS 核心 Web 指标）。"
      },
      {
        "name": "后端与云原生",
        "icon": "ti-server",
        "tags": [
          "Node.js",
          "Python",
          "Cloudflare",
          "Vercel",
          "GitHub",
          "EdgeOne"
        ],
        "desc": "具备 Node.js 与 Python 服务端研发能力；精通 Cloudflare 边缘函数、全球 CDN 与对象存储构建；熟悉 Serverless 无服务器架构与自动化部署。"
      },
      {
        "name": "AI & LLM",
        "icon": "ti-brain",
        "tags": [
          "Skills 技能封装",
          "Prompt 提示词工程",
          "Agent 智能体工作流",
          "LLM API / 本地部署",
          "Harness 工程"
        ],
        "desc": "熟练进行多大模型集成与流式输出；精通结构化 JSON 解析、思维链（CoT）与角色扮演 Prompt 设计；运用 AI 编程工具（Cursor / Claude）实现高倍效能。"
      },
      {
        "name": "设计与全媒体 (Design & Media)",
        "icon": "ti-palette",
        "tags": [
          "Figma",
          "UI / UX",
          "Apple Design",
          "4K 影视制作",
          "Final Cut Pro",
          "全媒体矩阵运营"
        ],
        "desc": "遵循 Apple 现代人机交互指南；熟练运用 Figma 输出组件库与高保真原型；具备数码视频编导、脚本策划与剪辑调色全流程能力。"
      }
    ]
  },
  "experiences": {
    "title": "工作与实践经历",
    "icon": "ti-briefcase",
    "badge": "Career Journey",
    "list": [
      {
        "role": "AI 内容创作者 · 技术顾问",
        "company": "鱼鸢网络",
        "date": "2025.10 — 2026.08",
        "location": "上海 · 静安",
        "points": [
          "<strong>前沿 AI 与工具链追踪</strong>：主导生成式 AI、大模型生态（LLM）、智能编程助手及科技数码硬件的深度技术调研与原型验证。",
          "<strong>高价值技术内容输出</strong>：负责 AI 技术专题与实操教程的内容策划、演示 Demo 编写与视频全流程制作，有效传达产品价值与技术深度。",
          "<strong>研发工作流提效</strong>：探索并推广 Vibe Coding 与 Agentic 自动化工作流，编写多套自动化处理脚本，使团队内部原型搭建与测试效率提升 40% 以上。"
        ]
      },
      {
        "role": "全栈独立开发者 · 自媒体创作者",
        "company": "个人品牌 · 黑衣执事",
        "date": "2024.01 — 至今",
        "location": "广东 · 汕头 / 远程",
        "points": [
          "<strong>从 0 到 1 独立闭环</strong>：独立负责多款产品（AI 招聘求职系统 KirinGo、无畏契约赛事面板 Haclutch、边缘图床服务等）的需求分析、UI 交互设计、全栈架构编写与运维部署。",
          "<strong>Serverless 降本增效</strong>：全线产品深度依托 Cloudflare 边缘计算与无服务器架构，在保证全球毫秒级低延迟响应的同时，实现极低的运维成本。",
          "<strong>个人品牌与社区沉淀</strong>：持续运营个人技术博客「黑胶故事」及 Bilibili、YouTube、微信公众号等社交媒体矩阵，积累了极具粘性的科技与开发者受众。"
        ]
      }
    ]
  },
  "projects": {
    "title": "精选项目经历",
    "icon": "ti-sparkles",
    "badge": "Crafted Works",
    "list": [
      {
        "title": "KirinGo (麒麟狗) — 基于 LLM 的智能求职招聘平台",
        "type": "独立主导 / 全栈开发",
        "link": "https://kiringo.cn",
        "linkLabel": "访问项目",
        "desc": "针对传统招聘中“岗位要求与简历匹配效率低、求职者缺乏针对性实战辅导”的痛点，打造的一款由大语言模型驱动的一体化求职辅助平台。",
        "achievements": [
          "<strong>结构化简历解析与技能图谱</strong>：基于定制 Prompt 与 JSON Schema 严格校验，提取多维度技能标签与工作亮点，准确率显著优于传统正则匹配。",
          "<strong>人岗双向匹配与差距诊断</strong>：构建语义匹配算法，对岗位职责（JD）与候选人经历进行综合打分，生成可视化优势雷达图与改进建议。",
          "<strong>多轮沉浸式 AI 模拟面试官</strong>：设计具备动态上下文记忆的面试 Agent，支持根据面试者的即时回答自动追问深挖，配合 SSE 流式打字机响应，营造真实面试体感。"
        ],
        "tags": [
          "Next.js",
          "React",
          "TypeScript",
          "Python FastAPI",
          "LLM Streaming SSE",
          "Tailwind CSS"
        ]
      },
      {
        "title": "Haclutch — 无畏契约 (VALORANT) 电竞赛事数据面板",
        "type": "全栈开发 / 体验设计",
        "link": "https://vct.hackdeacon.cn",
        "linkLabel": "访问项目",
        "desc": "专为无畏契约（VALORANT）电竞爱好者设计的专业赛事看板，提供实时赛况追踪、战队对阵图谱与选手多维战绩数据分析。",
        "achievements": [
          "<strong>暗黑电竞视觉与组件化</strong>：融合 Apple 毛玻璃美学与电竞硬核风格，设计高信息密度的自适应暗黑看板，交互直观流畅。",
          "<strong>高性能 Canvas 数据可视化</strong>：自研轻量级雷达图与趋势折线图组件，保证在各类低端移动设备上保持 60fps 丝滑渲染。",
          "<strong>缓存策略与极速响应</strong>：建立本地分级缓存与智能轮询机制，有效缓解接口频率限制，首屏加载控制在 1 秒以内。"
        ],
        "tags": [
          "微信小程序",
          "JavaScript / TS",
          "Canvas 可视化",
          "RESTful API",
          "UI/UX 设计"
        ]
      },
      {
        "title": "HackStory (黑胶故事) — 个人技术博客与数字花园",
        "type": "主理人 / 独立构建",
        "link": "https://hackstory.cn",
        "linkLabel": "访问博客",
        "desc": "以技术沉淀与经验复盘为主旨的现代化静态数字花园，记录在全栈开发、AI 探索与数码创作中的深层思考。",
        "achievements": [
          "<strong>构建与部署自动化</strong>：依托 VitePress 与 Vue 3 体系，配置 GitHub Actions 自动触发构建，部署至 Cloudflare Pages 边缘节点。",
          "<strong>卓越的阅读体验与 SEO</strong>：集成毫秒级全文检索、平滑代码高亮、深浅色无缝切换，全站 Lighthouse 性能跑分高达 98+。"
        ],
        "tags": [
          "VitePress",
          "Vue 3",
          "Markdown",
          "Cloudflare Pages",
          "GitHub Actions"
        ]
      },
      {
        "title": "Shadow Gallery (HackGallery) — 高性能分布式边缘图床",
        "type": "开源工具 / 边缘架构",
        "link": "https://github.com/hackdeacon",
        "linkLabel": "开源仓库",
        "desc": "基于 Cloudflare Workers 边缘计算与 R2 对象存储构建的零维护成本图床系统，追求极致的全球图片加载速度。",
        "achievements": [
          "<strong>零成本 Serverless 架构</strong>：完全脱离昂贵的传统服务器托管，利用 Workers 处理上传路由、Token 校验与格式转换。",
          "<strong>安全与高可用边缘分发</strong>：结合 Web Crypto 实现请求签名鉴权与防盗链白名单机制，国内及海外平均响应延迟在 50ms 以内。"
        ],
        "tags": [
          "Cloudflare Workers",
          "Cloudflare R2",
          "Web Crypto API",
          "Edge Computing"
        ]
      }
    ]
  },
  "education": {
    "title": "教育背景",
    "icon": "ti-school",
    "list": [
      {
        "major": "广东科学技术职业学院",
        "time": "2023.09 - 2026.06",
        "degree": "专科",
        "desc": "计算机工程技术学院（人工智能学院），主攻前端开发。",
        "certificates": [
          "广东省职业院校技能大赛 · 应用软件系统开发省赛一等奖"
        ]
      }
    ]
  }
};

    // Fetch resume.json or use fallback
    async function loadResume() {
        try {
            const res = await fetch('resume.json?v=' + Date.now());
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            renderResume(data);
        } catch (err) {
            console.warn('Failed to load resume.json via fetch, using embedded fallback data.', err);
            renderResume(FALLBACK_DATA);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadResume);
    } else {
        loadResume();
    }
})();
