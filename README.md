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

## Folders

| Folder | What's inside |
|---|---|
| `data/` | Lesson data (`lessons/4.json` …) and the topic list |
| `assets/` | Original class materials from Padlet (BTVN, Tài liệu bổ trợ) |
| `docs/` | Plans and guides |

## Docs

- [SKETCH.md](docs/SKETCH.md): what the app does
- [DATA_MODEL.md](docs/DATA_MODEL.md): the shape of the lesson data
- [DEPLOYMENT.md](docs/DEPLOYMENT.md): how to deploy on Vercel
