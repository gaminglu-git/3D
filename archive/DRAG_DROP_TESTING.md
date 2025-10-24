# Drag & Drop System - Test Guide

## ✅ Implementierung Abgeschlossen

### Architektur

- **Canvas-native Pointer Events** statt HTML5 Drag-Drop API
- **Continuous Raycasting** mit useFrame (60fps)
- **Dynamic Frameloop** (always während drag, demand sonst)
- **OrbitControls Management** (auto-disable während drag)

## Test-Checkliste

### Grundfunktionalität

- [ ] **Drag Start**: Mousedown auf Library-Item startet Drag
- [ ] **Cursor**: Cursor ändert sich zu "grabbing"
- [ ] **Preview**: 3D Preview-Mesh erscheint über Canvas
- [ ] **Tracking**: Preview folgt Maus smooth (60fps)
- [ ] **Grid Snap**: Preview snappt auf Grid
- [ ] **Drop**: Click platziert Element an Preview-Position
- [ ] **Cancel**: ESC-Taste bricht Drag ab

### Visuelle Feedback-Elemente

- [ ] Instruction Banner (oben, blau)
- [ ] Preview Mesh (semi-transparent, folgt Maus)
- [ ] Ground Ring Indicator (zeigt exakte Drop-Position)
- [ ] Grid Cell Highlight (unter Preview)
- [ ] Pulsing Ring Animation (zweiter Ring)
- [ ] Status Indicator (unten rechts, "Vorschau aktiv")

### OrbitControls Verhalten

- [ ] Zoom disabled während Drag
- [ ] Pan disabled während Drag
- [ ] Rotate disabled während Drag
- [ ] Alle Controls wieder enabled nach Drag

### Edge Cases

- [ ] Mehrere aufeinanderfolgende Drags
- [ ] Drag nach Zoom-Operation
- [ ] Drag nach Pan-Operation
- [ ] Drag nach Kamera-Rotation
- [ ] Mouseup außerhalb Canvas (sollte abbrechen)
- [ ] Window Resize während Drag
- [ ] 2D View Mode (sollte funktionieren)
- [ ] 3D View Mode (sollte funktionieren)

### Library-Komponenten

- [ ] SmartLibrary Items sind draggable
- [ ] DragDropLibrary Items sind draggable
- [ ] Beide Libraries verwenden pointer events
- [ ] Keine HTML5 drag events mehr

### Performance

- [ ] Frameloop wechselt zu "always" bei Drag Start
- [ ] Frameloop wechselt zurück zu "demand" bei Drag End
- [ ] Keine Frame-Drops während Drag
- [ ] Preview-Update smooth bei 60fps

### Debug Tools

- [ ] Shift+D togglet Debug Overlay
- [ ] Debug Overlay zeigt Drag State
- [ ] Debug Overlay zeigt Mouse Position
- [ ] Debug Overlay zeigt Item Data

### Console Logs

- [ ] "Drag started: [item]" bei Start
- [ ] "Placing element at: [position]" bei Drop
- [ ] "Element added: [element]" nach Erstellung
- [ ] "Drag ended" bei Ende
- [ ] "Drag cancelled by ESC" bei ESC
- [ ] Keine Fehler oder Warnings

## Test-Prozedur

### 1. Basic Drag & Drop

```
1. Öffne http://localhost:3001
2. Warte auf Welcome Dialog, erstelle Building
3. Klicke und halte auf "Standard Wand" in SmartLibrary
4. Erwartung: Cursor → grabbing, Banner erscheint
5. Bewege Maus über Canvas
6. Erwartung: Blaues Preview-Mesh folgt Maus, Ring auf Boden
7. Klicke auf Canvas
8. Erwartung: Wand wird platziert, Drag endet
```

### 2. Cancel Drag

```
1. Starte Drag wie oben
2. Drücke ESC-Taste
3. Erwartung: Drag abbricht, Preview verschwindet, Cursor normal
```

### 3. OrbitControls Test

```
1. Starte Drag
2. Versuche mit Maus zu zoomen (Scroll)
3. Erwartung: Zoom funktioniert nicht
4. Beende Drag (ESC oder Drop)
5. Versuche erneut zu zoomen
6. Erwartung: Zoom funktioniert wieder
```

### 4. Multiple Items

```
1. Platziere "Standard Wand"
2. Platziere "Flachdach"
3. Platziere "Tragende Wand"
4. Erwartung: Alle Items platziert, keine Fehler
```

### 5. Debug Overlay

```
1. Drücke Shift+D
2. Erwartung: Debug Overlay erscheint oben links
3. Starte Drag
4. Erwartung: Overlay zeigt "Dragging: YES", Item Name
5. Bewege Maus
6. Erwartung: Mouse X/Y aktualisieren sich
7. Drücke Shift+D erneut
8. Erwartung: Overlay verschwindet
```

## Bekannte Einschränkungen

1. **Windows/Doors**: Können nicht direkt gedroppt werden (müssen zu Wänden hinzugefügt werden)
2. **2D Mode**: Preview könnte in 2D-Ansicht anders aussehen
3. **Performance**: Bei sehr vielen Elementen könnte Preview leicht ruckeln

## Fehlerbehebung

### Preview erscheint nicht

- Prüfe Console auf Fehler
- Aktiviere Debug Overlay (Shift+D)
- Prüfe ob `isDragging` = YES
- Prüfe ob Item Data vorhanden

### Drag startet nicht

- Prüfe Console auf "Drag started" Log
- Prüfe ob Store-Funktionen verfügbar
- Prüfe Browser Console auf Fehler

### OrbitControls funktionieren nicht mehr

- Beende Drag mit ESC
- Reload Page (Ctrl+R)
- Prüfe Console auf Fehler

## Erfolgsmetriken

✅ **ERFOLGREICH** wenn:

- Alle Grundfunktionalität-Tests bestanden
- Keine Console Errors
- Smooth 60fps Performance
- Visual Feedback sichtbar und hilfreich
- OrbitControls korrekt managed

❌ **FEHLGESCHLAGEN** wenn:

- Preview erscheint nicht
- Drop funktioniert nicht
- Console Errors vorhanden
- Performance-Probleme
- OrbitControls blockiert

## Nächste Schritte (Optional)

1. **Animations**: Fade-in/out für Preview
2. **Sound**: Audio-Feedback bei Drop
3. **Snap Indicators**: Visuelle Snap-Points
4. **Collision Detection**: Verhindere Überlappung
5. **Undo/Redo**: Integration mit History System
6. **Touch Support**: Mobile/Tablet Drag & Drop
