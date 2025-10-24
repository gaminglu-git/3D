# Textures

This directory contains CC0-licensed PBR textures for building visualization.

## Sources

All textures are sourced from:

- **ambientCG** (https://ambientcg.com/) - CC0 License
- Resolution: 2K (2048x2048)
- Format: JPEG

## License

All textures in this directory are released under CC0 (Creative Commons Zero).
This means they are free to use for any purpose, including commercial projects,
without attribution (though attribution is appreciated).

## Maps Included

Each material includes:

- **Color Map** (Albedo/Diffuse)
- **Normal Map** (Surface details)
- **Roughness Map** (Surface smoothness)
- **Metalness Map** (where applicable)

## Categories

- `wall/` - Wall materials (concrete, brick, wood, aerated concrete)
- `roof/` - Roof materials (tiles, metal)
- `floor/` - Floor materials (concrete, wood)
- `window/` - Glass materials
- `door/` - Door materials (wood)

## Usage

Textures are automatically loaded by the material system.
See `src/lib/constants/materials.ts` for material definitions.

## Re-downloading

To re-download textures, delete the desired files and run:

```bash
node scripts/download-textures.js
```

## Adding Custom Textures

You can add your own textures by placing them in the appropriate category folder.
Follow the naming convention: `{material-name}-{map-type}.jpg`
