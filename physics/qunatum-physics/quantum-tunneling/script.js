// Quantum Tunneling Simulation
class QuantumTunneling {
  constructor() {
    this.canvas = document.getElementById("tunneling-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.setupEventListeners();
    this.animationId = null;
    this.particleX = 50;
    this.animating = false;
    this.updateCalculations();
    this.draw();
  }

  setupEventListeners() {
    const controls = [
      "barrierHeight",
      "barrierWidth",
      "particleEnergy",
      "particleMass",
    ];
    controls.forEach((id) => {
      const slider = document.getElementById(id);
      const valueSpan = document.getElementById(id + "-value");
      slider.addEventListener("input", () => {
        const value = parseFloat(slider.value);
        const unit =
          id === "barrierHeight" || id === "particleEnergy"
            ? " eV"
            : id === "barrierWidth"
            ? " nm"
            : " me";
        valueSpan.textContent = value.toFixed(1) + unit;
        this.updateCalculations();
        this.draw();
      });
    });

    document
      .getElementById("animate-particle")
      .addEventListener("click", () => {
        this.animateParticle();
      });
  }

  updateCalculations() {
    const barrierHeight = parseFloat(
      document.getElementById("barrierHeight").value
    );
    const barrierWidth = parseFloat(
      document.getElementById("barrierWidth").value
    );
    const particleEnergy = parseFloat(
      document.getElementById("particleEnergy").value
    );
    const particleMass = parseFloat(
      document.getElementById("particleMass").value
    );

    // Calculate transmission probability using quantum mechanics
    const hbar = 1.055e-34; // J⋅s
    const me = 9.109e-31; // kg
    const eV = 1.602e-19; // J

    const E = particleEnergy * eV;
    const V0 = barrierHeight * eV;
    const a = barrierWidth * 1e-9; // convert nm to m
    const m = particleMass * me;

    let transmissionProb;
    if (E >= V0) {
      // Classical case - particle has enough energy
      transmissionProb = 1.0;
    } else {
      // Quantum tunneling case
      const k = Math.sqrt(2 * m * (V0 - E)) / hbar;
      const ka = k * a;
      transmissionProb =
        1 / (1 + (V0 / (4 * E * (V0 - E))) * Math.sinh(ka) ** 2);
    }

    const reflectionProb = 1 - transmissionProb;

    document.getElementById("transmission-prob").textContent =
      transmissionProb.toFixed(3);
    document.getElementById("reflection-prob").textContent =
      reflectionProb.toFixed(3);

    return { transmissionProb, reflectionProb };
  }

  draw() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barrierHeight = parseFloat(
      document.getElementById("barrierHeight").value
    );
    const barrierWidth = parseFloat(
      document.getElementById("barrierWidth").value
    );
    const particleEnergy = parseFloat(
      document.getElementById("particleEnergy").value
    );

    // Scale factors for visualization
    const energyScale = 30; // pixels per eV
    const xScale = 40; // pixels per nm
    const groundLevel = canvas.height - 50;

    // Draw potential barrier
    const barrierStartX = canvas.width / 2 - (barrierWidth * xScale) / 2;
    const barrierEndX = canvas.width / 2 + (barrierWidth * xScale) / 2;
    const barrierTop = groundLevel - barrierHeight * energyScale;

    ctx.fillStyle = "#ff6b6b";
    ctx.fillRect(
      barrierStartX,
      barrierTop,
      barrierWidth * xScale,
      barrierHeight * energyScale
    );

    // Draw energy levels
    ctx.strokeStyle = "#4ecdc4";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    // Particle energy line
    const particleEnergyY = groundLevel - particleEnergy * energyScale;
    ctx.beginPath();
    ctx.moveTo(0, particleEnergyY);
    ctx.lineTo(canvas.width, particleEnergyY);
    ctx.stroke();

    // Ground level
    ctx.setLineDash([]);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundLevel);
    ctx.lineTo(canvas.width, groundLevel);
    ctx.stroke();

    // Draw wave function (simplified)
    this.drawWaveFunction();

    // Draw particle
    if (this.animating) {
      ctx.fillStyle = "#45b7d1";
      ctx.beginPath();
      ctx.arc(this.particleX, particleEnergyY - 10, 8, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Labels
    ctx.fillStyle = "#333";
    ctx.font = "14px Arial";
    ctx.fillText("Particle Energy", 10, particleEnergyY - 10);
    ctx.fillText("Potential Barrier", barrierStartX + 10, barrierTop - 10);
    ctx.fillText("Ground State", 10, groundLevel + 20);
  }

  drawWaveFunction() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const particleEnergy = parseFloat(
      document.getElementById("particleEnergy").value
    );
    const energyScale = 30;
    const groundLevel = canvas.height - 50;
    const particleEnergyY = groundLevel - particleEnergy * energyScale;

    ctx.strokeStyle = "#9b59b6";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    // Simplified wave function representation
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 2) {
      const y = particleEnergyY + 20 * Math.sin(x * 0.05);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  animateParticle() {
    if (this.animating) return;

    this.animating = true;
    this.particleX = 50;
    const { transmissionProb } = this.updateCalculations();

    const animate = () => {
      this.particleX += 3;
      this.draw();

      if (this.particleX > this.canvas.width + 50) {
        this.animating = false;
        this.particleX = 50;
        this.draw();
        return;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }
}

// Initialize the simulation when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new QuantumTunneling();
});
