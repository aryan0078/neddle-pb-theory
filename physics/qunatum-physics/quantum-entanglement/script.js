const canvas = document.getElementById("entanglement-canvas");
const ctx = canvas.getContext("2d");
const angleA = document.getElementById("angleA");
const angleB = document.getElementById("angleB");
const angleAValue = document.getElementById("angleA-value");
const angleBValue = document.getElementById("angleB-value");

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function correlation(a, b) {
  // For a Bell state, correlation = -cos(angleA - angleB)
  return -Math.cos(toRadians(a - b));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw axes
  ctx.strokeStyle = "#bbb";
  ctx.beginPath();
  ctx.moveTo(50, canvas.height / 2);
  ctx.lineTo(canvas.width - 50, canvas.height / 2);
  ctx.stroke();

  // Draw correlation as a bar
  const a = parseInt(angleA.value);
  const b = parseInt(angleB.value);
  const corr = correlation(a, b);
  ctx.fillStyle = "#a21caf";
  ctx.fillRect(
    canvas.width / 2 - 50,
    canvas.height / 2 - corr * 100,
    100,
    corr * 100
  );
  ctx.strokeStyle = "#6366f1";
  ctx.strokeRect(canvas.width / 2 - 50, canvas.height / 2 - 100, 100, 200);

  // Draw labels
  ctx.fillStyle = "#333";
  ctx.font = "16px sans-serif";
  ctx.fillText("Correlation", canvas.width / 2 - 40, 30);
  ctx.fillText(
    corr.toFixed(2),
    canvas.width / 2 - 15,
    canvas.height / 2 - corr * 100 - 10
  );
}

function updateLabels() {
  angleAValue.textContent = angleA.value + "°";
  angleBValue.textContent = angleB.value + "°";
}

angleA.addEventListener("input", () => {
  updateLabels();
  draw();
});
angleB.addEventListener("input", () => {
  updateLabels();
  draw();
});

updateLabels();
draw();
