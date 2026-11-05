# Implementation plan

Based on [SKETCH.md](SKETCH.md). About 1,500–2,000 lines in total (JSON data not counted).

**Order:** build Setup first, then go top to bottom.

| Part | What to build | Done when | Lines |
|---|---|---|---|
| Engine | TypeScript types from `DATA_MODEL.md`; load and check `data/lessons/*.json`; shuffle a round; save progress in the browser; 🔊 speech helper | The home page lists Lessons 4–10 from the JSON files, and a broken file shows a clear error | ~300 |
| Shared building blocks | Flip card, 4-choice quiz, "12 / 40" progress bar | Each one works on a test page with fake data | ~150 |
| Activities | 4 flip-card activities (vocab, Kanji, grammar, sentences) → Kanji quiz → numbers drill → fill-the-blank → build the sentence → mixed test | You can study a real lesson with each one | ~500 |
| Kana boards | ひらがな/カタカナ grids, tap a cell for 🔊, sound rules at the bottom | Every cell speaks | ~120 |
| Pages | Home with Continue and "cards known", lesson summary, activity buttons, routes | Close the app, reopen it, and Continue picks up where you stopped | ~250 |
| CSS | Big Japanese text, buttons near the thumb, one centered column | It's comfortable to use one-handed on your phone | ~150 |
| Setup | Vue + TypeScript + Vite project, `package.json`, `tsconfig` | The app runs locally | ~50 |
