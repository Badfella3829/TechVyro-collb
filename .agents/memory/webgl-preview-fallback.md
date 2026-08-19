---
name: WebGL preview fallback
description: Rendering guidance for Three.js effects in Replit and automated browser previews.
---

Three.js decorations should treat WebGL as optional. A browser can expose WebGL globals while still refusing a renderer, especially in sandboxed or automated previews. Probe conservatively, release the probe context, and render a CSS fallback whenever the probe fails or the browser is automated.

**Why:** A failed decorative renderer can create unhandled browser errors or blank the page even though the core UI is healthy.

**How to apply:** Keep 3D effects isolated from primary content and never make page rendering depend on WebGL availability.