#!/usr/bin/env node

/**
 * Texture Download Script
 *
 * Downloads CC0-licensed PBR textures from ambientCG and Poly Haven
 * for realistic building material visualization.
 *
 * Usage: node scripts/download-textures.js
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

const TEXTURES_DIR = path.join(__dirname, '../public/textures')

/**
 * Manual Download Instructions
 *
 * NOTE: Automatic downloads from ambientCG require authentication.
 * Please download textures manually from the websites below and place them
 * in the appropriate folders.
 *
 * This script will create a guide to help you download the textures manually.
 */
const TEXTURE_INSTRUCTIONS = {
  wall: [
    {
      name: 'concrete',
      source: 'ambientCG',
      assetId: 'Concrete034',
      url: 'https://ambientcg.com/view?id=Concrete034',
      maps: ['Color', 'NormalGL', 'Roughness'],
      instructions: 'Download 2K-JPG version, extract Color, NormalGL, and Roughness maps',
    },
    {
      name: 'brick',
      source: 'ambientCG',
      assetId: 'Bricks074',
      url: 'https://ambientcg.com/view?id=Bricks074',
      maps: ['Color', 'NormalGL', 'Roughness'],
      instructions: 'Download 2K-JPG version, extract Color, NormalGL, and Roughness maps',
    },
    {
      name: 'wood-planks',
      source: 'ambientCG',
      assetId: 'WoodSiding013',
      url: 'https://ambientcg.com/view?id=WoodSiding013',
      maps: ['Color', 'NormalGL', 'Roughness'],
      instructions: 'Download 2K-JPG version, extract Color, NormalGL, and Roughness maps',
    },
    {
      name: 'aerated-concrete',
      source: 'ambientCG',
      assetId: 'Concrete018',
      url: 'https://ambientcg.com/view?id=Concrete018',
      maps: ['Color', 'NormalGL', 'Roughness'],
      instructions: 'Download 2K-JPG version, extract Color, NormalGL, and Roughness maps',
    },
  ],
  roof: [
    {
      name: 'roof-tiles',
      source: 'ambientCG',
      assetId: 'Tiles092',
      url: 'https://ambientcg.com/view?id=Tiles092',
      maps: ['Color', 'NormalGL', 'Roughness'],
      instructions: 'Download 2K-JPG version, extract Color, NormalGL, and Roughness maps',
    },
    {
      name: 'metal-roof',
      source: 'ambientCG',
      assetId: 'Metal032',
      url: 'https://ambientcg.com/view?id=Metal032',
      maps: ['Color', 'NormalGL', 'Roughness', 'Metalness'],
      instructions:
        'Download 2K-JPG version, extract Color, NormalGL, Roughness, and Metalness maps',
    },
  ],
  floor: [
    {
      name: 'concrete-floor',
      source: 'ambientCG',
      assetId: 'Concrete032',
      url: 'https://ambientcg.com/view?id=Concrete032',
      maps: ['Color', 'NormalGL', 'Roughness'],
      instructions: 'Download 2K-JPG version, extract Color, NormalGL, and Roughness maps',
    },
    {
      name: 'wood-floor',
      source: 'ambientCG',
      assetId: 'Wood026',
      url: 'https://ambientcg.com/view?id=Wood026',
      maps: ['Color', 'NormalGL', 'Roughness'],
      instructions: 'Download 2K-JPG version, extract Color, NormalGL, and Roughness maps',
    },
  ],
  window: [
    {
      name: 'glass',
      source: 'ambientCG',
      assetId: 'Glass001',
      url: 'https://ambientcg.com/view?id=Glass001',
      maps: ['Color', 'NormalGL', 'Roughness'],
      instructions: 'Download 2K-JPG version, extract Color, NormalGL, and Roughness maps',
    },
  ],
  door: [
    {
      name: 'wood-door',
      source: 'ambientCG',
      assetId: 'Wood049',
      url: 'https://ambientcg.com/view?id=Wood049',
      maps: ['Color', 'NormalGL', 'Roughness'],
      instructions: 'Download 2K-JPG version, extract Color, NormalGL, and Roughness maps',
    },
  ],
}

/**
 * Generate manual download guide
 */
function generateDownloadGuide() {
  console.log('📥 TEXTURE DOWNLOAD GUIDE')
  console.log('═'.repeat(70))
  console.log('\nAutomatic downloads from ambientCG require manual steps.')
  console.log('Please follow the instructions below to download textures:\n')

  let textureCount = 0

  for (const [category, textures] of Object.entries(TEXTURE_INSTRUCTIONS)) {
    console.log(`\n📁 ${category.toUpperCase()}`)
    console.log('─'.repeat(70))

    for (const texture of textures) {
      textureCount++
      console.log(`\n${textureCount}. ${texture.name.toUpperCase()}`)
      console.log(`   Source: ${texture.source}`)
      console.log(`   URL: ${texture.url}`)
      console.log(`   Steps:`)
      console.log(`   a) Visit the URL above`)
      console.log(`   b) Click "Download" button`)
      console.log(`   c) Select "2K-JPG" format`)
      console.log(`   d) Extract the downloaded ZIP file`)
      console.log(`   e) Copy these files to public/textures/${category}/:`)

      texture.maps.forEach((mapType) => {
        const mapTypeLower = mapType.toLowerCase().replace('normalgl', 'normal')
        console.log(
          `      - ${texture.assetId}_2K_${mapType}.jpg → ${texture.name}-${mapTypeLower}.jpg`
        )
      })
    }
  }

  console.log('\n' + '═'.repeat(70))
  console.log('\n💡 QUICK ALTERNATIVE: Use Placeholder Textures')
  console.log('─'.repeat(70))
  console.log('The application will work with solid colors if textures are not downloaded.')
  console.log('Textures enhance visual quality but are not required for basic functionality.\n')
}

/**
 * Check for existing textures
 */
function checkExistingTextures() {
  let existingCount = 0
  let missingCount = 0
  const missing = []

  console.log('\n🔍 CHECKING EXISTING TEXTURES')
  console.log('═'.repeat(70))

  for (const [category, textures] of Object.entries(TEXTURE_INSTRUCTIONS)) {
    for (const texture of textures) {
      for (const mapType of texture.maps) {
        const mapTypeLower = mapType.toLowerCase().replace('normalgl', 'normal')
        const filename = `${texture.name}-${mapTypeLower}.jpg`
        const filepath = path.join(TEXTURES_DIR, category, filename)

        if (fs.existsSync(filepath)) {
          existingCount++
        } else {
          missingCount++
          missing.push(`${category}/${filename}`)
        }
      }
    }
  }

  console.log(`\n✅ Found: ${existingCount} texture files`)
  console.log(`❌ Missing: ${missingCount} texture files`)

  if (missingCount > 0 && existingCount === 0) {
    console.log('\n📋 All textures need to be downloaded.')
  } else if (missingCount > 0) {
    console.log('\n📋 Missing textures:')
    missing.slice(0, 10).forEach((file) => console.log(`   - ${file}`))
    if (missing.length > 10) {
      console.log(`   ... and ${missing.length - 10} more`)
    }
  } else {
    console.log('\n🎉 All textures are present!')
  }

  console.log('\n' + '═'.repeat(70))
  return { existingCount, missingCount }
}

/**
 * Create README in textures directory
 */
function createReadme() {
  const readmePath = path.join(TEXTURES_DIR, 'README.md')
  const content = `# Textures

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

- \`wall/\` - Wall materials (concrete, brick, wood, aerated concrete)
- \`roof/\` - Roof materials (tiles, metal)
- \`floor/\` - Floor materials (concrete, wood)
- \`window/\` - Glass materials
- \`door/\` - Door materials (wood)

## Usage

Textures are automatically loaded by the material system.
See \`src/lib/constants/materials.ts\` for material definitions.

## Re-downloading

To re-download textures, delete the desired files and run:
\`\`\`bash
node scripts/download-textures.js
\`\`\`

## Adding Custom Textures

You can add your own textures by placing them in the appropriate category folder.
Follow the naming convention: \`{material-name}-{map-type}.jpg\`
`

  fs.writeFileSync(readmePath, content)
  console.log('\n📄 Created README.md in textures directory')
}

// Run the script
;(async () => {
  try {
    const stats = checkExistingTextures()

    if (stats.missingCount > 0) {
      generateDownloadGuide()
    }

    createReadme()

    console.log('\n📚 For detailed information, see:')
    console.log('   - TEXTURES.md (complete documentation)')
    console.log('   - public/textures/README.md (texture inventory)\n')
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
})()
