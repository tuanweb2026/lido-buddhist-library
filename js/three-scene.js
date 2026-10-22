/**
 * LIDO BUDDHIST LIBRARY 3D — WEBGL HERO SCENE
 * Engine: Three.js (r128) + OrbitControls
 * Hardware Target: MacBook Pro 2018 (Intel x86_64, Retina, Intel Iris Plus Graphics 655 / AMD Radeon Pro)
 * Zen Philosophy: Ánh sáng Hoàng kim, Tòa sen ngọc bích, Hào quang phổ chiếu & Bụi sáng thiền định
 */

class ZenHero3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.buddhaGroup = null;
    this.lotusGroup = null;
    this.haloGroup = null;
    this.particles = null;
    this.haloLight = null;
    this.keyLight = null;
    
    // Animation flags & state
    this.autoRotate = true;
    this.haloActive = true;
    this.animationFrameId = null;
    this.clock = new THREE.Clock();

    // Mouse parallax tracking
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetCameraX = 0;
    this.targetCameraY = 1.2;

    this.init();
  }

  isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  init() {
    if (!this.isWebGLAvailable() || typeof THREE === 'undefined') {
      console.warn('WebGL is not available or Three.js failed to load. Activating fallback.');
      this.activateFallback();
      return;
    }

    try {
      this.setupScene();
      this.setupLights();
      this.buildLotusPedestal();
      this.buildSacredBuddhaStatue();
      this.buildSacredHalo();
      this.buildZenDustParticles();
      this.setupControls();
      this.bindEvents();
      this.animate();
      console.log('LIDO 3D Zen Engine: Successfully initialized on Three.js WebGL.');
    } catch (error) {
      console.error('LIDO 3D Engine Initialization Error:', error);
      this.activateFallback();
    }
  }

  activateFallback() {
    const fallback = document.querySelector('.webgl-fallback');
    if (fallback) fallback.style.display = 'block';
  }

  setupScene() {
    this.scene = new THREE.Scene();
    // Atmospheric Thiền Môn fog: Deep Forest Black
    this.scene.fog = new THREE.FogExp2(0x060e0a, 0.045);

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Adjusted initial camera position to view Buddha slightly from right to give space for Hero typography
    this.camera.position.set(0.6, 1.3, 5.8);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    // Performance optimization for MacBook Retina: limit pixel ratio to max 2.0 to conserve GPU cycles
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.renderer.setSize(width, height);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);
  }

  setupLights() {
    // 1. Ambient Light - Soothing warm ivory glow
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.9);
    this.scene.add(ambientLight);

    // 2. Main Key Directional Light - Golden morning sun from top right
    this.keyLight = new THREE.DirectionalLight(0xffe8ba, 2.8);
    this.keyLight.position.set(4, 7, 5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.scene.add(this.keyLight);

    // 3. Rim Light - Deep Antique Gold silhouette from back left
    const rimLight = new THREE.DirectionalLight(0xd4af37, 3.0);
    rimLight.position.set(-5, 4, -4);
    this.scene.add(rimLight);

    // 4. Lotus Base Glow - Warm amber point light
    this.haloLight = new THREE.PointLight(0xffb700, 2.2, 7);
    this.haloLight.position.set(0, 0.25, 0.2);
    this.scene.add(this.haloLight);
  }

  buildLotusPedestal() {
    this.lotusGroup = new THREE.Group();

    // Material: Jade + Antique Gold blend
    const lotusMaterial = new THREE.MeshStandardMaterial({
      color: 0x153528,
      roughness: 0.35,
      metalness: 0.8,
      emissive: 0x0c2419,
      emissiveIntensity: 0.35
    });

    const petalCount = 18;
    for (let layer = 0; layer < 2; layer++) {
      const radius = 1.35 - layer * 0.28;
      const count = petalCount - layer * 3;
      const yPos = layer * 0.16;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (layer * 0.2);
        const petalGeo = new THREE.ConeGeometry(0.24, 0.58, 6);
        petalGeo.scale(1, 0.42, 1.85);

        const petal = new THREE.Mesh(petalGeo, lotusMaterial);
        petal.position.set(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius);
        petal.rotation.y = -angle - Math.PI / 2;
        petal.rotation.x = 0.58 - layer * 0.18;
        petal.castShadow = true;
        petal.receiveShadow = true;

        this.lotusGroup.add(petal);
      }
    }

    // Cylindrical base of the pedestal
    const baseGeo = new THREE.CylinderGeometry(1.45, 1.65, 0.26, 36);
    const baseMesh = new THREE.Mesh(baseGeo, lotusMaterial);
    baseMesh.position.y = -0.13;
    baseMesh.receiveShadow = true;
    this.lotusGroup.add(baseMesh);

    this.scene.add(this.lotusGroup);
  }

  buildSacredBuddhaStatue() {
    this.buddhaGroup = new THREE.Group();
    this.buddhaGroup.position.set(0.6, 0.15, 0); // Positioned slightly to the right

    // Procedural Texture Loading from verified asset
    const textureLoader = new THREE.TextureLoader();
    const buddhaTexture = textureLoader.load('assets/zen_feature_1.jpg');
    buddhaTexture.wrapS = THREE.ClampToEdgeWrapping;
    buddhaTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Golden Stele / Sculptural Icon Monolith with Beveled Framing
    const steleGeo = new THREE.BoxGeometry(2.4, 3.4, 0.14);
    
    const goldFrameMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.22,
      emissive: 0x48360d,
      emissiveIntensity: 0.28
    });

    const steleFrontMat = new THREE.MeshStandardMaterial({
      map: buddhaTexture,
      metalness: 0.18,
      roughness: 0.45,
      emissive: 0x1f190c,
      emissiveIntensity: 0.25
    });

    const steleMaterials = [
      goldFrameMat, // Right
      goldFrameMat, // Left
      goldFrameMat, // Top
      goldFrameMat, // Bottom
      steleFrontMat, // Front Face (Buddha Sacred Iconography)
      goldFrameMat  // Back
    ];

    const stele = new THREE.Mesh(steleGeo, steleMaterials);
    stele.position.y = 1.7;
    stele.castShadow = true;
    stele.receiveShadow = true;
    this.buddhaGroup.add(stele);

    this.scene.add(this.buddhaGroup);
  }

  buildSacredHalo() {
    this.haloGroup = new THREE.Group();
    this.haloGroup.position.set(0.6, 2.3, -0.12);

    const haloRingGeo = new THREE.TorusGeometry(1.05, 0.045, 16, 72);
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffb700,
      emissiveIntensity: 1.6,
      roughness: 0.12,
      metalness: 0.95
    });

    const haloRing = new THREE.Mesh(haloRingGeo, haloMat);
    this.haloGroup.add(haloRing);

    // Radiating Golden Rays (Spokes)
    const rayCount = 28;
    for (let r = 0; r < rayCount; r++) {
      const rayGeo = new THREE.CylinderGeometry(0.014, 0.004, 0.38, 8);
      const rayMesh = new THREE.Mesh(rayGeo, haloMat);
      const angle = (r / rayCount) * Math.PI * 2;
      rayMesh.position.set(Math.cos(angle) * 1.25, Math.sin(angle) * 1.25, 0);
      rayMesh.rotation.z = angle - Math.PI / 2;
      this.haloGroup.add(rayMesh);
    }

    this.scene.add(this.haloGroup);
  }

  buildZenDustParticles() {
    const particleCount = 240;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;     // X: Spread wide
      positions[i + 1] = Math.random() * 5 - 0.5;   // Y: Float upwards
      positions[i + 2] = (Math.random() - 0.5) * 6; // Z: Depth
      scales[i / 3] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffecb3,
      size: 0.065,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, particleMat);
    this.scene.add(this.particles);
  }

  setupControls() {
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.08; // Prevent looking from underground
      this.controls.minDistance = 2.5;
      this.controls.maxDistance = 9.0;
      this.controls.target.set(0.4, 1.2, 0);
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onWindowResize(), false);

    // Mouse Parallax listener
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // HUD UI Controls
    const btnHalo = document.getElementById('btn-toggle-halo');
    if (btnHalo) {
      btnHalo.addEventListener('click', () => {
        this.haloActive = !this.haloActive;
        if (this.haloGroup) this.haloGroup.visible = this.haloActive;
        if (this.haloLight) this.haloLight.intensity = this.haloActive ? 2.2 : 0.2;
        btnHalo.classList.toggle('active', this.haloActive);
      });
    }

    const btnRotate = document.getElementById('btn-toggle-rotate');
    if (btnRotate) {
      btnRotate.addEventListener('click', () => {
        this.autoRotate = !this.autoRotate;
        btnRotate.classList.toggle('active', this.autoRotate);
      });
    }

    const btnReset = document.getElementById('btn-reset-view');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (this.camera && this.controls) {
          this.camera.position.set(0.6, 1.3, 5.8);
          this.controls.target.set(0.4, 1.2, 0);
          this.controls.update();
        }
      });
    }
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // 1. Subtle Halo Rotation & Breathing Glow
    if (this.haloGroup && this.haloActive) {
      this.haloGroup.rotation.z += 0.003;
      const breathe = Math.sin(elapsedTime * 1.5) * 0.2 + 1.6;
      if (this.haloLight) this.haloLight.intensity = breathe;
    }

    // 2. Slow Zen Pedestal & Statue subtle meditation rotation
    if (this.autoRotate && this.buddhaGroup && this.lotusGroup) {
      const subtleSway = Math.sin(elapsedTime * 0.4) * 0.08;
      this.buddhaGroup.rotation.y = subtleSway;
      if (this.haloGroup) this.haloGroup.rotation.y = subtleSway * 0.5;
    }

    // 3. Ambient Zen Dust Particles Floating
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += 0.003; // Drift upwards
        if (positions[i] > 4.5) positions[i] = -0.5; // Loop back
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Smooth Parallax & Controls Damping
    if (this.controls) {
      this.controls.update();
    } else if (this.camera) {
      this.camera.position.x += (this.mouseX * 0.4 + 0.6 - this.camera.position.x) * 0.03;
      this.camera.position.y += (-this.mouseY * 0.25 + 1.3 - this.camera.position.y) * 0.03;
      this.camera.lookAt(0.4, 1.2, 0);
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.dispose();
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

// Export for app.js
window.ZenHero3D = ZenHero3D;
