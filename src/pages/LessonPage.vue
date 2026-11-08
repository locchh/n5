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
  <RouterLink to="/" class="back-link">← Home</RouterLink>

  <!-- Unknown lesson number: say so, instead of a blank page -->
  <p v-if="!lesson">There's no Lesson {{ id }}.</p>

  <template v-else>
    <h1>Lesson {{ lesson.id }}: {{ lesson.title }}</h1>

    <!-- Activity buttons, e.g. "Từ vựng" → /lesson/4/vocab -->
    <nav class="activities">
      <RouterLink v-for="activity in ready" :key="activity.id" :to="`/lesson/${lesson.id}/${activity.id}`" class="button">
        {{ activity.label }}
      </RouterLink>
    </nav>

    <!-- Summary: one collapsible box per kind, closed until I tap it (the page stays short).
         Each kind only shows up if the lesson has some. -->
    <h2>Trong bài</h2>

    <details v-if="lesson.vocab.length > 0" class="fold">
      <summary>Từ vựng · {{ lesson.vocab.length }}</summary>
      <ul class="word-list">
        <li v-for="v in lesson.vocab" :key="v.jp">
          <div><span class="jp">{{ v.jp }}</span><span class="mean">{{ v.meaning }}</span></div>
          <SpeakButton :text="v.jp" />
        </li>
      </ul>
    </details>

    <details v-if="lesson.kanji.length > 0" class="fold">
      <summary>Kanji · {{ lesson.kanji.length }}</summary>
      <ul class="word-list inline">
        <li v-for="k in lesson.kanji" :key="k.char">
          <div><span class="jp">{{ k.char }}</span><span class="mean">{{ k.hanviet }}</span></div>
        </li>
      </ul>
    </details>

    <details v-if="lesson.grammar.length > 0" class="fold">
      <summary>Ngữ pháp · {{ lesson.grammar.length }}</summary>
      <ul class="word-list">
        <li v-for="g in lesson.grammar" :key="g.pattern">
          <div><span class="jp">{{ g.pattern }}</span><span class="mean">{{ g.meaning }}</span></div>
        </li>
      </ul>
    </details>

    <details v-if="lesson.sentences.length > 0" class="fold">
      <summary>Câu · {{ lesson.sentences.length }}</summary>
      <ul class="word-list">
        <li v-for="s in lesson.sentences" :key="s.jp">
          <div><span class="jp">{{ s.jp }}</span><span class="mean">{{ s.meaning }}</span></div>
          <SpeakButton :text="s.jp" />
        </li>
      </ul>
    </details>
  </template>
</template>
