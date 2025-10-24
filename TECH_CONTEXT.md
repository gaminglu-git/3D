# Technology Context

Dieses Dokument beschreibt die Kerntechnologien, Bibliotheken und Frameworks, die in diesem Projekt verwendet werden.

## 1. Kern-Frameworks

- **Next.js:** React-Framework für die App-Struktur, Routing und Server-Side Rendering.
- **React:** Bibliothek für den Aufbau der Benutzeroberfläche.
- **Three.js:** 3D-Grafikbibliothek für das Rendern der Szene, der Gebäude und der Interaktionen im Canvas.

## 2. State Management

- **Zustand:** Ein einfacher, zentralisierter State-Manager für die Verwaltung des globalen Anwendungszustands (z.B. Gebäudedaten, UI-Status).

## 3. Physik-Engine

- **`@dimforge/rapier3d-compat`:** Die WebAssembly-basierte 3D-Physik-Engine, die für Kollisionserkennung und physikalische Simulationen verwendet wird.
  - **Wichtiger Hinweis:** Wir verwenden explizit das `-compat`-Paket, da es die robusteste Methode zur Integration in die Next.js-Umgebung darstellt und Bundler-Probleme vermeidet. Das Standard-Paket `@dimforge/rapier3d` hat sich als unzuverlässig erwiesen.

## 4. UI-Komponenten & Styling

- **Tailwind CSS:** Utility-first CSS-Framework für das Styling der Anwendung.
- **dnd-kit:** Bibliothek für Drag-and-Drop-Interaktionen.

## 5. Testing

- **Vitest:** Test-Framework für Unit- und Integrationstests.


