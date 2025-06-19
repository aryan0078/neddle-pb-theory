// Wave-Particle Duality Simulation
class WaveParticleDuality {
  constructor() {
    this.canvas = document.getElementById("duality-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.mode = "wave"; // 'wave' or 'particle'
    this.animating = false;
    this.time = 0;
    this.setupEventListeners();
    this.updateCalculations();
    this.draw();
  }

  setupEventListeners() {
    // Mode switching
    document.getElementById("wave-mode").addEventListener("click", () => {
      this.setMode("wave");
    });
    document.getElementById("particle-mode").addEventListener("click", () => {
      this.setMode("particle");
    });

    // Parameter controls
    const controls = ["frequency", "amplitude", "wavelength", "intensity"];
    controls.forEach((id) => {
      const slider = document.getElementById(id);
      const valueSpan = document.getElementById(id + "-value");
      slider.addEventListener("input", () => {
        const value = parseFloat(slider.value);
        const unit =
          id === "frequency" ? " Hz" : id === "wavelength" ? " nm" : "";
        valueSpan.textContent = value.toFixed(1) + unit;
        this.updateCalculations();
        this.draw();
      });
    });

    // Animation controls
    document
      .getElementById("toggle-animation")
      .addEventListener("click", () => {
        this.toggleAnimation();
      });

    document
      .getElementById("show-interference")
      .addEventListener("click", () => {
        this.showInterference();
      });
  }

  setMode(mode) {
    this.mode = mode;

    // Update button styles
    const waveBtn = document.getElementById("wave-mode");
    const particleBtn = document.getElementById("particle-mode");

    if (mode === "wave") {
      waveBtn.className =
        "px-4 py-2 bg-blue-500 text-white rounded-l hover:bg-blue-600 transition-colors";
      particleBtn.className =
        "px-4 py-2 bg-gray-300 text-gray-700 rounded-r hover:bg-gray-400 transition-colors";
    } else {
      waveBtn.className =
        "px-4 py-2 bg-gray-300 text-gray-700 rounded-l hover:bg-gray-400 transition-colors";
      particleBtn.className =
        "px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-colors";
    }

    this.draw();
  }

  updateCalculations() {
    const frequency = parseFloat(document.getElementById("frequency").value);
    const wavelength =
      parseFloat(document.getElementById("wavelength").value) * 1e-9; // nm to m
    const c = 3e8; // speed of light m/s
    const h = 6.626e-34; // Planck constant J⋅s
    const hbar = h / (2 * Math.PI);

    // Calculate photon energy: E = hf = hc/λ
    const energy = (h * c) / wavelength;
    const energyEV = energy / 1.602e-19; // Convert to eV

    // Calculate momentum: p = h/λ
    const momentum = h / wavelength;

    // de Broglie wavelength (same as input wavelength for photons)
    const deBroglieWavelength = wavelength * 1e9; // Convert back to nm

    // Update display
    document.getElementById("photon-energy").textContent = energyEV.toFixed(2);
    document.getElementById("photon-momentum").textContent =
      momentum.toExponential(1);
    document.getElementById("debroglie-wavelength").textContent =
      deBroglieWavelength.toFixed(0);
  }

  draw() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const frequency = parseFloat(document.getElementById("frequency").value);
    const amplitude = parseFloat(document.getElementById("amplitude").value);
    const wavelength = parseFloat(document.getElementById("wavelength").value);
    const intensity = parseFloat(document.getElementById("intensity").value);

    const centerY = canvas.height / 2;
    const waveLength = wavelength / 10; // Scale for visualization

    if (this.mode === "wave") {
      this.drawWaveMode(ctx, canvas, frequency, amplitude, waveLength, centerY);
    } else {
      this.drawParticleMode(ctx, canvas, intensity, centerY);
    }

    // Draw labels
    ctx.fillStyle = "#333";
    ctx.font = "14px Arial";
    ctx.fillText(
      `Mode: ${this.mode.charAt(0).toUpperCase() + this.mode.slice(1)}`,
      10,
      25
    );
  }

  drawWaveMode(ctx, canvas, frequency, amplitude, waveLength, centerY) {
    // Draw sine wave
    ctx.strokeStyle = this.getWavelengthColor(
      parseFloat(document.getElementById("wavelength").value)
    );
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let x = 0; x < canvas.width; x++) {
      const y =
        centerY +
        amplitude *
          30 *
          Math.sin(
            (2 * Math.PI * x) / waveLength + this.time * frequency * 0.1
          );
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw wave properties
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    // Amplitude lines
    ctx.beginPath();
    ctx.moveTo(0, centerY + amplitude * 30);
    ctx.lineTo(canvas.width, centerY + amplitude * 30);
    ctx.moveTo(0, centerY - amplitude * 30);
    ctx.lineTo(canvas.width, centerY - amplitude * 30);
    ctx.stroke();

    ctx.setLineDash([]);
  }

  drawParticleMode(ctx, canvas, intensity, centerY) {
    // Draw discrete particles
    const numParticles = Math.floor(intensity * 50);
    const color = this.getWavelengthColor(
      parseFloat(document.getElementById("wavelength").value)
    );

    ctx.fillStyle = color;

    for (let i = 0; i < numParticles; i++) {
      const x =
        (i * canvas.width) / numParticles +
        ((this.time * 2) % (canvas.width / numParticles));
      const y = centerY + (Math.random() - 0.5) * 40;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  getWavelengthColor(wavelength) {
    // Convert wavelength (nm) to RGB color
    if (wavelength < 380) return "#8b00ff"; // violet
    if (wavelength < 450) return "#4b0082"; // indigo
    if (wavelength < 495) return "#0000ff"; // blue
    if (wavelength < 570) return "#00ff00"; // green
    if (wavelength < 590) return "#ffff00"; // yellow
    if (wavelength < 620) return "#ff7f00"; // orange
    return "#ff0000"; // red
  }

  toggleAnimation() {
    const button = document.getElementById("toggle-animation");

    if (this.animating) {
      this.animating = false;
      button.textContent = "Start Animation";
    } else {
      this.animating = true;
      button.textContent = "Stop Animation";
      this.animate();
    }
  }

  animate() {
    if (!this.animating) return;

    this.time += 1;
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  showInterference() {
    // Show double-wave interference pattern
    this.setMode("wave");
    const ctx = this.ctx;
    const canvas = this.canvas;

    setTimeout(() => {
      const frequency = parseFloat(document.getElementById("frequency").value);
      const amplitude = parseFloat(document.getElementById("amplitude").value);
      const wavelength = parseFloat(
        document.getElementById("wavelength").value
      );
      const waveLength = wavelength / 10;
      const centerY = canvas.height / 2;

      ctx.strokeStyle = this.getWavelengthColor(wavelength);
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7;

      // Draw two interfering waves
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const wave1 = amplitude * 20 * Math.sin((2 * Math.PI * x) / waveLength);
        const wave2 =
          amplitude *
          20 *
          Math.sin((2 * Math.PI * x) / waveLength + Math.PI / 4);
        const y = centerY + wave1 + wave2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }, 500);
  }
}

// Initialize the simulation when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new WaveParticleDuality();
});
