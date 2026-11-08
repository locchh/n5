# Implementation plan

Based on [SKETCH.md](SKETCH.md). About 1,000 lines in total (JSON data and tests not counted).

**Order:** build Setup first, then go top to bottom.

| Status | Part | What to build | Done when | Lines |
|---|---|---|---|---|
| ✅ | Engine | TypeScript types for the kinds we use; load `data/lessons/*.json`; one small helper that checks required fields for every kind; shuffle; save progress in the browser; 🔊 speech. Unit tests for the check (`npm test`) | The home page lists Lessons 4–10 from the JSON files, and a broken file shows a clear error | ~250 (actual ~400) |
| ✅ | Shared building blocks | Round player (shuffle, "12 / 40", resume, end screen), flip card, 4-choice quiz, build-the-sentence, 🔊 button, deck player (shows each card with the right component) | Each one works with real lesson data | ~180 (actual ~260) |
| ✅ | Activities | One shared builder for all flashcards (vocab, Kanji, grammar, sentences, numbers) → Kanji quiz → fill-the-blank → build the sentence → mixed test (reuses the same questions, flashcards turn into 4-choice) | You can study a real lesson with each one | ~150 (actual ~160) |
| ⬜ | Kana boards | ひらがな/カタカナ grids, tap a cell for 🔊, sound rules at the bottom | Every cell speaks | ~90 |
| ⬜ | Pages | Home with Continue and "cards known"; lesson page with the 5 kinds + activity buttons; routes | Close the app, reopen it, and Continue picks up where you stopped | ~120 |
| ⬜ | CSS | Big Japanese text, buttons pinned at the bottom near the thumb, one centered column. Few classes, reused everywhere | It's comfortable to use one-handed on your phone | ~120 |
| ✅ | Setup | Vue + TypeScript + Vite project, `package.json`, `tsconfig` | The app runs locally | ~70 |

## Decisions

- **"Again"**: the card comes back in the next round, not the same one. Every card appears once per round.
- **Mixed test**: about 10 questions picked from all lessons.
- **Kanji quiz**: asks the reading of a word (お父さん → おとうさん); Hán Việt is already on the Kanji cards.
- **Cards use slots**: FlipCard's front and back come from the parent, so one card fits every kind.
- **Style**: code inside `<script>` and `<style>` in `.vue` files is indented 2 spaces.
- **Voice**: the browser's built-in speech (free, no key). Better audio (e.g. VOICEVOX files made ahead of time) can come later; only `speak.ts` would change.
- **Tests**: Vitest, only where it earns its place (`check.ts` and the real lesson files).
- **Not built for now**: notes, readings, listening words and links on the lesson page; the "which sound did you hear" game; picking a deck by lesson + topic. The data is ready if we want them later.
