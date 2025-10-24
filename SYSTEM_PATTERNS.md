# System Patterns

Dieses Dokument beschreibt übergeordnete technische Muster und Architekturentscheidungen in diesem Projekt.

## 1. WebAssembly (WASM) Integration

**Problem:** Die Integration von WASM-Modulen, die für den Browser kompiliert wurden (z.B. `@dimforge/rapier3d`), ist in Next.js aufgrund von Server-Side Rendering (SSR) problematisch. Der Server versucht, den reinen Client-Code auszuführen, was zu Initialisierungsfehlern führt.

**Pattern / Lösung:**

1.  **Client-seitige Ausführung erzwingen:** Jede Interaktion mit dem WASM-Modul (insbesondere die Initialisierung) **muss** in einem `useEffect`-Hook innerhalb einer React-Komponente stattfinden, die mit `'use client'` markiert ist. Dies stellt sicher, dass der Code niemals auf dem Server ausgeführt wird.
2.  **Kompatibilitätspaket verwenden:** Bei hartnäckigen Bundler-Problemen sollte das `-compat`-Paket der Bibliothek verwendet werden (z.B. `@dimforge/rapier3d-compat`). Diese Pakete sind größer, aber robuster, da sie WASM direkt einbetten und weniger anfällig für Konfigurationsprobleme sind.
3.  **Asynchrone Ladekette beachten:** Der Initialisierungsstatus muss über einen zentralen State-Manager (z.B. `Zustand`) verwaltet werden. Komponenten, die von dem WASM-Modul abhängen, müssen auf den `isInitialized`-Status warten, bevor sie Aktionen ausführen, die das Modul benötigen.

**Beispiel:** `usePhysics`-Hook und `ViewerScene`-Komponente arbeiten zusammen, um die korrekte Lade- und Initialisierungssequenz sicherzustellen.


