<!-- A card: tap to flip from front to back, then tap "Got it" or "Again".
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
  <div class="card" @click="flipped = !flipped">
    <!-- slot = a hole the parent fills, e.g. <template #front>ちち</template> -->
    <slot v-if="!flipped" name="front" />
    <slot v-else name="back" />
  </div>

  <!-- The buttons only appear after flipping, so I try to remember first -->
  <div v-if="flipped" class="actions">
    <button type="button" class="bad" @click="emit('mark', 'again')">Again</button>
    <button type="button" class="good" @click="emit('mark', 'got')">Got it</button>
  </div>
</template>
