# Contributing to Interactive Math & Physics Explorations

Thank you for your interest in contributing to this educational project! We welcome contributions that help make mathematical and physical concepts more accessible through interactive visualizations.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Steps to reproduce the problem
- Expected vs. actual behavior
- Browser and device information
- Screenshots (if applicable)

### Suggesting Enhancements

We welcome suggestions for:
- New mathematical or physics concepts to visualize
- Improvements to existing projects
- Better user interface designs
- Performance optimizations
- Educational content improvements

### Adding New Projects

When adding a new interactive project:

1. **Choose a suitable topic** that can be effectively visualized
2. **Create a new directory** under `maths/` or `physics/`
3. **Follow the structure**:
   ```
   your-project-name/
   ├── index.html
   ├── style.css (if needed)
   ├── script.js (if needed)
   └── README.md (optional)
   ```

4. **Project Requirements**:
   - Must be educational and interactive
   - Should work in modern browsers
   - Must be responsive (mobile-friendly)
   - Should include clear explanations
   - Must be self-contained (no external dependencies if possible)

5. **Update the main navigation**:
   - Add your project to `index.html`
   - Include appropriate description and emoji
   - Update the project count if needed

6. **Update documentation**:
   - Add your project to the main `README.md`
   - Categorize it appropriately

### Code Style Guidelines

#### HTML
- Use semantic HTML5 elements
- Include proper meta tags
- Ensure accessibility (alt tags, ARIA labels)
- Use meaningful class and ID names

#### CSS
- Use modern CSS (flexbox, grid)
- Make designs responsive
- Use consistent naming conventions
- Comment complex styles
- Avoid inline styles

#### JavaScript
- Use modern ES6+ features
- Write clean, readable code
- Add comments for complex logic
- Handle errors gracefully
- Optimize for performance

## 🛠️ Development Setup

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/neddle-pb-theory.git
   cd neddle-pb-theory
   ```

3. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Start a local server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

5. **Make your changes** and test thoroughly

6. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Test your changes in multiple browsers
- [ ] Ensure responsiveness on different screen sizes
- [ ] Check that all links work correctly
- [ ] Verify that the main navigation includes your project (if applicable)
- [ ] Update documentation as needed

### Pull Request Template
When creating a PR, please include:

**Description**
Brief description of changes made

**Type of Change**
- [ ] Bug fix
- [ ] New feature/project
- [ ] Enhancement
- [ ] Documentation update

**Testing**
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari/Edge
- [ ] Tested on mobile devices

**Screenshots**
Include screenshots for visual changes

## 🎯 Project Ideas

Looking for inspiration? Here are some project ideas:

### Mathematics
- Chaos Theory visualizations
- Fractal generators
- Statistical distributions
- Calculus concepts (derivatives, integrals)
- Graph theory algorithms
- Linear algebra transformations

### Physics
- Wave interference patterns
- Electromagnetic field visualizations
- Thermodynamics simulations
- Relativity effects
- Particle physics interactions
- Optics demonstrations

## 🏆 Recognition

Contributors will be recognized in:
- The project's README
- Individual project credits (where applicable)
- GitHub contributor statistics

## 📞 Questions?

If you have questions about contributing:
- Open an issue for discussion
- Check existing issues and pull requests
- Review the main README for project overview

Thank you for helping make science and mathematics more accessible through interactive learning! 🚀 