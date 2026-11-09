<!-- A card: tap to flip it over from front to back, then tap "Got it" or "Again".
     The parent fills in both faces, so one card works for vocab, Kanji, grammar and sentences.
     Give it :key="card.key" in the parent, so a new card always starts face up. -->
<script setup lang="ts">
  import { ref } from 'vue'
  import type { Mark } from '../engine/progress'

  // mark: sent to the parent when I press "Got it" or "Again"
  const emit = defineEmits<{ mark: [mark: Mark] }>()

  // false = showing the front, true = showing the back
  const flipped = ref(false)
</script>

<template>
  <!-- Both faces are always there, back to back. Tapping spins the card half a turn
       (the .flipped class, see "Flip cards" in style.css), so the other face comes round. -->
  <div class="flip" :class="{ flipped }" @click="flipped = !flipped">
    <!-- slot = a hole the parent fills, e.g. <template #front>ちち</template> -->
    <div class="card face"><slot name="front" /></div>
    <div class="card face face-back"><slot name="back" /></div>
  </div>

  <!-- The buttons only appear after flipping, so I try to remember first -->
  <div v-if="flipped" class="actions">
    <button type="button" class="bad" @click="emit('mark', 'again')">Again</button>
    <button type="button" class="good" @click="emit('mark', 'got')">Got it</button>
  </div>
</template>
