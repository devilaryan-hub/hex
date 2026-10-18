# Pip — The Midnight Nursery

A six-scene interactive storybook built with React, TypeScript, and Vite. The story uses the approved Pip illustrations supplied in `public/assets/` and CSS/SVG environmental art. No backend, account, or external API is needed.

## Run locally

```sh
pnpm install
pnpm dev
```

Open `http://localhost:3000`. For a production build, run `pnpm build`; preview the generated build with `pnpm preview`.

## Pip portfolio

The story now doubles as Pip’s whimsical portfolio. Meet Pip as a Junior Dream Engineer at the Midnight Nursery, with the tagline “I build the dreams you fall asleep inside.” The nursery chapter includes animated showcase cards for The Lullaby Lab, Nightlight Collection, Dream Delivery Routes, and Bedtime Storybook.


## Audio architecture

The story now uses 24 local ElevenLabs-generated MP3 assets: six quiet scene ambiences, five chapter narrations, seven nursery interaction sounds, and six subtle Pip reaction cues. `src/data/audio.ts` is the centralized asset map, `src/data/narration.ts` stores the original scripts, and `useAudioManager` owns the frontend-only mixer. It crossfades ambient beds, replaces overlapping narration, reuses keyed one-shot players, applies independent master/music/effects/narration volumes, and persists preferences under `pip-audio-preferences`.

Audio never autoplays before an intentional user action. Entering the story, clicking Pip, activating an object, or switching Sound on unlocks playback; browser playback failures remain silent and the complete visual story remains usable without sound. The generated files and replacement instructions live in `public/audio/README.md`. To replace a track, regenerate it with ElevenLabs using the same restrained brief and exact filename, then run `pnpm typecheck` and `pnpm build`.

## Explore

Scroll normally through six chapters or use the scene navigator to jump directly. Click Pip and the nursery objects for curated, repeatable reactions. Find the small star in the secret scene. The ending offers a nursery revisit and a full replay that resets discoveries. The scene remains usable with reduced motion and by keyboard.

## Audio

This asset pack does not include sound files. The audio manager accepts optional local ambient, interaction, and narration tracks, but missing tracks return safely and the controls state clearly that no audio is included; nothing is played or claimed to play in this build.

The source is organized under `src/components`, `src/scenes`, `src/hooks`, `src/data`, and `src/styles`. The original asset-pack usage note is retained in `public/assets/README.txt`.
