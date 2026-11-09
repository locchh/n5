// activities.ts turns lesson data into decks of cards, one deck per activity.

import type { Lesson } from './engine/types'
import { pick } from './engine/shuffle'
import { lessons } from './engine/load'

// --- what a card is: one of three shapes, one per component that shows it ---

export type Card =
  | { type: 'flip'; key: string; front: string; back: string; details?: string[]; say?: string } // FlipCard
  | { type: 'choice'; key: string; question: string; hint?: string; answer: string; choices: string[] } // ChoiceQuiz
  | { type: 'order'; key: string; meaning: string; chunks: string[] } // OrderQuiz

// details: extra lines on the back, e.g. a kanji's words or a grammar pattern's examples
// say: text for the 🔊 button on the back
// hint: a small line under the question, e.g. the Vietnamese meaning

// --- small helpers ---

/** 4 options for a quiz: the right answer + 3 wrong ones picked from `pool`.
 *  ChoiceQuiz mixes them, so the answer can go first here. */
function choicesFor(answer: string, pool: string[]): string[] {
  // Drop the answer and repeats from the pool, so no option shows up twice
  const wrong = [...new Set(pool)].filter((option) => option !== answer)
  return [answer, ...pick(wrong, 3)]
}

/** Hide the blank in a sentence for fill-the-blank, e.g. "わたし は がくせい です" → "わたし ＿＿ がくせい です".
 *  Words are split by spaces, so we first look for the blank as a whole word:
 *  in "はは は …" with blank "は", that hides the second は, not the one inside はは.
 *  Some blanks are only part of a word (が in "ですが、"), so if there's no whole word, hide the first match. */
function hideBlank(jp: string, blank: string): string {
  const words = jp.split(' ')
  const i = words.indexOf(blank)
  if (i === -1) return jp.replace(blank, '＿＿')
  words[i] = '＿＿'
  return words.join(' ')
}

// --- the activities: each one takes a lesson and gives back a deck of cards ---

export interface Activity {
  id: string // used in the deck name and the URL, e.g. "vocab" → deck "4:vocab"
  label: string // the button text on the lesson page, e.g. "Từ vựng"
  build: (lesson: Lesson) => Card[] // turns one lesson into this activity's cards
}


export const activities: Activity[] = [
  // ちち → cha, with 🔊
  {
    id: 'vocab',
    label: 'Từ vựng',
    build: (lesson) => lesson.vocab.map((v) => ({ type: 'flip', key: 'vocab:' + v.jp, front: v.jp, back: v.meaning, say: v.jp })),
  },
  // 父 → PHỤ, then its words: "父 (ちち) — cha"
  {
    id: 'kanji',
    label: 'Kanji',
    build: (lesson) =>
      lesson.kanji.map((k) => ({
        type: 'flip',
        key: 'kanji:' + k.char,
        front: k.char,
        back: k.hanviet,
        details: k.words.map((w) => `${w.jp} (${w.reading}) — ${w.meaning}`),
      })),
  },
  // 〜は〜です → meaning, then its examples
  {
    id: 'grammar',
    label: 'Ngữ pháp',
    build: (lesson) =>
      lesson.grammar.map((g) => ({
        type: 'flip',
        key: 'grammar:' + g.pattern,
        front: g.pattern,
        back: g.meaning,
        details: g.examples.map((ex) => `${ex.jp} — ${ex.meaning}`),
      })),
  },
  // Vietnamese first, then the Japanese with 🔊, so I practise saying it
  {
    id: 'sentences',
    label: 'Câu',
    build: (lesson) =>
      lesson.sentences.map((s) => ({ type: 'flip', key: 'sentence:' + s.jp, front: s.meaning, back: s.jp, say: s.jp })),
  },
  // お父さん → pick its reading (おとうさん). The Kanji cards already teach Hán Việt,
  // so this practises reading real words. Wrong options come from every lesson, so there are always enough.
  {
    id: 'kanji-quiz',
    label: 'Đọc Kanji',
    build: (lesson) => {
      const pool = lessons.flatMap((l) => l.kanji.flatMap((k) => k.words.map((w) => w.reading)))
      return lesson.kanji
        .flatMap((k) => k.words)
        .map((w) => ({
          type: 'choice',
          key: 'kanji-quiz:' + w.jp,
          question: w.jp,
          hint: w.meaning,
          answer: w.reading,
          choices: choicesFor(w.reading, pool),
        }))
    },
  },
  // Only examples with a blank and choices (check.ts makes sure the answer is among them)
  {
    id: 'fill',
    label: 'Điền vào chỗ trống',
    build: (lesson) =>
      lesson.grammar
        .flatMap((g) => g.examples)
        .flatMap((ex) =>
          ex.blank && ex.choices
            ? [{ type: 'choice', key: 'fill:' + ex.jp, question: hideBlank(ex.jp, ex.blank), hint: ex.meaning, answer: ex.blank, choices: ex.choices }]
            : [],
        ),
  },
  // Only examples cut into chunks
  {
    id: 'build',
    label: 'Sắp xếp câu',
    build: (lesson) =>
      lesson.grammar
        .flatMap((g) => g.examples)
        .flatMap((ex) => (ex.chunks ? [{ type: 'order', key: 'build:' + ex.jp, meaning: ex.meaning, chunks: ex.chunks }] : [])),
  },
  // Numbers are vocab with the "numbers" topic (see docs/DATA_MODEL.md), e.g. はたち → 20 tuổi
  {
    id: 'numbers',
    label: 'Số đếm',
    build: (lesson) =>
      lesson.vocab
        .filter((v) => v.topics?.includes('numbers'))
        .map((v) => ({ type: 'flip', key: 'vocab:' + v.jp, front: v.jp, back: v.meaning, say: v.jp })),
  },
]

// --- mixing sides ---

/** Flip a coin for each flashcard: heads it stays (ちち → Bố mình), tails its sides swap (Bố mình → ちち).
 *  So I practise both ways in one deck. Quiz cards have no sides, so they stay as they are.
 *  The key stays the same, so Got it / Again counts for the card whichever side shows. */
export function mixSides(cards: Card[]): Card[] {
  return cards.map((card) =>
    card.type === 'flip' && Math.random() < 0.5 ? { ...card, front: card.back, back: card.front } : card,
  )
}

// --- the mixed test ---

/** About 10 cards from all lessons: 2 from each activity, then 10 of those.
 *  A test needs a score, so flip cards turn into 4-choice (front → pick the back). */
export function buildTest(): Card[] {
  const cards = activities.flatMap((activity) => {
    const deck = lessons.flatMap((lesson) => activity.build(lesson))
    const backs = deck.flatMap((card) => (card.type === 'flip' ? [card.back] : [])) // wrong options
    return pick(deck, 2).map((card): Card =>
      card.type === 'flip'
        ? { type: 'choice', key: 'test:' + card.key, question: card.front, answer: card.back, choices: choicesFor(card.back, backs) }
        : card,
    )
  })
  // Vocab and Số đếm can pick the same word: keep each key once, so RoundPlayer never sees it twice
  const unique = cards.filter((card, i) => cards.findIndex((other) => other.key === card.key) === i)
  return pick(unique, 10)
}
