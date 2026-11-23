// =============================================================================
// CẤU HÌNH THÔNG TIN DỰ ÁN NHẠC THIỀN @1995LIDO & TỦ SÁCH PHẬT HỌC LIDO
// =============================================================================

const APP_CONFIG = {
  // Thông tin thương hiệu & Kênh
  channel: {
    handle: "@1995lido",
    name: "Thảo Dương TV | Nhạc Thiền & Phật Pháp Tĩnh Tâm",
    youtubeUrl: "https://www.youtube.com/@1995lido",
    youtubeChannelId: "https://www.youtube.com/channel/UC-0dKn2s-7jpsz6H3XFKgow",
    libraryUrl: "https://tuanweb2026.github.io/lido-buddhist-library/",
    slogan: "Vạn sự tùy duyên, vạn vật tùy tâm — Đời người như một đóa sen nở giữa hồ vắng",
    subtitle: "Chung tay hộ trì LIDO duy trì tủ sách Phật học Nikāya và sáng tạo âm nhạc thiền định 432Hz phụng sự cộng đồng hoàn toàn miễn phí."
  },

  // Tác phẩm nổi bật chính
  featuredVideo: {
    id: "T0tzayJ7oYI",
    title: "Tịnh Tâm Liên Hoa (Đóa sen tĩnh tâm giữa cõi đời)",
    duration: "2 Giờ 28 Phút (148 Phút)",
    frequency: "432Hz Miracle Tone",
    instruments: "Đàn Tranh (Guzheng), Sáo Trúc (Dizi), Chuông Xoay Tây Tạng",
    quote: "Vạn sự tùy duyên, vạn vật tùy tâm. Đời người như một đóa sen nở giữa hồ vắng, dẫu sinh ra từ bùn lầy vẫn giữ trọn nét thanh cao tinh khiết. Giữa những bộn bề và áp lực của cuộc sống nhân gian, xin bạn hãy dành ra một khoảng lặng dịu êm. Thả lỏng đôi bờ vai, hít một hơi thật sâu và thở ra mọi lo toan nặng trĩu. Cứ an nhiên mà sống, việc gì đến sẽ đến, người cần gặp sẽ gặp, buông bỏ chấp niệm ắt thấy lòng nhẹ tựa mây trời.",
    chapters: [
      { time: "00:00:00", title: "Chuông Thiền Tĩnh Tâm, Hơi Thở Khởi Đầu" },
      { time: "00:15:00", title: "Lắng Lại Tâm Tư, Buông Xả Ưu Phiền" },
      { time: "00:40:00", title: "Tần Số 432Hz Chữa Lành & Thanh Lọc Tinh Thần" },
      { time: "01:10:00", title: "Vạn Sự Tùy Duyên, Tâm An Vạn Sự An" },
      { time: "01:45:00", title: "Hòa Mình Vào Sự Yên Tĩnh Của Vũ Trụ" },
      { time: "02:15:00", title: "Giấc Ngủ Bình Yên, Thân Tâm Tự Tại" }
    ]
  },

  // THÔNG TIN TÀI KHOẢN NGÂN HÀNG (VIETQR)
  bank: {
    bankId: "BIDV",
    bankName: "BIDV — Ngân Hàng TMCP Đầu Tư & Phát Triển Việt Nam",
    accountNumber: "1401132757",
    accountHolder: "NGUYEN ANH TUAN",
    momoPhone: "1401132757",
    defaultMessage: "Ho Tri Tu Sach LIDO"
  },

  // Các gói gieo duyên / mời trà ý nghĩa
  tiers: [
    {
      id: "tea",
      title: "Chén Trà An Yên",
      amount: 20000,
      displayAmount: "20.000 đ",
      symbol: "🍵",
      badge: "Gieo Duyên",
      desc: "Mời tác giả một chén trà ấm, gửi trao năng lượng tĩnh tại để tiếp nối những giai điệu thiền xoa dịu tâm hồn."
    },
    {
      id: "candle",
      title: "Ngọn Nến Tuệ Giác",
      amount: 50000,
      displayAmount: "50.000 đ",
      symbol: "🕯️",
      badge: "Được Yêu Thích",
      desc: "Thắp sáng trí tuệ, hỗ trợ chi phí sản xuất âm thanh tần số chữa lành 432Hz Miracle Tone chuẩn phòng thu."
    },
    {
      id: "book",
      title: "Ấn Tống Kinh Điển Nikāya",
      amount: 100000,
      displayAmount: "100.000 đ",
      symbol: "📖",
      badge: "Công Đức Lớn",
      desc: "Chung tay duy trì website Thư viện Phật học LIDO, số hóa kinh điển Nikāya và các trước tác thực hành miễn phí."
    },
    {
      id: "lotus",
      title: "Bồ Đề Tâm (Tùy Hỷ)",
      amount: 0,
      displayAmount: "Tùy tâm",
      symbol: "🪷",
      badge: "Hoan Hỷ",
      desc: "Tâm hoan hỷ không phân biệt lớn nhỏ. Dù có đóng góp hay không, quý vị vẫn luôn được chào đón tại LIDO."
    }
  ],

  // Danh mục sứ mệnh cống hiến
  missions: [
    {
      icon: "headphones",
      title: "Âm Nhạc Trị Liệu 432Hz Miracle Tone",
      desc: "Hòa quyện Đàn Tranh, Sáo Trúc, Chuông xoay Tây Tạng giúp thư giãn sâu, giảm căng thẳng thần kinh và đưa thân tâm về trạng thái cân bằng tuyệt đối."
    },
    {
      icon: "book-open",
      title: "Thư Viện Phật Học LIDO (Nikāya)",
      desc: "Giới thiệu nguồn tham khảo kinh điển Nikāya nguyên thủy và những trước tác thực hành ứng dụng lời Phật dạy vào đời sống hiện đại hoàn toàn miễn phí."
    },
    {
      icon: "shield-heart",
      title: "Cộng Đồng Gieo Duyên Lành",
      desc: "Mọi sự trợ duyên đều hoàn toàn tự nguyện, minh bạch để duy trì website thư viện và sản xuất âm nhạc thiền định phục vụ cộng đồng."
    }
  ]
};

// Đóng băng bảo mật: ngăn chặn mọi hành vi thay đổi cấu hình ngân hàng từ client
Object.freeze(APP_CONFIG.bank);
Object.freeze(APP_CONFIG);
