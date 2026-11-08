// Prints where my cursor is in VS Code: file, line, column, the word under it, the line itself,
// and the selected lines if something is selected.
// It reads .tab/state.json, which the Tab extension keeps up to date.
// Usage: node .claude/scripts/cursor.mjs

import { readFileSync } from 'node:fs'

const state = JSON.parse(readFileSync('.tab/state.json', 'utf8'))
const active = state.active
if (!active) {
  console.log('No active editor (click into a file in VS Code first).')
  process.exit(0)
}

const { line, col } = active.cursor // both start at 1
// Unsaved text if there is any, otherwise the file on disk.
const text = active.text ?? readFileSync(active.file, 'utf8')
const lineText = text.split('\n')[line - 1] ?? ''

// The word whose letters touch the cursor position.
const word = [...lineText.matchAll(/\w+/g)].find((m) => m.index <= col - 1 && col - 1 <= m.index + m[0].length)?.[0] ?? ''

console.log(`${active.file}:${line}:${col}  word=${JSON.stringify(word)}  selection=${JSON.stringify(active.selection)}`)
console.log(lineText)
console.log(' '.repeat(col - 1) + '^')

// If something is selected, print the selected lines too (whole lines, simple and enough).
if (active.selection) {
  const { start, end } = active.selection
  console.log(`--- selected lines ${start.line}-${end.line} ---`)
  console.log(text.split('\n').slice(start.line - 1, end.line).join('\n'))
}
