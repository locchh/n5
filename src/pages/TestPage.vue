<!-- Mixed test page (/test): about 10 questions picked from all lessons and all activities. -->
<script setup lang="ts">
  import { ref } from 'vue'
  import { buildTest } from '../activities'
  import DeckPlayer from '../components/DeckPlayer.vue'

  // The questions, picked once when the page opens (a fresh pick every visit)
  const cards = ref(buildTest())

  // Bumped by "New test", so DeckPlayer starts over with the new questions
  const round = ref(0)

  /** Pick a new set of questions and start again. */
  function newTest() {
    cards.value = buildTest()
    round.value++
  }
</script>

<template>
  <RouterLink to="/">← Home</RouterLink>
  <h1>Mixed test</h1>

  <!-- deck "test": each visit picks new questions, so leaving mid-test means a fresh test next time -->
  <DeckPlayer :key="round" deck="test" :cards="cards" />

  <button type="button" @click="newTest">New test</button>
</template>
