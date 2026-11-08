<!-- Plays any deck of cards from activities.ts: each card is shown with the component for its type,
     inside RoundPlayer (shuffle, "12 / 40", resume, end screen).
     Used by the activity page and the mixed test. -->
<script setup lang="ts">
  import { computed } from 'vue'
  import type { Card } from '../activities'
  import RoundPlayer from './RoundPlayer.vue'
  import FlipCard from './FlipCard.vue'
  import ChoiceQuiz from './ChoiceQuiz.vue'
  import OrderQuiz from './OrderQuiz.vue'
  import SpeakButton from './SpeakButton.vue'

  // deck: a name used to save progress, e.g. "4:vocab"
  // cards: the deck itself, e.g. activities[0].build(lesson)
  const props = defineProps<{ deck: string; cards: Card[] }>()

  // RoundPlayer only gives us the key of the card on screen, so look the card up by key
  const byKey = computed(() => new Map(props.cards.map((card) => [card.key, card])))
</script>

<template>
  <RoundPlayer :deck="deck" :keys="cards.map((card) => card.key)" v-slot="{ cardKey, next }">
    <!-- A small Vue trick: a v-for over a list of one item just gives that item a name, `card`.
         :key="cardKey" also makes each new card start fresh (not flipped, nothing picked). -->
    <template v-for="card in [byKey.get(cardKey)]" :key="cardKey">
      <!-- Flashcard: Got it / Again goes straight to next(), which saves the mark -->
      <FlipCard v-if="card?.type === 'flip'" @mark="next">
        <template #front>
          <p class="front">{{ card.front }}</p>
        </template>
        <template #back>
          <p class="front">{{ card.front }}</p>
          <p class="back">
            {{ card.back }}
            <SpeakButton v-if="card.say" :text="card.say" />
          </p>
          <p v-for="line in card.details" :key="line" class="detail">{{ line }}</p>
        </template>
      </FlipCard>

      <!-- Quizzes: next() with brackets, so true/false isn't passed in as a mark -->
      <ChoiceQuiz
        v-else-if="card?.type === 'choice'"
        :question="card.question"
        :hint="card.hint"
        :answer="card.answer"
        :choices="card.choices"
        @done="next()"
      />
      <OrderQuiz v-else-if="card?.type === 'order'" :meaning="card.meaning" :chunks="card.chunks" @done="next()" />
    </template>
  </RoundPlayer>
</template>
