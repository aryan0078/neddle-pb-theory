const canvas = document.getElementById("teleport-canvas");
const ctx = canvas.getContext("2d");
const nextStepBtn = document.getElementById("next-step");
const stepDesc = document.getElementById("step-desc");

const steps = [
  "Step 1: Alice has a qubit in an unknown state. Alice and Bob share an entangled pair.",
  "Step 2: Alice applies a CNOT gate and Hadamard gate to her qubits.",
  "Step 3: Alice measures her qubits and sends the results to Bob.",
  "Step 4: Bob applies X and/or Z gates based on Alice's results. The state is teleported!",
];
let currentStep = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "18px sans-serif";
  ctx.fillStyle = "#333";
  ctx.fillText("Quantum Teleportation Protocol", 180, 30);
  // Draw Alice and Bob
  ctx.fillStyle = "#6366f1";
  ctx.fillRect(80, 60, 100, 40);
  ctx.fillRect(420, 60, 100, 40);
  ctx.fillStyle = "#fff";
  ctx.fillText("Alice", 110, 85);
  ctx.fillText("Bob", 455, 85);
  // Draw qubits and arrows for each step
  if (currentStep === 0) {
    ctx.fillStyle = "#a21caf";
    ctx.beginPath();
    ctx.arc(130, 150, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#6366f1";
    ctx.beginPath();
    ctx.arc(130, 220, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(470, 220, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#bbb";
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(150, 220, 450, 220);
    ctx.lineTo(450, 220);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (currentStep === 1) {
    ctx.fillStyle = "#a21caf";
    ctx.beginPath();
    ctx.arc(130, 150, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#6366f1";
    ctx.beginPath();
    ctx.arc(130, 220, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(470, 220, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(130, 150);
    ctx.lineTo(130, 220);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(130, 220);
    ctx.lineTo(470, 220);
    ctx.stroke();
  } else if (currentStep === 2) {
    ctx.fillStyle = "#a21caf";
    ctx.beginPath();
    ctx.arc(130, 150, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#6366f1";
    ctx.beginPath();
    ctx.arc(130, 220, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(470, 220, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(130, 150);
    ctx.lineTo(130, 220);
    ctx.stroke();
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(130, 220);
    ctx.lineTo(470, 220);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = "#a21caf";
    ctx.beginPath();
    ctx.moveTo(130, 150);
    ctx.lineTo(470, 220);
    ctx.stroke();
  } else if (currentStep === 3) {
    ctx.fillStyle = "#a21caf";
    ctx.beginPath();
    ctx.arc(130, 150, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#6366f1";
    ctx.beginPath();
    ctx.arc(130, 220, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(470, 220, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#a21caf";
    ctx.beginPath();
    ctx.moveTo(130, 150);
    ctx.lineTo(470, 220);
    ctx.stroke();
    ctx.strokeStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(470, 220);
    ctx.lineTo(470, 100);
    ctx.stroke();
  }
}

function updateStep() {
  stepDesc.textContent = steps[currentStep];
  draw();
}

nextStepBtn.addEventListener("click", () => {
  currentStep = (currentStep + 1) % steps.length;
  updateStep();
});

updateStep();
