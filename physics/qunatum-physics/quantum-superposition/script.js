const canvas = document.getElementById("superposition-canvas");
const ctx = canvas.getContext("2d");
const thetaSlider = document.getElementById("theta");
const thetaValue = document.getElementById("theta-value");

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function drawBlochSphere(theta) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw sphere outline
  ctx.strokeStyle = "#6366f1";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 150, 0, 2 * Math.PI);
  ctx.stroke();

  // Draw |0> and |1> labels
  ctx.fillStyle = "#333";
  ctx.font = "18px sans-serif";
  ctx.fillText("|0⟩", canvas.width / 2 - 15, canvas.height / 2 - 160);
  ctx.fillText("|1⟩", canvas.width / 2 - 15, canvas.height / 2 + 180);

  // Draw state vector
  const r = 140;
  const x = canvas.width / 2 + r * Math.sin(toRadians(theta));
  const y = canvas.height / 2 - r * Math.cos(toRadians(theta));
  ctx.strokeStyle = "#a21caf";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, canvas.height / 2);
  ctx.lineTo(x, y);
  ctx.stroke();

  // Draw point at tip
  ctx.fillStyle = "#a21caf";
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, 2 * Math.PI);
  ctx.fill();
}

function update() {
  const theta = parseInt(thetaSlider.value);
  thetaValue.textContent = theta + "°";
  drawBlochSphere(theta);
}

thetaSlider.addEventListener("input", update);
update();
