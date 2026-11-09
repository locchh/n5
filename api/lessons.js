// api/lessons.js: a small JSON API for the lesson files in data/lessons/.
// Vercel turns every file in api/ into a URL, so this one is /api/lessons.
//
//   /api/lessons                  → list of lessons: [{ id, title }, ...]
//   /api/lessons?id=4             → the whole of lesson 4
//   /api/lessons?id=4&part=vocab  → only one part of lesson 4 (vocab, grammar, kanji, sentences, notes)
//   /api/lessons?q=かぞく           → every item, in every lesson, that contains the text "かぞく"

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// The parts a lesson can have. Each one is a list of items.
const PARTS = ['vocab', 'grammar', 'kanji', 'sentences', 'notes']

// Read every lesson file once, when the function starts, and sort them by id.
const folder = join(process.cwd(), 'data', 'lessons')
const lessons = readdirSync(folder)
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(readFileSync(join(folder, file), 'utf8')))
  .sort((a, b) => a.id - b.id)

// Vercel calls this for every GET request to /api/lessons.
export function GET(request) {
  const query = new URL(request.url).searchParams
  const id = query.get('id')
  const part = query.get('part')
  const q = query.get('q')

  // ?q=... → search
  if (q) return Response.json(search(q))

  // ?id=... → one lesson (or one part of it)
  if (id) {
    const lesson = lessons.find((l) => l.id === Number(id))
    if (!lesson) return error(404, `No lesson with id ${id}`)
    if (!part) return Response.json(lesson)
    if (!PARTS.includes(part)) return error(400, `part must be one of: ${PARTS.join(', ')}`)
    return Response.json(lesson[part] ?? []) // a missing part is just an empty list
  }

  // nothing → the short list
  return Response.json(lessons.map((l) => ({ id: l.id, title: l.title })))
}

// Look through every item of every part of every lesson.
// An item matches if its text (Japanese, meaning, examples...) contains q.
function search(q) {
  const matches = []
  for (const lesson of lessons) {
    for (const part of PARTS) {
      for (const item of lesson[part] ?? []) {
        if (JSON.stringify(item).includes(q)) {
          matches.push({ lesson: lesson.id, part, item })
        }
      }
    }
  }
  return matches
}

// A JSON error like { "error": "No lesson with id 99" } with the right status code.
function error(status, message) {
  return Response.json({ error: message }, { status })
}
