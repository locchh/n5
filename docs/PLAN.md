# Implementation plan

Based on [SKETCH.md](SKETCH.md). Steps are in the order we build them. JSON data not counted in lines.

| # | Status | Step | What to build | Done when | Lines (planned → actual) |
|---|---|---|---|---|---|
| 1 | ✅ | Setup | Build **the project setup**. It is the tooling and config (`package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `src/main.ts`), for running the app locally and building it | `npm run dev` shows the app | ~70 → ~80 |
| 2 | ✅ | Engine | Build **the engine**. It is the data layer, plain TypeScript with no UI (`src/engine/`: load, check, progress, shuffle, speak + tests), for loading and checking the lesson data, saving my progress, and speaking Japanese | The home page lists Lessons 4–10, and a broken file shows a clear error | ~250 → ~310 (+ ~95 tests) |
| 3 | ✅ | Shared UI components | Build **the shared UI components**. They are reusable Vue components (`src/components/`: flip card, 4-choice quiz, build the sentence, 🔊 button, deck player), for showing any card and sending back my answer, without knowing about lessons | Each one works with real lesson data | ~180 → ~260 |
| 4 | ✅ | Activities | Build **the activities**. It is the logic that turns lesson data into decks of cards (`src/activities.ts`: vocab, Kanji, grammar, sentences, numbers, Kanji reading, fill-the-blank, build the sentence, mixed test), for deciding which cards each activity shows | I can study a real lesson with each activity | ~150 → ~160 |
| 5 | ✅ | Pages | Build **the pages**. They are route pages plus the router (`src/router.ts`, `src/pages/`: Home, Lesson, Activity, Test), for moving around the app and continuing where I stopped | Close the app, reopen it, and Continue picks up where I stopped | ~120 → ~250 |
| 6 | ✅ | Kana boards | Build **the kana boards**. They are reference pages (`src/pages/KanaPage.vue`, data from `data/kana.json`), for looking up ひらがな/カタカナ and hearing them (tap a cell → 🔊) | Every cell speaks | ~90 → ~140 |
| 7 | ⬜ | CSS | Build **the stylesheet**. It is one global CSS file (`src/style.css`), for a layout that is comfortable one-handed on my phone | It's comfortable to use one-handed on my phone | ~120 |
| 8 | ⬜ | Deploy | Build **the deployment**. It is the hosting setup (`vercel.json` + the Vercel project), for opening the app on my phone from anywhere | The app opens from a home-screen bookmark on my phone | small |

## Decisions

- **"Again"**: the card comes back in the next round, not the same one. Every card appears once per round.
- **Mixed test**: about 10 questions from all lessons, a new pick on every visit. Still to add: a score at the end.
- **Kanji quiz**: asks the reading of a word (お父さん → おとうさん); Hán Việt is already on the Kanji cards.
- **Cards use slots**: FlipCard's front and back come from the parent, so one card fits every kind.
- **"Cards known"**: counts flashcards only, since only they get Got it / Again.
- **Kana boards**: grids in chart order (あ い う え お / や ゆ よ); the extended katakana (ティ, ファ, ヴュ…) are a simple row of buttons, since they don't fit a grid.
- **Style**: code inside `<script>` and `<style>` in `.vue` files is indented 2 spaces.
- **Voice**: the browser's built-in speech (free, no key). Better audio (e.g. VOICEVOX files made ahead of time) can come later; only `speak.ts` would change.
- **Tests**: Vitest, only where it earns its place (`check.ts` and the real lesson files).
- **Not built for now**: notes, readings, listening words and links on the lesson page; the "which sound did you hear" game; picking a deck by lesson + topic. The data is ready if we want them later.
