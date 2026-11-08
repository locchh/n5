<!-- The first component. For now it only says Hello, to check the setup works. -->
<script setup lang="ts">
// lessons: every good lesson file, sorted by id
// errors: problems found in broken files, so we can show them
import { lessons, errors } from './engine/load'
</script>

<template>
  <!-- Broken lesson files: show every problem, so I can fix the JSON -->
  <ul v-if="errors.length > 0" class="errors">
    <li v-for="error in errors" :key="error">{{ error }}</li>
  </ul>

  <!-- Home page: one line per lesson, e.g. "Lesson 4 — ..." -->
  <h1>N5</h1>
  <ul>
    <li v-for="lesson in lessons" :key="lesson.id">Lesson {{ lesson.id }}: {{ lesson.title }}</li>
  </ul>

</template>
