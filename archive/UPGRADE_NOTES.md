# Upgrade Notes - Kontextsensitive UI & Verbesserte 2D-Ansicht

## Neue Features (Oktober 2025)

### 1. Kontextsensitive Bibliothek (Smart Library)

**Konzept**: Die linke Bibliothek zeigt dynamisch die relevantesten Elemente basierend auf der aktuellen Selektion.

**Kontext-Logik**:

```
Nichts selektiert → Basis-Elemente (Wände, Boden erstellen)
Wand selektiert → Fenster, Türen, Öffnungen (logische nächste Schritte)
Dach selektiert → Dachfenster, Solar-Panels, Gauben
Floor selektiert → Treppen, Aufzüge zwischen Ebenen
Multi-Selektion → Verteilen, Ausrichten, Material übertragen
```

**Quick-Actions**:

- Element duplizieren (für selektiertes Element)
- Gleichmäßig verteilen (bei Multi-Selektion)
- Material übertragen (von einem zum anderen Element)

### 2. Verbesserte 2D-Ansicht

**Änderungen**:

- ❌ **Keine Rotation** in 2D-Modus (OrbitControls rotation disabled)
- ✅ **Nur Zoom und Pan** erlaubt
- ✅ **Floor-Level-Selector**: Auswahl einzelner Stockwerke
- ✅ **Horizontale Navigation**: EG, OG1, OG2, DG individuell ansehbar

**Implementierung**:

```typescript
// OrbitControls in 2D
enableRotate: viewMode === '3d'
enableZoom: true
enablePan: true
```

### 3. Floor-Level-System

**Stockwerk-Verwaltung**:

- Jedes Element hat `floorLevel: number` (0 = EG, 1 = OG1, etc.)
- In 2D nur aktives Level sichtbar
- Quick-Switcher: "EG | OG1 | OG2 | DG"
- Fading für andere Ebenen (optional)

**UI-Position**:

- Über der Bibliothek oder in der Toolbar
- Schnell erreichbar für häufigen Wechsel

## Implementierungspriorität

### Phase 1 (Sofort):

1. ✅ 2D-Rotation deaktivieren
2. ✅ Floor-Level-Selector UI
3. ✅ Filter nach aktiver Ebene in 2D

### Phase 2 (Dann):

1. Kontextsensitive Logik in Bibliothek
2. Hook: useContextualSuggestions
3. Dynamic Library Component

### Phase 3 (Polish):

1. Quick-Actions Panel
2. Element duplizieren
3. Material übertragen
4. Gleichmäßig verteilen

## Technische Details

### OrbitControls Config

```typescript
<OrbitControls
  enableRotate={viewMode === '3d'}  // Nur in 3D
  enableZoom={true}                 // Immer
  enablePan={true}                  // Immer
  maxPolarAngle={viewMode === '2d' ? Math.PI / 2 : Math.PI / 2}
/>
```

### Floor-Level Store

```typescript
interface BuildingState {
  activeFloorLevel: number // Aktuell angezeigte Ebene
  setActiveFloorLevel: (level: number) => void
  getVisibleElements: () => BuildingElement[] // Nur aktive Ebene
}
```

### Kontextuelle Vorschläge

```typescript
function useContextualSuggestions() {
  const selectedIds = useStore((state) => state.selectedElementIds)
  const elements = useStore((state) => state.elements)

  if (selectedIds.length === 0) return baseSuggestions
  if (selectedIds.length > 1) return multiSelectActions

  const selected = elements.find((e) => e.id === selectedIds[0])
  if (isWall(selected)) return wallSuggestions
  if (isRoof(selected)) return roofSuggestions

  return []
}
```

## Benefits

### User Experience:

- ✅ Weniger Clutter in der UI
- ✅ Relevante Tools immer griffbereit
- ✅ Schnellerer Workflow
- ✅ Weniger Scrollen in der Bibliothek

### Technisch:

- ✅ Klare Separation of Concerns
- ✅ Wiederverwendbare Kontext-Logik
- ✅ Einfach erweiterbar für neue Element-Typen

## Migration

Bestehende `DragDropLibrary` wird zu `SmartLibrary`:

- Wrapper um die alte Logik
- Zusätzliche Kontext-Awareness
- Backward compatible
