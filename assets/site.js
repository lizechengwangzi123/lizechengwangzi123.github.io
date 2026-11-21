const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

function darkMode() {
  return root.dataset.theme ? root.dataset.theme === 'dark' : systemTheme.matches;
}

function showTheme() {
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(darkMode()));
  }
}

if (toggle) {
  toggle.hidden = false;
  showTheme();
  systemTheme.addEventListener('change', showTheme);
  toggle.addEventListener('click', () => {
    root.dataset.theme = darkMode() ? 'light' : 'dark';
    try {
      localStorage.setItem('zecheng-li-theme', root.dataset.theme);
    } catch {
      // Theme remains active for this session.
    }
    showTheme();
  });
}

// 1. BibTeX toggle drawers & one-click copy
document.addEventListener('click', async event => {
  const bibBtn = event.target.closest('[data-toggle-bib]');
  if (bibBtn) {
    const targetId = bibBtn.getAttribute('data-toggle-bib');
    const drawer = document.getElementById(targetId);
    if (drawer) {
      const isHidden = drawer.hidden;
      drawer.hidden = !isHidden;
      bibBtn.setAttribute('aria-expanded', String(isHidden));
    }
    return;
  }

  const copyBtn = event.target.closest('[data-copy-target]');
  if (copyBtn) {
    const targetId = copyBtn.getAttribute('data-copy-target');
    const codeEl = document.getElementById(targetId);
    if (codeEl) {
      const labelSpan = copyBtn.querySelector('span');
      const originalText = labelSpan ? labelSpan.textContent : '复制 BibTeX';
      try {
        await navigator.clipboard.writeText(codeEl.textContent);
        if (labelSpan) labelSpan.textContent = '已复制 ✓';
        copyBtn.classList.add('is-copied');
        setTimeout(() => {
          if (labelSpan) labelSpan.textContent = originalText;
          copyBtn.classList.remove('is-copied');
        }, 2000);
      } catch {
        // Fallback selection
        const range = document.createRange();
        range.selectNodeContents(codeEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    return;
  }
});

// 2. Figure Lightbox Modal (supports explicit buttons and article images)
const lightbox = document.getElementById('figure-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

function openLightbox(src, caption) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = caption || '论文图表高清预览';
  if (lightboxCaption) {
    lightboxCaption.textContent = caption || '';
  }
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  if (lightboxImg) lightboxImg.src = '';
  document.body.style.overflow = '';
}

document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-lightbox-src]');
  if (trigger) {
    openLightbox(
      trigger.getAttribute('data-lightbox-src'),
      trigger.getAttribute('data-lightbox-caption')
    );
    return;
  }

  const articleImg = event.target.closest('.article-prose img');
  if (articleImg) {
    openLightbox(articleImg.getAttribute('src'), articleImg.getAttribute('alt'));
    return;
  }

  if (event.target.closest('[data-close-lightbox]')) {
    closeLightbox();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && lightbox && !lightbox.hidden) {
    closeLightbox();
  }
});

// 3. Publication filtering & keyword search on /research/
const pubToolbar = document.getElementById('pub-toolbar');
if (pubToolbar) {
  const filterBtns = [...pubToolbar.querySelectorAll('[data-pub-filter]')];
  const searchInput = document.getElementById('pub-search-input');
  const pubItems = [...document.querySelectorAll('[data-pub]')];
  let activeFilter = 'all';

  function updatePublications() {
    const query = searchInput
      ? searchInput.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
      : [];

    for (const item of pubItems) {
      let matchCategory = true;
      if (activeFilter === 'first') {
        matchCategory = item.dataset.first === 'true';
      } else if (activeFilter === 'q1') {
        matchCategory = item.dataset.q1 === 'true';
      } else if (activeFilter !== 'all') {
        matchCategory = item.dataset.category === activeFilter;
      }

      const text = item.textContent.toLocaleLowerCase();
      const matchQuery = query.every(word => text.includes(word));
      item.hidden = !(matchCategory && matchQuery);
    }

    for (const btn of filterBtns) {
      btn.setAttribute('aria-pressed', String(btn.dataset.pubFilter === activeFilter));
    }
  }

  for (const btn of filterBtns) {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.pubFilter;
      updatePublications();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', updatePublications);
  }
}

// 4. Blog archive filtering & search on /notes/
const tools = document.querySelector('.archive-tools');
if (tools) {
  const search = document.querySelector('#note-query');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const entries = [...document.querySelectorAll('[data-note]')];
  const empty = document.querySelector('.empty-state');
  const status = document.querySelector('#search-status');
  let category = '';

  function filterNotes() {
    const query = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const entry of entries) {
      const text = (entry.textContent + ' ' + entry.dataset.content).toLocaleLowerCase();
      const matches =
        (!category || entry.dataset.category === category) &&
        query.every(word => text.includes(word));
      entry.hidden = !matches;
      visible += Number(matches);
    }
    for (const button of filters) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    }
    if (empty) empty.hidden = visible > 0;
    if (status) status.textContent = `找到 ${visible} 篇文章`;
  }

  tools.hidden = false;
  search.form.addEventListener('submit', event => event.preventDefault());
  search.addEventListener('input', filterNotes);
  for (const button of filters) {
    button.addEventListener('click', () => {
      category = button.dataset.filter;
      filterNotes();
    });
  }
  const resetBtn = document.querySelector('#reset-search');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      category = '';
      search.value = '';
      filterNotes();
      search.focus();
    });
  }
}

// 5. Interactive Research Reel Video Chapter Seek & Active Chapter Sync
const reelVideo = document.getElementById('research-reel-video');
if (reelVideo) {
  const chapterBtns = [...document.querySelectorAll('[data-seek-time]')];

  for (const btn of chapterBtns) {
    btn.addEventListener('click', () => {
      const seekSec = Number(btn.getAttribute('data-seek-time') || 0);
      reelVideo.currentTime = seekSec;
      reelVideo.play().catch(() => {});
      for (const b of chapterBtns) {
        b.classList.toggle('is-active', b === btn);
      }
    });
  }

  reelVideo.addEventListener('timeupdate', () => {
    const t = reelVideo.currentTime;
    let activeBtn = chapterBtns[0];
    for (const btn of chapterBtns) {
      if (t >= Number(btn.getAttribute('data-seek-time') || 0)) {
        activeBtn = btn;
      }
    }
    for (const btn of chapterBtns) {
      btn.classList.toggle('is-active', btn === activeBtn);
    }
  });
}

