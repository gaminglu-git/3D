# Anleitung: Erfolgreiches Rendern und Debugging im 3D Viewer

Dieses Dokument beschreibt den Prozess, um von den Gebäudedaten zu einem sichtbaren Objekt auf dem Three.js Canvas zu gelangen, sowie die bewährte Methode zur Fehlersuche, wenn Objekte nicht wie erwartet erscheinen.

## Teil 1: Wie wir erfolgreich rendern – Die Verbindung der Canvas-Funktionen

Der Rendering-Prozess ist eine Kette von Komponenten und Datenflüssen. Wenn ein Glied bricht, wird nichts angezeigt. So funktioniert die Kette, wenn alles korrekt ist:

1.  **Datenquelle (`buildingStore`)**:
    *   Alle Gebäudedaten (eine Liste von `elements`) werden zentral im `useBuildingStore` (Zustand) gehalten.
    *   Jedes Element hat eine `id`, `position`, `rotation`, `dimensions` und ein `visible: true` Flag.

2.  **Der Haupt-Renderer (`BuildingRenderer.tsx`)**:
    *   Diese Komponente abonniert den `buildingStore`.
    *   Sie iteriert (`.map()`) über die `elements`-Liste.
    *   **Erster Check**: Sie filtert alle Elemente heraus, bei denen `visible` auf `false` gesetzt ist.
    *   Für jedes sichtbare Element ruft sie die entsprechende Kind-Komponente auf (z.B. `<WallComponent />`) und übergibt die Elementdaten als `props`.

3.  **Die Element-Komponente (z.B. `WallComponent.tsx`)**:
    *   Empfängt die Daten (`wall`, `isSelected`, etc.) als `props`.
    *   **Geometrie & Position**: Sie berechnet aus den `props` die finalen Geometrie-Argumente (`[width, height, depth]`) und die Position/Rotation für das Three.js-Objekt.
    *   **Material & Textur**: Sie verwendet die `materialId` aus den `props`, um Materialeigenschaften zu laden. Der `useMaterialTextures`-Hook lädt die Bilddateien asynchron.
    *   **Rückgabe**: Die Komponente gibt ein Three.js-Objekt (`<mesh>`, `<group>`) zurück, das von React Three Fiber interpretiert wird. Wichtig ist hier, dass dieses Mesh eine `<boxGeometry />` (oder eine andere Geometrie) und ein `<meshStandardMaterial />` enthält.

4.  **Die Szene (`Scene.tsx`)**:
    *   Hier wird die grundlegende 3D-Welt erschaffen.
    *   **`<Canvas>`**: Das ist die Wurzel von allem. Es erstellt die WebGL-Renderumgebung.
    *   **Kamera & Lichter**: In der Szene müssen eine Kamera (um etwas zu sehen) und mindestens ein Licht (damit Materialien wie `meshStandardMaterial` sichtbar sind) platziert werden.
    *   **Einbindung**: Die `<BuildingRenderer />`-Komponente wird *innerhalb* der `<Canvas>`-Komponente platziert, wodurch alle ihre Kinder (die Wände, Böden etc.) Teil des Szenengraphen werden und gerendert werden können.

Wenn all diese Schritte erfolgreich verbunden sind, ist das Objekt auf dem Canvas sichtbar.

## Teil 2: Unsere bewährte Debugging-Methode

Wenn ein Objekt trotz korrekter Daten in der Konsole nicht erscheint, folgen wir diesem Prozess:

1.  **Szene validieren (Der "Rote-Box-Test")**:
    *   Fügen Sie eine simple `<mesh>` mit einem roten Material direkt in `Scene.tsx` ein.
    *   **Ergebnis**:
        *   **Box sichtbar**: Szene, Kamera & Licht sind OK. Das Problem liegt tiefer in der Komponentenhierarchie (`BuildingRenderer` oder Kinder).
        *   **Box unsichtbar**: Das Problem ist fundamental (Kamera, Licht, Canvas-Setup).

2.  **Komponente isolieren (Der "Pinke-Box-Test")**:
    *   Ersetzen Sie den gesamten Inhalt der problematischen Komponente (z.B. `WallComponent`) durch eine simple, pinke Box mit hartcodierten Dimensionen.
    *   **Ergebnis**:
        *   **Box sichtbar**: Die Verbindung von `BuildingRenderer` zu `WallComponent` funktioniert. Der Fehler liegt in der komplexen, ursprünglichen Logik der `WallComponent`.
        *   **Box unsichtbar**: Der Fehler liegt im `BuildingRenderer` oder wie er seine Kinder behandelt.

3.  **Inkrementell wiederherstellen**:
    *   Bauen Sie die Komplexität der Komponente schrittweise wieder auf und testen Sie nach jedem Schritt:
        1.  **Dynamische Geometrie & Position**: Ersetzen Sie die harten Werte der pinken Box durch die Berechnungen aus den `props`.
        2.  **Dynamisches Material**: Fügen Sie die Material- und Textur-Logik hinzu.
        3.  **Zusätzliche Logik**: Fügen Sie `useEffect`-Hooks, Event-Handler etc. hinzu.
    *   Der Schritt, bei dem das Objekt wieder verschwindet, enthält den Fehler.

## Teil 3: Fallstudie – Die unsichtbare Wand (PRO LÖSUNG)

Nach intensiver Fehlersuche wurde die "Render Unsichtbar Problematik" endgültig gelöst. Die Ursache war eine übermäßig komplexe und fehleranfällige Rendering-Logik in der `WallComponent`.

### Das Problem: Überkomplexität

Frühere Versionen der Komponente verwendeten eine Kombination aus einem äußeren `<group>`-Element für Position und Rotation und einem inneren `<mesh>`-Element, das zusätzlich intern verschoben wurde. Diese doppelte Transformation führte zu einem inkorrekten Drehpunkt (Pivot Point), was dazu führte, dass die Wände entweder an der falschen Stelle, falsch gedreht oder gar nicht (außerhalb des Kamera-Sichtfelds) gerendert wurden.

### Die PRO LÖSUNG: Direkte & einfache Transformation

Die bewährte und korrekte Lösung folgt dem einfachsten Prinzip von React Three Fiber und Three.js: **Wenden Sie Position und Rotation direkt auf das sichtbare Objekt an.**

**Kernprinzip:** Ein `<mesh>`-Element wird direkt mit den vom `WallTool` berechneten `position`- (dem Mittelpunkt) und `rotation`-Werten versehen.

```jsx
// WallComponent.tsx - Vereinfachtes Beispiel

return (
  <mesh
    position={[wall.position.x, wall.position.y, wall.position.z]}
    rotation={[wall.rotation.x, wall.rotation.y, wall.rotation.z]}
    // ... weitere props
  >
    <boxGeometry args={[width, height, depth]} />
    <meshStandardMaterial /* ... */ />
  </mesh>
);
```

### Warum diese Lösung funktioniert:

1.  **Ein Objekt, ein Zentrum:** Die `position`-Prop platziert den **Mittelpunkt** des `<mesh>`-Objekts exakt an der berechneten Koordinate.
2.  **Rotation um das Zentrum:** Die `rotation`-Prop dreht das `<mesh>`-Objekt um genau diesen Mittelpunkt.

Dieser Ansatz ist robust, weil er keine verschachtelten Transformationen verwendet, die zu unvorhersehbaren Ergebnissen führen können. Das `WallTool` liefert korrekte Daten für den Mittelpunkt, und die `WallComponent` wendet sie nun direkt und ohne verfälschende Zwischenschritte an.

**Merke:** Bei Rendering-Problemen immer zuerst den einfachsten Ansatz prüfen. Überkomplexe Transformationen sind eine häufige Fehlerquelle.

## Teil 4: Das "Geometric Center"-Prinzip – Unsere Goldene Regel

Nach der Lösung der initialen Rendering-Probleme haben wir zwei weitere, subtilere Fehler identifiziert und eine robuste, systemweite Lösungsstrategie entwickelt.

### Die Probleme: Asynchronität und inkonsistente Pivot-Punkte

1.  **Fehlende Textur bei der ersten Wand**: Die Texturen für die allererste erstellte Wand wurden nicht angezeigt, weil die Komponente bereits gerendert war, bevor der asynchrone Ladevorgang der Textur abgeschlossen war. Ein Re-Rendering wurde nicht ausgelöst.
2.  **Inkorrekter Gizmo-Pivot**: Das Transformationswerkzeug (Gizmo) wurde an der Oberkante der Wand anstatt in deren Mitte angezeigt, was zu unpräziser Manipulation führte.

### Die Lösung: Ein zentraler, konsistenter Angelpunkt

Die Wurzel beider Probleme war eine inkonsistente Handhabung der Elementposition. Die Lösung ist das **"Geometric Center"-Prinzip**, das nun als Goldene Regel für alle 3D-Elemente gilt:

**Die `position`-Eigenschaft eines Elements (`element.position`) repräsentiert IMMER seinen exakten geometrischen Mittelpunkt.**

Dieses Prinzip wird an drei entscheidenden Stellen konsequent umgesetzt:

1.  **Bei der Erstellung (`WallTool.tsx`)**: Das Werkzeug ist dafür verantwortlich, das Element von Anfang an korrekt zu positionieren. Bei einer Wand bedeutet das, dass ihre `y`-Position auf `DEFAULT_WALL.height / 2` gesetzt wird, anstatt auf dem Boden (`y: 0`).
2.  **Beim Rendern (`WallComponent.tsx`)**: Die Komponente verwendet die `position` des Elements direkt und ohne jegliche manuelle Offsets. Die visuelle Darstellung und der Datenpunkt sind identisch.
3.  **Bei der Interaktion (`EnhancedTransformControls.tsx`)**: Das Transformations-Gizmo wird ebenfalls direkt an die `position` des Elements gebunden, wodurch es exakt im Zentrum des Objekts erscheint.

Durch diese Vereinheitlichung sind das Datenmodell, der Physik-Collider und die interaktiven Werkzeuge perfekt synchronisiert.

### Die Lösung für asynchrone Texturen

Um das Problem der fehlenden Textur zu lösen, wurde der `useMaterialTextures`-Hook überarbeitet:

-   **Stateful Textures**: Der Hook verwendet nun `useState`, um das `textures`-Objekt zu verwalten.
-   **Trigger für Re-Rendering**: Wenn die Texturen fertig geladen sind, wird der State mit den neuen Texturen aktualisiert.
-   **Automatisches Update**: Diese State-Aktualisierung löst ein erneutes Rendern der `WallComponent` aus, die daraufhin die geladenen Texturen korrekt anzeigt.
-   **Lade-Feedback**: Während des Ladevorgangs (`status === 'loading'`) wird ein neutrales Platzhalter-Material angezeigt, was dem Benutzer sofortiges visuelles Feedback gibt.

Diese kombinierten Lösungen sorgen für ein robustes, vorhersagbares und visuell stabiles System.
