// Advanced 3D Black Hole Physics Simulator
// Physics constants
const G = 6.6743e-11; // Gravitational constant
const c = 299792458; // Speed of light
const h_bar = 1.054571817e-34; // Reduced Planck constant
const k_B = 1.380649e-23; // Boltzmann constant
const M_sun = 1.989e30; // Solar mass in kg
const sigma_SB = 5.670374419e-8; // Stefan-Boltzmann constant

// Scene setup
const container = document.getElementById("three-container");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Camera positioning
camera.position.set(15, 10, 15);

// Orbit controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 100;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// Black hole parameters
let blackHoleParams = {
  mass: 10, // Solar masses
  spin: 0.5, // Dimensionless spin parameter (a/M)
  accretionRate: 1.0, // Relative accretion rate
};

// Scene objects
let blackHole, accretionDisk, jets, particleSystem, gravitationalLensing;
let stars = [];

// Initialize the scene
function initScene() {
  // Add ambient lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
  scene.add(ambientLight);

  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(50, 50, 50);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Create starfield
  createStarfield();

  // Create black hole components
  createBlackHole();
  createAccretionDisk();
  createJets();
  createParticleEffects();
  createGravitationalLensing();

  // Set up UI controls
  setupUIControls();

  // Start animation
  animate();
}

// Create starfield background
function createStarfield() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    sizeAttenuation: false,
  });

  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );
  const starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);
}

// Create the black hole (event horizon)
function createBlackHole() {
  const radius = calculateSchwarzschildRadius();
  const geometry = new THREE.SphereGeometry(radius, 64, 64);

  // Create a completely black material with subtle distortion effects
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      spin: { value: blackHoleParams.spin },
    },
    vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            uniform float time;
            uniform float spin;
            
            void main() {
                vUv = uv;
                vPosition = position;
                
                // Add slight warping for rotating black holes
                vec3 pos = position;
                if (spin > 0.0) {
                    float angle = time * spin * 0.1;
                    pos.x = position.x * cos(angle) - position.z * sin(angle);
                    pos.z = position.x * sin(angle) + position.z * cos(angle);
                }
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
    fragmentShader: `
            uniform float time;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
                // Create complete darkness with subtle edge glow
                float distFromCenter = length(vUv - 0.5);
                float edgeGlow = 1.0 - smoothstep(0.45, 0.5, distFromCenter);
                
                gl_FragColor = vec4(0.1 * edgeGlow, 0.0, 0.2 * edgeGlow, 1.0);
            }
        `,
  });

  blackHole = new THREE.Mesh(geometry, material);
  scene.add(blackHole);
}

// Create accretion disk with temperature gradient
function createAccretionDisk() {
  const innerRadius = calculateSchwarzschildRadius() * 3;
  const outerRadius = innerRadius * 8;

  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64, 32);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      innerRadius: { value: innerRadius },
      outerRadius: { value: outerRadius },
      accretionRate: { value: blackHoleParams.accretionRate },
    },
    vertexShader: `
            varying vec2 vUv;
            varying float vDistance;
            uniform float time;
            uniform float innerRadius;
            
            void main() {
                vUv = uv;
                vDistance = length(position);
                
                // Add orbital motion
                vec3 pos = position;
                float orbitalSpeed = 1.0 / sqrt(vDistance);
                float angle = time * orbitalSpeed * 0.5;
                pos.x = position.x * cos(angle) - position.y * sin(angle);
                pos.y = position.x * sin(angle) + position.y * cos(angle);
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
    fragmentShader: `
            uniform float time;
            uniform float innerRadius;
            uniform float outerRadius;
            uniform float accretionRate;
            varying vec2 vUv;
            varying float vDistance;
            
            void main() {
                // Temperature gradient (hotter towards center)
                float normalizedDistance = (vDistance - innerRadius) / (outerRadius - innerRadius);
                float temperature = 1.0 - normalizedDistance;
                
                // Color based on temperature (blue-white hot to red-orange cool)
                vec3 hotColor = vec3(0.8, 0.9, 1.0); // Blue-white
                vec3 coolColor = vec3(1.0, 0.3, 0.1); // Red-orange
                vec3 color = mix(coolColor, hotColor, temperature);
                
                // Add turbulence
                float turbulence = sin(vDistance * 10.0 + time * 2.0) * 0.1 + 0.9;
                color *= turbulence;
                
                // Opacity based on accretion rate and distance
                float opacity = accretionRate * temperature * 0.7;
                
                gl_FragColor = vec4(color, opacity);
            }
        `,
    transparent: true,
    side: THREE.DoubleSide,
  });

  accretionDisk = new THREE.Mesh(geometry, material);
  accretionDisk.rotation.x = -Math.PI / 2;
  scene.add(accretionDisk);
}

// Create relativistic jets
function createJets() {
  const jetGeometry = new THREE.CylinderGeometry(0.2, 0.8, 20, 16);
  const jetMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      spin: { value: blackHoleParams.spin },
    },
    vertexShader: `
            varying vec2 vUv;
            uniform float time;
            
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform float time;
            uniform float spin;
            varying vec2 vUv;
            
            void main() {
                float intensity = sin(vUv.y * 20.0 + time * 10.0) * 0.3 + 0.7;
                vec3 color = vec3(0.2, 0.5, 1.0) * intensity * spin; // Blue jet color
                float opacity = spin * 0.8;
                
                gl_FragColor = vec4(color, opacity);
            }
        `,
    transparent: true,
  });

  // Top jet
  const topJet = new THREE.Mesh(jetGeometry, jetMaterial);
  topJet.position.y = 12;
  scene.add(topJet);

  // Bottom jet
  const bottomJet = new THREE.Mesh(jetGeometry, jetMaterial);
  bottomJet.position.y = -12;
  bottomJet.rotation.z = Math.PI;
  scene.add(bottomJet);

  jets = [topJet, bottomJet];
}

// Create particle effects for Hawking radiation
function createParticleEffects() {
  const particleCount = 5000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    // Random positions around black hole
    const radius = calculateSchwarzschildRadius() + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    // Random velocities
    velocities[i3] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

    // Color based on energy (Hawking radiation spectrum)
    const energy = Math.random();
    colors[i3] = energy; // Red
    colors[i3 + 1] = energy * 0.5; // Green
    colors[i3 + 2] = 1.0; // Blue
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

// Create gravitational lensing effect
function createGravitationalLensing() {
  const lensRadius = calculateSchwarzschildRadius() * 5;
  const geometry = new THREE.SphereGeometry(lensRadius, 64, 64);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
    },
    vertexShader: `
            varying vec3 vPosition;
            
            void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform float time;
            varying vec3 vPosition;
            
            void main() {
                float distFromCenter = length(vPosition);
                float lensing = 1.0 / (distFromCenter * distFromCenter + 1.0);
                
                gl_FragColor = vec4(0.3, 0.1, 0.5, lensing * 0.1);
            }
        `,
    transparent: true,
    side: THREE.BackSide,
  });

  gravitationalLensing = new THREE.Mesh(geometry, material);
  scene.add(gravitationalLensing);
}

// Physics calculations
function calculateSchwarzschildRadius() {
  // r_s = 2GM/c^2 (in kilometers for display)
  const M = blackHoleParams.mass * M_sun;
  return (2 * G * M) / (c * c) / 1000; // Convert to km for reasonable scale
}

function calculateHawkingTemperature() {
  const M = blackHoleParams.mass * M_sun;
  return (h_bar * c * c * c) / (8 * Math.PI * G * M * k_B);
}

function calculateEventHorizonArea() {
  const r_s = calculateSchwarzschildRadius() * 1000; // Convert back to meters
  return (4 * Math.PI * r_s * r_s) / 1e6; // Convert to km²
}

function calculateLifetime() {
  const M = blackHoleParams.mass * M_sun;
  return (5120 * Math.PI * G * G * M * M * M) / (h_bar * c * c * c * c);
}

// Update physics display
function updatePhysicsDisplay() {
  const r_s = calculateSchwarzschildRadius();
  const T_H = calculateHawkingTemperature();
  const A = calculateEventHorizonArea();
  const lifetime = calculateLifetime();

  document.getElementById("schwarzschildRadius").textContent = `${r_s.toFixed(
    1
  )} km`;
  document.getElementById("eventHorizonArea").textContent = `${A.toExponential(
    2
  )} km²`;
  document.getElementById("hawkingTemp").textContent = `${T_H.toExponential(
    2
  )} K`;
  document.getElementById("lifetime").textContent = `${(
    lifetime /
    (365.25 * 24 * 3600)
  ).toExponential(2)} years`;

  // Update tidal force indication
  const tidalForce =
    blackHoleParams.mass > 50
      ? "Extreme"
      : blackHoleParams.mass > 20
      ? "Very High"
      : "High";
  document.getElementById("tidalForce").textContent = tidalForce;
}

// Setup UI controls
function setupUIControls() {
  const massSlider = document.getElementById("massSlider");
  const spinSlider = document.getElementById("spinSlider");
  const accretionSlider = document.getElementById("accretionSlider");

  const massValue = document.getElementById("massValue");
  const spinValue = document.getElementById("spinValue");
  const accretionValue = document.getElementById("accretionValue");

  massSlider.addEventListener("input", (e) => {
    blackHoleParams.mass = parseFloat(e.target.value);
    massValue.textContent = blackHoleParams.mass;
    updateBlackHoleVisualization();
    updatePhysicsDisplay();
  });

  spinSlider.addEventListener("input", (e) => {
    blackHoleParams.spin = parseFloat(e.target.value);
    spinValue.textContent = blackHoleParams.spin;
    updateBlackHoleVisualization();
  });

  accretionSlider.addEventListener("input", (e) => {
    blackHoleParams.accretionRate = parseFloat(e.target.value);
    accretionValue.textContent = blackHoleParams.accretionRate.toFixed(1);
    updateBlackHoleVisualization();
  });

  // Initial display update
  updatePhysicsDisplay();
}

// Update visualization based on parameters
function updateBlackHoleVisualization() {
  // Update black hole size
  const newRadius = calculateSchwarzschildRadius();
  blackHole.scale.setScalar(newRadius / calculateSchwarzschildRadius());

  // Update shader uniforms
  if (blackHole.material.uniforms) {
    blackHole.material.uniforms.spin.value = blackHoleParams.spin;
  }

  if (accretionDisk.material.uniforms) {
    accretionDisk.material.uniforms.accretionRate.value =
      blackHoleParams.accretionRate;
  }

  // Update jets visibility based on spin
  jets.forEach((jet) => {
    jet.material.uniforms.spin.value = blackHoleParams.spin;
    jet.visible = blackHoleParams.spin > 0.1;
  });
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // Update shader uniforms
  if (blackHole.material.uniforms) {
    blackHole.material.uniforms.time.value = time;
  }

  if (accretionDisk.material.uniforms) {
    accretionDisk.material.uniforms.time.value = time;
  }

  jets.forEach((jet) => {
    if (jet.material.uniforms) {
      jet.material.uniforms.time.value = time;
    }
  });

  if (gravitationalLensing.material.uniforms) {
    gravitationalLensing.material.uniforms.time.value = time;
  }

  // Animate particles (Hawking radiation)
  if (particleSystem) {
    const positions = particleSystem.geometry.attributes.position.array;
    const velocities = particleSystem.geometry.attributes.velocity.array;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];

      // Reset particles that get too far
      const distance = Math.sqrt(
        positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2
      );
      if (distance > 50) {
        const radius = calculateSchwarzschildRadius() + Math.random() * 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
      }
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  // Update controls and render
  controls.update();
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Wait for all scripts to load before initializing
window.addEventListener("load", function () {
  console.log("Window loaded, checking for THREE and OrbitControls...");

  // Check if THREE is available
  if (typeof THREE === "undefined") {
    console.error("THREE.js not loaded!");
    return;
  }

  // Check if OrbitControls is available
  if (typeof THREE.OrbitControls === "undefined") {
    console.error("OrbitControls not loaded! Attempting to create fallback...");

    // Create a simple fallback for basic camera controls
    THREE.OrbitControls = function (camera, domElement) {
      this.camera = camera;
      this.domElement = domElement;
      this.enableDamping = true;
      this.dampingFactor = 0.05;
      this.minDistance = 5;
      this.maxDistance = 100;
      this.autoRotate = true;
      this.autoRotateSpeed = 0.5;

      let isMouseDown = false;
      let mouseX = 0,
        mouseY = 0;
      let theta = 0,
        phi = Math.PI / 2;
      let radius = 20;

      this.domElement.addEventListener("mousedown", (e) => {
        isMouseDown = true;
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      this.domElement.addEventListener("mousemove", (e) => {
        if (!isMouseDown) return;

        const deltaX = e.clientX - mouseX;
        const deltaY = e.clientY - mouseY;

        theta -= deltaX * 0.01;
        phi += deltaY * 0.01;
        phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));

        mouseX = e.clientX;
        mouseY = e.clientY;

        this.updateCameraPosition();
      });

      this.domElement.addEventListener("mouseup", () => {
        isMouseDown = false;
      });

      this.domElement.addEventListener("wheel", (e) => {
        radius += e.deltaY * 0.01;
        radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius));
        this.updateCameraPosition();
      });

      this.updateCameraPosition = () => {
        this.camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
        this.camera.position.y = radius * Math.cos(phi);
        this.camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
        this.camera.lookAt(0, 0, 0);
      };

      this.update = () => {
        if (this.autoRotate) {
          theta += this.autoRotateSpeed * 0.01;
          this.updateCameraPosition();
        }
      };
    };

    console.log("Fallback OrbitControls created");
  }

  console.log("All dependencies loaded, initializing scene...");
  // Initialize the scene
  initScene();
});
