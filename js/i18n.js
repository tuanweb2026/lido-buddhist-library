/**
 * =============================================================================
 * LIDO BUDDHIST LIBRARY - BILINGUAL INTERNATIONALIZATION (i18n) ENGINE
 * =============================================================================
 * Supports seamless Vietnamese (🇻🇳 VI) and English (🇬🇧 EN) toggling across
 * all pages and dynamic Zen Reader / Catalog suttas.
 * State persisted in localStorage ('lido_lang').
 * Dispatches 'lido-lang-changed' event on every language switch.
 * =============================================================================
 */

(function () {
  const STORAGE_KEY = 'lido_lang';
  
  const translations = {
    vi: {
      // General & Header
      brand_title: 'Nhạc Thiền 1995 Lido',
      brand_sub: '& Thư Viện Phật Học Nikāya',
      nav_home: 'Trang chủ',
      nav_suttas: '📖 Tủ Sách Nikāya',
      nav_suttas_short: 'Tủ Sách Nikāya',
      nav_temple: '🛕 Chùa Online (Liên Hoa Các)',
      nav_temple_short: 'Chùa Online',
      nav_numerology: '🔮 Thần Số Học',
      nav_tea: '🍵 Gửi Tách Trà',
      nav_3d: '✨ Bản 3D',
      views_label: 'Lượt xem:',
      views_unit: 'lượt xem',
      youtube_btn: 'Kênh @1995lido',
      lang_switch_title: 'Chuyển sang Tiếng Anh (English)',

      // Hero index
      hero_badge: 'Về Miền Tỉnh Thức — Nơi Nương Tựa Của Tâm Hồn',
      hero_title: 'Nhạc Thiền & Kinh Điển Phật Giáo Nguyên Thủy',
      hero_desc: 'Thư viện mở lưu giữ trọn vẹn lời Phật dạy nguyên thủy từ Đại Tạng Kinh Nikāya cùng những giai điệu thiền định an yên tần số 432Hz. Mời bạn thảnh thơi nhấp ngụm trà và bước vào cội nguồn chánh pháp.',
      btn_enter_suttas: 'Bước vào Tủ Sách Nikāya',
      btn_visit_temple: 'Viếng Chùa Online',
      btn_explore_3d: 'Khám phá Không Gian 3D',
      btn_support_tea: 'Gửi Một Tách Trà',

      // Bell & Mindfulness
      bell_title: 'Chuông Tỉnh Thức',
      bell_desc: 'Mời bạn lắng lòng theo một tiếng chuông...',
      bell_btn: 'Thỉnh Chuông',
      bell_audio_label: 'Tiếng chuông thanh tịnh ngân vang',

      // Daily Quote
      daily_quote_badge: 'Lời Phật Dạy Hôm Nay',
      daily_reflection_badge: 'Thực Tập Chánh Niệm',
      btn_share_quote: 'Sao Chép Lời Dạy',

      // Four Noble Truths & Noble Eightfold Path
      four_truths_title: 'Tứ Diệu Đế — Bốn Chân Lý Tối Thượng',
      four_truths_sub: 'Nền tảng giác ngộ mà Đức Thích Ca Mâu Ni đã tuyên thuyết tại Vườn Lộc Uyển.',
      eightfold_path_title: 'Bát Chánh Đạo — Con Đường Thoát Khổ',
      eightfold_path_sub: 'Con đường tám nhánh đưa đến tịch tịnh, thắng trí, giác ngộ và Niết-bàn.',

      // Bookshelf / Catalog Page
      catalog_hero_tag: 'ĐẠI TẠNG NIKĀYA & ĐẠO PHẬT GỐC · MIỄN PHÍ 100%',
      catalog_hero_title: 'Tủ Sách Phật Giáo Nguyên Thủy',
      catalog_hero_subtitle: 'Cho những ngày tâm an yên',
      catalog_hero_desc: 'Tuyển tập kinh điển Phật giáo Nguyên thủy gốc tiếng Pāḷi (Hòa thượng Thích Minh Châu dịch Việt) và các tác phẩm thực hành xả tâm của Trưởng Lão Thích Thông Lạc từ nguồn daophatgoc.com. Mời bạn thảnh thơi nhấp ngụm trà và cùng bước vào cội nguồn lời Phật dạy.',
      catalog_stat_suttas: 'Kinh Điển & Tác Phẩm',
      catalog_stat_words: 'Nguyên Bản Pāḷi & Việt',
      catalog_stat_cost: 'Miễn Phí Mãi Mãi',
      catalog_stat_reader: 'Không Gian Đọc Tịnh Tâm',
      
      search_placeholder: 'Tìm tên kinh, số hiệu MN, từ khóa Pāḷi (Satipaṭṭhāna, Sabbāsava...)...',
      filter_all: 'Tất cả kinh',
      filter_saved: 'Đã lưu',
      filter_truong_bo: 'Trường Bộ (Dīgha)',
      filter_trung_bo: 'Trung Bộ (Majjhima)',
      filter_tuong_ung: 'Tương Ưng (Saṃyutta)',
      filter_tang_chi: 'Tăng Chi (Aṅguttara)',
      filter_tieu_bo: 'Tiểu Bộ (Khuddaka)',
      filter_dao_phat_goc: 'Đạo Phật Gốc (Thích Thông Lạc)',
      
      btn_read_sutta: 'Đọc bài kinh',
      btn_save: '🤍 Lưu',
      btn_saved: '❤️ Đã lưu',
      btn_remove_bookmark: 'Bỏ lưu',
      btn_add_bookmark: 'Lưu bài đọc',
      audio_available: '🔊 Có MP3',
      reading_time_prefix: '⏱️ ',
      empty_search: 'Không tìm thấy bài kinh phù hợp',
      empty_search_desc: 'Hãy thử tìm bằng từ khóa khác hoặc chuyển sang danh mục "Tất cả".',
      
      // Zen Reader Page
      reader_back_shelf: 'Tủ Sách',
      reader_loading: 'Đang nạp bài kinh...',
      reader_btn_settings: 'Đọc',
      reader_btn_toc: 'Mục lục',
      reader_btn_save: 'Lưu bài',
      reader_summary_heading: 'Tóm Lược Yếu Chỉ Bài Kinh',
      reader_audio_heading: 'Nghe Đọc Kinh & Giai Điệu 432Hz',
      reader_audio_desc: 'Thanh âm thiền vị tĩnh tại, giúp tâm thức hòa vào từng dòng lời dạy.',
      reader_source_label: 'Nguồn tham khảo:',
      reader_prev_label: '← Bài kinh trước',
      reader_next_label: 'Bài kinh tiếp theo →',
      reader_modal_title: 'Tùy Chỉnh Giao Diện Đọc',
      reader_theme_label: 'Không gian màu sắc:',
      reader_font_label: 'Phông chữ:',
      reader_font_size_label: 'Cỡ chữ:',
      reader_line_height_label: 'Giãn dòng:',
      theme_paper: 'Giấy Trắng',
      theme_sepia: 'Giấy Dó (Sepia)',
      theme_tea: 'Trà Thiền (Xanh rêu)',
      theme_dark: 'Thiền Đêm (Tối)',
      reader_toc_title: 'Mục Lục Đại Tạng & Tác Phẩm',
      toast_bookmarked: 'Đã lưu bài kinh vào Tủ Sách của bạn ❤️',
      toast_unbookmarked: 'Đã bỏ lưu bài kinh',
      toast_link_copied: 'Đã sao chép liên kết bài kinh!',
      toast_quote_copied: 'Đã sao chép lời Phật dạy!',

      // Online Temple (Liên Hoa Các)
      temple_title: 'Liên Hoa Các — Chùa Online @1995lido',
      temple_lunar_loading: '🌙 Đang tải lịch âm...',
      temple_music_btn: '🔊 Nhạc Thiền',
      temple_wooden_fish: '🔔 Gõ Mõ · Chuông',
      temple_lotus_pond: '🏮 Hồ Sen',
      temple_divination: '🎋 Gieo Quẻ',
      temple_wishing: '🙏 Cầu An',

      // Support page
      support_title: 'Gửi @1995lido Một Tách Trà Ấm',
      support_desc: 'Chút động viên tự nguyện tiếp sức duy trì kênh Nhạc Thiền 432Hz @1995lido và Thư viện Phật học Nikāya LIDO hoàn toàn miễn phí.',
      support_tier_tea: 'Một Tách Trà Thanh Lương',
      support_tier_incense: 'Hương Trầm Thiền Định',
      support_tier_lamp: 'Ngọn Đèn Tuệ Giác'
    },

    en: {
      // General & Header
      brand_title: '1995 Lido Zen Music',
      brand_sub: '& Nikāya Buddhist Library',
      nav_home: 'Home',
      nav_suttas: '📖 Nikāya Bookshelf',
      nav_suttas_short: 'Nikāya Bookshelf',
      nav_temple: '🛕 Online Temple (Lotus Pavilion)',
      nav_temple_short: 'Online Temple',
      nav_numerology: '🔮 Zen Numerology',
      nav_tea: '🍵 Offer a Cup of Tea',
      nav_3d: '✨ 3D Space',
      views_label: 'Views:',
      views_unit: 'views',
      youtube_btn: '@1995lido Channel',
      lang_switch_title: 'Switch to Vietnamese (Tiếng Việt)',

      // Hero index
      hero_badge: 'A Sanctuary of Mindfulness — Refuge for the Soul',
      hero_title: 'Zen Music & Early Buddhist Scriptures',
      hero_desc: 'An open sanctuary preserving the authentic Buddha teachings from the Pāḷi Nikāya Canon alongside soothing 432Hz meditation melodies. Take a mindful sip of tea and reconnect with the pristine Dhamma.',
      btn_enter_suttas: 'Enter Nikāya Bookshelf',
      btn_visit_temple: 'Visit Online Temple',
      btn_explore_3d: 'Explore 3D Sanctuary',
      btn_support_tea: 'Offer a Cup of Tea',

      // Bell & Mindfulness
      bell_title: 'Mindfulness Bell',
      bell_desc: 'Breathe in and calm your mind with a resonant chime...',
      bell_btn: 'Strike the Bell',
      bell_audio_label: 'Clear pure temple bell chime resonance',

      // Daily Quote
      daily_quote_badge: "Today's Dharma Teaching",
      daily_reflection_badge: 'Mindful Reflection',
      btn_share_quote: 'Copy Teaching',

      // Four Noble Truths & Noble Eightfold Path
      four_truths_title: 'The Four Noble Truths — Foundation of Reality',
      four_truths_sub: 'The supreme insights proclaimed by Shakyamuni Buddha at the Deer Park in Sarnath.',
      eightfold_path_title: 'The Noble Eightfold Path — Way Beyond Suffering',
      eightfold_path_sub: 'The eightfold training leading to peace, direct knowledge, awakening, and Nibbāna.',

      // Bookshelf / Catalog Page
      catalog_hero_tag: 'NIKĀYA CANON & ORIGINAL DHAMMA · 100% FREE',
      catalog_hero_title: 'Early Buddhist Canon Bookshelf',
      catalog_hero_subtitle: 'For peaceful, mindful days',
      catalog_hero_desc: 'A curated collection of Early Buddhist scriptures translated from the Pāḷi Canon (Ven. Bhikkhu Bodhi & Ven. Thích Minh Châu) and foundational mind-purification treatises by Elder Thích Thông Lạc from daophatgoc.com. Enjoy a warm cup of tea and dwell in the ancient words of the Awakened One.',
      catalog_stat_suttas: 'Discourses & Works',
      catalog_stat_words: 'Authentic Pāḷi & English',
      catalog_stat_cost: 'Freely Given Forever',
      catalog_stat_reader: 'Serene Zen Reading Room',

      search_placeholder: 'Search discourse title, MN number, Pāḷi terms (Satipaṭṭhāna, Sabbāsava...)...',
      filter_all: 'All Suttas',
      filter_saved: 'Saved',
      filter_truong_bo: 'Long Discourses (Dīgha)',
      filter_trung_bo: 'Middle Length (Majjhima)',
      filter_tuong_ung: 'Connected (Saṃyutta)',
      filter_tang_chi: 'Numbered (Aṅguttara)',
      filter_tieu_bo: 'Minor (Khuddaka)',
      filter_dao_phat_goc: 'Original Dhamma (Thích Thông Lạc)',

      btn_read_sutta: 'Read Sutta',
      btn_save: '🤍 Save',
      btn_saved: '❤️ Saved',
      btn_remove_bookmark: 'Remove bookmark',
      btn_add_bookmark: 'Save to bookshelf',
      audio_available: '🔊 Audio MP3',
      reading_time_prefix: '⏱️ ',
      empty_search: 'No matching discourses found',
      empty_search_desc: 'Try searching with different keywords or switch back to the "All" category.',

      // Zen Reader Page
      reader_back_shelf: 'Bookshelf',
      reader_loading: 'Loading discourse...',
      reader_btn_settings: 'Format',
      reader_btn_toc: 'Contents',
      reader_btn_save: 'Bookmark',
      reader_summary_heading: 'Core Essence & Summary',
      reader_audio_heading: 'Recitation Audio & 432Hz Ambience',
      reader_audio_desc: 'Peaceful recitation allowing the mind to absorb each syllable of Dhamma.',
      reader_source_label: 'Reference source:',
      reader_prev_label: '← Previous Sutta',
      reader_next_label: 'Next Sutta →',
      reader_modal_title: 'Reading Display Settings',
      reader_theme_label: 'Color Theme:',
      reader_font_label: 'Typeface:',
      reader_font_size_label: 'Font Size:',
      reader_line_height_label: 'Line Spacing:',
      theme_paper: 'Pristine White',
      theme_sepia: 'Sepia Parchment',
      theme_tea: 'Zen Tea Green',
      theme_dark: 'Midnight Calm',
      reader_toc_title: 'Nikāya Canon Table of Contents',
      toast_bookmarked: 'Discourse saved to your bookshelf ❤️',
      toast_unbookmarked: 'Discourse removed from bookmarks',
      toast_link_copied: 'Discourse link copied to clipboard!',
      toast_quote_copied: 'Dharma teaching copied to clipboard!',

      // Online Temple (Liên Hoa Các)
      temple_title: 'Lotus Pavilion — Online Temple @1995lido',
      temple_lunar_loading: '🌙 Loading Lunar Calendar...',
      temple_music_btn: '🔊 Zen Music',
      temple_wooden_fish: '🔔 Wooden Fish & Bell',
      temple_lotus_pond: '🏮 Lotus Lanterns',
      temple_divination: '🎋 Dharma Sticks',
      temple_wishing: '🙏 Blessing Wishes',

      // Support page
      support_title: 'Offer @1995lido a Warm Cup of Tea',
      support_desc: 'Voluntary encouragement helping sustain the 432Hz Zen Music channel @1995lido and the LIDO Nikāya Buddhist Library completely free forever.',
      support_tier_tea: 'A Cup of Pure Herbal Tea',
      support_tier_incense: 'Mindful Agarwood Incense',
      support_tier_lamp: 'The Lamp of Wisdom'
    }
  };

  class LidoI18n {
    constructor() {
      const stored = localStorage.getItem(STORAGE_KEY);
      this.currentLang = (stored === 'en' || stored === 'vi') ? stored : 'vi';
      this.init();
    }

    init() {
      // Apply initial document lang attribute
      document.documentElement.lang = this.currentLang;

      // Auto translate elements on load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.applyTranslations());
      } else {
        this.applyTranslations();
      }
    }

    getLang() {
      return this.currentLang;
    }

    setLang(lang) {
      if (lang !== 'vi' && lang !== 'en') return;
      this.currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
      this.applyTranslations();

      // Dispatch global event for external scripts (sutta catalog, tracker, etc.)
      window.dispatchEvent(new CustomEvent('lido-lang-changed', {
        detail: { lang: this.currentLang }
      }));
    }

    toggle() {
      const nextLang = this.currentLang === 'vi' ? 'en' : 'vi';
      this.setLang(nextLang);
      return nextLang;
    }

    t(key, fallback = '') {
      const dict = translations[this.currentLang] || translations.vi;
      if (dict && typeof dict[key] !== 'undefined') {
        return dict[key];
      }
      const viDict = translations.vi;
      if (viDict && typeof viDict[key] !== 'undefined') {
        return viDict[key];
      }
      return fallback || key;
    }

    applyTranslations() {
      const lang = this.currentLang;
      const dict = translations[lang] || translations.vi;

      // 1. Text elements [data-i18n]
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
          el.textContent = dict[key];
        }
      });

      // 2. HTML elements [data-i18n-html]
      document.querySelectorAll('[data-i18n-html]').forEach((el) => {
        const key = el.getAttribute('data-i18n-html');
        if (dict[key]) {
          el.innerHTML = dict[key];
        }
      });

      // 3. Placeholders [data-i18n-placeholder]
      document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) {
          el.placeholder = dict[key];
        }
      });

      // 4. Titles / Tooltips [data-i18n-title]
      document.querySelectorAll('[data-i18n-title]').forEach((el) => {
        const key = el.getAttribute('data-i18n-title');
        if (dict[key]) {
          el.title = dict[key];
        }
      });

      // 5. Update Visitor Counter label if present
      document.querySelectorAll('.lido-visitor-count-label').forEach((el) => {
        el.textContent = (lang === 'en') ? 'Views:' : 'Lượt xem:';
      });

      // 6. Update all language switcher buttons state
      this.updateSwitcherButtonsUI();
    }

    updateSwitcherButtonsUI() {
      const isEn = this.currentLang === 'en';
      document.querySelectorAll('.lido-lang-switcher-btn').forEach((btn) => {
        const viSpan = btn.querySelector('.lido-lang-vi');
        const enSpan = btn.querySelector('.lido-lang-en');
        if (viSpan && enSpan) {
          if (isEn) {
            viSpan.classList.remove('active');
            enSpan.classList.add('active');
          } else {
            viSpan.classList.add('active');
            enSpan.classList.remove('active');
          }
        }
        btn.setAttribute('aria-label', isEn ? 'Switch to Vietnamese' : 'Chuyển sang Tiếng Anh');
        btn.title = isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English';
      });
    }
  }

  // Inject common styling for language switcher and visitor pills
  const style = document.createElement('style');
  style.id = 'lido-i18n-styles';
  style.textContent = `
    .lido-lang-switcher-btn {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 4px 8px;
      border-radius: 9999px;
      background: rgba(254, 243, 199, 0.9);
      border: 1px solid rgba(217, 119, 6, 0.4);
      color: #78350F;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      text-decoration: none !important;
    }
    .lido-lang-switcher-btn:hover {
      background: #FEF3C7;
      border-color: #D97706;
      transform: translateY(-1px);
    }
    .lido-lang-switcher-btn .lido-lang-opt {
      padding: 2px 6px;
      border-radius: 9999px;
      transition: all 0.2s ease;
      opacity: 0.55;
    }
    .lido-lang-switcher-btn .lido-lang-opt.active {
      background: #D97706;
      color: #FFFFFF;
      opacity: 1;
      font-weight: 800;
      box-shadow: 0 1px 3px rgba(217, 119, 6, 0.35);
    }
    .lido-lang-switcher-btn .lido-lang-sep {
      color: #B45309;
      font-size: 10px;
      opacity: 0.6;
    }
  `;
  document.head.appendChild(style);

  // Global singleton
  const i18n = new LidoI18n();
  window.lidoI18n = i18n;
  window.t = (key, fallback) => i18n.t(key, fallback);
  window.getLidoLanguage = () => i18n.getLang();
  window.setLidoLanguage = (lang) => i18n.setLang(lang);
  window.toggleLidoLanguage = () => i18n.toggle();
})();
