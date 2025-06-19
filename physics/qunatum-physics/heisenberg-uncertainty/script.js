// Heisenberg Uncertainty Principle Simulation
class UncertaintyPrinciple {
  constructor() {
    this.positionCanvas = document.getElementById("position-canvas");
    this.momentumCanvas = document.getElementById("momentum-canvas");
    this.wavefunctionCanvas = document.getElementById("wavefunction-canvas");

    this.positionCtx = this.positionCanvas.getContext("2d");
    this.momentumCtx = this.momentumCanvas.getContext("2d");
    this.wavefunctionCtx = this.wavefunctionCanvas.getContext("2d");

    this.setupEventListeners();
    this.updateCalculations();
    this.draw();
  }

  setupEventListeners() {
    const controls = [
      "positionUncertainty",
      "momentumUncertainty",
      "wavePacketWidth",
      "measurementPrecision",
    ];
    controls.forEach((id) => {
      const slider = document.getElementById(id);
      const valueSpan = document.getElementById(id + "-value");
      slider.addEventListener("input", () => {
        const value = parseFloat(slider.value);
        let displayValue = value.toFixed(1);
        if (id === "momentumUncertainty") {
          displayValue = value.toExponential(1) + " kg⋅m/s";
        } else if (id === "positionUncertainty") {
          displayValue += " nm";
        }
        valueSpan.textContent = displayValue;
        this.updateCalculations();
        this.draw();
      });
    });

    document
      .getElementById("minimize-position")
      .addEventListener("click", () => this.minimizePosition());
    document
      .getElementById("minimize-momentum")
      .addEventListener("click", () => this.minimizeMomentum());
    document
      .getElementById("equal-uncertainties")
      .addEventListener("click", () => this.equalUncertainties());
  }

  updateCalculations() {
    const deltaX =
      parseFloat(document.getElementById("positionUncertainty").value) * 1e-9; // nm to m
    const deltaP = parseFloat(
      document.getElementById("momentumUncertainty").value
    );
    const hbar = 1.055e-34; // J⋅s

    const uncertaintyProduct = deltaX * deltaP;
    const planckLimit = hbar / 2;
    const uncertaintyRatio = uncertaintyProduct / planckLimit;

    document.getElementById("uncertainty-product").textContent =
      uncertaintyProduct.toExponential(1);
    document.getElementById("planck-limit").textContent =
      planckLimit.toExponential(1);
    document.getElementById("uncertainty-ratio").textContent =
      uncertaintyRatio.toFixed(2);

    return { deltaX, deltaP, uncertaintyProduct, planckLimit };
  }

  draw() {
    this.drawPositionDistribution();
    this.drawMomentumDistribution();
    this.drawWaveFunction();
  }

  drawPositionDistribution() {
    const ctx = this.positionCtx;
    const canvas = this.positionCanvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const deltaX = parseFloat(
      document.getElementById("positionUncertainty").value
    );
    const sigma = deltaX / 4; // Convert to reasonable scale
    const centerX = canvas.width / 2;
    const maxHeight = canvas.height * 0.8;

    ctx.fillStyle = "#3498db";
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const position = (x - centerX) / 20;
      const probability = Math.exp(
        -(position * position) / (2 * sigma * sigma)
      );
      const y = canvas.height - probability * maxHeight;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Labels
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.fillText("Position", 10, 20);
    ctx.fillText("Δx = " + deltaX.toFixed(1) + " nm", 10, canvas.height - 10);
  }

  drawMomentumDistribution() {
    const ctx = this.momentumCtx;
    const canvas = this.momentumCanvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const deltaP = parseFloat(
      document.getElementById("momentumUncertainty").value
    );
    const sigma = deltaP / 4e-25; // Scale for visualization
    const centerX = canvas.width / 2;
    const maxHeight = canvas.height * 0.8;

    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const momentum = (x - centerX) / 20;
      const probability = Math.exp(
        -(momentum * momentum) / (2 * sigma * sigma)
      );
      const y = canvas.height - probability * maxHeight;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.fillText("Momentum", 10, 20);
    ctx.fillText("Δp = " + deltaP.toExponential(1), 10, canvas.height - 10);
  }

  drawWaveFunction() {
    const ctx = this.wavefunctionCtx;
    const canvas = this.wavefunctionCanvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const wavePacketWidth = parseFloat(
      document.getElementById("wavePacketWidth").value
    );
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw real part of wave function
    ctx.strokeStyle = "#9b59b6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const position = (x - centerX) / 50;
      const envelope = Math.exp(
        -(position * position) / (wavePacketWidth * wavePacketWidth)
      );
      const wave = envelope * Math.cos(position * 5);
      const y = centerY + wave * 50;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw imaginary part
    ctx.strokeStyle = "#f39c12";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const position = (x - centerX) / 50;
      const envelope = Math.exp(
        -(position * position) / (wavePacketWidth * wavePacketWidth)
      );
      const wave = envelope * Math.sin(position * 5);
      const y = centerY + wave * 50;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.fillText("ψ(x) - Real part", 10, 20);
    ctx.fillStyle = "#f39c12";
    ctx.fillText("ψ(x) - Imaginary part", 10, 35);
  }

  minimizePosition() {
    document.getElementById("positionUncertainty").value = 0.1;
    document.getElementById("positionUncertainty-value").textContent = "0.1 nm";
    this.updateCalculations();
    this.draw();
  }

  minimizeMomentum() {
    document.getElementById("momentumUncertainty").value = 1e-25;
    document.getElementById("momentumUncertainty-value").textContent =
      "1.0×10⁻²⁵ kg⋅m/s";
    this.updateCalculations();
    this.draw();
  }

  equalUncertainties() {
    const hbar = 1.055e-34;
    const equalValue = Math.sqrt(hbar / 2);

    document.getElementById("positionUncertainty").value = 1.0;
    document.getElementById("momentumUncertainty").value = 5e-25;
    document.getElementById("positionUncertainty-value").textContent = "1.0 nm";
    document.getElementById("momentumUncertainty-value").textContent =
      "5.0×10⁻²⁵ kg⋅m/s";

    this.updateCalculations();
    this.draw();
  }
}

document.addEventListener("DOMContentLoaded", () => new UncertaintyPrinciple());
