<!-- Home page (/): a big Continue button, the list of lessons with how many cards I know,
     and a link to the mixed test. -->
<script setup lang="ts">
  // lessons: every good lesson file, sorted by id
  // errors: problems found in broken files, so we can show them
  import { lessons, errors } from '../engine/load'
  import { countKnown, getLastPath } from '../engine/progress'
  import { activities } from '../activities'
  import type { Lesson } from '../engine/types'

  // The page I was on last, e.g. "/lesson/4/vocab". null the very first time: no Continue button then.
  const lastPath = getLastPath()

  /** Every flashcard key in a lesson, each key once.
   *  Only flashcards get "Got it", so quiz cards aren't counted (or "known" could never reach the total).
   *  Vocab and Số đếm share keys, so a Set drops the repeats. */
  function lessonKeys(lesson: Lesson): string[] {
    const keys = activities.flatMap((activity) =>
      activity
        .build(lesson)
        .filter((card) => card.type === 'flip')
        .map((card) => card.key),
    )
    return [...new Set(keys)]
  }

  // For each lesson: how many cards I marked "Got it" out of all of them, e.g. 12 / 40
  const rows = lessons.map((lesson) => {
    const keys = lessonKeys(lesson)
    return { lesson, known: countKnown(keys), total: keys.length }
  })
</script>

<template>
  <!-- Broken lesson files: show every problem, so I can fix the JSON -->
  <ul v-if="errors.length > 0" class="errors">
    <li v-for="error in errors" :key="error">{{ error }}</li>
  </ul>

  <h1>N5</h1>

  <!-- Continue: back to where I stopped last time -->
  <RouterLink v-if="lastPath" :to="lastPath" class="continue">▶ Continue</RouterLink>

  <!-- One line per lesson, e.g. "Lesson 4: ... — 12 / 40 known" -->
  <ul class="menu">
    <li v-for="row in rows" :key="row.lesson.id">
      <RouterLink :to="`/lesson/${row.lesson.id}`">
        <span>Lesson {{ row.lesson.id }}: {{ row.lesson.title }}</span>
        <span class="hint">{{ row.known }} / {{ row.total }} known</span>
      </RouterLink>
    </li>
  </ul>

  <!-- Practice: the mixed test, and the kana boards (look and listen, no cards) -->
  <h2>Practice</h2>
  <ul class="menu">
    <li><RouterLink to="/test">Mixed test</RouterLink></li>
    <li><RouterLink to="/kana/hiragana">Bảng ひらがな</RouterLink></li>
    <li><RouterLink to="/kana/katakana">Bảng カタカナ</RouterLink></li>
  </ul>
</template>
