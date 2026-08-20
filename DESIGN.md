# WebGPU Smiley Face Design

## Experience flow
1. The visitor opens the page and immediately sees a centered canvas with a friendly yellow smiley.
2. The renderer initializes without requiring controls or setup.
3. Resizing the window preserves the face proportions and visual center.
4. If WebGPU is unavailable, the canvas area becomes a concise compatibility panel with guidance.

## Components
- **App shell:** full-viewport layout with a calm neutral background and clear project title.
- **Smiley canvas:** responsive square rendering surface with an accessible label.
- **Renderer status:** unobtrusive loading state while the GPU adapter and device initialize.
- **Compatibility panel:** readable fallback with a short explanation and supported-browser guidance.

## Visual system
Use a warm yellow face, dark eyes and smile, ample negative space, and strong contrast. Keep the composition playful but minimal. The canvas must remain sharp at high device-pixel ratios.

## Accessibility and responsiveness
The page uses semantic headings, visible text status, sufficient contrast, and no color-only status. The canvas is capped for large screens, padded on mobile, and remains centered in portrait or landscape layouts.