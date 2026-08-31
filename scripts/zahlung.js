/* =========================
   Just A Buck – Zahlung Scanner Animation
   Adapted from Evervault-style card scanner
   ========================= */

const codeChars =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";

const PAYMENT_COLORS = Object.freeze({
  brand: "#6A35A5",
  brandStrong: "#542A84",
  ink: "#21171D",
  white: "#FFFFFF",
  brandRgb: "106, 53, 165"
});

class CardStreamController {
  constructor() {
    this.container = document.getElementById("cardStream");
    this.cardLine = document.getElementById("cardLine");
    if (!this.container || !this.cardLine) return;

    this.heroEl = document.querySelector(".scanner-hero-container");

    this.position = 0;
    this.velocity = 120;
    this.direction = -1;
    this.isAnimating = true;
    this.isDragging = false;

    this.lastTime = performance.now();
    this.lastMouseX = 0;
    this.mouseVelocity = 0;
    this.friction = 0.95;
    this.minVelocity = 30;

    this.containerWidth = 0;
    this.cardLineWidth = 0;

    this.init();
  }

  init() {
    this.populateCardLine();
    this.calculateDimensions();
    this.setupEventListeners();
    this.updateCardPosition();
    this.animate();
    this.startPeriodicUpdates();
  }

  getHeroWidth() {
    return this.heroEl ? this.heroEl.offsetWidth : window.innerWidth;
  }

  getHeroCenter() {
    if (!this.heroEl) return window.innerWidth / 2;
    var rect = this.heroEl.getBoundingClientRect();
    return rect.left + rect.width / 2;
  }

  calculateDimensions() {
    this.containerWidth = this.getHeroWidth();
    var cardWidth = 360;
    var cardGap = 50;
    var cardCount = this.cardLine.children.length;
    this.cardLineWidth = (cardWidth + cardGap) * cardCount;
  }

  setupEventListeners() {
    this.cardLine.addEventListener("mousedown", function(e) { this.startDrag(e); }.bind(this));
    document.addEventListener("mousemove", function(e) { this.onDrag(e); }.bind(this));
    document.addEventListener("mouseup", function() { this.endDrag(); }.bind(this));

    this.cardLine.addEventListener("touchstart", function(e) { this.startDrag(e.touches[0]); }.bind(this), { passive: false });
    document.addEventListener("touchmove", function(e) { this.onDrag(e.touches[0]); }.bind(this), { passive: false });
    document.addEventListener("touchend", function() { this.endDrag(); }.bind(this));

    this.cardLine.addEventListener("wheel", function(e) { this.onWheel(e); }.bind(this));
    this.cardLine.addEventListener("selectstart", function(e) { e.preventDefault(); });
    this.cardLine.addEventListener("dragstart", function(e) { e.preventDefault(); });

    window.addEventListener("resize", function() { this.calculateDimensions(); }.bind(this));
  }

  startDrag(e) {
    e.preventDefault();
    this.isDragging = true;
    this.isAnimating = false;
    this.lastMouseX = e.clientX;
    this.mouseVelocity = 0;

    var transform = window.getComputedStyle(this.cardLine).transform;
    if (transform !== "none") {
      var matrix = new DOMMatrix(transform);
      this.position = matrix.m41;
    }

    this.cardLine.style.animation = "none";
    this.cardLine.classList.add("dragging");
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  }

  onDrag(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    var deltaX = e.clientX - this.lastMouseX;
    this.position += deltaX;
    this.mouseVelocity = deltaX * 60;
    this.lastMouseX = e.clientX;
    this.cardLine.style.transform = "translateX(" + this.position + "px)";
    this.updateCardClipping();
  }

  endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.cardLine.classList.remove("dragging");

    if (Math.abs(this.mouseVelocity) > this.minVelocity) {
      this.velocity = Math.abs(this.mouseVelocity);
      this.direction = this.mouseVelocity > 0 ? 1 : -1;
    } else {
      this.velocity = 120;
    }

    this.isAnimating = true;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }

  animate() {
    var currentTime = performance.now();
    var deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (this.isAnimating && !this.isDragging) {
      if (this.velocity > this.minVelocity) {
        this.velocity *= this.friction;
      } else {
        this.velocity = Math.max(this.minVelocity, this.velocity);
      }
      this.position += this.velocity * this.direction * deltaTime;
      this.updateCardPosition();
    }

    requestAnimationFrame(function() { this.animate(); }.bind(this));
  }

  updateCardPosition() {
    var cw = this.containerWidth;
    var lw = this.cardLineWidth;

    if (this.position < -lw) {
      this.position = cw;
    } else if (this.position > cw) {
      this.position = -lw;
    }

    this.cardLine.style.transform = "translateX(" + this.position + "px)";
    this.updateCardClipping();
  }

  generateCode(width, height) {
    var randInt = function(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };
    var pick = function(arr) { return arr[randInt(0, arr.length - 1)]; };

    var library = [
      "// compiled preview - scanner demo",
      "const SCAN_WIDTH = 8;",
      "const FADE_ZONE = 35;",
      "const MAX_PARTICLES = 2500;",
      "function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }",
      "function lerp(a, b, t) { return a + (b - a) * t; }",
      "const now = () => performance.now();",
      "class Particle { constructor(x, y) { this.x = x; this.y = y; } }",
      "const scanner = { x: Math.floor(w / 2), width: 8, glow: 3.5 };",
      "function drawParticle(ctx, p) { ctx.globalAlpha = p.a; }",
      "function tick(t) { const dt = 0.016; }",
      "const state = { intensity: 1.2, particles: 800 };",
      "ctx.globalCompositeOperation = 'lighter';",
      "const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);",
      "for (let i = 0; i < count; i++) { update(particles[i]); }",
      "requestAnimationFrame(tick);",
    ];

    for (var i = 0; i < 30; i++) {
      library.push("const v" + i + " = (" + randInt(1,9) + " + " + randInt(10,99) + ") * 0." + randInt(1,9) + ";");
    }

    var flow = library.join(" ").replace(/\s+/g, " ").trim();
    var totalChars = width * height;
    while (flow.length < totalChars + width) {
      flow += " " + pick(library).replace(/\s+/g, " ").trim();
    }

    var out = "";
    var offset = 0;
    for (var row = 0; row < height; row++) {
      var line = flow.slice(offset, offset + width);
      if (line.length < width) line = line + " ".repeat(width - line.length);
      out += line + (row < height - 1 ? "\n" : "");
      offset += width;
    }
    return out;
  }

  calculateCodeDimensions(cardWidth, cardHeight) {
    return { width: Math.floor(cardWidth / 6), height: Math.floor(cardHeight / 13), fontSize: 11, lineHeight: 13 };
  }

  createCardWrapper(index) {
    var wrapper = document.createElement("div");
    wrapper.className = "sh-card-wrapper";

    var normalCard = document.createElement("div");
    normalCard.className = "sh-card sh-card-normal";

    // Generate gradient card image
    var canvas = document.createElement("canvas");
    canvas.width = 360;
    canvas.height = 220;
    var ctx = canvas.getContext("2d");

    var gradients = [
      [PAYMENT_COLORS.brand, PAYMENT_COLORS.brandStrong],
      [PAYMENT_COLORS.brandStrong, PAYMENT_COLORS.ink],
      [PAYMENT_COLORS.brand, PAYMENT_COLORS.ink],
      [PAYMENT_COLORS.ink, PAYMENT_COLORS.brand],
      [PAYMENT_COLORS.brandStrong, PAYMENT_COLORS.brand],
      [PAYMENT_COLORS.brand, PAYMENT_COLORS.brandStrong],
      [PAYMENT_COLORS.ink, PAYMENT_COLORS.brandStrong],
      [PAYMENT_COLORS.brandStrong, PAYMENT_COLORS.ink],
    ];

    var pair = gradients[index % gradients.length];
    var grad = ctx.createLinearGradient(0, 0, 360, 220);
    grad.addColorStop(0, pair[0]);
    grad.addColorStop(1, pair[1]);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, 360, 220, 15);
    ctx.fill();

    // Add chip
    ctx.fillStyle = "rgba(255,255,255,.15)";
    ctx.beginPath();
    ctx.roundRect(25, 75, 40, 30, 5);
    ctx.fill();

    // Add logo text
    ctx.font = "bold 14px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,.7)";
    ctx.fillText("JUST A BUCK", 25, 50);

    // Add card number
    ctx.font = "600 18px 'Space Grotesk', monospace";
    ctx.fillStyle = "rgba(255,255,255,.6)";
    ctx.fillText("•••• •••• •••• " + (1000 + index * 111), 25, 145);

    // Add payment label
    var labels = ["VISA", "MASTERCARD", "PAYPAL", "BTC", "ETH", "SOL", "USDT", "LTC"];
    ctx.font = "bold 12px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,.5)";
    ctx.textAlign = "right";
    ctx.fillText(labels[index % labels.length], 335, 200);
    ctx.textAlign = "left";

    var cardImage = document.createElement("img");
    cardImage.className = "sh-card-image";
    cardImage.src = canvas.toDataURL();
    cardImage.alt = "Payment Card";
    normalCard.appendChild(cardImage);

    var asciiCard = document.createElement("div");
    asciiCard.className = "sh-card sh-card-ascii";

    var asciiContent = document.createElement("div");
    asciiContent.className = "sh-ascii-content";

    var dims = this.calculateCodeDimensions(360, 220);
    asciiContent.style.fontSize = dims.fontSize + "px";
    asciiContent.style.lineHeight = dims.lineHeight + "px";
    asciiContent.textContent = this.generateCode(dims.width, dims.height);

    asciiCard.appendChild(asciiContent);
    wrapper.appendChild(normalCard);
    wrapper.appendChild(asciiCard);

    return wrapper;
  }

  updateCardClipping() {
    var scannerX = this.getHeroCenter();
    var scannerWidth = 8;
    var sLeft = scannerX - scannerWidth / 2;
    var sRight = scannerX + scannerWidth / 2;
    var anyScanningActive = false;

    var wrappers = document.querySelectorAll(".sh-card-wrapper");
    for (var i = 0; i < wrappers.length; i++) {
      var wrapper = wrappers[i];
      var rect = wrapper.getBoundingClientRect();
      var cardLeft = rect.left;
      var cardRight = rect.right;
      var cardWidth = rect.width;

      var normalCard = wrapper.querySelector(".sh-card-normal");
      var asciiCard = wrapper.querySelector(".sh-card-ascii");

      if (cardLeft < sRight && cardRight > sLeft) {
        anyScanningActive = true;
        var intersectLeft = Math.max(sLeft - cardLeft, 0);
        var intersectRight = Math.min(sRight - cardLeft, cardWidth);

        var normalClipRight = (intersectLeft / cardWidth) * 100;
        var asciiClipLeft = (intersectRight / cardWidth) * 100;

        normalCard.style.setProperty("--clip-right", normalClipRight + "%");
        asciiCard.style.setProperty("--clip-left", asciiClipLeft + "%");

        if (!wrapper.hasAttribute("data-scanned") && intersectLeft > 0) {
          wrapper.setAttribute("data-scanned", "true");
          var scanEffect = document.createElement("div");
          scanEffect.className = "sh-scan-effect";
          wrapper.appendChild(scanEffect);
          setTimeout(function(el) {
            if (el.parentNode) el.parentNode.removeChild(el);
          }, 600, scanEffect);
        }
      } else {
        if (cardRight < sLeft) {
          normalCard.style.setProperty("--clip-right", "100%");
          asciiCard.style.setProperty("--clip-left", "100%");
        } else if (cardLeft > sRight) {
          normalCard.style.setProperty("--clip-right", "0%");
          asciiCard.style.setProperty("--clip-left", "0%");
        }
        wrapper.removeAttribute("data-scanned");
      }
    }

    if (window.setScannerScanning) {
      window.setScannerScanning(anyScanningActive);
    }
  }

  updateAsciiContent() {
    var self = this;
    var contents = document.querySelectorAll(".sh-ascii-content");
    for (var i = 0; i < contents.length; i++) {
      if (Math.random() < 0.15) {
        var dims = self.calculateCodeDimensions(360, 220);
        contents[i].textContent = self.generateCode(dims.width, dims.height);
      }
    }
  }

  populateCardLine() {
    this.cardLine.innerHTML = "";
    for (var i = 0; i < 20; i++) {
      this.cardLine.appendChild(this.createCardWrapper(i));
    }
  }

  startPeriodicUpdates() {
    var self = this;
    setInterval(function() { self.updateAsciiContent(); }, 200);

    var updateClipping = function() {
      self.updateCardClipping();
      requestAnimationFrame(updateClipping);
    };
    updateClipping();
  }

  onWheel(e) {
    e.preventDefault();
    this.position += (e.deltaY > 0 ? 20 : -20);
    this.updateCardPosition();
    this.updateCardClipping();
  }
}


/* ---- Particle System (Three.js) ---- */

class ZahlungParticleSystem {
  constructor() {
    this.canvas = document.getElementById("particleCanvas");
    if (!this.canvas || typeof THREE === "undefined") return;

    this.heroEl = document.querySelector(".scanner-hero-container");
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.particleCount = 300;
    this.velocities = null;
    this.alphas = null;

    this.init();
  }

  getWidth() { return this.heroEl ? this.heroEl.offsetWidth : window.innerWidth; }
  getHeight() { return 220; }

  init() {
    var w = this.getWidth();
    var h = this.getHeight();

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 1, 1000);
    this.camera.position.z = 100;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setClearColor(0x000000, 0);

    this.createParticles();
    this.animate();
    window.addEventListener("resize", function() { this.onResize(); }.bind(this));
  }

  createParticles() {
    var w = this.getWidth();
    var h = this.getHeight();

    var geo = new THREE.BufferGeometry();
    var positions = new Float32Array(this.particleCount * 3);
    var colors = new Float32Array(this.particleCount * 3);
    var sizes = new Float32Array(this.particleCount);
    var velocities = new Float32Array(this.particleCount);

    var texCanvas = document.createElement("canvas");
    texCanvas.width = 100;
    texCanvas.height = 100;
    var ctx = texCanvas.getContext("2d");
    var half = 50;

    var gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0.025, PAYMENT_COLORS.white);
    gradient.addColorStop(0.1, PAYMENT_COLORS.brand);
    gradient.addColorStop(0.25, PAYMENT_COLORS.ink);
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(half, half, half, 0, Math.PI * 2);
    ctx.fill();

    var texture = new THREE.CanvasTexture(texCanvas);

    for (var i = 0; i < this.particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * w * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * h;
      positions[i * 3 + 2] = 0;
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
      sizes[i] = (Math.random() * 140 + 60) / 8;
      velocities[i] = Math.random() * 60 + 30;
    }

    this.velocities = velocities;

    var alphas = new Float32Array(this.particleCount);
    for (var i = 0; i < this.particleCount; i++) {
      alphas[i] = (Math.random() * 8 + 2) / 10;
    }
    this.alphas = alphas;

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    var mat = new THREE.ShaderMaterial({
      uniforms: { pointTexture: { value: texture }, size: { value: 15.0 } },
      vertexShader: [
        "attribute float alpha;",
        "varying float vAlpha;",
        "varying vec3 vColor;",
        "uniform float size;",
        "void main() {",
        "  vAlpha = alpha;",
        "  vColor = color;",
        "  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
        "  gl_PointSize = size;",
        "  gl_Position = projectionMatrix * mvPosition;",
        "}"
      ].join("\n"),
      fragmentShader: [
        "uniform sampler2D pointTexture;",
        "varying float vAlpha;",
        "varying vec3 vColor;",
        "void main() {",
        "  gl_FragColor = vec4(vColor, vAlpha) * texture2D(pointTexture, gl_PointCoord);",
        "}"
      ].join("\n"),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  animate() {
    requestAnimationFrame(function() { this.animate(); }.bind(this));
    if (!this.particles) return;

    var w = this.getWidth();
    var positions = this.particles.geometry.attributes.position.array;
    var alphas = this.particles.geometry.attributes.alpha.array;
    var time = Date.now() * 0.001;

    for (var i = 0; i < this.particleCount; i++) {
      positions[i * 3] += this.velocities[i] * 0.016;
      if (positions[i * 3] > w / 2 + 100) {
        positions[i * 3] = -w / 2 - 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * this.getHeight();
      }
      positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5;

      var twinkle = Math.floor(Math.random() * 10);
      if (twinkle === 1 && alphas[i] > 0) alphas[i] -= 0.05;
      else if (twinkle === 2 && alphas[i] < 1) alphas[i] += 0.05;
      alphas[i] = Math.max(0, Math.min(1, alphas[i]));
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
    this.particles.geometry.attributes.alpha.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    var w = this.getWidth();
    var h = this.getHeight();
    this.camera.left = -w / 2;
    this.camera.right = w / 2;
    this.camera.top = h / 2;
    this.camera.bottom = -h / 2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }
}


/* ---- Scanner Line Particles (Canvas 2D) ---- */

class ZahlungParticleScanner {
  constructor() {
    this.canvas = document.getElementById("scannerCanvas");
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.heroEl = document.querySelector(".scanner-hero-container");
    this.animationId = null;

    this.w = this.getWidth();
    this.h = 280;
    this.particles = [];
    this.count = 0;
    this.maxParticles = 600;
    this.intensity = 0.8;
    this.lightBarWidth = 3;
    this.fadeZone = 50;

    this.scanTargetIntensity = 1.8;
    this.scanTargetParticles = 2000;
    this.scanTargetFadeZone = 30;
    this.scanningActive = false;

    this.baseIntensity = this.intensity;
    this.baseMaxParticles = this.maxParticles;
    this.baseFadeZone = this.fadeZone;
    this.currentIntensity = this.intensity;
    this.currentMaxParticles = this.maxParticles;
    this.currentFadeZone = this.fadeZone;
    this.currentGlowIntensity = 1;
    this.transitionSpeed = 0.05;

    this.gradientCanvas = null;
    this.gradientCtx = null;

    this.setupCanvas();
    this.createGradientCache();
    this.initParticles();
    this.animate();
    window.addEventListener("resize", function() { this.onResize(); }.bind(this));
  }

  getWidth() { return this.heroEl ? this.heroEl.offsetWidth : window.innerWidth; }
  getLightBarX() { return this.getWidth() / 2; }

  setupCanvas() {
    this.w = this.getWidth();
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.canvas.style.width = this.w + "px";
    this.canvas.style.height = this.h + "px";
    this.ctx.clearRect(0, 0, this.w, this.h);
  }

  onResize() {
    this.w = this.getWidth();
    this.setupCanvas();
  }

  createGradientCache() {
    this.gradientCanvas = document.createElement("canvas");
    this.gradientCtx = this.gradientCanvas.getContext("2d");
    this.gradientCanvas.width = 16;
    this.gradientCanvas.height = 16;

    var half = 8;
    var gradient = this.gradientCtx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(" + PAYMENT_COLORS.brandRgb + ", 0.8)");
    gradient.addColorStop(0.7, "rgba(" + PAYMENT_COLORS.brandRgb + ", 0.4)");
    gradient.addColorStop(1, "transparent");

    this.gradientCtx.fillStyle = gradient;
    this.gradientCtx.beginPath();
    this.gradientCtx.arc(half, half, half, 0, Math.PI * 2);
    this.gradientCtx.fill();
  }

  randomFloat(min, max) { return Math.random() * (max - min) + min; }

  createParticle() {
    var lbx = this.getLightBarX();
    var ratio = this.intensity / this.baseIntensity;
    var spd = 1 + (ratio - 1) * 1.2;
    var sz = 1 + (ratio - 1) * 0.7;

    return {
      x: lbx + this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2),
      y: this.randomFloat(0, this.h),
      vx: this.randomFloat(0.2, 1.0) * spd,
      vy: this.randomFloat(-0.15, 0.15) * spd,
      radius: this.randomFloat(0.4, 1) * sz,
      alpha: this.randomFloat(0.6, 1),
      decay: this.randomFloat(0.005, 0.025) * (2 - ratio * 0.5),
      originalAlpha: 0,
      life: 1.0,
      time: 0,
      twinkleSpeed: this.randomFloat(0.02, 0.08) * spd,
      twinkleAmount: this.randomFloat(0.1, 0.25)
    };
  }

  initParticles() {
    for (var i = 0; i < this.maxParticles; i++) {
      var p = this.createParticle();
      p.originalAlpha = p.alpha;
      this.count++;
      this.particles[this.count] = p;
    }
  }

  updateParticle(p) {
    p.x += p.vx;
    p.y += p.vy;
    p.time++;
    p.alpha = p.originalAlpha * p.life + Math.sin(p.time * p.twinkleSpeed) * p.twinkleAmount;
    p.life -= p.decay;

    if (p.x > this.w + 10 || p.life <= 0) {
      this.resetParticle(p);
    }
  }

  resetParticle(p) {
    var lbx = this.getLightBarX();
    p.x = lbx + this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2);
    p.y = this.randomFloat(0, this.h);
    p.vx = this.randomFloat(0.2, 1.0);
    p.vy = this.randomFloat(-0.15, 0.15);
    p.alpha = this.randomFloat(0.6, 1);
    p.originalAlpha = p.alpha;
    p.life = 1.0;
    p.time = 0;
  }

  drawParticle(p) {
    if (p.life <= 0) return;
    var fadeAlpha = 1;
    if (p.y < this.fadeZone) fadeAlpha = p.y / this.fadeZone;
    else if (p.y > this.h - this.fadeZone) fadeAlpha = (this.h - p.y) / this.fadeZone;
    fadeAlpha = Math.max(0, Math.min(1, fadeAlpha));

    this.ctx.globalAlpha = p.alpha * fadeAlpha;
    this.ctx.drawImage(this.gradientCanvas, p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
  }

  drawLightBar() {
    var lbx = this.getLightBarX();
    var lw = this.lightBarWidth;

    var vertGrad = this.ctx.createLinearGradient(0, 0, 0, this.h);
    vertGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    vertGrad.addColorStop(this.fadeZone / this.h, "rgba(255, 255, 255, 1)");
    vertGrad.addColorStop(1 - this.fadeZone / this.h, "rgba(255, 255, 255, 1)");
    vertGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

    this.ctx.globalCompositeOperation = "lighter";

    var targetGlow = this.scanningActive ? 3.5 : 1;
    this.currentGlowIntensity += (targetGlow - this.currentGlowIntensity) * this.transitionSpeed;
    var gi = this.currentGlowIntensity;

    // Core
    var coreGrad = this.ctx.createLinearGradient(lbx - lw / 2, 0, lbx + lw / 2, 0);
    coreGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    coreGrad.addColorStop(0.3, "rgba(255, 255, 255, " + (0.9 * gi) + ")");
    coreGrad.addColorStop(0.5, "rgba(255, 255, 255, " + (1 * gi) + ")");
    coreGrad.addColorStop(0.7, "rgba(255, 255, 255, " + (0.9 * gi) + ")");
    coreGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = coreGrad;
    this.ctx.beginPath();
    this.ctx.roundRect(lbx - lw / 2, 0, lw, this.h, 15);
    this.ctx.fill();

    // Glow 1
    var g1 = this.ctx.createLinearGradient(lbx - lw * 2, 0, lbx + lw * 2, 0);
    g1.addColorStop(0, "rgba(" + PAYMENT_COLORS.brandRgb + ", 0)");
    g1.addColorStop(0.5, "rgba(" + PAYMENT_COLORS.brandRgb + ", " + (0.8 * gi) + ")");
    g1.addColorStop(1, "rgba(" + PAYMENT_COLORS.brandRgb + ", 0)");
    this.ctx.globalAlpha = this.scanningActive ? 1.0 : 0.8;
    this.ctx.fillStyle = g1;
    this.ctx.beginPath();
    this.ctx.roundRect(lbx - lw * 2, 0, lw * 4, this.h, 25);
    this.ctx.fill();

    // Glow 2
    var g2 = this.ctx.createLinearGradient(lbx - lw * 4, 0, lbx + lw * 4, 0);
    g2.addColorStop(0, "rgba(" + PAYMENT_COLORS.brandRgb + ", 0)");
    g2.addColorStop(0.5, "rgba(" + PAYMENT_COLORS.brandRgb + ", " + (0.4 * gi) + ")");
    g2.addColorStop(1, "rgba(" + PAYMENT_COLORS.brandRgb + ", 0)");
    this.ctx.globalAlpha = this.scanningActive ? 0.8 : 0.6;
    this.ctx.fillStyle = g2;
    this.ctx.beginPath();
    this.ctx.roundRect(lbx - lw * 4, 0, lw * 8, this.h, 35);
    this.ctx.fill();

    // Extra glow when scanning
    if (this.scanningActive) {
      var g3 = this.ctx.createLinearGradient(lbx - lw * 8, 0, lbx + lw * 8, 0);
      g3.addColorStop(0, "rgba(" + PAYMENT_COLORS.brandRgb + ", 0)");
      g3.addColorStop(0.5, "rgba(" + PAYMENT_COLORS.brandRgb + ", 0.2)");
      g3.addColorStop(1, "rgba(" + PAYMENT_COLORS.brandRgb + ", 0)");
      this.ctx.globalAlpha = 0.6;
      this.ctx.fillStyle = g3;
      this.ctx.beginPath();
      this.ctx.roundRect(lbx - lw * 8, 0, lw * 16, this.h, 45);
      this.ctx.fill();
    }

    // Mask with vertical fade
    this.ctx.globalCompositeOperation = "destination-in";
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = vertGrad;
    this.ctx.fillRect(0, 0, this.w, this.h);
  }

  render() {
    var targetI = this.scanningActive ? this.scanTargetIntensity : this.baseIntensity;
    var targetP = this.scanningActive ? this.scanTargetParticles : this.baseMaxParticles;
    var targetF = this.scanningActive ? this.scanTargetFadeZone : this.baseFadeZone;

    this.currentIntensity += (targetI - this.currentIntensity) * this.transitionSpeed;
    this.currentMaxParticles += (targetP - this.currentMaxParticles) * this.transitionSpeed;
    this.currentFadeZone += (targetF - this.currentFadeZone) * this.transitionSpeed;

    this.intensity = this.currentIntensity;
    this.maxParticles = Math.floor(this.currentMaxParticles);
    this.fadeZone = this.currentFadeZone;

    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.clearRect(0, 0, this.w, this.h);

    this.drawLightBar();

    this.ctx.globalCompositeOperation = "lighter";
    for (var i = 1; i <= this.count; i++) {
      if (this.particles[i]) {
        this.updateParticle(this.particles[i]);
        this.drawParticle(this.particles[i]);
      }
    }

    // Spawn new particles
    if (Math.random() < this.intensity && this.count < this.maxParticles) {
      var p = this.createParticle();
      p.originalAlpha = p.alpha;
      this.count++;
      this.particles[this.count] = p;
    }

    var ratio = this.intensity / this.baseIntensity;
    if (ratio > 1.1 && Math.random() < (ratio - 1.0) * 1.2) {
      var p = this.createParticle(); p.originalAlpha = p.alpha; this.count++; this.particles[this.count] = p;
    }
    if (ratio > 1.5 && Math.random() < (ratio - 1.5) * 1.8) {
      var p = this.createParticle(); p.originalAlpha = p.alpha; this.count++; this.particles[this.count] = p;
    }

    // Cleanup excess
    if (this.count > this.maxParticles + 200) {
      var excess = Math.min(15, this.count - this.maxParticles);
      for (var i = 0; i < excess; i++) {
        delete this.particles[this.count - i];
      }
      this.count -= excess;
    }
  }

  animate() {
    this.render();
    this.animationId = requestAnimationFrame(function() { this.animate(); }.bind(this));
  }

  setScanningActive(active) {
    this.scanningActive = active;
  }
}


/* ---- Init ---- */

var zahlungCardStream, zahlungParticleSystem, zahlungParticleScanner;

document.addEventListener("DOMContentLoaded", function() {
  if (!document.querySelector(".scanner-hero")) return;

  zahlungCardStream = new CardStreamController();
  zahlungParticleSystem = new ZahlungParticleSystem();
  zahlungParticleScanner = new ZahlungParticleScanner();

  window.setScannerScanning = function(active) {
    if (zahlungParticleScanner) {
      zahlungParticleScanner.setScanningActive(active);
    }
  };
});
