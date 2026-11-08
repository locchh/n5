<!-- Plays one round of a deck: every card once, in shuffled order, with "12 / 40" on top.
     Closing the app mid-round is fine: it picks up where I stopped.
     The parent shows each card through the slot, e.g.
       <RoundPlayer deck="4:vocab" :keys="keys" v-slot="{ cardKey, next }">
         <FlipCard :key="cardKey" @mark="next">...</FlipCard>
       </RoundPlayer> -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { shuffle } from '../engine/shuffle'
import { clearRound, getRound, setMark, setRound, type Mark, type SavedRound } from '../engine/progress'

// deck: a name for this deck, used to save progress, e.g. "4:vocab"
// keys: the card keys in this deck, e.g. ["vocab:ちち", "vocab:はは"]
const props = defineProps<{ deck: string; keys: string[] }>()

/** A fresh round: all cards, shuffled, none seen yet. */
function newRound(): SavedRound {
  return { order: shuffle(props.keys), done: 0 }
}

// Resume the saved round, but only if it's still the same deck: same number of cards,
// and all of them still exist (a lesson file might have changed since last time).
const saved = getRound(props.deck)
const usable =
  saved !== null && saved.order.length === props.keys.length && saved.order.every((key) => props.keys.includes(key))
const round = ref<SavedRound>(usable ? saved : newRound())

const total = computed(() => round.value.order.length)
const finished = computed(() => round.value.done >= total.value)
const cardKey = computed(() => round.value.order[round.value.done]) // the card on screen now

/** Move to the next card and save, so closing the app loses nothing.
 *  Flashcards pass their mark (Got it / Again), so "cards known" stays up to date.
 *  Quizzes just call next() with no mark. */
function next(mark?: Mark) {
  if (mark) setMark(cardKey.value, mark)
  round.value.done++
  if (finished.value) clearRound(props.deck) // round over: next time starts a new shuffle
  else setRound(props.deck, round.value)
}

/** Start another round from the end screen. */
function restart() {
  round.value = newRound()
  setRound(props.deck, round.value)
}
</script>

<template>
  <template v-if="!finished">
    <p class="count">{{ round.done + 1 }} / {{ total }}</p>
    <!-- The parent decides how a card looks; we just tell it which card and how to go on -->
    <slot :card-key="cardKey" :next="next" />
  </template>

  <!-- End screen -->
  <template v-else>
    <p>Done! You went through all {{ total }} cards.</p>
    <button type="button" @click="restart">New round</button>
  </template>
</template>
