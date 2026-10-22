/**
 * LIDO BUDDHIST LIBRARY 3D — CINEMATIC 3D SACRED SANCTUARY ENGINE V2
 * Upgrades:
 * - 16:9 Standardized 1920x1080 Spatial Monolith Billboard with Exact Aspect Ratio (No distortion / stretch)
 * - Ultra Sharp LinearMipmapLinear Filtering (Crystal clear on Retina displays)
 * - Immersive 3D Gallery: Golden Sanctum Base, Ambient Candle/Lotus Lights, Floating Sacred Petals & Dust
 * - Full-fidelity Depth Parallax (Mouse drag orbit + Gyro float)
 * - Auto-Transition smoothly every 5 seconds with countdown timer
 */

class SacredLabyrinth3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.sitesData = [];
    this.currentIndex = 0;
    this.autoPlay = true;
    this.transitionDuration = 10000; // 10s per slide
    this.timerProgress = 0;
    this.progressInterval = null;

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    // 3D Visual Mesh
    this.monolithScreen = null;
    this.frameMesh = null;
    this.sanctuaryMaterial = null;
    this.particles = null;
    this.lotusGroup = null;
    this.altarGroup = null;
    this.pointLight = null;
    this.warmKeyLight = null;
    this.textureLoader = new THREE.TextureLoader();
    this.textures = {};

    // Interaction State
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetCameraX = 0;
    this.targetCameraY = 0;
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.dragRotation = { x: 0, y: 0 };

    this.init();
  }

  async init() {
    try {
      const res = await fetch('data/sacred_3d_sites.json');
      this.sitesData = await res.json();
      this.setupThreeScene();
      this.buildSacredMonolithScreen();
      this.buildGoldenAltar();
      this.buildSacredAtmosphere();
      this.bindEvents();
      this.loadSite(0);
      this.startTimer();
      this.animate();
      console.log('SacredLabyrinth3D V2: Crystal-clear 16:9 3D Sanctum loaded.');
    } catch (e) {
      console.error('Failed to init SacredLabyrinth3D:', e);
    }
  }

  setupThreeScene() {
    this.scene = new THREE.Scene();
    // Atmospheric dark forest green fog (deep, doesn't blur foreground)
    this.scene.fog = new THREE.FogExp2(0x060e0a, 0.02);

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Adjusted Camera for perfect view of 16:9 3D screen
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 5.2);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    // Set devicePixelRatio for Retina crispness
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.renderer.setSize(width, height);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Warm Directional Key Light from top-front
    this.warmKeyLight = new THREE.DirectionalLight(0xfff6e6, 2.2);
    this.warmKeyLight.position.set(3, 5, 6);
    this.scene.add(this.warmKeyLight);

    // Soft Ambient fill
    const ambientLight = new THREE.AmbientLight(0xffecd1, 0.9);
    this.scene.add(ambientLight);

    // Golden Halo Point Light centered below screen
    this.pointLight = new THREE.PointLight(0xffb700, 2.0, 10);
    this.pointLight.position.set(0, -1.2, 2.0);
    this.scene.add(this.pointLight);
  }

  buildSacredMonolithScreen() {
    // 16:9 Proportional 3D Billboard (Width = 4.8, Height = 2.7 -> 16:9 exact ratio)
    const screenW = 4.8;
    const screenH = 2.7;
    const planeGeo = new THREE.PlaneGeometry(screenW, screenH, 32, 18);

    // Material setup: Emissive helps keep image vibrant and luminous
    this.sanctuaryMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.05,
      emissive: 0x1a160f,
      emissiveIntensity: 0.35,
      side: THREE.FrontSide
    });

    this.monolithScreen = new THREE.Mesh(planeGeo, this.sanctuaryMaterial);
    this.monolithScreen.position.set(0, 0.55, 0);
    this.scene.add(this.monolithScreen);

    // =========================================================================
    // 4 KHUNG VIỀN CÂY BỒ ĐỀ (SACRED BODHI VINE FRAME OVERLAY)
    // =========================================================================
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/bodhi_vine_frame_16_9.png', (bodhiTexture) => {
      bodhiTexture.generateMipmaps = true;
      bodhiTexture.minFilter = THREE.LinearMipmapLinearFilter;
      if (this.renderer.capabilities.getMaxAnisotropy) {
        bodhiTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      }

      // Slightly larger plane in front of the image to gracefully frame the 16:9 canvas
      const frameGeo = new THREE.PlaneGeometry(screenW + 0.16, screenH + 0.16);
      const frameMat = new THREE.MeshStandardMaterial({
        map: bodhiTexture,
        transparent: true,
        alphaTest: 0.05,
        roughness: 0.25,
        metalness: 0.85,
        emissive: 0x423108,
        emissiveIntensity: 0.35,
        side: THREE.DoubleSide
      });

      const bodhiFrameMesh = new THREE.Mesh(frameGeo, frameMat);
      bodhiFrameMesh.position.set(0, 0, 0.02); // Just in front of the holy photo
      this.monolithScreen.add(bodhiFrameMesh);
    });

    // Outer backing border for physical 3D depth
    const frameGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x8a6218,
      metalness: 0.9,
      roughness: 0.3,
      emissive: 0x2e1e05,
      emissiveIntensity: 0.2
    });

    const borderThick = 0.06;
    const depth = 0.08;

    const topGeo = new THREE.BoxGeometry(screenW + borderThick * 2, borderThick, depth);
    const topBar = new THREE.Mesh(topGeo, frameMat);
    topBar.position.set(0, screenH / 2 + borderThick / 2, -0.01);
    frameGroup.add(topBar);

    const botBar = new THREE.Mesh(topGeo, frameMat);
    botBar.position.set(0, -screenH / 2 - borderThick / 2, -0.01);
    frameGroup.add(botBar);

    const sideGeo = new THREE.BoxGeometry(borderThick, screenH, depth);
    const leftBar = new THREE.Mesh(sideGeo, frameMat);
    leftBar.position.set(-screenW / 2 - borderThick / 2, 0, -0.01);
    frameGroup.add(leftBar);

    const rightBar = new THREE.Mesh(sideGeo, frameMat);
    rightBar.position.set(screenW / 2 + borderThick / 2, 0, -0.01);
    frameGroup.add(rightBar);

    this.monolithScreen.add(frameGroup);
  }

  buildGoldenAltar() {
    this.altarGroup = new THREE.Group();
    this.altarGroup.position.set(0, -1.05, 0.5);

    // Stepped Altar Pedestal (Deep Jade with Gilded Edges)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f241a,
      metalness: 0.85,
      roughness: 0.3,
      emissive: 0x05130b,
      emissiveIntensity: 0.2
    });

    const step1Geo = new THREE.BoxGeometry(4.2, 0.16, 1.2);
    const step1 = new THREE.Mesh(step1Geo, baseMat);
    this.altarGroup.add(step1);

    const step2Geo = new THREE.BoxGeometry(3.6, 0.12, 0.9);
    const step2 = new THREE.Mesh(step2Geo, baseMat);
    step2.position.y = 0.14;
    this.altarGroup.add(step2);

    // =========================================================================
    // ĐÀI HOA SEN VÀNG NHIỀU TẦNG CỰC ĐẸP (ORNATE 3-TIER GOLDEN LOTUS FLOWER)
    // =========================================================================
    this.lotusGroup = new THREE.Group();
    this.lotusGroup.position.set(0, 0.22, 0);

    // Gilded lotus material (warm radiant gold)
    const lotusMatOuter = new THREE.MeshStandardMaterial({
      color: 0xe5c378,
      metalness: 0.92,
      roughness: 0.18,
      emissive: 0x6e4e10,
      emissiveIntensity: 0.45
    });

    const lotusMatInner = new THREE.MeshStandardMaterial({
      color: 0xffe6a3,
      metalness: 0.95,
      roughness: 0.12,
      emissive: 0x9e731b,
      emissiveIntensity: 0.6
    });

    // Helper function to create realistic curved lotus petal
    const createPetalGeometry = (width, length, curve) => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.quadraticCurveTo(width * 0.7, length * 0.35, width * 0.5, length * 0.75);
      shape.quadraticCurveTo(width * 0.2, length, 0, length * 1.05); // Lotus pointed tip
      shape.quadraticCurveTo(-width * 0.2, length, -width * 0.5, length * 0.75);
      shape.quadraticCurveTo(-width * 0.7, length * 0.35, 0, 0);

      const extrudeSettings = {
        depth: 0.025,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 2,
        bevelSize: 0.018,
        bevelThickness: 0.018
      };
      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.center();
      return geo;
    };

    // Tier 1: Outer blooming tier (16 large spreading petals)
    const tier1Count = 16;
    const tier1Geo = createPetalGeometry(0.18, 0.42, 0.4);
    for (let i = 0; i < tier1Count; i++) {
      const angle = (i / tier1Count) * Math.PI * 2;
      const petal = new THREE.Mesh(tier1Geo, lotusMatOuter);
      petal.position.set(Math.cos(angle) * 0.42, 0.04, Math.sin(angle) * 0.42);
      petal.rotation.y = -angle - Math.PI / 2;
      petal.rotation.x = 1.15; // Flaring outward
      this.lotusGroup.add(petal);
    }

    // Tier 2: Middle ascending tier (12 medium upright petals)
    const tier2Count = 12;
    const tier2Geo = createPetalGeometry(0.15, 0.35, 0.3);
    for (let i = 0; i < tier2Count; i++) {
      const angle = ((i + 0.5) / tier2Count) * Math.PI * 2;
      const petal = new THREE.Mesh(tier2Geo, lotusMatInner);
      petal.position.set(Math.cos(angle) * 0.28, 0.10, Math.sin(angle) * 0.28);
      petal.rotation.y = -angle - Math.PI / 2;
      petal.rotation.x = 0.68; // Cupping upward
      this.lotusGroup.add(petal);
    }

    // Tier 3: Inner sacred bud tier (8 tender luminous petals)
    const tier3Count = 8;
    const tier3Geo = createPetalGeometry(0.12, 0.26, 0.2);
    for (let i = 0; i < tier3Count; i++) {
      const angle = (i / tier3Count) * Math.PI * 2;
      const petal = new THREE.Mesh(tier3Geo, lotusMatInner);
      petal.position.set(Math.cos(angle) * 0.15, 0.16, Math.sin(angle) * 0.15);
      petal.rotation.y = -angle - Math.PI / 2;
      petal.rotation.x = 0.32; // Tightly cradling center
      this.lotusGroup.add(petal);
    }

    // Central Sacred Lotus Receptacle (Gương sen vàng với hạt ngọc)
    const podGeo = new THREE.CylinderGeometry(0.14, 0.10, 0.12, 24);
    const podMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.96,
      roughness: 0.1,
      emissive: 0xb58900,
      emissiveIntensity: 0.7
    });
    const pod = new THREE.Mesh(podGeo, podMat);
    pod.position.y = 0.16;
    this.lotusGroup.add(pod);

    // Glowing Lotus Gem in center (Ngọc Thiền phát quang)
    const gemGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const gemMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    gem.position.y = 0.23;
    this.lotusGroup.add(gem);

    this.altarGroup.add(this.lotusGroup);
    this.scene.add(this.altarGroup);
  }

  buildSacredAtmosphere() {
    const pCount = 200;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 9;
      pos[i + 1] = (Math.random() - 0.5) * 5;
      pos[i + 2] = (Math.random() - 0.5) * 6;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffe28a,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  loadSite(index) {
    if (!this.sitesData.length) return;
    this.currentIndex = (index + this.sitesData.length) % this.sitesData.length;
    const current = this.sitesData[this.currentIndex];

    // Texture Loading with Sharp Filtering
    const imagePath = current.image;
    if (!this.textures[imagePath]) {
      this.textureLoader.load(imagePath, (tex) => {
        // High fidelity texture settings for MacBook Retina
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = Math.min(this.renderer.capabilities.getMaxAnisotropy(), 8);
        this.textures[imagePath] = tex;
        this.applyTexture(tex);
      });
    } else {
      this.applyTexture(this.textures[imagePath]);
    }

    // Camera Gentle Glide Transition
    if (this.camera) {
      this.camera.position.z = 5.6; // Slight pull-back then glide forward to 5.2
    }

    this.updateHUD(current);
    this.resetTimerProgress();
  }

  applyTexture(tex) {
    if (this.sanctuaryMaterial) {
      this.sanctuaryMaterial.map = tex;
      this.sanctuaryMaterial.needsUpdate = true;
    }
  }

  updateHUD(item) {
    const badgeSite = document.getElementById('hud-site-badge');
    const titleEl = document.getElementById('hud-site-title');
    const descEl = document.getElementById('hud-site-desc');
    const periodEl = document.getElementById('hud-site-period');
    const counterEl = document.getElementById('hud-site-counter');
    const heroBgEl = document.getElementById('hero-spatial-bg');

    if (badgeSite) badgeSite.textContent = `📍 ${item.site}`;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.desc;
    if (periodEl) periodEl.textContent = `✨ ${item.period}`;
    if (counterEl) counterEl.textContent = `${this.currentIndex + 1} / ${this.sitesData.length}`;

    if (heroBgEl) {
      heroBgEl.style.backgroundImage = `url('${item.image}')`;
    }

    // Highlight active fast travel tab based on currentIndex
    const tabs = document.querySelectorAll('.site-pill-btn');
    tabs.forEach((btn, i) => {
      const curStart = parseInt(btn.dataset.start);
      const nextBtn = tabs[i + 1];
      const nextStart = nextBtn ? parseInt(nextBtn.dataset.start) : Infinity;
      const isActive = this.currentIndex >= curStart && this.currentIndex < nextStart;
      btn.classList.toggle('active', isActive);
    });
  }

  startTimer() {
    this.stopTimer();
    this.progressInterval = setInterval(() => {
      if (!this.autoPlay) return;
      this.timerProgress += 50;
      const pct = Math.min((this.timerProgress / this.transitionDuration) * 100, 100);
      const progressBar = document.getElementById('hud-timer-progress');
      if (progressBar) progressBar.style.width = `${pct}%`;

      if (this.timerProgress >= this.transitionDuration) {
        this.nextSite();
      }
    }, 50);
  }

  resetTimerProgress() {
    this.timerProgress = 0;
    const progressBar = document.getElementById('hud-timer-progress');
    if (progressBar) progressBar.style.width = '0%';
  }

  stopTimer() {
    if (this.progressInterval) clearInterval(this.progressInterval);
  }

  nextSite() {
    this.loadSite(this.currentIndex + 1);
  }

  prevSite() {
    this.loadSite(this.currentIndex - 1);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize(), false);

    // Mouse movement parallax (smooth floating response)
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Orbit drag on canvas
    this.container.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.prevMouse.x;
        const dy = e.clientY - this.prevMouse.y;
        this.dragRotation.y += dx * 0.004;
        this.dragRotation.x += dy * 0.0025;
        this.dragRotation.x = Math.max(-0.25, Math.min(0.25, this.dragRotation.x));
        this.dragRotation.y = Math.max(-0.45, Math.min(0.45, this.dragRotation.y));
        this.prevMouse = { x: e.clientX, y: e.clientY };
      }
    });

    // Navigation UI
    const btnNext = document.getElementById('btn-labyrinth-next');
    if (btnNext) btnNext.addEventListener('click', () => this.nextSite());

    const btnPrev = document.getElementById('btn-labyrinth-prev');
    if (btnPrev) btnPrev.addEventListener('click', () => this.prevSite());

    const btnAuto = document.getElementById('btn-labyrinth-autoplay');
    if (btnAuto) {
      btnAuto.addEventListener('click', () => {
        this.autoPlay = !this.autoPlay;
        btnAuto.classList.toggle('active', this.autoPlay);
        btnAuto.textContent = this.autoPlay ? '⏸ Dừng Tự Động' : '▶ Tự Động (10s)';
      });
    }

    document.querySelectorAll('.site-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const startIdx = parseInt(btn.dataset.start);
        if (!isNaN(startIdx)) {
          this.loadSite(startIdx);
        }
      });
    });
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Smooth Camera Glide into the Sanctum
    if (this.camera) {
      this.camera.position.z += (5.2 - this.camera.position.z) * 0.05;

      // Parallax rotation combining gentle gyro mouse + user drag
      const targetY = this.dragRotation.y + this.mouseX * 0.08;
      const targetX = this.dragRotation.x - this.mouseY * 0.05;

      this.camera.rotation.y += (targetY - this.camera.rotation.y) * 0.05;
      this.camera.rotation.x += (targetX - this.camera.rotation.x) * 0.05;
    }

    // 2. Subtle Monolith Breathing Tilt
    if (this.monolithScreen) {
      this.monolithScreen.position.y = 0.55 + Math.sin(elapsedTime * 0.8) * 0.02;
    }

    // 3. Ambient Lotus Candle Light Pulsing & Gentle Lotus Rotation
    if (this.lotusGroup) {
      this.lotusGroup.rotation.y = elapsedTime * 0.08; // Serene meditative slow rotation
    }

    if (this.pointLight) {
      this.pointLight.intensity = 2.0 + Math.sin(elapsedTime * 2.2) * 0.4;
    }

    // 4. Sacred Floating Dust
    if (this.particles) {
      const pos = this.particles.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += 0.002;
        if (pos[i] > 2.5) pos[i] = -2.5;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.SacredLabyrinth3D = SacredLabyrinth3D;
