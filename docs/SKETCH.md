# N5 Japanese learning page: sketch

## The idea

A **render engine for lesson data**.

- Lessons are **data** (JSON files).
- The app is an **engine** that reads any lesson file and turns it into study activities.
- Adding a new lesson = adding a JSON file. No code changes.

```
data/lessons/*.json  →  engine (load + check)  →  activities  →  pages
```

## Who it's for

Me: an office worker learning on my **phone**, in short free moments (waiting for the train, breaks).

So the app must be:

- **Short**: one session = about 10 cards, done in a few minutes.
- **Interruptible**: progress is saved in the browser. A big **Continue** button on the home page picks up where I stopped.
- **One-handed**: answer buttons at the bottom of the screen, where the thumb is.
- **Easy to read**: big Japanese text.
- **Quick to open**: no login. Bookmark it on the home screen.

## Rules

- **No romaji.** Japanese is shown in kana/kanji only. Readings are in hiragana (父 → ちち). Meanings are in Vietnamese.
- **Tap only, no typing.** Every answer is a tap: flip, choose, or order.
- **Simple UI.** Plain CSS in one small file. No CSS framework, no animations, no clever JavaScript.
- **Responsive.** One centered column with a max width. Works the same on phone and laptop.
- **Understandable code.** Small pieces, clear names, newbie-friendly comments (see `AGENTS.md`).

## 1. Data

One JSON file per lesson in `data/lessons/` (`4.json`, `5.json`, …).
Full shape: see [DATA_MODEL.md](DATA_MODEL.md).

## 2. Engine

- **Load**: find every file in `data/lessons/`.
- **Check**: make sure each file matches the shape, and show a clear error if not.
- **Hand off**: give the lesson data to the activity I picked.

## 3. Activities

All answered by tapping.

| Activity | Uses | How it works |
|---|---|---|
| Vocab flashcards | `vocab` | Japanese → tap to flip → meaning. Then tap **Got it** or **Again**. |
| Kanji flashcards | `kanji` | 父 → tap to flip → Hán Việt, words, readings. Then **Got it** or **Again**. |
| Kanji reading quiz | `kanji.words` | Show お父さん → tap the right reading out of 4. |
| Grammar cards | `grammar` | Pattern → tap to flip → meaning + examples. |
| Grammar fill-the-blank | `grammar.examples` | Hieuさん [ ] ベトナムじんです → tap は / も / が / を. |
| Build the sentence | `grammar.examples` | Shuffled chunks → tap them in the right order. |
| Sentence cards | `sentences` | Vietnamese → tap to flip → Japanese, with a 🔊 button (browser speech, no library). |
| Numbers drill | `numbers` | 4:06 → tap to reveal よじ ろっぷん → **Got it** or **Again**. |
| Mixed test | all 5 kinds | About 10 questions mixing all activities, sampled (not everything). Score at the end. |

### Random order: every card once per round

- At the start of a round, shuffle the whole deck.
- Go through it in that order, so each card appears exactly once.
- When the deck runs out, the round is over. Reshuffle for the next round.
- Show progress like **12 / 40**.

### Progress

- Saved in the browser (localStorage): where I stopped, and which cards I marked Got it or Again.
- Home page shows how many cards I know per lesson.

## 4. Pages

- `/`: Continue button + list of lessons
- `/lesson/4`: summary of Lesson 4 (all 5 kinds) + buttons for each activity
- `/lesson/4/<activity>`: the activity, e.g. `/lesson/4/vocab`, `/lesson/4/kanji-quiz`
- `/test`: mixed test

## 5. Not covered (on purpose)

- **Writing kanji / stroke order**: can't be practiced by tapping. Done on paper.
- **Speaking check**: the 🔊 button helps listening, but the app doesn't check my pronunciation.
- **Offline mode**: not now. Lesson data is small, so a weak signal is fine.

## 6. Stack and deploy

- TypeScript + Vue or React (to decide)
- Deploy on Vercel from `main`

## Workflow for a new lesson

1. Learn the lesson in class.
2. Write `data/lessons/<n>.json` with the 5 kinds.
3. Push. Vercel rebuilds and the lesson appears.

## Open questions

- **Again**: does an "Again" card come back later in the same round, or only in the next round?
- **Mixed test**: do I pick which lessons to include, or does the app pick for me?
- **Vue or React?**
