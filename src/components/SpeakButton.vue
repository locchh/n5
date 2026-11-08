<!-- A 🔊 button that reads Japanese text aloud. Hidden if the browser can't speak. -->
<script setup lang="ts">
  import { canSpeak, speak } from '../engine/speak'

  // text: what to read aloud, e.g. "ちち"
  defineProps<{ text: string }>()
</script>

<template>
  <!-- @click.stop: tapping 🔊 on a flip card shouldn't also flip it -->
  <button v-if="canSpeak()" type="button" aria-label="Read aloud" @click.stop="speak(text)">🔊</button>
</template>
