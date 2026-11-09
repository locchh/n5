<!-- Activity page (/lesson/4/vocab): plays one activity of one lesson.
     Also remembers this page, so Continue on the home page brings me back here. -->
<script setup lang="ts">
  import { computed, watchEffect } from 'vue'
  import { getLesson } from '../engine/load'
  import { setLastPath } from '../engine/progress'
  import { activities, mixSides } from '../activities'
  import DeckPlayer from '../components/DeckPlayer.vue'

  // id: the lesson number from the URL, as text ("4")
  // activity: an activity id from activities.ts, e.g. "vocab"
  const props = defineProps<{ id: string; activity: string }>()

  // Both are undefined if the URL is wrong, e.g. /lesson/99/vocab or /lesson/4/oops
  const lesson = computed(() => getLesson(Number(props.id)))
  const found = computed(() => activities.find((a) => a.id === props.activity))

  // The deck, with each flashcard randomly showing its Japanese or Vietnamese side first.
  // In a computed, so the coins are flipped once: a card can't change sides while I'm looking at it.
  const cards = computed(() => (lesson.value && found.value ? mixSides(found.value.build(lesson.value)) : []))

  // The deck name used to save progress, e.g. "4:vocab"
  const deck = computed(() => `${props.id}:${props.activity}`)

  // Remember this page for Continue, but only if it really exists
  watchEffect(() => {
    if (lesson.value && found.value) setLastPath(`/lesson/${props.id}/${props.activity}`)
  })
</script>

<template>
  <RouterLink :to="`/lesson/${id}`" class="back-link">← Lesson {{ id }}</RouterLink>

  <!-- Wrong URL: say so, instead of a blank page -->
  <p v-if="!lesson || !found">There's no such activity.</p>

  <template v-else>
    <h1>{{ found.label }}</h1>
    <!-- :key restarts the player if the URL changes to another deck -->
    <DeckPlayer :key="deck" :deck="deck" :cards="cards" />
  </template>
</template>
