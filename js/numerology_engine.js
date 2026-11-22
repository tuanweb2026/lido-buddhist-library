/**
 * Bộ máy tính toán Thần Số Học Pythagoras chuẩn xác & Sinh Thẻ Bản Đồ SVG Client-side
 * Tủ Sách Phật Giáo & Nhạc Thiền @1995lido
 * Chạy 100% độc lập trên trình duyệt (Offline & GitHub Pages), không phụ thuộc backend.
 */

(function(root) {
  'use strict';

  var PYTHAGORAS_MAP = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
  };
  var VOWELS_BASE = { A: true, E: true, I: true, O: true, U: true };

  var MEANING_HEADLINES = {
    2: ["Người Kết Nối & Hòa Giải Tinh Tế", "Trực giác nhạy bén, giàu lòng thấu cảm, giỏi lắng nghe và gắn kết tập thể."],
    3: ["Người Truyền Cảm Hứng & Sáng Tạo", "Hoạt ngôn, giàu năng lượng tích cực, tư duy nghệ thuật và khả năng biểu đạt cuốn hút."],
    4: ["Người Kiến Tạo Kỷ Luật & Thực Tế", "Chắc chắn, nguyên tắc, giỏi tổ chức hệ thống và xây nền móng bền vững."],
    5: ["Người Tự Do & Bứt Phá Đổi Mới", "Linh hoạt, yêu trải nghiệm, nhạy bén cơ hội mới và ghét sự gò bó lặp lại."],
    6: ["Người Chăm Sóc & Phụng Sự Yêu Thương", "Trách nhiệm cao, giàu tình cảm gia đình, có gu thẩm mỹ và uy tín cộng đồng."],
    7: ["Nhà Chiến Lược & Chiều Sâu Tri Thức", "Tư duy phân tích sắc sảo, thích tự chiêm nghiệm, học qua trải nghiệm thực tế."],
    8: ["Nhà Điều Hành & Làm Chủ Tài Chính", "Nhạy bén kinh doanh, quyết đoán, tham vọng lớn và năng lực quản trị mạnh mẽ."],
    9: ["Người Dẫn Đường & Lý Tưởng Nhân Văn", "Tầm nhìn rộng, bao dung, khát khao cống hiến giá trị tốt đẹp cho cộng đồng."],
    10: ["Người Tiên Phong Độc Lập & Thích Nghi", "Bản lĩnh dẫn đầu, dám nghĩ dám làm, tự tin xoay chuyển mọi hoàn cảnh."],
    11: ["Bậc Thầy Trực Giác & Truyền Lửa (Master 11/2)", "Tâm thức nhạy bén đặc biệt, khả năng thấu thị vấn đề và dẫn dắt tinh thần."],
    22: ["Kiến Trúc Sư Đại Tài (Master 22/4)", "Kết hợp tầm nhìn lớn của số 11 và óc thực thi kỷ luật của số 4 để dựng nghiệp lớn."],
    33: ["Người Chữa Lành & Dẫn Dắt Bằng Tình Thương (Master 33/6)", "Tần số thấu cảm cao, truyền động lực và nâng đỡ con người vượt nghịch cảnh."]
  };

  var PERSONAL_YEAR_THEMES = {
    1: "Năm số 1 — Gieo hạt & Khởi đầu chu kỳ 9 năm mới: Thời điểm vàng để mở dự án mới, đổi hướng đi và tự chủ quyết định.",
    2: "Năm số 2 — Kết nối & Chậm lại lắng nghe: Ưu tiên bồi đắp quan hệ đối tác, học hỏi sâu, tránh nóng vội đầu tư lướt sóng.",
    3: "Năm số 3 — Mở rộng & Tỏa sáng thương hiệu cá nhân: Thuận lợi cho học tập, truyền thông, bán hàng và mở rộng tệp khách.",
    4: "Năm số 4 — Củng cố nền móng & Kỷ luật tài chính: Năm rà soát quy trình, siết chi phí thừa, tập trung chuyên môn cốt lõi.",
    5: "Năm số 5 — Bước ngoặt tự do & Thay đổi mạnh mẽ: Năng lượng dịch chuyển cao, dễ có cơ hội mới bất ngờ xuất hiện.",
    6: "Năm số 6 — Trách nhiệm, Gia đình & Chăm sóc uy tín: Cân bằng công việc - tổ ấm, thu hút lộc từ sự tận tâm và chữ tín.",
    7: "Năm số 7 — Trầm lắng nội lực & Nâng cấp trí tuệ: Tránh đầu cơ mạo hiểm; càng đầu tư vào kỹ năng chuyên sâu càng thắng lớn ở năm 8.",
    8: "Năm số 8 — Thu hoạch Tài chính & Bứt phá Vị thế: Đỉnh sóng gặt hái thành quả tiền bạc, mở rộng quy mô nếu đã chuẩn bị kỹ.",
    9: "Năm số 9 — Hoàn tất, Thanh lọc & Chuẩn bị Chương mới: Buông bỏ việc/mối quan hệ cũ không còn phù hợp để dọn đường cho chu kỳ mới."
  };

  var ARROWS_DEF = [
    { trip: [1, 2, 3], ten: "Mũi tên Kế hoạch (1-2-3)", manh: "Giỏi lập kế hoạch có trật tự", trong: "Cần rèn thói quen viết checklist từng bước để tránh làm theo ngẫu hứng" },
    { trip: [4, 5, 6], ten: "Mũi tên Ý chí (4-5-6)", manh: "Ý chí kiên cường vượt áp lực", trong: "Dễ nản hoặc sốt ruột khi kết quả đến chậm, cần chia nhỏ mục tiêu" },
    { trip: [7, 8, 9], ten: "Mũi tên Hoạt động (7-8-9)", manh: "Năng nổ, thực thi nhanh ngoài thực địa", trong: "Cần chủ động bắt tay hành động thực tế thay vì suy nghĩ quá lâu" },
    { trip: [1, 4, 7], ten: "Mũi tên Thực tế (1-4-7)", manh: "Thực dụng, giỏi việc tay nghề & tài chính", trong: "Đôi khi bay bổng thiếu thực tiễn, cần bám sát con số đo lường thật" },
    { trip: [2, 5, 8], ten: "Mũi tên Cân bằng Cảm xúc (2-5-8)", manh: "Làm chủ cảm xúc và thấu hiểu lòng người", trong: "Nhạy cảm ngầm, dễ bị ảnh hưởng tâm trạng bởi lời nói xung quanh" },
    { trip: [3, 6, 9], ten: "Mũi tên Trí tuệ (3-6-9)", manh: "Tư duy logic sắc bén, nhớ lâu", trong: "Cần chủ động rèn trí nhớ và tư duy hệ thống hóa kiến thức" },
    { trip: [1, 5, 9], ten: "Mũi tên Quyết tâm (1-5-9)", manh: "Đã đặt mục tiêu là theo đuổi đến cùng", trong: "Hay trì hoãn bước khởi đầu, cần đặt deadline ngắn 24h-48h để dứt điểm" },
    { trip: [3, 5, 7], ten: "Mũi tên Nhạy bén Tâm thức (3-5-7)", manh: "Trực giác sâu sắc, nhìn thấu bản chất", trong: "Dễ hoài nghi khi thiếu dữ kiện, nên lắng nghe trực giác kết hợp trải nghiệm" }
  ];

  var MONTH_NAMES = [
    "",
    "Tháng Khởi Đầu & Mở Lối Mới",
    "Tháng Kết Nối & Đàm Phán Mềm",
    "Tháng Tỏa Sáng & Bùng Nổ Giao Tiếp",
    "Tháng Kỷ Luật & Gia Cố Nền Móng",
    "Tháng Dịch Chuyển & Cơ Hội Bất Ngờ",
    "Tháng Uy Tín, Tổ Ấm & Chăm Sóc Giá Trị",
    "Tháng Chiều Sâu & Nâng Cấp Nội Lực",
    "Tháng Thu Hoạch Tài Chính & Quyết Đoán",
    "Tháng Tổng Kết, Thanh Lọc & Chuyển Giao"
  ];

  function stripVietnamese(text) {
    var s = (text || "").trim().toLowerCase();
    s = s.replace(/đ/g, "d").replace(/Đ/g, "D");
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return s.replace(/[^a-zA-Z\s]/g, " ").toUpperCase();
  }

  function reduceNum(n, keepMaster, keep10) {
    if (keepMaster === undefined) keepMaster = true;
    if (keep10 === undefined) keep10 = false;
    while (n > 9) {
      if (keepMaster && (n === 11 || n === 22 || n === 33)) return n;
      if (keep10 && n === 10) return 10;
      var sum = 0;
      var digits = String(n).split("");
      for (var i = 0; i < digits.length; i++) {
        sum += parseInt(digits[i], 10);
      }
      n = sum;
    }
    return n;
  }

  function reduceSingle(n) {
    while (n > 9) {
      var sum = 0;
      var digits = String(n).split("");
      for (var i = 0; i < digits.length; i++) {
        sum += parseInt(digits[i], 10);
      }
      n = sum;
    }
    return Math.max(1, n);
  }

  function isVowelInWord(word, idx) {
    var ch = word[idx];
    if (VOWELS_BASE[ch]) return true;
    if (ch === 'Y') {
      var prevV = idx > 0 && VOWELS_BASE[word[idx - 1]];
      var nextV = idx + 1 < word.length && VOWELS_BASE[word[idx + 1]];
      return !(prevV || nextV);
    }
    return false;
  }

  function parseDob(dobStr) {
    var s = (dobStr || "").trim();
    var nums = s.match(/\d+/g) || [];
    var d = 15, m = 8, y = 1996;
    if (nums.length >= 3) {
      if (parseInt(nums[0], 10) > 31) {
        y = parseInt(nums[0], 10);
        m = parseInt(nums[1], 10);
        d = parseInt(nums[2], 10);
      } else {
        d = parseInt(nums[0], 10);
        m = parseInt(nums[1], 10);
        y = parseInt(nums[2], 10);
      }
    }
    if (y < 100) y += (y >= 35 ? 1900 : 2000);
    y = Math.min(2030, Math.max(1920, y));
    m = Math.min(12, Math.max(1, m));
    d = Math.min(31, Math.max(1, d));
    return { d: d, m: m, y: y };
  }

  function computeNumerology(hoTen, ngaySinh, currentYear) {
    currentYear = currentYear || 2026;
    var cleanName = (hoTen || "").trim().replace(/\s+/g, " ") || "Bạn Đạo Hữu";
    var dobObj = parseDob(ngaySinh);
    var d = dobObj.d, mo = dobObj.m, y = dobObj.y;
    var dobDisplay = (d < 10 ? "0" + d : d) + "/" + (mo < 10 ? "0" + mo : mo) + "/" + y;

    // 1. Số chủ đạo
    var r_d = reduceNum(d, true);
    var r_m = reduceNum(mo, true);
    var sumY = 0;
    String(y).split("").forEach(function(c) { sumY += parseInt(c, 10); });
    var r_y = reduceNum(sumY, true);

    var totalRaw = 0;
    (String(d) + String(mo) + String(y)).split("").forEach(function(c) { totalRaw += parseInt(c, 10); });

    var lp = reduceNum(r_d + r_m + r_y, true, true);
    if (lp === 1) lp = 10;
    var lpLabel = (lp === 22) ? "22/4" : ((lp === 33) ? "33/6" : ((lp === 11) ? "11/2" : String(lp)));
    var hl = MEANING_HEADLINES[lp] || MEANING_HEADLINES[10];
    var titleLp = hl[0];
    var shortLp = hl[1];

    // 2. Họ tên: Sứ mệnh, Linh hồn, Nhân cách
    var normName = stripVietnamese(cleanName);
    var words = normName.split(/\s+/).filter(Boolean);
    var wordSums = [], vowelSums = [], consSums = [];

    words.forEach(function(w) {
      var ws = 0, vs = 0, cs = 0;
      for (var i = 0; i < w.length; i++) {
        var ch = w[i];
        var val = PYTHAGORAS_MAP[ch] || 0;
        ws += val;
        if (isVowelInWord(w, i)) vs += val;
        else cs += val;
      }
      wordSums.push(reduceNum(ws, true));
      vowelSums.push(reduceNum(vs, true));
      consSums.push(reduceNum(cs, true));
    });

    var sumWords = wordSums.reduce(function(a, b){ return a + b; }, 0);
    var sumVowels = vowelSums.reduce(function(a, b){ return a + b; }, 0);
    var sumCons = consSums.reduce(function(a, b){ return a + b; }, 0);

    var suMenh = wordSums.length ? reduceNum(sumWords, true) : 5;
    var linhHon = vowelSums.length ? reduceNum(sumVowels, true) : 2;
    var nhanCach = consSums.length ? reduceNum(sumCons, true) : 4;

    // 3. Thái độ, Ngày sinh, Trưởng thành & Năm cá nhân
    var thaiDo = reduceSingle(d + mo);
    var chiSoNgaySinh = reduceNum(d, true);
    var truongThanh = reduceNum(reduceSingle(lp) + reduceSingle(suMenh), true);

    var sumYCur = 0, sumYNxt = 0;
    String(currentYear).split("").forEach(function(c){ sumYCur += parseInt(c, 10); });
    String(currentYear + 1).split("").forEach(function(c){ sumYNxt += parseInt(c, 10); });

    var namCaNhan = reduceSingle(reduceSingle(d) + reduceSingle(mo) + reduceSingle(sumYCur));
    var namCaNhanSau = reduceSingle(reduceSingle(d) + reduceSingle(mo) + reduceSingle(sumYNxt));

    // 4. Biểu đồ 3x3
    var digitsDob = (String(d) + String(mo) + String(y)).split("").filter(function(c){ return c !== '0'; }).map(Number);
    var gridCounts = {};
    for (var k = 1; k <= 9; k++) {
      gridCounts[k] = digitsDob.filter(function(x){ return x === k; }).length;
    }

    var muiTenManh = [];
    var muiTenTrong = [];
    ARROWS_DEF.forEach(function(ar) {
      var allPresent = ar.trip.every(function(num){ return gridCounts[num] > 0; });
      var allAbsent = ar.trip.every(function(num){ return gridCounts[num] === 0; });
      if (allPresent) {
        muiTenManh.push({ ten: ar.ten, mo_ta: ar.manh });
      } else if (allAbsent) {
        muiTenTrong.push({ ten: ar.ten.replace("Mũi tên", "Trống trục"), mo_ta: ar.trong });
      }
    });

    // 5. Kim tự tháp 4 Đỉnh cao
    var baseM = reduceSingle(mo);
    var baseD = reduceSingle(d);
    var baseY = reduceSingle(sumY);

    var p1 = reduceSingle(baseM + baseD);
    var p2 = reduceSingle(baseD + baseY);
    var p3 = reduceNum(p1 + p2, true, true);
    var p4 = reduceNum(baseM + baseY, true, true);

    var lpForAge = (lp === 22) ? 4 : ((lp === 11) ? 2 : ((lp === 33) ? 6 : lp));
    var age1 = 36 - lpForAge;
    var peaks = [
      { dinh: 1, so: p1, tuoi: age1, nam: y + age1 },
      { dinh: 2, so: p2, tuoi: age1 + 9, nam: y + age1 + 9 },
      { dinh: 3, so: p3, tuoi: age1 + 18, nam: y + age1 + 18 },
      { dinh: 4, so: p4, tuoi: age1 + 27, nam: y + age1 + 27 }
    ];

    return {
      ho_ten: cleanName,
      ngay_sinh: dobDisplay,
      tong_chu_so: totalRaw,
      so_chu_dao: lp,
      so_chu_dao_nhan: lpLabel,
      danh_xung: titleLp,
      mo_ta_ngan: shortLp,
      su_menh: suMenh,
      linh_hon: linhHon,
      nhan_cach: nhanCach,
      thai_do: thaiDo,
      ngay_sinh_so: chiSoNgaySinh,
      truong_thanh: truongThanh,
      nam_hien_tai: currentYear,
      nam_ca_nhan: namCaNhan,
      thong_diep_nam: PERSONAL_YEAR_THEMES[namCaNhan] || "",
      nam_ca_nhan_sau: namCaNhanSau,
      thong_diep_nam_sau: PERSONAL_YEAR_THEMES[namCaNhanSau] || "",
      bieu_do: gridCounts,
      mui_ten_manh: muiTenManh,
      mui_ten_trong: muiTenTrong,
      chan_de: [baseM, baseD, baseY],
      dinh_cao: peaks
    };
  }

  function buildNumerologySvg(prof) {
    var nameUp = prof.ho_ten.toUpperCase().slice(0, 34);
    var dob = prof.ngay_sinh;
    var lpLbl = prof.so_chu_dao_nhan;
    var danhXung = prof.danh_xung;
    var yr = prof.nam_hien_tai;

    // Biểu đồ 3x3 Pythagoras
    var rows3x3 = [[3, 6, 9], [2, 5, 8], [1, 4, 7]];
    var cellsSvg = [];
    var gx0 = 84, gy0 = 650, cellW = 118, cellH = 96;

    rows3x3.forEach(function(rowNums, rIdx) {
      rowNums.forEach(function(num, cIdx) {
        var cx = gx0 + cIdx * (cellW + 10);
        var cy = gy0 + rIdx * (cellH + 10);
        var cnt = prof.bieu_do[num] || 0;
        var valTxt = (cnt > 0) ? new Array(Math.min(cnt, 4) + 1).join(String(num)) : "—";
        var fillBg = (cnt > 0) ? "rgba(16,185,129,0.20)" : "rgba(255,255,255,0.03)";
        var strokeC = (cnt > 0) ? "#34D399" : "rgba(148,163,184,0.22)";
        var txtC = (cnt > 0) ? "#F8FAFC" : "rgba(148,163,184,0.38)";

        cellsSvg.push(
          '<rect x="' + cx + '" y="' + cy + '" width="' + cellW + '" height="' + cellH + '" rx="16" fill="' + fillBg + '" stroke="' + strokeC + '" stroke-width="2"/>' +
          '<text x="' + (cx + 14) + '" y="' + (cy + 24) + '" fill="rgba(148,163,184,0.55)" font-size="15" font-weight="700">' + num + '</text>' +
          '<text x="' + (cx + cellW / 2) + '" y="' + (cy + 62) + '" text-anchor="middle" fill="' + txtC + '" font-size="30" font-weight="900">' + valTxt + '</text>'
        );
      });
    });

    // 4 Đỉnh cao Kim Tự Tháp
    var bM = prof.chan_de[0], bD = prof.chan_de[1], bY = prof.chan_de[2];
    var p = prof.dinh_cao;

    var pyrSvg = 
      '<g stroke="#F59E0B" stroke-width="2.4" fill="none" opacity="0.82">' +
        '<path d="M580 946 L780 680 L980 946"/>' +
        '<path d="M635 946 L780 756 L925 946"/>' +
        '<path d="M580 946 L680 842 L780 946 L880 842 L980 946"/>' +
      '</g>' +
      '<circle cx="580" cy="946" r="21" fill="#0F172A" stroke="#38BDF8" stroke-width="2.2"/>' +
      '<text x="580" y="953" text-anchor="middle" fill="#38BDF8" font-size="19" font-weight="800">' + bM + '</text>' +
      '<text x="580" y="980" text-anchor="middle" fill="#94A3B8" font-size="13" font-weight="600">Tháng</text>' +
      '<circle cx="780" cy="946" r="21" fill="#0F172A" stroke="#38BDF8" stroke-width="2.2"/>' +
      '<text x="780" y="953" text-anchor="middle" fill="#38BDF8" font-size="19" font-weight="800">' + bD + '</text>' +
      '<text x="780" y="980" text-anchor="middle" fill="#94A3B8" font-size="13" font-weight="600">Ngày</text>' +
      '<circle cx="980" cy="946" r="21" fill="#0F172A" stroke="#38BDF8" stroke-width="2.2"/>' +
      '<text x="980" y="953" text-anchor="middle" fill="#38BDF8" font-size="19" font-weight="800">' + bY + '</text>' +
      '<text x="980" y="980" text-anchor="middle" fill="#94A3B8" font-size="13" font-weight="600">Năm</text>' +
      '<circle cx="680" cy="842" r="23" fill="#172554" stroke="#FBBF24" stroke-width="2.5"/>' +
      '<text x="680" y="849" text-anchor="middle" fill="#FEF08A" font-size="20" font-weight="900">' + p[0].so + '</text>' +
      '<text x="680" y="809" text-anchor="middle" fill="#CBD5E1" font-size="13.5" font-weight="700">' + p[0].tuoi + 't (' + p[0].nam + ')</text>' +
      '<circle cx="880" cy="842" r="23" fill="#172554" stroke="#FBBF24" stroke-width="2.5"/>' +
      '<text x="880" y="849" text-anchor="middle" fill="#FEF08A" font-size="20" font-weight="900">' + p[1].so + '</text>' +
      '<text x="880" y="809" text-anchor="middle" fill="#CBD5E1" font-size="13.5" font-weight="700">' + p[1].tuoi + 't (' + p[1].nam + ')</text>' +
      '<circle cx="780" cy="756" r="24" fill="#064E3B" stroke="#34D399" stroke-width="2.6"/>' +
      '<text x="780" y="764" text-anchor="middle" fill="#A7F3D0" font-size="21" font-weight="900">' + p[2].so + '</text>' +
      '<text x="844" y="761" text-anchor="start" fill="#CBD5E1" font-size="13.5" font-weight="700">' + p[2].tuoi + 't (' + p[2].nam + ')</text>' +
      '<circle cx="780" cy="680" r="25" fill="#78350F" stroke="#F59E0B" stroke-width="3"/>' +
      '<text x="780" y="688" text-anchor="middle" fill="#FEF3C7" font-size="22" font-weight="900">' + p[3].so + '</text>' +
      '<text x="846" y="685" text-anchor="start" fill="#FDE68A" font-size="14" font-weight="800">' + p[3].tuoi + 't (' + p[3].nam + ')</text>';

    var badges = [
      ["SỨ MỆNH", String(prof.su_menh), "#10B981"],
      ["LINH HỒN", String(prof.linh_hon), "#38BDF8"],
      ["NHÂN CÁCH", String(prof.nhan_cach), "#A78BFA"],
      ["NĂM CÁ NHÂN " + yr, String(prof.nam_ca_nhan), "#F59E0B"]
    ];

    var badgeSvg = badges.map(function(b, idx) {
      var bx = 64 + idx * 244;
      return (
        '<rect x="' + bx + '" y="468" width="224" height="114" rx="20" fill="rgba(255,255,255,0.05)" stroke="' + b[2] + '" stroke-opacity="0.55" stroke-width="1.8"/>' +
        '<text x="' + (bx + 112) + '" y="502" text-anchor="middle" fill="#94A3B8" font-size="14" font-weight="800" letter-spacing="1.2">' + b[0] + '</text>' +
        '<text x="' + (bx + 112) + '" y="558" text-anchor="middle" fill="' + b[2] + '" font-size="44" font-weight="900">' + b[1] + '</text>'
      );
    }).join("");

    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="1080" height="1350" style="font-family:\'Be Vietnam Pro\',system-ui,-apple-system,sans-serif">' +
        '<defs>' +
          '<linearGradient id="bgG" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="#050B16"/>' +
            '<stop offset="52%" stop-color="#0B172A"/>' +
            '<stop offset="100%" stop-color="#071E22"/>' +
          '</linearGradient>' +
          '<radialGradient id="orbG" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0%" stop-color="#10B981" stop-opacity="0.42"/>' +
            '<stop offset="60%" stop-color="#0EA5E9" stop-opacity="0.16"/>' +
            '<stop offset="100%" stop-color="#050B16" stop-opacity="0"/>' +
          '</radialGradient>' +
          '<linearGradient id="ringG" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="#34D399"/>' +
            '<stop offset="50%" stop-color="#0EA5E9"/>' +
            '<stop offset="100%" stop-color="#F59E0B"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<rect width="1080" height="1350" fill="url(#bgG)"/>' +
        '<circle cx="540" cy="285" r="320" fill="url(#orbG)"/>' +
        '<rect x="28" y="28" width="1024" height="1294" rx="34" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>' +
        '<text x="540" y="78" text-anchor="middle" fill="#34D399" font-size="17" font-weight="800" letter-spacing="3.5">BẢN ĐỒ THẦN SỐ HỌC PYTHAGORAS · TỦ SÁCH &amp; NHẠC THIỀN @1995LIDO</text>' +
        '<text x="540" y="128" text-anchor="middle" fill="#F8FAFC" font-size="38" font-weight="900">' + nameUp + '</text>' +
        '<text x="540" y="164" text-anchor="middle" fill="#94A3B8" font-size="20" font-weight="600">Ngày sinh dương lịch: ' + dob + '</text>' +
        '<circle cx="540" cy="288" r="98" fill="rgba(15,23,42,0.85)" stroke="url(#ringG)" stroke-width="6"/>' +
        '<circle cx="540" cy="288" r="112" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="2" stroke-dasharray="7 7"/>' +
        '<text x="540" y="246" text-anchor="middle" fill="#94A3B8" font-size="14" font-weight="800" letter-spacing="2">SỐ CHỦ ĐẠO</text>' +
        '<text x="540" y="324" text-anchor="middle" fill="#FFFFFF" font-size="78" font-weight="900">' + lpLbl + '</text>' +
        '<text x="540" y="426" text-anchor="middle" fill="#FDE68A" font-size="25" font-weight="800">' + danhXung + '</text>' +
        badgeSvg +
        '<rect x="64" y="602" width="414" height="392" rx="24" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.10)" stroke-width="1.5"/>' +
        '<text x="86" y="634" fill="#34D399" font-size="17" font-weight="800">📊 BIỂU ĐỒ NGÀY SINH (3 TRỤC)</text>' +
        cellsSvg.join("") +
        '<rect x="502" y="602" width="514" height="392" rx="24" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.10)" stroke-width="1.5"/>' +
        '<text x="526" y="634" fill="#FBBF24" font-size="17" font-weight="800">⛰️ KIM TỰ THÁP 4 ĐỈNH CAO ĐỜI NGƯỜI</text>' +
        pyrSvg +
        '<rect x="64" y="1018" width="952" height="174" rx="24" fill="rgba(255,255,255,0.05)" stroke="#34D399" stroke-opacity="0.45" stroke-width="2"/>' +
        '<text x="92" y="1056" fill="#34D399" font-size="17" font-weight="800" letter-spacing="1">✨ ĐỊNH HƯỚNG TRỌNG TÂM &amp; NĂM CÁ NHÂN ' + yr + ':</text>' +
        '<text x="92" y="1096" fill="#F1F5F9" font-size="20" font-weight="600">' + prof.thong_diep_nam + '</text>' +
        '<rect x="64" y="1216" width="952" height="78" rx="22" fill="rgba(16,185,129,0.20)" stroke="#10B981" stroke-width="1.5"/>' +
        '<text x="540" y="1250" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900" letter-spacing="0.6">🪷 NHẠC THIỀN 432Hz &amp; TỦ SÁCH PHẬT GIÁO @1995LIDO</text>' +
        '<text x="540" y="1278" text-anchor="middle" fill="rgba(255,255,255,0.94)" font-size="15.5" font-weight="700">Thấu hiểu bản thân · Thân tâm an lạc · Miễn phí 100% phục vụ cộng đồng</text>' +
      '</svg>'
    );
  }

  function compute12Months(prof) {
    var now = new Date();
    var curM = now.getMonth() + 1;
    var curY = now.getFullYear();
    var dobObj = parseDob(prof.ngay_sinh);
    var rdD = reduceSingle(dobObj.d);
    var rdM = reduceSingle(dobObj.m);

    var roadmap = [];
    for (var i = 0; i < 12; i++) {
      var m = curM + i;
      var y = curY;
      if (m > 12) {
        y += Math.floor((m - 1) / 12);
        m = ((m - 1) % 12) + 1;
      }

      var sumY = 0;
      String(y).split("").forEach(function(c){ sumY += parseInt(c, 10); });
      var py = reduceSingle(rdD + rdM + reduceSingle(sumY));
      var pm = reduceSingle(py + m);

      var tag = (m < 10 ? "0" + m : m) + "/" + y;
      var titleM = MONTH_NAMES[pm] || ("Tháng Năng Lượng Số " + pm);

      roadmap.push({
        thang_nam: tag,
        thang_ca_nhan: pm,
        tieu_de: titleM,
        cong_viec: "Tập trung khai thác năng lượng của Tháng số " + pm + " để tối ưu hiệu suất công việc và sự nghiệp.",
        tai_chinh: "Quản trị dòng tiền tỉnh thức, hạn chế chi tiêu cảm xúc.",
        ngay_dep: "Ngày 0" + pm + ", " + (pm + 9) + ", " + (pm + 18)
      });
    }
    return roadmap;
  }

  function generateFullReading(prof, cauHoi) {
    var manhStr = prof.mui_ten_manh.map(function(x){ return x.ten; }).join(", ") || "Không có trục 3 số liền kề (năng lượng linh hoạt)";
    var trongStr = prof.mui_ten_trong.map(function(x){ return x.ten; }).join(", ") || "Không bị trống hoàn toàn trục 3 số nào";
    var peaksStr = prof.dinh_cao.map(function(p){
      return "Đỉnh " + p.dinh + " (Số " + p.so + " ở tuổi " + p.tuoi + " - năm " + p.nam + ")";
    }).join("; ");

    return (
      "THÔNG ĐIỆP CỐT LÕI: " + prof.thong_diep_nam + "\n\n" +
      "1. BẢN SẮC CỐT LÕI (SỐ CHỦ ĐẠO " + prof.so_chu_dao_nhan + " × SỨ MỆNH " + prof.su_menh + "):\n" +
      "Bạn mang tần số của " + prof.danh_xung + ". " + prof.mo_ta_ngan + " Khi kết hợp cùng Chỉ số Sứ mệnh " + prof.su_menh + ", bạn phát huy mạnh nhất khi được làm việc có ý nghĩa rõ ràng, chủ động tạo giá trị thật và giữ tâm thế vững vàng.\n\n" +
      "2. NỘI TÂM & NHÂN CÁCH (LINH HỒN " + prof.linh_hon + " · NHÂN CÁCH " + prof.nhan_cach + "):\n" +
      "Bên sâu trong tâm thức, Linh hồn số " + prof.linh_hon + " định hình điều khiến bạn thực sự hạnh phúc và bình an, trong khi người xung quanh cảm nhận bạn qua lăng kính Nhân cách số " + prof.nhan_cach + ".\n\n" +
      "3. BIỂU ĐỒ NGÀY SINH & TRỤC CẦN BÙ ĐẮP:\n" +
      "- Thế mạnh sẵn có: " + manhStr + ".\n- Điểm cần rèn luyện: " + trongStr + ".\n\n" +
      "4. ĐỊNH HƯỚNG NĂM CÁ NHÂN " + prof.nam_hien_tai + " (NĂM SỐ " + prof.nam_ca_nhan + "):\n" +
      prof.thong_diep_nam + "\nVấn đề bạn trăn trở: \"" + (cauHoi || "Định hướng sự nghiệp và bình an thân tâm") + "\" sẽ tìm thấy lời giải khi bạn phát huy đúng trường năng lượng của năm số " + prof.nam_ca_nhan + ".\nBước sang năm " + (prof.nam_hien_tai + 1) + " (Năm cá nhân số " + prof.nam_ca_nhan_sau + "): " + prof.thong_diep_nam_sau + "\n\n" +
      "5. KIM TỰ THÁP 4 ĐỈNH CAO ĐỜI NGƯỜI:\n" + peaksStr + "."
    );
  }


  function generateBookletHtml(prof, fullReading, roadmap12) {
    var parts = (fullReading || "").split(/(?:\n|^)(?=[1-5]\.\s*)/).filter(Boolean);
    var partsHtml = parts.map(function(p){
      var lines = p.trim().split("\n");
      var title = lines[0] || "";
      var body = lines.slice(1).join("<br>");
      return "<div class=\"section\"><h3>" + title + "</h3><p>" + body + "</p></div>";
    }).join("");

    var monthsHtml = (roadmap12 || []).map(function(m){
      return "<div class=\"month-card\">" +
        "<h4>📅 " + m.thang_nam + " — " + m.tieu_de + " (Tháng cá nhân " + m.thang_ca_nhan + ")</h4>" +
        "<p><b>💼 Công việc:</b> " + m.cong_viec + "</p>" +
        "<p><b>💰 Tài chính:</b> " + m.tai_chinh + "</p>" +
        "<p class=\"peak-day\">✦ Ngày năng lượng đỉnh: <b>" + m.ngay_dep + "</b></p>" +
      "</div>";
    }).join("");

    return "<!DOCTYPE html>\n" +
      "<html lang=\"vi\">\n<head>\n" +
      "<meta charset=\"UTF-8\">\n" +
      "<title>Cẩm Nang Thần Số Học Pythagoras — " + prof.ho_ten + "</title>\n" +
      "<style>\n" +
      "@page { size: A4; margin: 18mm 15mm; }\n" +
      "body { font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif; line-height: 1.6; color: #1e293b; background: #fff; margin: 0; padding: 24px; }\n" +
      ".no-print { text-align: center; margin-bottom: 24px; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }\n" +
      ".btn-print { background: #059669; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; }\n" +
      ".header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 20px; }\n" +
      ".header h1 { margin: 0 0 6px; font-size: 24px; color: #064e3b; text-transform: uppercase; letter-spacing: 0.5px; }\n" +
      ".header .sub { font-size: 16px; color: #475569; font-weight: 600; }\n" +
      ".core-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }\n" +
      ".core-item { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; text-align: center; }\n" +
      ".core-item small { display: block; font-size: 12px; color: #166534; font-weight: 600; text-transform: uppercase; }\n" +
      ".core-item b { font-size: 22px; color: #065f46; }\n" +
      ".section { margin-bottom: 20px; page-break-inside: avoid; }\n" +
      ".section h3 { margin: 0 0 8px; color: #065f46; font-size: 16px; border-left: 4px solid #10b981; padding-left: 10px; }\n" +
      ".section p { margin: 0; font-size: 14px; color: #334155; line-height: 1.7; }\n" +
      ".roadmap-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 12px; }\n" +
      ".month-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 14px; background: #fafafa; font-size: 13px; page-break-inside: avoid; }\n" +
      ".month-card h4 { margin: 0 0 6px; color: #0f172a; font-size: 13.5px; }\n" +
      ".month-card p { margin: 2px 0; color: #475569; }\n" +
      ".peak-day { color: #059669; font-weight: 600; margin-top: 4px !important; }\n" +
      ".footer { text-align: center; margin-top: 30px; padding-top: 16px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #64748b; }\n" +
      "@media print { .no-print { display: none !important; } body { padding: 0; } }\n" +
      "</style>\n</head>\n<body>\n" +
      "<div class=\"no-print\">" +
        "<button class=\"btn-print\" onclick=\"window.print()\">🖨️ In hoặc Lưu File PDF Ngay</button>" +
        "<span style=\"margin-left: 12px; color: #64748b; font-size: 14px;\">(Trình duyệt sẽ mở hộp thoại in, chọn \"Save as PDF\" để lưu lại)</span>" +
      "</div>\n" +
      "<div class=\"header\">" +
        "<h1>Cẩm Nang Thần Số Học Pythagoras Cá Nhân Hóa</h1>" +
        "<div class=\"sub\">Dành riêng cho: <b>" + prof.ho_ten + "</b> &bull; Ngày sinh: <b>" + prof.ngay_sinh + "</b></div>" +
        "<div style=\"margin-top: 8px; color: #059669; font-weight: 700; font-size: 15px;\">Số Chủ Đạo " + prof.so_chu_dao_nhan + " — " + prof.danh_xung + "</div>" +
      "</div>\n" +
      "<div class=\"core-grid\">" +
        "<div class=\"core-item\"><small>Số Chủ Đạo</small><b>" + prof.so_chu_dao_nhan + "</b></div>" +
        "<div class=\"core-item\"><small>Số Sứ Mệnh</small><b>" + prof.su_menh + "</b></div>" +
        "<div class=\"core-item\"><small>Số Linh Hồn</small><b>" + prof.linh_hon + "</b></div>" +
        "<div class=\"core-item\"><small>Số Nhân Cách</small><b>" + prof.nhan_cach + "</b></div>" +
        "<div class=\"core-item\"><small>Năm 2026</small><b>Số " + prof.nam_ca_nhan + "</b></div>" +
        "<div class=\"core-item\"><small>Năm 2027</small><b>Số " + prof.nam_ca_nhan_sau + "</b></div>" +
      "</div>\n" +
      "<h2 style=\"color: #064e3b; font-size: 18px; border-bottom: 1px solid #bbf7d0; padding-bottom: 6px;\">📖 Luận Giải Chi Tiết 5 Phần Bản Mệnh</h2>\n" +
      partsHtml +
      "<h2 style=\"color: #064e3b; font-size: 18px; border-bottom: 1px solid #bbf7d0; padding-bottom: 6px; margin-top: 24px;\">📅 Lộ Trình Năng Lượng 12 Tháng Tới (Chi Tiết Từng Tháng)</h2>\n" +
      "<div class=\"roadmap-grid\">" + monthsHtml + "</div>\n" +
      "<div class=\"footer\">" +
        "<p>🪷 <b>TỦ SÁCH PHẬT GIÁO NGUYÊN THỦY &amp; NHẠC THIỀN 432Hz @1995LIDO</b> &bull; https://tuanweb2026.github.io/lido-buddhist-library/</p>" +
        "<p>Tài liệu gửi tặng độc bản &bull; Không mua bán hay chuyển nhượng &bull; Chúc bạn luôn an trú trong từng phút giây hiện tại.</p>" +
      "</div>\n" +
      "</body>\n</html>";
  }
  // Engine chính chạy trên Client
  root.runNumerologyClientEngine = function(hoTen, ngaySinh, cauHoi) {
    var prof = computeNumerology(hoTen, ngaySinh, 2026);
    var svgCard = buildNumerologySvg(prof);
    var fullText = generateFullReading(prof, cauHoi);
    var roadmap12 = compute12Months(prof);
    var bookletHtml = generateBookletHtml(prof, fullText, roadmap12);

    var headerSummary = 
      "=== 🔮 HỒ SƠ THẦN SỐ HỌC PYTHAGORAS BẢN ĐẦY ĐỦ ===\n" +
      "• Họ và tên: " + prof.ho_ten + "  |  Ngày sinh: " + prof.ngay_sinh + "\n" +
      "• Con số Chủ đạo: " + prof.so_chu_dao_nhan + " — " + prof.danh_xung + "\n" +
      "• Sứ mệnh: " + prof.su_menh + "  |  Linh hồn: " + prof.linh_hon + "  |  Nhân cách: " + prof.nhan_cach + "  |  Trưởng thành: " + prof.truong_thanh + "\n" +
      "• Năm cá nhân " + prof.nam_hien_tai + ": Số " + prof.nam_ca_nhan + "  |  Năm " + (prof.nam_hien_tai + 1) + ": Số " + prof.nam_ca_nhan_sau + "\n" +
      "====================================================\n\n";

    return {
      tieu_de: "🔮 Bản đồ Thần Số Học của " + prof.ho_ten + " — Số Chủ Đạo " + prof.so_chu_dao_nhan + " (" + prof.danh_xung + ")",
      diem_tot: [
        "Tổ hợp cốt lõi: Chủ đạo " + prof.so_chu_dao_nhan + " · Sứ mệnh " + prof.su_menh + " · Linh hồn " + prof.linh_hon + " · Nhân cách " + prof.nhan_cach + " · Năm cá nhân " + prof.nam_hien_tai + " là Số " + prof.nam_ca_nhan + ".",
        "🎁 Mở khóa trọn bộ 5 phần luận giải + Thẻ Bản Đồ PNG nét cao tính riêng theo ngày sinh của bạn!"
      ],
      ho_ten: prof.ho_ten,
      ngay_sinh: prof.ngay_sinh,
      ho_so: prof,
      thong_diep_cot_loi: prof.thong_diep_nam,
      svg_card: svgCard,
      ban_day_du: headerSummary + fullText,
      bai_luan_5_phan: fullText,
      booklet_id: "tsh_" + Math.random().toString(16).slice(2, 10),
      booklet_html: bookletHtml,
      xem_truoc_2_thang: roadmap12.slice(0, 2)
    };
  };

})(typeof window !== 'undefined' ? window : this);
