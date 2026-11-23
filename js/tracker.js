/**
 * =============================================================================
 * LIDO CLOUD VISITOR TRACKER & NOTIFICATION TELEMETRY ENGINE
 * =============================================================================
 * - Bộ đếm lượt xem vĩnh viễn trên Cloud (Atomic Cloud Counter, không bị reset)
 * - Tự động gửi email thông báo về nguyenanhtuan92my@gmail.com khi có khách ghé thăm
 * - Thu thập danh tính (Tên/Pháp danh, Email) khi khách để lại lời nhắn/cầu an/gieo quẻ
 * - Lưu trữ đối soát 2 lớp: Cloud Counter API + LocalStorage cache
 * =============================================================================
 */

(function () {
  const COUNTER_API_BASE = 'https://countapi.mileshilliard.com/api/v1';
  const COUNTER_KEY = 'lido_buddhist_library_prod_visits_v1';
  const ADMIN_EMAIL = 'nguyenanhtuan92my@gmail.com';
  const NOTIFY_URL = 'https://formsubmit.co/ajax/' + ADMIN_EMAIL;
  const STORAGE_VIEW_KEY = 'lido_permanent_view_count';
  const SESSION_RECORDED_KEY = 'lido_visit_session_recorded';
  const SESSION_EMAIL_KEY = 'lido_visit_email_notified';

  class LidoTracker {
    constructor() {
      this.currentViews = parseInt(localStorage.getItem(STORAGE_VIEW_KEY) || '25', 10);
      this.init();
    }

    init() {
      // 1. Hiển thị ngay số lượt xem từ cache để UI không bao giờ bị giật hoặc chờ
      this.updateUI(this.currentViews);

      // 2. Ghi nhận lượt truy cập
      this.recordVisit();

      // 3. Lắng nghe các thay đổi danh tính trên trang
      this.setupIdentityListeners();
    }

    // Cập nhật tất cả badge đếm trên giao diện
    updateUI(count) {
      if (!count || isNaN(count)) count = 25;
      const formatted = Number(count).toLocaleString('vi-VN');
      
      const elMain = document.getElementById('lido-visitor-count');
      if (elMain) {
        elMain.textContent = formatted;
        elMain.style.opacity = '1';
      }

      document.querySelectorAll('.lido-visitor-count-val').forEach((item) => {
        item.textContent = formatted;
        item.style.opacity = '1';
      });
    }

    // Ghi nhận lượt truy cập (Atomic increment mỗi phiên mới)
    async recordVisit() {
      const isNewSession = !sessionStorage.getItem(SESSION_RECORDED_KEY);

      if (isNewSession) {
        // Phiên mới: Tăng bộ đếm +1 trên Cloud
        try {
          const res = await fetch(`${COUNTER_API_BASE}/hit/${COUNTER_KEY}`);
          if (res.ok) {
            const data = await res.json();
            if (data && typeof data.value === 'number') {
              this.currentViews = data.value;
              localStorage.setItem(STORAGE_VIEW_KEY, this.currentViews.toString());
              sessionStorage.setItem(SESSION_RECORDED_KEY, '1');
              this.updateUI(this.currentViews);
              this.sendVisitEmail(this.currentViews);
              return;
            }
          }
        } catch (e) {
          console.warn('LidoTracker: Cloud counter hit failed, using fallback', e);
        }

        // Fallback nội bộ nếu cloud tạm nghẽn
        this.currentViews += 1;
        localStorage.setItem(STORAGE_VIEW_KEY, this.currentViews.toString());
        sessionStorage.setItem(SESSION_RECORDED_KEY, '1');
        this.updateUI(this.currentViews);
        this.sendVisitEmail(this.currentViews);
      } else {
        // Cùng phiên (F5 hoặc chuyển trang): Chỉ đọc số lượt xem hiện tại, không tăng ảo
        try {
          const res = await fetch(`${COUNTER_API_BASE}/get/${COUNTER_KEY}`);
          if (res.ok) {
            const data = await res.json();
            if (data && typeof data.value === 'number') {
              this.currentViews = data.value;
              localStorage.setItem(STORAGE_VIEW_KEY, this.currentViews.toString());
              this.updateUI(this.currentViews);
            }
          }
        } catch (e) {
          // Dùng cache hiện có
          this.updateUI(this.currentViews);
        }
      }
    }

    // Thu thập thông tin thiết bị
    getDeviceInfo() {
      const ua = navigator.userAgent;
      let dev = 'Máy tính (Desktop)';
      if (/tablet|ipad|playbook|silk/i.test(ua)) {
        dev = 'Máy tính bảng (Tablet)';
      } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
        dev = 'Điện thoại (Mobile)';
      }
      return `${dev} • Màn hình: ${window.screen.width}x${window.screen.height}`;
    }

    // Lấy danh tính đã lưu của khách (nếu có)
    getKnownIdentity() {
      const name = localStorage.getItem('lido_user_name') || localStorage.getItem('lido_my_name') || '';
      const email = localStorage.getItem('lido_user_email') || '';
      if (name && email) return `${name} <${email}>`;
      if (name) return `${name} (Chưa lưu email)`;
      if (email) return `<${email}>`;
      return 'Khách hữu duyên (Chưa để lại tên/email)';
    }

    // Gửi email thông báo khi có người ghé thăm website
    async sendVisitEmail(viewCount) {
      // Mỗi phiên duyệt web chỉ gửi 1 thông báo để tránh làm phiền hộp thư Gmail của chủ website
      if (sessionStorage.getItem(SESSION_EMAIL_KEY)) return;
      sessionStorage.setItem(SESSION_EMAIL_KEY, '1');

      const now = new Date();
      const timeStr = now.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const ref = document.referrer ? document.referrer : 'Trực tiếp (Direct / Bookmark / Zalo / App)';
      const identity = this.getKnownIdentity();
      const pageInfo = document.title + ' (' + window.location.pathname + ')';

      const payload = {
        _subject: `🔔 [LIDO Thư Viện] Có khách vừa ghé thăm website (Lượt #${viewCount})`,
        _captcha: 'false',
        _template: 'table',
        'Lượt Truy Cập Thứ': `#${viewCount}`,
        'Danh Tính Khách': identity,
        'Thời Gian (GMT+7)': timeStr,
        'Trang Ghé Thăm': pageInfo,
        'Nguồn Giới Thiệu (Referrer)': ref,
        'Thiết Bị': this.getDeviceInfo(),
        'Trình Duyệt': navigator.userAgent,
        'Ngôn Ngữ': navigator.language || 'vi-VN'
      };

      try {
        await fetch(NOTIFY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('LidoTracker: Notification fetch notice', err);
      }
    }

    // Gửi email thông báo tức thì khi khách để lại thông tin / lời nhắn
    async sendIdentityNotification({ name, email, message, type }) {
      if (name) localStorage.setItem('lido_user_name', name);
      if (email) localStorage.setItem('lido_user_email', email);

      const now = new Date();
      const timeStr = now.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const payload = {
        _subject: `💌 [LIDO Thư Viện] ${type || 'Khách để lại thông tin'}: ${name || 'Đạo hữu'}`,
        _captcha: 'false',
        _template: 'table',
        'Loại Tương Tác': type || 'Sổ Lưu Bút / Góp Ý',
        'Họ Tên / Pháp Danh': name || 'Phật tử ẩn danh',
        'Email Liên Hệ': email || 'Chưa cung cấp',
        'Nội Dung / Lời Nhắn': message || '(Không có nội dung)',
        'Thời Gian (GMT+7)': timeStr,
        'Tổng Lượt Xem Hiện Tại': `#${this.currentViews}`,
        'Trang Gửi': window.location.href,
        'Thiết Bị': this.getDeviceInfo()
      };

      try {
        await fetch(NOTIFY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.warn('LidoTracker: Identity notify error', e);
      }
    }

    // Tự động nhận diện khi người dùng điền tên vào bất kỳ ô input tên nào trên web
    setupIdentityListeners() {
      document.addEventListener('change', (e) => {
        const t = e.target;
        if (!t) return;
        if (t.id === 'wish-name' || t.id === 'prayer-name' || t.id === 'hd-name' || t.id === 'lot-user-name') {
          const val = (t.value || '').trim();
          if (val && val.length >= 2) {
            localStorage.setItem('lido_user_name', val);
          }
        }
        if (t.id === 'wish-email' || t.type === 'email') {
          const val = (t.value || '').trim();
          if (val && val.includes('@')) {
            localStorage.setItem('lido_user_email', val);
          }
        }
      });
    }
  }

  // Khởi tạo global instance
  const tracker = new LidoTracker();
  window.lidoTracker = tracker;
  window.sendLidoIdentityNotification = function (data) {
    return tracker.sendIdentityNotification(data);
  };

  // Cập nhật UI khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => tracker.updateUI(tracker.currentViews));
  } else {
    tracker.updateUI(tracker.currentViews);
  }
})();
