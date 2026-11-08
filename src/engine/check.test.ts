// Unit tests for check.ts. Run them with: npm test
// Each test gives checkLesson a small lesson and says which errors we expect back.

import { describe, expect, test } from 'vitest'
import { checkLesson } from './check'

// Topics used in these tests (the real list lives in data/topics.json).
const topics = new Set(['family', 'food'])

// A small lesson with no mistakes. Each test copies it and breaks one thing.
const good = {
  id: 4,
  title: 'かぞくは よにんです。',
  vocab: [{ jp: 'かぞく', meaning: 'Gia đình', topics: ['family'] }],
  grammar: [
    {
      pattern: 'S1は Nです → S2も Nです',
      meaning: 'S2 cũng là N',
      examples: [{ jp: 'Hieuさん も ベトナムじん です。', meaning: 'Hieu cũng là người Việt Nam.', blank: 'も', choices: ['は', 'も'] }],
    },
  ],
  kanji: [{ char: '父', hanviet: 'Phụ', words: [{ jp: 'お父さん', reading: 'おとうさん', meaning: 'Bố' }] }],
  sentences: [{ jp: 'おいくつですか。', meaning: 'Bao nhiêu tuổi?' }],
}

describe('checkLesson', () => {
  test('a good lesson has no errors', () => {
    expect(checkLesson('4.json', good, topics)).toEqual([])
  })

  test('missing lists are fine (every list is optional)', () => {
    expect(checkLesson('4.json', { id: 4, title: 'X' }, topics)).toEqual([])
  })

  test('id must match the file name', () => {
    expect(checkLesson('5.json', good, topics)).toEqual(['5.json → id: should be 5 (same as the file name)'])
  })

  test('title must be there', () => {
    expect(checkLesson('4.json', { ...good, title: '' }, topics)).toEqual(['4.json → title: is missing or empty'])
  })

  test('a vocab item needs a meaning', () => {
    const lesson = { ...good, vocab: [{ jp: 'ねこ' }] }
    expect(checkLesson('4.json', lesson, topics)).toEqual(['4.json → vocab[0]: "meaning" is missing or empty'])
  })

  test('items inside lists are checked too, with their full address', () => {
    const lesson = { ...good, kanji: [{ char: '父', hanviet: 'Phụ', words: [{ jp: 'お父さん', meaning: 'Bố' }] }] }
    expect(checkLesson('4.json', lesson, topics)).toEqual(['4.json → kanji[0].words[0]: "reading" is missing or empty'])
  })

  test('a kanji needs at least one word', () => {
    const lesson = { ...good, kanji: [{ char: '父', hanviet: 'Phụ', words: [] }] }
    expect(checkLesson('4.json', lesson, topics)).toEqual(['4.json → kanji[0]: "words" needs at least one item'])
  })

  test('unknown topics are caught (typos like "foods")', () => {
    const lesson = { ...good, vocab: [{ jp: 'ごはん', meaning: 'Cơm', topics: ['foods'] }] }
    expect(checkLesson('4.json', lesson, topics)).toEqual([
      '4.json → vocab[0]: unknown topic "foods" (see data/topics.json)',
    ])
  })

  test('fill-the-blank choices must include the blank', () => {
    const example = { jp: 'Hieuさん も ベトナムじん です。', meaning: '…', blank: 'も', choices: ['は', 'が'] }
    const lesson = { ...good, grammar: [{ pattern: 'P', meaning: 'M', examples: [example] }] }
    expect(checkLesson('4.json', lesson, topics)).toEqual([
      '4.json → grammar[0].examples[0]: "choices" must include the blank "も"',
    ])
  })

  test('a list written as something else gives an error, not a crash', () => {
    const lesson = { ...good, vocab: {} }
    expect(checkLesson('4.json', lesson, topics)).toEqual(['4.json → vocab: should be a list'])
  })
})

// The real lesson files must all pass, so a typo in data/ fails the tests.
describe('data/lessons', () => {
  const files = import.meta.glob('../../data/lessons/*.json', { eager: true, import: 'default' })
  const realTopics = new Set(
    Object.values(import.meta.glob('../../data/topics.json', { eager: true, import: 'default' }))
      .flat()
      .map((t) => (t as { id: string }).id),
  )

  for (const [path, raw] of Object.entries(files)) {
    const file = path.split('/').pop()!
    test(`${file} has no errors`, () => {
      expect(checkLesson(file, raw, realTopics)).toEqual([])
    })
  }
})
