<!-- Build the sentence: tap the mixed-up pieces in the right order, then tap "Next".
     Give it :key in the parent (like ChoiceQuiz), so a new sentence always starts fresh. -->
<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { shuffle } from '../engine/shuffle'

  // meaning: the Vietnamese sentence, shown as the question
  // chunks: the Japanese sentence in pieces, in the right order, e.g. ["わたしは", "がくせい", "です"]
  const props = defineProps<{ meaning: string; chunks: string[] }>()

  // done: sent when I tap "Next", true if my sentence was right
  const emit = defineEmits<{ done: [correct: boolean] }>()

  // We work with positions (0, 1, 2...) instead of the text,
  // so two pieces with the same text (like two "は") still count as different buttons.
  const pool = shuffle(props.chunks.map((_, i) => i)) // the mixed-up pieces
  const picked = ref<number[]>([]) // the pieces I tapped, in my order

  // Pieces not tapped yet stay at the bottom
  const left = computed(() => pool.filter((i) => !picked.value.includes(i)))

  // All pieces placed? Then check: same text as the real sentence = right
  const finished = computed(() => left.value.length === 0)
  const correct = computed(() => picked.value.map((i) => props.chunks[i]).join('') === props.chunks.join(''))

  // Tap a placed piece to take it back (only before finishing)
  function unpick(i: number) {
    if (!finished.value) picked.value = picked.value.filter((p) => p !== i)
  }
</script>

<template>
  <p class="question">{{ meaning }}</p>

  <!-- My sentence so far -->
  <p class="answer" :class="{ right: finished && correct, wrong: finished && !correct }">
    <button v-for="i in picked" :key="i" type="button" @click="unpick(i)">{{ chunks[i] }}</button>
  </p>

  <!-- Pieces left to tap -->
  <p>
    <button v-for="i in left" :key="i" type="button" @click="picked.push(i)">{{ chunks[i] }}</button>
  </p>

  <!-- Wrong? Show the right sentence, so I learn it -->
  <p v-if="finished && !correct">{{ chunks.join('') }}</p>
  <button v-if="finished" type="button" @click="emit('done', correct)">Next</button>
</template>

<style scoped>
  .right {
    background: #cfc;
  }
  .wrong {
    background: #fcc;
  }
</style>
