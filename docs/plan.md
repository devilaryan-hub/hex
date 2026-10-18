# Pip — The Midnight Nursery: implementation plan

## Product and approach

Build a complete, self-contained React + TypeScript + Vite frontend for the six-scene interactive storybook. The repository is empty apart from its Git metadata, so preserve that repository and create the app from scratch. Use native React state, semantic HTML, CSS keyframes/transforms, and `IntersectionObserver` for active-scene tracking. Keep normal browser scrolling; avoid scroll-jacking, unnecessary animation dependencies, backend services, external APIs, and remote visual assets. Use the user's approved Pip asset pack locally in `public/assets/` and compose the remaining environments from CSS and inline SVG. Keep the preview route at `/` and declare it in `public/manus-routes.json` before starting Vite.

## Design

- **Design movement:** Cinematic animated storybook—an illustrated night nursery staged like a sequence of quiet theatre sets.
- **Core principles:** narrative-first composition; warm lamplight against deep blue night; expressive but restrained character motion; discoverable, tactile controls.
- **Color philosophy:** midnight navy and twilight blue carry the night; amber and cream are reserved for meaningful light and story text; lavender is a small atmospheric accent. Use the supplied palette references (#101426, #171C35, #252C50, #797BA8, #A5A0C8, #F2BD78, #FFF3DF, #C2C3D3). Avoid neon, stark white, harsh gradients and excessive shadows.
- **Layout paradigm:** each chapter gets its own asymmetrical stage composition and horizon. Scroll links the scenes without trapping the visitor; a small fixed chapter rail marks position and provides direct jumps, with a compact touch-friendly mobile selector.
- **Signature elements:** a warm crescent-window motif; a slender constellation/thread line connecting chapter markers; amber points of light that mark clickable discoveries.
- **Interaction philosophy:** every object is a keyboard-operable button with a distinct, repeatable reaction. Hover and focus reveal affordance without hiding its name; repeat clicks are debounced through state rather than random dialogue.
- **Animation:** CSS transforms/opacity, slow atmospheric drift and gentle Pip breathing/blinks. Scene changes use the user's normal scroll. Reduce motion and particle density under `prefers-reduced-motion`; avoid continuous layout reads and clean up observer listeners.
- **Typography:** editorial Georgia/serif story headlines with a system sans-serif for navigation, captions and body copy; scale responsively and maintain readable line lengths.
- **Brand essence:** an intimate, interactive bedtime fable for curious visitors; dreamy, gentle, quietly wondrous.
- **Brand voice:** spare, warm, story-led. Examples: “Somewhere between sleep and starlight…” and “A little world is waiting to be discovered.”
- **Wordmark & logo:** a small crescent cradling a star, paired with a restrained “Pip / The Midnight Nursery” wordmark; no generic icon library.
- **Signature brand color:** warm nursery amber `#F2BD78`.

## Application structure

- `src/App.tsx`: compose scenes, global story state, scene observer, top-level controls and restart.
- `src/components/`: `PipCharacter`, `SceneNavigation`, `AudioControls`, `InteractionHint`, `StarField`, and reusable `InteractiveObject`.
- `src/scenes/`: `ArrivalScene`, `MeetPipScene`, `NurseryScene`, `DreamScene`, `SecretScene`, `EndingScene`.
- `src/hooks/`: scene intersection/navigation, Pip reaction state, reduced-motion preference and audio manager.
- `src/data/`: stable scene labels, story text and curated object reactions.
- `src/styles/`: tokens, global typography/layout, scene composition and motion/reduced-motion rules.
- `public/assets/`: the four approved Pip PNGs from the user-provided asset pack.
- `public/manus-routes.json`: the complete single-page route declaration.
- Root configuration: `package.json`, `pnpm-workspace.yaml`, `index.html`, `tsconfig.json`, `vite.config.ts`, `README.md`, and `app.config.ts`.

## State and integrations

Use local React state for active scene, Pip's current state, activated nursery objects, secret discovery, audio preference/volume, and replay. Scene navigation uses stable section IDs and smooth in-page links; replay resets discovery/reaction/audio preference state before returning to scene one. A small audio manager exposes `playAmbient(sceneId)`, `playInteraction(soundId)`, `playNarration(narrationId)`, `setMuted(boolean)`, and `setVolume(value)`. The uploaded pack contains no audio files; therefore the UI will clearly say audio tracks are not included, will not claim playback, and will gracefully return `false` when an optional track is absent. No credentials or backend are required.

## Portfolio extension

The existing storybook also serves as Pip’s portfolio. `src/data/portfolio.ts` owns Pip’s role, personality, description, tagline, and selected projects. `MeetPipScene` presents the profile details, while `NurseryScene` presents four showcase cards with CSS-only staggered entrance, floating symbol, hover lift, glow-ring, and reduced-motion fallbacks. The extension preserves the six-scene scroll narrative and introduces no new dependency or external asset.

## ElevenLabs audio extension

The frontend remains static and key-free: ElevenLabs-generated MP3s are checked into `public/audio/` and mapped from `src/data/audio.ts`. `useAudioManager` keeps one ambient player, one narration player, and a small keyed SFX pool; scene changes crossfade ambiences, narration plays once per story session, secret/ending moments add special cues, and browser autoplay is unlocked only by intentional user action. `AudioControls` exposes Sound, Music, Effects, and Narration levels with localStorage persistence. Missing or blocked files fail silently.
