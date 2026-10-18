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

  isValidSiteData(data) {
    return (
      typeof data === "object" &&
      data !== null &&
      Array.isArray(data.books) &&
      Array.isArray(data.featured_videos) &&
      typeof data.site_config === "object" &&
      data.site_config !== null &&
      typeof data.site_config.hero_slogan === "string" &&
      typeof data.site_config.donate_bank === "object" &&
      data.site_config.donate_bank !== null
    );
  }

  async loadData() {
    try {
      // Ưu tiên nạp dữ liệu chính thống mới nhất từ mạng kèm kiểm tra HTTP status
      const res = await fetch("data/site_data.json?v=" + Date.now());
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      
      // Kiểm tra tính toàn vẹn cấu trúc dữ liệu JSON qua schema validator
      if (this.isValidSiteData(data)) {
        this.siteData = data;
      } else {
        throw new Error("Dữ liệu JSON tải về không đúng cấu trúc quy định.");
      }
    } catch (err) {
      console.warn("LidoApp: Không thể tải site_data.json hợp lệ từ mạng, thử nạp bản lưu...", err);
      try {
        const local = localStorage.getItem("lido_site_data");
        if (local) {
          const parsedLocal = JSON.parse(local);
          if (this.isValidSiteData(parsedLocal)) {
            this.siteData = parsedLocal;
          } else {
            console.warn("LidoApp: Bản lưu localStorage không đúng schema, bỏ qua.");
          }
        }
      } catch (parseErr) {
        console.error("LidoApp: Lỗi phân tích dữ liệu localStorage:", parseErr);
      }
    }
  }

  renderHeaderAndHero() {
    const cfg = this.siteData?.site_config;
    if (!cfg || typeof cfg !== "object") return;

    const heroSlogan = document.getElementById("hero-slogan");
    if (heroSlogan) {
      const rawSlogan = typeof cfg.hero_slogan === "string" ? cfg.hero_slogan : "";
      const cleanSlogan = rawSlogan.replace('Về Miền Tỉnh Thức — ', '');
      heroSlogan.textContent = "Về Miền Tỉnh Thức — ";
      const span = document.createElement("span");
      span.textContent = cleanSlogan || "Trở Về Cội Nguồn Lời Phật Dạy";
      heroSlogan.appendChild(span);
    }

    const heroSub = document.getElementById("hero-sub");
    if (heroSub) heroSub.textContent = typeof cfg.hero_sub === "string" ? cfg.hero_sub : "";

    const heroQuote = document.getElementById("hero-quote");
    if (heroQuote) heroQuote.textContent = typeof cfg.quote === "string" ? `"${cfg.quote}"` : "";

    const heroQuoteSource = document.getElementById("hero-quote-source");
    if (heroQuoteSource) heroQuoteSource.textContent = typeof cfg.quote_source === "string" ? `— ${cfg.quote_source}` : "";
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
    const ytRegex = /^[a-zA-Z0-9_-]{11}$/;

    this.siteData.featured_videos.forEach(v => {
      // Validate YouTube ID nghiêm ngặt (đúng 11 ký tự chuẩn định dạng YouTube)
      const rawYtId = (v.youtube_id || "").trim();
      if (!ytRegex.test(rawYtId)) {
        console.warn("LidoApp: Bỏ qua video có YouTube ID không hợp lệ:", v);
        return;
      }
      const cleanYtId = rawYtId;
      
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
      const spanViews = document.createElement("span");
      spanViews.textContent = `🔥 ${v.views || ''}`;
      const spanDur = document.createElement("span");
      spanDur.textContent = `⏱️ ${v.duration || ''}`;
      const spanCat = document.createElement("span");
      spanCat.textContent = `🪷 ${v.category || ''}`;
      meta.appendChild(spanViews);
      meta.appendChild(spanDur);
      meta.appendChild(spanCat);

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
      const rawUrl = typeof bk.read_url === "string" ? bk.read_url : "#";
      const isSafeUrl = rawUrl.startsWith("https://") || rawUrl.startsWith("http://");

      const card = document.createElement("div");
      card.className = "book-card";

      const top = document.createElement("div");
      top.className = "book-card-top";

      const headerTags = document.createElement("div");
      headerTags.className = "book-header-tags";
      const badgeSpan = document.createElement("span");
      badgeSpan.className = `badge ${badgeClass}`;
      badgeSpan.textContent = bk.badge || 'Kinh Điển';
      const sourceSpan = document.createElement("span");
      sourceSpan.className = "book-source-tag";
      sourceSpan.textContent = bk.source_name || 'Đạo Phật Gốc';
      headerTags.appendChild(badgeSpan);
      headerTags.appendChild(sourceSpan);

      const title = document.createElement("h3");
      title.className = "book-title";
      title.textContent = bk.title || "";

      const author = document.createElement("div");
      author.className = "book-author";
      const authorText = document.createTextNode(`${bk.author || ''} • `);
      const transItalic = document.createElement("i");
      transItalic.textContent = bk.translator || '';
      author.appendChild(authorText);
      author.appendChild(transItalic);

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
    const cleanYtId = (ytId || "").trim();
    if (!/^[a-zA-Z0-9_-]{11}$/.test(cleanYtId)) {
      console.warn("LidoApp: YouTube ID không hợp lệ cho mini player:", ytId);
      return;
    }
    this.activeVideoId = cleanYtId;
    const mini = document.getElementById("zen-mini-player");
    const pTitle = document.getElementById("mini-player-title");
    const pFrame = document.getElementById("mini-player-iframe");
    const pStatus = document.getElementById("mini-player-status");

    if (pTitle) pTitle.innerText = title;
    if (pStatus) pStatus.innerText = "Đang phát tần số 432Hz • Lido 1995";
    if (pFrame) {
      pFrame.src = `https://www.youtube.com/embed/${cleanYtId}?autoplay=1&enablejsapi=1`;
      pFrame.style.display = "block";
    }
    if (mini) mini.style.borderColor = "var(--zen-gold)";
  }
}

// Global Instance
const lidoApp = new LidoApp();
window.addEventListener("DOMContentLoaded", () => lidoApp.init());
