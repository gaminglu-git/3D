#!/usr/bin/env python3
"""
Automatic Texture Downloader for 3D Building Viewer

Downloads CC0-licensed PBR textures from direct CDN links,
extracts them, and organizes them into the correct directory structure.

Usage: python3 scripts/download-textures.py
"""

import os
import sys
import zipfile
import urllib.request
import urllib.error
from pathlib import Path
from typing import Dict, List, Tuple

# Base directories
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
TEXTURES_DIR = PROJECT_DIR / 'public' / 'textures'

# Direct download URLs from ambientCG CDN
# Format: https://ambientcg.com/get?file=AssetID_Resolution-Format.zip
BASE_URL = "https://ambientcg.com/get?file="

# Material definitions with ambientCG Asset IDs
MATERIALS = {
    'wall': [
        {'name': 'concrete', 'asset_id': 'Concrete034', 'maps': ['Color', 'NormalGL', 'Roughness']},
        {'name': 'brick', 'asset_id': 'Bricks074', 'maps': ['Color', 'NormalGL', 'Roughness']},
        {'name': 'wood-planks', 'asset_id': 'WoodSiding013', 'maps': ['Color', 'NormalGL', 'Roughness']},
        {'name': 'aerated-concrete', 'asset_id': 'Concrete018', 'maps': ['Color', 'NormalGL', 'Roughness']},
    ],
    'roof': [
        {'name': 'roof-tiles', 'asset_id': 'Tiles092', 'maps': ['Color', 'NormalGL', 'Roughness']},
        {'name': 'metal-roof', 'asset_id': 'Metal032', 'maps': ['Color', 'NormalGL', 'Roughness', 'Metalness']},
    ],
    'floor': [
        {'name': 'concrete-floor', 'asset_id': 'Concrete032', 'maps': ['Color', 'NormalGL', 'Roughness']},
        {'name': 'wood-floor', 'asset_id': 'Wood026', 'maps': ['Color', 'NormalGL', 'Roughness']},
    ],
    'window': [
        {'name': 'glass', 'asset_id': 'Glass001', 'maps': ['Color', 'NormalGL', 'Roughness']},
    ],
    'door': [
        {'name': 'wood-door', 'asset_id': 'Wood049', 'maps': ['Color', 'NormalGL', 'Roughness']},
    ],
}


def print_header():
    """Print script header"""
    print("🎨 ambientCG Texture Downloader")
    print("=" * 70)
    print("Source: ambientCG (CC0 License)")
    print("Resolution: 2K")
    print("Format: JPG")
    print("=" * 70)
    print()


def create_directories():
    """Create necessary directory structure"""
    for category in MATERIALS.keys():
        category_dir = TEXTURES_DIR / category
        category_dir.mkdir(parents=True, exist_ok=True)
    print("✅ Directory structure created\n")


def download_file(url: str, dest: Path) -> bool:
    """Download a file from URL to destination with progress"""
    try:
        # Create request with proper headers
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Accept': 'application/zip,*/*'
        })
        
        with urllib.request.urlopen(req, timeout=120) as response:
            # Check if we got a valid response
            content_type = response.headers.get('Content-Type', '')
            if 'text/html' in content_type:
                print(f"   ❌ Got HTML instead of ZIP (asset may not exist)")
                return False
            
            total_size = int(response.headers.get('Content-Length', 0))
            
            with open(dest, 'wb') as f:
                downloaded = 0
                chunk_size = 32768  # 32KB chunks
                
                while True:
                    chunk = response.read(chunk_size)
                    if not chunk:
                        break
                    
                    f.write(chunk)
                    downloaded += len(chunk)
                    
                    if total_size > 0:
                        progress = (downloaded / total_size) * 100
                        mb_downloaded = downloaded / (1024 * 1024)
                        mb_total = total_size / (1024 * 1024)
                        print(f"\r   Progress: {progress:.1f}% ({mb_downloaded:.1f}MB / {mb_total:.1f}MB)", 
                              end='', flush=True)
                
                if total_size > 0:
                    print()  # New line after progress
        
        # Verify the file was downloaded and has content
        if dest.stat().st_size == 0:
            print(f"   ❌ Downloaded file is empty")
            dest.unlink()
            return False
            
        return True
    except urllib.error.HTTPError as e:
        print(f"\n   ❌ HTTP Error {e.code}: {e.reason}")
        return False
    except urllib.error.URLError as e:
        print(f"\n   ❌ Connection Error: {e.reason}")
        return False
    except Exception as e:
        print(f"\n   ❌ Error: {e}")
        return False


def extract_and_rename(zip_path: Path, category: str, material: Dict) -> Tuple[int, int]:
    """Extract ZIP and rename files to expected format"""
    extracted = 0
    skipped = 0
    
    try:
        # First, list files in ZIP
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            file_list = zip_ref.namelist()
            print(f"   📦 ZIP contains {len(file_list)} files")
            
            for map_type in material['maps']:
                # Find files matching this map type
                map_type_lower = map_type.lower().replace('normalgl', 'normal')
                
                # Try different possible naming patterns
                possible_patterns = [
                    f"{material['asset_id']}_2K_{map_type}.jpg",
                    f"{material['asset_id']}_2K-JPG_{map_type}.jpg",
                    f"{material['asset_id']}_2K_JPG_{map_type}.jpg",
                ]
                
                matching_file = None
                for pattern in possible_patterns:
                    matches = [f for f in file_list if pattern in f or f.endswith(pattern)]
                    if matches:
                        matching_file = matches[0]
                        break
                
                # If still not found, try case-insensitive search
                if not matching_file:
                    for f in file_list:
                        if map_type.lower() in f.lower() and f.endswith('.jpg'):
                            matching_file = f
                            break
                
                if matching_file:
                    target_filename = f"{material['name']}-{map_type_lower}.jpg"
                    target_path = TEXTURES_DIR / category / target_filename
                    
                    # Check if already exists
                    if target_path.exists() and target_path.stat().st_size > 0:
                        print(f"   ⏭️  {map_type_lower}: already exists")
                        skipped += 1
                        continue
                    
                    # Extract and save
                    with zip_ref.open(matching_file) as source:
                        with open(target_path, 'wb') as target:
                            target.write(source.read())
                    
                    size_mb = target_path.stat().st_size / (1024 * 1024)
                    print(f"   ✅ {map_type_lower}: extracted ({size_mb:.1f}MB)")
                    extracted += 1
                else:
                    print(f"   ⚠️  {map_type_lower}: not found in ZIP")
                    # Show first few files for debugging
                    if len(file_list) > 0:
                        print(f"      Available: {', '.join(file_list[:3])}")
    
    except zipfile.BadZipFile:
        print(f"   ❌ Invalid or corrupt ZIP file")
    except Exception as e:
        print(f"   ❌ Extraction error: {e}")
    
    return extracted, skipped


def download_material(category: str, material: Dict) -> Tuple[int, int]:
    """Download and process a single material"""
    print(f"\n📦 {material['name'].upper()} ({material['asset_id']})")
    
    # Check if all files already exist
    all_exist = True
    for map_type in material['maps']:
        map_type_lower = map_type.lower().replace('normalgl', 'normal')
        target_path = TEXTURES_DIR / category / f"{material['name']}-{map_type_lower}.jpg"
        if not target_path.exists() or target_path.stat().st_size == 0:
            all_exist = False
            break
    
    if all_exist:
        print(f"   ✅ All textures already present")
        return 0, len(material['maps'])
    
    # Construct download URL
    filename = f"{material['asset_id']}_2K-JPG.zip"
    download_url = f"{BASE_URL}{filename}"
    temp_zip = TEXTURES_DIR / f"temp_{material['asset_id']}.zip"
    
    print(f"   ⬇️  Downloading from ambientCG...")
    print(f"   URL: {download_url}")
    
    if download_file(download_url, temp_zip):
        # Extract and rename
        extracted, skipped = extract_and_rename(temp_zip, category, material)
        
        # Clean up ZIP
        try:
            temp_zip.unlink()
        except:
            pass
        
        return extracted, skipped
    else:
        return 0, 0


def main():
    """Main execution function"""
    print_header()
    
    # Create directories
    create_directories()
    
    # Statistics
    total_downloaded = 0
    total_skipped = 0
    total_failed = 0
    
    # Process each category
    for category, materials in MATERIALS.items():
        print(f"\n📁 {category.upper()}")
        print("─" * 70)
        
        for material in materials:
            extracted, skipped = download_material(category, material)
            total_downloaded += extracted
            total_skipped += skipped
            
            if extracted == 0 and skipped == 0:
                total_failed += len(material['maps'])
    
    # Summary
    print("\n" + "=" * 70)
    print("\n✨ Download Complete!")
    print(f"   ✅ Downloaded: {total_downloaded} texture files")
    print(f"   ⏭️  Skipped: {total_skipped} files (already exist)")
    
    if total_failed > 0:
        print(f"   ❌ Failed: {total_failed} files")
        print("\n💡 Note: Some assets may have been renamed or removed from ambientCG.")
        print("   Visit https://ambientcg.com/ to find alternative textures.")
    
    print("\n📝 All textures are CC0-licensed from ambientCG")
    print("   https://ambientcg.com/")
    
    if total_downloaded > 0:
        print("\n🎉 Textures are ready! Start the app with: npm run dev")
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Download interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
