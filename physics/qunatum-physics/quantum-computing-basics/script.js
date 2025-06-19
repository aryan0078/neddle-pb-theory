const canvas = document.getElementById("qc-canvas");
const ctx = canvas.getContext("2d");
const gateSelect = document.getElementById("gate");
const addGateBtn = document.getElementById("add-gate");
const resetBtn = document.getElementById("reset");

let gates = [];
let state = [1, 0]; // |0⟩

function applyGate(gate, state) {
  // state: [alpha, beta] for alpha|0⟩ + beta|1⟩
  switch (gate) {
    case "H": // Hadamard
      return [
        (state[0] + state[1]) / Math.sqrt(2),
        (state[0] - state[1]) / Math.sqrt(2),
      ];
    case "X": // Pauli-X
      return [state[1], state[0]];
    case "Z": // Pauli-Z
      return [state[0], -state[1]];
    default:
      return state;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw circuit
  ctx.strokeStyle = "#6366f1";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(50, 100);
  ctx.lineTo(550, 100);
  ctx.stroke();
  // Draw gates
  gates.forEach((g, i) => {
    ctx.fillStyle = "#a21caf";
    ctx.fillRect(100 + i * 80, 70, 40, 60);
    ctx.fillStyle = "#fff";
    ctx.font = "24px sans-serif";
    ctx.fillText(g, 112 + i * 80, 110);
  });
  // Draw state vector
  ctx.fillStyle = "#333";
  ctx.font = "18px sans-serif";
  ctx.fillText("Qubit state: " + stateLabel(state), 50, 180);
}

function stateLabel([a, b]) {
  a = Math.round(a * 100) / 100;
  b = Math.round(b * 100) / 100;
  return `${a}|0⟩ + ${b}|1⟩`;
}

addGateBtn.addEventListener("click", () => {
  const g = gateSelect.value;
  gates.push(g);
  state = [1, 0];
  for (const gate of gates) {
    state = applyGate(gate, state);
  }
  draw();
});

resetBtn.addEventListener("click", () => {
  gates = [];
  state = [1, 0];
  draw();
});

draw();
