# 李泽城（Zecheng Li）个人学术主页与研究博客

面向气候风险、地球系统遥感与环境数据科学研究的学术个人网站（借鉴 GitHub 顶星学术与个人博客项目 **[al-folio](https://github.com/alshedivat/al-folio)**、**[academicpages](https://github.com/academicpages/academicpages.github.io)** 与 **[Distill.pub](https://distill.pub/)** 的版式架构设计）。

## 核心板块

- **学术主页 (`/`)**：双栏经典学术档案布局（包含证件照、马来亚大学博士 & 悉尼大学计算机科学本硕背景、IPCC AR7 第四章专家评审身份、核心量化成果指标栏、四大科研与工程能力矩阵、近期学术动态时间线、代表作专题卡片、精选一作论文与技术博客）。
- **代表作深度专题 (`/research/npj-dryland-hydroclimate/`)**：针对发表于 Nature Portfolio 旗下 ***npj Climate and Atmospheric Science*** (JCR Q1) 的第一作者兼通讯作者代表作 *"Monthly hydroclimatic associations in sampled natural dryland vegetation"*，展示中英文摘要、核心发现指标（7,332 个全球天然旱地格点 × 276 个月序列、83.3% Lag-1 前导集中度、18 项稳健性检验）、原版全套高清出版级图表（Fig. 1 – Fig. 4，支持点击全屏缩放）及一键复制 BibTeX。
- **全部学术发表 (`/research/`)**：完整收录 10 篇已发表/接收 SCI/SSCI 论文（7 篇第一作者、8 篇 JCR Q1）与 4 篇在审/大修工作论文，支持按“第一作者 / JCR Q1 / 研究方向”一键筛选、关键词实时检索、图表高清预览与 BibTeX 引用展开复制。
- **科研与方法学博客 (`/notes/`)**：收录 4 篇深度技术长文（涵盖 *npj* 全球旱地 PCMCI 因果发现复盘、*J. Environ. Manage.* CMIP6 城市高温早期预警时序验证、*Scientific Reports* 马来西亚热脆弱性 Random Forest + SHAP 归因，以及从计算机科学跨入气候科学的高强度可复现工作流）。
- **个人简历与经历 (`/about/` & `/en/`)**：完整中英文学术履历，支持直接预览或下载英文学术简历 PDF (`/assets/Zecheng_Li_Academic_CV.pdf`)。

## 本地构建与预览

```sh
npm run build
npm run preview
```

预览地址为 `http://127.0.0.1:8787/`。构建产物输出于 `dist/` 目录。
