# Quick Start Guide

## Installation

```bash
# Clone or navigate to the project directory
cd /Users/johannakohler/Documents/3D

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## First Steps

### 1. Welcome Screen

When you first open the application, you'll see the Welcome Dialog with three options:

- **Neues Projekt**: Start with an empty building
- **Demo-Haus**: Load a pre-built example house to explore features
- **Projekt öffnen**: (Coming soon) Load a saved project

**Recommendation**: Start with "Demo-Haus" to see the features in action!

### 2. User Interface Overview

The interface consists of:

#### Top Toolbar

- Tool selection (Select, Wall, Window, Door, Roof)
- Undo/Redo buttons
- 2D/3D view toggle
- File operations (Save, Open, Settings)

#### Left Panel - Library

- Building elements organized by category
- Drag & drop (UI ready, full functionality coming soon)
- Expandable categories

#### Right Panel - Properties

Three tabs:

- **Eigenschaften**: Edit dimensions and basic properties
- **Materialien**: Browse and assign materials
- **Experte**: View detailed thermal and physical properties

#### Bottom Status Bar

- Shows element counts
- Selected elements indicator
- Building statistics

### 3. Creating Your First Wall

1. Press **W** or click the "Wand" tool in the toolbar
2. Click once in the 3D view to set the start point
3. Move your mouse to see a preview
4. Click again to set the end point and create the wall

### 4. Selecting and Editing Elements

1. Press **V** or click "Auswählen" to enable select mode
2. Click on any element to select it
3. Hold **Shift** and click to select multiple elements
4. The right panel will show properties you can edit
5. Press **Delete** to remove selected elements

### 5. Working with Materials

1. Select an element (e.g., a wall)
2. Go to the "Materialien" tab in the right panel
3. Click on a material to assign it
4. Materials include:
   - Visual properties (color, texture, roughness)
   - Physical properties (density, thermal conductivity)
   - Cost estimation (€/m²)

### 6. Expert Mode

1. Select an element
2. Go to the "Experte" tab
3. Toggle "Expertenmodus" on
4. View detailed physical properties:
   - Thermal conductivity (λ)
   - Density (ρ)
   - Heat capacity (c)
   - Calculated U-value with quality rating

## Keyboard Shortcuts

### Tools

- `V` - Select tool
- `W` - Wall tool
- `F` - Window tool (coming soon)
- `D` - Door tool (coming soon)
- `R` - Roof tool (coming soon)

### Actions

- `Ctrl + Z` - Undo
- `Ctrl + Y` - Redo
- `Delete` / `Backspace` - Delete selected elements
- `Esc` - Clear selection
- `Tab` - Toggle 2D/3D view (UI ready, full functionality coming soon)

## Tips & Tricks

### Navigation

- **Left Mouse**: Rotate camera (hold and drag)
- **Right Mouse**: Pan camera (hold and drag)
- **Mouse Wheel**: Zoom in/out
- **Shift + Wheel**: Fine zoom adjustment

### Grid & Snapping

- All elements snap to a 0.1m grid for precision
- The grid is infinite and follows your camera
- Section lines appear every meter for easy measurement

### Building Best Practices

1. Start with walls to define the perimeter
2. Ensure walls connect at corners
3. Add windows and doors after walls are placed
4. Apply appropriate materials for thermal calculations
5. Use Expert mode to verify U-values meet standards

### Material Selection

- **Walls**: Use "Ziegel" (brick) or "Porenbeton" for good insulation
- **Roofs**: "Dachziegel" (roof tiles) is standard
- **Windows**: "Dreifachverglasung" (triple glazing) for better insulation
- **Doors**: "Gedämmte Tür" (insulated door) for exterior entrances

## Understanding Physical Properties

### Lambda (λ) - Thermal Conductivity

- Measured in W/(m·K)
- Lower values = better insulation
- Good: < 0.2 | Average: 0.2-0.8 | Poor: > 0.8

### U-Value - Thermal Transmittance

- Calculated automatically: U = λ / thickness
- Measured in W/(m²·K)
- Excellent: < 0.2 | Good: 0.2-0.4 | Average: 0.4-1.0 | Poor: > 1.0

### Density (ρ)

- Measured in kg/m³
- Affects structural load and thermal mass
- Higher density = more thermal storage

## Demo Building

The demo building includes:

- 4 brick walls (10m x 10m footprint)
- Concrete slab floor
- Gabled roof with tiles
- Total area: 100m²
- Total volume: 280m³

Use it to:

- Practice selection and editing
- Test material assignments
- Learn the interface
- Experiment with thermal properties

## Troubleshooting

### Issue: Can't see the 3D scene

- Check that your browser supports WebGL
- Try a different browser (Chrome, Firefox, Edge)
- Update your graphics drivers

### Issue: Performance is slow

- Close other applications
- Reduce the number of elements
- Disable shadows in Scene settings (coming soon)

### Issue: Tool not working

- Make sure the correct tool is selected in the toolbar
- Check the tool icon is highlighted
- Press the keyboard shortcut again

### Issue: Can't select elements

- Switch to Select tool (press V)
- Make sure you're clicking on an element, not empty space
- Check the element is visible (not hidden)

## Next Steps

Once you're comfortable with the basics:

1. **Learn advanced features** (coming soon):
   - Window and door placement
   - Complex roof creation
   - Layer system for multi-layer walls
   - Custom materials

2. **Export your work**:
   - Save projects as JSON
   - Export for external use
   - IFC format (coming soon)

3. **Future features to explore**:
   - PV panel planning
   - Thermal simulation
   - Home Assistant integration
   - Marketplace for contractors

## Getting Help

- Check IMPLEMENTATION_STATUS.md for feature availability
- Review the README.md for technical details
- Keyboard shortcuts are shown in the Welcome Dialog
- Tooltips (coming soon) will provide inline help

## Development

To modify or extend the application:

```bash
# Format code
npm run format

# Lint code
npm run lint

# Build for production
npm run build
```

### Project Structure

- `/app` - Next.js pages and layouts
- `/src/components` - React components
- `/src/lib` - Business logic and utilities
- `/src/hooks` - Custom React hooks
- `/public` - Static assets

Enjoy building! 🏗️
