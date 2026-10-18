# TODO — Pip: The Midnight Nursery

## Story scenes and complete narrative — Complete

- [x] Implement a connected six-scene experience (not a generic portfolio, linear video, or static mockup) visitors can explore at their own pace. Give the scenes clear boundaries, normal browser scrolling, smooth transitions, responsive heights, no scroll trapping, and no excessive scroll-jacking.
- [x] **The Midnight Arrival:** establish a nearly dark midnight environment with stars/particles, a softly illuminated nursery window, a small nursery in the distance and warm light drawing attention. Introduce “Somewhere between sleep and starlight...” and “A little world is waiting to be discovered.” Reveal Pip deliberately, quickly and skippably, with a button or scroll invitation.
- [x] **Meet Pip:** introduce the original baby-like Pip character with smooth rounded head, large expressive eyes, small features, gentle personality and memorable silhouette. Include a curated contextual reaction when clicked.
- [x] **Nursery Exploration:** create a layered illustrated nursery with recognizable, individually operable objects selected from the lamp, moon-shaped window, bookshelf, music box, floating star, sleeping toy and tiny door. Each object has a subtle hover/focus affordance, distinct activation response and contextual reveal/animation; the scene remains usable if visitors miss objects.
- [x] **Dream Sequence:** transition to a coherent surreal setting using a deliberate selection of floating islands, oversized flowers, drifting moon, glowing pathways, storybook pages, gentle clouds or tiny constellations. Scrolling reveals elements, adjusts layered parallax and lighting, transitions Pip's state and introduces story text without making the sequence excessively long or difficult to navigate.
- [x] **The Secret:** use an obvious visual clue/gentle hint to reveal a tiny glowing star Pip protects. Activation creates a quieter moment, illuminates the star, animates Pip emotionally and shows “Even the smallest light can make the darkest night feel like home.” Do not require a difficult/arbitrary puzzle or turn it into a conventional portfolio call to action.
- [x] **The Ending:** return to a peaceful nursery; show calm Pip, stars gradually appearing outside and “And just like that, the night found its little light.” Provide working “Revisit the nursery” and “Explore again” controls that return/replay without refreshing.

## Pip character and environmental interactions — Complete

- [x] Build Pip as a reusable original SVG/CSS or supplied-asset-backed character, never an emoji or unrelated character. Keep the identity consistent across scenes.
- [x] Provide intentional, interruptible `idle`, `curious`, `happy`, `surprised`, `sleepy` and `dreaming` states with restrained breathing, blinking, cursor gaze, head movements, floating and curiosity. Prevent interaction spam/glitches and support reduced motion.
- [x] Give every important visible control a real action and polished hover, focus, feedback and disabled states. Keep narrative dialogue curated, reproducible and non-random; do not use fake content or controls that do nothing.

## Scene navigation and story state — Complete

- [x] Provide minimal scene navigation that identifies the active scene, shows story position, synchronizes with scroll, supports jumps forward/back and returning to earlier scenes, and complements rather than competes with the artwork. Use a compact accessible mobile control and touch-friendly targets.
- [x] Track current scene; Pip state; activated environmental objects; discoveries; audio preference/volume; and replay/reset state. Navigation and replay must remain correct when moving forward, backward or jumping between scenes. Replay resets appropriate story state.
- [x] Scrolling stays available to the browser; scene transitions do not leave broken/overlapping content. No internal route may be broken.

## Audio-ready behavior — Complete

- [x] Provide a reusable audio manager/hook with ambient sound, interaction sounds, narration, enable/disable (mute) and volume methods/controls. Respect autoplay restrictions and only start sound after appropriate user interaction.
- [x] Use real audio only if available; this asset pack has no audio files, so gracefully report that tracks are not included and return safely for missing files. Do not claim nonexistent playback, require credentials, expose API keys, or call ElevenLabs directly from the browser. The story works fully without audio.

## Responsive design, accessibility and performance — Complete

- [x] Design deliberate layouts for desktop/laptop, tablet and mobile rather than shrinking desktop. Desktop supports cinematic layers and spacious editorial type; tablet rebalances overlap and parallax; mobile uses vertical storytelling, compact navigation, large touch targets, fewer particles, simplified layers/motion and no horizontal overflow. Keep all story content accessible on small screens.
- [x] Use semantic HTML, keyboard navigation, visible focus indicators, appropriate ARIA labels, accessible interactive objects, sufficient contrast, reduced-motion support and image descriptions where needed.
- [x] Prefer CSS transforms/opacity. Avoid unnecessary rerenders, continuous expensive layout calculations, excessive DOM particles and layout shifts. Clean up event listeners, observers and animation timelines; pause unnecessary effects; use requestAnimationFrame responsibly; keep ordinary laptop/mobile animation smooth and provide a static/reduced-motion fallback.

## Art direction, assets and maintainability — Complete

- [x] Preserve an animated-storybook art direction with soft lighting, deep midnight blues, warm amber light, muted lavender accents, cream highlights, subtle film grain, layered backgrounds, gentle atmospheric particles, soft-edged shapes and expressive character motion. Use the supplied reference palette (#101426, #171C35, #252C50, #797BA8, #A5A0C8, #F2BD78, #FFF3DF, #C2C3D3) and editorial serif + readable sans typography. Avoid generic SaaS, dashboards, standard portfolio sections, harsh/basic gradients, neon glow, excessive UI, excessive glass, repetitive cards, unnecessary shadows, generic stock photography and unrelated/copyrighted characters.
- [x] Inspect/reuse the user-provided approved Pip asset pack for the portrait and interactive environment elements. Use local assets; no unstable third-party image URLs. Build coherent layered CSS/SVG alternatives rather than empty scenes. Organize assets clearly.
- [x] Keep scene/story/interaction configuration separate from reusable visuals where useful. Maintain a simple reliable state model; avoid Redux or unnecessary abstractions/dependencies. Use React + TypeScript + Vite if no existing app; use Tailwind only where appropriate, one animation approach if needed, Lucide only if useful, HTML Audio API for sound-ready behavior; do not introduce duplicate/heavy libraries or unjustified Three.js.

## Complete, demonstrable frontend — Complete

- [x] Preserve functioning existing code/config/assets; inspect the repository first. Finish the working application, not only a plan, snippets or mockup; do not stop after the opening screen or leave unfinished placeholders.
- [x] Demonstrate all six scenes and interactions without external APIs or backend credentials; verify app startup, TypeScript diagnostics/check, production build, controls, navigation, replay, responsive layout, console and missing asset handling. Fix blocking errors. Report only checks actually run and their actual outcomes.
- [x] Final criteria: app starts; six scenes complete; cinematic opening; consistent Pip with multiple working states; working nursery interactions; meaningful dream depth; working secret; satisfying ending; functional synchronized navigation and normal scrolling; no broken/overlapping scenes; replay resets correctly; honest missing-audio controls; no frontend secrets; desktop/tablet/mobile responsive; reduced-motion and keyboard support; no broken internal routes/missing required components/obvious console errors; production build succeeds; hackathon demo works without external API.


## Evidence

- `pnpm typecheck` passed.
- `pnpm build` passed and produced `dist/index.html`.
- The live preview served the app shell and `public/manus-routes.json` with HTTP 200.
- All four supplied local Pip assets returned HTTP 200.
- Chapter scroll targets now reserve space for the fixed header on desktop and mobile.

## Portfolio extension — Complete
- [x] Added Pip’s portfolio identity: cute baby-like appearance description, curious/sleepy/clumsy/easily delighted personality, Junior Dream Engineer role at the Midnight Nursery, and the tagline “I build the dreams you fall asleep inside.”
- [x] Added four showcase projects: The Lullaby Lab, Nightlight Collection, Dream Delivery Routes, and Bedtime Storybook.
- [x] Added lightweight multi-layer CSS motion: staggered portfolio-card entrance, floating project symbols, hover lift/tilt, animated orbit rings, and reduced-motion fallbacks across responsive layouts.

## ElevenLabs cinematic audio — Complete
- [x] Generated and stored six ambient beds, five concise narrations, seven nursery SFX, and six subtle Pip reaction cues under `public/audio/`.
- [x] Added centralized scene/audio mappings and narration scripts without shipping an API key or adding a backend.
- [x] Upgraded the audio manager with intentional-action unlock, ambient crossfade, separate narration/SFX/ambient handling, reusable player pooling, special story cues, replay cleanup, and graceful blocked/missing-file behavior.
- [x] Added accessible Sound, Music, Effects, and Narration controls with persisted preferences and reduced-motion-safe fade behavior.
- [x] Verified `pnpm typecheck`, `pnpm build`, the route manifest, and representative HTTP 200 responses for local audio assets.
