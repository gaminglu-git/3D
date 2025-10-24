# 📥 Quick Texture Download Guide

## Option 1: Die App funktioniert auch ohne Texturen!

Die Anwendung ist **vollständig funktionsfähig ohne heruntergeladene Texturen**. Materialien werden als einfarbige Flächen dargestellt. Texturen verbessern nur die visuelle Qualität.

**Sie können die App sofort starten:**

```bash
npm run dev
```

## Option 2: Texturen manuell herunterladen

### Schnellstart (für alle Texturen):

1. **Besuchen Sie diese Seite:**
   - Gehen Sie zu https://ambientcg.com/list

2. **Suchen Sie nach den Materialien:**
   - Verwenden Sie die Suchfunktion oder Asset-IDs aus der Liste unten

3. **Download-Prozess für jedes Material:**
   - Klicken Sie auf das Material
   - Klicken Sie auf "Download"
   - Wählen Sie "2K-JPG"
   - Extrahieren Sie die ZIP-Datei
   - Kopieren Sie die Dateien in den entsprechenden Ordner

### Benötigte Materialien (10 Assets):

#### Wände (4 Materialien)

| Asset-ID      | Download-Link                                           | Zielordner              |
| ------------- | ------------------------------------------------------- | ----------------------- |
| Concrete034   | [Download](https://ambientcg.com/view?id=Concrete034)   | `public/textures/wall/` |
| Bricks074     | [Download](https://ambientcg.com/view?id=Bricks074)     | `public/textures/wall/` |
| WoodSiding013 | [Download](https://ambientcg.com/view?id=WoodSiding013) | `public/textures/wall/` |
| Concrete018   | [Download](https://ambientcg.com/view?id=Concrete018)   | `public/textures/wall/` |

#### Dächer (2 Materialien)

| Asset-ID | Download-Link                                      | Zielordner              |
| -------- | -------------------------------------------------- | ----------------------- |
| Tiles092 | [Download](https://ambientcg.com/view?id=Tiles092) | `public/textures/roof/` |
| Metal032 | [Download](https://ambientcg.com/view?id=Metal032) | `public/textures/roof/` |

#### Böden (2 Materialien)

| Asset-ID    | Download-Link                                         | Zielordner               |
| ----------- | ----------------------------------------------------- | ------------------------ |
| Concrete032 | [Download](https://ambientcg.com/view?id=Concrete032) | `public/textures/floor/` |
| Wood026     | [Download](https://ambientcg.com/view?id=Wood026)     | `public/textures/floor/` |

#### Fenster (1 Material)

| Asset-ID | Download-Link                                      | Zielordner                |
| -------- | -------------------------------------------------- | ------------------------- |
| Glass001 | [Download](https://ambientcg.com/view?id=Glass001) | `public/textures/window/` |

#### Türen (1 Material)

| Asset-ID | Download-Link                                     | Zielordner              |
| -------- | ------------------------------------------------- | ----------------------- |
| Wood049  | [Download](https://ambientcg.com/view?id=Wood049) | `public/textures/door/` |

### Datei-Umbenennung

Nach dem Extrahieren müssen Sie die Dateien umbenennen:

**Beispiel für Concrete034:**

```
Concrete034_2K_Color.jpg       → concrete-color.jpg
Concrete034_2K_NormalGL.jpg    → concrete-normal.jpg
Concrete034_2K_Roughness.jpg   → concrete-roughness.jpg
```

**Benennungsschema:**

- **Material-Name**: Kleinbuchstaben, Bindestriche statt Leerzeichen
  - `Concrete034` → `concrete`
  - `Bricks074` → `brick`
  - `WoodSiding013` → `wood-planks`
  - `Concrete018` → `aerated-concrete`
  - etc.

- **Map-Typen:**
  - `Color` → `-color.jpg`
  - `NormalGL` → `-normal.jpg`
  - `Roughness` → `-roughness.jpg`
  - `Metalness` → `-metalness.jpg` (nur für Metal032)

### Vollständige Umbenennung-Liste:

#### Wall

```bash
# Concrete034
Concrete034_2K_Color.jpg → concrete-color.jpg
Concrete034_2K_NormalGL.jpg → concrete-normal.jpg
Concrete034_2K_Roughness.jpg → concrete-roughness.jpg

# Bricks074
Bricks074_2K_Color.jpg → brick-color.jpg
Bricks074_2K_NormalGL.jpg → brick-normal.jpg
Bricks074_2K_Roughness.jpg → brick-roughness.jpg

# WoodSiding013
WoodSiding013_2K_Color.jpg → wood-planks-color.jpg
WoodSiding013_2K_NormalGL.jpg → wood-planks-normal.jpg
WoodSiding013_2K_Roughness.jpg → wood-planks-roughness.jpg

# Concrete018
Concrete018_2K_Color.jpg → aerated-concrete-color.jpg
Concrete018_2K_NormalGL.jpg → aerated-concrete-normal.jpg
Concrete018_2K_Roughness.jpg → aerated-concrete-roughness.jpg
```

#### Roof

```bash
# Tiles092
Tiles092_2K_Color.jpg → roof-tiles-color.jpg
Tiles092_2K_NormalGL.jpg → roof-tiles-normal.jpg
Tiles092_2K_Roughness.jpg → roof-tiles-roughness.jpg

# Metal032
Metal032_2K_Color.jpg → metal-roof-color.jpg
Metal032_2K_NormalGL.jpg → metal-roof-normal.jpg
Metal032_2K_Roughness.jpg → metal-roof-roughness.jpg
Metal032_2K_Metalness.jpg → metal-roof-metalness.jpg
```

#### Floor

```bash
# Concrete032
Concrete032_2K_Color.jpg → concrete-floor-color.jpg
Concrete032_2K_NormalGL.jpg → concrete-floor-normal.jpg
Concrete032_2K_Roughness.jpg → concrete-floor-roughness.jpg

# Wood026
Wood026_2K_Color.jpg → wood-floor-color.jpg
Wood026_2K_NormalGL.jpg → wood-floor-normal.jpg
Wood026_2K_Roughness.jpg → wood-floor-roughness.jpg
```

#### Window

```bash
# Glass001
Glass001_2K_Color.jpg → glass-color.jpg
Glass001_2K_NormalGL.jpg → glass-normal.jpg
Glass001_2K_Roughness.jpg → glass-roughness.jpg
```

#### Door

```bash
# Wood049
Wood049_2K_Color.jpg → wood-door-color.jpg
Wood049_2K_NormalGL.jpg → wood-door-normal.jpg
Wood049_2K_Roughness.jpg → wood-door-roughness.jpg
```

## Fortschritt prüfen

Nach dem Kopieren einiger Texturen können Sie den Status prüfen:

```bash
node scripts/download-textures.js
```

Das Script zeigt an:

- ✅ Wie viele Texturen vorhanden sind
- ❌ Welche Texturen noch fehlen

## Zeitaufwand

- **Minimal-Setup** (nur 2-3 Materialien): ~5 Minuten
- **Vollständiges Setup** (alle 10 Materialien): ~15-20 Minuten

## Lizenz-Hinweis

Alle Texturen von ambientCG sind **CC0-lizenziert** (Public Domain):

- ✅ Kostenlos für kommerzielle Nutzung
- ✅ Keine Attribution erforderlich
- ✅ Keine Einschränkungen

## Hilfe & Dokumentation

- **Detaillierte Dokumentation**: `TEXTURES.md`
- **Implementierungs-Details**: `TEXTURE_IMPLEMENTATION_SUMMARY.md`
- **Textur-Inventar**: `public/textures/README.md`

## Alternative: Stock-Texturen verwenden

Sie können auch andere CC0-Texturen von folgenden Quellen verwenden:

- **Poly Haven**: https://polyhaven.com/textures
- **3D Textures**: https://3dtextures.me/
- **ShareTextures**: https://sharetextures.com/

Wichtig: Benennen Sie die Dateien entsprechend dem Schema oben.

---

**Hinweis**: Die Anwendung funktioniert perfekt ohne Texturen. Texturen sind optional für eine verbesserte visuelle Darstellung!
