// Bell's Inequality Simulation
class BellInequality {
  constructor() {
    this.canvas = document.getElementById("bell-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.setupEventListeners();
    this.updateCalculations();
    this.draw();
  }

  setupEventListeners() {
    const angles = ["angleAlice1", "angleAlice2", "angleBob1", "angleBob2"];
    angles.forEach((id) => {
      const slider = document.getElementById(id);
      const valueSpan = document.getElementById(id + "-value");
      slider.addEventListener("input", () => {
        const value = parseFloat(slider.value);
        valueSpan.textContent = value + "°";
        this.updateCalculations();
        this.draw();
      });
    });

    document
      .getElementById("run-experiment")
      .addEventListener("click", () => this.runExperiment());
    document
      .getElementById("optimal-angles")
      .addEventListener("click", () => this.setOptimalAngles());
    document
      .getElementById("classical-test")
      .addEventListener("click", () => this.classicalTest());
  }

  updateCalculations() {
    const a1 = this.degToRad(
      parseFloat(document.getElementById("angleAlice1").value)
    );
    const a2 = this.degToRad(
      parseFloat(document.getElementById("angleAlice2").value)
    );
    const b1 = this.degToRad(
      parseFloat(document.getElementById("angleBob1").value)
    );
    const b2 = this.degToRad(
      parseFloat(document.getElementById("angleBob2").value)
    );

    // Calculate quantum mechanical correlations: E(a,b) = -cos(a-b)
    const E11 = -Math.cos(a1 - b1);
    const E12 = -Math.cos(a1 - b2);
    const E21 = -Math.cos(a2 - b1);
    const E22 = -Math.cos(a2 - b2);

    // Bell parameter S = |E(a1,b1) - E(a1,b2) + E(a2,b1) + E(a2,b2)|
    const S = Math.abs(E11 - E12 + E21 + E22);

    // Update display
    document.getElementById("correlation-11").textContent = E11.toFixed(3);
    document.getElementById("correlation-12").textContent = E12.toFixed(3);
    document.getElementById("correlation-21").textContent = E21.toFixed(3);
    document.getElementById("correlation-22").textContent = E22.toFixed(3);
    document.getElementById("bell-parameter").textContent = S.toFixed(2);

    // Update violation status
    const statusDiv = document.getElementById("violation-status");
    if (S > 2.0) {
      statusDiv.textContent =
        "Bell's Inequality is VIOLATED! Quantum mechanics exhibits non-local correlations.";
      statusDiv.className =
        "text-center p-2 rounded font-semibold bg-red-100 text-red-700";
    } else {
      statusDiv.textContent =
        "Bell's Inequality is satisfied. Local hidden variables could explain the correlations.";
      statusDiv.className =
        "text-center p-2 rounded font-semibold bg-green-100 text-green-700";
    }

    return { E11, E12, E21, E22, S };
  }

  draw() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw entangled photon source in center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Source
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Source", centerX, centerY + 4);

    // Alice's detector (left)
    const aliceX = centerX - 200;
    ctx.fillStyle = "#3498db";
    ctx.fillRect(aliceX - 30, centerY - 40, 60, 80);
    ctx.fillStyle = "#fff";
    ctx.fillText("Alice", aliceX, centerY);

    // Bob's detector (right)
    const bobX = centerX + 200;
    ctx.fillStyle = "#9b59b6";
    ctx.fillRect(bobX - 30, centerY - 40, 60, 80);
    ctx.fillStyle = "#fff";
    ctx.fillText("Bob", bobX, centerY);

    // Draw photon paths
    ctx.strokeStyle = "#f39c12";
    ctx.lineWidth = 3;

    // Left photon
    ctx.beginPath();
    ctx.moveTo(centerX - 15, centerY);
    ctx.lineTo(aliceX + 30, centerY);
    ctx.stroke();

    // Right photon
    ctx.beginPath();
    ctx.moveTo(centerX + 15, centerY);
    ctx.lineTo(bobX - 30, centerY);
    ctx.stroke();

    // Draw measurement angles
    this.drawAngle(
      ctx,
      aliceX,
      centerY,
      parseFloat(document.getElementById("angleAlice1").value),
      "#3498db",
      "a₁"
    );
    this.drawAngle(
      ctx,
      bobX,
      centerY,
      parseFloat(document.getElementById("angleBob1").value),
      "#9b59b6",
      "b₁"
    );

    // Labels
    ctx.fillStyle = "#333";
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Entangled Photon Pairs", 10, 25);
    ctx.fillText("Quantum Non-locality Test", 10, 45);

    ctx.textAlign = "center";
  }

  drawAngle(ctx, x, y, angle, color, label) {
    const radius = 50;
    const angleRad = this.degToRad(angle);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    // Angle arc
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, angleRad);
    ctx.stroke();

    // Angle line
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
      x + radius * Math.cos(angleRad),
      y + radius * Math.sin(angleRad)
    );
    ctx.stroke();

    // Label
    ctx.fillStyle = color;
    ctx.font = "12px Arial";
    ctx.fillText(
      label,
      x + (radius + 10) * Math.cos(angleRad),
      y + (radius + 10) * Math.sin(angleRad)
    );
  }

  degToRad(degrees) {
    return (degrees * Math.PI) / 180;
  }

  runExperiment() {
    // Animate the experiment
    let measurements = 0;
    const maxMeasurements = 100;

    const animate = () => {
      if (measurements < maxMeasurements) {
        measurements++;

        // Simple animation effect
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        setTimeout(animate, 50);
      } else {
        this.draw();
      }
    };

    animate();
  }

  setOptimalAngles() {
    // Set angles for maximum Bell violation: S = 2√2 ≈ 2.83
    document.getElementById("angleAlice1").value = 0;
    document.getElementById("angleAlice2").value = 45;
    document.getElementById("angleBob1").value = 22.5;
    document.getElementById("angleBob2").value = 67.5;

    document.getElementById("angleAlice1-value").textContent = "0°";
    document.getElementById("angleAlice2-value").textContent = "45°";
    document.getElementById("angleBob1-value").textContent = "22.5°";
    document.getElementById("angleBob2-value").textContent = "67.5°";

    this.updateCalculations();
    this.draw();
  }

  classicalTest() {
    // Set angles where classical and quantum predictions differ significantly
    document.getElementById("angleAlice1").value = 0;
    document.getElementById("angleAlice2").value = 90;
    document.getElementById("angleBob1").value = 45;
    document.getElementById("angleBob2").value = 135;

    document.getElementById("angleAlice1-value").textContent = "0°";
    document.getElementById("angleAlice2-value").textContent = "90°";
    document.getElementById("angleBob1-value").textContent = "45°";
    document.getElementById("angleBob2-value").textContent = "135°";

    this.updateCalculations();
    this.draw();
  }
}

document.addEventListener("DOMContentLoaded", () => new BellInequality());
