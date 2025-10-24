# Debugging-Prozess für Rendering-Probleme

Dieses Dokument beschreibt die Schritt-für-Schritt-Methode, die wir erfolgreich angewendet haben, um komplexe Rendering-Probleme zu diagnostizieren, bei denen Objekte in den Daten vorhanden sind, aber nicht auf dem Canvas erscheinen.

## 1. Hypothese aufstellen und isolieren

Das Ziel ist, das Problem auf einen möglichst kleinen Bereich einzugrenzen.

-   **Annahme**: Die Daten-Logik (z.B. im `buildingStore`) ist korrekt, wenn die Konsole die richtigen Objektdaten anzeigt.
-   **Test**: Fügen Sie ein extrem einfaches, hartcodiertes Test-Objekt (z.B. eine rote `<mesh>`) direkt in die Haupt-Szenenkomponente (`Scene.tsx`) ein.
-   **Ergebnis**:
    -   **Objekt sichtbar**: Die Szene, Kamera und Beleuchtung sind in Ordnung. Das Problem liegt in der Komponentenhierarchie (z.B. im `BuildingRenderer` oder dessen Kindern).
    -   **Objekt unsichtbar**: Das Problem ist fundamental und liegt in der Konfiguration von `Canvas`, Kamera oder der grundlegenden Szenen-Einrichtung.

## 2. Vereinfachen und verifizieren

Sobald der Problembereich isoliert ist (z.B. eine bestimmte Komponente wie `WallComponent`), ersetzen wir ihre Komplexität durch eine Minimal-Implementierung.

-   **Test**: Kommentieren Sie den gesamten internen Code der fehlerhaften Komponente aus und ersetzen Sie ihn durch die einfachstmögliche, sichtbare Darstellung (z.B. eine pinke Box mit hartcodierter Geometrie und Material).
-   **Ergebnis**:
    -   **Einfaches Objekt sichtbar**: Erfolg! Dies bestätigt, dass die Komponente an sich korrekt in der Hierarchie aufgerufen wird. Der Fehler muss in der komplexen Logik liegen, die wir entfernt haben (Geometrie-Berechnung, Material-Hooks, Event-Handler etc.).
    -   **Einfaches Objekt unsichtbar**: Der Fehler liegt eine Ebene höher – in der Art, wie die Eltern-Komponente dieses Kind aufruft oder behandelt.

## 3. Inkrementell wiederherstellen und neu bewerten

Dies ist der entscheidende Schritt, um die genaue Fehlerquelle zu finden. Fügen Sie die ursprüngliche Komplexität schrittweise wieder zur vereinfachten Komponente hinzu.

-   **Schritt 3a (Geometrie & Position)**: Ersetzen Sie die hartcodierte Geometrie und Position durch die dynamischen Berechnungen aus den `props`. Testen.
-   **Schritt 3b (Material & Texturen)**: Fügen Sie die Material-Logik und die `useMaterialTextures`-Hook wieder hinzu. Testen.
-   **Schritt 3c (Interaktivität)**: Fügen Sie Event-Handler (`onClick`), `useEffect`-Hooks für Raycasting etc. wieder hinzu. Testen.

Sobald die Komponente nach einem dieser Schritte wieder unsichtbar wird, haben wir den exakten Codeblock gefunden, der den Fehler verursacht.
