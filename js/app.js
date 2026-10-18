/**
 * ==========================================================================
 * LIDO CORE APPLICATION CONTROLLER (MODULAR JAVASCRIPT)
 * Features:
 * - Reactive Data Binding from site_data.json
 * - Persistent Floating YouTube Mini Player with continuous playback
 * - Dynamic Category Filtering for Nikāya & Chơn Như books
 * - VietQR Dynamic Image Fallback & Bank Rendering
 * ==========================================================================
 */

class LidoApp {
  constructor() {
    this.siteData = null;
    this.currentCategory = 'all';
    this.activeVideoId = '94IPu4HPcUc';
    this.isPlaying = false;
    this.ytPlayer = null;
  }

  async init() {
    await this.loadData();
    this.renderHeaderAndHero();
    this.renderVideos();
    this.renderBooks();
    this.renderDonateSection();
    this.renderHealthDisclaimer();
    this.initMiniPlayer();
  }

  async loadData() {
    try {
      // Ưu tiên nạp dữ liệu chính thống mới nhất từ mạng (tránh tình trạng admin sửa nháp làm lệch màn hình khách)
      const res = await fetch("data/site_data.json?v=" + Date.now());
      this.siteData = await res.json();
    } catch (err) {
      console.warn("LidoApp: Không thể tải site_data.json từ mạng, thử nạp bản lưu...", err);
      const local = localStorage.getItem("lido_site_data");
      if (local) this.siteData = JSON.parse(local);
    }
  }

  renderHeaderAndHero() {
    const cfg = this.siteData?.site_config;
    if (!cfg) return;

    const heroSlogan = document.getElementById("hero-slogan");
    if (heroSlogan) {
      const cleanSlogan = cfg.hero_slogan.replace('Về Miền Tỉnh Thức — ', '');
      heroSlogan.innerHTML = `Về Miền Tỉnh Thức — <span>${this.escapeHtml(cleanSlogan) || 'Trở Về Cội Nguồn Lời Phật Dạy'}</span>`;
    }

    const heroSub = document.getElementById("hero-sub");
    if (heroSub) heroSub.textContent = cfg.hero_sub || "";

    const heroQuote = document.getElementById("hero-quote");
    if (heroQuote) heroQuote.textContent = `"${cfg.quote || ''}"`;

    const heroQuoteSource = document.getElementById("hero-quote-source");
    if (heroQuoteSource) heroQuoteSource.textContent = `— ${cfg.quote_source || ''}`;
  }

  renderHealthDisclaimer() {
    const textEl = document.getElementById("health-disclaimer-text");
    if (textEl && this.siteData?.site_config?.health_disclaimer) {
      textEl.textContent = this.siteData.site_config.health_disclaimer;
    }
  }

  escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  renderVideos() {
    const vGrid = document.getElementById("video-grid-container");
    if (!vGrid || !this.siteData?.featured_videos) return;

    vGrid.innerHTML = this.siteData.featured_videos.map(v => `
      <div class="video-card">
        <div class="video-frame">
          <iframe 
            src="https://www.youtube.com/embed/${v.youtube_id}" 
            title="${v.title}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
        <div class="video-info">
          <div class="video-meta">
            <span>🔥 ${v.views}</span>
            <span>⏱️ ${v.duration}</span>
            <span>🪷 ${v.category}</span>
          </div>
          <h3 class="video-title">${v.title}</h3>
          <p class="video-desc">${v.desc}</p>
          <div class="video-actions">
            <button class="btn btn-outline" style="font-size: 0.8rem; padding: 0.4rem 0.9rem;" onclick="lidoApp.playInMiniPlayer('${v.youtube_id}', '${v.title.replace(/'/g, "\\'")}')">
              🎧 Phát Trình Thu Nhỏ
            </button>
            <a href="https://www.youtube.com/watch?v=${v.youtube_id}" target="_blank" rel="noopener noreferrer" class="link-external">
              Xem trên YouTube ↗
            </a>
          </div>
        </div>
      </div>
    `).join("");
  }

  renderBooks() {
    const bGrid = document.getElementById("books-grid-container");
    if (!bGrid || !this.siteData?.books) return;

    const filtered = this.siteData.books.filter(bk => {
      if (this.currentCategory === 'all') return true;
      return bk.category === this.currentCategory;
    });

    bGrid.innerHTML = filtered.map(bk => {
      let badgeClass = "badge-gold";
      if (bk.category === 'thonglac') badgeClass = "badge-terracotta";
      else if (bk.category === 'thien') badgeClass = "badge-forest";

      return `
        <div class="book-card">
          <div class="book-card-top">
            <div class="book-header-tags">
              <span class="badge ${badgeClass}">${bk.badge || 'Kinh Điển'}</span>
              <span class="book-source-tag">${bk.source_name || 'Đạo Phật Gốc'}</span>
            </div>
            <h3 class="book-title">${bk.title}</h3>
            <div class="book-author">${bk.author} • <i>${bk.translator}</i></div>
            <p class="book-summary">${bk.summary}</p>
          </div>
          <div class="book-card-bottom">
            <a href="${bk.read_url || '#'}" target="_blank" rel="noopener noreferrer" class="book-action-btn">
              <span>Đọc trọn tác phẩm</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <span class="book-status-badge">Công đức vô lượng</span>
          </div>
        </div>
      `;
    }).join("");
  }

  filterCategory(cat, btnElement) {
    this.currentCategory = cat;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    if (btnElement) btnElement.classList.add("active");
    this.renderBooks();
  }

  renderDonateSection() {
    const b = this.siteData?.site_config?.donate_bank;
    if (!b) return;

    const bankName = document.getElementById("donate-bank-name");
    if (bankName) bankName.innerText = b.bank_name || "BIDV";

    const accName = document.getElementById("donate-acc-name");
    if (accName) accName.innerText = b.account_name || "NGUYEN ANH TUAN";

    const accNum = document.getElementById("donate-acc-number");
    if (accNum) accNum.innerText = b.account_number || "1401132757";

    const syntax = document.getElementById("donate-syntax");
    if (syntax) syntax.innerText = b.transfer_syntax || "Ho Tri Tu Sach LIDO";

    const qrImg = document.getElementById("vietqr-img");
    if (qrImg) {
      if (b.qr_image) {
        qrImg.src = b.qr_image;
      } else {
        qrImg.src = `https://img.vietqr.io/image/BIDV-${b.account_number}-compact2.png?amount=0&addInfo=${encodeURIComponent(b.transfer_syntax)}&accountName=${encodeURIComponent(b.account_name)}`;
      }
    }
  }

  initMiniPlayer() {
    const firstVid = this.siteData?.featured_videos?.[0];
    if (firstVid) {
      const pTitle = document.getElementById("mini-player-title");
      if (pTitle) pTitle.innerText = firstVid.title;
    }
  }

  playInMiniPlayer(ytId, title) {
    this.activeVideoId = ytId;
    const mini = document.getElementById("zen-mini-player");
    const pTitle = document.getElementById("mini-player-title");
    const pFrame = document.getElementById("mini-player-iframe");
    const pStatus = document.getElementById("mini-player-status");

    if (pTitle) pTitle.innerText = title;
    if (pStatus) pStatus.innerText = "Đang phát tần số 432Hz • Lido 1995";
    if (pFrame) {
      pFrame.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&enablejsapi=1`;
      pFrame.style.display = "block";
    }
    if (mini) mini.style.borderColor = "var(--zen-gold)";
  }
}

// Global Instance
const lidoApp = new LidoApp();
window.addEventListener("DOMContentLoaded", () => lidoApp.init());
