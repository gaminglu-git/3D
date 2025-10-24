# Debugging Guide: WebAssembly (WASM) Integration in Next.js

Dieses Dokument beschreibt die Lösung für ein hartnäckiges Problem bei der Integration von `@dimforge/rapier3d` (einem WebAssembly-basierten Physik-Modul) in unsere Next.js-Anwendung.

## Problembeschreibung

Die Anwendung stürzte bei der Initialisierung mit einer Kaskade von Fehlern ab, darunter:
- `TypeError: RAPIER.init is not a function`
- `TypeError: wasm.rawintegrationparameters_new is not a function`
- Warnungen wie `your target environment does not appear to support 'async/await'`

Obwohl die `next.config.js` mit `asyncWebAssembly: true` korrekt konfiguriert schien, scheiterte die Initialisierung des WASM-Moduls konsequent.

## Ursache

Das Kernproblem war, dass Next.js im Rahmen seines Server-Side Rendering (SSR) versucht hat, das Rapier-Modul auf dem **Server** zu laden und zu initialisieren. Rapier.js ist jedoch ein reines **Client-Side-Modul**, das für die Ausführung im Browser konzipiert ist. Die Node.js-Umgebung auf dem Server konnte das Modul nicht korrekt verarbeiten, was zu den unvollständigen Modul-Importen und den kryptischen Fehlermeldungen führte.

## Die endgültige Lösung

Die Lösung besteht aus drei Teilen, die zusammen die korrekte clientseitige Initialisierung sicherstellen:

### 1. Verwendung des Kompatibilitätspakets

Um alle Probleme mit dem Webpack-Bundler von Next.js zu umgehen, haben wir das Standard-Paket durch das offizielle Kompatibilitätspaket ersetzt:

- **Deinstalliert:** `@dimforge/rapier3d`
- **Installiert:** `@dimforge/rapier3d-compat`

Dieses Paket bettet den WASM-Code direkt in die JavaScript-Datei ein und ist die robusteste Methode für komplexe Bundler-Umgebungen.

### 2. Erzwingen der Client-Side-Initialisierung

Im `usePhysics`-Hook (`src/hooks/usePhysics.ts`) wird die Initialisierung der Physik-Engine in einen `useEffect`-Hook gekapselt. Dies garantiert, dass der Code **ausschließlich im Browser** ausgeführt wird, nachdem die Komponente gemountet wurde.

```typescript:src/hooks/usePhysics.ts
// ...
  useEffect(() => {
    // This effect ensures physics is initialized, but only on the client.
    if (!isInitialized) {
      physicsService.init()
    }
  }, [isInitialized])
// ...
```

### 3. Korrekte Initialisierungssequenz

Das `@dimforge/rapier3d-compat`-Paket **erfordert** einen expliziten `await RAPIER.init()`-Aufruf. Der `physicsService` (`src/lib/physics/physicsService.ts`) wurde entsprechend angepasst:

```typescript:src/lib/physics/physicsService.ts
// ...
const RAPIER = await import('@dimforge/rapier3d-compat')
await RAPIER.init()
this.RAPIER = RAPIER
this.world = new this.RAPIER.World({ gravity: { x: 0.0, y: 0.0, z: 0.0 } })
// ...
```

### 4. Anstoßen des Gebäude-Ladevorgangs

Nachdem die Physik-Engine erfolgreich initialisiert war, blieb die Anwendung im Ladebildschirm hängen. Der Grund war, dass der Prozess zum Laden der Gebäudedaten nie gestartet wurde.

Die Lösung war, in der `ViewerScene`-Komponente (`src/components/viewer/ViewerScene.tsx`) auf die erfolgreiche Initialisierung der Physik zu warten und dann das Laden der Gebäudedaten auszulösen:

```typescript:src/components/viewer/ViewerScene.tsx
// ...
  const { isPhysicsReady } = usePhysics()
  const loadDefaultBuilding = useBuildingStore((state) => state.loadDefaultBuilding)

  useEffect(() => {
    if (isPhysicsReady) {
      loadDefaultBuilding()
    }
  }, [isPhysicsReady, loadDefaultBuilding])
// ...
```

Diese Schritte stellen die korrekte, stabile und fehlerfreie Initialisierung der Physik-Engine in unserer Anwendung sicher.


