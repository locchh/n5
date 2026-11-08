# [n5](https://padlet.com/subaruu3308/n5-virtual-jn5v_hcm26_07-onl-s023uo219izkqdarem75)

A small web app for learning N5 Japanese on my phone. Lessons are JSON files in `data/`, and the app turns them into tap-only study activities (flashcards, quizzes, sentence building).

## Stack

| Tool | What it does here |
|---|---|
| [Vue](https://vuejs.org/) | Builds the pages and activities |
| [TypeScript](https://www.typescriptlang.org/) | JavaScript with types, so mistakes show up early |
| [Vite](https://vite.dev/) | Runs the app locally and builds it for production |
| Plain CSS | One small stylesheet, no CSS framework |
| [Vercel](https://vercel.com) | Hosts the app and redeploys it on every push to `main` |

## Commands

Run `npm install` once, then:

| Command | What it does |
|---|---|
| `npm run dev` | Starts the app at `localhost:5173`; the page reloads when you save |
| `npm run build` | Type-checks and builds the real website into `dist/` |
| `npm run preview` | Serves the built `dist/` locally, to check it before deploying |
| `npm test` | Runs the unit tests once |
| `npm run test:watch` | Re-runs the tests every time you save |
| `npm run typecheck` | Only checks types: faster than `build` when you just want "any errors?" |
| `npm run check` | Typecheck + tests + build in one go: run it before you commit or push |

## Folders

| Folder | What's inside |
|---|---|
| `src/` | The app: `engine/` (load, check, progress, speech), `components/` (cards, quizzes, players), `activities.ts` (lesson → decks), `App.vue` |
| `data/` | Lesson data (`lessons/4.json` …), the topic list, and the kana board data |
| `assets/` | Original class materials from Padlet (BTVN, Tài liệu bổ trợ) |
| `docs/` | Plans and guides |

## Docs

- [SKETCH.md](docs/SKETCH.md): what the app does
- [DATA_MODEL.md](docs/DATA_MODEL.md): the shape of the lesson data
- [DEPLOYMENT.md](docs/DEPLOYMENT.md): how to deploy on Vercel
