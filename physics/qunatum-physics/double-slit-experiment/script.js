// Double Slit Experiment Simulation
class DoubleSlit {
  constructor() {
    this.setupCanvas = document.getElementById("setup-canvas");
    this.patternCanvas = document.getElementById("pattern-canvas");
    this.setupCtx = this.setupCanvas.getContext("2d");
    this.patternCtx = this.patternCanvas.getContext("2d");

    this.detectorOn = false;
    this.singlePhotonMode = false;
    this.running = false;
    this.photonCount = 0;
    this.slit1Count = 0;
    this.slit2Count = 0;
    this.detectionPattern = new Array(this.patternCanvas.width).fill(0);

    this.setupEventListeners();
    this.updateParameters();
    this.drawSetup();
    this.drawPattern();
  }

  setupEventListeners() {
    // Parameter controls
    ["slitSeparation", "slitWidth", "wavelengthDS"].forEach((id) => {
      const slider = document.getElementById(id);
      const valueSpan = document.getElementById(id + "-value");
      slider.addEventListener("input", () => {
        const value = parseFloat(slider.value);
        const unit = id === "wavelengthDS" ? " nm" : " μm";
        valueSpan.textContent = value + unit;
        this.updateParameters();
        this.drawSetup();
        this.drawPattern();
      });
    });

    // Detector controls
    document
      .getElementById("which-path-off")
      .addEventListener("click", () => this.setDetector(false));
    document
      .getElementById("which-path-on")
      .addEventListener("click", () => this.setDetector(true));
    document
      .getElementById("single-photon")
      .addEventListener("click", () => this.toggleSinglePhotonMode());

    // Experiment controls
    document
      .getElementById("start-experiment")
      .addEventListener("click", () => this.startExperiment());
    document
      .getElementById("reset-experiment")
      .addEventListener("click", () => this.resetExperiment());
  }

  setDetector(on) {
    this.detectorOn = on;

    const offBtn = document.getElementById("which-path-off");
    const onBtn = document.getElementById("which-path-on");

    if (on) {
      offBtn.className =
        "px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors";
      onBtn.className =
        "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors";
    } else {
      offBtn.className =
        "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors";
      onBtn.className =
        "px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors";
    }

    this.drawSetup();
    this.drawPattern();
    this.updateVisibility();
  }

  toggleSinglePhotonMode() {
    this.singlePhotonMode = !this.singlePhotonMode;
    const button = document.getElementById("single-photon");

    if (this.singlePhotonMode) {
      button.className =
        "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors";
      button.textContent = "Single Photon ON";
    } else {
      button.className =
        "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors";
      button.textContent = "Single Photon";
    }
  }

  updateParameters() {
    this.slitSeparation = parseFloat(
      document.getElementById("slitSeparation").value
    );
    this.slitWidth = parseFloat(document.getElementById("slitWidth").value);
    this.wavelength = parseFloat(document.getElementById("wavelengthDS").value);
  }

  drawSetup() {
    const ctx = this.setupCtx;
    const canvas = this.setupCanvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw source
    ctx.fillStyle = "#ff6b6b";
    ctx.beginPath();
    ctx.arc(50, canvas.height / 2, 12, 0, 2 * Math.PI);
    ctx.fill();

    // Source label
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Light Source", 50, canvas.height / 2 + 30);

    // Draw barrier with slits
    const barrierX = 200;
    const centerY = canvas.height / 2;
    const slitHeight = 30;
    const slitSep = 50;

    // Barrier walls
    ctx.fillStyle = "#666";
    // Top wall
    ctx.fillRect(barrierX - 5, 0, 10, centerY - slitSep / 2 - slitHeight / 2);
    // Middle wall
    ctx.fillRect(
      barrierX - 5,
      centerY - slitSep / 2 + slitHeight / 2,
      10,
      slitSep - slitHeight
    );
    // Bottom wall
    ctx.fillRect(
      barrierX - 5,
      centerY + slitSep / 2 + slitHeight / 2,
      10,
      canvas.height - (centerY + slitSep / 2 + slitHeight / 2)
    );

    // Slit openings
    ctx.fillStyle = this.detectorOn ? "#ff9800" : "#4caf50";
    // Upper slit
    ctx.fillRect(
      barrierX - 5,
      centerY - slitSep / 2 - slitHeight / 2,
      10,
      slitHeight
    );
    // Lower slit
    ctx.fillRect(
      barrierX - 5,
      centerY + slitSep / 2 - slitHeight / 2,
      10,
      slitHeight
    );

    // Draw detectors if enabled
    if (this.detectorOn) {
      ctx.fillStyle = "#ff9800";
      ctx.fillRect(barrierX + 10, centerY - slitSep / 2 - 5, 15, 10);
      ctx.fillRect(barrierX + 10, centerY + slitSep / 2 - 5, 15, 10);

      ctx.fillStyle = "#333";
      ctx.font = "10px Arial";
      ctx.fillText("D1", barrierX + 30, centerY - slitSep / 2);
      ctx.fillText("D2", barrierX + 30, centerY + slitSep / 2);
    }

    // Draw screen
    const screenX = 350;
    ctx.fillStyle = "#ddd";
    ctx.fillRect(screenX, 0, 8, canvas.height);

    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.fillText("Detection Screen", screenX - 30, canvas.height - 10);

    // Draw light rays
    ctx.strokeStyle = this.detectorOn ? "#ff9800" : "#4caf50";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7;

    if (!this.detectorOn) {
      // Wave mode - show interference paths
      ctx.setLineDash([3, 3]);
      for (let i = 0; i < 7; i++) {
        const angle = (i - 3) * 0.2;
        const endY = centerY + angle * 100;

        // From source to upper slit
        ctx.beginPath();
        ctx.moveTo(62, centerY);
        ctx.lineTo(barrierX - 10, centerY - slitSep / 2);
        ctx.lineTo(screenX, endY);
        ctx.stroke();

        // From source to lower slit
        ctx.beginPath();
        ctx.moveTo(62, centerY);
        ctx.lineTo(barrierX - 10, centerY + slitSep / 2);
        ctx.lineTo(screenX, endY);
        ctx.stroke();
      }
    } else {
      // Particle mode - show direct paths
      ctx.setLineDash([]);
      // Upper path
      ctx.beginPath();
      ctx.moveTo(62, centerY);
      ctx.lineTo(barrierX - 10, centerY - slitSep / 2);
      ctx.lineTo(screenX, centerY - 40);
      ctx.stroke();

      // Lower path
      ctx.beginPath();
      ctx.moveTo(62, centerY);
      ctx.lineTo(barrierX - 10, centerY + slitSep / 2);
      ctx.lineTo(screenX, centerY + 40);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // Labels
    ctx.fillStyle = "#333";
    ctx.font = "11px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Barrier with", barrierX - 20, centerY - 70);
    ctx.fillText("Double Slits", barrierX - 20, centerY - 55);
  }

  drawPattern() {
    const ctx = this.patternCtx;
    const canvas = this.patternCanvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.detectorOn) {
      // Particle behavior - two distinct bands
      this.drawParticlePattern(ctx, canvas);
    } else {
      // Wave behavior - interference pattern
      this.drawInterferencePattern(ctx, canvas);
    }

    // Draw accumulated detections if experiment is running
    if (this.photonCount > 0) {
      this.drawDetectionData(ctx, canvas);
    }
  }

  drawInterferencePattern(ctx, canvas) {
    const centerY = canvas.height / 2;
    const fringeSpacing = 20; // pixels between fringes

    ctx.fillStyle = "#4caf50";

    // Draw interference fringes
    for (let y = 0; y < canvas.height; y++) {
      const distance = Math.abs(y - centerY);
      const phase = (2 * Math.PI * distance) / fringeSpacing;
      const intensity = Math.cos(phase / 2) ** 2;

      ctx.globalAlpha = intensity * 0.8;
      ctx.fillRect(0, y, canvas.width, 1);
    }
    ctx.globalAlpha = 1;

    // Labels
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.fillText("Wave Interference", 10, 20);
    ctx.fillText("Pattern", 10, 35);
  }

  drawParticlePattern(ctx, canvas) {
    const centerY = canvas.height / 2;

    // Two distinct bands
    ctx.fillStyle = "#ff9800";
    ctx.globalAlpha = 0.7;

    // Upper band
    ctx.fillRect(0, centerY - 80, canvas.width, 40);
    // Lower band
    ctx.fillRect(0, centerY + 40, canvas.width, 40);

    ctx.globalAlpha = 1;

    // Labels
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.fillText("Particle Bands", 10, 20);
    ctx.fillText("(2 distinct groups)", 10, 35);
  }

  drawDetectionData(ctx, canvas) {
    if (this.detectionPattern.length === 0) return;

    ctx.fillStyle = "#2196f3";
    ctx.globalAlpha = 0.8;

    const maxCount = Math.max(...this.detectionPattern);
    if (maxCount > 0) {
      for (
        let x = 0;
        x < Math.min(this.detectionPattern.length, canvas.width);
        x++
      ) {
        const height = (this.detectionPattern[x] / maxCount) * 60;
        if (height > 0) {
          ctx.fillRect(x, canvas.height - height, 2, height);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  startExperiment() {
    if (this.running) return;

    this.running = true;
    document.getElementById("start-experiment").textContent = "Running...";
    this.simulatePhotons();
  }

  simulatePhotons() {
    if (!this.running) return;

    const photonsPerFrame = this.singlePhotonMode ? 1 : 5;

    for (let i = 0; i < photonsPerFrame; i++) {
      this.detectPhoton();
    }

    this.updateCounters();
    this.drawPattern();

    if (this.photonCount < 500) {
      setTimeout(
        () => this.simulatePhotons(),
        this.singlePhotonMode ? 200 : 100
      );
    } else {
      this.running = false;
      document.getElementById("start-experiment").textContent =
        "Start Experiment";
    }
  }

  detectPhoton() {
    this.photonCount++;

    if (this.detectorOn) {
      // Particle behavior - choose slit randomly
      if (Math.random() < 0.5) {
        this.slit1Count++;
      } else {
        this.slit2Count++;
      }
    }

    // Add to detection pattern
    const x = Math.floor(Math.random() * this.patternCanvas.width);
    if (x < this.detectionPattern.length) {
      this.detectionPattern[x]++;
    }
  }

  updateCounters() {
    document.getElementById("photon-count").textContent = this.photonCount;
    document.getElementById("slit1-count").textContent = this.slit1Count;
    document.getElementById("slit2-count").textContent = this.slit2Count;
    this.updateVisibility();
  }

  updateVisibility() {
    const visibility = this.detectorOn ? 0.0 : 0.95;
    document.getElementById("visibility").textContent = visibility.toFixed(2);
  }

  resetExperiment() {
    this.running = false;
    this.photonCount = 0;
    this.slit1Count = 0;
    this.slit2Count = 0;
    this.detectionPattern.fill(0);

    this.updateCounters();
    this.drawPattern();
    document.getElementById("start-experiment").textContent =
      "Start Experiment";
  }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  new DoubleSlit();
});
