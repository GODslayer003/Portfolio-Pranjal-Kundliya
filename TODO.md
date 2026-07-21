# TODO — Projects Experience Redesign

## Step 1 — New architecture files
- Create `client/src/sections/ProjectsExperience.jsx` (desktop + wheel navigation + GSAP timelines + progress + progress bar)
- Create `client/src/sections/ProjectsMobile.jsx` (mobile vertical experience + horizontal swipe snapping)
- Optionally create `client/src/hooks/useProjectsNavigator.js` if needed for wheel/keyboard consistency

## Step 2 — Replace section wiring
- Replace `client/src/sections/Projects.jsx` to render `ProjectsExperience` (and mobile switches)

## Step 3 — Styles from scratch
- Update `client/src/styles/index.css` with new Projects-only class architecture
  - Ensure desktop is exactly 1 viewport tall
  - No internal scrolling inside cards
  - Side cards scaling/blur/opacity/rotate
  - Grid-based hero layout

## Step 4 — GSAP animation implementation
- Implement entrance animation (scale/opacity/blur) when section is reached (IntersectionObserver)
- Implement card transition timeline on wheel/prev/next
- Implement image clip-path reveal + zoom
- Implement content stagger (0.08)
- Implement smooth progress fill
- Ensure GSAP context cleanup on unmount

## Step 5 — Accessibility + performance audit
- Focus states & keyboard navigation
- Reduced motion support
- Lazy-load images (already in assets)
- Confirm offscreen pause
- Ensure Three.js/background disposal if touched

## Step 6 — Final review polish
- Pixel alignment + spacing scale validation
- Senior FE review checklist (alignment/typography/contrast/button hierarchy/animation timing)

