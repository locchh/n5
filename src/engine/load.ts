// load.ts loads all data once when the app starts

import type { Kana, Lesson, SoundRule } from './types'
import { checkLesson } from './check'
import topics from '../../data/topics.json'
import kanaJson from '../../data/kana.json'
import soundRuleJson from '../../data/sound-rules.json'

// 1. Reference data: just give it its type, no checking needed
export const kana = kanaJson as Kana[]
export const soundRules = soundRuleJson as SoundRule[]

// 2. Lessons: read every file in data/lessons/, check it, keep only the good ones

// Vite reads all lesson files at build time.
// The result looks like { '../../data/lessons/4.json': { id: 4, ... }, ... }
const lessonFiles = import.meta.glob('../../data/lessons/*.json', { eager: true, import: 'default' })

// Topic ids like "family", so checkLesson can catch typos.
const topicIds = new Set(topics.map((t) => t.id))

export const lessons: Lesson[] = [] // good lessons, sorted by id
export const errors: string[] = [] // every problem in every file, shown all at once

// Check each file: a good one goes into lessons, a broken one adds its problems to errors
for (const [path, raw] of Object.entries(lessonFiles)) {
  const file = path.split('/').pop()! // '../../data/lessons/4.json' → '4.json'
  const problems = checkLesson(file, raw, topicIds)
  if (problems.length > 0) {
    errors.push(...problems) // broken file: skip it, show its errors instead
    continue
  }

  // Missing lists become empty lists, so the app never has to check for them.
  const data = raw as any
  lessons.push({
    id: data.id,
    title: data.title,
    vocab: data.vocab ?? [],
    grammar: data.grammar ?? [],
    kanji: data.kanji ?? [],
    sentences: data.sentences ?? [],
  })
}

// Files can load in any order, so sort by id: Lesson 4, 5, 6...
lessons.sort((a, b) => a.id - b.id)

// Get one lesson by its id, e.g. for the page of Lesson 5. Gives undefined if there's no such lesson.
export function getLesson(id: number): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id)
}