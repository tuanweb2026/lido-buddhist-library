// =============================================================================
// LOGIC XỬ LÝ ỨNG DỤNG DONATE, KÊNH @1995LIDO & ĐI CHÙA ONLINE
// =============================================================================

// Khởi tạo state ứng dụng (Khóa bất biến - Cố định bảo mật thông tin ngân hàng)
const currentBank = Object.freeze({ ...APP_CONFIG.bank });
let selectedTier = APP_CONFIG.tiers[0]; // Mặc định gói Chén Trà An Yên
let customAmount = 0;
let audioContext = null;

// State của Đi Chùa Online
let templeState = {
  moCount: parseInt(localStorage.getItem("1995lido_mo_count") || "0", 10),
  prostrationCount: parseInt(localStorage.getItem("1995lido_prostration_count") || "0", 10),
  flowerCount: parseInt(localStorage.getItem("1995lido_flower_count") || "0", 10),
  incenseLit: true
};

// Khởi tạo ứng dụng sau khi DOM load xong
document.addEventListener("DOMContentLoaded", () => {
  renderBrandInfo();
  renderTiers();
  renderMissions();
  renderWishes();
  renderPrayers();
  updateQRDisplay();
  updateTempleCounters();
  setupEventListeners();
  initLucide();
  startIncenseSmoke();
});

// Render icon Lucide
function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Hiển thị thông tin thương hiệu & Kênh
function renderBrandInfo() {
  const handleEl = document.getElementById("channel-handle");
  if (handleEl) handleEl.textContent = APP_CONFIG.channel.handle;
  const nameEl = document.getElementById("channel-name");
  if (nameEl) nameEl.textContent = APP_CONFIG.channel.name;
  const sloganEl = document.getElementById("channel-slogan");
  if (sloganEl) sloganEl.textContent = APP_CONFIG.channel.slogan;
  const subtitleEl = document.getElementById("channel-subtitle");
  if (subtitleEl) subtitleEl.textContent = APP_CONFIG.channel.subtitle;
  
  const ytLinks = document.querySelectorAll(".yt-channel-link");
  ytLinks.forEach(link => link.href = APP_CONFIG.channel.youtubeUrl);

  const libLinks = document.querySelectorAll(".lido-library-link");
  libLinks.forEach(link => link.href = APP_CONFIG.channel.libraryUrl);
}

// Render danh sách các gói gieo duyên
function renderTiers() {
  const container = document.getElementById("tiers-container");
  if (!container) return;

  container.innerHTML = APP_CONFIG.tiers.map((tier) => {
    const isSelected = tier.id === selectedTier.id;
    return `
      <div onclick="selectTier('${tier.id}')" 
           class="tier-card p-5 rounded-2xl cursor-pointer transition-all duration-300 relative border ${
             isSelected 
               ? 'bg-amber-50/90 border-amber-500 shadow-lg shadow-amber-900/10 scale-[1.02]' 
               : 'bg-white/80 border-stone-200 hover:border-amber-300 hover:bg-amber-50/40'
           }" id="tier-card-${tier.id}">
        
        ${tier.badge ? `
          <span class="absolute -top-3 right-4 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
            isSelected ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600 border border-stone-300'
          }">
            ${tier.badge}
          </span>
        ` : ''}

        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
            isSelected ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'bg-stone-100 text-stone-700'
          }">
            ${tier.symbol}
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-stone-900 text-base flex items-center justify-between">
              ${tier.title}
              <span class="text-amber-800 font-extrabold text-lg">${tier.displayAmount}</span>
            </h3>
            <p class="text-xs text-stone-600 mt-1.5 leading-relaxed">${tier.desc}</p>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Chọn một gói gieo duyên
function selectTier(tierId) {
  const tier = APP_CONFIG.tiers.find(t => t.id === tierId);
  if (!tier) return;
  selectedTier = tier;
  
  const customBox = document.getElementById("custom-amount-box");
  if (customBox) {
    if (tierId === "lotus") {
      customBox.classList.remove("hidden");
    } else {
      customBox.classList.add("hidden");
      customAmount = 0;
    }
  }

  renderTiers();
  updateQRDisplay();
  triggerLotusPetals();
  playSingingBowl(false);
}

// Cập nhật hiển thị QR Code và thông tin chuyển khoản
function updateQRDisplay() {
  const amount = (selectedTier.id === "lotus" && customAmount > 0) 
    ? customAmount 
    : selectedTier.amount;
  
  const transferMessage = `${currentBank.defaultMessage} ${selectedTier.id.toUpperCase()}`;
  
  const qrUrl = amount > 0
    ? `https://img.vietqr.io/image/${currentBank.bankId}-${currentBank.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(transferMessage)}&accountName=${encodeURIComponent(currentBank.accountHolder)}`
    : `https://img.vietqr.io/image/${currentBank.bankId}-${currentBank.accountNumber}-compact2.png?addInfo=${encodeURIComponent(transferMessage)}&accountName=${encodeURIComponent(currentBank.accountHolder)}`;

  const qrImage = document.getElementById("qr-image");
  if (qrImage) {
    qrImage.src = qrUrl;
  }

  const bName = document.getElementById("display-bank-name");
  if (bName) bName.textContent = currentBank.bankName;
  const aNum = document.getElementById("display-account-number");
  if (aNum) aNum.textContent = currentBank.accountNumber;
  const aHolder = document.getElementById("display-account-holder");
  if (aHolder) aHolder.textContent = currentBank.accountHolder;
  const dAmount = document.getElementById("display-amount");
  if (dAmount) dAmount.textContent = amount > 0 
    ? new Intl.NumberFormat('vi-VN').format(amount) + " đ" 
    : "Tùy tâm hoan hỷ";
  const dMsg = document.getElementById("display-message");
  if (dMsg) dMsg.textContent = transferMessage;
}

// Xử lý sao chép văn bản vào Clipboard kèm Toast thông báo
function copyToClipboard(text, fieldName) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Đã sao chép ${fieldName} vào bộ nhớ tạm!`);
    playSingingBowl(false);
  }).catch(() => {
    showToast("Không thể sao chép tự động, vui lòng chọn thủ công.");
  });
}

// Toast Thông Báo Thanh Nhã
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// Xử lý số tiền tùy chỉnh
function handleCustomAmountChange(val) {
  const num = parseInt(val.replace(/\D/g, ""), 10);
  customAmount = isNaN(num) ? 0 : num;
  const input = document.getElementById("custom-amount-input");
  if (input) {
    input.value = customAmount > 0 ? new Intl.NumberFormat('vi-VN').format(customAmount) : "";
  }
  updateQRDisplay();
}

// Render sứ mệnh nhân văn
function renderMissions() {
  const container = document.getElementById("missions-container");
  if (!container) return;

  container.innerHTML = APP_CONFIG.missions.map(item => `
    <div class="zen-card p-6 rounded-2xl">
      <div class="w-12 h-12 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center mb-4">
        <i data-lucide="${item.icon}" class="w-6 h-6"></i>
      </div>
      <h3 class="font-serif font-bold text-lg text-stone-900 mb-2">${item.title}</h3>
      <p class="text-stone-600 text-sm leading-relaxed">${item.desc}</p>
    </div>
  `).join("");
}

// =============================================================================
// ĐI CHÙA ONLINE: NGHI THỨC TÂM LINH & TƯƠNG TÁC CHÁNH ĐIỆN
// =============================================================================

// 1. Thắp Nén Tâm Hương
function ritualThapHuong() {
  templeState.incenseLit = true;
  startIncenseSmoke();
  playSingingBowl(true);
  showToast("🪔 Đã thắp nén tâm hương dâng lên Tam Bảo. Nguyện thân tâm thanh tịnh, mọi sự hanh thông.");
  triggerLotusPetals();
}

function startIncenseSmoke() {
  const smokeBox = document.getElementById("incense-smoke-box");
  if (!smokeBox) return;
  smokeBox.innerHTML = "";
  
  for (let i = 0; i < 6; i++) {
    const p = document.createElement("div");
    p.className = "smoke-particle";
    p.style.left = (35 + Math.random() * 30) + "%";
    p.style.bottom = "0px";
    p.style.animationDelay = (i * 0.5) + "s";
    p.style.animationDuration = (2.5 + Math.random() * 1.5) + "s";
    smokeBox.appendChild(p);
  }
}

// 2. Gõ Mõ Định Tâm (Wooden Fish Sound Synthesizer)
function ritualGoMo() {
  templeState.moCount++;
  localStorage.setItem("1995lido_mo_count", templeState.moCount);
  updateTempleCounters();

  // Hiệu ứng nhấp nháy mõ
  const moIcon = document.getElementById("mo-icon");
  if (moIcon) {
    moIcon.classList.remove("mo-active");
    void moIcon.offsetWidth;
    moIcon.classList.add("mo-active");
  }

  playWoodenFishSound();
  showToast(`🪵 Cốc! Đã gõ mõ ${templeState.moCount} biến — Thân tâm tỉnh giác.`);
}

// Bộ tổng hợp âm thanh Mõ Gỗ (Web Audio API)
function playWoodenFishSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioContext) audioContext = new AudioCtx();
    if (audioContext.state === 'suspended') audioContext.resume();

    const now = audioContext.currentTime;

    // Âm mõ gỗ: tần số cơ bản ~750Hz, giảm âm siêu nhanh dạng gõ gỗ
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(760, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(700, now);
    filter.Q.setValueAtTime(4.0, now);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  } catch (e) {
    console.log("Audio error:", e);
  }
}

// 3. Lạy Phật Cầu An
function ritualLayPhat() {
  templeState.prostrationCount++;
  localStorage.setItem("1995lido_prostration_count", templeState.prostrationCount);
  updateTempleCounters();
  playSingingBowl(false);

  const danhHieu = [
    "Nam Mô Bổn Sư Thích Ca Mâu Ni Phật",
    "Nam Mô A Di Đà Phật",
    "Nam Mô Đại Bi Quán Thế Âm Bồ Tát"
  ];
  const currentTitle = danhHieu[(templeState.prostrationCount - 1) % danhHieu.length];
  
  showToast(`🙏 Đảnh lễ Phật ${templeState.prostrationCount} lạy: "${currentTitle}"`);
  triggerLotusPetals();
}

// 4. Dâng Hoa Sen Cúng Phật
function ritualDangHoa() {
  templeState.flowerCount++;
  localStorage.setItem("1995lido_flower_count", templeState.flowerCount);
  updateTempleCounters();
  playSingingBowl(false);
  showToast(`🪷 Đã dâng đóa sen thanh tịnh thứ ${templeState.flowerCount} cúng dường chư Phật.`);
  triggerLotusPetals();
}

// Cập nhật bộ đếm trên Chánh Điện
function updateTempleCounters() {
  const moEl = document.getElementById("temple-counter-mo");
  if (moEl) moEl.textContent = templeState.moCount;
  
  const layEl = document.getElementById("temple-counter-lay");
  if (layEl) layEl.textContent = templeState.prostrationCount;

  const hoaEl = document.getElementById("temple-counter-hoa");
  if (hoaEl) hoaEl.textContent = templeState.flowerCount;
}

// 5. Rút Quẻ Pháp Cú / Lời Phật Dạy Đầu Ngày
const DHAMMAPADA_FORTUNES = [
  {
    stt: "Quẻ Số 01",
    verse: "Ý dẫn đầu các pháp,\nÝ làm chủ, ý tạo;\nNếu với ý thanh tịnh,\nNói lên hay hành động,\nAn lạc bước theo sau,\nNhư bóng không rời hình.",
    source: "Kinh Pháp Cú — Kệ số 2",
    meaning: "Giữ tâm ý thiện lành và trong sạch, mọi phước lành và bình an sẽ luôn túc trực bên bạn."
  },
  {
    stt: "Quẻ Số 02",
    verse: "Hận thù diệt hận thù,\nĐời này không thể có;\nTừ bi diệt hận thù,\nLà định luật ngàn thu.",
    source: "Kinh Pháp Cú — Kệ số 5",
    meaning: "Lấy oán báo oán oán chập chùng, lấy ân báo oán oán tiêu tan. Tha thứ cho người chính là giải thoát cho chính mình."
  },
  {
    stt: "Quẻ Số 03",
    verse: "Chiến thắng vạn quân giặc,\nKhông bằng tự thắng mình;\nChiến thắng chính bản thân,\nLà chiến công oanh liệt nhất.",
    source: "Kinh Pháp Cú — Kệ số 103",
    meaning: "Chiến thắng lớn nhất đời người là làm chủ được cơn giận, lòng tham và thói quen vô minh của bản thân."
  },
  {
    stt: "Quẻ Số 04",
    verse: "Không làm các điều ác,\nNguyện làm các việc lành,\nGiữ tâm ý trong sạch,\nẤy lời chư Phật dạy.",
    source: "Kinh Pháp Cú — Kệ số 183",
    meaning: "Đơn sơ mà trọn vẹn, mỗi ngày chỉ cần chọn làm một việc tốt nhỏ bé, tâm hồn sẽ nhẹ tênh tự tại."
  },
  {
    stt: "Quẻ Số 05",
    verse: "Đời người như giọt sương mai trên đầu ngọn cỏ,\nVạn sự tùy duyên, tâm an vạn sự an;\nChớ để phiền não trói buộc hiện tại,\nHãy an trú trong giây phút bây giờ.",
    source: "Kinh Điển Nikāya — Lời Phật Dạy",
    meaning: "Quá khứ đã qua, tương lai chưa tới. Chỉ có hiện tại là nơi duy nhất bạn đang thực sự sống. Hãy mỉm cười và an yên."
  },
  {
    stt: "Quẻ Số 06",
    verse: "Hãy tự mình thắp đuốc lên mà đi.\nHãy nương tựa chính mình,\nNương tựa vào Chánh pháp,\nChớ nương tựa vào điều gì khác.",
    source: "Kinh Đại Bát Niết Bàn",
    meaning: "Trí tuệ và sự an lạc nằm ngay bên trong bạn. Hãy lắng nghe tiếng chuông tỉnh thức và thắp sáng ngọn đèn hiểu biết."
  }
];

function ritualRutQue() {
  playSingingBowl(true);
  const randomIndex = Math.floor(Math.random() * DHAMMAPADA_FORTUNES.length);
  const fortune = DHAMMAPADA_FORTUNES[randomIndex];

  const modal = document.getElementById("fortune-modal");
  document.getElementById("fortune-stt").textContent = fortune.stt;
  document.getElementById("fortune-verse").innerText = fortune.verse;
  document.getElementById("fortune-source").textContent = fortune.source;
  document.getElementById("fortune-meaning").textContent = fortune.meaning;

  if (modal) {
    modal.classList.remove("hidden");
    triggerLotusPetals();
  }
}

function closeFortuneModal() {
  const modal = document.getElementById("fortune-modal");
  if (modal) modal.classList.add("hidden");
}

// 6. Sớ Cầu An Trực Tuyến
const INITIAL_PRAYERS = [
  {
    name: "Phật tử Diệu Hạnh",
    content: "Cầu nguyện cho cha mẹ hai bên thân tâm an lạc, tật bệnh tiêu trừ, phước thọ miên trường.",
    time: "Hôm nay"
  },
  {
    name: "Gia đình Huệ Quang",
    content: "Cầu an cho gia quyến thuận hòa, con cháu hiếu thảo chăm ngoan, công việc hanh thông thuận lợi.",
    time: "Hôm qua"
  },
  {
    name: "Thính giả Tĩnh Tâm",
    content: "Cầu nguyện tâm hồn luôn an tịnh, buông xả muộn phiền, vững bước trên con đường tu học.",
    time: "3 ngày trước"
  }
];

function renderPrayers() {
  const container = document.getElementById("prayers-list-container");
  if (!container) return;

  const stored = localStorage.getItem("1995lido_prayers");
  const prayers = stored ? JSON.parse(stored) : INITIAL_PRAYERS;

  container.innerHTML = prayers.map(p => `
    <div class="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/20 text-stone-200 text-xs">
      <div class="flex items-center justify-between text-amber-300 font-bold mb-1">
        <span class="flex items-center gap-1.5"><i data-lucide="lotus" class="w-3.5 h-3.5"></i> ${p.name}</span>
        <span class="text-[10px] text-stone-400 font-normal">${p.time}</span>
      </div>
      <p class="italic text-stone-300">"${p.content}"</p>
    </div>
  `).join("");

  initLucide();
}

function submitPrayer(e) {
  e.preventDefault();
  const nameInput = document.getElementById("prayer-name");
  const contentInput = document.getElementById("prayer-content");

  const name = nameInput.value.trim() || "Phật tử ẩn danh";
  const content = contentInput.value.trim();

  if (!content) {
    showToast("Vui lòng ghi lời khấn nguyện cầu an!");
    return;
  }

  const newPrayer = {
    name: name,
    content: content,
    time: "Vừa xong"
  };

  const stored = localStorage.getItem("1995lido_prayers");
  const prayers = stored ? JSON.parse(stored) : [...INITIAL_PRAYERS];
  prayers.unshift(newPrayer);
  localStorage.setItem("1995lido_prayers", JSON.stringify(prayers));

  renderPrayers();
  contentInput.value = "";
  showToast("🙏 Đã dâng lời khấn nguyện lên Tam Bảo. Nguyện sở cầu như ý, sở nguyện tòng tâm!");
  playSingingBowl(true);
  triggerLotusPetals();
}

// =============================================================================
// SỔ LƯU BÚT HOAN HỶ & GÓP Ý
// =============================================================================
const INITIAL_WISHES = [
  {
    name: "Phật tử Diệu Tâm",
    tier: "Chén Trà An Yên",
    message: "Nghe bản 'Tịnh Tâm Liên Hoa' mỗi tối thấy tâm hồn thanh thản nhẹ nhàng. Cảm ơn Thảo Dương TV & LIDO đã tạo ra những giai điệu an yên giữa đời tất bật. Chúc kênh ngày càng lan tỏa phước lành!",
    time: "Hôm nay, 10:24"
  },
  {
    name: "Thính giả Minh Khang",
    tier: "Ấn Tống Kinh Điển Nikāya",
    message: "Rất hoan hỷ ủng hộ dự án Thư viện Phật học LIDO. Nhờ website thư viện mà mình tiếp cận được các kinh điển Nikāya nguyên thủy và học hỏi thêm nhiều điều bổ ích.",
    time: "Hôm qua, 21:15"
  },
  {
    name: "Thanh Hằng (Hà Nội)",
    tier: "Ngọn Nến Tuệ Giác",
    message: "Âm hưởng Đàn Tranh, Sáo Trúc và Chuông Xoay Tây Tạng tần số 432Hz nghe buông thư sâu và dễ ngủ lắm. Đã ủng hộ 1 tách trà ấm, mong LIDO duy trì hoài nhé!",
    time: "2 ngày trước"
  }
];

function renderWishes() {
  const container = document.getElementById("wishes-container");
  if (!container) return;

  const stored = localStorage.getItem("1995lido_wishes");
  const wishes = stored ? JSON.parse(stored) : INITIAL_WISHES;

  container.innerHTML = wishes.map(w => `
    <div class="zen-card p-5 rounded-2xl border border-stone-200/70">
      <div class="flex items-center justify-between mb-2">
        <span class="font-bold text-stone-800 text-sm flex items-center gap-1.5">
          <i data-lucide="flower" class="w-3.5 h-3.5 text-amber-600"></i> ${w.name}
        </span>
        <span class="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">${w.tier}</span>
      </div>
      <p class="text-stone-600 text-xs leading-relaxed italic">"${w.message}"</p>
      <span class="block text-[11px] text-stone-400 mt-2 text-right">${w.time}</span>
    </div>
  `).join("");

  initLucide();
}

function submitWish(e) {
  e.preventDefault();
  const nameInput = document.getElementById("wish-name");
  const msgInput = document.getElementById("wish-message");

  const name = nameInput.value.trim() || "Phật tử ẩn danh";
  const message = msgInput.value.trim();

  if (!message) {
    showToast("Vui lòng nhập lời chúc hoặc góp ý!");
    return;
  }

  const newWish = {
    name: name,
    tier: selectedTier.title,
    message: message,
    time: "Vừa xong"
  };

  const stored = localStorage.getItem("1995lido_wishes");
  const wishes = stored ? JSON.parse(stored) : [...INITIAL_WISHES];
  wishes.unshift(newWish);
  localStorage.setItem("1995lido_wishes", JSON.stringify(wishes));

  renderWishes();
  msgInput.value = "";
  showToast("Công đức vô lượng! Lời chúc của bạn đã được ghi nhận.");
  triggerLotusPetals();
  playSingingBowl(true);
}

// =============================================================================
// ÂM THANH CHUÔNG THIỀN 432Hz (Web Audio API)
// =============================================================================
function playSingingBowl(isFullTone = false) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    
    if (!audioContext) audioContext = new AudioCtx();
    if (audioContext.state === 'suspended') audioContext.resume();

    const now = audioContext.currentTime;
    const fundamental = 432;
    const partials = [
      { freq: fundamental * 1.0, gain: 0.6, decay: isFullTone ? 4.5 : 2.0 },
      { freq: fundamental * 2.76, gain: 0.35, decay: isFullTone ? 3.5 : 1.5 },
      { freq: fundamental * 5.4, gain: 0.15, decay: isFullTone ? 2.5 : 1.0 },
      { freq: fundamental * 8.9, gain: 0.08, decay: isFullTone ? 1.5 : 0.8 }
    ];

    partials.forEach(p => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(p.freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(p.gain * 0.4, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start(now);
      osc.stop(now + p.decay);
    });
  } catch (err) {
    console.log("Audio not supported or interaction needed:", err);
  }
}

function toggleZenSound() {
  playSingingBowl(true);
  showToast("🔔 Tiếng chuông tỉnh thức — Giữ tâm tĩnh tại trong giây phút hiện tại.");
}

// Cánh hoa sen bay lượn
function triggerLotusPetals() {
  const petals = ["🪷", "🌸", "✨", "🍃"];
  for (let i = 0; i < 18; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];
    petal.style.left = Math.random() * 95 + "vw";
    petal.style.fontSize = (Math.random() * 16 + 18) + "px";
    petal.style.animationDuration = (Math.random() * 3 + 2.5) + "s";
    petal.style.opacity = Math.random() * 0.7 + 0.3;
    document.body.appendChild(petal);

    setTimeout(() => {
      petal.remove();
    }, 5500);
  }
}

// Lắng nghe sự kiện
function setupEventListeners() {
  const form = document.getElementById("wish-form");
  if (form) form.addEventListener("submit", submitWish);

  const prayerForm = document.getElementById("prayer-form");
  if (prayerForm) prayerForm.addEventListener("submit", submitPrayer);
}
