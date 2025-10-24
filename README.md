# 3D Building Viewer

Professional 3D building planning and visualization tool built with Next.js, React, and Three.js.

## Features

- 🏗️ **3D Building Modeling**: Create and edit walls, floors, roofs, windows, and doors
- 🎨 **Material Library**: Comprehensive library of building materials with physical properties
- 🖼️ **PBR Textures**: Realistic materials using CC0-licensed physically-based rendering textures
- 📐 **2D/3D Hybrid Views**: Switch between 2D floor plans and 3D visualization
- 🔧 **Expert Mode**: Access detailed thermal and physical properties
- 💾 **Undo/Redo**: Full history support for all changes
- 🎯 **Drag & Drop**: Intuitive drag & drop interface for placing building elements
- 📊 **U-Value Calculations**: Automatic thermal transmittance calculations

## Tech Stack

### Frontend

- **Next.js 14.2.15** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.6.3** - Type safety

### 3D Rendering

- **Three.js 0.169.0** - 3D engine
- **@react-three/fiber 8.17.10** - React renderer for Three.js
- **@react-three/drei 9.114.3** - Useful Three.js helpers
- **@react-three/postprocessing 2.16.3** - Post-processing effects
- **@react-three/rapier 1.4.0** - Physics engine

### State & Data

- **Zustand 5.0.0** - State management
- **Dexie 4.0.8** - IndexedDB wrapper
- **React Hook Form 7.53.0** - Form management
- **Zod 3.23.8** - Schema validation

### Styling

- **Tailwind CSS 3.4.14** - Utility-first CSS
- **Lucide React 0.451.0** - Icon library

## Getting Started

### Installation

```bash
npm install
```

### Download Textures (Optional)

**Note**: The application works perfectly without textures! Materials will display as solid colors.

For enhanced visual quality, automatically download CC0-licensed PBR textures:

```bash
python3 scripts/download-textures.py
```

This will automatically download and extract textures from ambientCG (~100MB).

**Alternative (Manual):**

```bash
node scripts/download-textures.js
```

Shows step-by-step manual download guide.

📚 **Quick Guide**: See [TEXTURE_DOWNLOAD_GUIDE.md](TEXTURE_DOWNLOAD_GUIDE.md)  
📖 **Full Documentation**: See [TEXTURES.md](TEXTURES.md)

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
3D/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── src/
│   ├── components/
│   │   ├── viewer/        # 3D scene components
│   │   ├── building/      # Building element components
│   │   └── ui/            # UI components
│   ├── lib/
│   │   ├── store/         # Zustand store
│   │   ├── types/         # TypeScript types
│   │   ├── constants/     # Constants and defaults
│   │   └── utils/         # Utility functions
│   └── hooks/             # Custom React hooks
└── public/                # Static assets
```

## Usage

### Creating a Building

1. Use the toolbar to select a tool (Wall, Window, Door, Roof)
2. Drag elements from the library panel
3. Click and drag in the 3D view to place elements
4. Select elements to edit properties in the right sidebar

### Editing Properties

1. Click on any building element to select it
2. Use the Properties panel to adjust dimensions
3. Switch to the Materials tab to change materials
4. Enable Expert mode for detailed physical properties

### Keyboard Shortcuts

- `V` - Select tool
- `W` - Wall tool
- `F` - Window tool
- `D` - Door tool
- `R` - Roof tool
- `Delete` - Delete selected element
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Tab` - Toggle 2D/3D view

## Material Properties

All materials include:

- **Visual properties**: Color, PBR textures (albedo, normal, roughness), metalness
- **Physical properties**: Density, thermal conductivity, heat capacity, thickness
- **Automatic U-value calculations**: Based on DIN 4108 standards

### Realistic Textures

The application uses high-quality PBR (Physically Based Rendering) textures from:

- **ambientCG** - Professional architectural materials
- **Poly Haven** - Photo-scanned surfaces
- All textures are CC0-licensed (public domain)

See [TEXTURES.md](TEXTURES.md) for complete documentation.

## Future Features

- PV panel planning and solar analysis
- Thermal simulation with EnergyPlus integration
- Home Assistant integration for real-time data
- Marketplace for local contractors
- IFC import/export
- Multi-user collaboration

## License

Copyright © 2024. All rights reserved.
