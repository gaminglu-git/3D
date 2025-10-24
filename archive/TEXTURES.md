# Texture Integration Guide

This document describes the texture system used in the 3D Building Viewer application for realistic material visualization.

## 📦 Texture Sources

All textures used in this project are sourced from reputable CC0-licensed providers:

### Primary Sources

#### 1. **ambientCG** (https://ambientcg.com/)

- **License**: CC0 (Public Domain)
- **Resolution**: 2K (2048×2048)
- **Quality**: Professional-grade PBR materials
- **Coverage**: Architecture, construction materials, natural surfaces

#### 2. **Poly Haven** (https://polyhaven.com/)

- **License**: CC0 (Public Domain)
- **Resolution**: Up to 8K available (we use 2K)
- **Quality**: Photo-scanned, high-fidelity textures
- **Coverage**: Wood, stone, metal, concrete

#### 3. **ShareTextures** (https://sharetextures.com/)

- **License**: CC0 (Public Domain)
- **Resolution**: 4K
- **Quality**: High-quality architectural textures
- **Coverage**: Building materials, surfaces

## 🎨 Available Texture Sets

### Wall Materials

| Material                          | Texture Files                                                                                 | Source    |
| --------------------------------- | --------------------------------------------------------------------------------------------- | --------- |
| **Beton (Concrete)**              | `concrete-color.jpg`, `concrete-normal.jpg`, `concrete-roughness.jpg`                         | ambientCG |
| **Ziegel (Brick)**                | `brick-color.jpg`, `brick-normal.jpg`, `brick-roughness.jpg`                                  | ambientCG |
| **Holzständerwand (Wood Planks)** | `wood-planks-color.jpg`, `wood-planks-normal.jpg`, `wood-planks-roughness.jpg`                | ambientCG |
| **Porenbeton (Aerated Concrete)** | `aerated-concrete-color.jpg`, `aerated-concrete-normal.jpg`, `aerated-concrete-roughness.jpg` | ambientCG |

### Roof Materials

| Material                    | Texture Files                                                                                           | Source    |
| --------------------------- | ------------------------------------------------------------------------------------------------------- | --------- |
| **Dachziegel (Roof Tiles)** | `roof-tiles-color.jpg`, `roof-tiles-normal.jpg`, `roof-tiles-roughness.jpg`                             | ambientCG |
| **Metalldach (Metal Roof)** | `metal-roof-color.jpg`, `metal-roof-normal.jpg`, `metal-roof-roughness.jpg`, `metal-roof-metalness.jpg` | ambientCG |

### Floor Materials

| Material                         | Texture Files                                                                           | Source    |
| -------------------------------- | --------------------------------------------------------------------------------------- | --------- |
| **Betondecke (Concrete Floor)**  | `concrete-floor-color.jpg`, `concrete-floor-normal.jpg`, `concrete-floor-roughness.jpg` | ambientCG |
| **Holzbalkendecke (Wood Floor)** | `wood-floor-color.jpg`, `wood-floor-normal.jpg`, `wood-floor-roughness.jpg`             | ambientCG |

### Window Materials

| Material  | Texture Files                                                | Source    |
| --------- | ------------------------------------------------------------ | --------- |
| **Glass** | `glass-color.jpg`, `glass-normal.jpg`, `glass-roughness.jpg` | ambientCG |

### Door Materials

| Material                | Texture Files                                                            | Source    |
| ----------------------- | ------------------------------------------------------------------------ | --------- |
| **Holztür (Wood Door)** | `wood-door-color.jpg`, `wood-door-normal.jpg`, `wood-door-roughness.jpg` | ambientCG |

## 🚀 Setup & Installation

### Automatic Download (Recommended)

Run the provided download script to automatically fetch all textures:

```bash
node scripts/download-textures.js
```

This script will:

- ✅ Download all required texture maps
- ✅ Organize them into appropriate categories
- ✅ Skip already downloaded files
- ✅ Create a README in the textures directory

### Manual Download

If you prefer to download textures manually:

1. Visit the texture source websites (ambientCG, Poly Haven, ShareTextures)
2. Download the 2K JPG versions of the textures
3. Place them in the corresponding subdirectories:
   - `public/textures/wall/`
   - `public/textures/roof/`
   - `public/textures/floor/`
   - `public/textures/window/`
   - `public/textures/door/`

## 📐 PBR Texture Maps

Each material uses Physically Based Rendering (PBR) with multiple texture maps:

### Color Map (Albedo/Diffuse)

- **Purpose**: Base color information
- **Format**: JPG, sRGB color space
- **Suffix**: `-color.jpg`

### Normal Map

- **Purpose**: Surface detail and depth
- **Format**: JPG, Linear color space
- **Suffix**: `-normal.jpg`
- **Type**: OpenGL format (not DirectX)

### Roughness Map

- **Purpose**: Surface smoothness/glossiness
- **Format**: JPG, Linear color space
- **Suffix**: `-roughness.jpg`
- **Range**: Black (smooth) to White (rough)

### Metalness Map (Optional)

- **Purpose**: Metallic properties
- **Format**: JPG, Linear color space
- **Suffix**: `-metalness.jpg`
- **Range**: Black (non-metal) to White (metal)

## 🔧 Technical Implementation

### Texture Loading

Textures are loaded automatically using the `useMaterialTextures` hook:

```typescript
import { useMaterialTextures } from '@/hooks/useMaterialTextures'

const material = getMaterial('concrete')
const textures = useMaterialTextures(material)
// Returns: { colorMap, normalMap, roughnessMap, metalnessMap }
```

### Material Configuration

Materials are defined in `src/lib/constants/materials.ts`:

```typescript
{
  id: 'concrete',
  name: 'Beton',
  category: 'wall',
  visual: {
    color: '#808080',                              // Fallback color
    texture: '/textures/wall/concrete-color.jpg',
    normalMap: '/textures/wall/concrete-normal.jpg',
    roughnessMap: '/textures/wall/concrete-roughness.jpg',
    roughness: 0.8,
    metalness: 0.1,
  },
  physical: {
    density: 2400,
    lambda: 2.1,
    heatCapacity: 1000,
    thickness: 0.24,
  }
}
```

### Three.js Integration

Textures are applied to meshes using `meshStandardMaterial`:

```typescript
<meshStandardMaterial
  map={textures.colorMap}
  normalMap={textures.normalMap}
  roughnessMap={textures.roughnessMap}
  metalnessMap={textures.metalnessMap}
  roughness={material.visual.roughness}
  metalness={material.visual.metalness}
/>
```

## 🎯 Performance Optimization

### Resolution Choice

- **2K (2048×2048)**: Optimal balance between quality and performance
- **File Format**: JPG for smaller file sizes
- **Compression**: Moderate compression to maintain quality

### Texture Caching

- Three.js TextureLoader automatically caches textures
- Textures are reused across multiple instances
- Proper disposal on component unmount

### Lazy Loading

- Textures load asynchronously
- Fallback to solid colors while loading
- No blocking of initial render

## 🎨 Adding Custom Textures

### Step 1: Prepare Texture Files

Ensure your textures follow the PBR workflow:

- Color map (sRGB color space)
- Normal map (OpenGL format)
- Roughness map (linear, grayscale)
- Optional: Metalness map (linear, grayscale)

### Step 2: Add to Directory

Place files in the appropriate category folder:

```
public/textures/{category}/{material-name}-{map-type}.jpg
```

### Step 3: Update Material Definition

Add/modify material in `src/lib/constants/materials.ts`:

```typescript
{
  id: 'my-custom-material',
  name: 'My Custom Material',
  category: 'wall', // or 'roof', 'floor', etc.
  visual: {
    color: '#808080',
    texture: '/textures/wall/my-custom-material-color.jpg',
    normalMap: '/textures/wall/my-custom-material-normal.jpg',
    roughnessMap: '/textures/wall/my-custom-material-roughness.jpg',
    roughness: 0.7,
    metalness: 0.0,
  },
  physical: {
    density: 2000,
    lambda: 1.5,
    heatCapacity: 1000,
    thickness: 0.2,
  }
}
```

## 📝 License Information

### CC0 (Creative Commons Zero) License

All textures are released under CC0, which means:

✅ **Allowed**:

- Commercial use
- Modification
- Distribution
- Private use

🎯 **No Requirements**:

- No attribution required (but appreciated)
- No copyright notices needed
- No license text inclusion required

### Attribution (Optional but Appreciated)

While not required, we recommend acknowledging sources:

```
Textures from ambientCG (https://ambientcg.com/) - CC0 License
Textures from Poly Haven (https://polyhaven.com/) - CC0 License
```

## 🔄 Updating Textures

To update or replace textures:

1. Delete the old texture files
2. Run the download script: `node scripts/download-textures.js`
3. Or manually replace files with new versions

The application will automatically load the new textures.

## 🐛 Troubleshooting

### Textures Not Loading

**Symptom**: Materials show solid colors instead of textures

**Solutions**:

1. Check that texture files exist in `public/textures/`
2. Verify file paths in material definitions
3. Check browser console for 404 errors
4. Ensure file names match exactly (case-sensitive)

### Performance Issues

**Symptom**: Slow rendering or low FPS

**Solutions**:

1. Reduce texture resolution (use 1K instead of 2K)
2. Convert to WebP format for better compression
3. Limit number of materials in scene
4. Enable texture compression in Three.js

### Missing Textures After Download

**Symptom**: Some textures didn't download

**Solutions**:

1. Check internet connection
2. Verify download script completed without errors
3. Manually download missing textures from source websites
4. Check that `public/textures/` directories exist

## 📚 Resources

### Learning Resources

- [PBR Guide by Marmoset](https://marmoset.co/posts/basic-theory-of-physically-based-rendering/)
- [Three.js Texture Documentation](https://threejs.org/docs/#api/en/textures/Texture)
- [ambientCG Documentation](https://help.ambientcg.com/)

### Texture Websites

- [ambientCG](https://ambientcg.com/) - Free PBR materials
- [Poly Haven](https://polyhaven.com/) - HDRIs, textures, models
- [ShareTextures](https://sharetextures.com/) - Community textures
- [3D Textures](https://3dtextures.me/) - More free textures

## 🤝 Contributing

To contribute new textures:

1. Ensure they are CC0 or public domain
2. Follow the naming convention
3. Include all PBR maps (color, normal, roughness)
4. Use 2K resolution and JPG format
5. Update this documentation
6. Submit a pull request

---

**Last Updated**: October 2025  
**Version**: 1.0.0
