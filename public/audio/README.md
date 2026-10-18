# Pip audio assets

These local MP3 assets were generated with ElevenLabs and are intentionally kept in the frontend as static files. No ElevenLabs key is shipped to the browser.

## Directory map

- `ambient/arrival.mp3`, `meet-pip.mp3`, `nursery.mp3`, `dream.mp3`, `secret.mp3`, `ending.mp3`: quiet 30-second loop-friendly instrumental beds.
- `narration/arrival.mp3`, `meet-pip.mp3`, `dream.mp3`, `secret.mp3`, `goodnight.mp3`: short chapter narrations.
- `sfx/lamp.mp3`, `window.mp3`, `bookshelf.mp3`, `musicbox.mp3`, `tiny-door.mp3`, `sleepy-toy.mp3`, `star.mp3`: one-shot nursery and discovery sounds.
- `pip/curious.mp3`, `happy.mp3`, `surprised.mp3`, `sleepy.mp3`, `dreaming.mp3`, `greeting.mp3`: subtle nonverbal Pip cues.

## Browser behavior

Audio never starts before an intentional user action. Entering the story, clicking Pip, activating an object, or changing Sound to On unlocks the audio context. Ambient beds crossfade over about one second; narration replaces earlier narration instead of stacking; SFX reuse a small keyed pool. Missing or blocked files fail silently and the visual story remains complete.

## Preferences

Muted state, master volume, music, effects, and narration volumes persist in `localStorage` under `pip-audio-preferences`. Temporary playback state does not persist.

## Regenerating or replacing a track

Use the same ElevenLabs voice and a short, restrained prompt. Save the replacement with the exact filename above, then run `pnpm typecheck` and `pnpm build`. To add a sound, add its file path to `src/data/audio.ts`, call the matching audio-manager method, and document the new file here. Narration scripts live in `src/data/narration.ts` and should remain original, concise, and complementary to the on-screen text.
