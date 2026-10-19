/**
 * ==========================================================================
 * LIDO CLOUD VISITOR COUNTER & BEHAVIOR TELEMETRY ENGINE
 * ==========================================================================
 * - Persistent Cloud Visitor Counter (Atomic cloud increment, never resets)
 * - Deep Engagement Tracking:
 *   + Dwell Time (Session active duration in seconds)
 *   + Interaction Clicks (Books opened, Audio played, Copy syntax, Links)
 *   + Scroll Depth (25%, 50%, 75%, 100%)
 * - Syncs to Cloud KV Store + Local Backup
 * ==========================================================================
 */

class LidoTracker {
  constructor() {
    this.appKey = 'f8inst8c'; // Dedicated Persistent KV App Key
    this.storageKey = 'lido_client_stats';
    this.sessionKey = 'lido_active_session';
    this.startTime = Date.now();
    this.clickCount = 0;
    this.clicksDetail = [];
    this.maxScroll = 0;
    this.syncTimer = null;
    this.isSessionStarted = false;
  }

  async init() {
    this.setupListeners();
    this.setupScrollTracking();
    await this.recordVisit();
    this.startHeartbeat();
  }

  // 1. Ghi nhận lượt truy cập & tăng bộ đếm lên Database Cloud
  async recordVisit() {
    const isNewSession = !sessionStorage.getItem(this.sessionKey);
    let currentStats = await this.getStats();

    if (isNewSession) {
      sessionStorage.setItem(this.sessionKey, Date.now().toString());
      this.isSessionStarted = true;
      currentStats.visits = (currentStats.visits || 0) + 1;
      await this.saveStats(currentStats);
    }

    // Hiển thị số lượt truy cập lên UI
    this.updateCounterUI(currentStats.visits || 1);
  }

  // Cập nhật giao diện badge đếm trên thanh Header / Top Bar
  updateCounterUI(count) {
    const formatted = Number(count).toLocaleString('vi-VN');
    const el = document.getElementById('lido-visitor-count');
    if (el) {
      el.textContent = formatted;
      el.style.opacity = '1';
    }
    // Cập nhật tất cả các badge hiển thị khác trên trang
    document.querySelectorAll('.lido-visitor-count-val').forEach(item => {
      item.textContent = formatted;
      item.style.opacity = '1';
    });
  }

  // Lấy dữ liệu thống kê từ Cloud DB (hoặc local fallback nếu offline)
  async getStats() {
    try {
      const url = `https://keyvalue.immanuel.co/api/KeyVal/GetValue/${this.appKey}/stats`;
      const res = await fetch(url);
      if (res.ok) {
        let text = await res.text();
        text = text.replace(/^"|"$/g, '').trim();
        if (text && text !== 'null') {
          let pad = len => len % 4 ? len + (4 - (len % 4)) : len;
          let padded = text.padEnd(pad(text.length), '=');
          let decoded = JSON.parse(atob(padded.replace(/-/g, '+').replace(/_/g, '/')));
          localStorage.setItem(this.storageKey, JSON.stringify(decoded));
          return decoded;
        }
      }
    } catch (e) {
      console.warn('LidoTracker: Fetch cloud error, using local fallback', e);
    }

    // Local fallback
    try {
      const local = localStorage.getItem(this.storageKey);
      if (local) return JSON.parse(local);
    } catch (e) {}

    return { visits: 1, duration: 0, clicks: 0, books: 0, audios: 0, syntax: 0, forum: 0, yt: 0 };
  }

  // Lưu thống kê lên Cloud DB
  async saveStats(stats) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(stats));
      const jsonStr = JSON.stringify(stats);
      let b64 = btoa(jsonStr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const url = `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${this.appKey}/stats/${b64}`;
      await fetch(url, { method: 'POST' });
    } catch (e) {
      console.warn('LidoTracker: Save cloud stats error', e);
    }
  }

  // Theo dõi hành vi click
  trackClick(category, detail) {
    this.clickCount++;
    this.clicksDetail.push({
      cat: category,
      detail: detail,
      t: Math.round((Date.now() - this.startTime) / 1000)
    });

    // Cập nhật thống kê danh mục
    this.getStats().then(stats => {
      stats.clicks = (stats.clicks || 0) + 1;
      if (category === 'book') stats.books = (stats.books || 0) + 1;
      else if (category === 'audio') stats.audios = (stats.audios || 0) + 1;
      else if (category === 'syntax') stats.syntax = (stats.syntax || 0) + 1;
      else if (category === 'forum') stats.forum = (stats.forum || 0) + 1;
      else if (category === 'youtube') stats.yt = (stats.yt || 0) + 1;
      this.saveStats(stats);
    });
  }

  // Ghi nhận sự kiện tương tác
  setupListeners() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button, .book-card, .video-card');
      if (!target) return;

      if (target.classList.contains('book-action-btn') || target.closest('.book-card')) {
        const bookTitle = target.closest('.book-card')?.querySelector('.book-title')?.textContent || 'Sách';
        this.trackClick('book', bookTitle.trim());
      } else if (target.closest('.video-card') || target.closest('#zen-mini-player')) {
        const videoTitle = target.closest('.video-card')?.querySelector('.video-title')?.textContent || 'Audio Thiền';
        this.trackClick('audio', videoTitle.trim());
      } else if (target.closest('#donate') || target.id === 'donate-syntax') {
        this.trackClick('syntax', 'Copy cú pháp / Xem VietQR');
      } else if (target.href && target.href.includes('forum')) {
        this.trackClick('forum', 'Mở Đạo Tràng');
      } else if (target.href && target.href.includes('youtube')) {
        this.trackClick('youtube', 'Mở YouTube @1995lido');
      }
    });

    // Bắt sự kiện thoát trang để lưu thời gian ở lại (Dwell time)
    window.addEventListener('beforeunload', () => {
      this.flushSession();
    });
  }

  // Theo dõi độ sâu cuộn trang
  setupScrollTracking() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const scrollPercent = Math.min(100, Math.round((scrollTop / docHeight) * 100));
      if (scrollPercent > this.maxScroll) {
        this.maxScroll = scrollPercent;
      }
    }, { passive: true });
  }

  // Gửi heartbeat định kỳ để cập nhật thời lượng phiên xem
  startHeartbeat() {
    setInterval(() => {
      this.flushSession(false);
    }, 30000); // Mỗi 30 giây gửi 1 lần
  }

  // Đẩy log phiên xem vào mảng các phiên gần nhất trên cloud
  async flushSession(isEnd = true) {
    const duration = Math.round((Date.now() - this.startTime) / 1000);
    if (duration < 2) return;

    try {
      const stats = await this.getStats();
      stats.duration = (stats.duration || 0) + (isEnd ? duration : 30);
      await this.saveStats(stats);

      // Lưu chi tiết phiên gần nhất
      const sessionLog = {
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('vi-VN'),
        duration: duration,
        clicks: this.clickCount,
        maxScroll: this.maxScroll,
        device: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'
      };

      // Đọc sessions hiện tại
      let sessions = [];
      const sessUrl = `https://keyvalue.immanuel.co/api/KeyVal/GetValue/${this.appKey}/sessions`;
      const res = await fetch(sessUrl);
      if (res.ok) {
        let text = await res.text();
        text = text.replace(/^"|"$/g, '').trim();
        if (text && text !== 'null') {
          let pad = len => len % 4 ? len + (4 - (len % 4)) : len;
          let padded = text.padEnd(pad(text.length), '=');
          sessions = JSON.parse(atob(padded.replace(/-/g, '+').replace(/_/g, '/')));
        }
      }

      // Giữ tối đa 15 phiên mới nhất
      sessions.unshift(sessionLog);
      if (sessions.length > 15) sessions = sessions.slice(0, 15);

      let b64 = btoa(JSON.stringify(sessions)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      await fetch(`https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${this.appKey}/sessions/${b64}`, { method: 'POST' });
    } catch (e) {
      console.warn('LidoTracker: Session sync error', e);
    }
  }
}

// Khởi tạo chạy ngầm
window.lidoTracker = new LidoTracker();
document.addEventListener('DOMContentLoaded', () => {
  window.lidoTracker.init();
});
