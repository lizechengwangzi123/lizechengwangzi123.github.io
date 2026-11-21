import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import MarkdownIt from 'markdown-it';
import {
  flagshipPaper,
  manuscriptsInRevision,
  research,
  scholarMetrics,
} from './content/research.mjs';

const markdown = new MarkdownIt({ html: true, linkify: true, typographer: true });
const output = new URL('./dist/', import.meta.url);
const notesDirectory = new URL('./content/notes/', import.meta.url);

const author = '李泽城';
const authorEn = 'Zecheng Li';
const email = 'lizecheng3590@gmail.com';
const scholar = 'https://scholar.google.com/citations?user=BJvzLlcAAAAJ';
const orcid = 'https://orcid.org/0009-0002-7197-6679';
const scopusId = '59641998600';
const linkedIn = 'https://www.linkedin.com/in/zecheng-li-a7b858399/';
const cvPdf = '/assets/Zecheng_Li_Academic_CV.pdf';

const description =
  '李泽城（Zecheng Li）个人学术主页与研究博客。马来亚大学环境保护博士候选人、悉尼大学计算机科学学士与信息技术硕士、IPCC AR7 第四章专家评审。聚焦全球旱地生态水文因果发现（npj Climate and Atmospheric Science）、城市高温早期预警（CMIP6 + 机器学习）与环境数据科学。';

const origin = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : null;

const nav = [
  ['/', '首页', 'Overview'],
  ['/#research-reel', '研究短片', 'Research Reel'],
  ['/research/npj-dryland-hydroclimate/', 'npj 代表作', 'Flagship npj'],
  ['/research/', '学术发表', 'Publications'],
  ['/notes/', '科研博客', 'Research Blog'],
  ['/about/', '简历与经历', 'CV & Bio'],
];

const reelChapters = [
  { time: 0, code: '01', titleZh: '全球升温与核心发问', titleEn: 'The Warming Question', descZh: '地球正在加速变暖：谁面临最高风险？预警应在何时发出？', descEn: 'The planet is getting hotter. Who is most at risk — and when?' },
  { time: 8, code: '02', titleZh: '跨学科身份定位', titleEn: 'Cross-Disciplinary Identity', descZh: '计算机科学科班 → 数据分析硕士 → 气候风险与早期预警学者', descEn: 'Computer scientist → Data analyst → Climate-risk researcher' },
  { time: 15, code: '03', titleZh: '全球求学与科研轨迹', titleEn: 'Academic & Engineering Journey', descZh: '中国武汉 → 澳大利亚悉尼大学 (B.Sc. & M.IT) → 马来亚大学 (Ph.D.)', descEn: 'Wuhan → The University of Sydney (B.Sc. & M.IT) → Universiti Malaya (Ph.D.)' },
  { time: 28, code: '04', titleZh: '热脆弱性归因 (Sci. Rep.)', titleEn: 'Heat Vulnerability (Sci. Rep. 2026)', descZh: '马来西亚 16 州区 · Random Forest + SHAP 多尺度驱动解析 (R² = 0.86)', descEn: '16 Malaysian States · Random Forest + SHAP attribution (R² = 0.86)' },
  { time: 38, code: '05', titleZh: 'CMIP6 早期预警 (JEM)', titleEn: 'Early Warning (J. Environ. Manage. 2026)', descZh: '时间顺序留出 R² = 0.53 · 耦合 SSP1-2.6/5-8.5 与四级业务化警报仪表盘', descEn: 'Hold-out R² = 0.53 · CMIP6 trajectories & 4-tier operational alert scale' },
  { time: 48, code: '06', titleZh: '学术发表全景矩阵', titleEn: '10 Peer-Reviewed Publications', descZh: '10 篇已发表/接收论文（含 npj Clim. Atmos. Sci. 代表作）与 4 篇在审研究', descEn: '10 published/accepted papers (incl. npj flagship) + 4 under review' },
  { time: 58, code: '07', titleZh: 'IPCC AR7 评审与技术栈', titleEn: 'IPCC AR7 & Computational Toolkit', descZh: 'IPCC AR7 第四章专家评审 · ACTION 全球 Top 50 · 全栈计算工具球', descEn: 'IPCC AR7 Ch.4 Expert Reviewer · ACTION Top 50 · Full-stack toolkit' },
  { time: 68, code: '08', titleZh: '全球研究版图与使命', titleEn: 'Global Footprint & Mission', descZh: '覆盖全球天然旱地、东南亚、巴西、美国与欧盟碳市场：将气候数据转化为保护人群的早期预警', descEn: 'Turning climate data into early warnings that protect people' },
];

function renderReelSection({ english = false } = {}) {
  return `
<section class="home-section reel-section" id="research-reel" aria-labelledby="reel-heading">
  <div class="section-header">
    <div>
      <span class="section-kicker">${english ? 'INTERACTIVE RESEARCH REEL · 80-SECOND VISUAL OVERVIEW' : 'INTERACTIVE RESEARCH REEL · 80 秒个人学术与代表作动态短片'}</span>
      <h2 id="reel-heading">${english ? 'Research Reel: Turning Climate Data into Early Warnings' : '80 秒看懂我的跨学科轨迹与核心科研突破'}</h2>
    </div>
    <a class="button button-outline" href="/assets/Zecheng_Li_Research_Reel.mp4" target="_blank" rel="noopener">${english ? 'Open Full HD MP4 ↗' : '新窗口打开高清原片 (MP4) ↗'}</a>
  </div>

  <div class="reel-theater">
    <div class="reel-player-col">
      <div class="reel-video-frame">
        <video id="research-reel-video" controls preload="metadata" playsinline>
          <source src="/assets/Zecheng_Li_Research_Reel.mp4" type="video/mp4">
          ${english ? 'Your browser does not support HTML5 video.' : '您的浏览器不支持 HTML5 视频播放。'}
        </video>
      </div>
      <div class="reel-caption-bar">
        <span class="badge badge-flagship">▶ 01:20 Motion Reel</span>
        <p>${english ? 'Click any chapter on the right to jump directly to that timestamp in the video.' : '点击右侧任意章节卡片，视频将直接跳转到对应时间节点播放。'}</p>
      </div>
    </div>

    <div class="reel-chapters-col" role="region" aria-label="${english ? 'Video chapters' : '视频章节跳转'}">
      <div class="reel-chapters-header">
        <strong>${english ? '8 Interactive Chapters (Click to Seek)' : '8 大章节导览（点击即刻跳转播放）'}</strong>
        <span>00:00 – 01:20</span>
      </div>
      <div class="reel-chapter-list">
        ${reelChapters
          .map(
            (ch, idx) => `<button type="button" class="reel-chapter-btn${idx === 0 ? ' is-active' : ''}" data-seek-time="${ch.time}">
              <span class="chapter-time">00:${String(ch.time).padStart(2, '0')}</span>
              <div class="chapter-text">
                <strong><em>${ch.code}</em> ${escape(english ? ch.titleEn : ch.titleZh)}</strong>
                <span>${escape(english ? ch.descEn : ch.descZh)}</span>
              </div>
            </button>`
          )
          .join('')}
      </div>
    </div>
  </div>
</section>`;
}

const notes = [];

function escape(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function highlightAuthor(authorsText) {
  const escaped = escape(authorsText);
  return escaped
    .replace(/Li, Z\.\*/g, '<strong class="me-author">Li, Z.*</strong>')
    .replace(/Li, Z\./g, '<strong class="me-author">Li, Z.</strong>')
    .replace(/Zecheng Li\*/g, '<strong class="me-author">Zecheng Li*</strong>')
    .replace(/Zecheng Li/g, '<strong class="me-author">Zecheng Li</strong>');
}

for (const filename of (await readdir(notesDirectory)).filter(name => name.endsWith('.md')).sort()) {
  const [metadata, ...body] = (await readFile(new URL(filename, notesDirectory), 'utf8')).trim().split('\n');
  const note = JSON.parse(metadata);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(note.slug) || notes.some(item => item.slug === note.slug)) {
    throw new Error(`Invalid or duplicate note slug in ${filename}`);
  }
  note.body = body.join('\n');
  note.path = `/notes/${note.slug}/`;
  notes.push(note);
}

if (origin && !/^https?:\/\//.test(origin)) {
  throw new Error('SITE_URL must use HTTP or HTTPS');
}

function iconSvg(name) {
  const icons = {
    scholar: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3L2 9l10 6 10-6-10-6z"/><path d="M6 12.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/><path d="M22 9v7"/></svg>',
    orcid: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 10.5v5.5"/><circle cx="8.5" cy="8" r="0.6" fill="currentColor"/><path d="M11.5 16v-5.5h2.2a2.75 2.75 0 0 1 0 5.5h-2.2z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 11v5"/><path d="M8 8v.01"/><path d="M12 16v-5"/><path d="M16 16v-3a2 2 0 0 0-4 0"/></svg>',
    mail: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3.5 6.5 8.5 6 8.5-6"/></svg>',
    cv: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="m9.5 15.5 2.5 2.5 2.5-2.5"/></svg>',
    scopus: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M8.5 11h5"/><path d="M11 8.5v5"/></svg>',
    external: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>',
    copy: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>',
  };
  return icons[name] || '';
}

function profileLinks({ english = false, showCv = true } = {}) {
  return `
    <a class="profile-chip" href="${scholar}" target="_blank" rel="noopener">${iconSvg('scholar')}<span>Google Scholar</span></a>
    <a class="profile-chip" href="${orcid}" target="_blank" rel="noopener">${iconSvg('orcid')}<span>ORCID</span></a>
    <a class="profile-chip" href="https://www.scopus.com/authid/detail.uri?authorId=${scopusId}" target="_blank" rel="noopener">${iconSvg('scopus')}<span>Scopus (${scopusId})</span></a>
    <a class="profile-chip" href="${linkedIn}" target="_blank" rel="noopener">${iconSvg('linkedin')}<span>LinkedIn</span></a>
    <a class="profile-chip" href="mailto:${email}">${iconSvg('mail')}<span>${email}</span></a>
    ${showCv ? `<a class="profile-chip profile-chip-accent" href="${cvPdf}" target="_blank" rel="noopener">${iconSvg('cv')}<span>${english ? 'Academic CV (PDF)' : '下载学术简历 CV (PDF)'}</span></a>` : ''}
  `;
}

function layout(path, title, summary, children, { english = false } = {}) {
  const pageTitle =
    path === '/'
      ? '李泽城 Zecheng Li | 气候风险、环境数据科学与因果发现学术主页'
      : `${title} | Zecheng Li 李泽城`;
  const lang = english ? 'en' : 'zh-CN';
  const active = path;

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escape(summary)}">
  <meta name="author" content="Zecheng Li (李泽城)">
  <meta name="color-scheme" content="light dark">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(pageTitle)}">
  <meta property="og:description" content="${escape(summary)}">
  <meta property="og:image" content="${origin ? escape(origin) : ''}/assets/npj-fig1-workflow.jpg">
  ${
    origin && path !== '/404.html'
      ? `<link rel="canonical" href="${escape(origin + path)}">
  <meta property="og:url" content="${escape(origin + path)}">`
      : ''
  }
  ${path === '/404.html' ? '<meta name="robots" content="noindex">' : ''}
  <title>${escape(pageTitle)}</title>
  <link rel="icon" type="image/png" href="/assets/favicon.png">
  <script src="/assets/theme.js"></script>
  <link rel="stylesheet" href="/assets/site.css">
  <script defer src="/assets/site.js"></script>
</head>
<body>
  <a class="skip" href="#main">${english ? 'Skip to content' : '跳到正文'}</a>
  <header class="site-header">
    <div class="shell header-inner">
      <a class="brand" href="${english ? '/en/' : '/'}" aria-label="Zecheng Li ${english ? 'home' : '首页'}">
        <span class="monogram" aria-hidden="true">ZL</span>
        <span class="brand-text">
          <strong lang="en">Zecheng Li <span class="brand-zh" lang="zh-CN">李泽城</span></strong>
          <small>${english ? 'Ph.D. Candidate · Climate & Data Science' : '马来亚大学博士候选人 · 悉尼大学 CS & IT'}</small>
        </span>
      </a>
      <nav class="nav" aria-label="${english ? 'Main navigation' : '主导航'}">
        ${nav
          .map(([url, labelZh, labelEn]) => {
            const isCurrent =
              active === url ||
              (url === '/research/' && active === '/research/') ||
              (url === '/notes/' && active.startsWith('/notes/'));
            return `<a href="${url}"${isCurrent ? ' aria-current="page"' : ''}>${english ? labelEn : labelZh}</a>`;
          })
          .join('')}
      </nav>
      <div class="header-controls">
        <a class="cv-nav-btn" href="${cvPdf}" target="_blank" rel="noopener">${iconSvg('cv')}<span>CV.pdf</span></a>
        <a class="lang-link" href="${english ? '/' : '/en/'}" lang="${english ? 'zh-CN' : 'en'}" title="${english ? '切换到中文主页' : 'Switch to English Academic Profile'}">${english ? '中文' : 'EN'}</a>
        <button class="icon-button theme-toggle" type="button" aria-label="${english ? 'Toggle dark mode' : '切换深色模式'}" aria-pressed="false" hidden>
          <span class="theme-glyph" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  </header>

  <main id="main" class="shell" tabindex="-1">${children}</main>

  <div class="lightbox" id="figure-lightbox" role="dialog" aria-modal="true" aria-label="图表高清预览" hidden>
    <div class="lightbox-backdrop" data-close-lightbox></div>
    <div class="lightbox-content">
      <button type="button" class="lightbox-close" data-close-lightbox aria-label="关闭高清预览">× 关闭预览 (Esc)</button>
      <img id="lightbox-img" src="" alt="">
      <p id="lightbox-caption" class="lightbox-caption"></p>
    </div>
  </div>

  <footer class="site-footer">
    <div class="shell footer-inner">
      <div class="footer-brand">
        <strong>${english ? 'Zecheng Li (李泽城)' : '李泽城 · Zecheng Li'}</strong>
        <p>${
          english
            ? 'Doctoral Researcher in Environmental Protection at Universiti Malaya · B.Sc. (CS) & M.IT (Data Analytics), The University of Sydney · IPCC AR7 Chapter 4 Expert Reviewer'
            : '马来亚大学环境保护博士候选人 · 悉尼大学计算机科学学士 & 信息技术（数据分析）硕士 · IPCC AR7 第四章专家评审'
        }</p>
      </div>
      <div class="footer-links">
        <a href="${scholar}" target="_blank" rel="noopener">Google Scholar</a>
        <a href="${orcid}" target="_blank" rel="noopener">ORCID</a>
        <a href="https://www.scopus.com/authid/detail.uri?authorId=${scopusId}" target="_blank" rel="noopener">Scopus</a>
        <a href="${linkedIn}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="mailto:${email}">Email</a>
        <a href="${cvPdf}" target="_blank" rel="noopener">CV (PDF)</a>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

function publicationEntry(item, { index, showThumb = true } = {}) {
  const isFirst = item.firstAuthor;
  const isNpj = item.id === 'dryland-vegetation';
  return `<article class="pub-item ${item.featured ? 'pub-featured' : ''}" id="${escape(item.id)}" data-pub data-first="${isFirst ? 'true' : 'false'}" data-q1="${item.quartile.includes('Q1') ? 'true' : 'false'}" data-category="${escape(item.category)}">
    ${
      showThumb && item.image
        ? `<div class="pub-thumb-wrap">
            <button type="button" class="pub-thumb-btn" data-lightbox-src="${escape(item.image)}" data-lightbox-caption="${escape(item.titleEn)} (${escape(item.journal)})" aria-label="放大查看论文图表：${escape(item.title)}">
              <img src="${escape(item.image)}" alt="${escape(item.title)}" loading="lazy">
              <span class="pub-thumb-zoom">${iconSvg('zoom')} 高清图表</span>
            </button>
          </div>`
        : `<div class="pub-year-col"><span class="pub-year-badge">${escape(item.year)}</span><span class="pub-index">#${index + 1}</span></div>`
    }
    <div class="pub-body">
      <div class="pub-badges">
        <span class="badge badge-venue">${escape(item.journal)}</span>
        <span class="badge ${item.quartile.includes('Q1') ? 'badge-q1' : 'badge-q2'}">${escape(item.quartile)}</span>
        ${isFirst ? '<span class="badge badge-first">第一作者 First Author</span>' : '<span class="badge badge-co">合作作者 Co-Author</span>'}
        ${isNpj ? '<span class="badge badge-flagship">★ 代表作 Flagship</span>' : ''}
      </div>
      <h3 class="pub-title-en" lang="en">
        ${item.detailUrl ? `<a href="${item.detailUrl}">${escape(item.titleEn)}</a>` : item.doi ? `<a href="${item.doi}" target="_blank" rel="noopener">${escape(item.titleEn)}</a>` : escape(item.titleEn)}
      </h3>
      <p class="pub-title-zh">${escape(item.title)}</p>
      <p class="pub-authors" lang="en">${highlightAuthor(item.authors)} (${escape(item.year)})</p>
      <p class="pub-summary">${escape(item.summary)}</p>
      <div class="pub-actions">
        ${item.detailUrl ? `<a class="btn-chip btn-chip-primary" href="${item.detailUrl}">★ 查看代表作专题与 4 张全套图表</a>` : ''}
        ${item.doi ? `<a class="btn-chip" href="${item.doi}" target="_blank" rel="noopener">DOI / 期刊原文 ${iconSvg('external')}</a>` : ''}
        ${
          item.image
            ? `<button type="button" class="btn-chip" data-lightbox-src="${escape(item.image)}" data-lightbox-caption="${escape(item.titleEn)} — ${escape(item.journal)}">${iconSvg('zoom')} 预览论文图件</button>`
            : ''
        }
        ${
          item.bibtex
            ? `<button type="button" class="btn-chip" data-toggle-bib="bib-${escape(item.id)}" aria-expanded="false">BibTeX 引用</button>`
            : ''
        }
      </div>
      ${
        item.bibtex
          ? `<div class="bib-drawer" id="bib-${escape(item.id)}" hidden>
              <div class="bib-header">
                <span>BibTeX Citation</span>
                <button type="button" class="btn-copy-bib" data-copy-target="bib-code-${escape(item.id)}">${iconSvg('copy')} <span>复制 BibTeX</span></button>
              </div>
              <pre><code id="bib-code-${escape(item.id)}">${escape(item.bibtex)}</code></pre>
            </div>`
          : ''
      }
    </div>
  </article>`;
}

function noteCard(note, archive = false) {
  const searchText = markdown.render(note.body).replace(/<[^>]*>/g, ' ');
  const Heading = archive ? 'h2' : 'h3';
  return `<li class="note-card"${archive ? ` data-note data-category="${escape(note.category)}" data-content="${escape(searchText)}"` : ''}>
    <div class="note-card-meta">
      <span class="badge badge-category">${escape(note.category)}</span>
      ${note.date ? `<time datetime="${escape(note.date)}">${escape(note.date)}</time>` : ''}
      ${note.readTime ? `<span class="note-readtime">${escape(note.readTime)}</span>` : ''}
    </div>
    <${Heading} class="note-card-title"><a href="${note.path}">${escape(note.title)}</a></${Heading}>
    <p class="note-card-desc">${escape(note.description)}</p>
    <div class="note-card-footer">
      <a class="text-link" href="${note.path}">阅读全文 →</a>
    </div>
  </li>`;
}

/* ============================================================================
 * 1. HOME PAGE (/) — al-folio + academicpages inspired Academic Portfolio
 * ========================================================================== */
const homePage = `
<section class="profile-hero" aria-labelledby="profile-name">
  <aside class="profile-sidebar">
    <div class="avatar-frame">
      <img src="/assets/avatar.jpg" alt="李泽城 (Zecheng Li) 学术证件照" width="270" height="313" fetchpriority="high">
      <span class="avatar-badge" title="IPCC AR7 Chapter 4 Expert Reviewer">IPCC AR7 专家评审</span>
    </div>
    <div class="sidebar-identity">
      <h1 id="profile-name">李泽城 <span lang="en">Zecheng Li</span></h1>
      <p class="sidebar-role">环境保护博士候选人 (Ph.D. Candidate)</p>
      <ul class="sidebar-affiliations">
        <li><strong>马来亚大学 (Universiti Malaya)</strong><span>高等研究院 · 环境保护博士研究 (2023–2026)</span></li>
        <li><strong>悉尼大学 (The University of Sydney)</strong><span>信息技术硕士 · 数据管理与分析 (M.IT, 2022–2023)</span></li>
        <li><strong>悉尼大学 (The University of Sydney)</strong><span>理学学士 · 计算机科学 (B.Sc. in CS, 2019–2021)</span></li>
      </ul>
      <div class="status-pill">
        <span class="status-dot" aria-hidden="true"></span>
        <span>博士答辩：2026 年 11 月 · 预计毕业：2027 年 2–3 月</span>
      </div>
    </div>
    <div class="sidebar-links" aria-label="学术档案与联系方式">
      ${profileLinks()}
    </div>
  </aside>

  <div class="profile-main">
    <div class="bio-eyebrow">
      <span class="eyebrow-tag">Climate Extremes &amp; Early Warning</span>
      <span class="eyebrow-tag">Causal Discovery (PCMCI)</span>
      <span class="eyebrow-tag">Interpretable Machine Learning</span>
      <span class="eyebrow-tag">Earth Observation</span>
    </div>
    <h2 class="bio-headline">以计算机科学的方法论与工程纪律，<br>构建可检验、可落地的气候风险预警与生态水文模型。</h2>
    <div class="bio-prose">
      <p>我是马来亚大学（Universiti Malaya）环境保护专业博士候选人，此前在澳大利亚悉尼大学（The University of Sydney）获得<strong>计算机科学理学学士（B.Sc.）</strong>与<strong>数据管理与分析方向信息技术硕士（M.IT）</strong>学位，并曾在<strong>华为技术有限公司（Huawei）</strong>从事代码诊断、修复与算法工程工作。我的研究致力于回答一个核心问题：<strong>如何将多源卫星遥感、CMIP6 气候情景投射与因果发现/可解释机器学习深度融合，把复杂的极端气候信号转化为经得起统计严苛检验且能直接服务于政策干预的早期预警证据？</strong></p>
      <p>在短短三年的博士研究周期内，我完成了跨计算机科学、大气与生态水文遥感、环境流行病学及碳金融市场的系统攻关，累计发表/接收同行评审论文 <strong>10 篇（其中第一作者 7 篇、JCR Q1 期刊 8 篇）</strong>，代表作被 Nature Portfolio 旗下地球科学顶刊 <strong><em>npj Climate and Atmospheric Science</em></strong> 接收（第一作者兼通讯作者），并在 <strong><em>Journal of Environmental Management</em></strong>、<strong><em>Scientific Reports</em></strong> 等权威期刊发表多篇一作成果；同时受邀担任 <strong>联合国政府间气候变化专门委员会（IPCC）第七次评估报告（AR7）第四章专家评审</strong>。</p>
    </div>

    <div class="metrics-strip" aria-label="核心学术指标总览">
      <div class="metric-box">
        <strong>10 <small>篇</small></strong>
        <span>已发表/接收 SCI/SSCI 论文</span>
        <small>7 篇第一作者 · 8 篇 JCR Q1</small>
      </div>
      <div class="metric-box">
        <strong>npj / Sci.Rep.</strong>
        <span>Nature Portfolio 代表作</span>
        <small>npj Clim. Atmos. Sci. 一作兼通讯</small>
      </div>
      <div class="metric-box">
        <strong>IPCC AR7</strong>
        <span>第四章专家评审 (Ch.4)</span>
        <small>兼任 ERL / Sci. Rep. 等 5 刊审稿人</small>
      </div>
      <div class="metric-box">
        <strong>7,332 <small>格点</small></strong>
        <span>全球天然旱地因果发现</span>
        <small>276 个月序列 × 18 项稳健性实验</small>
      </div>
    </div>

    <div class="traits-grid" aria-label="核心科研与工程特质">
      <article class="trait-card">
        <div class="trait-header">
          <span class="trait-num">01</span>
          <h3>科研产出与学术公信力突出</h3>
        </div>
        <p>博士期间以<strong>第一作者</strong>在 <em>npj Climate and Atmospheric Science</em> (JCR Q1)、<em>Journal of Environmental Management</em> (JCR Q1)、<em>Scientific Reports</em> (JCR Q1) 等发表 7 篇高水平论文，另有 4 篇工作论文在 <em>Climate Services</em>（邀请大修）、<em>npj Urban Sustainability</em> 等审稿中；受邀担任 <strong>IPCC AR7 第四章专家评审</strong>，团队入选 2026 ACTION 气候—健康创新挑战赛全球 Top 50。</p>
      </article>
      <article class="trait-card">
        <div class="trait-header">
          <span class="trait-num">02</span>
          <h3>计算机 + 地球科学全栈专业能力</h3>
        </div>
        <p>拥有悉尼大学本硕计算机与数据分析科班背景及华为工程经历。精通<strong>高维时间序列因果发现（PCMCI / PCMCI+ / 非线性 GPDC）</strong>、<strong>可解释机器学习（Random Forest + SHAP、Ridge 时序交叉验证）</strong>、<strong>小波相干与非线性结构断点协整（Maki / Gregory-Hansen / Hatemi-J）</strong>，以及大规模遥感与气候模式（MODIS、TerraClimate、SPEIbase、CMIP6）自动化流水线开发。</p>
      </article>
      <article class="trait-card">
        <div class="trait-header">
          <span class="trait-num">03</span>
          <h3>学习能力快 · 跨学科破壁极强</h3>
        </div>
        <p>从纯计算机工程与物联网系统监控快速切入<strong>干旱区生态水文、城市热风险早期预警、环境健康流行病学与欧盟碳市场（EU ETS）风险传导</strong>四大方向。通过独创的“微样本手算核验 → 确定性自动化基线 → 全量参数敏感性检验”工作流，将陌生领域的复杂方法迅速转化为顶刊级可复现代码。</p>
      </article>
      <article class="trait-card">
        <div class="trait-header">
          <span class="trait-num">04</span>
          <h3>吃苦耐劳 · 工业级执行力与严谨度</h3>
        </div>
        <p>对待科学研究坚持高强度、不留死角的实证标准：在 <em>npj</em> 代表作中，独立对全球 20,311 个旱地网格实施五级纯度筛查，在 7,318 个天然植被格点上完成逾 <strong>13.1 万次条件独立性检验与全局 BH-FDR 校正</strong>，并主动加跑 <strong>18 组全量敏感性对照与 2,000 次多尺度空间块自助采样</strong>，以扎实苦干确保每一项科学声明无懈可击。</p>
      </article>
    </div>
  </div>
</section>

${renderReelSection()}

<section class="home-section flagship-spotlight" aria-labelledby="flagship-heading">
  <div class="section-header">
    <div>
      <span class="section-kicker">FLAGSHIP REPRESENTATIVE WORK · 第一作者兼通讯作者代表作</span>
      <h2 id="flagship-heading">npj Climate and Atmospheric Science (Nature Portfolio · JCR Q1)</h2>
    </div>
    <a class="button button-primary" href="/research/npj-dryland-hydroclimate/">进入代表作深度专题页 →</a>
  </div>

  <div class="flagship-card">
    <div class="flagship-info">
      <div class="pub-badges">
        <span class="badge badge-flagship">★ 代表作 · First &amp; Corresponding Author</span>
        <span class="badge badge-q1">npj Climate and Atmospheric Science · JCR Q1</span>
        <span class="badge badge-venue">Accepted for Publication (2026)</span>
      </div>
      <h3 class="flagship-title-en" lang="en">
        <a href="/research/npj-dryland-hydroclimate/">${escape(flagshipPaper.titleEn)}</a>
      </h3>
      <p class="flagship-title-zh">${escape(flagshipPaper.title)}</p>
      <p class="flagship-authors" lang="en">${highlightAuthor(flagshipPaper.authors)} · <em>Institute for Advanced Studies, Universiti Malaya</em></p>
      <p class="flagship-abstract">${escape(flagshipPaper.abstractZh)}</p>

      <div class="flagship-kpi-grid">
        ${flagshipPaper.keyMetrics
          .map(
            m => `<div class="flagship-kpi">
              <strong>${escape(m.value)}</strong>
              <span>${escape(m.label)}</span>
              <small>${escape(m.detail)}</small>
            </div>`
          )
          .join('')}
      </div>

      <div class="flagship-actions">
        <a class="button button-primary" href="/research/npj-dryland-hydroclimate/">浏览完整研究设计、18 项稳健性实验与高清图表</a>
        <a class="button button-outline" href="/notes/npj-dryland-pcmci/">阅读代表作方法学复盘博客</a>
      </div>
    </div>

    <div class="flagship-gallery" aria-label="代表作核心出版级图表预览（点击可放大）">
      <p class="gallery-hint">点击任意图件可开启全屏高清视图（From <code>Gondwana_research/manuscript</code>）：</p>
      <div class="flagship-thumbs">
        ${flagshipPaper.figures
          .map(
            (fig, idx) => `<button type="button" class="flagship-thumb" data-lightbox-src="${escape(fig.src)}" data-lightbox-caption="${escape(fig.title)} — ${escape(fig.caption)}">
              <img src="${escape(fig.src)}" alt="${escape(fig.title)}" loading="${idx === 0 ? 'eager' : 'lazy'}">
              <span class="thumb-label"><strong>Fig. ${idx + 1}</strong> ${escape(fig.title.replace(/^Figure \d+ · /, ''))}</span>
            </button>`
          )
          .join('')}
      </div>
    </div>
  </div>
</section>

<section class="home-section news-and-highlights" aria-labelledby="news-heading">
  <div class="dual-col-grid">
    <div class="news-panel">
      <div class="section-header-compact">
        <span class="section-kicker">ACADEMIC MILESTONES</span>
        <h2 id="news-heading">近期学术动态 (News &amp; Updates)</h2>
      </div>
      <ol class="news-timeline">
        <li>
          <time datetime="2026-11">2026.11</time>
          <div>
            <span class="badge badge-flagship">Accepted · JCR Q1</span>
            <strong>代表作获 Nature Portfolio 旗下 <em>npj Climate and Atmospheric Science</em> 正式接收！</strong>
            <p>第一作者兼通讯作者论文 <em>"Monthly hydroclimatic associations in sampled natural dryland vegetation"</em> 完成全部审稿与修回，正式录用。</p>
          </div>
        </li>
        <li>
          <time datetime="2026-11">2026.11</time>
          <div>
            <span class="badge badge-venue">Ph.D. Final Viva</span>
            <strong>马来亚大学博士学位论文最终答辩定于 2026 年 11 月 12 日</strong>
            <p>预计于 2027 年 2–3 月完成博士阶段全部要求，目前开放海内外博士后（Postdoc）、教职及气候数据科学研发岗位交流。</p>
          </div>
        </li>
        <li>
          <time datetime="2026-10">2026.10</time>
          <div>
            <span class="badge badge-first">First Author · JCR Q2</span>
            <strong>欧盟碳排放交易体系（EU ETS）气候压力与能源冲击传导论文在线发表</strong>
            <p>第一作者论文发表于 <em>International Journal of Climate Change Strategies and Management</em>；同月受邀参加第 6 届国际遥感电子会议（ECRS 2026）。</p>
          </div>
        </li>
        <li>
          <time datetime="2026-06">2026.06</time>
          <div>
            <span class="badge badge-q1">First Author · JCR Q1</span>
            <strong>融合机器学习与 CMIP6 投射的城市热风险早期预警论文发表于 <em>J. Environ. Manage.</em></strong>
            <p>通过时间顺序留出（Holdout R² = 0.5288）与时序交叉验证构建可迁移高温预警框架（Vol. 413, 130304）。</p>
          </div>
        </li>
        <li>
          <time datetime="2026-04">2026.04</time>
          <div>
            <span class="badge badge-q1">First Author · JCR Q1</span>
            <strong>马来西亚多尺度热脆弱性驱动机制论文发表于 Nature 旗下 <em>Scientific Reports</em></strong>
            <p>结合 Random Forest 与 SHAP 解析 13 州与 3 联邦直辖区十年数据，耦合大气热应力（UTCI、O₃、PM2.5）实现 R² = 0.8623 的全因死亡率预测。</p>
          </div>
        </li>
        <li>
          <time datetime="2026-03">2026.03</time>
          <div>
            <span class="badge badge-flagship">Global Service &amp; Award</span>
            <strong>担任 IPCC 第七次评估报告（AR7）第四章专家评审 &amp; ACTION 挑战赛全球 Top 50</strong>
            <p>参与评审 IPCC AR7 区域气候风险评估中的证据与不确定性处理；团队方案在 2026 ACTION 气候—健康创新挑战赛首轮概念评选中跻身 Top 50。</p>
          </div>
        </li>
      </ol>
    </div>

    <div class="journey-panel">
      <div class="section-header-compact">
        <span class="section-kicker">EDUCATION &amp; METHODOLOGY</span>
        <h2>跨学科教育背景与技术栈</h2>
      </div>
      <div class="mini-timeline">
        <div class="mini-step">
          <span class="mini-year">2023.10 – Present</span>
          <h3>马来亚大学 (Universiti Malaya, QS 世界百强)</h3>
          <p class="mini-role">环境保护博士候选人 (Ph.D. Candidate in Environmental Protection)</p>
          <p>研究方向：城市高温脆弱性与早期预警、全球旱地生态水文因果发现、CMIP6 气候风险建模。导师：Chng Saun Fong &amp; Siti Hafizah Ab Hamid。</p>
        </div>
        <div class="mini-step">
          <span class="mini-year">2022.02 – 2023.06</span>
          <h3>悉尼大学 (The University of Sydney, QS 世界前 20)</h3>
          <p class="mini-role">信息技术硕士 · 数据管理与分析 (M.IT in Data Management &amp; Analytics, WAM: 76.4)</p>
          <p>核心课程：机器学习与数据挖掘、深度学习（PyTorch）、自然语言处理、可视分析与普适计算。毕业设计：<em>物联网网络监控仪表盘系统开发与实现</em>。</p>
        </div>
        <div class="mini-step">
          <span class="mini-year">2021.12 – 2022.02</span>
          <h3>华为技术有限公司 (Huawei Technologies Co., Ltd., 武汉)</h3>
          <p class="mini-role">软件工程师 (Programmer)</p>
          <p>负责代码诊断、缺陷定位与修复，参与核心算法讨论与工程质量保障。</p>
        </div>
        <div class="mini-step">
          <span class="mini-year">2019.02 – 2021.12</span>
          <h3>悉尼大学 (The University of Sydney)</h3>
          <p class="mini-role">计算机科学理学学士 (B.Sc. in Computer Science)</p>
          <p>核心课程：算法设计、人工智能导论、数据分析与金融数学。本科毕业论文：<em>探索可持续发展与教育之间的关联机制</em>。</p>
        </div>
      </div>

      <div class="skill-tags-box">
        <h3>核心计算与研究工具栈</h3>
        <div class="skill-chip-group">
          <span>Python / PyTorch</span>
          <span>R / RStudio</span>
          <span>SQL / GitHub</span>
          <span>PCMCI / PCMCI+ / GPDC</span>
          <span>Random Forest / SHAP</span>
          <span>Chronological Holdout &amp; TS-CV</span>
          <span>CMIP6 (SSP1-2.6 / SSP5-8.5)</span>
          <span>MODIS (MOD13C2 / MCD12C1 / MCD64A1)</span>
          <span>TerraClimate / SPEIbase / UTCI</span>
          <span>Wavelet Coherence / Maki &amp; Hatemi-J Cointegration</span>
          <span>C / C++ / Java / Tableau</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="home-section" aria-labelledby="selected-pub-title">
  <div class="section-header">
    <div>
      <span class="section-kicker">SELECTED FIRST-AUTHOR PUBLICATIONS · 代表性一作论文</span>
      <h2 id="selected-pub-title">精选学术发表 (Selected Publications)</h2>
    </div>
    <a class="text-link" href="/research/">查看全部 10 篇已发表论文与 4 篇在审手稿 →</a>
  </div>
  <div class="pub-list">
    ${research.slice(0, 4).map((item, index) => publicationEntry(item, { index, showThumb: true })).join('')}
  </div>
</section>

<section class="home-section notes-section" aria-labelledby="notes-title">
  <div class="section-header">
    <div>
      <span class="section-kicker">RESEARCH NOTES &amp; TECHNICAL BLOG · 科研复盘与方法笔记</span>
      <h2 id="notes-title">研究与跨学科学习博客</h2>
    </div>
    <a class="text-link" href="/notes/">浏览全部博客归档 →</a>
  </div>
  <ul class="notes-grid">
    ${notes.map(note => noteCard(note)).join('')}
  </ul>
</section>
`;

/* ============================================================================
 * 2. FLAGSHIP PAPER PAGE (/research/npj-dryland-hydroclimate/)
 * ========================================================================== */
const flagshipPage = `
<article class="flagship-monograph">
  <div class="monograph-breadcrumb">
    <a class="text-link" href="/research/">← 返回全部学术发表</a>
    <span class="breadcrumb-sep">/</span>
    <span>代表作深度专题 (Flagship Paper Monograph)</span>
  </div>

  <header class="monograph-header">
    <div class="pub-badges">
      <span class="badge badge-flagship">★ 个人代表作 · First &amp; Corresponding Author</span>
      <span class="badge badge-q1">npj Climate and Atmospheric Science · Nature Portfolio · JCR Q1</span>
      <span class="badge badge-venue">Accepted for Publication (2026)</span>
    </div>
    <h1 lang="en">${escape(flagshipPaper.titleEn)}</h1>
    <p class="monograph-title-zh">${escape(flagshipPaper.title)}</p>
    <p class="monograph-authors" lang="en">${highlightAuthor(flagshipPaper.authors)}</p>
    <p class="monograph-affil">${escape(flagshipPaper.affiliations)} · Corresponding author: <a href="mailto:${email}">${email}</a></p>
  </header>

  <section class="monograph-kpi-bar" aria-label="代表作核心量化指标">
    ${flagshipPaper.keyMetrics
      .map(
        m => `<div class="flagship-kpi">
          <strong>${escape(m.value)}</strong>
          <span>${escape(m.label)}</span>
          <small>${escape(m.detail)}</small>
        </div>`
      )
      .join('')}
  </section>

  <section class="monograph-abstracts">
    <div class="abstract-card">
      <h2>中文研究摘要与核心贡献</h2>
      <p>${escape(flagshipPaper.abstractZh)}</p>
    </div>
    <div class="abstract-card" lang="en">
      <h2>Abstract (Original Manuscript)</h2>
      <p>${escape(flagshipPaper.abstractEn)}</p>
    </div>
  </section>

  <section class="monograph-figures" aria-labelledby="figures-heading">
    <div class="section-header">
      <div>
        <span class="section-kicker">PUBLICATION FIGURES · 论文原版全套高清主图 (Fig. 1 – Fig. 4)</span>
        <h2 id="figures-heading">核心可视化结果与科学解读</h2>
      </div>
      <span class="gallery-hint">点击任意图片可开启全屏高清缩放检视</span>
    </div>

    <div class="monograph-figure-list">
      ${flagshipPaper.figures
        .map(
          (fig, idx) => `<figure class="monograph-figure-card" id="fig-${idx + 1}">
            <div class="figure-img-box">
              <button type="button" class="figure-zoom-trigger" data-lightbox-src="${escape(fig.src)}" data-lightbox-caption="${escape(fig.title)} — ${escape(fig.caption)}">
                <img src="${escape(fig.src)}" alt="${escape(fig.title)}" loading="${idx === 0 ? 'eager' : 'lazy'}">
                <span class="zoom-pill">${iconSvg('zoom')} 点击全屏放大查看细节</span>
              </button>
            </div>
            <figcaption class="figure-caption-box">
              <span class="figure-tag">Figure ${idx + 1}</span>
              <h3>${escape(fig.title)}</h3>
              <p class="figure-title-en" lang="en">${escape(fig.titleEn)}</p>
              <p class="figure-desc">${escape(fig.caption)}</p>
            </figcaption>
          </figure>`
        )
        .join('')}
    </div>
  </section>

  <section class="monograph-methodology">
    <h2>方法学架构与可复现数据工程亮点</h2>
    <div class="method-cards">
      <div class="method-card">
        <h3>1. 严苛的天然旱地定义与五步网格纯度筛查</h3>
        <p>在 2001–2023 年（$T = 276$ 个月）全球 $0.5^\circ$ 网格上，基于 TerraClimate 月降水 $P_{it}$ 与参考蒸散发 $\\mathrm{PET}_{it}$ 计算干旱指数 $\\mathrm{AI}_i = \\sum P_{it} / \\sum \\mathrm{PET}_{it} \\in [0.05, 0.65)$。随后融合 23 期年度 MCD12C1 v061 IGBP 土地覆盖数据，严格要求<strong>自然植被覆盖率 $\\ge 85\\%$ 且人为改造覆盖率 $\\le 5\\%$</strong>，并在聚合 $0.05^\circ$ MOD13C2 v061 EVI 时仅保留 Reliability 0/1 高质量像元且要求 $\\overline{\\mathrm{EVI}} \\ge 0.02$，最终从 20,311 个旱地网格中心提炼出 7,332 个高纯度天然旱地候选格点（7,318 个成功收敛）。</p>
      </div>
      <div class="method-card">
        <h3>2. 日历月季节异常标准化与 ENSO 全球遥相关剥离</h3>
        <p>为消除季节周期以及厄尔尼诺—南方涛动（ENSO）引发的全球多地同步异常混杂，首先在每个格点 $i$ 与日历月 $m$ 内构建标准化季节异常 $z_{iym} = (x_{iym} - \\bar{x}_{im}) / s_{im}$，随后对每个序列关于当月及滞后 1、2 个月的海洋尼诺指数（ONI at $t, t-1, t-2$）做最小二乘回归取残差，并且严格保持缺失月不插值（Missing months stay missing），杜绝人工插值引入的伪自相关。</p>
      </div>
      <div class="method-card">
        <h3>3. 严格滞后 PCMCI 与当月 PCMCI+ 双轨因果图搜索</h3>
        <p>在每个格点独立运行两组条件独立性搜索：（1）<strong>严格前导 PCMCI</strong>（仅允许气候出现在绿度之前 1–6 个月，每格点 $3 \\times 6 = 18$ 项候选检验，全球共 131,724 项有限 $p$ 值家族）；（2）<strong>包含当月的 PCMCI+</strong>（滞后 0–6 个月）。两组搜索分别在各自全集上实施全局 <strong>Benjamini–Hochberg FDR 校正（$q \\le 0.05$）</strong>，精确刻画历史自相关与协同气候变量控制后的净关联。</p>
      </div>
      <div class="method-card">
        <h3>4. 18 项敏感性压力测试与“时序 vs. 路径”二元一致性定理</h3>
        <p>通过系统替换植被指标（NDVI）、水分代理（SPEI-3、剔除 SPEI-6、气候水分亏缺 DEF）、蒸发需求代理（VPD、$T_{\\max}$）、剔除 MCD64A1 火灾燃烧月份、限定活跃生长季、扩展 12 个月窗口、2,000 次 $10^\circ/15^\circ/20^\circ$ 空间块重采样、$20^\circ \\times 30^\circ$ 超级块留一法以及非线性高斯过程距离相关（GPDC）检验，证明了<strong>选中滞后月一致率（92.2%–98.5%）系统性高于水/需求宽泛角色一致率（46.7%–96.9%）</strong>。</p>
      </div>
    </div>
  </section>

  <section class="monograph-bibtex">
    <div class="bib-header">
      <h2>引用本文 (BibTeX Citation)</h2>
      <button type="button" class="btn-copy-bib" data-copy-target="flagship-bib-code">${iconSvg('copy')} <span>复制 BibTeX</span></button>
    </div>
    <pre><code id="flagship-bib-code">${escape(flagshipPaper.bibtex)}</code></pre>
  </section>
</article>
`;

/* ============================================================================
 * 3. RESEARCH & PUBLICATIONS PAGE (/research/)
 * ========================================================================== */
const researchPage = `
<div class="page-header">
  <span class="section-kicker">PUBLICATIONS &amp; PIPELINE · 学术发表与在审研究</span>
  <h1>学术论文与科研成果</h1>
  <p>截至 2026 年 11 月，累计发表/接收同行评审论文 <strong>10 篇</strong>（其中<strong>第一作者 7 篇</strong>、<strong>JCR Q1 期刊 8 篇</strong>，含 Nature Portfolio 旗下 <em>npj Climate and Atmospheric Science</em> 与 <em>Scientific Reports</em>），另有 <strong>4 篇</strong>工作论文处于期刊修回或审稿阶段。</p>
</div>

<div class="pub-toolbar" id="pub-toolbar">
  <div class="pub-filters" role="group" aria-label="按类别筛选论文">
    <button type="button" class="filter-pill" data-pub-filter="all" aria-pressed="true">全部已发表/接收 (${research.length})</button>
    <button type="button" class="filter-pill" data-pub-filter="first" aria-pressed="false">第一作者 (${research.filter(r => r.firstAuthor).length})</button>
    <button type="button" class="filter-pill" data-pub-filter="q1" aria-pressed="false">JCR Q1 (${research.filter(r => r.quartile.includes('Q1')).length})</button>
    <button type="button" class="filter-pill" data-pub-filter="ecology" aria-pressed="false">干旱生态与因果发现</button>
    <button type="button" class="filter-pill" data-pub-filter="climate-heat" aria-pressed="false">城市热风险与早期预警</button>
    <button type="button" class="filter-pill" data-pub-filter="carbon-finance" aria-pressed="false">碳市场、气候经济与计量</button>
  </div>
  <div class="pub-search-box">
    <label for="pub-search-input" class="sr-only">搜索论文标题、期刊或方法</label>
    <input type="search" id="pub-search-input" placeholder="搜索期刊、关键词 (如 CMIP6, PCMCI, SHAP)..." autocomplete="off">
  </div>
</div>

<div class="pub-list" id="pub-list">
  ${research.map((item, index) => publicationEntry(item, { index, showThumb: true })).join('')}
</div>

<section class="revision-section" aria-labelledby="revision-heading">
  <div class="section-header">
    <div>
      <span class="section-kicker">MANUSCRIPTS IN REVISION OR EDITORIAL CONSIDERATION</span>
      <h2 id="revision-heading">在审与修回工作论文 (${manuscriptsInRevision.length} 篇)</h2>
    </div>
  </div>
  <div class="revision-grid">
    ${manuscriptsInRevision
      .map(
        (m, i) => `<article class="revision-card">
          <div class="pub-badges">
            <span class="badge badge-venue">${escape(m.journal)}</span>
            <span class="badge badge-q1">${escape(m.status)}</span>
          </div>
          <h3 lang="en">${escape(m.titleEn)}</h3>
          <p class="revision-title-zh">${escape(m.title)}</p>
          <p class="revision-meta"><span>研究主题：${escape(m.topic)}</span> · <span>${escape(m.quartile)}</span></p>
        </article>`
      )
      .join('')}
  </div>
</section>

<div class="scholar-cta">
  <p>完整的引用统计、H-index 及最新上线论文，可通过我的学术档案实时核验：</p>
  <div class="sidebar-links">${profileLinks()}</div>
</div>
`;

/* ============================================================================
 * 4. BLOG / NOTES ARCHIVE PAGE (/notes/)
 * ========================================================================== */
const categories = [...new Set(notes.map(note => note.category))];
const notesPage = `
<div class="page-header">
  <span class="section-kicker">RESEARCH BLOG &amp; TECHNICAL NOTES · 科研复盘与方法笔记</span>
  <h1>研究方法与跨学科学习笔记</h1>
  <p>记录代表作背后的因果发现流水线、CMIP6 气候情景外推边界、机器学习可解释归因，以及从计算机科学跨入地球系统科学的高强度复现工作流。</p>
</div>

<div class="archive-tools" hidden>
  <form class="note-search" role="search">
    <label for="note-query" class="sr-only">搜索博客文章</label>
    <span class="search-glyph" aria-hidden="true"></span>
    <input type="search" id="note-query" name="q" placeholder="搜索文章标题或技术关键词 (如 PCMCI, SHAP, CMIP6)..." autocomplete="off">
  </form>
  <div class="filters" role="group" aria-label="按主题筛选">
    <button type="button" data-filter="" aria-pressed="true">全部 (${notes.length})</button>
    ${categories.map(category => `<button type="button" data-filter="${escape(category)}" aria-pressed="false">${escape(category)}</button>`).join('')}
  </div>
</div>
<p id="search-status" class="sr-only" role="status"></p>
<ul class="notes-grid archive">${notes.map(note => noteCard(note, true)).join('')}</ul>
<p class="empty-state" hidden>没有找到匹配的文章。<button type="button" class="text-link" id="reset-search">清除筛选</button></p>
`;

/* ============================================================================
 * 5. ABOUT & ACADEMIC CV PAGE (/about/)
 * ========================================================================== */
const aboutPage = `
<div class="page-header about-page-header">
  <div>
    <span class="section-kicker">CURRICULUM VITAE &amp; BIOGRAPHY · 个人履历与学术背景</span>
    <h1>关于我 · 李泽城 (Zecheng Li)</h1>
    <p>马来亚大学环境保护博士候选人 · 悉尼大学计算机科学学士 &amp; 信息技术硕士 · IPCC AR7 第四章专家评审</p>
  </div>
  <a class="button button-primary" href="${cvPdf}" target="_blank" rel="noopener">${iconSvg('cv')} 下载完整英文学术简历 (PDF)</a>
</div>

<div class="about-layout">
  <div class="about-main prose">
    <section class="cv-block">
      <h2>一、从计算机科学到气候与地球系统科学</h2>
      <p>我于 2000 年 1 月出生于湖北武汉。2019 年至 2023 年在澳大利亚<strong>悉尼大学（The University of Sydney）</strong>完成了<strong>计算机科学理学学士（Bachelor of Science in Computer Science）</strong>与<strong>数据管理与分析方向信息技术硕士（Master of Information Technology in Data Management and Analytics，WAM: 76.4/100）</strong>的系统训练。本硕阶段我主攻算法设计、人工智能、深度学习（PyTorch）、数据挖掘与可视分析，完成了物联网（IoT）网络监控仪表盘系统的工程开发；其间还曾在<strong>华为技术有限公司（Huawei Technologies Co., Ltd.）</strong>担任软件工程师，负责复杂代码诊断、缺陷修复与算法优化讨论。</p>
      <p>2023 年 10 月起，我在<strong>马来亚大学（Universiti Malaya）高等研究院</strong>攻读环境保护博士学位（导师：Chng Saun Fong 与 Siti Hafizah Ab Hamid）。计算机工程与大规模数据管道的底子，使我面对地球系统科学中动辄数百 GB 的多源卫星遥感（MODIS）、再分析气候网格（TerraClimate、SPEIbase）与 CMIP6 多模式投射数据时，能够迅速搭建端到端、可复现的自动化计算框架。我的博士最终答辩（Final Viva）定于 <strong>2026 年 11 月 12 日</strong>举行，预计于 <strong>2027 年 2–3 月</strong>完成博士阶段全部要求并可全职到岗。</p>
    </section>

    <section class="cv-block">
      <h2>二、核心研究主线与代表性突破</h2>
      <ul>
        <li><strong>全球天然旱地生态水文与因果发现（代表作：<em>npj Climate and Atmospheric Science</em>, 2026, JCR Q1，一作兼通讯）</strong>：针对全球 7,332 个天然旱地 $0.5^\circ$ 格点、2001–2023 年共 276 个月的 MODIS EVI 与水文气候序列，应用严格滞后 PCMCI 与包含当月的 PCMCI+ 条件独立性检验及全局 BH-FDR 校正，证明旱地植被与气候关联高度集中于当月至前一个月窗口（严格滞后下 Lag-1 占 83.3%），且跨 18 项严苛敏感性实验“耦合月份一致性（92.2%–98.5%）远比水分或蒸发需求主导分类（最低 46.7%）更稳健”。</li>
        <li><strong>城市极端高温脆弱性与 CMIP6 机器学习早期预警（<em>Journal of Environmental Management</em>, 2026, JCR Q1；<em>Scientific Reports</em>, 2026, JCR Q1；<em>Air Quality, Atmosphere &amp; Health</em>, 2026，均为第一作者）</strong>：构建马来西亚国家级多尺度热脆弱性评估框架（结合 Random Forest 与 SHAP 实现全因死亡率预测 $R^2 = 0.8623$），并研发耦合滞后空气污染暴露与 CMIP6（SSP1-2.6 / SSP5-8.5）情景的城市高温早期预警系统（严格时间顺序留出 $R^2 = 0.5288$、时序交叉验证 $R^2 = 0.5230$），将模型输出转化为业务化严重热风险分级工具。</li>
        <li><strong>气候压力、能源冲击与碳市场/绿色金融网络（<em>IJCCSM</em>, 2026 一作；<em>IJSHE</em>, 2026 一作；<em>Transport Policy</em>, 2027；<em>Finance Research Letters</em>, 2026；<em>ESPR</em>, 2021；<em>SAGE Open</em>, 2021）</strong>：运用时变连通性网络、偏相关网络、小波相干（Wavelet Coherence）与非线性结构突变协整（Maki、Gregory–Hansen、Hatemi-J）刻画气候与地缘冲击在欧盟碳市场（EU ETS）、ESG 绿色债券与宏观经济系统中的传导路径。</li>
      </ul>
    </section>

    <section class="cv-block">
      <h2>三、国际学术服务与同行评审 (Academic Service &amp; Honours)</h2>
      <div class="service-cards">
        <div class="service-item">
          <span class="service-year">2026</span>
          <div>
            <strong>联合国 IPCC 第七次评估报告（AR7）第四章专家评审 (Expert Reviewer)</strong>
            <p>负责审查区域气候风险评估章节中的科学证据基础与不确定性处理规范（Reviewing evidence and uncertainty treatment in regional climate-risk assessment）。</p>
          </div>
        </div>
        <div class="service-item">
          <span class="service-year">2026</span>
          <div>
            <strong>2026 ACTION 气候—健康创新挑战赛 (Climate-Health Innovation Challenge) · 全球 Top 50</strong>
            <p>所在团队（Team Spirit）凭借气候—健康早期预警创新方案在首轮概念遴选中脱颖而出跻身前 50 名。</p>
          </div>
        </div>
        <div class="service-item">
          <span class="service-year">2025–2026</span>
          <div>
            <strong>国际 SCI / SSCI 期刊独立审稿人 (Peer Reviewer)</strong>
            <p>长期受邀为 <em>Environmental Research Letters</em>、<em>Scientific Reports</em> (Nature Portfolio)、<em>BMC Public Health</em>、<em>Discover Cities</em> 及 <em>Journal of Chinese Economic and Foreign Trade Studies</em> 等期刊审稿。</p>
          </div>
        </div>
        <div class="service-item">
          <span class="service-year">学术奖项</span>
          <div>
            <strong>最佳报告三等奖 (Third Prize, Best Presentation Award) &amp; 国际遥感会议参会认证</strong>
            <p>获 SCCC/IEMLS 学术会议最佳报告奖（Third Prize, Best Presentation Award），并受邀出席第 6 届国际遥感电子会议（ECRS 2026）。</p>
          </div>
        </div>
      </div>
    </section>
  </div>

  <aside class="about-sidebar">
    <div class="cv-side-card">
      <h2>教育经历 (Education)</h2>
      <ol class="cv-edu-list">
        <li>
          <span class="edu-period">2023.10 – Present</span>
          <strong>马来亚大学 (Universiti Malaya)</strong>
          <p>博士候选人 · 环境保护 (Environmental Protection Technology)</p>
          <small>导师：Chng Saun Fong &amp; Siti Hafizah Ab Hamid · 最终答辩：2026.11.12</small>
        </li>
        <li>
          <span class="edu-period">2022.02 – 2023.06</span>
          <strong>悉尼大学 (The University of Sydney)</strong>
          <p>信息技术硕士 (M.IT) · 数据管理与分析</p>
          <small>WAM: 76.4/100 · 毕业项目：IoT 网络监控仪表盘实现</small>
        </li>
        <li>
          <span class="edu-period">2019.02 – 2021.12</span>
          <strong>悉尼大学 (The University of Sydney)</strong>
          <p>理学学士 (B.Sc.) · 计算机科学 (Computer Science)</p>
          <small>WAM: 69.3/100 · 毕业论文：可持续发展与教育关联研究</small>
        </li>
      </ol>
    </div>

    <div class="cv-side-card">
      <h2>工程与研发经历 (Work Experience)</h2>
      <ol class="cv-edu-list">
        <li>
          <span class="edu-period">2021.12 – 2022.02</span>
          <strong>华为技术有限公司 (Huawei Technologies)</strong>
          <p>软件工程师 (Programmer · 武汉)</p>
          <small>代码诊断与修改、软件缺陷修复及底层算法研讨。</small>
        </li>
        <li>
          <span class="edu-period">2019.12 – 2020.02</span>
          <strong>元年科技 (Yuannian High Tech Co., Ltd.)</strong>
          <p>远程数据研发 (Remote Controller)</p>
          <small>基于 Python 的批处理文件解析、财务报表变量映射分析与数据集维护。</small>
        </li>
      </ol>
    </div>

    <div class="cv-side-card">
      <h2>技术能力矩阵 (Technical Stack)</h2>
      <dl class="skill-dl">
        <dt>科学计算与编程</dt>
        <dd>Python (NumPy, SciPy, Tigramite/PCMCI, scikit-learn, SHAP), PyTorch, R/RStudio, SQL, C, C++, Java</dd>
        <dt>统计与因果建模</dt>
        <dd>PCMCI / PCMCI+ 条件独立性检验、GPDC 非线性回归距离相关、Random Forest / SHAP、时间顺序留出与时序交叉验证、小波相干、Maki / Gregory-Hansen / Hatemi-J 协整</dd>
        <dt>地球观测与气候数据</dt>
        <dd>CMIP6 多情景投射、MODIS (MOD13C2 / MCD12C1 / MCD64A1)、TerraClimate、SPEIbase、UTCI 热应力</dd>
        <dt>语言能力</dt>
        <dd>中文（母语）、英文（流利学术写作与国际会议报告，悉尼大学本硕全英文学位）</dd>
      </dl>
    </div>

    <div class="cv-side-card">
      <h2>联系方式与学术档案</h2>
      <div class="sidebar-links">${profileLinks()}</div>
    </div>
  </aside>
</div>
`;

/* ============================================================================
 * 6. ENGLISH PROFILE PAGE (/en/)
 * ========================================================================== */
const englishPage = `
<section class="profile-hero" aria-labelledby="en-profile-name">
  <aside class="profile-sidebar">
    <div class="avatar-frame">
      <img src="/assets/avatar.jpg" alt="Portrait of Zecheng Li" width="270" height="313" fetchpriority="high">
      <span class="avatar-badge">IPCC AR7 Expert Reviewer</span>
    </div>
    <div class="sidebar-identity">
      <h1 id="en-profile-name">Zecheng Li <span lang="zh-CN">李泽城</span></h1>
      <p class="sidebar-role">Ph.D. Candidate in Environmental Protection</p>
      <ul class="sidebar-affiliations">
        <li><strong>Universiti Malaya, Malaysia</strong><span>Institute for Advanced Studies · Doctoral Researcher (2023–present)</span></li>
        <li><strong>The University of Sydney, Australia</strong><span>Master of Information Technology in Data Management &amp; Analytics (2022–2023)</span></li>
        <li><strong>The University of Sydney, Australia</strong><span>Bachelor of Science in Computer Science (2019–2021)</span></li>
      </ul>
      <div class="status-pill">
        <span class="status-dot" aria-hidden="true"></span>
        <span>Final Viva: 12 Nov 2026 · Expected Completion: Feb–Mar 2027</span>
      </div>
    </div>
    <div class="sidebar-links" aria-label="Academic profiles and contact">
      ${profileLinks({ english: true })}
    </div>
  </aside>

  <div class="profile-main">
    <div class="bio-eyebrow">
      <span class="eyebrow-tag">Urban Heat Vulnerability &amp; Early Warning</span>
      <span class="eyebrow-tag">Dryland Ecohydrology &amp; PCMCI</span>
      <span class="eyebrow-tag">Interpretable ML &amp; CMIP6</span>
      <span class="eyebrow-tag">Carbon Markets</span>
    </div>
    <h2 class="bio-headline">Bridging Computer Science, Causal Discovery, and Earth Observation to Build Actionable Climate-Risk Evidence.</h2>
    <div class="bio-prose">
      <p>I am a doctoral researcher in Environmental Protection at <strong>Universiti Malaya</strong>, with prior degrees in <strong>Computer Science (B.Sc.)</strong> and <strong>Data Management and Analytics (M.IT)</strong> from <strong>The University of Sydney</strong> and software engineering experience at <strong>Huawei Technologies</strong>. My research asks how climate extremes—from tropical urban heatwaves to global dryland hydroclimatic stress—affect human populations and ecosystems, and how multi-source remote sensing and machine learning can support rigorous early warning and attribution.</p>
      <p>During my doctoral studies, I have authored or co-authored <strong>10 peer-reviewed articles</strong> (<strong>7 as first author</strong>, <strong>8 in JCR Q1 venues</strong>), led by a flagship first- and corresponding-author study accepted in <strong><em>npj Climate and Atmospheric Science</em></strong> (Nature Portfolio, JCR Q1) alongside first-author papers in <strong><em>Journal of Environmental Management</em></strong> and <strong><em>Scientific Reports</em></strong>. I serve as an <strong>Expert Reviewer for Chapter 4 of the IPCC Seventh Assessment Report (AR7)</strong> and peer reviewer for five international journals.</p>
    </div>

    <div class="metrics-strip">
      <div class="metric-box">
        <strong>10</strong>
        <span>Peer-Reviewed Publications</span>
        <small>7 First-Author · 8 JCR Q1</small>
      </div>
      <div class="metric-box">
        <strong>npj / Sci.Rep.</strong>
        <span>Nature Portfolio Papers</span>
        <small>Lead Author in npj Clim. Atmos. Sci.</small>
      </div>
      <div class="metric-box">
        <strong>IPCC AR7</strong>
        <span>Chapter 4 Expert Reviewer</span>
        <small>Regional Climate-Risk Assessment</small>
      </div>
      <div class="metric-box">
        <strong>7,332 <small>cells</small></strong>
        <span>Global Dryland PCMCI Analysis</span>
        <small>276 Months × 18 Robustness Regimes</small>
      </div>
    </div>
  </div>
</section>

${renderReelSection({ english: true })}

<section class="home-section flagship-spotlight" aria-labelledby="en-flagship-heading">
  <div class="section-header">
    <div>
      <span class="section-kicker">FLAGSHIP REPRESENTATIVE PUBLICATION · FIRST &amp; CORRESPONDING AUTHOR</span>
      <h2 id="en-flagship-heading">${escape(flagshipPaper.titleEn)}</h2>
    </div>
    <a class="button button-primary" href="/research/npj-dryland-hydroclimate/">View Full Monograph &amp; Figures →</a>
  </div>
  <div class="flagship-card">
    <div class="flagship-info">
      <p class="flagship-authors"><strong>Zecheng Li*</strong>, Xuanyu Chen, Chng Saun Fong, Yijuan Shen · <em>npj Climate and Atmospheric Science</em> (2026, Accepted, JCR Q1)</p>
      <p class="flagship-abstract">${escape(flagshipPaper.abstractEn)}</p>
      <div class="flagship-thumbs">
        ${flagshipPaper.figures
          .map(
            (fig, idx) => `<button type="button" class="flagship-thumb" data-lightbox-src="${escape(fig.src)}" data-lightbox-caption="${escape(fig.titleEn)}">
              <img src="${escape(fig.src)}" alt="${escape(fig.titleEn)}" loading="lazy">
              <span class="thumb-label"><strong>Fig. ${idx + 1}</strong> ${escape(fig.titleEn.replace(/^Fig\. \d+ · /, ''))}</span>
            </button>`
          )
          .join('')}
      </div>
    </div>
  </div>
</section>

<section class="home-section" aria-labelledby="en-pub-heading">
  <div class="section-header">
    <div>
      <span class="section-kicker">COMPLETE PUBLICATION RECORD</span>
      <h2 id="en-pub-heading">Peer-Reviewed Publications (${research.length}) &amp; Manuscripts in Revision (${manuscriptsInRevision.length})</h2>
    </div>
    <a class="button button-outline" href="${cvPdf}" target="_blank" rel="noopener">Download Full Academic CV (PDF)</a>
  </div>
  <div class="pub-list">
    ${research.map((item, index) => publicationEntry(item, { index, showThumb: true })).join('')}
  </div>
</section>
`;

const pages = new Map([
  ['/', ['首页', description, homePage]],
  [
    '/research/npj-dryland-hydroclimate/',
    [
      'npj Climate and Atmospheric Science 代表作专题',
      flagshipPaper.abstractZh,
      flagshipPage,
    ],
  ],
  ['/research/', ['学术发表与代表作', '李泽城（Zecheng Li）的全部 SCI/SSCI 学术论文、npj Climate and Atmospheric Science 代表作与在审工作论文。', researchPage]],
  ['/notes/', ['科研博客', '记录全球旱地因果发现、城市高温风险预警、机器学习与跨学科科研复现的技术笔记。', notesPage]],
  ['/about/', ['关于我与学术简历', '李泽城（Zecheng Li）的教育经历、科研主线、工程背景与 IPCC AR7 专家评审服务。', aboutPage]],
  ['/en/', ['Academic Profile', 'Zecheng Li — Doctoral Researcher in Environmental Protection at Universiti Malaya, Computer Science & Data Analytics (University of Sydney), IPCC AR7 Chapter 4 Expert Reviewer.', englishPage, { english: true }]],
  ['/404.html', ['页面未找到', '页面未找到。', '<div class="page-header"><h1>页面未找到 (404)</h1><p>抱歉，您访问的页面不存在或已移动，可以从首页或学术发表页继续浏览。</p><a class="button button-primary" href="/">返回学术主页</a></div>']],
]);

for (const [idx, note] of notes.entries()) {
  const prevNote = notes[idx - 1];
  const nextNote = notes[idx + 1];
  pages.set(note.path, [
    note.title,
    note.description,
    `<article class="article-page">
      <div class="monograph-breadcrumb">
        <a class="text-link" href="/notes/">← 返回科研博客归档</a>
        <span class="breadcrumb-sep">/</span>
        <span>${escape(note.category)}</span>
      </div>
      <header class="article-header">
        <div class="note-card-meta">
          <span class="badge badge-category">${escape(note.category)}</span>
          ${note.date ? `<time datetime="${escape(note.date)}">${escape(note.date)}</time>` : ''}
          ${note.readTime ? `<span class="note-readtime">${escape(note.readTime)}</span>` : ''}
        </div>
        <h1>${escape(note.title)}</h1>
        <p class="article-lead">${escape(note.description)}</p>
      </header>
      <div class="prose article-prose">${markdown.render(note.body)}</div>
      <nav class="article-nav" aria-label="上下篇博客导航">
        ${prevNote ? `<a class="article-nav-card" href="${prevNote.path}"><span>← 上一篇</span><strong>${escape(prevNote.title)}</strong></a>` : '<div></div>'}
        ${nextNote ? `<a class="article-nav-card article-nav-next" href="${nextNote.path}"><span>下一篇 →</span><strong>${escape(nextNote.title)}</strong></a>` : '<div></div>'}
      </nav>
    </article>`,
  ]);
}

const rendered = [...pages].map(([url, args]) => [
  url === '/404.html' ? '404.html' : join(url.slice(1), 'index.html'),
  layout(url, ...args),
]);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL('./assets/', import.meta.url), new URL('./assets/', output), { recursive: true });
for (const [path, html] of rendered) {
  await mkdir(new URL(dirname(path) + '/', output), { recursive: true });
  await writeFile(new URL(path, output), html);
}

if (origin) {
  const urls = [...pages.keys()].filter(path => path !== '/404.html');
  await writeFile(
    new URL('sitemap.xml', output),
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      urls.map(path => `<url><loc>${escape(origin + path)}</loc></url>`).join('') +
      '</urlset>\n'
  );
  await writeFile(new URL('robots.txt', output), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
}
console.log(`Built ${pages.size} pages in dist/.`);
