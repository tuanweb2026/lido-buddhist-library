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

    vGrid.innerHTML = "";
    this.siteData.featured_videos.forEach(v => {
      // Validate YouTube ID (chỉ cho phép ký tự alphanumeric, gạch dưới, gạch ngang)
      const cleanYtId = (v.youtube_id || "").replace(/[^a-zA-Z0-9_-]/g, "");
      
      const card = document.createElement("div");
      card.className = "video-card";

      const frame = document.createElement("div");
      frame.className = "video-frame";
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${cleanYtId}`;
      iframe.title = v.title || "Nhạc Thiền";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      frame.appendChild(iframe);

      const info = document.createElement("div");
      info.className = "video-info";

      const meta = document.createElement("div");
      meta.className = "video-meta";
      meta.innerHTML = `<span>🔥 ${this.escapeHtml(v.views || '')}</span> <span>⏱️ ${this.escapeHtml(v.duration || '')}</span> <span>🪷 ${this.escapeHtml(v.category || '')}</span>`;

      const title = document.createElement("h3");
      title.className = "video-title";
      title.textContent = v.title || "";

      const desc = document.createElement("p");
      desc.className = "video-desc";
      desc.textContent = v.desc || "";

      const actions = document.createElement("div");
      actions.className = "video-actions";

      const playBtn = document.createElement("button");
      playBtn.className = "btn btn-outline";
      playBtn.style.fontSize = "0.8rem";
      playBtn.style.padding = "0.4rem 0.9rem";
      playBtn.textContent = "🎧 Phát Trình Thu Nhỏ";
      playBtn.onclick = () => this.playInMiniPlayer(cleanYtId, v.title || "Nhạc Thiền");

      const link = document.createElement("a");
      link.href = `https://www.youtube.com/watch?v=${cleanYtId}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "link-external";
      link.textContent = "Xem trên YouTube ↗";

      actions.appendChild(playBtn);
      actions.appendChild(link);

      info.appendChild(meta);
      info.appendChild(title);
      info.appendChild(desc);
      info.appendChild(actions);

      card.appendChild(frame);
      card.appendChild(info);
      vGrid.appendChild(card);
    });
  }

  renderBooks() {
    const bGrid = document.getElementById("books-grid-container");
    if (!bGrid || !this.siteData?.books) return;

    const filtered = this.siteData.books.filter(bk => {
      if (this.currentCategory === 'all') return true;
      return bk.category === this.currentCategory;
    });

    bGrid.innerHTML = "";
    filtered.forEach(bk => {
      let badgeClass = "badge-gold";
      if (bk.category === 'thonglac') badgeClass = "badge-terracotta";
      else if (bk.category === 'thien') badgeClass = "badge-forest";

      // Chỉ cho phép URL an toàn (http/https)
      const rawUrl = bk.read_url || "#";
      const isSafeUrl = rawUrl.startsWith("https://") || rawUrl.startsWith("http://");

      const card = document.createElement("div");
      card.className = "book-card";

      const top = document.createElement("div");
      top.className = "book-card-top";

      const headerTags = document.createElement("div");
      headerTags.className = "book-header-tags";
      headerTags.innerHTML = `<span class="badge ${badgeClass}">${this.escapeHtml(bk.badge || 'Kinh Điển')}</span><span class="book-source-tag">${this.escapeHtml(bk.source_name || 'Đạo Phật Gốc')}</span>`;

      const title = document.createElement("h3");
      title.className = "book-title";
      title.textContent = bk.title || "";

      const author = document.createElement("div");
      author.className = "book-author";
      author.innerHTML = `${this.escapeHtml(bk.author || '')} • <i>${this.escapeHtml(bk.translator || '')}</i>`;

      const summary = document.createElement("p");
      summary.className = "book-summary";
      summary.textContent = bk.summary || "";

      top.appendChild(headerTags);
      top.appendChild(title);
      top.appendChild(author);
      top.appendChild(summary);

      const bottom = document.createElement("div");
      bottom.className = "book-card-bottom";

      const actionLink = document.createElement("a");
      actionLink.href = isSafeUrl ? rawUrl : "#";
      actionLink.target = isSafeUrl ? "_blank" : "_self";
      actionLink.rel = "noopener noreferrer";
      actionLink.className = "book-action-btn";
      actionLink.innerHTML = `<span>Đọc trọn tác phẩm</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

      const statusBadge = document.createElement("span");
      statusBadge.className = "book-status-badge";
      statusBadge.textContent = "Công đức vô lượng";

      bottom.appendChild(actionLink);
      bottom.appendChild(statusBadge);

      card.appendChild(top);
      card.appendChild(bottom);
      bGrid.appendChild(card);
    });
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
