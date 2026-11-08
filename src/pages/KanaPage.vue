<!-- Kana board (/kana/hiragana or /kana/katakana): every kana in a grid, tap one to hear it.
     Just look and listen: no cards, no progress. Sound rules (長音, 促音) at the bottom. -->
<script setup lang="ts">
  import { computed } from 'vue'
  import { kana, soundRules } from '../engine/load'
  import { speak } from '../engine/speak'
  import type { Kana } from '../engine/types'

  // script: from the URL, "hiragana" or "katakana"
  const props = defineProps<{ script: string }>()

  // Anything else in the URL (e.g. /kana/oops) shows hiragana instead of a blank page
  const script = computed(() => (props.script === 'katakana' ? 'katakana' : 'hiragana'))

  // The groups in board order, with a title for each. Extended (ティ, ファ…) is katakana only.
  const groups = computed(() =>
    [
      { id: 'base', title: 'Cơ bản' },
      { id: 'dakuten', title: 'Dakuten ゛' },
      { id: 'handakuten', title: 'Handakuten ゜' },
      { id: 'yoon', title: 'Âm ghép (ゃ ゅ ょ)' },
      { id: 'extended', title: 'Mở rộng' },
    ].filter((group) => script.value === 'katakana' || group.id !== 'extended'),
  )

  // Column labels in chart order. The data isn't always in this order, so we use a fixed one.
  const COLUMN_ORDER = ['あ', 'い', 'う', 'え', 'お', 'や', 'ゆ', 'よ']

  /** One group as a grid: its column labels, its row labels, and the kana in each cell.
   *  Some cells have no kana (や row has only や ゆ よ), so they come back empty. */
  function board(group: string) {
    const items = kana.filter((k) => k.group === group)
    // Only the columns this group uses, in chart order (e.g. あ い う え お, or や ゆ よ for small ゃゅょ)
    const columns = COLUMN_ORDER.filter((column) => items.some((k) => k.column === column))
    // Rows in the order the data lists them (あ か さ た な …), each once
    const rows = [...new Set(items.map((k) => k.row))]
    const cell = (row: string, column: string): Kana | undefined =>
      items.find((k) => k.row === row && k.column === column)
    return { columns, rows, cell }
  }

  // Only the rules for this board's script
  const rules = computed(() => soundRules.filter((rule) => rule.script === script.value))

  // Extended kana (ティ, ファ, ヴュ…) don't fit a neat grid (ヴ and ヴュ would share a cell), so they're a simple list
  const extended = kana.filter((k) => k.group === 'extended')

  /** Cut a word around the kana to highlight, e.g. ("おかあさん", "あ") → ["おか", "あ", "さん"]. */
  function highlight(word: string, key: string): [string, string, string] {
    const i = word.indexOf(key)
    if (i === -1) return [word, '', '']
    return [word.slice(0, i), key, word.slice(i + key.length)]
  }
</script>

<template>
  <RouterLink to="/" class="back-link">← Home</RouterLink>
  <h1>{{ script === 'hiragana' ? 'ひらがな' : 'カタカナ' }}</h1>

  <!-- One grid per group: columns labelled あ い う え お, rows あ か さ … (no romaji) -->
  <section v-for="group in groups" :key="group.id">
    <h2>{{ group.title }}</h2>

    <!-- Extended (katakana only): a simple row of buttons, tap → 🔊 -->
    <p v-if="group.id === 'extended'" class="kana-flow">
      <button v-for="k in extended" :key="k.katakana" type="button" @click="speak(k.katakana)">{{ k.katakana }}</button>
    </p>

    <table v-for="b in [board(group.id)]" v-else :key="group.id" class="kana-grid">
      <tr>
        <th></th>
        <th v-for="column in b.columns" :key="column">{{ column }}</th>
      </tr>
      <tr v-for="row in b.rows" :key="row">
        <th>{{ row }}</th>
        <td v-for="column in b.columns" :key="column">
          <!-- Tap → 🔊. Obsolete ゐ ゑ are greyed out but still play. -->
          <button
            v-for="k in [b.cell(row, column)]"
            v-show="k"
            :key="column"
            type="button"
            :class="{ obsolete: k?.obsolete }"
            @click="k && speak(k[script])"
          >
            {{ k?.[script] }}
          </button>
        </td>
      </tr>
    </table>
  </section>

  <!-- Sound rules: how long vowels and small っ are written, with example words -->
  <section v-for="rule in rules" :key="rule.name" class="card">
    <h2>{{ rule.name }}</h2>
    <p>{{ rule.how }}</p>
    <ul class="summary">
      <li v-for="ex in rule.examples" :key="ex.word">
        {{ ex.write }}:
        <button type="button" class="small" @click="speak(ex.word)">
          <template v-for="(part, i) in [highlight(ex.word, ex.key)]" :key="i">
            {{ part[0] }}<mark>{{ part[1] }}</mark>{{ part[2] }}
          </template>
        </button>
        — {{ ex.meaning }}
      </li>
    </ul>
  </section>
</template>
