// The shapes of our data, from docs/DATA_MODEL.md.
// Only the kinds the app uses are here; other lists in a lesson file are ignored.

/** Japanese text + Vietnamese meaning. */
export interface Item {
  jp: string
  meaning: string
}

export interface Vocab extends Item {
  topics?: string[] // topic ids from data/topics.json, e.g. "family"
}

export interface Example extends Item {
  blank?: string // the part to hide in fill-the-blank
  choices?: string[] // options for fill-the-blank
  chunks?: string[] // the sentence in pieces, for build-the-sentence
}

export interface Grammar {
  pattern: string
  meaning: string
  examples: Example[]
}

export interface Kanji {
  char: string
  hanviet: string
  words: (Item & { reading: string })[] // reading in hiragana
}

/** A lesson after loading. Every list exists (missing in the file = empty). */
export interface Lesson {
  id: number
  title: string
  vocab: Vocab[]
  grammar: Grammar[]
  kanji: Kanji[]
  sentences: Item[]
}

// ---------- reference data for the kana boards ----------

export interface Kana {
  hiragana: string
  katakana: string
  row: string // row label in kana, e.g. か
  column: string // vowel label in kana, e.g. あ
  group: 'base' | 'dakuten' | 'handakuten' | 'yoon' | 'extended'
  obsolete?: boolean // ゐ ゑ, shown greyed out
}

export interface SoundRule {
  script: 'hiragana' | 'katakana'
  name: string
  how: string
  examples: { write: string; word: string; key: string; meaning: string }[]
}
