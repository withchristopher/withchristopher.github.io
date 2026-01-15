# Migration plan: New `index.html` + `style.css` mimicking GitHub.com landing page

## Goals
- Replicate the **layout, flow, and scroll-driven transitions** of the GitHub.com landing page while using your branding and SVG hero asset.
- Add a **vertical “trainstop” navigation** on the left that illuminates the current section on scroll.
- Ensure **mobile-first responsiveness** and **fast loading**.

## 1) Discovery & audit (Day 0–1)
- Inventory current assets:
  - Identify existing hero SVG, fonts, images, and JS used in the landing page.
  - Determine what sections (content blocks) already exist vs. need to be created.
- Capture target behaviors:
  - Scroll-driven transitions and section reveals.
  - Sticky header and layout rhythm (spacing, typography scale).
  - On mobile, confirm how sections stack and how the left nav becomes a bottom/overlay pattern.

**Deliverable:** A written behavior checklist and a list of required sections.

## 2) Information architecture & section map (Day 1)
- Define sections (e.g., Hero, Features, Use Cases, Security, Testimonials, CTA, Footer).
- Assign each section a **unique `id`** for scroll targeting (e.g., `#hero`, `#features`).
- Decide on consistent **content containers** and vertical rhythm.

**Deliverable:** A section map and rough wireframe list.

## 3) Base HTML skeleton (Day 2)
- Create a **new `index.html`** with semantic structure:
  - `<header>` (navigation)
  - `<main>` with defined sections
  - `<footer>`
- Build a **left vertical nav** with anchor links and labels.
- Add data attributes used for JS (e.g., `data-section`, `data-animate`).

**Deliverable:** HTML structure with placeholders.

## 4) CSS architecture (Day 2–3)
- Create a new **`style.css`** with:
  - CSS custom properties for spacing, colors, typography.
  - Layout utilities (grid, container, section spacing).
  - Responsive breakpoints: `sm`, `md`, `lg`.
- Mirror GitHub landing transitions:
  - Sections fade + slight Y-translate on enter.
  - Hero SVG transitions in/out with opacity + transform.
- Add mobile-friendly adjustments:
  - Stack layout for hero and text.
  - Collapsible or bottom fixed nav for small screens.

**Deliverable:** Mobile-first CSS foundation.

## 5) Scroll-driven transitions (Day 3–4)
- Implement **IntersectionObserver** to:
  - Add `is-visible` class to sections as they enter view.
  - Update the left nav “trainstop” active indicator.
- Ensure transitions are **GPU-friendly** (`transform`, `opacity`).
- Respect `prefers-reduced-motion` for accessibility.

**Deliverable:** Smooth, accessible scroll reveal behavior.

## 6) Hero SVG transition (Day 4)
- Replace the current hero with your SVG.
- Add **in/out transitions** similar to GitHub’s landing hero:
  - On initial load: staggered opacity/transform.
  - On scroll: hero fades out while next section fades in.

**Deliverable:** SVG hero animation with scroll integration.

## 7) Performance & loading optimization (Day 4–5)
- Optimize for speed:
  - Compress images (AVIF/WebP where possible).
  - Inline critical CSS (optional) and defer non-critical JS.
  - Use `font-display: swap` for fonts.
  - Minimize layout shifts with reserved image dimensions.

**Deliverable:** Lighthouse-ready performance improvements.

## 8) QA & responsive testing (Day 5)
- Test across breakpoints:
  - 320px, 768px, 1024px, 1440px.
- Verify nav highlighting and scroll snapping.
- Confirm accessibility:
  - Keyboard nav, focus states, contrast.

**Deliverable:** QA checklist + fixes.

## 9) Rollout plan
- Stage change in a feature branch.
- Share preview link for review.
- Merge to main and monitor performance.

---

## Notes on implementation approach
- **Left trainstop nav**:
  - Use `position: fixed` left nav.
  - Each stop has a circle + label.
  - Use `IntersectionObserver` to add `active` class.
  - On mobile: collapse to top/bottom minimal nav.
- **Transitions**:
  - Use `opacity` + `translateY` for smooth flow.
  - Avoid heavy scroll listeners; prefer observers.
- **SVG hero**:
  - Consider CSS animations for group layers.
  - Keep transitions timed with scroll section entry.

---

## Proposed file changes
- `index.html` (new structure)
- `css/style.css` (new stylesheet)
- `js/main.js` (if needed for observers)
- `images/` (optimized assets)

---

If you want, I can implement the new `index.html` + `style.css` next based on this plan.
