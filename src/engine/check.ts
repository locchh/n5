// Checks a lesson file against docs/DATA_MODEL.md and returns readable error messages.
// It never throws, so the app can show every problem at once.

/** What one kind must have: text fields, and lists of sub-items (each with their own shape). */
interface Shape {
  texts: string[]
  lists?: Record<string, Shape>
}

const SHAPES: Record<string, Shape> = {
  vocab: { texts: ['jp', 'meaning'] },
  grammar: { texts: ['pattern', 'meaning'], lists: { examples: { texts: ['jp', 'meaning'] } } },
  kanji: { texts: ['char', 'hanviet'], lists: { words: { texts: ['jp', 'reading', 'meaning'] } } },
  sentences: { texts: ['jp', 'meaning'] },
}

// The file is raw JSON, so we can't know its type yet: `any` lets us look inside while checking.
type Raw = any

/** Check one item against its shape, then every item in its lists (by calling itself). */
function checkItem(item: Raw, shape: Shape, where: string, errors: string[]) {
  // Loop 1: every required text field must be filled in.
  // e.g. for vocab, check item.jp and item.meaning
  for (const field of shape.texts) {
    if (typeof item?.[field] !== 'string' || item[field].trim() === '') errors.push(`${where}: "${field}" is missing or empty`)
  }
  // Loop 2: every list inside the item must have at least one sub-item,
  // and each sub-item is checked with its own shape (checkItem calls itself).
  // e.g. for kanji, name = 'words' and each word must have jp, reading, meaning.
  // No lists (like vocab)? `?? {}` gives an empty object, so this loop runs 0 times.
  for (const [name, subShape] of Object.entries(shape.lists ?? {})) {
    const list = item?.[name]
    if (!Array.isArray(list) || list.length === 0) errors.push(`${where}: "${name}" needs at least one item`)
    else list.forEach((sub, i) => checkItem(sub, subShape, `${where}.${name}[${i}]`, errors))
  }
}

/** The value if it's a list, otherwise an empty list. Keeps the extra rules from crashing on bad data. */
const asList = (value: Raw): Raw[] => (Array.isArray(value) ? value : [])

/** Check one lesson file. `file` is its name (e.g. "4.json"), used in the messages. */
export function checkLesson(file: string, raw: Raw, topicIds: Set<string>): string[] {
  const errors: string[] = []

  const id = Number(file.replace('.json', '')) // "4.json" → 4
  if (raw?.id !== id) errors.push(`id: should be ${id} (same as the file name)`)
  if (typeof raw?.title !== 'string' || raw.title.trim() === '') errors.push('title: is missing or empty')

  for (const [kind, shape] of Object.entries(SHAPES)) {
    const list = raw?.[kind] ?? [] // every list is optional
    if (!Array.isArray(list)) errors.push(`${kind}: should be a list`)
    else list.forEach((item, i) => checkItem(item, shape, `${kind}[${i}]`, errors))
  }

  // Extra rule 1: topics must exist in data/topics.json (catches typos like "foods").
  for (const [i, v] of asList(raw?.vocab).entries()) {
    for (const topic of asList(v?.topics)) {
      if (!topicIds.has(topic)) errors.push(`vocab[${i}]: unknown topic "${topic}" (see data/topics.json)`)
    }
  }

  // Extra rule 2: fill-the-blank needs the answer among its choices.
  for (const [i, g] of asList(raw?.grammar).entries()) {
    for (const [j, ex] of asList(g?.examples).entries()) {
      if (ex?.choices && !asList(ex.choices).includes(ex.blank)) {
        errors.push(`grammar[${i}].examples[${j}]: "choices" must include the blank "${ex.blank}"`)
      }
    }
  }

  return errors.map((e) => `${file} → ${e}`)
}
