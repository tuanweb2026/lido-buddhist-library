/**
 * LIDO BUDDHIST LIBRARY 3D — MAIN APPLICATION SCRIPT
 * Handles Data Loading, Scripture Search/Filtering, Video Lazy Player, Navigation & Accessibility
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize 3D Sacred Labyrinth Spatial Engine
  if (window.SacredLabyrinth3D) {
    window.labyrinthInstance = new window.SacredLabyrinth3D('three-canvas-container');
  }

  // Toggle Quote Info Drawer
  const btnToggleInfo = document.getElementById('btn-toggle-info');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const quoteDrawer = document.getElementById('hero-quote-drawer');
  if (btnToggleInfo && quoteDrawer) {
    btnToggleInfo.addEventListener('click', () => {
      const isHidden = quoteDrawer.style.display === 'none';
      quoteDrawer.style.display = isHidden ? 'block' : 'none';
      btnToggleInfo.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      if (isHidden && btnCloseDrawer) {
        btnCloseDrawer.focus();
      }
    });
  }
  if (btnCloseDrawer && quoteDrawer) {
    btnCloseDrawer.addEventListener('click', () => {
      quoteDrawer.style.display = 'none';
      if (btnToggleInfo) {
        btnToggleInfo.setAttribute('aria-expanded', 'false');
        btnToggleInfo.focus();
      }
    });
  }

  // 2. State Management
  let siteData = null;
  let activeCategory = 'all';
  let searchQuery = '';

  // 3. Elements
  const booksGrid = document.getElementById('books-grid');
  const searchInput = document.getElementById('search-input');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const videosGrid = document.getElementById('videos-grid');
  const navElement = document.querySelector('.site-nav');
  const mobileToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Sticky Navbar Scroll Listener
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navElement.classList.add('scrolled');
    } else {
      navElement.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Fetch Verified Data
  try {
    const res = await fetch('data/site_data.json');
    if (!res.ok) throw new Error('Cannot load site_data.json');
    siteData = await res.json();
    renderLibrary();
    renderVideos();
  } catch (err) {
    console.error('Data Loading Error:', err);
    if (booksGrid) {
      booksGrid.innerHTML = `
        <div class="library-empty-state">
          <p>⚠️ Không thể nạp dữ liệu kinh sách trực tiếp. Vui lòng kiểm tra server local.</p>
        </div>
      `;
    }
  }

  // 5. Render Scripture Library
  function renderLibrary() {
    if (!siteData || !siteData.books || !booksGrid) return;

    const filtered = siteData.books.filter(book => {
      const matchCat = (activeCategory === 'all') || (book.category === activeCategory);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        book.title.toLowerCase().includes(q) ||
        (book.author && book.author.toLowerCase().includes(q)) ||
        (book.translator && book.translator.toLowerCase().includes(q)) ||
        (book.summary && book.summary.toLowerCase().includes(q));
      
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      booksGrid.innerHTML = `
        <div class="library-empty-state">
          <p>🪷 Không tìm thấy kinh sách hoặc tài liệu phù hợp với từ khóa "${searchQuery}".</p>
          <button class="btn-read-book" style="margin-top: 14px;" id="btn-reset-search">Xem tất cả tác phẩm</button>
        </div>
      `;
      const btnReset = document.getElementById('btn-reset-search');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          activeCategory = 'all';
          filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.category === 'all'));
          renderLibrary();
        });
      }
      return;
    }

    booksGrid.innerHTML = filtered.map(book => `
      <article class="book-card" data-category="${book.category}">
        <div class="book-cover-wrap">
          <img src="${book.cover_image}" alt="${book.title}" class="book-cover-img" loading="lazy" onerror="this.src='assets/zen_feature_1.jpg'">
          <span class="book-badge">${book.badge || 'Đại Tạng Gốc'}</span>
        </div>
        <div class="book-card-body">
          <span class="book-category-tag">${book.category_label || 'Phật Pháp Căn Bản'}</span>
          <h3 class="book-title font-serif">${book.title}</h3>
          <p class="book-meta">
            ${book.author ? `<strong>${book.author}</strong>` : ''} 
            ${book.translator ? `• ${book.translator}` : ''}
          </p>
          <p class="book-summary">${book.summary}</p>
          <div class="book-footer" style="flex-wrap: wrap; gap: 8px;">
            <button class="btn-read-modal-3d" onclick="openZen3DReader('${book.id}')" aria-label="Mở sách 3D ${book.title}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align: -2px; margin-right: 4px;">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              <span>Mở Sách 3D Lật Trang</span>
            </button>
            <a href="${book.read_url}" target="_blank" rel="noopener noreferrer" class="btn-read-book" style="padding: 6px 12px; font-size: 0.78rem;" aria-label="Đọc toàn văn ${book.title}">
              <span>daophatgoc.com ↗</span>
            </a>
          </div>
        </div>
      </article>
    `).join('');
  }

  // 6. Category Filter Listeners
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      activeCategory = btn.dataset.category;
      renderLibrary();
    });
  });

  // 7. Search Input Listener (Debounced)
  let debounceTimer;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value;
        renderLibrary();
      }, 200);
    });
  }

  // 8. Render YouTube Meditation Videos with Click-to-Play Embed
  function renderVideos() {
    if (!siteData || !siteData.featured_videos || !videosGrid) return;

    videosGrid.innerHTML = siteData.featured_videos.map((vid, idx) => `
      <div class="video-card">
        <div class="video-player-container" id="player-container-${vid.id}">
          <div class="video-placeholder" data-youtube-id="${vid.youtube_id}" data-container-id="player-container-${vid.id}" style="background-image: url('assets/zen_feature_${(idx % 3) + 1}.jpg');">
            <button class="btn-play-trigger" aria-label="Phát video ${vid.title}">▶</button>
          </div>
        </div>
        <div class="video-card-body">
          <div class="video-meta-bar">
            <span>🪷 ${vid.category}</span>
            <span>⏳ ${vid.duration}</span>
          </div>
          <h3 class="video-title font-serif">${vid.title}</h3>
          <p class="video-desc">${vid.desc}</p>
        </div>
      </div>
    `).join('');

    // Attach Click-to-Play handlers
    document.querySelectorAll('.video-placeholder').forEach(placeholder => {
      placeholder.addEventListener('click', function() {
        const ytid = this.dataset.youtubeId;
        const containerId = this.dataset.containerId;
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = `
            <iframe 
              src="https://www.youtube-nocookie.com/embed/${ytid}?autoplay=1&rel=0&modestbranding=1" 
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          `;
        }
      });
    });
  }

  // ==========================================================================
  // REAL-TIME VISITOR COUNTER ENGINE (Cloud Database Sync + Local Storage)
  // ==========================================================================
  async function initVisitorCounter() {
    const counterElements = document.querySelectorAll('.lido-visitor-count-val');
    const storageKey = 'lido_prototype_visitor_count';
    const sessionKey = 'lido_prototype_session_visited';
    let baseCount = 25; // Default matching user baseline screenshot

    // 1. Check local persistent storage
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        baseCount = Math.max(baseCount, parseInt(stored, 10));
      }
    } catch (e) {}

    // 2. Increment if new browser session
    const isNewVisit = !sessionStorage.getItem(sessionKey);
    if (isNewVisit) {
      sessionStorage.setItem(sessionKey, 'true');
      baseCount += 1;
      try {
        localStorage.setItem(storageKey, baseCount.toString());
      } catch (e) {}
    }

    // 3. Update counter badge in UI
    counterElements.forEach(el => {
      el.textContent = baseCount.toLocaleString('vi-VN');
    });

    // 4. Try optional background sync with Cloud KV if network allows (production only)
    const isLocal = ['localhost', '127.0.0.1', ''].includes(window.location.hostname) || window.location.protocol === 'file:';
    if (!isLocal) {
      try {
        const res = await fetch('https://keyvalue.immanuel.co/api/KeyVal/GetValue/f8inst8c/stats', { cache: 'no-store' });
        if (res.ok) {
          let text = await res.text();
          text = text.replace(/^"|"$/g, '').trim();
          if (text && text !== 'null') {
            let pad = len => len % 4 ? len + (4 - (len % 4)) : len;
            let padded = text.padEnd(pad(text.length), '=');
            let decoded = JSON.parse(atob(padded.replace(/-/g, '+').replace(/_/g, '/')));
            if (decoded && decoded.visits) {
              const cloudVal = Math.max(baseCount, decoded.visits);
              counterElements.forEach(el => {
                el.textContent = cloudVal.toLocaleString('vi-VN');
              });
              localStorage.setItem(storageKey, cloudVal.toString());
            }
          }
        }
      } catch (err) {
        // Offline/Local mode works seamlessly without error
      }
    }
  }

  // ==========================================================================
  // ZEN QUOTES CAROUSEL CONTROLLER (112 Quotes, Filter Tabs, Random, Auto-Rotate)
  // ==========================================================================
  function initZenQuotesCarousel() {
    let currentQuoteFilter = 'all';
    let currentQuoteIdx = 15; // Start at quote index 15 (Câu 16/112 Vô Thường as in screenshot)
    let quoteAutoTimer = null;

    function getFilteredQuotes() {
      const allQuotes = siteData?.site_config?.zen_quotes || [];
      if (!allQuotes.length) return [];
      if (currentQuoteFilter && currentQuoteFilter !== 'all') {
        const filtered = allQuotes.filter(q => q.tag === currentQuoteFilter);
        return filtered.length > 0 ? filtered : allQuotes;
      }
      return allQuotes;
    }

    function updateQuoteUI() {
      const quotes = getFilteredQuotes();
      if (!quotes.length) return;

      if (currentQuoteIdx >= quotes.length) currentQuoteIdx = 0;
      if (currentQuoteIdx < 0) currentQuoteIdx = quotes.length - 1;

      const current = quotes[currentQuoteIdx];

      const quoteEl = document.getElementById("hero-quote");
      const sourceEl = document.getElementById("hero-quote-source");
      const authorEl = document.getElementById("hero-quote-author");
      const tagTextEl = document.getElementById("carousel-tag-text");
      const iconEl = document.getElementById("carousel-icon");
      const counterEl = document.getElementById("carousel-counter");
      const progressBar = document.getElementById("carousel-progress-bar");

      if (quoteEl) {
        quoteEl.style.opacity = "0.2";
        quoteEl.style.transform = "translateY(4px)";
        setTimeout(() => {
          quoteEl.textContent = `"${current.quote}"`;
          quoteEl.style.opacity = "1";
          quoteEl.style.transform = "translateY(0)";
        }, 150);
      }

      if (sourceEl) {
        const catUpper = (current.tag || 'CỐT TỦY CHÁNH PHÁP').toUpperCase();
        sourceEl.textContent = `${catUpper} • ${current.source || 'LỜI VÀNG PHẬT THUYẾT'}`;
      }
      if (authorEl) authorEl.textContent = current.author ? `— ${current.author}` : "— Triết Lý Phật Đà & Lời Vàng Trưởng Lão";
      if (tagTextEl) tagTextEl.textContent = current.tag || "Cốt Tủy Chánh Pháp";
      if (iconEl) iconEl.textContent = current.icon || "🪷";
      if (counterEl) counterEl.textContent = `${currentQuoteIdx + 1} / ${quotes.length}`;

      if (progressBar) {
        const pct = Math.max(1, Math.round(((currentQuoteIdx + 1) / quotes.length) * 100));
        progressBar.style.width = `${pct}%`;
      }
    }

    function nextQuote(isAuto = false) {
      const quotes = getFilteredQuotes();
      if (!quotes.length) return;
      currentQuoteIdx = (currentQuoteIdx + 1) % quotes.length;
      updateQuoteUI();
      if (!isAuto && quoteAutoTimer) {
        clearInterval(quoteAutoTimer);
        quoteAutoTimer = setInterval(() => nextQuote(true), 9000);
      }
    }

    function prevQuote() {
      const quotes = getFilteredQuotes();
      if (!quotes.length) return;
      currentQuoteIdx = (currentQuoteIdx - 1 + quotes.length) % quotes.length;
      updateQuoteUI();
      if (quoteAutoTimer) {
        clearInterval(quoteAutoTimer);
        quoteAutoTimer = setInterval(() => nextQuote(true), 9000);
      }
    }

    function randomQuote() {
      const quotes = getFilteredQuotes();
      if (quotes.length <= 1) return;
      let nextIdx = Math.floor(Math.random() * quotes.length);
      if (nextIdx === currentQuoteIdx) {
        nextIdx = (nextIdx + 1) % quotes.length;
      }
      currentQuoteIdx = nextIdx;
      updateQuoteUI();
      if (quoteAutoTimer) {
        clearInterval(quoteAutoTimer);
        quoteAutoTimer = setInterval(() => nextQuote(true), 9000);
      }
    }

    // Attach Event Listeners
    const btnNext = document.getElementById('carousel-next');
    if (btnNext) btnNext.addEventListener('click', () => nextQuote(false));

    const btnPrev = document.getElementById('carousel-prev');
    if (btnPrev) btnPrev.addEventListener('click', prevQuote);

    const btnRandom = document.getElementById('carousel-random');
    if (btnRandom) btnRandom.addEventListener('click', randomQuote);

    document.querySelectorAll('#carousel-cat-tabs .zen-tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#carousel-cat-tabs .zen-tab-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        currentQuoteFilter = this.dataset.category || 'all';
        currentQuoteIdx = 0;
        updateQuoteUI();
        if (quoteAutoTimer) {
          clearInterval(quoteAutoTimer);
          const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (!prefersReducedMotion) {
            quoteAutoTimer = setInterval(() => nextQuote(true), 9000);
          }
        }
      });
    });

    // Auto rotate every 9s if motion is not reduced
    updateQuoteUI();
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      quoteAutoTimer = setInterval(() => nextQuote(true), 9000);
    }
  }

  initVisitorCounter();
  initZenQuotesCarousel();

  // ==========================================================================
  // 3D REALISTIC FLIP-BOOK ENGINE (SHOWCASE + FULLSCREEN MODAL READER)
  // ==========================================================================
  // 1. Showcase Leaf Flipping (Section trên Tủ Sách)
  let showcaseFlipped = 0; // 0: Trang 1-2, 1: Trang 3-4, 2: Trang 5-6
  const totalShowcaseLeaves = 2; // leaf-1 & leaf-2

  window.turnShowcaseLeaf = function(direction) {
    if (direction > 0) {
      if (showcaseFlipped < totalShowcaseLeaves) {
        showcaseFlipped++;
        const leaf = document.getElementById(`leaf-${showcaseFlipped}`);
        if (leaf) {
          leaf.classList.add('flipped');
          leaf.style.zIndex = showcaseFlipped + 5; // Send flipped leaf to left stack
        }
      }
    } else {
      if (showcaseFlipped > 0) {
        const leaf = document.getElementById(`leaf-${showcaseFlipped}`);
        if (leaf) {
          leaf.classList.remove('flipped');
          leaf.style.zIndex = (totalShowcaseLeaves - showcaseFlipped + 2);
        }
        showcaseFlipped--;
      }
    }

    // Ensure last page (#leaf-last) has highest z-index and active pointer-events when reached
    const leafLast = document.getElementById('leaf-last');
    if (leafLast) {
      if (showcaseFlipped >= totalShowcaseLeaves) {
        leafLast.style.zIndex = 30;
        leafLast.style.pointerEvents = 'auto';
      } else {
        leafLast.style.zIndex = 1;
        leafLast.style.pointerEvents = 'none';
      }
    }

    const statusEl = document.getElementById('showcase-turn-status');
    if (statusEl) {
      const p1 = showcaseFlipped * 2 + 1;
      const p2 = p1 + 1;
      statusEl.textContent = `Trang ${p1} - ${p2} / 6`;
    }
  };

  // 2. Fullscreen Modal 3D Reader (10 Bộ Kinh Sách)
  let currentBookKey = 'bk-trungbo';
  let currentLeftPageIdx = 0;
  let isFlippingAnim = false;

  function getCurrentBookPages() {
    if (window.LIDO_ALL_BOOKS_3D && window.LIDO_ALL_BOOKS_3D[currentBookKey]) {
      return window.LIDO_ALL_BOOKS_3D[currentBookKey].pages || [];
    }
    return [];
  }

  function renderPageToElement(pageData, prefix) {
    const tagEl = document.getElementById(`${prefix}-tag`);
    const titleEl = document.getElementById(`${prefix}-title`);
    const bodyEl = document.getElementById(`${prefix}-body`);
    const footEl = document.getElementById(`${prefix}-foot`);

    if (!pageData) {
      if (tagEl) tagEl.textContent = "";
      if (titleEl) titleEl.textContent = "";
      if (bodyEl) bodyEl.innerHTML = "<p style='text-align:center; color:#9c8e7e; padding-top:40px;'>— Hết trang sách —</p>";
      if (footEl) footEl.textContent = "";
      return;
    }

    if (tagEl) tagEl.textContent = pageData.tag || "";
    if (titleEl) titleEl.textContent = pageData.title || "";
    if (bodyEl) bodyEl.innerHTML = pageData.body || "";
    if (footEl) footEl.textContent = pageData.footer || "";
  }

  function updateStaticPagesView() {
    const pages = getCurrentBookPages();
    if (!pages || pages.length === 0) return;

    const leftData = pages[currentLeftPageIdx];
    const rightData = pages[currentLeftPageIdx + 1];

    renderPageToElement(leftData, 'm-left');
    renderPageToElement(rightData, 'm-right');

    const indicator = document.getElementById('modal-turn-indicator');
    if (indicator) {
      const p1 = currentLeftPageIdx + 1;
      const p2 = Math.min(currentLeftPageIdx + 2, pages.length);
      indicator.innerText = `Trang ${p1} - ${p2} / ${pages.length}`;
    }
  }

  window.turn50ModalPage = function(step) {
    if (isFlippingAnim) return;
    const pages = getCurrentBookPages();
    if (!pages || pages.length === 0) return;

    const targetIdx = currentLeftPageIdx + step;
    if (targetIdx < 0 || targetIdx >= pages.length) return;

    const flipLeaf = document.getElementById('m-flipping-leaf');
    if (!flipLeaf) {
      currentLeftPageIdx = targetIdx;
      updateStaticPagesView();
      return;
    }

    isFlippingAnim = true;

    if (step > 0) {
      renderPageToElement(pages[currentLeftPageIdx + 1], 'm-flip-front');
      renderPageToElement(pages[targetIdx], 'm-flip-back');

      flipLeaf.style.transition = 'none';
      flipLeaf.classList.remove('flipped');
      flipLeaf.style.zIndex = 20;

      void flipLeaf.offsetWidth;

      flipLeaf.style.transition = 'transform 0.85s cubic-bezier(0.4, 0.08, 0.2, 1), box-shadow 0.85s ease';
      flipLeaf.classList.add('flipped');

      setTimeout(() => {
        currentLeftPageIdx = targetIdx;
        updateStaticPagesView();
        flipLeaf.style.transition = 'none';
        flipLeaf.classList.remove('flipped');
        flipLeaf.style.zIndex = 1;
        isFlippingAnim = false;
      }, 860);

    } else {
      renderPageToElement(pages[currentLeftPageIdx], 'm-flip-back');
      renderPageToElement(pages[targetIdx + 1], 'm-flip-front');

      flipLeaf.style.transition = 'none';
      flipLeaf.classList.add('flipped');
      flipLeaf.style.zIndex = 20;

      void flipLeaf.offsetWidth;

      flipLeaf.style.transition = 'transform 0.85s cubic-bezier(0.4, 0.08, 0.2, 1), box-shadow 0.85s ease';
      flipLeaf.classList.remove('flipped');

      setTimeout(() => {
        currentLeftPageIdx = targetIdx;
        updateStaticPagesView();
        flipLeaf.style.zIndex = 1;
        isFlippingAnim = false;
      }, 860);
    }
  };

  let lastModalTrigger = null;

  window.openZen3DReader = function(bookKey) {
    lastModalTrigger = document.activeElement;
    if (bookKey) currentBookKey = bookKey;
    currentLeftPageIdx = 0;

    if (window.LIDO_ALL_BOOKS_3D && window.LIDO_ALL_BOOKS_3D[currentBookKey]) {
      const bInfo = window.LIDO_ALL_BOOKS_3D[currentBookKey];
      const modalTitle = document.getElementById('modal-book-title');
      if (modalTitle) modalTitle.innerText = bInfo.title || "ĐẠI TẠNG KINH ĐIỂN 3D";
    }

    updateStaticPagesView();
    const modal = document.getElementById('zen-reader-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const closeBtn = document.getElementById('btn-close-reader');
      if (closeBtn) closeBtn.focus();
    }
  };

  window.closeZen3DReader = function() {
    const modal = document.getElementById('zen-reader-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') {
        lastModalTrigger.focus();
      }
    }
  };

  window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('zen-reader-modal');
    if (modal && modal.classList.contains('active')) {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        window.turn50ModalPage(2);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        window.turn50ModalPage(-2);
      } else if (e.key === 'Escape') {
        window.closeZen3DReader();
      } else if (e.key === 'Tab') {
        const focusable = modal.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
  });
});

// ==========================================================================
// LIDO REAL MEDITATION AUDIO ENGINE: YOUTUBE OFFICIAL CHANNEL STREAMING
// (Sử dụng trực tiếp âm thanh hòa tấu thực tế từ kênh @1995lido, êm dịu thanh tịnh)
// ==========================================================================
let lidoYtPlayer = null;
let isLidoYtReady = false;
let isAudioPlaying = false;
let currentTrackYtId = 'T0tzayJ7oYI';

// Load YouTube IFrame Player API
if (!window.YT) {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

window.onYouTubeIframeAPIReady = function() {
  lidoYtPlayer = new YT.Player('lido-yt-hidden-player', {
    height: '1',
    width: '1',
    videoId: currentTrackYtId,
    playerVars: {
      'playsinline': 1,
      'controls': 0,
      'disablekb': 1,
      'fs': 0,
      'rel': 0,
      'origin': window.location.origin
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
};

function onPlayerReady(event) {
  isLidoYtReady = true;
  event.target.setVolume(70);
}

function onPlayerStateChange(event) {
  const dock = document.getElementById('lido-audio-dock');
  const icon = document.getElementById('dock-play-icon');
  const status = document.getElementById('dock-audio-status');

  if (event.data === YT.PlayerState.PLAYING) {
    isAudioPlaying = true;
    if (dock) dock.classList.add('playing');
    if (icon) icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    if (status) {
      const sel = document.getElementById('dock-sound-selector');
      const title = sel ? sel.selectedOptions[0].text : 'Nhạc thiền LIDO';
      status.innerText = 'Đang phát: ' + title;
    }
  } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
    isAudioPlaying = false;
    if (dock) dock.classList.remove('playing');
    if (icon) icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    if (status) status.innerText = 'Tạm dừng • Bấm để nghe';
  }
}

window.toggleZenAmbientAudio = function() {
  const status = document.getElementById('dock-audio-status');

  if (!isLidoYtReady || !lidoYtPlayer) {
    // If API is still loading or fallback
    if (status) status.innerText = 'Đang kết nối suối nguồn âm thanh...';
    setTimeout(window.toggleZenAmbientAudio, 600);
    return;
  }

  if (!isAudioPlaying) {
    lidoYtPlayer.playVideo();
  } else {
    lidoYtPlayer.pauseVideo();
  }
};

window.changeZenAmbientTrack = function(ytId) {
  currentTrackYtId = ytId;
  const status = document.getElementById('dock-audio-status');
  if (status) status.innerText = 'Đang chuyển bản thiền ca...';

  if (lidoYtPlayer && typeof lidoYtPlayer.loadVideoById === 'function') {
    lidoYtPlayer.loadVideoById(ytId);
    lidoYtPlayer.playVideo();
  }
};

// ==========================================================================
// FULLSCREEN SANCTUARY CONTROLS
// ==========================================================================
window.toggleZen3DFullscreen = function(enable) {
  if (enable) {
    document.body.classList.add('zen-3d-fullscreen-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.dispatchEvent) {
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    }
  } else {
    document.body.classList.remove('zen-3d-fullscreen-active');
    if (window.dispatchEvent) {
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    }
  }
};

// ESC key to exit 3D Fullscreen
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('zen-3d-fullscreen-active')) {
    toggleZen3DFullscreen(false);
  }
});

// ==========================================================================
// READER MODE CONTROLS: FONT RESIZING & COLOR THEMES
// ==========================================================================
let currentReaderFontSize = 12; // base size
window.adjustFontSize = function(delta) {
  currentReaderFontSize = Math.min(Math.max(currentReaderFontSize + delta, 10), 18);
  const bookElements = document.querySelectorAll('.page-body-text, .page-verse, .page-body-text p');
  bookElements.forEach(el => {
    el.style.fontSize = currentReaderFontSize + 'px';
    el.style.lineHeight = '1.7';
  });
};

window.setReaderTheme = function(theme) {
  const modal = document.getElementById('zen-reader-modal');
  if (!modal) return;
  modal.classList.remove('reader-theme-sepia', 'reader-theme-dark');
  if (theme === 'sepia') {
    modal.classList.add('reader-theme-sepia');
  } else if (theme === 'dark') {
    modal.classList.add('reader-theme-dark');
  }
};

// Pali Tooltip dictionary integration
const PALI_DICT = {
  'Mūlapariyāya': 'Kinh Pháp Môn Căn Bản — soi rọi nguồn gốc nhận thức của phàm phu và bậc Thánh',
  'Sabbāsava': 'Kinh Tất Cả Lậu Hoặc — 7 pháp môn đoạn tận tham sân si vi tế',
  'Satipaṭṭhāna': 'Tứ Niệm Xứ — Bốn nền tảng chánh niệm: Quán Thân, Thọ, Tâm, Pháp',
  'Majjhima Nikāya': 'Kinh Trung Bộ — Tập hợp 152 bài kinh vừa của Đại Tạng Phật Giáo Gốc',
  'Dīgha Nikāya': 'Kinh Trường Bộ — Tập hợp 34 bài kinh dài cốt tủy',
  'Saṃyutta Nikāya': 'Kinh Tương Ưng Bộ — Các bài kinh đối chiếu theo chủ đề Duyên Khởi & Ngũ Uẩn',
  'Aṅguttara Nikāya': 'Kinh Tăng Chi Bộ — Pháp thoại thực tiễn xếp theo pháp số từ 1 đến 11'
};

function injectPaliTooltips() {
  document.querySelectorAll('.page-body-text, .page-title, .page-chapter-tag').forEach(el => {
    let html = el.innerHTML;
    for (const [term, desc] of Object.entries(PALI_DICT)) {
      const regex = new RegExp(`(?<!<span class="pali-term"[^>]*>)\\b(${term})\\b`, 'g');
      html = html.replace(regex, `<span class="pali-term" data-tooltip="${desc}">$1</span>`);
    }
    el.innerHTML = html;
  });
}

// Hook into updateStaticPagesView
const originalUpdateView = window.updateStaticPagesView;
if (typeof originalUpdateView === 'function') {
  window.updateStaticPagesView = function() {
    originalUpdateView();
    setTimeout(injectPaliTooltips, 50);
  };
}
