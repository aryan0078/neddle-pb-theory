# 🌌 Advanced 3D Black Hole Physics Simulator

A scientifically accurate, interactive 3D visualization of black holes with real-time physics calculations and stunning visual effects.

![Black Hole Simulator](https://img.shields.io/badge/Physics-Simulation-blue?style=for-the-badge)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-orange?style=for-the-badge)
![Mathematics](https://img.shields.io/badge/Mathematics-General%20Relativity-purple?style=for-the-badge)

## 🚀 Features

### 🎯 **Interactive 3D Visualization**
- **Realistic Event Horizon**: Completely black sphere with subtle gravitational effects
- **Temperature-Gradient Accretion Disk**: Dynamic visualization showing blue-white hot inner regions fading to red-orange outer regions
- **Relativistic Jets**: Appear and intensify based on black hole spin parameter
- **Hawking Radiation Particles**: 5000+ animated particles showing quantum radiation effects
- **Gravitational Lensing**: Subtle spacetime warping visualization around the black hole
- **Immersive Starfield**: 10,000 procedurally placed background stars

### 🎛️ **Real-Time Physics Controls**
- **Mass Slider**: Adjust black hole mass from 1-100 solar masses
- **Spin Parameter**: Control rotation (0-0.99) affecting jets and spacetime geometry
- **Accretion Rate**: Modify disk brightness and particle density
- **Live Physics Updates**: All parameters update the visualization in real-time

### 🧮 **Accurate Physics Calculations**
- **Schwarzschild Radius**: `r_s = 2GM/c²`
- **Hawking Temperature**: `T_H = ℏc³/(8πGMk_B)`
- **Event Horizon Area**: `A = 4πr_s²`
- **Black Hole Lifetime**: Evaporation time via Hawking radiation
- **Tidal Force Classification**: Categorized by mass (High/Very High/Extreme)

### 📐 **Floating Equation Panels**
Display of fundamental physics equations:
- **Schwarzschild Metric** (spacetime geometry)
- **Kerr Metric** (rotating black hole spacetime)
- **Einstein Field Equations** (general relativity)
- **Hawking Radiation** (quantum effects)
- **Bekenstein-Hawking Entropy** (thermodynamics)

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js (WebGL)
- **Mathematics**: MathJax (LaTeX equation rendering)
- **Styling**: Tailwind CSS, Custom CSS with Glassmorphism
- **Physics**: Custom implementation of general relativity equations

## 🎮 Controls

| Control | Action |
|---------|--------|
| **Mouse Drag** | Rotate camera around black hole |
| **Mouse Wheel** | Zoom in/out (5-100 units) |
| **Mass Slider** | Change black hole mass (1-100 solar masses) |
| **Spin Slider** | Adjust rotation parameter (0-0.99) |
| **Accretion Slider** | Modify disk activity (0.1-5.0) |
| **Auto-Rotate** | Automatic camera rotation (always active) |

## 🚀 Getting Started

### Prerequisites
- Modern web browser with WebGL support
- Internet connection (for CDN resources)

### Installation

1. **Clone or Download**
   ```bash
   git clone <repository-url>
   cd black-hole-3d
   ```

2. **Launch**
   ```bash
   # Simple HTTP server (Python 3)
   python -m http.server 8000
   
   # Or use Node.js
   npx http-server
   
   # Or simply open index.html in your browser
   ```

3. **Access**
   Open `http://localhost:8000` in your browser

## 📊 Physics Accuracy

### **Schwarzschild Black Holes**
- Accurate event horizon sizing based on mass
- Correct gravitational field visualization
- Realistic accretion disk physics

### **Kerr Black Holes (Rotating)**
- Spin-dependent jet formation
- Frame-dragging effects visualization
- Ergosphere representation

### **Quantum Effects**
- Hawking radiation particle simulation
- Temperature inversely proportional to mass
- Entropy calculations following Bekenstein-Hawking formula

### **General Relativity**
- Einstein field equations displayed
- Spacetime curvature visualization
- Gravitational lensing effects

## 🎨 Visual Effects

### **Advanced Shaders**
- Custom GLSL vertex and fragment shaders
- Real-time procedural animations
- Temperature-based color gradients

### **Particle Systems**
- 5000+ Hawking radiation particles
- Realistic orbital mechanics
- Energy-based color coding

### **Post-Processing**
- Gravitational lensing simulation
- Atmospheric glow effects
- Dynamic lighting system

## 🔧 Technical Details

### **Performance Optimizations**
- Efficient WebGL rendering
- Optimized shader compilation
- Smooth 60fps animations
- Responsive design for all screen sizes

### **Browser Compatibility**
- Chrome/Chromium (Recommended)
- Firefox
- Safari
- Edge

### **Dependencies**
- Three.js (r128) - 3D graphics library
- MathJax (v3) - Mathematical notation rendering
- Tailwind CSS - Utility-first CSS framework

## 📖 Educational Value

Perfect for:
- **Physics Students**: Visualizing general relativity concepts
- **Astronomy Enthusiasts**: Understanding black hole physics
- **Educators**: Teaching advanced physics concepts
- **Researchers**: Demonstrating spacetime geometry

## 🧪 Equations Implemented

### **Schwarzschild Metric**
```
ds² = -(1-2GM/c²r)c²dt² + dr²/(1-2GM/c²r) + r²dθ² + r²sin²θdφ²
```

### **Kerr Metric**
```
ds² = -(Δ-a²sin²θ)/ρ²c²dt² + 4GMar sin²θ/cρ² dtdφ + ρ²/Δ dr² + ρ²dθ² + sin²θ/ρ²[(r²+a²)²-a²Δsin²θ]dφ²
```

### **Einstein Field Equations**
```
Rμν - ½Rgμν + Λgμν = 8πG/c⁴ Tμν
```

### **Hawking Temperature**
```
TH = ℏc³/(8πGMkB)
```

### **Bekenstein-Hawking Entropy**
```
SBH = kBc³A/(4ℏG)
```

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional physics phenomena (tidal forces, spaghettification)
- More sophisticated rendering effects
- Mobile optimization
- VR/AR support

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Albert Einstein** - General Theory of Relativity
- **Stephen Hawking** - Hawking Radiation Theory
- **Karl Schwarzschild** - Schwarzschild Solution
- **Roy Kerr** - Kerr Metric for Rotating Black Holes
- **Three.js Community** - 3D Graphics Library
- **Physics Community** - Ongoing research and discoveries

## 📚 References

1. Misner, C. W., Thorne, K. S., & Wheeler, J. A. (1973). *Gravitation*
2. Hawking, S. W. (1974). "Black hole explosions?" *Nature*
3. Kerr, R. P. (1963). "Gravitational field of a spinning mass" *Physical Review Letters*
4. Schwarzschild, K. (1916). "Über das Gravitationsfeld eines Massenpunktes"

## 🌟 Future Enhancements

- [ ] Wormhole visualization
- [ ] Gravitational wave simulation
- [ ] Binary black hole systems
- [ ] Neutron star interactions
- [ ] Virtual reality support
- [ ] Advanced particle physics
- [ ] Real astronomical data integration

---

**Explore the Universe. Understand Gravity. Visualize Spacetime.**

*Made with ❤️ for physics education and scientific visualization* 