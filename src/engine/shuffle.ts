// shuffle.ts mixes a deck into random order at the start of each round,
// so every card shows up exactly once per round (see docs/SKETCH.md).

/** Returns a new, shuffled copy of the list. The original list is left alone. */
export function shuffle<T>(list: T[]): T[] {
  const deck = [...list] // copy, so we don't change the caller's list

  // Fisher–Yates: walk from the last card to the first,
  // and swap each card with a random card at or before it.
  // Every order is equally likely.
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)) // random spot from 0 to i
    ;[deck[i], deck[j]] = [deck[j], deck[i]] // swap the two cards
  }

  return deck
}

export function pick<T>(list: T[], count: number): T[] {
  // Shuffle a copy, then take the first `count` cards.
  // e.g. 10 questions for the mixed test, or 3 wrong answers for a quiz.
  // Asking for more than the list has just gives the whole list.
  return shuffle(list).slice(0, count)
}
