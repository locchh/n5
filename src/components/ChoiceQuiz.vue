<!-- A 4-choice question: tap one answer, see if it's right, then tap "Next".
     Give it :key in the parent (like FlipCard), so a new question always starts fresh. -->
<script setup lang="ts">
  import { ref } from 'vue'
  import { shuffle } from '../engine/shuffle'

  // question: what to show, e.g. "お父さん"
  // hint: a small line under the question, e.g. the Vietnamese meaning (optional)
  // answer: the right choice, e.g. "おとうさん"
  // choices: all 4 options, the answer included
  const props = defineProps<{ question: string; hint?: string; answer: string; choices: string[] }>()

  // done: sent when I tap "Next", true if I picked the right answer
  const emit = defineEmits<{ done: [correct: boolean] }>()

  // Mix the options once, so the answer isn't always in the same spot
  const options = shuffle(props.choices)

  // The option I tapped, or null if I haven't picked yet
  const picked = ref<string | null>(null)
</script>

<template>
  <p class="question">{{ question }}</p>
  <p v-if="hint" class="hint">{{ hint }}</p>

  <!-- After I pick: the answer turns green, my wrong pick turns red, and no more tapping -->
  <button
    v-for="option in options"
    :key="option"
    type="button"
    :disabled="picked !== null"
    :class="{ right: picked && option === answer, wrong: option === picked && option !== answer }"
    @click="picked = option"
  >
    {{ option }}
  </button>

  <button v-if="picked" type="button" @click="emit('done', picked === answer)">Next</button>
</template>

<style scoped>
  .right {
    background: #cfc;
  }
  .wrong {
    background: #fcc;
  }
</style>
