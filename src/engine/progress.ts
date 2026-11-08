// progress.ts saves my study progress in the browser (localStorage)
// so closing the tab loses nothing

// --- types ---

/** Where I stopped in a deck, so I can pick up from there next time. */
export interface SavedRound {
  order: string[] // card keys in this round's shuffled order, e.g. "vocab:ちち"
  done: number // how many cards of the round are seen, e.g. 12 in "12 / 40"
}

/** What I pressed on a card: "Got it" or "Again". */
export type Mark = 'got' | 'again'

// --- private helpers ---

// Every key starts with "n5:", so ours don't clash with other apps on the same address (e.g. localhost:5173).
const PREFIX = 'n5:'

/** Read a saved value. Missing or broken → the fallback, so the app never crashes. */
function read<T>(name: string, fallback: T): T {
  try {
    const text = localStorage.getItem(PREFIX + name) // null if nothing is saved yet
    return text === null ? fallback : (JSON.parse(text) as T)
  } catch {
    return fallback // broken JSON: start fresh instead of crashing
  }
}

/** Save a value as JSON text (localStorage only holds text). */
function write(name: string, value: unknown) {
  localStorage.setItem(PREFIX + name, JSON.stringify(value))
}

/** Forget a saved value. */
function remove(name: string) {
  localStorage.removeItem(PREFIX + name)
}

// --- Got it / Again ---

/** All my marks by card key, e.g. { "vocab:ちち": "got" }. */
export function getMarks(): Record<string, Mark> {
  return read('marks', {})
}

/** Remember what I pressed on one card. */
export function setMark(key: string, mark: Mark) {
  const marks = getMarks()
  marks[key] = mark
  write('marks', marks)
}

/** How many of these cards I marked "got", e.g. for "12 known" on the home page. */
export function countKnown(keys: string[]): number {
  const marks = getMarks()
  return keys.filter((key) => marks[key] === 'got').length
}

// --- Where I stopped ---

/** Where I stopped in a deck (e.g. "4:vocab"), or null if no round is going. */
export function getRound(deck: string): SavedRound | null {
  return read<SavedRound | null>('round:' + deck, null)
}

/** Save where I am in a deck, so I can pick up from there next time. */
export function setRound(deck: string, round: SavedRound) {
  write('round:' + deck, round)
}

/** The round is over: forget it, so the next one starts with a fresh shuffle. */
export function clearRound(deck: string) {
  remove('round:' + deck)
}

/** The page I was on last (e.g. "/lesson/4/vocab"), for the Continue button. */
export function getLastPath(): string | null {
  return read<string | null>('lastPath', null)
}

/** Remember the page I'm on now. */
export function setLastPath(path: string) {
  write('lastPath', path)
}
