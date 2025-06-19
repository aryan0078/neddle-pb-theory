// Schrödinger Equation Visualizer
// Simple 1D visualization for different potentials

const canvas = document.getElementById("schrodinger-canvas");
const ctx = canvas.getContext("2d");
const potentialSelect = document.getElementById("potential");
const energyInput = document.getElementById("energy");

// Canvas state for zoom/pan
let offsetX = 0;
let offsetY = 0;
let scale = 1;
let isDragging = false;
let lastX, lastY;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes();
  drawPotential();
  drawWavefunction();
}

function drawAxes() {
  ctx.save();
  ctx.strokeStyle = "#bbb";
  ctx.lineWidth = 1;
  // x-axis
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2 + offsetY);
  ctx.lineTo(canvas.width, canvas.height / 2 + offsetY);
  ctx.stroke();
  // y-axis
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 + offsetX, 0);
  ctx.lineTo(canvas.width / 2 + offsetX, canvas.height);
  ctx.stroke();
  ctx.restore();
}

function drawPotential() {
  const type = potentialSelect.value;
  ctx.save();
  ctx.strokeStyle = "#6366f1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= canvas.width; x++) {
    let V = 0;
    if (type === "well") {
      V = x < 50 || x > canvas.width - 50 ? 1 : 0;
    } else if (type === "barrier") {
      V = x > canvas.width / 2 - 40 && x < canvas.width / 2 + 40 ? 0.7 : 0;
    } else if (type === "harmonic") {
      const normX = (x - canvas.width / 2) / 120;
      V = 0.01 * normX * normX;
    }
    const y = canvas.height - (V * 200 * scale + 50 + offsetY);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawWavefunction() {
  const type = potentialSelect.value;
  const n = parseInt(energyInput.value);
  ctx.save();
  ctx.strokeStyle = "#a21caf";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= canvas.width; x++) {
    let psi = 0;
    if (type === "well") {
      // Infinite square well: psi_n(x) = sqrt(2/L) * sin(n*pi*x/L)
      const L = canvas.width - 100;
      if (x < 50 || x > canvas.width - 50) psi = 0;
      else psi = Math.sqrt(2 / L) * Math.sin((n * Math.PI * (x - 50)) / L);
    } else if (type === "barrier") {
      // Approximate: standing wave with node at barrier
      const L = canvas.width;
      psi =
        Math.sin((n * Math.PI * x) / L) *
        (x < canvas.width / 2 - 40 || x > canvas.width / 2 + 40 ? 1 : 0.3);
    } else if (type === "harmonic") {
      // Harmonic oscillator: Hermite polynomials (approximate with Gaussian * sin)
      const normX = (x - canvas.width / 2) / 120;
      psi =
        Math.exp((-normX * normX) / 2) * Math.sin((n * Math.PI * normX) / 2);
    }
    const y = canvas.height / 2 - psi * 100 * scale + offsetY;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

// Interactivity: zoom and pan
canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});
canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    offsetX += e.offsetX - lastX;
    offsetY += e.offsetY - lastY;
    lastX = e.offsetX;
    lastY = e.offsetY;
    draw();
  }
});
canvas.addEventListener("mouseup", () => {
  isDragging = false;
});
canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const zoom = e.deltaY < 0 ? 1.1 : 0.9;
  scale *= zoom;
  draw();
});

potentialSelect.addEventListener("change", draw);
energyInput.addEventListener("input", draw);

draw();
