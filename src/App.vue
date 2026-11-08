<!-- For now: the lesson list, plus a temporary try-out area to play any activity.
     The real pages (home, lesson, activity, test) come in the Pages step. -->
<script setup lang="ts">
  import { computed, ref } from 'vue'
  // lessons: every good lesson file, sorted by id
  // errors: problems found in broken files, so we can show them
  import { lessons, errors } from './engine/load'
  import { activities } from './activities'
  import DeckPlayer from './components/DeckPlayer.vue'

  // Temporary try-out: which lesson and activity to play
  const lessonId = ref(4)
  const activityId = ref('vocab')
  const lesson = computed(() => lessons.find((l) => l.id === lessonId.value))
  const activity = computed(() => activities.find((a) => a.id === activityId.value))
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

  <!-- Temporary try-out: pick a lesson and an activity, then play it -->
  <h2>Try an activity</h2>
  <select v-model.number="lessonId">
    <option v-for="l in lessons" :key="l.id" :value="l.id">Lesson {{ l.id }}</option>
  </select>
  <select v-model="activityId">
    <option v-for="a in activities" :key="a.id" :value="a.id">{{ a.label }}</option>
  </select>

  <!-- :key restarts the player when I pick another lesson or activity -->
  <DeckPlayer
    v-if="lesson && activity"
    :key="`${lessonId}:${activityId}`"
    :deck="`${lessonId}:${activityId}`"
    :cards="activity.build(lesson)"
  />
</template>
