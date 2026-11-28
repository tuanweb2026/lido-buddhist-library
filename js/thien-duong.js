(function () {
  const RING_C = 2 * Math.PI * 100; // r=100 => 628.32
  const METHODS = {
    anapana: "1. Ngồi thẳng lưng, thả lỏng vai. 2. Đặt sự hay biết nhẹ nhàng nơi cửa mũi. 3. Thở vào biết đang thở vào, thở ra biết đang thở ra — không ép buộc hơi thở (Kinh Trung Bộ MN 118).",
    vipassana: "1. Quan sát cảm giác thân tâm (nóng, lạnh, căng, nhẹ) từ đỉnh đầu xuống chân. 2. Giữ tâm bình đẳng (Upekkhā), không bám víu hay xua đuổi. 3. Thấy rõ tính sinh diệt vô thường (Anicca).",
    metta: "1. Khởi tâm lành cho mình: 'Mong cho tôi được bình an, không khổ não.' 2. Mở rộng đến người thân, người lạ và cả người khó chịu. 3. Rải tâm từ khắp muôn loài (Karaṇīya Mettā Sutta)."
  };

  let mins = 20, rem = 1200, elapsed = 0, state = "idle", tid = null, bid = null;
  let audioCtx = null, noiseBuf = null, workBellId = null, workBellOn = false;
  const sounds = {};

  const shell = document.getElementById("tdShell");
  const backdrop = document.getElementById("tdBackdrop");
  const digits = document.getElementById("tdDigits");
  const phase = document.getElementById("tdPhase");
  const ring = document.getElementById("tdRing");
  const halo = document.getElementById("tdHalo");
  const startBtn = document.getElementById("tdStartBtn");
  const customInput = document.getElementById("tdCustomMin");
  const intervalSel = document.getElementById("tdIntervalSel");
  const bellSel = document.getElementById("tdBellSel");
  const breathChk = document.getElementById("tdBreathChk");

  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    if (audioCtx && !noiseBuf) {
      noiseBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * 3, audioCtx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < d.length; i++) {
        d[i] = (last + 0.03 * (Math.random() * 2 - 1)) / 1.03;
        last = d[i];
        d[i] *= 2.8;
      }
    }
  }

  function playBell(gain = 0.28, freq = 256) {
    ensureAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const master = audioCtx.createGain();
    master.gain.setValueAtTime(gain, now);
    master.connect(audioCtx.destination);
    [{ r: 1, a: 0.6, d: 5.2 }, { r: 2.02, a: 0.25, d: 4.0 }, { r: 2.98, a: 0.13, d: 3.0 }].forEach((p) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.frequency.value = freq * p.r;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(p.a, now + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, now + p.d);
      o.connect(g); g.connect(master); o.start(now); o.stop(now + p.d + 0.1);
    });
  }

  function playBells(count) {
    for (let i = 0; i < count; i++) setTimeout(() => playBell(0.28, 256), i * 1900);
  }

  function setSound(type, pct) {
    const v = Math.max(0, Math.min(1, Number(pct) / 100));
    const card = document.querySelector(`.td-sound-card[data-sound="${type}"]`);
    if (card) card.classList.toggle("is-playing", v > 0);
    if (v === 0) {
      if (sounds[type]) {
        sounds[type].g.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.15);
        setTimeout(() => { if (sounds[type]) { sounds[type].stop(); delete sounds[type]; } }, 400);
      }
      return;
    }
    ensureAudio();
    if (!audioCtx) return;
    if (!sounds[type]) {
      const g = audioCtx.createGain(); g.gain.value = 0.001; g.connect(audioCtx.destination);
      if (type === "drone") {
        const oscs = [108, 216, 432].map((f, i) => {
          const o = audioCtx.createOscillator(), og = audioCtx.createGain();
          o.frequency.value = f; og.gain.value = i === 0 ? 0.5 : 0.2;
          o.connect(og); og.connect(g); o.start(); return o;
        });
        sounds[type] = { g, s: 0.12, stop: () => oscs.forEach((o) => o.stop()) };
      } else {
        const src = audioCtx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
        const flt = audioCtx.createBiquadFilter();
        flt.type = type === "stream" ? "bandpass" : "lowpass";
        flt.frequency.value = type === "rain" ? 1100 : type === "stream" ? 620 : 340;
        src.connect(flt); flt.connect(g); src.start();
        sounds[type] = { g, s: 0.28, stop: () => src.stop() };
      }
    }
    sounds[type].g.gain.setTargetAtTime(v * sounds[type].s, audioCtx.currentTime, 0.15);
  }

  function updateUI() {
    const safe = Number.isFinite(rem) && rem >= 0 ? Math.floor(rem) : 0;
    digits.textContent = `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
    const total = mins * 60;
    ring.style.strokeDashoffset = RING_C * (1 - (total > 0 ? rem / total : 1));
  }

  function updateBreath(active) {
    clearInterval(bid);
    halo.classList.remove("inhale", "exhale");
    if (!active || !breathChk.checked) {
      phase.textContent = state === "running" ? "Chánh niệm hơi thở" : state === "paused" ? "Đang tạm dừng" : state === "done" ? "Hoàn thành · Sādhu" : "Sẵn sàng an trú";
      return;
    }
    let inh = true;
    const tick = () => {
      halo.classList.toggle("inhale", inh);
      halo.classList.toggle("exhale", !inh);
      phase.textContent = inh ? "Hít vào · Biết đang hít vào" : "Thở ra · Biết đang thở ra";
      inh = !inh;
    };
    tick();
    bid = setInterval(tick, 4500);
  }

  function startTimer() {
    ensureAudio();
    if (state === "idle" || state === "done") {
      rem = mins * 60; elapsed = 0;
      playBells(Number(bellSel.value) || 1);
    }
    state = "running";
    startBtn.textContent = "Tạm dừng";
    updateBreath(true);
    clearInterval(tid);
    tid = setInterval(() => {
      rem -= 1; elapsed += 1; updateUI();
      const iv = Number(intervalSel.value) || 0;
      if (iv > 0 && rem > 15 && elapsed % (iv * 60) === 0) playBell(0.16, 320);
      if (rem <= 0) {
        clearInterval(tid); state = "done"; rem = 0; updateUI();
        startBtn.textContent = "Bắt đầu ngồi thiền"; updateBreath(false); playBells(3);
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(tid); state = "paused"; startBtn.textContent = "Tiếp tục"; updateBreath(false);
  }

  function resetTimer() {
    clearInterval(tid); state = "idle"; rem = mins * 60; elapsed = 0; updateUI();
    startBtn.textContent = "Bắt đầu ngồi thiền"; updateBreath(false);
  }

  function setScene(path) {
    const isNone = !path || path === "none";
    shell.classList.toggle("has-scene", !isNone);
    backdrop.style.backgroundImage = isNone ? "none" : `url('${path}')`;
    localStorage.setItem("lido_lib_scene", path || "none");
    document.querySelectorAll(".td-scene-chip").forEach((c) => c.classList.toggle("active", c.dataset.scene === (path || "none")));
  }

  function renderJournal() {
    const list = JSON.parse(localStorage.getItem("lido_lib_journal") || "[]");
    document.getElementById("tdJournalList").innerHTML = list.slice(0, 3).map((x) => `<li>• <strong>${x.d}:</strong> ${x.t}</li>`).join("");
  }

  // Bindings
  document.querySelectorAll(".td-scene-chip").forEach((c) => c.addEventListener("click", () => setScene(c.dataset.scene)));
  document.querySelectorAll(".td-min-chip").forEach((c) => c.addEventListener("click", () => {
    if (state === "running") pauseTimer();
    mins = Number(c.dataset.min); customInput.value = mins;
    document.querySelectorAll(".td-min-chip").forEach((x) => x.classList.toggle("active", x === c));
    resetTimer();
  }));
  customInput.addEventListener("change", () => {
    mins = Math.max(1, Math.min(180, Number(customInput.value) || 20));
    customInput.value = mins;
    document.querySelectorAll(".td-min-chip").forEach((x) => x.classList.remove("active"));
    resetTimer();
  });
  startBtn.addEventListener("click", () => (state === "running" ? pauseTimer() : startTimer()));
  document.getElementById("tdResetBtn").addEventListener("click", resetTimer);
  document.getElementById("tdBellBtn").addEventListener("click", () => playBell(0.28, 256));
  breathChk.addEventListener("change", () => { if (state === "running") updateBreath(true); });

  document.querySelectorAll(".td-method-tab").forEach((t) => t.addEventListener("click", () => {
    document.querySelectorAll(".td-method-tab").forEach((x) => x.classList.toggle("active", x === t));
    document.getElementById("tdMethodBox").textContent = METHODS[t.dataset.method];
  }));

  document.querySelectorAll(".td-sound-card input[type='range']").forEach((s) => s.addEventListener("input", (e) => setSound(e.target.dataset.sound, e.target.value)));
  document.getElementById("tdMuteBtn").addEventListener("click", () => {
    document.querySelectorAll(".td-sound-card input[type='range']").forEach((s) => { s.value = 0; setSound(s.dataset.sound, 0); });
  });

  document.getElementById("tdWorkBellBtn").addEventListener("click", (e) => {
    workBellOn = !workBellOn;
    e.target.textContent = workBellOn ? "🔔 Chuông Chánh Niệm (15p): Đang bật" : "🔔 Chuông Chánh Niệm (15p): Tắt";
    clearInterval(workBellId);
    if (workBellOn) {
      playBell(0.22, 288);
      workBellId = setInterval(() => playBell(0.22, 288), 15 * 60 * 1000);
    }
  });

  document.getElementById("tdZenBtn").addEventListener("click", () => {
    shell.classList.add("zen-active");
    document.getElementById("tdExitZenBtn").classList.remove("td-hidden");
    document.body.style.overflow = "hidden";
  });
  function exitZen() {
    shell.classList.remove("zen-active");
    document.getElementById("tdExitZenBtn").classList.add("td-hidden");
    document.body.style.overflow = "";
  }
  document.getElementById("tdExitZenBtn").addEventListener("click", exitZen);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") exitZen(); });

  document.getElementById("tdSaveNoteBtn").addEventListener("click", () => {
    const inp = document.getElementById("tdNoteInput");
    const txt = inp.value.trim();
    if (!txt) return;
    const list = JSON.parse(localStorage.getItem("lido_lib_journal") || "[]");
    list.unshift({ d: new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }), t: txt });
    localStorage.setItem("lido_lib_journal", JSON.stringify(list.slice(0, 10)));
    inp.value = "";
    renderJournal();
  });

  // Boot
  setScene(localStorage.getItem("lido_lib_scene") || "assets/sanctuary-forest.jpg");
  document.getElementById("tdMethodBox").textContent = METHODS.anapana;
  updateUI();
  renderJournal();
})();
