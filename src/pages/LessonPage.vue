<!-- Lesson page (/lesson/4): a summary of everything in the lesson,
     plus one button per activity to start practising. -->
<script setup lang="ts">
  import { computed } from 'vue'
  import { getLesson } from '../engine/load'
  import { activities } from '../activities'
  import SpeakButton from '../components/SpeakButton.vue'

  // id: the lesson number from the URL. URLs are text, so it comes in as "4", not 4.
  const props = defineProps<{ id: string }>()

  // The lesson itself, or undefined if the URL has a number we don't have (e.g. /lesson/99)
  const lesson = computed(() => getLesson(Number(props.id)))

  // Only activities that have cards in this lesson, so there's no button to an empty deck
  const ready = computed(() => activities.filter((activity) => lesson.value && activity.build(lesson.value).length > 0))
</script>

<template>
  <RouterLink to="/">← Home</RouterLink>

  <!-- Unknown lesson number: say so, instead of a blank page -->
  <p v-if="!lesson">There's no Lesson {{ id }}.</p>

  <template v-else>
    <h1>Lesson {{ lesson.id }}: {{ lesson.title }}</h1>

    <!-- Activity buttons, e.g. "Từ vựng" → /lesson/4/vocab -->
    <nav class="activities">
      <RouterLink v-for="activity in ready" :key="activity.id" :to="`/lesson/${lesson.id}/${activity.id}`">
        {{ activity.label }}
      </RouterLink>
    </nav>

    <!-- Summary: each kind only shows up if the lesson has some -->
    <section v-if="lesson.vocab.length > 0">
      <h2>Từ vựng</h2>
      <ul>
        <li v-for="v in lesson.vocab" :key="v.jp">{{ v.jp }} — {{ v.meaning }} <SpeakButton :text="v.jp" /></li>
      </ul>
    </section>

    <section v-if="lesson.kanji.length > 0">
      <h2>Kanji</h2>
      <ul>
        <li v-for="k in lesson.kanji" :key="k.char">{{ k.char }} — {{ k.hanviet }}</li>
      </ul>
    </section>

    <section v-if="lesson.grammar.length > 0">
      <h2>Ngữ pháp</h2>
      <ul>
        <li v-for="g in lesson.grammar" :key="g.pattern">{{ g.pattern }} — {{ g.meaning }}</li>
      </ul>
    </section>

    <section v-if="lesson.sentences.length > 0">
      <h2>Câu</h2>
      <ul>
        <li v-for="s in lesson.sentences" :key="s.jp">{{ s.jp }} — {{ s.meaning }} <SpeakButton :text="s.jp" /></li>
      </ul>
    </section>
  </template>
</template>

<style scoped>
  .activities {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .activities a {
    padding: 0.5rem 1rem;
    border: 1px solid currentColor;
    border-radius: 0.5rem;
  }
</style>
